// src/components/navConfig.js
// Non-component exports live here so Layout.jsx can stay pure components
// and Fast Refresh (HMR) works without a full page reload.

export const NAV = [
  { label: "Home", to: "/#top" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Book Session", to: "/book" },
  { label: "Contact", to: "/contact" },
];