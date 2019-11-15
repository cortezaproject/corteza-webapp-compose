import {
  AlignmentBlock,
  TextColor,
  TextBackground,
} from '../extensions'

import {
  Blockquote,
  CodeBlock,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  HardBreak,
  ListItem,
  TodoItem,
  History,
} from 'tiptap-extensions'

// Defines a set of formats that our document supports
export const getFormats = () => [
  new Bold(),
  new Italic(),
  new Underline(),
  new Strike(),
  new Blockquote(),
  new CodeBlock(),
  new OrderedList(),
  new BulletList(),
  new TodoList(),
  new Heading({ levels: [ 1, 2, 3 ] }),
  new AlignmentBlock({ alignments: [ 'left', 'right', 'center', 'justify' ] }),
  new Link(),
  new HorizontalRule(),
  new HardBreak(),
  new ListItem(),
  new TodoItem(),
  new History(),
  new TextBackground(),
  new TextColor(),
]

// Defines the structure of our editor toolbar
export const getToolbar = () => [
  { type: 'bold', icon: 'bold' },
  { type: 'italic', icon: 'italic' },
  { type: 'underline', icon: 'underline' },
  { type: 'strike', icon: 'strikethrough' },
  { type: 'color', colorPicker: true },
  { type: 'background', colorPicker: true },
  { type: 'blockquote', icon: 'quote-right' },
  { type: 'code_block', icon: 'code' },
  { type: 'heading', label: 'H1', attrs: { level: 1 } },
  { type: 'heading', label: 'H2', attrs: { level: 2 } },
  { type: 'heading', label: 'H3', attrs: { level: 3 } },
  { type: 'ordered_list', icon: 'list-ol' },
  { type: 'bullet_list', icon: 'list-ul' },
  { type: 'todo_list', icon: 'tasks' },
  {
    type: 'paragraph',
    icon: 'align-left',
    variants: [
      { variant: 'left', icon: 'align-left', attrs: { alignment: 'left' } },
      { variant: 'center', icon: 'align-center', attrs: { alignment: 'center' } },
      { variant: 'right', icon: 'align-right', attrs: { alignment: 'right' } },
      { variant: 'justify', icon: 'align-justify', attrs: { alignment: 'justify' } },
    ],
  },
  { type: 'link', icon: 'link', attrs: { href: null } },
  // @note There is no free FA icon for this
  { type: 'horizontal_rule', label: '__' },
]
