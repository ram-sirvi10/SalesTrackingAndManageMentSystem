# Design System Documentation

## 🎨 Color Palette

### Primary Colors (Blue-Indigo)
Professional, trustworthy, and tech-forward. Used for primary actions, links, and key UI elements.
- `primary-50` to `primary-950`: Full spectrum from lightest to darkest
- Main: `primary-600` (#4f46e5)
- Hover: `primary-700` (#4338ca)

### Secondary Colors (Neutral Grays)
Clean, modern, and professional. Used for text, borders, and backgrounds.
- `secondary-50` to `secondary-950`: Full spectrum
- Background: `secondary-50` (#f9fafb)
- Text: `secondary-900` (#111827)
- Borders: `secondary-200` (#e5e7eb)

### Accent Colors (Vibrant Cyan)
Energy, innovation, and action. Used for highlights and special features.
- `accent-400` to `accent-700`: Main usage range

### Semantic Colors
- **Success**: Fresh green (`success-500` #22c55e)
- **Warning**: Warm amber (`warning-500` #f59e0b)
- **Danger**: Bold red (`danger-500` #ef4444)
- **Info**: Cool blue (`info-500` #3b82f6)

## 📝 Typography

### Font Scale
- `text-xs`: 12px / 16px line-height
- `text-sm`: 14px / 20px line-height
- `text-base`: 16px / 24px line-height (body text)
- `text-lg`: 18px / 28px line-height
- `text-xl`: 20px / 28px line-height
- `text-2xl`: 24px / 32px line-height
- `text-3xl`: 30px / 36px line-height
- `text-4xl`: 36px / 40px line-height
- `text-5xl`: 48px / 1 line-height
- `text-6xl`: 60px / 1 line-height

### Font Weights
- `font-normal`: 400 (body text)
- `font-medium`: 500 (emphasis)
- `font-semibold`: 600 (headings, buttons)
- `font-bold`: 700 (strong emphasis)

### Letter Spacing
Automatically applied based on font size for optimal readability.

## 📏 Spacing System

Based on 4px unit (0.25rem):
- `0.5`: 2px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px (base unit)
- `5`: 20px
- `6`: 24px
- `8`: 32px
- `10`: 40px
- `12`: 48px
- `16`: 64px
- `20`: 80px
- `24`: 96px

## 🌑 Shadow System

### Elevation Levels
- `shadow-xs`: Subtle hover states
- `shadow-sm`: Small cards, dropdowns
- `shadow-md`: Cards, modals (default)
- `shadow-lg`: Floating elements, popovers
- `shadow-xl`: Modals, overlays
- `shadow-2xl`: Maximum elevation

### Special Shadows
- `shadow-soft`: Soft, diffused shadow
- `shadow-glow-primary`: Primary color glow
- `shadow-glow-accent`: Accent color glow
- `shadow-glow-success`: Success color glow
- `shadow-inner`: Inset shadow for inputs

## 🔲 Border Radius

- `rounded-sm`: 4px (small elements)
- `rounded`: 6px (default)
- `rounded-md`: 8px (inputs, buttons)
- `rounded-lg`: 12px (cards)
- `rounded-xl`: 16px (large cards)
- `rounded-2xl`: 24px (hero sections)
- `rounded-3xl`: 32px (special elements)
- `rounded-full`: Pills, avatars

## ✨ Animation System

### Timing Functions
- Fast: 150ms (micro-interactions)
- Base: 200ms (standard transitions)
- Slow: 300ms (complex animations)

### Animations
- `animate-fade-in`: Simple fade in
- `animate-fade-in-up`: Fade in with upward motion
- `animate-slide-in`: Slide from top
- `animate-slide-in-right`: Slide from left
- `animate-scale-in`: Scale up with fade
- `animate-bounce-subtle`: Gentle bounce
- `animate-pulse-subtle`: Subtle pulsing

## 🎯 Component Patterns

### Cards
```jsx
<div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

### Buttons
- Primary: `bg-primary-600 hover:bg-primary-700 text-white`
- Secondary: `bg-secondary-100 hover:bg-secondary-200 text-secondary-900`
- Danger: `bg-danger-600 hover:bg-danger-700 text-white`

### Inputs
```jsx
<input className="w-full px-4 py-2.5 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
```

### Badges
```jsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
  Badge
</span>
```

## 🌈 Gradients

### Background Gradients
- Primary: `bg-gradient-to-br from-primary-500 to-primary-700`
- Accent: `bg-gradient-to-br from-accent-400 to-accent-600`
- Success: `bg-gradient-to-br from-success-400 to-success-600`

### Text Gradients
- Primary: `bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent`
- Accent: `bg-gradient-to-r from-accent-500 to-primary-600 bg-clip-text text-transparent`

## 🎭 Website Personality

### Brand Attributes
- **Professional**: Clean layouts, consistent spacing, neutral colors
- **Modern**: Contemporary design patterns, smooth animations
- **Trustworthy**: Solid color choices, clear hierarchy
- **Efficient**: Intuitive navigation, quick interactions
- **Tech-Forward**: Modern UI patterns, subtle animations

### Design Principles
1. **Clarity**: Clear visual hierarchy and readable typography
2. **Consistency**: Uniform spacing, colors, and patterns
3. **Efficiency**: Minimal clicks, fast interactions
4. **Accessibility**: High contrast, clear focus states
5. **Delight**: Subtle animations, smooth transitions

## 📱 Responsive Breakpoints

- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

## ♿ Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA standards
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
