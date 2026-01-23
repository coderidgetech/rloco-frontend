# Luxury Form Components Guide

## Overview

The Rloco application now uses a consistent set of luxury-styled form components throughout the entire application. These components provide a cohesive, elegant user experience that matches the brand's minimalist aesthetic.

## Components

### 1. LuxuryInput

A premium input component with integrated label, error handling, and helper text.

**Features:**
- Uppercase tracking labels
- Smooth focus transitions with brand color (#B4770E)
- Built-in error states with red destructive color
- Optional helper text
- Required field indicator (*)
- Hover effects

**Usage:**

```tsx
import { LuxuryInput } from '../components/ui/luxury-input';

// Basic usage
<LuxuryInput
  label="Email Address"
  type="email"
  placeholder="john@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

// With error
<LuxuryInput
  label="Email Address"
  type="email"
  error="Please enter a valid email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With helper text
<LuxuryInput
  label="Phone Number"
  type="tel"
  helperText="We'll never share your phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
```

**Props:**
- `label?: string` - Label text (uppercase, tracking)
- `error?: string` - Error message to display
- `helperText?: string` - Helper text to display
- `required?: boolean` - Shows asterisk for required fields
- All standard HTML input props

**Styling:**
- Border: `border-foreground/20`
- Focus: `border-primary` with shadow `[0_0_0_1px_rgb(180,119,14,0.2)]`
- Hover: `border-foreground/40`
- Error: `border-destructive` with red shadow

---

### 2. LuxuryTextarea

A premium textarea component for multi-line input with the same luxury styling as LuxuryInput.

**Features:**
- Uppercase tracking labels
- Smooth focus transitions
- Built-in error states
- Optional helper text
- No resize by default
- Minimum height of 120px

**Usage:**

```tsx
import { LuxuryTextarea } from '../components/ui/luxury-textarea';

// Basic usage
<LuxuryTextarea
  label="Message"
  rows={6}
  placeholder="Tell us how we can help you..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  required
/>

// With error
<LuxuryTextarea
  label="Description"
  error="Description must be at least 20 characters"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

**Props:**
- `label?: string` - Label text (uppercase, tracking)
- `error?: string` - Error message to display
- `helperText?: string` - Helper text to display
- `required?: boolean` - Shows asterisk for required fields
- All standard HTML textarea props

---

### 3. LuxurySelect

A premium select/dropdown component with custom chevron icon and luxury styling.

**Features:**
- Uppercase tracking labels
- Custom chevron icon
- Smooth focus transitions
- Built-in error states
- Optional helper text

**Usage:**

```tsx
import { LuxurySelect } from '../components/ui/luxury-select';

// Basic usage
<LuxurySelect
  label="Country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  required
>
  <option value="">Select a country</option>
  <option value="india">India</option>
  <option value="usa">United States</option>
  <option value="uk">United Kingdom</option>
</LuxurySelect>

// With error
<LuxurySelect
  label="Payment Method"
  error="Please select a payment method"
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="">Select method</option>
  <option value="card">Credit Card</option>
  <option value="upi">UPI</option>
</LuxurySelect>
```

**Props:**
- `label?: string` - Label text (uppercase, tracking)
- `error?: string` - Error message to display
- `helperText?: string` - Helper text to display
- `required?: boolean` - Shows asterisk for required fields
- All standard HTML select props

---

## Design Specifications

### Color Scheme (60:30:10 Ratio)

- **60% - Dominant**: White (#FFFFFF) backgrounds
- **30% - Secondary**: Black/Dark (#1A1A1A) text and borders
- **10% - Accent**: Brown/Gold (#B4770E) for focus states and CTAs

### Typography

- **Labels**: 
  - Size: `text-sm`
  - Transform: Normal case (no uppercase)
  - Tracking: Normal
  - Color: `text-foreground/90`

- **Input Text**:
  - Size: `text-sm`
  - Color: `text-foreground`
  
- **Placeholder**:
  - Color: `text-foreground/40`
  - Tracking: Normal

- **Error/Helper Text**:
  - Size: `text-xs`
  - Tracking: Normal
  - Color: `text-destructive` (errors) or `text-foreground/50` (helper)

### Spacing & Sizing

- **Input Height**: `py-2.5` (10px top/bottom)
- **Input Padding**: `px-3` (12px left/right)
- **Label Margin**: `mb-1.5` (6px)
- **Helper Text Margin**: `mt-1.5` (6px)
- **Textarea Min Height**: `120px`
- **Border Radius**: `rounded-sm` (2px)

### Transitions

- **Duration**: `200ms`
- **Properties**: `all`
- **Timing**: `ease` (default)

### Focus States

- **Border Color**: `border-foreground/40`
- **Box Shadow**: None (removed for cleaner look)
- **Outline**: `none`

### Hover States

- **Border Color**: `border-foreground/25`

### Error States

- **Border Color**: `border-destructive/50`
- **Focus Border**: `border-destructive`
- **Text Color**: `text-destructive`
- **Icon**: AlertCircle (optional, not built-in)

---

## Migration Guide

### From Standard HTML Inputs

**Before:**
```tsx
<div>
  <label className="block text-xs uppercase tracking-[0.3em] text-foreground/60 mb-2">
    Email Address *
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full h-12 px-4 border border-foreground/20 bg-background focus:border-foreground focus:outline-none transition-colors"
    placeholder="john@example.com"
    required
  />
</div>
```

**After:**
```tsx
<LuxuryInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="john@example.com"
  required
/>
```

### From Other UI Libraries

**From MUI:**
```tsx
// Before
<TextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!errors.email}
  helperText={errors.email}
