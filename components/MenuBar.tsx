import { Editor } from '@tiptap/react'
import React, { Fragment } from 'react'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import { MenuItem } from './MenuItem'
import { Icon, TextB, TextItalic, TextStrikethrough, Code,
        HighlighterCircle, Paragraph,
        TextHOne, TextHTwo, TextHThree, TextHFour, TextHFive,TextHSix,
        ListBullets, ListNumbers, ListChecks, CodeBlock,
        Quotes, Minus, ArrowLineDownLeft, TextT,
        TextAlignLeft, TextAlignRight, TextAlignCenter, TextAlignJustify,
        ArrowCounterClockwise, ArrowClockwise, TextUnderline, Image } from '@phosphor-icons/react'
import { MenuSelect } from './MenuSelect'
import { inter, montserrat, roboto } from '@/app/fonts' 
import { MenuColor } from './MenuColor'
import colors from 'tailwindcss/colors'
import { MenuImage } from './MenuImage'

let index = -1
const allowedColors: Option[] = [] 
const blackNWhite:Option[] = []
Object.entries(colors).forEach(c => {
  index++;
  if (index > 4 && index < 27) {
    if (typeof c[1] === 'object') {
      Object.entries(c[1]).forEach(v => {
        allowedColors.push({
            name: `${c[0]}-${v[0]}`,
            val : v[1] as string
        })
      })
    } else {
      allowedColors.push({
        name: c[0],
        val: c[1]
      })
    }
  } else if (index > 2) {
    blackNWhite.push({
      name: c[0],
      val: c[1]
    })
  }
})
allowedColors.push(blackNWhite[0])
allowedColors.push(blackNWhite[1])


const fontOptions = [
  {
    name: "Roboto",
    val: roboto.style.fontFamily
  },
  {
    name: "Inter",
    val: inter.style.fontFamily
  },
  {
    name: "Montserrat",
    val: montserrat.style.fontFamily
  },
  {
    name: "Comic Sans MS, Comic Sans",
    val: "Comic Sans MS, Comic Sans"
  },
  {
    name: "serif",
    val: "serif"
  },
  {
    name: "monospace",
    val: "monospace"
  },
  {
    name: "cursive",
    val: "cursive"
  }
]

// 8,9,10 ... 46, 47, 48
const pxValues = Array.from({length: 41}, (_, index) => index + 8);
const conversionTable = {
  'px': 1,
  'rem': 16
}; // unit conversion table

const fontSizesOptions = pxValues.map(value => {
  return {
    name: `${value}px`,
    val: `${(value / conversionTable['rem']).toFixed(2)}rem`
  }
});

interface MenuBarProps {
  editor: Editor,
  menuItems: string[],
  justify: 'start' | 'center' | 'end',
}

export interface Option {
  name: string,
  val: string
}

export interface MenuItem {
  name: string,
  icon?: React.ReactNode,
  title?: string,
  action?: () => void
  setAction?: (param: string) => boolean
  isActive?: null | (() => boolean)
  isSettedActive?: null | ((param: string) => boolean)
  type?: string,
  options?: Option[],
  defaultValue?: string
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
      icon: <TextHThree className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 3',
      name: 'heading_3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <TextHFour className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 4',
      name: 'heading_4',
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive('heading', { level: 4 }),
    },
    {
      icon: <TextHFive className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 5',
      name: 'heading_5',
      action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: () => editor.isActive('heading', { level: 5 }),
    },
    {
      icon: <TextHSix className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Heading 6',
      name: 'heading_6',
      action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: () => editor.isActive('heading', { level: 6 }),
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
    {
      icon: <TextAlignLeft className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Align Left',
      name: 'align_left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <TextAlignRight className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Align Right',
      name: 'align_right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <TextAlignCenter className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Align Center',
      name: 'align_center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <TextAlignJustify className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Justify',
      name: 'justify',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: () => editor.isActive({ textAlign: 'justify' }),
    },
    {
      type: 'image',
      icon: <Image className="w-4 h-4 md:w-5 md:h-5"/>,
      title: 'Image',
      name: 'image',
      setAction: (src) => editor.chain().focus().setImage({src: src}).run()
    },
    {
      // icon: <TextUnderline className="w-4 h-4 md:w-5 md:h-5"/>,
      type: 'selector',
      title: 'Font Family',
      name: 'font_family',
      setAction: (font: string) => editor.commands.setFontFamily(font),
      isSettedActive: (font: string) => editor.isActive('textStyle', { fontFamily: font }),
      options: fontOptions,
      defaultValue: inter.style.fontFamily
    },
    {
      // icon: <TextUnderline className="w-4 h-4 md:w-5 md:h-5"/>,
      type: 'selector',
      title: 'Font Size',
      name: 'font_size',
      setAction: (size: string) => editor.commands.setFontSize(size),
      isSettedActive: (size: string) => editor.isActive('textStyle', { fontSize: size }),
      options: fontSizesOptions,
      defaultValue: '1.00rem'
    },
    {
      type: 'color',
      name: 'text_color',
      setAction: (color: string) => editor.chain().focus().setColor(color).run(),
      isSettedActive: (color: string) => editor.isActive('textStyle', {color: color}), 
      options: allowedColors
    }
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

  function getRenderItem(item: MenuItem) {
    if (item.type === 'divider') {
      return <div className="bg-gray-1 dark:bg-gray-15 !bg-opacity-10 h-[1.25rem] ml-2 mr-3 w-0.5" />;
    } else if (item.type === 'selector') {
      return <MenuSelect {...item} />
    } else if (item.type === 'color') {
      return <MenuColor  {...item}/>
    } else if (item.type === 'image') {
      return <MenuImage {...item} />
    } else {
      return <MenuItem {...item} />
    }
  }
  return (
    <div className={`bg-white text-gray-2 dark:!bg-gray-2 dark:text-gray-14 rounded-t-xl flex flex-wrap py-1 px-3 gap-y-2 gap-x-0.5 md:gap-1 md:gap-x-1 items-center justify-${justify}`}>
      {menuItemsToDisplay?.map((item, index) => (
        <Fragment key={index}>
          {getRenderItem(item)}
        </Fragment>
      ))}
    </div>
  )
}