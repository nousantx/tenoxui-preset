import type { Config, PropertyParams, Property } from '@tenoxui/static'
import type { GetCSSProperty } from '@tenoxui/types'
import { is, merge } from '@nousantx/someutils'
import { colorLib } from './lib/color'
import { sizingValues } from './lib/sizing'
import { defaultProperty, sizingProperty as sizingPropertyMap } from './lib/property'
import { classes } from './lib/classes'
export { is, merge } from '@nousantx/someutils'

export function createConfig({ sizing = 0.25 }): Config {
  const computeSizingValue = ({ value = '', unit = '' }) => {
    return is.number.test(value + unit)
      ? sizing * Number(value) + (value !== '0' ? 'rem' : '')
      : value + unit
  }

  const sizingProperties = Object.fromEntries(
    Object.entries(sizingPropertyMap).map(([key, property]) => [
      key,
      { property, value: computeSizingValue }
    ])
  )

  const createSizingProperty = (
    base: GetCSSProperty,
    keys: Record<string, GetCSSProperty>,
    values?: Record<string, string>
  ): Property => ({
    property: ({ key = '' }) => (key && key in keys ? keys[key as string] : base) as GetCSSProperty,
    value: ({ value = '', unit = '' }) => {
      return (
        values && values[(value + unit) as string]
          ? values[(value + unit) as string]
          : value && is.number.test(value + unit)
            ? sizing * Number(value) + 'rem'
            : value + unit
      ) as GetCSSProperty
    }
  })

  return {
    apply: {
      '@property --tui-shadow': "[syntax]-['*'] [inherits]-false [initial-value]-[0_0_#0000]",
      '@property --tui-inset-shadow': "[syntax]-['*'] [inherits]-false [initial-value]-[0_0_#0000]",
      '@property --tui-inset-shadow-color': "[syntax]-['*'] [inherits]-false",
      '@property --tui-shadow-color': "[syntax]-['*'] [inherits]-false",
      // ring
      '@property --tui-ring-shadow': "[syntax]-['*'] [inherits]-false [initial-value]-[0_0_#0000]",
      '@property --tui-inset-ring-shadow':
        "[syntax]-['*'] [inherits]-false [initial-value]-[0_0_#0000]",
      '@property --tui-inset-ring-color': "[syntax]-['*'] [inherits]-false",
      '@property --tui-ring-color': "[syntax]-['*'] [inherits]-false",
      '@property --tui-ring-inset': "[syntax]-['*'] [inherits]-false",
      '@property --tui-ring-offset-width':
        "[syntax]-['<length>'] [inherits]-false [initial-value]-0px",
      '@property --tui-ring-offset-color': "[syntax]-['*'] [inherits]-false [initial-value]-#fff",
      '@property --tui-ring-offset-shadow':
        "[syntax]-['*'] [inherits]-false [initial-value]-[0_0_#0000]"
    },
    property: {
      ...defaultProperty,
      ...sizingProperties,
      w: createSizingProperty(
        'width',
        {
          min: 'minWidth',
          max: 'maxWidth'
        },
        { ...sizingValues, screen: '100vw' }
      ),
      h: createSizingProperty(
        'height',
        {
          min: 'minHeight',
          max: 'maxHeight'
        },
        { ...sizingValues, screen: '100vh' }
      ),
      p: createSizingProperty('padding', {
        x: 'paddingInline',
        y: 'paddingBlock',
        t: 'paddingTop',
        r: 'paddingRight',
        b: 'paddingBottom',
        l: 'paddingLeft'
      }),
      m: createSizingProperty('margin', {
        x: 'marginInline',
        y: 'marginBlock',
        t: 'marginTop',
        r: 'marginRight',
        b: 'marginBottom',
        l: 'marginLeft'
      }),
      /* background */
      'bg-clip': {
        property: 'backgroundClip',
        value: ({ value }) => (value !== 'text' ? value + '-box' : value)
      },
      'bg-origin': {
        property: 'backgroundOrigin',
        value: ({ value }) => (value !== 'text' ? value + '-box' : value)
      },
      bg: {
        property: ({ key, value = '', unit = '' }: PropertyParams) => {
          const keys: Record<string, GetCSSProperty> = {
            attachment: 'backgroundAttachment',
            color: 'backgroundColor',
            image: 'backgroundImage',
            clip: 'backgroundClip',
            position: 'backgroundPosition',
            repeat: 'backgroundRepeat',
            size: 'backgroundSize',
            origin: 'backgroundOrigin'
          }

          if (
            is.color.test(value) ||
            ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
          ) {
            return keys.color
          } else if (['fixed', 'scroll', 'local'].includes(value)) {
            return keys.attachment
          } else if (['repeat', 'repeat-x', 'repeat-y', 'no-repeat'].includes(value)) {
            return keys.repeat
          } else if (['cover', 'contain', 'auto'].includes(value) || is.length.test(value + unit)) {
            return keys.size
          } else if (/\d+%|\d+px|top|bottom|left|right|center/.test(value)) {
            return keys.position
          }

          return key ? keys[key] : 'background'
        },
        value: ({ key, value = '', unit = '', secondValue = '', secondUnit = '' }) => {
          if (value) {
            if (
              key === 'color' ||
              is.color.test(value) ||
              ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
            ) {
              if (
                (value.startsWith('rgb') || value.startsWith('oklch')) &&
                !value.includes('/') &&
                value.endsWith(')')
              ) {
                return `${value.slice(0, -1)}${
                  secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                }`
              } else {
                return value === 'current' ? 'currentColor' : value
              }
            } else if (
              key === 'size' ||
              is.length.test(value + unit) ||
              ['cover', 'contain', 'auto'].includes(value)
            ) {
              return value + unit
            } else {
              return value
            }
          }

          return null
        }
      },

      /* typography */
      text: {
        property: ({
          key,
          value = '',
          unit = '',
          secondValue = '',
          secondUnit = ''
        }: PropertyParams): GetCSSProperty => {
          type SizesType = Record<string, string[]>

          const sizes: SizesType = {
            xs: ['0.75rem', 'calc(1 / 0.75)'],
            sm: ['0.875rem', 'calc(1.25 / 0.875)'],
            base: ['1rem', 'calc(1.5 / 1)'],
            lg: ['1.125rem', 'calc(1.75 / 1.125)'],
            xl: ['1.25rem', 'calc(1.75 / 1.25)'],
            '2xl': ['1.5rem', 'calc(2 / 1.5)'],
            '3xl': ['1.875rem', 'calc(2.25 / 1.875)'],
            '4xl': ['2.25rem', 'calc(2.5 / 2.25)'],
            '5xl': ['3rem', '1'],
            '6xl': ['3.75rem', '1'],
            '7xl': ['4.5rem', '1'],
            '8xl': ['6rem', '1'],
            '9xl': ['8rem', '1']
          }

          const lineHeightAlias: Record<string, string> = {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2'
          }

          if (value) {
            if (
              key === 'color' ||
              is.color.test(value) ||
              ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
            ) {
              return `color: ${
                ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
                  ? value === 'current'
                    ? 'currentColor'
                    : value
                  : `${value.slice(0, -1)}${
                      secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                    }`
              }` as GetCSSProperty
            } else if (
              key === 'align' ||
              ['center', 'justify', 'left', 'right', 'start', 'end'].includes(value)
            ) {
              return `text-align: ${value}` as GetCSSProperty
            } else if (key === 'wrap' || ['wrap', 'nowrap', 'balance', 'pretty'].includes(value)) {
              return `text-wrap: ${value}` as GetCSSProperty
            } else if (key === 'overflow' || ['ellipsis', 'clip'].includes(value)) {
              return `text-overflow: ${value}` as GetCSSProperty
            } else if (key === 'size' || is.length.test(value + unit) || value + unit in sizes) {
              if (value + unit in sizes) {
                const sizeKey = (value + unit) as keyof SizesType

                const [fontSize, lineHeight] = sizes[sizeKey]
                return `font-size: ${fontSize}; line-height: ${
                  lineHeightAlias[secondValue] || secondValue + secondUnit || lineHeight
                }` as GetCSSProperty
              }
              return `font-size: ${value + unit}${
                secondValue
                  ? `; line-height: ${lineHeightAlias[secondValue] || secondValue + secondUnit}`
                  : ''
              }` as GetCSSProperty
            }
          }
          return ('color: ' + value) as GetCSSProperty
        },
        value: null
      },
      font: {
        value: null,
        property: ({ key, value }): GetCSSProperty => {
          const weightAlias: Record<string, string> = {
            thin: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900'
          }

          if (value) {
            if (
              key === 'weight' ||
              weightAlias[value] ||
              is.number.test(value) ||
              value.endsWith('00')
            ) {
              return `font-weight: ${weightAlias[value] || value}` as GetCSSProperty
            } else if (key === 'family') {
              return `font-family: ${value}` as GetCSSProperty
            }
          }
          return `font-family: ${value}` as GetCSSProperty

          // return `font-weight: ${weightAlias[value] || value}` as GetCSSProperty
        }
      },
      tracking: {
        property: 'letterSpacing',
        value: ({ value = '', unit = '' }) => {
          const values: Record<string, string> = {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em'
          }

          return values[value] || value + unit
        }
      },
      leading: {
        property: 'lineHeight',
        value: ({ value = '', unit = '' }) => {
          const values: Record<string, string> = {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2'
          }
          if (values[value]) {
            return values[value]
          } else if (!unit && is.number.test(value)) {
            return sizing * Number(value) + 'rem'
          } else {
            return value + unit
          }
        }
      },
      decoration: {
        property: ({ key, value = '', unit = '', secondValue = '', secondUnit = '' }) => {
          if (value) {
            if (key === 'color' || is.color.test(value)) {
              return ('text-decoration-color: ' +
                `${value.slice(0, -1)}${
                  secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                }`) as GetCSSProperty
            } else if (
              key === 'style' ||
              ['solid', 'dashed', 'double', 'dotted', 'wavy'].includes(value)
            ) {
              return `text-decoration-style: ${value}` as GetCSSProperty
            } else if (
              key === 'length' ||
              ['auto', 'from-font'].includes(value) ||
              is.number.test(value + unit) ||
              is.length.test(value + unit)
            ) {
              return `text-decoration-thickness: ${
                is.number.test(value + unit) ? value + 'px' : value + unit
              }` as GetCSSProperty
            }
          }

          return ('text-decoration-color: ' + value) as GetCSSProperty
        },
        value: null
      },
      'underline-offset': {
        property: 'textUnderlineOffset',
        value: '{0}px'
      },
      indent: {
        property: 'textIndent',
        value: ({ value, unit }) => {
          if (value) {
            if (is.number.test(value + unit)) return sizing * Number(value) + 'rem'
            else return value + unit
          }
          return null
        }
      },

      radius: {
        property: ({ key = '' }) => {
          const keys: Record<string, GetCSSProperty> = {
            t: ['borderTopLeftRadius', 'borderTopRightRadius'],
            r: ['borderTopRightRadius', 'borderBottomRightRadius'],
            b: ['borderBottomRightRadius', 'borderBottomLeftRadius'],
            l: ['borderTopLeftRadius', 'borderBottomLeftRadius'],

            tl: 'borderTopLeftRadius',
            tr: 'borderTopRightRadius',
            br: 'borderBottomRightRadius',
            bl: 'borderBottomLeftRadius'
          }

          return (keys[key as string] || 'borderRadius') as GetCSSProperty
        },
        value: ({ value = '', unit = '' }) => {
          const values: Record<string, string> = {
            xs: '0.125rem',
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            '4xl': '2rem'
          }

          return values[value] || value + unit
        }
      },
      border: {
        property: ({ value = '', unit = '', key = '', secondValue = '', secondUnit = '' }) => {
          const keys: Record<string, string> = {
            x: 'border-inline-width',
            y: 'border-block-eidth',
            t: 'border-top-width',
            r: 'border-right-width',
            b: 'border-bottom-width',
            l: 'border-left-width'
          }

          if (
            key === 'color' ||
            is.color.test(value) ||
            ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
          ) {
            let finalValue =
              (value.startsWith('rgb') || value.startsWith('oklch')) &&
              !value.includes('/') &&
              value.endsWith(')')
                ? `${value.slice(0, -1)}${
                    secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                  }`
                : value === 'current'
                  ? 'currentColor'
                  : value

            return ('border-color: ' + finalValue) as GetCSSProperty
          } else if (
            key === 'style' ||
            ['solid', 'dashed', 'double', 'hidden', 'none', 'dotted'].includes(value)
          )
            return ('border-style: ' + value) as GetCSSProperty

          let finalValue = !value
            ? '1px'
            : is.number.test(value + unit)
              ? value + 'px'
              : value + unit

          return ('border-style: ' +
            (secondValue || 'solid') +
            '; ' +
            (keys[key as string] || 'border-width') +
            ': ' +
            finalValue) as GetCSSProperty
        },
        value: null
      },
      outline: {
        property: ({ value = '', unit = '', key = '', secondValue = '', secondUnit = '' }) => {
          if (
            key === 'color' ||
            is.color.test(value) ||
            ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
          ) {
            let finalValue =
              (value.startsWith('rgb') || value.startsWith('oklch')) &&
              !value.includes('/') &&
              value.endsWith(')')
                ? `${value.slice(0, -1)}${
                    secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                  }`
                : value === 'current'
                  ? 'currentColor'
                  : value

            return ('outline-color: ' + finalValue) as GetCSSProperty
          } else if (
            key === 'style' ||
            ['solid', 'dashed', 'double', 'none', 'dotted'].includes(value)
          )
            return ('outline-style: ' + value) as GetCSSProperty

          let finalValue = !value
            ? '1px'
            : is.number.test(value + unit)
              ? value + 'px'
              : value + unit

          return ('outline-style: ' +
            (secondValue || 'solid') +
            '; ' +
            'outline-width' +
            ': ' +
            finalValue) as GetCSSProperty
        },
        value: null
      },
      shadow: {
        property: ({ key = '', value = '', secondValue = '', secondUnit = '' }) => {
          const shadowType = key === 'inset' ? 'inset-shadow' : 'shadow'

          const values: Record<string, string> = {
            '2xs': `0 1px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.05))`,
            xs: `0 1px 2px 0 var(--tui-${shadowType}-color, rgb(0 0 0 / 0.05))`,
            sm: `0 1px 3px 0 var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1))`,
            md: `0 4px 6px -1px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1))`,
            lg: `0 10px 15px -3px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1))`,
            xl: `0 20px 25px -5px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.1))`,
            '2xl': `0 25px 50px -12px var(--tui-${shadowType}-color, rgb(0 0 0 / 0.25))`,
            none: '0 0 #0000'
          }
          const insetValues: Record<string, string> = {
            '2xs': 'inset 0 1px var(--tui-inset-shadow-color, rgb(0 0 0 / 0.05)',
            xs: 'inset 0 1px 1px var(--tui-inset-shadow-color, rgb(0 0 0 / 0.05))',
            sm: 'inset 0 2px 4px var(--tui-inset-shadow-color, rgb(0 0 0 / 0.05))',
            none: '0 0 #0000'
          }

          let finalValue =
            (value.startsWith('rgb') || value.startsWith('oklch')) &&
            !value.includes('/') &&
            value.endsWith(')')
              ? `${value.slice(0, -1)}${
                  secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                }`
              : value === 'current'
                ? 'currentColor'
                : value

          if (is.color.test(value))
            return `--tui-${shadowType}-color: ${finalValue}` as GetCSSProperty
          else
            return `--tui-${shadowType}: ${
              (key === 'inset' ? insetValues[value] : values[value]) || value
            }; box-shadow: var(--tui-inset-shadow), var(--tui-inset-ring-shadow), var(--tui-ring-offset-shadow), var(--tui-shadow), var(--tui-ring-shadow)` as GetCSSProperty
        },
        value: null
      },
      ring: {
        property: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
          const shadowType = key === 'inset' ? 'inset-ring-shadow' : 'ring-shadow'
          let finalValue

          if (!value) finalValue = '1px'
          else if (is.color.test(value)) {
            finalValue =
              (value.startsWith('rgb') || value.startsWith('oklch')) &&
              !value.includes('/') &&
              value.endsWith(')')
                ? `${value.slice(0, -1)}${
                    secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                  }`
                : value
          } else if (is.number.test(value + unit)) finalValue = value + 'px'
          else finalValue = value + unit

          if (is.color.test(value) || value === 'current')
            return `--tui-${shadowType}-color: ${
              value === 'current' ? 'currentColor' : finalValue
            }` as GetCSSProperty
          else
            return `--tui-${shadowType}: ${
              key === 'inset' ? 'inset' : ''
            } 0 0 0 calc(${finalValue} + var(--tui-ring-offset-width, 2px)) var(--tui-ring-shadow-color, currentColor); box-shadow: var(--tui-inset-shadow), var(--tui-inset-ring-shadow), var(--tui-ring-offset-shadow), var(--tui-shadow), var(--tui-ring-shadow)` as GetCSSProperty
        },
        value: null
      },
      'ring-offset': {
        property: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
          let finalValue

          if (!value) finalValue = '1px'
          else if (is.color.test(value)) {
            finalValue =
              (value.startsWith('rgb') || value.startsWith('oklch')) &&
              !value.includes('/') &&
              value.endsWith(')')
                ? `${value.slice(0, -1)}${
                    secondValue ? ' / ' + secondValue + (secondUnit || '%)') : ')'
                  }`
                : value
          } else if (is.number.test(value + unit)) finalValue = value + 'px'
          else finalValue = value + unit

          if (is.color.test(value) || value === 'current')
            return `--tui-ring-offset-color: ${
              value === 'current' ? 'currentColor' : finalValue
            }` as GetCSSProperty
          else
            return `--tui-ring-offset-width: ${finalValue}; --tui-ring-offset-shadow: 0 0 0 var(--tui-ring-offset-width) var(--tui-ring-offset-color);` as GetCSSProperty
        },
        value: null
      },

      /* position */
      ...Object.fromEntries(
        ['top', 'right', 'bottom', 'left', 'inset'].map((property) => [
          property,
          {
            property,
            value: ({ value = '', unit = '' }) => {
              return is.number.test(value + unit)
                ? sizing * Number(value) + (value !== '0' ? 'rem' : '')
                : value + unit
            }
          }
        ])
      ),
      shrink: {
        property: 'flexShrink',
        value: ({ value = '', unit = '' }) => {
          return value + unit || '1'
        }
      },
      grow: {
        property: 'flexGrow',
        value: ({ value = '', unit = '' }) => {
          return value + unit || '1'
        }
      }
    },
    aliases: {
      isolate: 'isolation-isolate',
      // flex direction
      'flex-row': '[flex-direction]-row',
      'flex-col': '[flex-direction]-column',
      'flex-row-reverse': '[flex-direction]-row-reverse',
      'flex-col-reverse': '[flex-direction]-column-reverse',
      // flex wrap
      'flex-wrap': '[flex-wrap]-wrap',
      'flex-nowrap': '[flex-wrap]-nowrap',
      'flex-wrap-reverse': '[flex-wrap]-wrap-reverse',
      // columns
      'grid-cols-none': 'grid-cols-[none]',
      'grid-cols-subgrid': 'grid-cols-[subgrid]',
      'col-span-full': 'col-span-[1_/_-1]',
      'col-start-auto': 'col-start-[auto]',
      'col-end-auto': 'col-end-[auto]',
      // row
      'grid-rows-none': 'grid-rows-[none]',
      'grid-rows-subgrid': 'grid-rows-[subgrid]',
      'row-span-full': 'row-span-[1_/_-1]',
      'row-start-auto': 'row-start-[auto]',
      'row-end-auto': 'row-end-[auto]'
    },
    values: merge(colorLib('rgb'), {
      px: '1px',
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
      },
      'auto-cols': {
        fr: 'minmax(0, 1fr)'
      },
      'auto-rows': {
        min: 'min-content',
        max: 'max-content',
        fr: 'minmax(0, 1fr)'
      }
    }),
    classes
  } satisfies Config
}
