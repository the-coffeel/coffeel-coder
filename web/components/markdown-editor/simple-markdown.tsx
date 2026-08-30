'use client';
import { cn } from '@/utils';
import useDebounce from '@/app/hooks/use-debounce';
import { Eye, Edit } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { MarkdownContent } from '../MarkdownContent';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleMarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your markdown here...',
}: SimpleMarkdownEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const debounceValue = useDebounce(value, 100);

  return (
    <div className="bg-background border flex flex-col rounded-lg overflow-hidden h-[250px]">
      <div className="border-b p-2 flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setIsPreviewMode(!isPreviewMode)}>
          {isPreviewMode ? (
            <>
              <Edit className="w-4 h-4" />
              Edit
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      <div className="flex grow overflow-hidden bg-card">
        {!isPreviewMode ? (
          <textarea
            className={cn(
              'w-full h-full p-4 resize-none outline-none border-none',
              'bg-transparent text-foreground',
              'placeholder:text-muted-foreground'
            )}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <div className="w-full h-full p-4 -mt-4 overflow-y-auto markdown">
            <div className="max-w-none">
              <MarkdownContent>{debounceValue}</MarkdownContent>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
