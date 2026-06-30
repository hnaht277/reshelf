# Reshelf

Reshelf is a high-fidelity Expo prototype for a circular-economy marketplace. It helps people discover discounted local products approaching their best-before dates, purchase them through a simulated checkout, and track the waste and CO2 they have avoided.

> **Prototype status:** the catalog, account, orders, notifications, password reset, and checkout are mocked in the client. There is no backend, payment processor, email service, or push-notification service. Changes are held in memory and reset after a full app reload.

## Problem statement

How might we build an inclusive circular ecosystem in Ho Chi Minh City that transforms surplus goods into economic opportunities for vulnerable families while protecting the environment?

## Solution overview

GreenCart is a circular ecosystem marketplace connecting businesses with consumers to redistribute surplus and near-expiry FMCG products through existing delivery ecosystems.

## Features

- **Product discovery:** searchable Home and Explore experiences, category filters, grid/list layout preference, expiring-today carousel, pull-to-refresh, and infinite-scroll-style pagination.
- **Personalized recommendations:** local "AI picks" based on seeded order history, category affinity, seller affinity, discount, distance, and recency.
- **Product details:** product hero image, freshness badge, discount and savings display, seller verification, stock-aware quantity selector, save item, add to cart, buy now, impact preview, and "Why it is on Reshelf" explanation.
- **Cart and checkout:** cart item quantity management, remove and clear actions, savings/CO2 summary, mock delivery address selection, promo codes, checkout success, and session impact updates.
- **Saved items:** save products from detail pages, browse saved rescues, remove saved items, and add saved products back to cart.
- **Notifications:** grouped notifications, unread count badge, mark read, mark all read, swipe-to-delete, and undo toast.
- **Profile and impact:** editable profile information, impact dashboard, eco badges, order history, saved items, settings, help, and about pages.
- **Order management:** seeded order history, active/completed filters, order detail timeline, pickup code, seller pickup information, payment summary, and order-again flow.
- **Authentication prototype:** sign in, forgot password, reset password, change password, and sign out with in-memory mock account state.
- **Settings:** product layout preference, notification preferences, password change, and sign out.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or newer (the minimum for Expo SDK 54)
- npm, included with Node.js
- Git
- Internet access for dependency installation, remote product images, and Google Fonts
- One way to open the app:
  - Android or iOS device with [Expo Go](https://expo.dev/go)
  - Android Studio and an Android emulator
  - macOS with Xcode and an iOS Simulator
  - A modern browser for the web target

Cloud builds additionally require an [Expo account](https://expo.dev/signup). iOS simulator and local iOS development require macOS.

No `.env` file, database, or external API credentials are required.

## Installation

```bash
git clone <repository-url>
cd reshelf
npm ci
```

Use `npm ci` for a reproducible install from `package-lock.json`. Use `npm install` only when intentionally changing dependencies.

Verify the TypeScript project after installation:

```bash
npm run typecheck
```

## Run the app

### Local development

Start the Expo development server:

```bash
npm start
```

The terminal displays a QR code and interactive shortcuts. Scan the QR code with Expo Go, or press:

- `a` for an Android emulator
- `i` for an iOS Simulator (macOS only)
- `w` for the browser

The equivalent direct commands are:

```bash
npm run android
npm run ios
npm run web
```

The computer and physical device should normally be on the same network. If the bundler cache becomes stale, restart with:

```bash
npx expo start --clear
```

### Remote device through a cloud-accessible tunnel

Use an Expo tunnel when the phone cannot reach the development machine over the local network:

```bash
npm install --global @expo/ngrok
npx expo start --tunnel
```

The JavaScript bundler still runs on the development machine, so keep the terminal open. The tunnel is intended for development and demonstrations, not production hosting.

## User guide

### Sign in

Use the pre-filled prototype account:

```text
Email:    minhanh.nguyen@example.com
Password: reshelf123
```

The **Forgot password** flow is also simulated. Submit the prototype email and use the reset code shown by the app; no email is sent.

### Find and *rescue* a product

1. On **Home**, search the catalog, select a category, switch between grid and list layouts, or open an expiring-today or personalized suggestion.
2. Use **Explore** for a simpler searchable and filterable catalog view.
3. Open a product to review its price, expiry information, seller, stock, and estimated CO2 saving. Tap the heart to save it.
4. Select a quantity and choose **Add to Cart** or **Buy Now**.
5. In **Cart**, adjust quantities, swipe an item for actions, remove products, and review savings, fees, and impact.
6. Select **Proceed to Checkout**, choose a mock address, and optionally apply `RESCUE20` or `GREEN10`.
7. Tap **Place order**. No real payment or delivery request is made. The cart is cleared and the current session's impact totals are updated.

### Other areas

- **Notifications:** tap an item to mark it read, mark all items read, or swipe to delete and undo.
- **Profile:** edit the mock profile and view impact totals and badges.
- **Order History:** inspect seeded example orders and add their products back to the cart.
- **Saved Items:** review products marked with the heart icon.
- **Settings:** change the product layout, toggle notification preferences, change the in-memory password, or sign out.
- **Help / About:** view prototype support and product information.

The “AI picks” section does not call an AI service. It uses a deterministic local scoring function based on the seeded order history, category and seller affinity, discount, distance, and recency.

## Tech stack

| Area | Technology |
| --- | --- |
| Application | Expo SDK 54, React 19, React Native 0.81 |
| Language | TypeScript 5.9 in strict mode |
| Navigation | React Navigation native stack and bottom tabs |
| State | Zustand stores |
| Styling | React Native `StyleSheet`, NativeWind 5 preview, Tailwind CSS 4 |
| UI | Lucide icons, Expo Linear Gradient, Inter and Outfit fonts |
| Gestures and layout | React Native Gesture Handler, Reanimated, Safe Area Context |
| Builds | Expo CLI and EAS Build |

## Architecture

```text
App.tsx
  -> providers, fonts, global styles, toast host
  -> AppNavigator
       -> authentication stack
       -> authenticated stack
            -> bottom tabs
            -> detail, checkout, profile-related screens

Screens and components
  -> Zustand stores
       -> mock service layer
            -> local product and notification fixtures
  -> local order fixtures and recommendation utility
```

- `App.tsx` initializes fonts and the top-level gesture, safe-area, navigation, and toast UI.
- `src/navigation/` defines the authentication gate, root stack, and five-tab application shell.
- `src/screens/` owns screen-level presentation and interaction logic.
- `src/components/` contains reusable product, cart, feedback, loading, and UI primitives.
- `src/store/` contains independent Zustand stores for the user session, catalog, cart, saved products, notifications, and toasts. The stores do not use persistence middleware.
- `src/services/api.ts` is an asynchronous mock boundary with artificial 300–600 ms latency. It is the intended seam for a future real API client.
- `src/data/` contains static products, orders, and notifications; `src/utils/recommendations.ts` computes local recommendations.
- `src/constants/theme.ts`, `tailwind.config.js`, and `SYSTEM_DESIGN.md` define the visual system. Most components currently use typed `StyleSheet` tokens, with NativeWind configured for utility-class use.
- `app.json` holds Expo application metadata, while `eas.json` defines development, internal preview, and production cloud-build profiles.

Product and notification reads flow from fixtures through the mock service into Zustand and then into screens. Cart, authentication, saved items, settings, and profile edits update Zustand directly. Because storage and server synchronization are intentionally absent, restarting the JavaScript runtime restores the seeded state.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the interactive Expo development server |
| `npm run android` | Start Expo and open Android |
| `npm run ios` | Start Expo and open iOS |
| `npm run web` | Start Expo for the browser |
| `npm run typecheck` | Run TypeScript without emitting files |

There is currently no automated test or lint script.
