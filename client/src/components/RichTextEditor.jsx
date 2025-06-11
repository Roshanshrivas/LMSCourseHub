import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import React from 'react'

const RichTextEditor = ({input, setInput}) => {

  const handleChange = (content) => {
    setInput({...input, description:content})
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: input.description,
    onUpdate: ({ editor }) => {
    handleChange(editor.getHTML());
  },
  })

  if (!editor) return null

  const buttonClass = 'px-2 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="p-4 border rounded shadow-sm max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass}>
          Underline
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass}>
          H3
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass}>
          Bullet List
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass}>
          Numbered List
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={buttonClass}>
          Clear
        </button>
      </div>

      <EditorContent editor={editor} className="border p-3 min-h-[150px] rounded" />
    </div>
  )
}

export default RichTextEditor