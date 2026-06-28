# Reshelf — Build Prompt

> A circular economy mobile app connecting users with local sellers offering near-expiry products (food, groceries, cosmetics) at discounted prices. Think **Too Good To Go meets a modern marketplace** — with a strong sustainability mission baked into every pixel.

---

## Tech Stack (exact)

| Layer            | Technology                                       |
| :--------------- | :----------------------------------------------- |
| Framework        | React Native + **Expo SDK 54** (Expo Go compat.) |
| Styling          | **NativeWind** (TailwindCSS v4)                  |
| State Management | **Zustand**                                      |
| Navigation       | **React Navigation** (stack + bottom tabs)       |
| Language         | TypeScript (strict)                              |
| Backend          | None — all data mocked with simulated latency    |

---

## Design Philosophy

> **"Fresh, trustworthy, rewarding."**
> The app should feel like opening a window into a farmers market — bright, alive, and honest. Every screen must reinforce the sustainability mission while feeling premium and modern.

- **Refer to [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md)** for the full design system (colors, typography, spacing, component specs, animations, iconography).
- Every screen must draw from the shared design tokens — no ad-hoc colors, font sizes, or spacing.

### Key Design Principles

1. **Eco-Luxury** — Sustainable doesn't mean cheap-looking. Use premium materials: glassmorphism, smooth gradients, polished micro-interactions.
2. **Trust through Transparency** — Expiry dates, freshness indicators, and seller verification badges must be prominent and non-alarmist.
3. **Reward the Mission** — Every purchase saves food. Make the user *feel* that impact (CO₂ saved, meals rescued, money saved).
4. **Calm Urgency** — Near-expiry creates natural urgency. Use countdown timers and availability badges, but never dark patterns.

---

## Core Screens & Features

### 1. Home / Product Listing

- **Greeting header** with user's first name + eco-impact summary (e.g., "You've rescued 12 meals 🌱")
- **Search bar** with debounced input (300ms) and recent search suggestions
- **Category filter chips** — scrollable horizontal: `All`, `Food`, `Beverages`, `Dairy`, `Bakery`, `Personal Care`, `Household`
- **"Expiring Today" carousel** — horizontal scroll, countdown timer on each card, pulsing green dot for "still available"
- **Product grid/list toggle** — default grid, persisted preference
- **Infinite scroll** with fake pagination (10 items/page, 300–600ms simulated load)
- **Pull-to-refresh** with custom eco-themed animation
- **Empty/loading states** with skeleton screens (not spinners)

### 2. Product Detail

- **Hero image** with parallax-like scroll, discount badge overlay (e.g., "-40%"), and a subtle gradient scrim for text readability
- **Freshness indicator** — visual bar or tag: `Fresh`, `Expiring Soon`, `Last Day` with appropriate color coding (green → amber → red)
- **Price block** — original price (strikethrough), discounted price (large, bold, green), savings amount
- **Expiry date** — human-readable ("Expires in 2 days") + exact date
- **Seller card** — avatar, name, rating, distance, verified badge
- **Quantity selector** — stepper with stock awareness ("Only 3 left!")
- **Action buttons** — "Add to Cart" (primary) + "Buy Now" (secondary outline)
- **"Why it's on Reshelf"** collapsible section — brief explanation of circular economy value
- **Impact preview** — "Buying this saves ~0.8 kg CO₂"

### 3. Cart

- **Item list** with swipe-to-delete + quantity stepper
- **Price breakdown** — subtotal, estimated delivery fee (mock), eco-discount line, total
- **Savings callout** — "You're saving $12.50 and rescuing 3 items from waste! 🎉"
- **"Proceed to Checkout"** → mock checkout flow → animated success screen with confetti/leaf animation
- **Empty cart state** — friendly illustration + "Start rescuing food" CTA

### 4. Notifications

- **Grouped by time** — Today, Yesterday, Earlier
- **Notification types** (with distinct icons):
  - 🟢 New listings nearby
  - 🔵 Price drops on saved items
  - 🟡 Expiry alerts ("Your saved item expires tomorrow!")
  - 🟣 Order updates
  - 🌱 Impact milestones ("You rescued 10 meals!")
