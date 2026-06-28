# Reshelf

High-fidelity Expo prototype for a circular economy marketplace that helps users buy near-expiry local products at a discount.

## Run

```bash
npm install
npm start
```

Then open the Expo URL in Expo Go or run the web target:

```bash
npm run web
```

## Included

- Expo SDK 54, React Native, TypeScript strict mode
- NativeWind/Tailwind token mapping from `SYSTEM_DESIGN.md`
- Zustand stores for cart, user, products, and notifications
- Mock API with 300-600ms latency
- Home, Explore, Product Detail, Cart, Notifications, and Profile screens
- Mock checkout success flow, toast feedback, loading/empty states, filters, search, pagination, and impact stats
