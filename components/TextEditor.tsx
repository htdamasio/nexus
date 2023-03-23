import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Blockquote from '@tiptap/extension-blockquote'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'
import { MenuBar, MenuItem } from './MenuBar'
import type { Extensions } from '@tiptap/react'
import { Spinner } from './Spinner'
import { inter } from '@/app/fonts'
// import '../styles/textEditor.css'

interface TextEditorProps {
  className?: string,
  editable?: boolean,
  menuItems?: string[],
  menuJustify?: 'start' | 'center' | 'end',
  onChange?: (html: string) => void;
  content?: string;
}

export function TextEditor({className, editable = true, menuItems = [], menuJustify = 'start', content = '', onChange}: TextEditorProps) {
 
  const extensions: Extensions = [
    StarterKit.configure({
      horizontalRule: false,
      paragraph: false,
      blockquote: false,
      heading: false,
      // document: false 
    })
  ]
  // extensions.push(
  //   Document.extend({
  //     content: 'heading block*',
  //   })
  // )
  // extensions.push(
  //   Placeholder.configure({
  //     placeholder: ({ node }) => {
  //       if (node.type.name === 'heading') {
  //         return 'What’s the title?'
  //       }

  //       return 'Can you add some further context?'
  //     },
  //   })
  // )

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
        class: 'border-0 border-t-[1px] border-gray-1 dark:border-gray-15 mb-6'
      }
    })
  )
  extensions.push(
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-4'
      }
    })
  )
  extensions.push(
    Blockquote.configure({
      HTMLAttributes: {
        class: 'pl-4 border-l-[2px] border-gray-1 dark:border-gray-14 !border-opacity-10 mx-8 my-3',
      },
    })
  )
  extensions.push(
    FontFamily.configure({
      types: ['textStyle'],
    })
  )
  extensions.push(
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
  )
  extensions.push(
    Color.configure({
      types: ['textStyle'],
    })
  )
  extensions.push(
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'right', 'center', 'justify'],
      defaultAlignment: 'left',
    })
  )
  extensions.push(
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'w-full',
      },
    })
  )

  extensions.push(TextStyle)

  if (editable) {
    extensions.push(CharacterCount.configure({
      mode: 'textSize'
    }))
  }


  const editor = useEditor({
    onCreate({editor}) {
      editor.commands.setFontFamily(inter.style.fontFamily)
      editor.commands.setFontSize('1rem')
    },
    onUpdate({editor}) {
      // console.log(editor.getJSON())
      onChange && onChange(editor.getHTML());
    },
    onSelectionUpdate({ editor }) {
      // console.log('selection change -> ', editor)
      // The selection has changed.
    },
    editable: editable,
    extensions: [...extensions, FontSize],
    editorProps: {
      // editable: editable,
      attributes: {
        class: className ?? ''
      }
    },

    content: content,
  })
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
          {/* {console.log('storage', editor?.storage)} */}
        </div>
      }
    </div>
  )
}