- **Swipe to dismiss**, mark all as read
- **Empty state** — "All caught up! 🌿"

### 5. Profile

- **User card** — avatar, name, member since date
- **Impact dashboard** — animated counters for: Meals Rescued, CO₂ Saved (kg), Money Saved ($), streak days
- **Quick links** — Order History, Saved Items, Settings, Help, About Reshelf
- **Eco-badge system** — earned badges based on milestones (e.g., "First Rescue", "Weekly Warrior", "100 Meals Saved")

### 6. Bottom Tab Navigation

| Tab           | Icon        | Badge Logic                |
| :------------ | :---------- | :------------------------- |
| Home          | 🏠 house    | —                          |
| Explore       | 🔍 search   | —                          |
| Cart          | 🛒 cart     | Item count (animated bump) |
| Notifications | 🔔 bell     | Unread count               |
| Profile       | 👤 person   | Eco-badge dot when new     |

- Active tab: filled icon + accent color + subtle scale animation
- Inactive tab: outlined icon + muted color
- Floating effect with soft shadow, rounded pill shape or soft-edge bar

---

## State Management (Zustand)

```
stores/
├── useCartStore.ts      — add, remove, updateQty, clear, computed totals
├── useUserStore.ts      — mock user data, impact stats, preferences
├── useProductStore.ts   — products list, filters, search query, pagination
└── useNotificationStore.ts — notifications list, unread count, markAsRead
```

---

## Data & Mocking

### Products (`data/products.ts`)
- **20 realistic products** with: `id`, `name`, `price`, `originalPrice`, `discount`, `expiryDate`, `category`, `seller` (name, rating, distance, verified), `imageUrl` (Unsplash/Picsum), `stock`, `co2Savings`, `description`
- Mix of categories: bakery, dairy, produce, beverages, personal care, household
- Expiry dates ranging from today to +7 days

### API Simulation (`services/api.ts`)
- All functions return `Promise` with 300–600ms random delay
- Functions: `getProducts(page, filters)`, `getProductById(id)`, `searchProducts(query)`, `getNotifications()`, `checkout(cart)`
- Simulate occasional empty results for edge-case testing

---

## Project Structure

```
/src
  /assets           — icons, illustrations, lottie files
  /components        — reusable UI (ProductCard, SearchBar, CartItem, Badge, etc.)
    /ui              — base components (Button, Input, Card, Chip, etc.)
  /screens           — screen components (one per route)
  /navigation        — stack + tab navigators
  /store             — zustand stores
  /services          — api.ts (mock API layer)
  /constants         — design tokens (re-exported from SYSTEM_DESIGN)
  /hooks             — custom hooks (useDebounce, useCountdown, etc.)
  /types             — TypeScript interfaces & types
  /utils             — helpers (formatCurrency, formatTimeLeft, etc.)
App.tsx
tailwind.config.js   — NativeWind config (colors, fonts, spacing from design system)
```

---

## Quality Requirements

- ✅ Fully functional in **Expo Go** — no native modules requiring ejection
- ✅ Strict TypeScript — no `any` types
- ✅ Reusable, well-commented components
- ✅ Skeleton loading states (no bare spinners)
- ✅ Meaningful empty states with illustrations and CTAs
- ✅ Pull-to-refresh on all list screens
- ✅ Toast notifications for user actions (add to cart, checkout, etc.)
- ✅ Responsive layout — works on small (iPhone SE) to large (iPad) screens
- ✅ Accessibility — proper labels, contrast ratios, touch target sizes ≥ 44pt
- ✅ Consistent design language — all styles from `SYSTEM_DESIGN.md` tokens

---

## What This Is NOT

This is a **high-fidelity prototype**, not a production app. Focus on:
- 🎯 Exceptional UX and visual polish
- 🎯 Clean, maintainable code architecture
- 🎯 Realistic-feeling interactions (loading, transitions, haptics)

Do NOT worry about:
- ❌ Real backend or authentication
- ❌ Push notifications infrastructure
- ❌ Payment processing
- ❌ Complex error recovery
