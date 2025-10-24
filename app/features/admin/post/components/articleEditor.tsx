import { useEffect, useRef, useState } from 'react';
import type ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../styles.css';

type ArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const ReactQuillComponent = useRef<typeof ReactQuill | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined') {
        const { default: ReactQuillDefault } = await import('react-quill-new');
        ReactQuillComponent.current = ReactQuillDefault;
        requestAnimationFrame(() => {
          setIsReady(true);
        });
      }
    };

    loadQuill();
  }, []);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', { color: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
    keyboard: {
      bindings: {
        linebreak: {
          key: 13,
          shiftKey: false,
          handler: function(this: any, range: any) {
            this.quill.insertText(range.index, '\n');
            this.quill.setSelection(range.index + 1);
            return false;
          }
        }
      }
    }
  };

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'color',
  ];

  if (!isReady || !ReactQuillComponent.current) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">載入編輯器中...</p>
      </div>
    );
  }

  const Quill = ReactQuillComponent.current;

  return (
    <div className="w-full h-[calc(100%-16px)]">
      <div className="prose prose-lg max-w-none h-[calc(100%-16px)]">
        <Quill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="h-[500px] lg:h-full bg-white rounded-lg"
        />
      </div>
    </div>
  );
}
