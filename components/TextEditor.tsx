import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { MenuBar, MenuItem } from './MenuBar'
import type { Extensions } from '@tiptap/react'
import { Spinner } from './Spinner'

interface TextEditorProps {
  className?: string,
  editable?: boolean,
  menuItems?: string[],
  menuJustify?: 'start' | 'center' | 'end',
}

export function TextEditor({className, editable = true, menuItems = [], menuJustify = 'start'}: TextEditorProps) {
 
  const extensions: Extensions = [
    StarterKit.configure({
        ...(true && { codeBlock: false }),
    }),
  ]
  extensions.push(
    Underline.configure({
      HTMLAttributes: {
        class: 'underline',
      },
    })
  )
  extensions.push(
    HorizontalRule.configure({
    HTMLAttributes: {
      class: 'border-0 border-t-2 my-6'
    }
  }))
  if (editable) {
    extensions.push(CharacterCount)
  }


  const editor = useEditor({
    onUpdate({editor}) {
      console.log(editor.getJSON())
    },
    onSelectionUpdate({ editor }) {
      console.log('selection change -> ', editor)
      // The selection has changed.
    },
    editable: editable,
    extensions: extensions,
    editorProps: {
      // editable: editable,
      attributes: {
        class: className ?? ''
      }
    },

    content: `<p>
    This is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor.
  </p>`,
  })
  function getMenuItems() {
    return []
  }
  return (
  /**
   * Undo
   * Redo
   * Bold
   * Italic
   * Underline
   * Strikethrough
   * Clear formating
   * Insert line
   * 
   * 
   * Font size
   * Font Family
   * Text color
   * Tables
   * spoiler
   * quotes
   * Image
   * Align Left
   * Align center
   * Align right
   * justofy
   * 
   * full screen
   * code (????)
   * 
   * // Para comentários
   * bullet list
   * numered list
   * checked list
   * link
   */
    // <div className="bg-gray-2 border-[0.125rem] rounded-xl text-black flex flex-col max-h-96 overflow-hidden">
    <div className="relative">
      {!editor && <Spinner />}
      {editor && menuItems.length > 0 && <MenuBar editor={editor} menuItems={menuItems} justify={menuJustify}/>}
      <EditorContent
        // type='text'
        editor={editor} 
      />
      {editor && editable && 
        <div className="absolute bottom-1 right-1.5 text-sm dark:font-light text-gray-5 dark:text-gray-12">
          {editor?.storage.characterCount.words()} words / {editor?.storage.characterCount.characters()} characters 
        </div>
      }
    </div>
  )
}