import type { Values } from '@tenoxui/types'

export const values: Values = {
  px: '1px',
  fr: 'minmax(0, 1fr)',
  full: '100%',
  half: '50%',
  vh: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  vw: '100vw',
  svw: '100svw',
  lvw: '100lvw',
  dvw: '100dvw',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
  order: {
    first: 'calc(-infinity)',
    last: 'calc(infinity)',
    none: '0'
  },
  'grid-flow': {
    'row-dense': 'row dense',
    'col-dense': 'column dense'
  }
}
