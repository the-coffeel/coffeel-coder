'use client';
import useDebounce from '@/app/hooks/use-debounce';
import { cn } from '@/utils';
import { getMarkdownImageUrls } from '@/utils/markdown';
import { markdown } from '@codemirror/lang-markdown';
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const debounceValue = useDebounce(value, 100);
  const { resolvedTheme } = useTheme();

  const extensions = useMemo(() => {
    const baseExtensions = [markdown(), EditorView.lineWrapping];

    if (resolvedTheme === 'dark') {
      // Custom theme for black background in dark mode
      const darkTheme = EditorView.theme(
        {
          '&': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
          '.cm-content': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
          '.cm-selectionBackground': {
            backgroundColor: '#00bfa640',
          },
        },
        { dark: true }
      );

      baseExtensions.push(darkTheme);
    }

    return baseExtensions;
  }, [resolvedTheme]);

  useEffect(() => {
    getMarkdownImageUrls(debounceValue).then(console.log);
  }, [debounceValue]);

  return (
    <div
      className={cn('bg-background border flex flex-col rounded-lg overflow-hidden h-72')}
    >
      <div className="border-b p-2 flex gap-2">
        Description
      </div>
      <div className="flex grow overflow-hidden bg-card">
        <CodeMirror
          ref={editorRef}
          className="text-base grow p-2 bg-inherit w-1/2"
          height="100%"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            drawSelection: false,
          }}
          theme={resolvedTheme === 'dark' ? undefined : 'light'}
          extensions={extensions}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
