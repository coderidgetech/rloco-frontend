# Rloco Component Guide

## 🧩 Component Overview

This guide provides detailed information about all components in the Rloco fashion ecommerce application.

---

## Core Components

### 1. App.tsx
**Purpose**: Main application wrapper with loading state management

**Features**:
- Loading screen control
- Body scroll lock during loading
- AnimatePresence for smooth transitions
- Wraps entire app in CartProvider

**State**:
- `loading`: Boolean to control loading screen visibility

---

### 2. Loader.tsx
**Purpose**: Animated loading screen with brand reveal

**Features**:
- Progress bar animation (0-100%)
- Brand name fade-in
- Auto-completes and calls onComplete callback
- Smooth exit animation

**Props**:
- `onComplete: () => void` - Callback when loading completes

**Animation Details**:
- Progress updates every 20ms
- 2% increment per update
- 500ms delay before completion callback
- Exit fade: 0.5s duration

---

### 3. ScrollProgress.tsx
**Purpose**: Fixed scroll progress indicator

**Features**:
- Tracks page scroll position
- Smooth spring physics
- Fixed at top of viewport
- Primary color indicator

**Motion Configuration**:
- Stiffness: 100
- Damping: 30
- Rest Delta: 0.001

---

## Navigation Components

### 4. Navigation.tsx
**Purpose**: Main site navigation with cart

**Features**:
- Sticky header with blur effect
- Scroll-triggered styling changes
- Desktop & mobile navigation
- Shopping cart badge with count
- Search, user, and wishlist icons
- Smooth link hover effects

**State**:
- `isOpen`: Mobile menu toggle
- `scrolled`: Scroll position tracker
- `itemCount`: From CartContext

**Responsive**:
- Mobile: Hamburger menu
- Desktop: Horizontal navigation

**Links**:
- New Arrivals
- Women
- Men
- Collections
- Sale

---

## Content Sections

### 5. Hero.tsx
**Purpose**: Main hero section with parallax

**Features**:
- Full-screen introduction
- Parallax scroll effects
- Split layout (text + image)
- Dual CTAs
- Seasonal badge

**Animations**:
- Staggered text reveals
- Image scale-in effect
- Parallax on scroll
- Button hover states

**CTAs**:
1. Shop Now (Primary)
2. View Collections (Secondary)

---

### 6. Categories.tsx
**Purpose**: Shop by category section

**Features**:
- 3-column grid (Women, Men, Accessories)
- Hover image zoom
- Parallax scroll effects
- Underline animation on hover

**Category Data**:
```typescript
{
  name: string;
  image: string;
  link: string;
}
```

**Animations**:
- Staggered card reveals (0.15s delay)
- Image zoom on hover (1.1x scale)
- Parallax Y transform
- Underline expansion

---

### 7. Products.tsx
**Purpose**: Product grid with shopping functionality

**Features**:
- 6 products in responsive grid
- Size selection (XS, S, M, L, XL)
- Add to cart functionality
- Wishlist button
- Category badges
- Success feedback

**State**:
- `selectedSize`: Object mapping product ID to size
- `addedToCart`: Recently added product ID

**Product Data**:
```typescript
{
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}
```

**Animations**:
- Card reveals (0.1s stagger)
- Image zoom on hover
- Size button scale effects
- Success state animation

---

### 8. Featured.tsx
**Purpose**: Featured collection showcase

**Features**:
- Large featured image + text
- Two sub-collection cards
- Parallax effects
- Arrow animations
- Multiple CTAs

**Sections**:
1. Main: Essential Minimalism
2. Sub 1: Spring Essentials
3. Sub 2: Accessories

**Animations**:
- Section parallax
- Image hover zoom
- Arrow pulse effect
- Overlay transitions

---

### 9. Newsletter.tsx
**Purpose**: Email subscription form

**Features**:
- Email input with validation
- Submit button
- Animated background pattern
- Focus state animations

**State**:
- `email`: Input value
- `focused`: Input focus state

**Animations**:
- Input scale on focus (1.02x)
- Button hover effects
- Background pattern movement
- Decorative line reveal

---

### 10. Footer.tsx
**Purpose**: Site footer with links

**Features**:
- Brand description
- Social media links
- Shop links
- Help links
- Legal links

**Social Platforms**:
- Instagram
- Twitter
- LinkedIn

**Link Sections**:
1. **Shop**: New Arrivals, Women, Men, Sale
2. **Help**: Customer Service, Shipping, Size Guide, Contact

**Animations**:
- Link hover underline
- Icon hover scale
- Staggered list reveals

---

## Context & State Management

### 11. CartContext.tsx
**Purpose**: Global shopping cart state

**Features**:
- Add to cart
- Remove from cart
- Update quantity
- Clear cart
- Item count calculation
- Total price calculation

**Cart Item Type**:
```typescript
{
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}
```

**Methods**:
- `addToCart(item)`: Add or increment item
- `removeFromCart(id, size)`: Remove specific item
- `updateQuantity(id, size, quantity)`: Update amount
- `clearCart()`: Empty cart

**Computed Values**:
- `itemCount`: Total items in cart
- `total`: Total price

---

## Animation Patterns

### Common Motion Variants

**Fade In**:
```typescript
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
```

**Scale In**:
```typescript
initial={{ scale: 0 }}
animate={{ scale: 1 }}
```

**Stagger Children**:
```typescript
transition={{ delay: index * 0.1 }}
```

**Parallax**:
```typescript
const y = useTransform(scrollYProgress, [0, 1], [100, -100])
```

**Hover Scale**:
```typescript
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
```

---

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile Adaptations
- Navigation: Hamburger menu
- Hero: Stacked layout
- Products: 1-2 columns
- Categories: Stacked cards
- Footer: Stacked columns

---

## Image Sources

All images from Unsplash with optimized parameters:
- Format: jpg
- Quality: 80
- Width: 1080px
- Crop: entropy
- Color space: tinysrgb

---

## Performance Tips

1. **Lazy Loading**: Images load on demand
2. **Motion Optimization**: GPU-accelerated transforms
3. **Viewport Triggers**: Animations only when visible
4. **Spring Physics**: Natural, efficient motion
5. **Code Splitting**: Modular component structure

---

## Customization Examples

### Change Brand Colors
Edit `/src/styles/theme.css`:
```css
:root {
  --primary: #your-color;
  --accent: #your-accent;
}
```

### Add New Product
Edit `/src/app/components/Products.tsx`:
```typescript
{
  id: 7,
  name: 'Your Product',
  price: 299,
  image: 'url',
  category: 'Category',
}
```

### Modify Animation Speed
Adjust transition durations:
```typescript
transition={{ duration: 0.8 }} // Slower
transition={{ duration: 0.3 }} // Faster
```

---

## Best Practices

1. ✅ Use motion/react imports (not framer-motion)
2. ✅ Add viewport observers for performance
3. ✅ Use once: true for scroll triggers
4. ✅ Implement loading states
5. ✅ Maintain accessibility (ARIA labels)
6. ✅ Test responsive breakpoints
7. ✅ Optimize images before upload
8. ✅ Keep animations subtle and professional

---

Built with precision for luxury fashion retail
