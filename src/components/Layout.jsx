import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getClientNav } from "./clientnavigation";
import { logout } from "../auth";
import { CLINIC } from "../data/clinic";
import ProfileMenu from "./ProfileMenu";
import LegalModal from "./LegalModals";

/* ---------- Shared Tailwind helpers ---------- */
export const container =
  "w-[min(1240px,calc(100%-clamp(40px,10vw,160px)))] mx-auto relative z-10";

export const btnBase =
  "inline-flex items-center justify-center h-[42px] px-[22px] rounded-lg border border-black text-[15px] whitespace-nowrap transition-[transform,background,box-shadow,color] duration-250 ease-tf active:scale-[0.98] active:translate-y-0";

export const btnSolid = `${btnBase} bg-tf-navy text-white border-none hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_rgba(24,28,59,0.55)] hover:text-white`;

export const btnGhost =
  `${btnBase} bg-transparent border-black/40 text-black hover:bg-black/5`;

export const btnSm = "h-[34px] px-4 text-sm";
export const btnLg = "h-12 px-7 text-base";

const navLinkClass =
  "relative py-1.5 transition-colors duration-200 hover:text-black aria-[current=page]:text-black max-[1100px]:py-3.5 max-[1100px]:border-b max-[1100px]:border-tf-line max-[1100px]:text-base after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-tf-teal after:scale-x-0 after:origin-left after:transition-transform after:duration-[350ms] after:ease-tf hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 max-[1100px]:after:hidden";

/* ---------- Built-in graphics ---------- */
export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <circle cx="20" cy="12" r="9" fill="#4a9b8e" opacity=".85" />
      <circle cx="12" cy="26" r="9" fill="#3d865b" opacity=".85" />
      <circle cx="28" cy="26" r="9" fill="#00a58a" opacity=".85" />
    </svg>
  );
}

export function Photo({ src, fallback = null, className, alt = "" }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img className={className} src={src} alt={alt} onError={() => setOk(false)} />
  ) : (
    fallback
  );
}

/* ---------- Auth-aware navigation ---------- */
const AUTH_EVENT = "tf-auth-change";

