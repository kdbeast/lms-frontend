import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

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

import { Button } from "@/components/ui/button";
import { Placeholder } from "@tiptap/extensions";

const CourseEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={16} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={16} />
        </Button>

        {/* Headings */}
        <Button
          size="icon"
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
          variant="ghost"
          className={active("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>

        {/* Italic */}
        <Button
          size="icon"
          variant="ghost"
          className={active("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </Button>

        {/* Bullet List */}
        <Button
          size="icon"
          variant="ghost"
          className={active("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </Button>

        {/* Ordered List */}
        <Button
          size="icon"
          variant="ghost"
          className={active("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </Button>

        {/* Quote */}
        <Button
          size="icon"
          variant="ghost"
          className={active("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </Button>

        {/* Code */}
        <Button
          size="icon"
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
        className="prose dark:prose-invert max-w-none min-h-[250px] p-4 focus:outline-none"
      />
    </div>
  );
};

export default CourseEditor;