/>

// After
<LuxuryInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

---

## Updated Pages

The following pages have been migrated to use Luxury Form Components:

### Customer-Facing
- ✅ **ContactPage** - Contact form
- ✅ **CheckoutPage** - Shipping and payment forms
- ✅ **AccountPage** - Profile, addresses, payment methods, and settings
- ✅ **AccountModal** - Login and signup forms
- ✅ **OrderDetailsModal** - Review and support forms
- ✅ **MobileFilterPanel** - Filter checkboxes

### Admin/Vendor
- ✅ **AdminLoginPage** - Login form
- ℹ️ **Admin Pages** - Use separate UI library components (not converted)

---

## Best Practices

### 1. Always Use Labels
```tsx
// ✅ Good
<LuxuryInput label="Email" type="email" />

// ❌ Avoid
<LuxuryInput type="email" placeholder="Email" />
```

### 2. Show Helpful Errors
```tsx
// ✅ Good - Specific and helpful
<LuxuryInput 
  label="Email"
  error="Please enter a valid email address (e.g., john@example.com)"
/>

// ❌ Avoid - Generic and unhelpful
<LuxuryInput 
  label="Email"
  error="Invalid input"
/>
```

### 3. Use Helper Text for Guidance
```tsx
<LuxuryInput
  label="Phone Number"
  type="tel"
  helperText="We'll use this for order updates only"
  placeholder="+91 98765 43210"
/>
```

### 4. Group Related Fields
```tsx
<div className="grid grid-cols-2 gap-4">
  <LuxuryInput label="First Name" />
  <LuxuryInput label="Last Name" />
</div>
```

### 5. Consistent Spacing
```tsx
<form className="space-y-6">
  <LuxuryInput label="Name" />
  <LuxuryInput label="Email" />
  <LuxuryTextarea label="Message" />
</form>
```

---

## Accessibility

All luxury form components follow accessibility best practices:

- ✅ Proper label associations
- ✅ ARIA attributes for errors
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Required field indicators

---

## Browser Support

These components are tested and supported on:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari (latest)
- ✅ Chrome Android (latest)

---

## Examples

### Complete Contact Form

```tsx
import { useState } from 'react';
import { LuxuryInput } from '../components/ui/luxury-input';
import { LuxuryTextarea } from '../components/ui/luxury-textarea';
import { LuxurySelect } from '../components/ui/luxury-select';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LuxuryInput
        label="Full Name"
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="John Doe"
      />

      <LuxuryInput
        label="Email Address"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="john@example.com"
      />

      <LuxuryInput
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="+91 98765 43210"
        helperText="Optional - for urgent inquiries"
      />

      <LuxurySelect
        label="Subject"
        required
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      >
        <option value="">Select a subject</option>
        <option value="order">Order Inquiry</option>
        <option value="product">Product Question</option>
        <option value="shipping">Shipping & Delivery</option>
        <option value="return">Returns & Exchanges</option>
        <option value="other">Other</option>
      </LuxurySelect>

      <LuxuryTextarea
        label="Message"
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={6}
        placeholder="Tell us how we can help you..."
      />

      <button
        type="submit"
        className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
      >
        Send Message
      </button>
    </form>
  );
}
```

---

## Support

For questions or issues with the luxury form components, please refer to:
- Component source files in `/src/app/components/ui/`
- This documentation
- The ContactPage implementation as a reference example

---

**Last Updated:** January 11, 2026
**Version:** 1.0.0
