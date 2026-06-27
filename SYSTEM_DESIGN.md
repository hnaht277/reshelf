# Reshelf — System Design & Style Guide

> The single source of truth for all visual decisions in Reshelf. Every component, screen, and interaction must reference these tokens. No ad-hoc values.

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Border Radius](#border-radius)
- [Shadows & Elevation](#shadows--elevation)
- [Iconography](#iconography)
- [Component Specifications](#component-specifications)
- [Motion & Animation](#motion--animation)
- [Screen Layout Templates](#screen-layout-templates)
- [Dark Mode (Future)](#dark-mode-future)

---

## Design Philosophy

### Brand Personality
| Attribute     | Description                                                              |
| :------------ | :----------------------------------------------------------------------- |
| Fresh         | Bright greens, airy whitespace, food-inspired warmth                     |
| Trustworthy   | Clear expiry info, verified badges, no dark patterns                     |
| Rewarding     | Impact counters, milestone badges, celebratory animations                |
| Premium       | Glassmorphism, smooth gradients, refined typography, polished micro-UX   |
| Approachable  | Friendly copy, rounded shapes, warm accent colors, playful empty states  |

### Inspirations
- **Too Good To Go** — impact-driven UX, surprise bag concept
- **Olio** — community warmth, neighborhood feel
- **Flashfood** — grocery-native, clear pricing
- **Apple Health** — dashboard design, ring progress indicators
- **Airbnb** — card layout polish, image-first design

---

## Color System

### Primary Palette

| Token              | Hex         | Usage                                       |
| :----------------- | :---------- | :------------------------------------------ |
| `primary-50`       | `#F0FDF4`   | Lightest tint — background fills, cards      |
| `primary-100`      | `#DCFCE7`   | Light tint — hover states, subtle highlights |
| `primary-200`      | `#BBF7D0`   | Chip backgrounds, progress bar tracks        |
| `primary-300`      | `#86EFAC`   | Active chip borders, secondary elements      |
| `primary-400`      | `#4ADE80`   | Badges, progress indicators                  |
| `primary-500`      | `#22C55E`   | **Main brand green** — buttons, links, CTAs  |
| `primary-600`      | `#16A34A`   | Button hover/pressed state                   |
| `primary-700`      | `#15803D`   | Active navigation, strong emphasis           |
| `primary-800`      | `#166534`   | Dark accents, header text on light bg        |
| `primary-900`      | `#14532D`   | Deepest green — rarely used                  |

### Neutral Palette

| Token              | Hex         | Usage                                       |
| :----------------- | :---------- | :------------------------------------------ |
| `neutral-0`        | `#FFFFFF`   | Primary background, cards                    |
| `neutral-50`       | `#FAFAFA`   | Page background, subtle alternating rows     |
| `neutral-100`      | `#F5F5F5`   | Input backgrounds, skeleton base             |
| `neutral-200`      | `#E5E5E5`   | Borders, dividers, disabled states           |
| `neutral-300`      | `#D4D4D4`   | Placeholder text (on light bg)               |
| `neutral-400`      | `#A3A3A3`   | Secondary/muted text, inactive icons         |
| `neutral-500`      | `#737373`   | Body text (secondary)                        |
| `neutral-600`      | `#525252`   | Body text (primary)                          |
| `neutral-700`      | `#404040`   | Headings, emphasis text                      |
| `neutral-800`      | `#262626`   | Strong headings, nav text                    |
| `neutral-900`      | `#171717`   | Maximum contrast text                        |

### Semantic Colors

| Token              | Hex         | Usage                                       |
| :----------------- | :---------- | :------------------------------------------ |
| `success`          | `#22C55E`   | Confirmed actions, "Fresh" status            |
| `success-light`    | `#F0FDF4`   | Success message background                   |
| `warning`          | `#F59E0B`   | "Expiring Soon" status, caution states       |
| `warning-light`    | `#FFFBEB`   | Warning message background                   |
| `danger`           | `#EF4444`   | "Last Day" status, errors, destructive       |
| `danger-light`     | `#FEF2F2`   | Error message background                     |
| `info`             | `#3B82F6`   | Price drops, informational badges            |
| `info-light`       | `#EFF6FF`   | Info message background                      |
| `impact`           | `#8B5CF6`   | Impact/eco-milestones, badges, gamification  |
| `impact-light`     | `#F5F3FF`   | Impact section background                    |

### Freshness Status Colors

These are applied consistently across all screens where product freshness is shown:

| Status           | Background   | Text / Icon  | Border       | Description                         |
| :--------------- | :----------- | :----------- | :----------- | :---------------------------------- |
| `Fresh`          | `#F0FDF4`    | `#16A34A`    | `#BBF7D0`    | > 3 days until expiry               |
| `Expiring Soon`  | `#FFFBEB`    | `#D97706`    | `#FDE68A`    | 1–3 days until expiry               |
| `Last Day`       | `#FEF2F2`    | `#DC2626`    | `#FECACA`    | Expires today                       |
| `Expired`        | `#F5F5F5`    | `#A3A3A3`    | `#E5E5E5`    | Past expiry — greyed out, disabled  |

### Gradient Presets

```
hero-gradient:      linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)
card-scrim:         linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)
impact-gradient:    linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)
savings-gradient:   linear-gradient(135deg, #22C55E 0%, #059669 100%)
skeleton-shimmer:   linear-gradient(90deg, #F5F5F5 0%, #E5E5E5 50%, #F5F5F5 100%)
```

---

## Typography

### Font Family

| Role       | Font                | Weight     | Fallback         |
| :--------- | :------------------ | :--------- | :--------------- |
| Display    | **Outfit**          | 700 (Bold) | System sans      |
| Heading    | **Outfit**          | 600 (Semi) | System sans      |
| Body       | **Inter**           | 400 / 500  | System sans      |
| Mono       | **JetBrains Mono**  | 400        | System mono      |

> Load via `expo-font` or `@expo-google-fonts/outfit` + `@expo-google-fonts/inter`.

### Type Scale

| Token            | Size  | Line Height | Weight    | Usage                                    |
| :--------------- | :---- | :---------- | :-------- | :--------------------------------------- |
| `display-lg`     | 32px  | 40px        | Bold 700  | Hero numbers (impact dashboard)          |
| `display-md`     | 28px  | 36px        | Bold 700  | Screen titles                            |
| `heading-lg`     | 24px  | 32px        | Semi 600  | Section headings                         |
| `heading-md`     | 20px  | 28px        | Semi 600  | Card titles, modal headers               |
| `heading-sm`     | 18px  | 24px        | Semi 600  | Sub-section headings                     |
| `body-lg`        | 16px  | 24px        | Regular   | Primary body text, descriptions          |
| `body-md`        | 14px  | 20px        | Regular   | Secondary body, list items               |
| `body-sm`        | 12px  | 16px        | Medium    | Captions, timestamps, labels             |
| `body-xs`        | 10px  | 14px        | Medium    | Legal text, fine print (use sparingly)   |
| `price-lg`       | 24px  | 32px        | Bold 700  | Discounted price (primary)               |
| `price-original` | 14px  | 20px        | Regular   | Original price (strikethrough, muted)    |
| `badge`          | 11px  | 14px        | Semi 600  | Badge text, chip text, tab labels        |

### Typography Rules
- **Maximum 2 font families** per screen (Outfit for headings, Inter for body)
- **Never** use system default fonts — always load custom fonts
- Price text always uses **tabular (monospace) numerals** for alignment
- Strikethrough original prices use `neutral-400` color
- All caps ONLY for badge/label text — never for body or headings

---

## Spacing & Layout

### Spacing Scale (4px base unit)

| Token   | Value  | Usage                                          |
| :------ | :----- | :--------------------------------------------- |
| `xs`    | 4px    | Tight gaps (icon-to-text, badge padding)       |
| `sm`    | 8px    | Chip gaps, compact card padding                |
| `md`    | 12px   | Input padding, small card gaps                 |
| `base`  | 16px   | **Standard** — card padding, section gaps      |
| `lg`    | 20px   | Screen horizontal padding                      |
| `xl`    | 24px   | Between sections                               |
| `2xl`   | 32px   | Major section spacing                          |
| `3xl`   | 40px   | Screen top padding, hero spacing               |
| `4xl`   | 48px   | Tab bar height, large hero areas               |

### Layout Constants

| Element                 | Value                        |
| :---------------------- | :--------------------------- |
| Screen horizontal pad   | `20px` (lg)                  |
| Card internal padding   | `16px` (base)                |
| Grid gap (product grid) | `12px` (md)                  |
| Grid columns            | 2 (phone), 3 (tablet)       |
| Product card width      | `(screen - 2×20 - 12) / 2`  |
| Bottom tab bar height   | `64px` + safe area           |
| Search bar height       | `48px`                       |
| Filter chip height      | `36px`                       |
| Button height (primary) | `52px`                       |
| Button height (small)   | `40px`                       |
| Touch target minimum    | `44px × 44px`                |
| Image aspect ratio      | `4:3` (product cards)        |
| Hero image height       | `300px` or `40%` of screen   |

---

## Border Radius

| Token        | Value  | Usage                                           |
| :----------- | :----- | :---------------------------------------------- |
| `none`       | 0      | —                                               |
| `sm`         | 8px    | Chips, small badges, input fields               |
| `md`         | 12px   | Buttons, notification cards                      |
| `lg`         | 16px   | Product cards, modal content                     |
| `xl`         | 20px   | Featured cards, image containers                 |
| `2xl`        | 24px   | Bottom sheet, large modals                       |
| `3xl`        | 28px   | Hero image corners (when not full-bleed)         |
| `full`       | 9999px | Avatars, pills, circular buttons, status dots    |

### Corner Rules
- **Cards**: always `lg` (16px)
- **Buttons**: always `md` (12px)
- **Inputs**: always `sm` (8px) — with 1px border
- **Images inside cards**: top corners match card radius, bottom corners 0 (for edge-to-edge)
- **Avatar**: always `full`
- **Tab bar**: top corners `2xl` (24px)

---

## Shadows & Elevation

| Level     | Shadow Definition                                                     | Usage                         |
| :-------- | :-------------------------------------------------------------------- | :---------------------------- |
| `none`    | none                                                                  | Flat elements                 |
| `sm`      | `0 1px 2px rgba(0,0,0,0.05)`                                         | Subtle lift — chips, inputs   |
| `md`      | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)`  | Cards, product tiles          |
| `lg`      | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)`| Floating elements, modals     |
| `xl`      | `0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.05)`| Bottom sheet, toast, overlays |

### Elevation Rules
- **Cards at rest**: `md`
- **Cards on press**: drop to `sm` (pressed-in effect)
- **Floating action buttons**: `lg`
- **Bottom tab bar**: `xl` (with top-only shadow)
- **Toast notifications**: `xl`
- **Modals/Bottom sheets**: `xl`
- Never combine shadow with a border on the same element

---

## Iconography

### Icon Library
Use **Lucide React Native** (`lucide-react-native`) — clean, consistent line icons that match the brand.

### Icon Sizes

| Size     | Pixels | Usage                              |
| :------- | :----- | :--------------------------------- |
| `xs`     | 16px   | Inline with small text, badges     |
| `sm`     | 20px   | List items, secondary actions      |
| `md`     | 24px   | **Default** — buttons, nav, cards  |
| `lg`     | 28px   | Tab bar icons                      |
| `xl`     | 32px   | Feature icons, empty states        |
| `2xl`    | 48px   | Hero/impact dashboard icons        |

### Icon Color Rules
- **Active/Primary**: `primary-500` (`#22C55E`)
- **Inactive/Muted**: `neutral-400` (`#A3A3A3`)
- **On dark background**: `neutral-0` (`#FFFFFF`)
- **Destructive**: `danger` (`#EF4444`)
- **Informational**: `info` (`#3B82F6`)
- Tab bar icons: `primary-700` active, `neutral-400` inactive
- Icons in buttons inherit button text color
- Stroke width: **1.5px** (consistent across all icons)

---

## Component Specifications

### Product Card (Grid)

```
┌─────────────────────────┐
│  ┌─────────────────────┐│  ← Image (4:3 ratio, rounded-xl top)
│  │                     ││
│  │     [Product Img]   ││
│  │                     ││
│  │  ┌──────┐           ││  ← Discount badge (top-left, overlap)
│  │  │ -40% │           ││     bg: danger, text: white, rounded-sm
│  │  └──────┘           ││
│  │           ┌───┐     ││  ← Freshness dot (top-right)
│  │           │ 🟢│     ││
│  └───────────┴───┘─────┘│
│  Product Name            │  ← heading-sm, neutral-800, max 2 lines
│  Seller Name · 0.3 km   │  ← body-sm, neutral-400
│  ┌────────┐              │
│  │$4.99   │ $8.99        │  ← price-lg green + price-original strikethrough
│  └────────┘              │
│  ┌──────────────────┐    │  ← Freshness badge
│  │ 🕐 Expires in 2d │    │     Uses freshness status colors
│  └──────────────────┘    │
└─────────────────────────┘   ← Card: bg white, shadow-md, rounded-lg
```

**States**:
- **Default**: shadow-md
- **Pressed**: scale(0.97), shadow-sm, 100ms ease-out
- **Loading (skeleton)**: Pulsing neutral-100 → neutral-200, no content

---

### Product Card (List)

```
┌──────────────────────────────────────────┐
│  ┌────────┐                              │
│  │        │  Product Name                │  ← heading-sm
│  │  Img   │  Seller · 0.3 km · ⭐ 4.8   │  ← body-sm, neutral-400
│  │ (1:1)  │  $4.99  $8.99   [-40%]       │  ← price + badge
│  │        │  🕐 Expires in 2d            │  ← freshness
│  └────────┘                              │
└──────────────────────────────────────────┘
```

---

### Button Variants

| Variant     | Background       | Text Color   | Border         | Use Case                   |
| :---------- | :--------------- | :----------- | :------------- | :------------------------- |
| `primary`   | `primary-500`    | `#FFFFFF`    | none           | Main CTAs (Add to Cart)    |
| `secondary` | `transparent`    | `primary-500`| 1.5px primary  | Buy Now, secondary actions |
| `ghost`     | `transparent`    | `neutral-600`| none           | Tertiary, cancel           |
| `danger`    | `danger`         | `#FFFFFF`    | none           | Remove, delete             |
| `disabled`  | `neutral-200`    | `neutral-400`| none           | Inactive states            |

**All Buttons**:
- Height: 52px (standard), 40px (small)
- Border radius: `md` (12px)
- Font: `body-lg` Semi 600
- Press animation: scale(0.97), opacity(0.9), 100ms
- Icon + text: 8px gap between icon and label

---

### Search Bar

```
┌──────────────────────────────────────────┐
│  🔍  Search for rescued products...      │
└──────────────────────────────────────────┘
```

- Height: 48px
- Background: `neutral-100`
- Border: 1px `neutral-200` (resting), 1px `primary-500` (focused)
- Border radius: `sm` (8px)
- Icon: `neutral-400` → `primary-500` on focus
- Text: `body-md`, `neutral-600`
- Placeholder: `body-md`, `neutral-300`
- Debounce: 300ms

---

### Filter Chip

| State      | Background     | Text          | Border         |
| :--------- | :------------- | :------------ | :------------- |
| `inactive` | `neutral-0`    | `neutral-600` | 1px neutral-200|
| `active`   | `primary-50`   | `primary-700` | 1px primary-300|

- Height: 36px
- Border radius: `full` (pill)
- Padding: 12px horizontal
- Font: `badge` (11px, Semi 600)
- Transition: 200ms ease, with slight scale bounce

---

### Cart Item

```
┌──────────────────────────────────────────────────┐
│  ┌────────┐                                      │
│  │        │  Product Name              [🗑️]     │
│  │  Img   │  Expires in 2d                       │
│  │ (1:1)  │  ┌───┬─────┬───┐                     │
│  │  80px  │  │ - │  2  │ + │   $9.98             │
│  │        │  └───┴─────┴───┘   ($4.99 × 2)       │
│  └────────┘                                      │
└──────────────────────────────────────────────────┘
```

- Swipe-to-delete with red background reveal
- Quantity stepper: 32px buttons, `primary-500` border, `primary-50` bg

---

### Notification Item

```
┌──────────────────────────────────────────────────┐
│  ┌────┐                                          │
│  │ 🟢 │  New listings near you!         2h ago   │
│  │icon│  3 fresh items just added in your area   │
│  └────┘                                          │
└──────────────────────────────────────────────────┘
```

- Unread: `primary-50` background + left accent bar (3px, `primary-500`)
- Read: `neutral-0` background, no accent
- Swipe to dismiss

---

### Toast Notification

```
                ┌───────────────────────────────┐
                │  ✅  Added to cart!            │
                │      Organic Yogurt × 1       │
                └───────────────────────────────┘
```

- Position: bottom, slightly above the bottom navigation bar
- Background: `neutral-900` with 95% opacity (dark glass)
- Text: `neutral-0`
- Border radius: `md` (12px)
- Shadow: `xl`
- Auto-dismiss: 2.5 seconds
- Entry: slide up + fade in (300ms spring)
- Exit: slide down + fade out (200ms ease-out)
- Gesture: swipe down, left, or right to dismiss

---

### Impact Dashboard (Profile)

```
┌──────────────────────────────────────────┐
│       ┌──────────────────────┐           │
│       │  🌱 Your Impact      │           │
│       └──────────────────────┘           │
│                                          │
│   ┌─────────┐  ┌─────────┐              │
│   │  12     │  │  4.8kg  │              │
│   │  Meals  │  │  CO₂    │              │
│   │ Rescued │  │  Saved  │              │
│   └─────────┘  └─────────┘              │
│   ┌─────────┐  ┌─────────┐              │
│   │  $47    │  │  8 🔥   │              │
│   │  Money  │  │  Day    │              │
│   │  Saved  │  │ Streak  │              │
│   └─────────┘  └─────────┘              │
│                                          │
│   bg: impact-gradient                    │
│   numbers: display-lg, white             │
│   labels: body-sm, white/70%             │
└──────────────────────────────────────────┘
```

- Card background: `impact-gradient`
- Animated count-up on mount (1.2s, ease-out)
- Each stat tile: slight glassmorphism effect

---

## Motion & Animation

### Timing Tokens

| Token       | Duration | Easing                   | Usage                           |
| :---------- | :------- | :----------------------- | :------------------------------ |
| `instant`   | 100ms    | ease-out                 | Button press, toggle            |
| `fast`      | 200ms    | ease-out                 | Chip select, color transitions  |
| `normal`    | 300ms    | ease-in-out              | Page transitions, modal show    |
| `slow`      | 500ms    | ease-in-out              | Complex animations, counters    |
| `spring`    | 300ms    | spring(1, 80, 10)        | Bouncy feedback, badge bump     |

### Screen Transitions
- **Stack push**: Slide from right (native default), 300ms
- **Stack pop**: Slide to right (native default), 300ms
- **Modal present**: Slide up from bottom, 300ms ease-out
- **Modal dismiss**: Slide down, 200ms ease-in
- **Tab switch**: Cross-fade, 200ms (no slide)

### Micro-Interactions

| Interaction            | Animation                                           |
| :--------------------- | :-------------------------------------------------- |
| Card press             | `scale(0.97)`, `shadow-sm`, 100ms ease-out          |
| Card release           | `scale(1.0)`, `shadow-md`, 200ms spring             |
| Add to cart             | Button morphs to checkmark, 300ms → resets 1s later |
| Cart badge update       | Scale bounce `1.0 → 1.3 → 1.0`, 300ms spring       |
| Pull-to-refresh         | Custom leaf/sprout icon that "grows" as pulled       |
| Skeleton shimmer        | Left-to-right gradient sweep, 1.5s, infinite loop   |
| Impact counter          | Count-up from 0, 1.2s, ease-out deceleration        |
| Toast appear            | Slide Y: 20 → 0, opacity 0 → 1, 300ms spring       |
| Toast dismiss           | Slide Y: 0 → 80, opacity 1 → 0, 200ms ease-out     |
| Tab icon active         | Scale `1.0 → 1.15 → 1.0`, 200ms spring              |
| Freshness dot           | Gentle pulse `opacity 0.5 → 1.0`, 2s, infinite      |
| Checkout success        | Confetti/leaf particle burst, 1.5s                   |
| Swipe-to-delete reveal  | Red bg slides in from right, 200ms                   |

---

## Screen Layout Templates

### Standard List Screen (Home, Notifications)

```
┌──────────────────────────────────────────┐
│  Status Bar                     safe top │
├──────────────────────────────────────────┤
│  Header (greeting / title)       40–48px │
│  ──────────────────────────────────────  │
│  Search Bar                        48px  │
│  ──────────────────────────────────────  │
│  Filter Chips (horizontal scroll) 36px   │
│  ──────────────────────────────────────  │
│                                          │
│  Section Title ("Expiring Today")        │
│  ┌────┐ ┌────┐ ┌────┐ → horizontal      │
│  └────┘ └────┘ └────┘   scroll           │
│                                          │
│  Section Title ("All Products")          │
│  ┌──────┐ ┌──────┐                       │
│  │      │ │      │  ← 2-col grid         │
│  │      │ │      │                       │
│  └──────┘ └──────┘                       │
│  ┌──────┐ ┌──────┐                       │
│  │      │ │      │                       │
│  └──────┘ └──────┘                       │
│  ... infinite scroll ...                 │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Tab Bar            64px + safe   │
└──────────────────────────────────────────┘
```

### Detail Screen (Product Detail)

```
┌──────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐│
│  │                                      ││
│  │          Hero Image (40%)            ││
│  │                                      ││
│  │  [← Back]              [♡ Save]      ││
│  │                                      ││
│  │  ┌──────┐                            ││
│  │  │ -40% │              gradient scrim││
│  │  └──────┘                            ││
│  └──────────────────────────────────────┘│
│                                          │
│  Product Name (heading-lg)               │
│  ┌────────────────────────┐              │
│  │ Freshness Badge        │              │
│  └────────────────────────┘              │
│                                          │
│  $4.99   $8.99   You save $4.00          │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ Seller Card (avatar, name, rating)   ││
│  └──────────────────────────────────────┘│
│                                          │
│  Quantity:  [−]  2  [+]   Only 3 left!   │
│                                          │
│  Impact: Buying this saves ~0.8 kg CO₂   │
│                                          │
│  ▸ Why it's on Reshelf (collapsible)     │
│                                          │
│  ┌──────────────┐ ┌───────────────┐      │
│  │  Add to Cart  │ │   Buy Now     │      │
│  │   (primary)   │ │  (secondary)  │      │
│  └──────────────┘ └───────────────┘      │
│                            safe bottom   │
└──────────────────────────────────────────┘
```

### Cart Screen

```
┌──────────────────────────────────────────┐
│  Cart (heading-lg)          Clear All    │
├──────────────────────────────────────────┤
│                                          │
│  [Cart Item 1]                           │
│  [Cart Item 2]                           │
│  [Cart Item 3]                           │
│                                          │
├──────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐│
│  │ 🎉 You're saving $12.50 and         ││
│  │    rescuing 3 items from waste!      ││
│  └──────────────────────────────────────┘│
│                                          │
│  Subtotal                       $14.97   │
│  Delivery Fee                    $2.99   │
│  Eco-discount                   −$1.00   │
│  ──────────────────────────────────────  │
│  Total                          $16.96   │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │         Proceed to Checkout          ││
│  │           (primary, full)            ││
│  └──────────────────────────────────────┘│
│                            safe bottom   │
└──────────────────────────────────────────┘
```

---

## Accessibility Checklist

- [ ] All text meets **WCAG AA** contrast ratio (4.5:1 for body, 3:1 for large text)
- [ ] All interactive elements have `accessibilityLabel` and `accessibilityRole`
- [ ] Touch targets ≥ **44×44px**
- [ ] Focus order follows visual reading order
- [ ] Color is **never the sole indicator** — always paired with text/icon
- [ ] Animations respect `prefers-reduced-motion` (use `useReducedMotion` hook)
- [ ] Screen reader can navigate all screens meaningfully

---

## NativeWind / Tailwind Config Mapping

```js
// tailwind.config.js — must mirror these tokens exactly
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',  // main
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        success:       '#22C55E',
        'success-light': '#F0FDF4',
        warning:       '#F59E0B',
        'warning-light': '#FFFBEB',
        danger:        '#EF4444',
        'danger-light': '#FEF2F2',
        info:          '#3B82F6',
        'info-light':  '#EFF6FF',
        impact:        '#8B5CF6',
        'impact-light': '#F5F3FF',
      },
      fontFamily: {
        display: ['Outfit_700Bold'],
        heading: ['Outfit_600SemiBold'],
        body:    ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '40px' }],
        'display-md': ['28px', { lineHeight: '36px' }],
        'heading-lg': ['24px', { lineHeight: '32px' }],
        'heading-md': ['20px', { lineHeight: '28px' }],
        'heading-sm': ['18px', { lineHeight: '24px' }],
        'body-lg':    ['16px', { lineHeight: '24px' }],
        'body-md':    ['14px', { lineHeight: '20px' }],
        'body-sm':    ['12px', { lineHeight: '16px' }],
        'body-xs':    ['10px', { lineHeight: '14px' }],
      },
      borderRadius: {
        'sm':   '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '20px',
        '2xl':  '24px',
        '3xl':  '28px',
        'full': '9999px',
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '12px',
        'base': '16px',
        'lg':  '20px',
        'xl':  '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
      },
      boxShadow: {
        'sm':  '0 1px 2px rgba(0,0,0,0.05)',
        'md':  '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'lg':  '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'xl':  '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.05)',
      },
    },
  },
};
```

---

## Dark Mode (Future)

> Not in scope for v1 prototype, but the design system is structured for easy adoption.

| Light Token        | Dark Equivalent    |
| :----------------- | :----------------- |
| `neutral-0`        | `neutral-900`      |
| `neutral-50`       | `neutral-800`      |
| `neutral-100`      | `neutral-700`      |
| `neutral-200`      | `neutral-600`      |
| `neutral-800`      | `neutral-100`      |
| `neutral-900`      | `neutral-50`       |
| `primary-500`      | `primary-400`      |
| Shadows            | Subtle glow effect |

---

## File: `src/constants/theme.ts`

This file should export all tokens programmatically for use in components that can't use NativeWind classes:

```typescript
export const Colors = { /* mirror color tokens */ };
export const Typography = { /* font sizes, weights, families */ };
export const Spacing = { /* spacing scale */ };
export const Radii = { /* border radius tokens */ };
export const Shadows = { /* shadow definitions (Platform-specific) */ };
export const Animation = { /* timing tokens */ };
```

> Every component must import from `theme.ts` or use NativeWind classes — **never hardcode values**.
