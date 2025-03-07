# `tenoxui-create-theme`

Simple library to create color theme for your tenoxui configuration.

This library will generate css variable of generated colors, with 11 shades of color started from `50` all the way to `950`.

## Installation

```bash
npm i @tenoxui/static @nousantx/tenoxui-create-theme
```

## Usage

Import the package :

```javascript
// esm
import { theme, variables } from '@nousantx/tenoxui-create-theme'

// cjs
const { theme, variables } = require('@nousantx/tenoxui-create-theme')

// iife (make sure to include the iife bundle)
const { theme, variables } = __create_theme__
```

Inside your tenoxui configuration :

```javascript
// example
import { TenoxUI } from '@tenoxui/static'
import { theme, variables } from '@nousantx/tenoxui-create-theme'

const color = {
  red: '#ff0000',
  primary: '#ccf654',
  neutral: '#676767'
  // more color here...
}

const ui = new TenoxUI({
  values: variables(color),
  apply: {
    "[data-theme='light']": theme(color),
    "[data-theme='dark']": theme(color, true)
  }
})
```

## Parameter

### `theme`

```typescript
function variables(color: ColorInput) {}
```

- `color` - Object of color you want to include to the theme.
- `isDark` - Option to reverse the order of the generated color variable.

### `variables`

```typescript
function theme(color: ColorInput, isDark?: boolean) {}
```

- `color` - Object of color you want to include to the theme.
