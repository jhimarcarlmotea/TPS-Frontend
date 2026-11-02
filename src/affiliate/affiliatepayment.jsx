import React, { useEffect, useMemo, useState } from "react";
import AffiliateNavigation from "./affiliatenav";
import { apiFetch } from "../auth";
import { peso, to12 } from "../components/payUtils";

const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@600&family=Inria+Serif:wght@400;700&family=Inter:wght@400;600;700&display=swap');`;

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

const API_BASE = "/affiliate";

/* ---------- Icons (inline SVG) ---------- */
function Icon({ className = "", children }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const Bell = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);
const Calendar = (p) => (
  <Icon {...p}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </Icon>
);
const CheckCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const AlertCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </Icon>
);

const statusBadge = {
  to_verify: ["To verify", "bg-[#fdf1bc] text-[#7a5400]"],
  verified: ["Verified", "bg-[#e3f2ee] text-[#2a8570]"],
  rejected: ["Rejected", "bg-red-100 text-red-700"],
};

/* ---------- Page ---------- */
const DateChip = ({ className = "" }) => {
  const label = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div
      className={`h-[30px] min-w-[170px] items-center justify-center gap-[8px] rounded-[6px] border border-[#4a9b8e] bg-[#e3f2ee] px-3 ${className}`}
    >
      <Calendar className="h-[14px] w-[14px] text-[#2a8570]" />
      <span className={`${inter} text-[12px] font-bold text-[#2a8570]`}>{label}</span>
    </div>
  );
};

