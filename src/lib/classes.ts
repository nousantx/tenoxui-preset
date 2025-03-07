import type { Classes } from '@tenoxui/types'
import { merge, transformClasses } from '@nousantx/someutils'

export const classes: Classes = merge(
  transformClasses({
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    'outline-hidden': {
      outline: '2px solid transparent',
      outlineOffset: '2px'
    }
  }),
  {
    fontStyle: {
      italic: 'italic',
      'not-italic': 'normal'
    },
    textDecorationLine: {
      underline: 'underline',
      overline: 'overline',
      'line-through': 'line-through',
      'no-underline': 'none'
    },
    textDecorationStyle: {
      'decoration-solid': 'solid',
      'decoration-double': 'double',
      'decoration-dotted': 'dotted',
      'decoration-dashed': 'dashed',
      'decoration-wavy': 'wavy'
    },
    textDecorationThickness: {
      'decoration-thickness-from-font': 'from-font',
      'decoration-thickness-auto': 'auto'
    },
    textUnderlineOffset: {
      'underline-offsite-auto': 'auto'
    },
    textTransform: {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      'normal-case': 'none'
    },
    display: {
      inline: 'inline',
      block: 'block',
      'inline-block': 'inline-block',
      'flow-root': 'flow-root',
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      'inline-grid': 'inline-grid',
      contents: 'contents',
      table: 'table',
      'inline-table': 'inline-table',
      'table-caption': 'table-caption',
      'table-cell': 'table-cell',
      'table-column': 'table-column',
      'table-column-group': 'table-column-group',
      'table-footer-group': 'table-footer-group',
      'table-header-group': 'table-header-group',
      'table-row-group': 'table-row-group',
      'table-row': 'table-row',
      'list-item': 'list-item',
      hidden: 'none'
    },
    position: {
      static: 'static',
      fixed: 'fixed',
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky'
    }
  }
)
