# Button Migration Status

## ✅ COMPLETED
- [x] `/src/app/components/ui/button.tsx` - Button component updated with all variants
- [x] `/src/app/components/Hero.tsx` - Updated to use Button component
- [x] `/src/app/components/Footer.tsx` - Updated to use Button component
- [x] `/src/app/components/CartDrawer.tsx` - Updated to use Button component
- [x] `/src/app/components/CartPage.tsx` - Updated to use Button component

## ⏳ REMAINING (To Be Updated)

### High Priority (User-Facing)
- [ ] `/src/app/components/CheckoutPage.tsx` - Multiple custom buttons
- [ ] `/src/app/components/AccountModal.tsx` - Login/signup buttons
- [ ] `/src/app/components/AccountPage.tsx` - Many action buttons
- [ ] `/src/app/components/ProductDetail.tsx` - Add to cart, wishlist buttons
- [ ] `/src/app/components/SearchModal.tsx` - Search action buttons
- [ ] `/src/app/components/ErrorBoundary.tsx` - Reload button
- [ ] `/src/app/components/WishlistDrawer.tsx` - Action buttons
- [ ] `/src/app/pages/CartPage.tsx` - Duplicate of CartPage in components

### Admin Components
- [ ] All files in `/src/app/components/admin/` directory

## Migration Pattern

### Before (Custom Button):
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
  className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg"
>
  Click Me
</motion.button>
```

### After (Using Button Component):
```tsx
import { Button } from './ui/button';

<Button onClick={handleClick} size="lg">
  Click Me
</Button>
```

### With Motion Animation:
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Button onClick={handleClick} size="lg">
    Click Me
  </Button>
</motion.div>
```

## Variant Mapping

| Old Style | New Variant |
|-----------|-------------|
| `bg-primary text-primary-foreground` | `variant="default"` |
| `bg-accent text-accent-foreground` or `bg-[#FF5722]` | `variant="accent"` |
| `border-2 border-foreground hover:bg-foreground` | `variant="outline"` |
| `bg-white text-black` (on dark bg) | `variant="white"` |
| `bg-muted hover:bg-muted/80` | `variant="secondary"` |
| `hover:bg-muted` (minimal) | `variant="ghost"` |
| `bg-destructive` or `text-destructive` | `variant="destructive"` |
| `text-primary underline` | `variant="link"` |

## Size Mapping

| Old Style | New Size |
|-----------|----------|
| `px-4 py-2` (small) | `size="sm"` |
| `px-6 py-3` (default) | `size="default"` |
| `px-8 py-4` or `px-10 py-4` (large) | `size="lg"` |
| `px-12 py-4` (extra large) | `size="xl"` |
| Square icon buttons | `size="icon"` |

## Common Patterns

### Primary CTA Button:
```tsx
<Button variant="default" size="lg">Add to Cart</Button>
```

### Secondary Action:
```tsx
<Button variant="secondary">Save for Later</Button>
```

### Delete/Danger Action:
```tsx
<Button variant="destructive" size="sm">Delete</Button>
```

### Outlined Button:
```tsx
<Button variant="outline">Find Store</Button>
```

### Accent/Highlight (Use Sparingly - 10% Rule):
```tsx
<Button variant="accent" size="lg">Buy Now</Button>
```

### Ghost/Minimal:
```tsx
<Button variant="ghost" size="sm">Cancel</Button>
```

### On Dark Backgrounds (Hero):
```tsx
<Button variant="white" size="lg">Shop Now</Button>
```

## Notes
- Always import Button: `import { Button } from './ui/button';` or `import { Button } from '../ui/button';`
- Motion animations should wrap the Button component, not replace it
- Combine multiple props: `<Button variant="accent" size="lg" className="w-full">Text</Button>`
- Custom classes can still be added via `className` prop
- Remember the 60:30:10 color ratio - use `accent` variant sparingly (10%)
