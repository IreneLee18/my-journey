import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect, useState } from 'react';
import './styles.css';
import { EditorMenubar } from './menubar';

type ArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-lg max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // 點擊外部關閉顏色選擇器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColorPicker && !target.closest('.color-picker-container')) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      return document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">載入編輯器中...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100%-16px)]">
      <div className="h-[calc(100%-16px)] flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
        <EditorMenubar editor={editor} />

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  );
}