/* ---------- Page ---------- */
export default function AffiliatePayment() {
  const [navOpen, setNavOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(null);

  const load = () => {
    apiFetch(`${API_BASE}/payments`)
      .then((d) => {
        setPayments(d.payments || []);
        setStats(d.stats || null);
        setError("");
      })
      .catch((err) => setError(err.message || "Could not load payments."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return payments.filter(
      (p) =>
        !q ||
        (p.client_name || "").toLowerCase().includes(q) ||
        (p.reference || "").toLowerCase().includes(q)
    );
  }, [payments, searchTerm]);

  const groups = useMemo(() => {
    const today = new Date().toDateString();
    const yest = new Date(Date.now() - 86400000).toDateString();
    const map = new Map();
    filtered.forEach((p) => {
      const d = new Date(p.created_at);
      const key = d.toDateString();
      const label =
        key === today
          ? "TODAY"
          : key === yest
            ? "YESTERDAY"
            : d
              .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
              .toUpperCase();
      if (!map.has(key)) map.set(key, { label, items: [] });
      map.get(key).items.push(p);
    });
    return [...map.values()];
  }, [filtered]);

  const onUpdated = (np) => {
    setPayments((list) => list.map((p) => (p.id === np.id ? np : p)));
    setOpen(np);
    load();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f2f2f2] antialiased">
      <style>{FONT_CSS}</style>

      {/* Sidebar: laging nakikita sa lg pataas */}
      <div className="hidden lg:block">
        <AffiliateNavigation />
      </div>

      {/* Sidebar: drawer sa mobile/tablet */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full overflow-y-auto bg-white">
            <AffiliateNavigation />
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
            className="flex-1 bg-black/40"
          />
        </div>
      )}

      <main className="min-w-0 flex-1 px-[16px] pb-[48px] pt-[20px] sm:px-[28px] sm:pt-[32px] lg:px-[41px] lg:pb-[60px] lg:pt-[51px]">
        {/* Header */}
        <header className="flex items-start justify-between gap-[12px]">
          <div className="min-w-0">
            <div className="flex items-center gap-[12px]">
              <button
                onClick={() => setNavOpen(true)}
                aria-label="Open menu"
                className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] border border-[#c7b6b6] bg-white text-[#2f4a42] lg:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className={`${inter} text-[14px] font-bold tracking-[3px] text-[#4a9b8e] sm:text-[20px] sm:tracking-[4.2px]`}>PAYMENT</div>
            </div>
            <h1 className={`${serif} mt-[8px] text-[26px] font-bold leading-[1.15] text-[#2f4a42] sm:text-[34px] lg:text-[40px]`}>
              receipts &amp; payments.
            </h1>
            <p className={`${serif} mt-[8px] max-w-xl text-[13px] text-[#666]`}>
              See the clients who booked with you and paid a downpayment or the full amount, and open the receipt they uploaded.
            </p>
            {/* Date chip: nasa ilalim ng description sa mobile */}
            <DateChip className="mt-[12px] inline-flex sm:hidden" />
          </div>

          <div className="flex items-center gap-[17px]">
            <DateChip className="hidden sm:flex" />
            <button
              aria-label="Notifications"
              className="relative flex h-[37px] w-[46px] items-center justify-center rounded-[8px] border border-[#c7b6b6] bg-white"
            >
              <Bell className="h-[18px] w-[18px] text-[#2a8570]" />
              {(stats?.to_verify ?? 0) > 0 && (
                <span className="absolute right-[10px] top-[8px] h-[7px] w-[7px] rounded-full bg-[#e07b6a]" />
              )}
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-[34px] grid grid-cols-1 gap-[29px] md:grid-cols-2 lg:grid-cols-4">
          <StatCard variant="dark" title="VERIFIED PAYMENTS" value={peso(stats?.verified_total)} subtitle="Total verified" />
          <StatCard variant="warn" title="RECEIPTS TO VERIFY" value={stats?.to_verify ?? 0} subtitle="Waiting for review" />
          <StatCard title="BALANCE DUE" value={peso(stats?.balance_due)} subtitle="Balance due from downpayments" />
          <StatCard
            title="PAYMENT SUMMARY"
            value={`${stats?.full_count ?? 0} / ${stats?.down_count ?? 0}`}
            subtitle="Full payments / downpayments"
          />
        </section>

        {/* Tab & search (walang Payment methods tab: si admin lang ang nagse-set) */}
        <div className="mb-[24px] mt-[41px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex h-[28px] items-center gap-[3px] rounded-[11px] bg-[#4a9b8e30] p-[3px]">
            <button
              type="button"
              className={`${serif} h-[22px] rounded-[9px] bg-white px-[14px] text-[11px] text-[#202020]`}
            >
              Payments Receive
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder="Search client or reference"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${serif} w-full rounded-[10px] border border-[#c7b6b6] bg-white py-2.5 pl-9 pr-4 text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#4a9b8e] sm:py-2 sm:text-[13px]`}
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}
        {loading && <p className={`${serif} text-sm text-[#666]`}>Loading payments…</p>}
        {!loading && !error && groups.length === 0 && (
          <p className={`${serif} text-sm text-[#666]`}>No payments yet.</p>
        )}

        {groups.map((g) => (
          <Group key={g.label} label={g.label} items={g.items} onOpen={setOpen} />
        ))}
      </main>

      {open && (
        <ReceiptModal p={open} base={API_BASE} onClose={() => setOpen(null)} onUpdated={onUpdated} />
      )}
    </div>
  );
}

