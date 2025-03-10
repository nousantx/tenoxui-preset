# TenoxUI Minimal Preset

This is a minimal configuration template for your TenoxUI.

## Installation

```bash
npm i @tenoxui/static @nousantx/tenoxui-preset
```

## Usage

```javascript
import { TenoxUI } from '@tenoxui/static'
import { createConfig } from '@nousantx/tenoxui-preset'

const ui = new TenoxUI(
  createConfig({
    sizing: 0.25
  })
)

console.log(
  ui.generate([
    'bg-red-500',
    'hover:bg-blue-500',
    'flex',
    'grid',
    'p-8',
    'text-center',
    'text-lime-500/30'
    // other class names ...
  ])
)
```

## Credits

This library is inspired by [Tailwind CSS](https://tailwindcss.com). While no code has been copied, it follows Tailwind's utility-first naming convention and adopts similar theme values, such as colors and box-shadow values. Tailwind CSS is a trademark of Tailwind Labs Inc.
