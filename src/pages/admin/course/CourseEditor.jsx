import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";
import { createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import { Placeholder } from "@tiptap/extensions";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

const lowlight = createLowlight();

const CourseEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: "Write your course description here...",
      }),
    ],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const active = (name, options = {}) =>
    editor.isActive(name, options) ? "bg-muted" : "";

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        {/* Undo Redo */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={16} />
        </Button>

        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={16} />
        </Button>

        {/* Headings */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={16} />
        </Button>

        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </Button>

        {/* Bold */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>

        {/* Italic */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </Button>

        {/* Bullet List */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </Button>

        {/* Ordered List */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </Button>

        {/* Quote */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </Button>

        {/* Code */}
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className={active("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={16} />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="
          prose dark:prose-invert max-w-none p-4
          [&_.ProseMirror]:min-h-[200px]
          [&_.ProseMirror]:max-h-[250px]
          [&_.ProseMirror]:overflow-y-auto
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:leading-relaxed
          [&_.ProseMirror]:text-base
  "
      />
    </div>
  );
};

export default CourseEditor;
