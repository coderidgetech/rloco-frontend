# Rloco Button System

## Overview
All buttons in the Rloco application use the unified `Button` component from `/src/app/components/ui/button.tsx`. This ensures consistent styling, behavior, and adherence to the 60:30:10 color ratio design principle.

## Import
```tsx
import { Button } from './ui/button';
// or from other directories:
import { Button } from '../ui/button';
```

## Variants

### `default` (Primary - Logo Brown/Gold)
Main CTAs and primary actions. Uses brand color #B4770E.
```tsx
<Button variant="default">Shop Now</Button>
```

### `accent` (Orange - 10% Accent Color)
Important secondary actions. Uses orange #FF5722.
```tsx
<Button variant="accent">Add to Cart</Button>
```

### `outline`
Bordered with hover fill effect.
```tsx
<Button variant="outline">Find a Store</Button>
```

### `ghost`
Minimal style with hover background.
```tsx
<Button variant="ghost">Cancel</Button>
```

### `secondary`
Light background for less prominent actions.
```tsx
<Button variant="secondary">Save for Later</Button>
```

### `destructive`
For dangerous/delete actions.
```tsx
<Button variant="destructive">Delete</Button>
```

### `link`
Text-only link style.
```tsx
<Button variant="link">Learn More</Button>
```

### `white`
For use on dark backgrounds (like Hero section).
```tsx
<Button variant="white">Shop Dress</Button>
```

## Sizes

### `sm` - Small
Height: 36px (9 units)
```tsx
<Button size="sm">Small Button</Button>
```

### `default` - Default
Height: 44px (11 units)
```tsx
<Button>Default Button</Button>
```

### `lg` - Large
Height: 56px (14 units)
```tsx
<Button size="lg">Large Button</Button>
```

### `xl` - Extra Large
Height: 64px (16 units)
```tsx
<Button size="xl">Extra Large</Button>
```

### `icon` - Icon Only
Square button for icons.
```tsx
<Button size="icon"><Heart /></Button>
```

## Usage Examples

### Basic Button
```tsx
<Button>Click Me</Button>
```

### With Variant and Size
```tsx
<Button variant="accent" size="lg">
  Add to Cart
</Button>
```

### With Icons
```tsx
import { ShoppingCart } from 'lucide-react';

<Button variant="default">
  <ShoppingCart />
  Add to Cart
</Button>
```

### With onClick Handler
```tsx
<Button 
  variant="default" 
  onClick={() => handleCheckout()}
>
  Proceed to Checkout
</Button>
```

### With Custom Classes
```tsx
<Button 
  variant="white" 
  size="lg"
  className="tracking-[0.15em] uppercase"
>
  Shop Now
</Button>
```

### Disabled State
```tsx
<Button disabled>
  Processing...
</Button>
```

## With Motion (Framer Motion)

You can wrap the Button in Motion for animations:
```tsx
import { motion } from 'motion/react';

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Button variant="accent" size="lg">
    Add to Cart
  </Button>
</motion.div>
```

## Color Usage Guidelines (60:30:10 Rule)

### 60% - White/Light (Backgrounds)
- Most of the page should be white backgrounds
- Buttons sit on these backgrounds

### 30% - Black/Dark (Text & Structure)
- Use `variant="outline"` for black-bordered buttons
- Footer text and navigation use this

### 10% - Orange Accent (#FF5722)
- Use `variant="accent"` sparingly for key CTAs
- Reserve for the most important actions (Add to Cart, Buy Now, etc.)

### Logo Color (Brand Primary)
- Use `variant="default"` for primary brand actions
- Checkout, main navigation CTAs

## Migration from Custom Buttons

### Before (Custom Inline Styles)
```tsx
<button className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg">
  Shop Now
</button>
```

### After (Using Button Component)
```tsx
<Button variant="default" size="lg">
  Shop Now
</Button>
```

### Before (With Motion)
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  className="px-10 py-4 bg-white text-black shadow-xl"
>
  Shop Dress
</motion.button>
```

### After (Using Button Component)
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
  <Button variant="white" size="lg">
    Shop Dress
  </Button>
</motion.div>
```

## Benefits

✅ **Consistency** - All buttons look and behave the same way
✅ **Maintainability** - Change button styles in one place
✅ **Accessibility** - Built-in focus states and ARIA support
✅ **Design System** - Adheres to 60:30:10 color ratio
✅ **Type Safety** - TypeScript support for all props
✅ **Responsive** - Works perfectly on all screen sizes

## DO NOT

❌ Don't create custom button styles with inline classes
❌ Don't use raw `<button>` tags with custom styling
❌ Don't mix multiple button style systems
❌ Don't overuse the `accent` variant (remember the 10% rule)

## DO

✅ Always use the Button component for clickable actions
✅ Choose appropriate variants based on action importance
✅ Use consistent sizes throughout related UI sections
✅ Add motion animations by wrapping the Button
✅ Follow the 60:30:10 color distribution principle
