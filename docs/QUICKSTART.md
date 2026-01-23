# 🚀 Rloco Quick Start Guide

## Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- pnpm package manager

---

## Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at the URL provided by Vite (typically `http://localhost:5173`)

---

## 📁 Project Structure Quick Reference

```
src/
├── app/
│   ├── App.tsx              # Main entry point
│   ├── components/          # All UI components
│   └── context/            # State management
└── styles/                 # CSS and themes
```

---

## 🎯 Quick Tasks

### 1. Change Brand Name
**Files**: 
- `/src/app/components/Navigation.tsx` (line ~22)
- `/src/app/components/Footer.tsx` (line ~16)
- `/src/app/components/Loader.tsx` (line ~36)

Change `Rloco` to your brand name.

---

### 2. Add a New Product

**File**: `/src/app/components/Products.tsx`

```typescript
const products = [
  // Add this:
  {
    id: 7,
    name: 'Your Product Name',
    price: 299,
    image: 'https://your-image-url.com/image.jpg',
    category: 'Your Category',
  },
  // ... existing products
];
```

---

### 3. Change Color Scheme

**File**: `/src/styles/theme.css`

```css
:root {
  --background: #ffffff;    /* Background color */
  --foreground: #000000;    /* Text color */
  --primary: #030213;       /* Primary/CTA color */
  --accent: #e9ebef;        /* Accent highlights */
  --border: rgba(0,0,0,0.1);/* Border color */
}
```

---

### 4. Update Hero Text

**File**: `/src/app/components/Hero.tsx` (lines ~32-52)

```typescript
<h1>
  <span>Your</span>
  <span>Headline</span>
</h1>

<p>
  Your description text here.
</p>
```

---

### 5. Modify Categories

**File**: `/src/app/components/Categories.tsx` (lines ~4-20)

```typescript
const categories = [
  {
    name: 'Your Category',
    image: 'image-url',
    link: '#your-category',
  },
  // ... more categories
];
```

---

### 6. Change Animation Speed

Find any component and adjust `duration`:

```typescript
// Slower (more luxurious)
transition={{ duration: 1.2 }}

// Faster (more energetic)  
transition={{ duration: 0.4 }}
```

---

### 7. Disable Loading Screen

**File**: `/src/app/App.tsx`

```typescript
// Change this:
const [loading, setLoading] = useState(true);

// To this:
const [loading, setLoading] = useState(false);
```

---

### 8. Update Social Media Links

**File**: `/src/app/components/Footer.tsx` (lines ~20-30)

```typescript
{[
  { Icon: Instagram, href: 'https://instagram.com/yourbrand' },
  { Icon: Twitter, href: 'https://twitter.com/yourbrand' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/yourbrand' },
]}
```

---

## 🎨 Image Guidelines

### Using Unsplash Images

1. Go to [unsplash.com](https://unsplash.com)
2. Find your image
3. Get the URL with these parameters:

```
?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080
```

### Recommended Image Sizes
- Hero: 1920x2560 (portrait)
- Products: 1080x1440 (3:4 ratio)
- Categories: 1080x1440 (3:4 ratio)
- Featured: 1920x2400 (4:5 ratio)

---

## 🛒 Shopping Cart Usage

The cart is managed globally via Context. Use it anywhere:

```typescript
import { useCart } from '../context/CartContext';

function YourComponent() {
  const { items, addToCart, itemCount, total } = useCart();
  
  const handleAdd = () => {
    addToCart({
      id: 1,
      name: 'Product',
      price: 299,
      image: 'url',
      size: 'M',
    });
  };
  
  return <button onClick={handleAdd}>Add to Cart</button>;
}
```

---

## 🎭 Animation Presets

### Fade In
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

### Scale In
```typescript
<motion.div
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.8 }}
>
```

### Hover Effect
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Stagger Children
```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}
```

---

## 🐛 Common Issues

### Issue: Animations not working
**Solution**: Check that you're importing from `motion/react`:
```typescript
import { motion } from 'motion/react';
```

### Issue: Images not loading
**Solution**: Verify image URLs are accessible and use HTTPS

### Issue: Cart not updating
**Solution**: Make sure component is inside `<CartProvider>`

### Issue: Scroll animations triggering too early
**Solution**: Adjust viewport margin:
```typescript
viewport={{ once: true, margin: '-100px' }}
```

---

## 📱 Testing Responsive Design

### Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test these sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1440px

### Responsive Classes
```typescript
className="text-4xl md:text-6xl lg:text-8xl"
//        mobile    tablet     desktop
```

---

## 🚢 Build for Production

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

Build output will be in `/dist` directory.

---

## 📚 Learn More

- **Motion Docs**: [motion.dev](https://motion.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React Docs**: [react.dev](https://react.dev)

---

## 🆘 Need Help?

1. Check `/COMPONENT_GUIDE.md` for detailed component docs
2. Review `/README.md` for full project overview
3. Inspect existing components for examples

---

## ✅ Checklist Before Launch

- [ ] Update brand name throughout
- [ ] Replace all product data
- [ ] Update all images
- [ ] Customize color scheme
- [ ] Set correct social media links
- [ ] Test on mobile devices
- [ ] Test shopping cart functionality
- [ ] Verify all links work
- [ ] Check loading times
- [ ] Test form validation

---

**Happy coding! 🎉**
