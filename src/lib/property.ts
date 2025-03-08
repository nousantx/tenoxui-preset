import type {
  Property,
  PropertyParams,
  ValueParams,
  PropertyValue,
  ValuePropType
} from '@tenoxui/static'
import type { GetCSSProperty } from '@tenoxui/types'
import { is } from '@nousantx/someutils'

export const defaultProperty: Property = {
  columns: 'columns',
  align: 'verticalAlign',
  whitespace: 'whiteSpace',
  hypehns: 'hyphens',
  content: 'content',
  isolation: 'isolation',
  order: 'order',
  z: 'zIndex',
  opacity: {
    property: 'opacity',
    value: '{0}%'
  },
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
  'auto-rows': 'gridAutoRows',

  filter: 'filter',
  'backdrop-filter': 'backdropFilter'
}

export const sizingProperty: Property = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  inset: 'inset',
  gap: 'gap',
  'gap-x': 'columnGap',
  'gap-y': 'rowGap',
  'min-w': 'minWidth',
  'min-h': 'minHeight',
  'max-w': 'maxWidth',
  'max-h': 'maxHeight',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginInline',
  my: 'marginBlock',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  py: 'paddingBlock',
  px: 'paddingInline'
}

const createFilterFunction = (
  filterName: string,
  defaultUnit: string = '',
  transformValue: (value: string | undefined, unit: string) => string = (v, u) => `${v || ''}${u}`
): {
  property: PropertyValue
  value: ValuePropType
} => {
  return {
    property: filterName.startsWith('backdrop-') ? 'backdropFilter' : 'filter',
    value: ({ value = '', unit = '' }: ValueParams): string => {
      const finalValue = transformValue(value, unit || defaultUnit)
      return `${filterName.replace('backdrop-', '')}(${finalValue})`
    }
  }
}

const sizeValues: Record<string, string> = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px'
}

const dropShadowValues: Record<string, string> = {
  xs: '0 1px 1px var(--drop-shadow-color, rgb(0 0 0 / 0.05))',
  sm: '0 1px 2px var(--drop-shadow-color, rgb(0 0 0 / 0.15))',
  md: '0 3px 3px var(--drop-shadow-color, rgb(0 0 0 / 0.12))',
  lg: '0 4px 4px var(--drop-shadow-color, rgb(0 0 0 / 0.15))',
  xl: '0 9px 7px var(--drop-shadow-color, rgb(0 0 0 / 0.1))',
  '2xl': '0 25px 25px var(--drop-shadow-color, rgb(0 0 0 / 0.15))'
}

const createFilterUtilities = (): Property => {
  // Base filter definitions
  const filters: Property = {
    // Regular filters
    blur: {
      property: 'filter',
      value: ({ value = '', unit = '' }: ValueParams): string =>
        `blur(${sizeValues[`${value}${unit}`] || `${value}${unit}`})`
    },
    brightness: createFilterFunction('brightness', '%'),
    contrast: createFilterFunction('contrast', '%'),
    'drop-shadow': {
      property: ({
        value = '',
        unit = '',
        secondValue = '',
        secondUnit = '',
        key = ''
      }: PropertyParams): GetCSSProperty => {
        if (
          key === 'color' ||
          (typeof value === 'string' &&
            (value.startsWith('rgb') || value.startsWith('oklch')) &&
            !value.includes('/') &&
            value.endsWith(')'))
        ) {
          return `--drop-shadow-color: ${value.slice(0, -1)}${
            secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
          }` as GetCSSProperty
        }

        return `filter: drop-shadow(${dropShadowValues[value] || value})` as GetCSSProperty
      },
      value: null
    },
    grayscale: createFilterFunction('grayscale', '%', (value = '', unit): string => {
      if (!value) return '100%'
      if (is.number.test(`${value}${unit}`)) return `${value}%`
      return `${value}${unit}`
    }),
    'hue-rotate': createFilterFunction('hue-rotate', 'deg', (value = '', unit): string => {
      if (is.number.test(`${value}${unit}`)) return `${value}deg`
      return `${value}${unit}`
    }),
    invert: createFilterFunction('invert', '%', (value = '', unit): string => {
      if (!value) return '100%'
      if (is.number.test(`${value}${unit}`)) return `${value}%`
      return `${value}${unit}`
    }),
    sepia: createFilterFunction('sepia', '%', (value = '', unit): string => {
      if (!value) return '100%'
      if (is.number.test(`${value}${unit}`)) return `${value}%`
      return `${value}${unit}`
    }),
    saturate: createFilterFunction('saturate', '%', (value = '', unit): string => {
      if (is.number.test(`${value}${unit}`)) return `${value}%`
      return `${value}${unit}`
    })
  }

  // Generate backdrop filters manually by copying properties
  ;['brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'sepia', 'saturate'].forEach(
    (name) => {
      // Fix: Instead of spreading, explicitly create a new object with needed properties
      const sourceFilter = filters[name] as {
        property?: PropertyValue
        value?: ValuePropType
      }

      filters[`backdrop-${name}`] = {
        property: 'backdropFilter',
        value: sourceFilter.value
      }
    }
  )

  // Add backdrop-blur separately
  filters['backdrop-blur'] = {
    property: 'backdropFilter',
    value: ({ value = '', unit = '' }: ValueParams): string =>
      `blur(${sizeValues[`${value}${unit}`] || `${value}${unit}`})`
  }

  // Fix typo in property name: backdropOppacity -> backdrop-opacity
  filters['backdrop-opacity'] = createFilterFunction(
    'backdrop-opacity',
    '%',
    (value = '', unit): string => {
      if (is.number.test(`${value}${unit}`)) return `${value}%`
      return `${value}${unit}`
    }
  )

  return filters
}

export const filterProperties: Property = createFilterUtilities()
