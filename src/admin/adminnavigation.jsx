import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo, Photo } from "../components/Layout";
import { logout } from "../auth";

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";
const inknut = "font-['Inknut_Antiqua',Georgia,serif]";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/admin" },
    { label: "Appointment", to: "/admin/appointment" },
    { label: "Messages", to: "/admin/messages" },
    { label: "Schedules", to: "/admin/schedule" },
    { label: "Services", to: "/admin/services" },
    { label: "Payment", to: "/admin/payment" },
    { label: "Backup and Restore", to: "/admin/backup" },
    { label: "Accounts", to: "/admin/accounts" },
    { label: "Client", to: "/admin/client" },
    { label: "Home", to: "/admin/home" },
];

// Para ma-preview ng admin ang ibang site nang hindi nagla-logout
const PREVIEW_ITEMS = [
    { label: "Client site", to: "/appointments" },
    { label: "Affiliate site", to: "/affiliate" },
];

const GridIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="1.2" />
        <rect x="12" y="2" width="6" height="6" rx="1.2" />
        <rect x="2" y="12" width="6" height="6" rx="1.2" />
        <rect x="12" y="12" width="6" height="6" rx="1.2" />
    </svg>
);

const ExternalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M9 7h8v8" />
    </svg>
);

const isActiveRoute = (pathname, to) => {
    if (to === "/admin/payment") {
        return pathname === to || pathname === "/admin/payment-method";
    }
    return pathname === to;
};

export default function AdminNavigation() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // para sa mobile drawer lang

    const close = () => setOpen(false);

    // Isara kapag nagpalit ng page
    useEffect(() => { setOpen(false); }, [pathname]);

    // Esc para isara, at i-lock ang scroll ng page habang bukas ang drawer
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    const handleLogout = async () => {
        await logout();
        navigate("/signin", { replace: true });
    };

    return (
        <>
            {/* Hamburger: mobile at tablet lang */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="fixed left-4 top-3 z-40 grid h-[40px] w-[40px] place-items-center rounded-[8px] border border-[#c7b6b6] bg-white lg:hidden"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a8570" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Backdrop: mobile lang */}
            {open && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={close}
                    className="fixed inset-0 z-40 cursor-default bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[min(321px,85vw)] shrink-0 flex-col overflow-y-auto rounded-tr-[64px] rounded-br-[64px] rounded-bl-[32px] bg-[#1f4d3f] transition-[transform,visibility] duration-300 lg:w-[321px] lg:translate-x-0 ${open ? "translate-x-0" : "max-lg:invisible max-lg:-translate-x-full"
                    }`}
            >
                {/* Close button: mobile lang */}
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="absolute right-[44px] top-[34px] grid h-[36px] w-[36px] place-items-center rounded-full text-[#a8c8b8] hover:text-white lg:hidden"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                <div className="relative mt-[38px] px-[26px]">
                    <Link to="/" onClick={close} className="group flex items-center gap-[12px] no-underline" aria-label="Threefold Home">
                        <Photo
                            src="/img/Threefold%20logo.png"
                            className="h-[42px] w-[42px] shrink-0 object-contain transition-transform group-hover:scale-105"
                            fallback={<Logo size={42} />}
                        />
                        <div className="flex flex-col">
                            <span className={`${serif} text-[15px] font-bold tracking-[0.05em] leading-[16px] text-[#f2f7f4] transition-colors group-hover:text-white`}>
                                THREEFOLD
                            </span>
                            <span className={`${serif} mt-[3px] max-w-[195px] text-[8px] leading-[11px] text-[#a8c8b8]`}>
                                Behavioral Interventions And Psychological Services
                            </span>
                        </div>
                    </Link>
                </div>

                <div className={`${inter} mt-[44px] px-[40px] text-[14px] font-bold tracking-[2.52px] text-[#a8c8b8]`}>
                    MENU
                </div>

                <nav aria-label="Admin navigation" className="mt-[16px] flex flex-col gap-[14px]">
                    {NAV_ITEMS.map(({ label, to }) => {
                        const active = isActiveRoute(pathname, to);
                        const dashboard = label === "Dashboard";

                        return (
                            <Link
                                key={label}
                                to={to}
                                onClick={close}
                                aria-current={active ? "page" : undefined}
                                className={active
                                    ? "ml-[26px] flex h-[52px] items-center gap-[14px] rounded-l-[26px] bg-white pl-[23px] no-underline"
                                    : `${inknut} flex h-[52px] items-center gap-[14px] px-[40px] text-[20px] font-semibold text-[#2a8570] no-underline transition-colors hover:text-[#4fbfa5]`
                                }
                            >
                                {dashboard && (
                                    <GridIcon className={active ? "text-[#1f6b55]" : "text-[#2a8570]"} />
                                )}
                                <span className={active
                                    ? `${inter} text-[18px] font-bold text-[#1f6b55]`
                                    : ""
                                }>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Preview ng ibang site (hindi kailangang mag-logout) */}
                <div className={`${inter} mt-[32px] px-[40px] text-[14px] font-bold tracking-[2.52px] text-[#a8c8b8]`}>
                    PREVIEW SITE
                </div>
                <div className="mt-[8px] flex flex-col">
                    {PREVIEW_ITEMS.map(({ label, to }) => (
                        <Link
                            key={label}
                            to={to}
                            onClick={close}
                            className={`${inknut} flex items-center gap-[8px] px-[40px] py-[9px] text-[17px] font-semibold text-[#2a8570] no-underline transition-colors hover:text-[#4fbfa5]`}
                        >
                            {label}
                            <ExternalIcon />
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className={`${inknut} mt-auto mb-[64px] cursor-pointer border-0 bg-transparent px-[38px] pt-[24px] text-left text-[20px] font-semibold text-[#2a8570] transition-colors hover:text-[#4fbfa5]`}
                >
                    Logout
                </button>
            </aside>

            {/* Spacer: sa desktop lang, dahil fixed ang sidebar */}
            <div className="hidden w-[321px] shrink-0 lg:block" aria-hidden="true" />
        </>
    );
}