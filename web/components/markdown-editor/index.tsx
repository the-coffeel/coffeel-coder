'use client';
import useDebounce from '@/app/hooks/use-debounce';
import { cn } from '@/utils';
import { getMarkdownImageUrls } from '@/utils/markdown';
import { markdown } from '@codemirror/lang-markdown';
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Fullscreen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { MarkdownContent } from '../MarkdownContent';
import StoragePage from '../storage/Storage-page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const debounceValue = useDebounce(value, 100);
  const { resolvedTheme } = useTheme();

  const handleImageSelect = (url: string) => {
    const view = editorRef.current?.view;
    if (view) {
      const selection = view.state.selection.main;
      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: `\n![image](${url})\n`,
        },
      });
      view.focus();
    }
    setDialogOpen(false);
  };

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
      className={cn('bg-background border flex flex-col rounded-lg overflow-hidden', {
        fixed: fullscreen,
        'top-0 left-0 w-full h-full z-50': fullscreen,
        'h-screen': !fullscreen,
      })}
    >
      <div className="border-b p-2 flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={e => {
            setFullscreen(!fullscreen);

            // Use setTimeout to focus after React has updated the DOM
            setTimeout(() => {
              console.log('Focusing editor');
              if (editorRef.current) {
                editorRef.current.view?.focus();
              }
            }, 50);

            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Fullscreen className="w-4 h-4 mr-2" />
          {fullscreen ? 'Exit Preview' : 'Preview'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={e => {
            setDialogOpen(true);
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Image
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full !max-w-3xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>File Manager</DialogTitle>
          </DialogHeader>
          <StoragePage
            pickerMode
            initialTab="Photos"
            onSelect={handleImageSelect}
          />
        </DialogContent>
      </Dialog>
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
        {fullscreen && (
          <div className="h-full p-2 overflow-x-hidden overflow-y-auto w-1/2 border-l markdown">
            <div className="max-w-4xl mx-auto">
              <MarkdownContent>{debounceValue}</MarkdownContent>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
