import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url, public_id } = await req.json();

    if (!url && !public_id) {
      return NextResponse.json({ error: 'Must provide url or public_id' }, { status: 400 });
    }

    let targetPublicId = public_id;

    if (!targetPublicId) {
      // Find the media record to get the public_id
      const { data: mediaRecord, error: dbError } = await supabase
        .from('media')
        .select('cloudinary_public_id, id')
        .eq('cloudinary_secure_url', url)
        .eq('user_id', user.id)
        .single();

      if (dbError || !mediaRecord) {
        return NextResponse.json({ error: 'Media not found or unauthorized' }, { status: 404 });
      }
      targetPublicId = mediaRecord.cloudinary_public_id;
      
      // Delete from media table
      await supabase.from('media').delete().eq('id', mediaRecord.id);
    } else {
      // If public_id is provided directly, still verify ownership
      const { data: mediaRecord } = await supabase
        .from('media')
        .select('id')
        .eq('cloudinary_public_id', targetPublicId)
        .eq('user_id', user.id)
        .single();
        
      if (mediaRecord) {
        await supabase.from('media').delete().eq('id', mediaRecord.id);
      }
    }

    // Delete from Cloudinary
    if (targetPublicId) {
      await cloudinary.uploader.destroy(targetPublicId);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
