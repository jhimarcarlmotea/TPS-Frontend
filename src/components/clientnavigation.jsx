// src/components/clientnavigation.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth para sa client-facing navigation.
//
// Hindi naka-sign in  -> Home, About, Services, Contact lang
// Naka-sign in        -> lahat (kasama ang Book Session at My appointments)
//
// Sa CLIENT_NAV: lagyan ng  auth: true  ang link na para sa naka-sign in lang.
//   to      -> link kapag hindi naka-sign in (o kung walang authTo)
//   authTo  -> (optional) ibang link kapag naka-sign in na
//   "/#section" -> anchor sa Home page, "/path" -> React Router route
// ─────────────────────────────────────────────────────────────────────────────
import { getToken, getUser } from "../auth";

export const CLIENT_NAV = [
  { label: "Home", to: "/#top" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Book Session", to: "/book", auth: true },
  // Guest: "Message the clinic" section sa Home. Naka-sign in: Contact page.
  // Kung gusto mong sa Home section pa rin kahit naka-sign in, tanggalin ang authTo.
  { label: "Contact", to: "/#inquiry", authTo: "/contact" },
];

// "My appointments" (naka-sign in lang)
export const MY_APPOINTMENTS = {
  label: "My appointments",
  to: "/appointments",
};

// Primary CTA button (navbar at hero). Kapag guest, sa sign in/register ang punta.
export const CTA_BUTTON = {
  label: "Get Started",
  to: "/book",
  guestTo: "/signin",
};

export const isSignedIn = () => Boolean(getToken() && getUser());

// Ito ang gamitin ng Navbar at Footer sa Layout.jsx
export function getClientNav() {
  const authed = isSignedIn();
  return {
    authed,
    nav: CLIENT_NAV.filter((item) => authed || !item.auth).map((item) => ({
      label: item.label,
      to: authed && item.authTo ? item.authTo : item.to,
    })),
    myAppointments: authed ? MY_APPOINTMENTS : null,
    cta: { label: CTA_BUTTON.label, to: authed ? CTA_BUTTON.to : CTA_BUTTON.guestTo },
  };
}