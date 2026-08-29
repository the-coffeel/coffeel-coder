import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  // 1. Auth — get the current user from the session
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudinary
    type CloudinaryResult = {
      public_id: string;
      secure_url: string;
      format: string;
      bytes: number;
      width?: number;
      height?: number;
      resource_type: string;
      folder?: string;
      original_filename?: string;
    };

    const cloudinaryResult = await new Promise<CloudinaryResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'file-manager',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryResult);
          }
        }
      );
      stream.end(buffer);
    });

    // 4. Save to Supabase media table
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        user_id: user.id,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_secure_url: cloudinaryResult.secure_url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        format: cloudinaryResult.format,
        width: cloudinaryResult.width ?? null,
        height: cloudinaryResult.height ?? null,
        folder: cloudinaryResult.folder ?? 'file-manager',
      })
      .select()
      .single();

    if (dbError) {
      // Cloudinary upload succeeded but DB insert failed — still return useful info
      console.error('DB insert error:', dbError);
      return NextResponse.json(
        { error: 'Saved to Cloudinary but failed to record in database', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { ...cloudinaryResult, ...mediaRecord } });
  } catch (err: unknown) {
    // Properly extract error details from Cloudinary error objects
    let message = 'Unknown error';
    let httpCode: number | undefined;

    if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      message = (e.message as string) ?? (e.error as string) ?? JSON.stringify(e);
      httpCode = e.http_code as number | undefined;
    } else if (typeof err === 'string') {
      message = err;
    }

    console.error('Cloudinary upload error:', err);
    return NextResponse.json(
      { error: 'Upload failed', details: message },
      { status: httpCode ?? 500 }
    );
  }
}
