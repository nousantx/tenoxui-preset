import { rgbToHsl, hslToRgb, hexToRgb, type HSL } from '@nousantx/color-generator'

export function adjustShade(
  hsl: HSL,
  index: number,
  isNeutral: boolean,
  lighterLightness: number,
  lighterSaturation: number,
  darkerLightness: number,
  darkerSaturation: number
): HSL {
  let [h, s, l] = hsl
  if (index < 5) {
    l = Math.min(98, l + (98 - l) * ((5 - index) / lighterLightness))
    if (!isNeutral) {
      s = Math.max(10, s - s * ((5 - index) / lighterSaturation))
    }
  } else if (index > 5) {
    l = l * (1 - (index - 5) / darkerLightness)
    if (!isNeutral) {
      s = Math.min(100, s + (100 - s) * ((index - 5) / darkerSaturation))
    }
  }
  return [h, s, l]
}

function formatColor(hsl: HSL): string {
  const [h, s, l] = hsl
  const rgb = hslToRgb(h, s, l)
  return `${rgb[0]} ${rgb[1]} ${rgb[2]}`
}

export interface ColorInput {
  [hex: string]: string
}

interface ColorAdjustment {
  lighterLightness: number
  lighterSaturation: number
  darkerLightness: number
  darkerSaturation: number
}

export function generateColors({
  color,
  isDark,
  isCSSVar = true,
  isValueAlias = false,
  isAliasVar = false,
  isClassString = false,
  prefix = '',
  option = {}
}: {
  color: ColorInput
  isDark?: boolean
  isCSSVar?: boolean
  isValueAlias?: boolean
  isAliasVar?: boolean
  isClassString?: boolean
  prefix?: string
  option?: Partial<ColorAdjustment>
}): any {
  const {
    lighterLightness = 4.5,
    lighterSaturation = 10,
    darkerLightness = 6.5,
    darkerSaturation = 7
  } = option

  const colorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const steps = isDark ? [...colorSteps].reverse() : colorSteps
  let result: any = isCSSVar || isClassString ? '' : {}

  for (let [colorName, hexColor] of Object.entries(color)) {
    const rgb = hexToRgb(hexColor)
    const hsl = rgbToHsl(...rgb)
    const isNeutral = hsl[1] < 10

    steps.forEach((step, index) => {
      const adjustedHsl = adjustShade(
        hsl,
        index,
        isNeutral,
        lighterLightness,
        lighterSaturation,
        darkerLightness,
        darkerSaturation
      )
      const colorValue = formatColor(adjustedHsl)

      if (isClassString) {
        result += `[--${prefix}${colorName}-${step}]-[${colorValue.replace(/ /g, '_')}] `
      } else if (isCSSVar) {
        result += `--${prefix}${colorName}-${step}: ${colorValue};\n`
      } else if (isValueAlias) {
        result[`${prefix}${colorName}-${step}`] = colorValue
      } else {
        result[`${prefix}${colorName}-${step}`] = `var(--${prefix}${colorName}-${step})`
      }
    })
  }
  return result
}
