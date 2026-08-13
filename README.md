# Flux Market

A React + Vite + Tailwind marketplace UI.

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Project structure

```
flux-market/
├── index.html              Vite entry HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx             React root — mounts <App />
    ├── App.jsx               Top-level state (cart, wishlist, routing) + layout
    ├── index.css             Tailwind directives + token import
    ├── styles/
    │   └── tokens.css        CSS variables, fonts, animations, design tokens
    ├── data/
    │   └── products.js       CATEGORIES, PRODUCTS, catColor()/catIcon() helpers
    ├── utils/
    │   └── format.js         money(), uid()
    ├── components/           Reusable, presentational pieces
    │   ├── Logo.jsx
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Ticker.jsx
    │   ├── Toast.jsx
    │   ├── Hero.jsx
    │   ├── KineticHeadline.jsx
    │   ├── CategoryRail.jsx
    │   ├── CategoryGlyph.jsx
    │   ├── ProductCard.jsx
    │   ├── SectionHeading.jsx
    │   └── Stars.jsx
    └── pages/                One file per screen, rendered by App.jsx
        ├── HomePage.jsx
        ├── ShopPage.jsx
        ├── ProductPage.jsx
        ├── CartPage.jsx
        ├── CheckoutPage.jsx
        ├── AccountPage.jsx
        └── WishlistPage.jsx
```

App.jsx currently does simple state-based "routing" (a `page` string + `go(page)`),
no react-router. That's easy to swap out later if the app grows.

## Adding new features later

- **New page** → add a file in `src/pages/`, import it in `App.jsx`, add a
  `{page === "yourpage" && <YourPage ... />}` line and a nav entry in `Header.jsx`.
- **New reusable UI piece** → add it to `src/components/`.
- **New product data / categories** → edit `src/data/products.js`.
- **New global styles / colors** → edit `src/styles/tokens.css` (CSS variables live in `:root`).
- **Persisting cart/wishlist** → currently in-memory React state in `App.jsx`; swap
  `useState` for `localStorage`-backed state or a store (Zustand/Redux) without touching pages.
- **Real routing / URLs** → replace the `page` state + `go()` calls with `react-router-dom`;
  since each screen is already its own component, this is a route-table swap, not a rewrite.