function Group({ label, items, onOpen }) {
  return (
    <section className="mb-[32px]">
      <div className="mb-4 flex items-center gap-4">
        <h3 className={`${inter} text-[12px] font-bold tracking-[2.5px] text-[#4a9b8e]`}>{label}</h3>
        <div className="h-px flex-1 bg-[#c7b6b6]" />
      </div>
      <div className="space-y-[14px]">
        {items.map((item) => (
          <PaymentRow key={item.id} data={item} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ title, value, subtitle, variant = "light" }) {
  const base =
    "min-h-[140px] overflow-hidden border px-[23px] py-[22px] rounded-tl-[18px] rounded-tr-[7px] rounded-br-[18px] rounded-bl-[7px]";
  const styles = {
    dark: "bg-[#1f4d3f] border-[#c7b6b6]",
    warn: "bg-gradient-to-b from-[#fdf1bc] to-[#fffbdd] from-0% to-25% border-[#2020203d]",
    light: "bg-white border-[#2020203d]",
  };
  const label = variant === "dark" ? "text-[#a8c8b8]" : "text-[#666]";
  const num = variant === "dark" ? "text-white" : "text-[#202020]";
  const sub = variant === "dark" ? "text-[#a8c8b8]" : "text-[#666]";

  return (
    <div className={`${base} ${styles[variant]}`}>
      <div className={`${inter} text-[11px] font-bold ${label}`}>{title}</div>
      <div className={`${inter} mt-[14px] text-[32px] font-bold leading-none ${num}`}>{value}</div>
      <p className={`${inter} mt-[12px] text-[11px] font-bold ${sub}`}>{subtitle}</p>
    </div>
  );
}

function PaymentRow({ data, onOpen }) {
  const created = new Date(data.created_at);
  const isPending = data.status === "to_verify";
  const isDownpayment = data.payment_type === "down";
  const [statusText, statusCls] = statusBadge[data.status] || statusBadge.to_verify;
  const sched = `${new Date(data.date + "T00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}, ${to12(data.start_time)}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#c7b6b6] bg-white p-4 transition hover:shadow-md md:flex-nowrap">
      {/* Date badge */}
      <div className="min-w-[90px] rounded-[8px] bg-[#e3f2ee] p-3 text-center">
        <div className={`${serif} text-2xl font-bold leading-none text-[#2f4a42]`}>{created.getDate()}</div>
        <div className={`${serif} text-xs text-[#2a8570]`}>
          {created.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div className={`${serif} mt-1 text-[10px] text-[#666]`}>
          {created.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </div>
      </div>

      {/* Client */}
      <div className="min-w-[200px] flex-1">
        <h4 className={`${serif} text-[16px] font-bold text-black`}>{data.client_name || "Client"}</h4>
        <p className={`${serif} text-[12px] text-[#666]`}>
          {data.service_name} · {sched}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <span
          className={`${inter} rounded-full px-3 py-1 text-[11px] font-bold ${isDownpayment ? "bg-[#fdf1bc] text-[#7a5400]" : "bg-[#e3f2ee] text-[#2a8570]"
            }`}
        >
          {isDownpayment ? "Downpayment" : "Full payment"}
        </span>
        <span className={`${inter} rounded-full bg-[#f2f2f2] px-3 py-1 text-[11px] font-bold text-[#202020]`}>
          {data.method}
        </span>
      </div>

      {/* Amount */}
      <div className="min-w-[100px] text-right">
        <div className={`${inter} text-[16px] font-bold text-[#202020]`}>{peso(data.amount_paid)}</div>
        <div className={`${serif} text-[11px] text-[#666]`}>
          {isDownpayment ? `Balance ${peso(data.balance)}` : "Paid in full"}
        </div>
      </div>

      {/* Status & action */}
      <div className="flex items-center gap-3">
        <span className={`${inter} flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold ${statusCls}`}>
          {isPending ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : data.status === "verified" ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : null}
          {statusText}
        </span>

        <button
          type="button"
          onClick={() => onOpen(data)}
          className={`${serif} cursor-pointer rounded-[6px] px-4 py-1.5 text-[12px] transition ${isPending
            ? "border-0 bg-[#11a086] text-white hover:bg-[#0e8c75]"
            : "border border-[#c7b6b6] bg-white text-[#2f4a42] hover:bg-[#e3f2ee]"
            }`}
        >
          {isPending ? "Review receipt" : "View receipt"}
        </button>
      </div>
    </div>
  );
}

const QUICK_REPLIES = [
  ["Number mismatch", "The sender number you entered does not match the one in your proof of payment."],
  ["Wrong amount", "The amount in your proof of payment does not match the amount due."],
  ["Reference mismatch", "The reference number you entered does not match your receipt."],
  ["Blurry receipt", "Your receipt is blurry or cut off. Please upload a clear, full screenshot."],
  ["Not received", "We could not find this payment in our account yet. Please check and send it again."],
  ["Wrong method", "The receipt shows a different payment method than the one you selected."],
];

function ReceiptModal({ p, base, onClose, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const act = async (kind) => {
    setBusy(true);
    setError("");
    try {
      const d = await apiFetch(`${base}/payments/${p.id}/${kind}`, {
        method: "POST",
        body: JSON.stringify(kind === "reject" ? { reason: reason.trim() } : {}),
      });
      onUpdated(d.payment);
      setRejecting(false);
      setReason("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const rows = [
    ["Reference", p.reference],
    ["Client", p.client_name],
    ["Email", p.client_email],
    ["Mobile", p.client_mobile],
    ["Service", p.service_name],
    [
      "Schedule",
      `${new Date(p.date + "T00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} · ${to12(p.start_time)} - ${to12(p.end_time)}`,
    ],
    ["Method", p.method],
    ["Sender number", p.wallet_number],
    ["Reference no.", p.reference_number],
    ["Session fee", peso(p.total_amount)],
    ["Amount paid", peso(p.amount_paid)],
    ["Balance", peso(p.balance)],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 rounded-2xl bg-white p-6 shadow-xl max-[720px]:grid-cols-1">
        <div>
          <h3 className={`${serif} m-0 mb-3 text-xl text-[#202020]`}>Proof of payment</h3>
          <a href={p.receipt_url} target="_blank" rel="noreferrer">
            <img
              src={p.receipt_url}
              alt="Receipt"
              className="max-h-[460px] w-full rounded-lg border border-black/10 object-contain"
            />
          </a>
          <p className={`${serif} mt-2 text-[11px] text-[#666]`}>Click the image to open it full size.</p>
        </div>

        <div>
          <h3 className={`${serif} m-0 mb-3 text-xl text-[#202020]`}>Details</h3>
          <dl className="m-0 grid gap-2 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="m-0 text-[#666]">{k}</dt>
                <dd className="m-0 break-all text-right font-medium text-[#202020]">{v || "—"}</dd>
              </div>
            ))}
          </dl>

          {p.status === "rejected" && p.reject_reason && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              Message sent to client: {p.reject_reason}
            </p>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          {rejecting && (
            <div className="mt-4">
              <p className={`${inter} m-0 mb-2 text-[11px] font-bold tracking-[1.5px] text-[#666]`}>
                MESSAGE TO CLIENT
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map(([label, text]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setReason(text)}
                    className={`${serif} cursor-pointer rounded-full border px-3 py-1 text-[12px] transition ${
                      reason === text
                        ? "border-[#11a086] bg-[#e3f2ee] text-[#1f6b55]"
                        : "border-[#c7b6b6] bg-white text-[#202020] hover:bg-[#f2f2f2]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                maxLength={255}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tap a quick reply above, or write your own message…"
                className={`${serif} mt-3 w-full resize-none rounded-md border border-black/20 p-2 text-sm`}
              />
              <p className={`${serif} m-0 mt-1 text-right text-[11px] text-[#888]`}>{reason.length}/255</p>
              <p className={`${serif} m-0 mt-1 text-[11px] text-[#666]`}>
                The client will see this message on their appointment status page and will be asked to go back to payment.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={rejecting ? () => { setRejecting(false); setReason(""); setError(""); } : onClose}
              className={`${serif} cursor-pointer rounded-md border border-[#c7b6b6] bg-white px-4 py-2 text-sm`}
            >
              {rejecting ? "Cancel" : "Close"}
            </button>
            {p.status === "to_verify" && !rejecting && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setRejecting(true)}
                className={`${serif} cursor-pointer rounded-md border border-red-300 bg-white px-4 py-2 text-sm text-red-700 disabled:opacity-60`}
              >
                Reject
              </button>
            )}
            {p.status === "to_verify" && rejecting && (
              <button
                type="button"
                disabled={busy || reason.trim().length < 3}
                onClick={() => act("reject")}
                className={`${serif} cursor-pointer rounded-md border-0 bg-red-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {busy ? "Please wait…" : "Send message & reject"}
              </button>
            )}
            {p.status === "to_verify" && !rejecting && (
              <button
                type="button"
                disabled={busy}
                onClick={() => act("verify")}
                className={`${serif} cursor-pointer rounded-md border-0 bg-[#11a086] px-4 py-2 text-sm text-white hover:bg-[#0e8c75] disabled:opacity-60`}
              >
                {busy ? "Please wait…" : "Verify payment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}