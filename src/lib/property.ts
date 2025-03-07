import type { Property } from '@tenoxui/types'

export const defaultProperty: Property = {
  columns: 'columns',
  align: 'verticalAlign',
  whitespace: 'whiteSpace',
  hypehns: 'hyphens',
  content: 'content',
  isolation: 'isolation',
  order: 'order',
  'outline-offset': {
    property: 'outlineOffset',
    value: '{0}px'
  },
  'grid-cols': {
    property: 'gridTemplateColumns',
    value: 'repeat({0}, minmax(0, 1fr))'
  },
  'col-span': {
    property: 'gridColumn',
    value: 'span {0} / span {0}'
  },
  col: 'gridColumn',
  'col-start': 'gridColumnStart',
  'col-end': 'gridColumnEnd',
  // rows
  'grid-rows': {
    property: 'gridTemplateRows',
    value: 'repeat({0}, minmax(0, 1fr))'
  },
  'row-span': {
    property: 'gridRow',
    value: 'span {0} / span {0}'
  },
  row: 'gridRow',
  'row-start': 'gridRowStart',
  'row-end': 'gridRowEnd',
  // grid auto
  'grid-flow': 'gridAutoFlow',
  'auto-cols': 'gridAutoColumns',
  'auto-rows': 'gridAutoRows'
}

export const sizingProperty: Property = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  inset: 'inset',
  gap: 'gap',
  'gap-x': 'columnGap',
  'gap-y': 'rowGap'
}
