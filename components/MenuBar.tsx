import { Editor } from '@tiptap/react'
import React, { Fragment } from 'react'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import { MenuItem } from './MenuItem'
import { Icon, TextB, TextItalic, TextStrikethrough, Code,
        HighlighterCircle, TextHOne, TextHTwo, Paragraph,
        ListBullets, ListNumbers, ListChecks, CodeBlock,
        Quotes, Minus, ArrowLineDownLeft, TextT,
        ArrowCounterClockwise, ArrowClockwise, TextUnderline } from '@phosphor-icons/react'


interface MenuBarProps {
  editor: Editor,
  menuItems: string[],
  justify: 'start' | 'center' | 'end',
}

export interface MenuItem {
  name: string,
  icon?: React.ReactNode,
  title?: string,
  action?: () => void
  isActive?: null | (() => boolean)
  type?: string
}

export function MenuBar({ editor, menuItems, justify }: MenuBarProps) {
  const items: MenuItem[] = [
    {
      icon: <TextB weight='bold' className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Bold',
      name: 'bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: <TextItalic className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Italic',
      name: 'italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: <TextStrikethrough className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Strike',
      name: 'strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: <Code className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Code',
      name: 'code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      icon: <HighlighterCircle className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Highlight',
      name: 'highlight',
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive('highlight'),
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      icon: <TextHOne className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 1',
      name: 'heading_1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <TextHTwo className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 2',
      name: 'heading_2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Paragraph className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Paragraph',
      name: 'paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive('paragraph'),
    },
    {
      icon: <ListBullets className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Bullet List',
      name: 'bullet_list',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: <ListNumbers className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Ordered List',
      name: 'ordered_list',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: <ListChecks className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Task List',
      name: 'task_list',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive('taskList'),
    },
    {
      icon: <CodeBlock className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Code Block',
      name: 'code_block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      icon: <Quotes className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Blockquote',
      name: 'blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: <Minus className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Horizontal Rule',
      name: 'horizontal_rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      icon: <ArrowLineDownLeft className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Hard Break',
      name: 'hard_break',
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: <TextT className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Clear Format',
      name: 'clear_format',
      action: () => editor.chain().focus().clearNodes().unsetAllMarks()
        .run(),
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      icon: <ArrowCounterClockwise className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Undo',
      name: 'undo',
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <ArrowClockwise className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Redo',
      name: 'redo',
      action: () => editor.chain().focus().redo().run(),
    },
    {
      icon: <TextUnderline className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Underline',
      name: 'underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
  ]


  const menuItemsToDisplay: MenuItem[] = menuItems.map(i => {
    var item: MenuItem = {name: i};

    if (i === 'divider') {
      item.type = 'divider'
    } else {
      const foundItem = items.find(mi => mi.name === i);
      if (foundItem) {
        item = foundItem;
      }
    }
    return item
  })
  return (
    <div className={`bg-white text-gray-2 dark:!bg-gray-2 dark:text-gray-14 rounded-t-xl flex flex-wrap py-1 px-3 gap-x-0.5 md:gap-x-1 items-center justify-${justify}`}>
      {menuItemsToDisplay?.map((item, index) => (
        <Fragment key={index}>
          {item.type === 'divider' ? <div className="bg-gray-1 dark:bg-gray-15 !bg-opacity-10 h-[1.25rem] ml-2 mr-3 w-0.5" /> : <MenuItem {...item} />}
        </Fragment>
      ))}
    </div>
  )
}