function useClientNav() {
  const [, bump] = useState(0);
  useEffect(() => {
    const on = () => bump((n) => n + 1);
    window.addEventListener(AUTH_EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(AUTH_EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return getClientNav();
}

export function AuthButton({ className, onDone }) {
  const navigate = useNavigate();
  const { authed } = useClientNav();

  if (authed) {
    return (
      <button
        className={className}
        onClick={async () => {
          await logout();
          window.dispatchEvent(new Event(AUTH_EVENT));
          onDone?.();
          navigate("/", { replace: true });
        }}
      >
        Sign Out
      </button>
    );
  }
  return (
    <Link to="/signin" className={className} onClick={onDone}>
      Sign In
    </Link>
  );
}

export function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 transition-[opacity,transform] duration-700 ease-tf [transition-delay:var(--d)] motion-reduce:opacity-100 motion-reduce:translate-none ${shown ? "opacity-100 translate-none" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub, align = "center" }) {
  return (
    <header
      className={`grid gap-3 ${align === "center" ? "text-center justify-items-center" : "text-left justify-items-start"
        }`}
    >
      <p className="m-0 text-[13px] font-bold tracking-[0.1em] text-tf-teal">{eyebrow}</p>
      <h2 className="m-0 text-[clamp(28px,3.4vw,40px)] font-normal leading-[1.15]">{title}</h2>
      {sub && (
        <p className="m-0 max-w-[560px] text-base leading-relaxed text-[#666d69]">{sub}</p>
      )}
    </header>
  );
}

/* ---------- Navigation (works from any page) ---------- */
function NavItem({ to, className, onClick, children }) {
  const { pathname } = useLocation();
  const href = to.startsWith("#") || to.startsWith("/") ? to : `/${to}`;
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  const current = !href.includes("#") && pathname === href;
  return (
    <Link to={href} className={className} onClick={onClick} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { nav, myAppointments } = useClientNav(); // Kinukuha natin ang myAppointments

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 bg-[#f8f8f8] border-b border-tf-line transition-shadow duration-300 relative ${scrolled ? "shadow-[0_6px_24px_-14px_rgba(0,0,0,0.35)]" : ""
        }`}
    >
      <ScrollToHash />
      <div className="w-[min(1360px,calc(100%-40px))] mx-auto h-[72px] flex items-center gap-6">
        
        {/* LOGO */}
        <Link
          to="/#top"
          className="flex items-center gap-2.5 font-serif text-tf-forest no-underline"
          aria-label="Threefold home"
        >
          <Photo
            src="/img/Threefold%20logo.png"
            className="h-[42px] w-[42px] shrink-0 object-contain"
            fallback={<Logo size={42} />}
          />
          <span className="flex flex-col gap-0.5">
            <strong className="text-sm tracking-[0.04em] font-normal">THREEFOLD</strong>
            <small className="text-[7px] leading-[1.3] max-w-[190px] max-[560px]:hidden">
              Behavioral Interventions And Psychological Services
            </small>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav
          className={`flex items-center gap-[clamp(16px,2.4vw,36px)] ml-auto text-sm text-[#666d69] max-[1100px]:absolute max-[1100px]:top-full max-[1100px]:inset-x-0 max-[1100px]:m-0 max-[1100px]:flex-col max-[1100px]:items-stretch max-[1100px]:gap-0 max-[1100px]:bg-[#f8f8f8] max-[1100px]:px-5 max-[1100px]:pt-2 max-[1100px]:pb-5 max-[1100px]:border-b max-[1100px]:border-tf-line max-[1100px]:transition-[clip-path,opacity] max-[1100px]:duration-[450ms] max-[1100px]:ease-tf ${open
              ? "max-[1100px]:[clip-path:inset(0_0_0_0)] max-[1100px]:opacity-100 max-[1100px]:pointer-events-auto"
              : "max-[1100px]:[clip-path:inset(0_0_100%_0)] max-[1100px]:opacity-0 max-[1100px]:pointer-events-none"
            }`}
          aria-label="Primary"
        >
          {nav.map((l) => (
            <NavItem key={l.label} to={l.to} className={navLinkClass} onClick={close}>
              {l.label}
            </NavItem>
          ))}

          {/* ITO YUNG IBINALIK NATIN NA "MY APPOINTMENTS" */}
          {myAppointments && (
            <NavItem
              to={myAppointments.to}
              className={`${navLinkClass} ml-[clamp(0px,3vw,48px)] max-[1100px]:ml-0`}
              onClick={close}
            >
              {myAppointments.label}
            </NavItem>
          )}
          
          {/* MOBILE VIEW - Sign In / Profile Menu kapag maliit ang screen */}
          <div className="hidden max-[1100px]:flex items-center justify-between gap-2.5 pt-4 border-t border-black/10 mt-2">
            <ProfileMenu size={42} />
          </div>
        </nav>

        {/* DESKTOP VIEW - Profile Menu na lang (Wala nang Get Started) */}
        <div className="flex items-center gap-2.5 max-[1100px]:hidden">
          <ProfileMenu size={38} />
        </div>

        {/* MOBILE HAMBURGER MENU BUTTON */}
        <button
          className="hidden max-[1100px]:block w-[42px] h-[42px] border-0 bg-transparent ml-auto relative cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`absolute left-2.5 right-2.5 h-0.5 bg-[#222] rounded-sm transition-[transform,opacity] duration-[350ms] ease-tf top-[14px] ${open ? "translate-y-1.5 rotate-45" : ""
              }`}
          />
          <span
            className={`absolute left-2.5 right-2.5 h-0.5 bg-[#222] rounded-sm transition-[transform,opacity] duration-[350ms] ease-tf top-5 ${open ? "opacity-0" : ""
              }`}
          />
          <span
            className={`absolute left-2.5 right-2.5 h-0.5 bg-[#222] rounded-sm transition-[transform,opacity] duration-[350ms] ease-tf top-[26px] ${open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
          />
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  const { nav, authed } = useClientNav();
  const [legalType, setLegalType] = useState(null);

  return (
    <footer className="bg-tf-footer text-white pt-[72px]" id="contact">
      <div
        className={`${container} grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1`}
      >
        <div className="max-[900px]:col-span-full">
          <Link to="/#top" className="flex items-center gap-2.5 font-serif no-underline">
            <Photo
              src="/img/Threefold%20logo.png"
              alt="Threefold logo"
              className="h-[40px] w-[40px] shrink-0 object-contain"
              fallback={<Logo size={40} />}
            />
            <strong className="text-sm tracking-[0.04em] font-normal text-tf-forest">THREEFOLD</strong>
          </Link>
          <p className="mt-5 font-serif text-[15px] leading-relaxed max-w-[280px] opacity-90 m-0">
            Bridging the gap between you and the mental clarity you deserve. Available anytime, anywhere.
          </p>
        </div>
        <div>
          <h4 className="m-0 mb-4 text-tf-teal font-serif font-normal text-[22px]">Services</h4>
          <ul className="list-none m-0 p-0">
            <li className="font-serif text-base leading-[2.2]">
              <Link
                to="/services#psychotherapy"
                className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
              >
                Psychotherapy/Counseling
              </Link>
            </li>
            <li className="font-serif text-base leading-[2.2]">
              <Link
                to="/services#aba"
                className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
              >
                ABA Therapy
              </Link>
            </li>
            <li className="font-serif text-base leading-[2.2]">
              <Link
                to="/services#assessment"
                className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
              >
                Assessment Consultation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="m-0 mb-4 text-tf-teal font-serif font-normal text-[22px]">Threefold</h4>
          <ul className="list-none m-0 p-0">
            {nav.map((l) => (
              <li key={l.label} className="font-serif text-base leading-[2.2]">
                <NavItem
                  to={l.to}
                  className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
                >
                  {l.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="m-0 mb-4 text-tf-teal font-serif font-normal text-[22px]">Support</h4>
          <ul className="list-none m-0 p-0">
            {authed && (
              <>
                <li className="font-serif text-base leading-[2.2]">
                  <Link
                    to="/book"
                    className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
                  >
                    Book a Session
                  </Link>
                </li>
                <li className="font-serif text-base leading-[2.2]">
                  <Link
                    to="/contact"
                    className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
                  >
                    Messages
                  </Link>
                </li>
              </>
            )}
            <li className="font-serif text-base leading-[2.2]">
              <a
                href={`mailto:${CLINIC.email}`}
                className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
              >
                {CLINIC.email}
              </a>
            </li>
            <li className="font-serif text-base leading-[2.2]">
              <a
                href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}
                className="opacity-90 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-tf-teal no-underline text-inherit"
              >
                {CLINIC.phone}
              </a>
            </li>
          </ul>
          <p className="m-0 mt-4 font-serif text-sm leading-relaxed opacity-80">{CLINIC.address}</p>
          <a
            href={CLINIC.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-serif text-sm text-tf-teal no-underline hover:underline"
          >
            Facebook · {CLINIC.facebookLabel}
          </a>
        </div>
      </div>
      <div
        className={`${container} flex flex-wrap justify-between gap-3 mt-14 py-6 border-t border-white/12 font-serif text-xs`}
      >
        <p className="m-0">© 2026 Threefold. All rights reserved. Made with care for mental wellness.</p>
        <p className="m-0 flex flex-wrap gap-6">
          <button
            type="button"
            onClick={() => setLegalType("privacy")}
            className="bg-transparent border-0 p-0 cursor-pointer font-serif text-xs text-inherit hover:text-tf-teal transition"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setLegalType("terms")}
            className="bg-transparent border-0 p-0 cursor-pointer font-serif text-xs text-inherit hover:text-tf-teal transition"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setLegalType("cookies")}
            className="bg-transparent border-0 p-0 cursor-pointer font-serif text-xs text-inherit hover:text-tf-teal transition"
          >
            Cookie Policy
          </button>
        </p>
      </div>

      {legalType && (
        <LegalModal
          type={legalType}
          onClose={() => setLegalType(null)}
        />
      )}
    </footer>
  );
}