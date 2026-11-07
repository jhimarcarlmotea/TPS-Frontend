import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo, Photo } from "../components/Layout";
import { logout } from "../auth";

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

/* ---------- Menu, grouped under labels ----------
   exact: true -> active only on that exact path
   otherwise   -> active on that path and its sub-pages */
const NAV_GROUPS = [
    {
        label: "Overview",
        items: [{ key: "dashboard", label: "Dashboard", href: "/affiliate", icon: "dashboard", exact: true }],
    },
    {
        label: "Clinic",
        items: [
            { key: "appointment", label: "Appointment", href: "/affiliate/appointment", icon: "appointment" },
            { key: "schedules", label: "Schedules", href: "/affiliate/schedules", icon: "schedules" },
        ],
    },
    {
        label: "Billing",
        items: [{ key: "payment", label: "Payment", href: "/affiliate/payment", icon: "payment" }],
    },
];

/* ---------- Icons (24x24 stroke set) ---------- */
const ICONS = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </>
    ),
    appointment: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
        </>
    ),
    schedules: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    payment: (
        <>
            <path d="M3 7a2 2 0 0 1 2-2h13v4" />
            <path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
            <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
        </>
    ),
    logout: (
        <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
        </>
    ),
};

const Icon = ({ name, size = 19 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
    >
        {ICONS[name]}
    </svg>
);

const isActiveRoute = (pathname, item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href);

/**
 * Responsive na sidebar.
 *  - lg pataas: fixed sidebar sa kaliwa + spacer (kapareho ng dati)
 *  - mas maliit: nakatago (off-canvas); bubukas bilang drawer kapag `open` ang true
 *
 * Props (galing sa page na may hamburger button):
 *   open    - boolean, bukas ba ang drawer
 *   onClose - function, tinatawag kapag nag-click sa backdrop / link / X / Escape
 *
 * May sarili ring floating hamburger button ang component na ito. Lumalabas ito
 * kapag na-scroll na pababa ang page (nawala na sa screen ang hamburger sa header),
 * kaya laging abot ang menu. Hindi na kailangan ng dagdag na props mula sa page.
 */
export default function AffiliateNavigation({ open = false, onClose = () => { } }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // `open` galing sa page (hamburger sa header); `internalOpen` galing sa floating button
    const [internalOpen, setInternalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isOpen = open || internalOpen;

    const close = useCallback(() => {
        setInternalOpen(false);
        onClose();
    }, [onClose]);

    // Ipakita ang floating hamburger kapag lumampas na sa header ang scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 70);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = async () => {
        close();
        await logout();
        navigate("/signin", { replace: true });
    };

    // Isara ang drawer gamit ang Escape key
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, close]);

    const showFloating = scrolled && !isOpen;

    return (
        <>
            {/* Floating hamburger: lumalabas kapag na-scroll na ang page (mobile/tablet lang) */}
            <button
                type="button"
                onClick={() => setInternalOpen(true)}
                aria-label="Open menu"
                aria-hidden={!showFloating}
                tabIndex={showFloating ? 0 : -1}
                className={`fixed left-[16px] top-[12px] z-30 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#c7b6b6] bg-white text-[#2f4a42] shadow-md transition-opacity duration-200 motion-reduce:transition-none sm:left-[28px] lg:hidden ${showFloating ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Backdrop (mobile/tablet lang) */}
            <div
                onClick={close}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                aria-label="Main navigation"
                className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[288px] max-w-[85vw] shrink-0 flex-col rounded-r-[32px] bg-[#1f4d3f] transition-transform duration-200 motion-reduce:transition-none lg:max-w-none lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Close button (mobile/tablet lang) */}
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="absolute right-[18px] top-[22px] flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#a8c8b8] hover:bg-white/10 hover:text-white lg:hidden"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                </button>

                {/* Brand */}
                <div className="shrink-0 px-[26px] pb-[20px] pt-[30px]">
                    <Link to="/" onClick={close} className="group flex items-center gap-[12px] no-underline" aria-label="Threefold Home">
                        <Photo
                            src="/img/Threefold%20logo.png"
                            alt="Threefold Logo"
                            className="h-[42px] w-[42px] shrink-0 object-contain transition-transform group-hover:scale-105"
                            fallback={<Logo size={42} />}
                        />
                        <div className="flex flex-col">
                            <span className={`${serif} text-[15px] font-bold leading-[16px] tracking-[0.05em] text-[#f2f7f4] transition-colors group-hover:text-white`}>
                                THREEFOLD
                            </span>
                            <span className={`${serif} mt-[3px] max-w-[170px] text-[8px] leading-[11px] text-[#a8c8b8]`}>
                                Behavioral Interventions And Psychological Services
                            </span>
                        </div>
                    </Link>
                    <span className={`${inter} mt-[14px] inline-block rounded-full bg-white/10 px-[10px] py-[3px] text-[10px] font-bold uppercase tracking-[0.12em] text-[#cfe3d8]`}>
                        Affiliate panel
                    </span>
                </div>

                <div className="mx-[26px] h-px shrink-0 bg-white/10" />

                {/* Scrollable menu area */}
                <nav aria-label="Affiliate navigation" className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-[18px] pr-[6px] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.22)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/35">
                    {NAV_GROUPS.map((group, gi) => {
                        const labelId = `affiliate-nav-${gi}`;
                        return (
                            <div key={group.label} role="group" aria-labelledby={labelId} className={gi > 0 ? "mt-[20px]" : ""}>
                                <h2
                                    id={labelId}
                                    className={`${inter} m-0 px-[30px] pb-[6px] text-[11px] font-bold uppercase tracking-[0.14em] text-[#7fb09b]`}
                                >
                                    {group.label}
                                </h2>
                                <ul className="m-0 flex list-none flex-col gap-[3px] p-0">
                                    {group.items.map((item) => {
                                        const active = isActiveRoute(pathname, item);
                                        return (
                                            <li key={item.key} className="px-[16px]">
                                                <Link
                                                    to={item.href}
                                                    onClick={close}
                                                    aria-current={active ? "page" : undefined}
                                                    className={`${inter} flex h-[42px] items-center gap-[12px] rounded-[10px] px-[14px] text-[14px] no-underline transition-colors ${active
                                                        ? "bg-white font-bold text-[#1f4d3f] shadow-sm"
                                                        : "font-medium text-[#cfe3d8] hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    <span className={active ? "text-[#10a28c]" : "text-[#7fb09b]"}>
                                                        <Icon name={item.icon} />
                                                    </span>
                                                    {item.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </nav>

                {/* Logout: laging nasa ilalim, hindi tatakpan ang menu sa maiikling screen */}
                <div className="shrink-0 border-t border-white/10 px-[16px] py-[16px]">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`${inter} flex h-[42px] w-full cursor-pointer items-center gap-[12px] rounded-[10px] border-0 bg-transparent px-[14px] text-left text-[14px] font-medium text-[#cfe3d8] transition-colors hover:bg-white/10 hover:text-white`}
                    >
                        <span className="text-[#7fb09b]">
                            <Icon name="logout" />
                        </span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Spacer: nagre-reserve ng espasyo sa desktop lang */}
            <div className="hidden w-[288px] shrink-0 lg:block" aria-hidden="true" />
        </>
    );
}