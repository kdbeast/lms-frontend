// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu, BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";

const RichTextEditor = ({input, setInput}) => {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: input, // initial content
  });

  editor.on("update", () => {
    setInput({ ...input, description: editor.getHTML() });
  });

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  );
};

export default RichTextEditor;
