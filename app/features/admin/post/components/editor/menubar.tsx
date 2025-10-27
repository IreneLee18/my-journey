import { Editor, useEditorState } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function EditorMenubar({ editor }: { editor: Editor }) {
  const { theme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isUnderline: ctx.editor.isActive('underline'),
        isStrike: ctx.editor.isActive('strike'),
        isColor: ctx.editor.isActive('color'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isBulletList: ctx.editor.isActive('bulletList'),
      };
    },
  });

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

  const ColorPicker = () => {
    return (
      <div className="flex flex-wrap gap-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-lg absolute z-50 w-52">
        {colors.map((color) => {
          return (
            <Button
              type="button"
              variant="iconOutline"
              size="icon-sm"
              key={color}
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                setShowColorPicker(false);
              }}
              style={{ backgroundColor: color }}
              title={color}
            />
          );
        })}
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            editor.chain().focus().unsetColor().run();
            setShowColorPicker(false);
          }}
          title="清除顏色"
        >
          清除顏色
        </Button>
      </div>
    );
  };

  const getColorLabel = (color: string) => {
    let defaultColor = '#000000';
    if (color === defaultColor && theme === 'dark') {
      return <span style={{ color: '#ffffff' }}>A</span>;
    }
    return <span style={{ color: color }}>A</span>;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="tiptap-toolbar flex flex-wrap gap-1 py-1 px-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <EditorToolbarButton
          state={editorState.isBold}
          label={<strong>B</strong>}
          title="粗體"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        <EditorToolbarButton
          state={editorState.isItalic}
          label={<em>I</em>}
          title="斜體"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />

        <EditorToolbarButton
          state={editorState.isUnderline}
          label={<u>U</u>}
          title="底線"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <EditorToolbarButton
          state={editorState.isStrike}
          label={<s>S</s>}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="刪除線"
        />

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <div className="relative color-picker-container">
          <EditorToolbarButton
            state={editorState.isColor}
            label={getColorLabel(editor.getAttributes('textStyle').color)}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="文字顏色"
          />
          {showColorPicker && (
            <div className="absolute top-full mt-1 left-0">
              <ColorPicker />
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <EditorToolbarButton
          state={editorState.isOrderedList}
          label={<ol>1.</ol>}
          title="編號清單"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <EditorToolbarButton
          state={editorState.isBulletList}
          label={<ul>•</ul>}
          title="項目清單"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </div>
    </>
  );
}

export function EditorToolbarButton({
  state,
  label,
  title,
  onClick,
}: {
  state: boolean;
  label: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      title={title}
      className={state ? 'bg-gray-200 dark:bg-gray-700' : ''}
    >
      {label}
    </Button>
  );
}
