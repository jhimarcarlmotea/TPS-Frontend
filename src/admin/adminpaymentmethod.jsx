import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavigation from "./adminnavigation";
import { apiFetch } from "../auth";
import { peso, resizeToJpeg } from "../components/payUtils";

const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@600&family=Inria+Serif:wght@400;700&family=Inter:wght@400;600;700&display=swap');`;
const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

const SERVICE_TABS = [
    ["psychotherapy", "Psychotherapy"],
    ["aba", "ABA Therapy"],
    ["assessment", "Assessment"],
];

const Card = ({ className = "", children }) => (
    <section className={`relative rounded-[10px] border border-[#c7b6b6] bg-white ${className}`}>{children}</section>
);
const CardTitle = ({ children }) => <h2 className={`${serif} text-[16px] text-black`}>{children}</h2>;

const fieldCls = `${serif} mt-[6px] h-[32px] w-full rounded-[4px] border border-[#00000033] bg-white px-[10px] text-[12px] text-[#202020] outline-none focus:border-[#4a9b8e]`;

const Toggle = ({ on, onChange, label, disabled }) => (
    <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!on)}
        className={`relative h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-60 ${on ? "bg-[#2a8570]" : "bg-[#989898]"
            }`}
    >
        <span
            className={`absolute top-[4px] h-[18px] w-[19px] rounded-full bg-white transition-all ${on ? "left-[27px]" : "left-[4px]"
                }`}
        />
    </button>
);

function Notice({ msg }) {
    if (!msg) return null;
    return (
        <p
            role="alert"
            className={`m-0 mt-3 rounded-lg px-3 py-2 text-[12px] ${msg.type === "ok"
                ? "border border-[#4a9b8e]/30 bg-[#e3f2ee] text-[#2f4a42]"
                : "border border-red-200 bg-red-50 text-red-800"
                }`}
        >
            {msg.text}
        </p>
    );
}

/* ---------------- Pricing + downpayment ---------------- */
function PricingCard({ settings, onSaved }) {
    const [tab, setTab] = useState("psychotherapy");
    const [percent, setPercent] = useState(String(settings.downpayment_percent));
    const [note, setNote] = useState(settings.note || "");
    const [prices, setPrices] = useState(
        Object.fromEntries(Object.entries(settings.prices).map(([k, v]) => [k, String(v)]))
    );
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(null);

    const price = Number(prices[tab]) || 0;
    const pct = Number(percent) || 0;
    const down = Math.round(price * pct) / 100;
    const fullOnly = (settings.full_only || []).includes(tab);
    const save = async () => {
        setMsg(null);
        if (!(pct >= 1 && pct <= 100)) return setMsg({ type: "err", text: "Downpayment must be 1 to 100 percent." });
        for (const [id, label] of SERVICE_TABS) {
            if (!(Number(prices[id]) >= 1)) return setMsg({ type: "err", text: `Set a price for ${label}.` });
        }
        setBusy(true);
        try {
            const d = await apiFetch("/admin/payment-settings", {
                method: "PUT",
                body: JSON.stringify({
                    downpayment_percent: pct,
                    note: note.trim() || null,
                    prices: Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, Number(v)])),
                }),
            });
            onSaved(d);
            setMsg({ type: "ok", text: "Saved. Clients will see these prices right away." });
        } catch (err) {
            setMsg({ type: "err", text: err.message });
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card className="p-[16px]">
            <CardTitle>Service prices &amp; payment terms</CardTitle>
            <p className={`${serif} text-[11px] text-black`}>
                Set how much clients pay for each service and how much to hold a slot.
            </p>

            <div className="mt-[12px] inline-flex rounded-[11px] bg-[#4a9b8e30] p-[3px]">
                {SERVICE_TABS.map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={`${serif} h-[24px] cursor-pointer rounded-[9px] border-0 px-[12px] text-[11px] text-[#202020] ${tab === id ? "bg-white font-bold" : "bg-transparent"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <label className={`${serif} mt-[14px] block text-[11px] text-[#666]`}>
                Session fee ({SERVICE_TABS.find(([id]) => id === tab)[1]})
            </label>
            <div className="relative">
                <span className="absolute left-[10px] top-[14px] text-[12px] text-[#666]">₱</span>
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={prices[tab]}
                    onChange={(e) => setPrices({ ...prices, [tab]: e.target.value })}
                    className={`${fieldCls} pl-[24px]`}
                />
            </div>

            {fullOnly ? null : (
                <>
                    <label className={`${serif} mt-[14px] block text-[11px] text-[#666]`}>Downpayment (% of the fee)</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        value={percent}
                        onChange={(e) => setPercent(e.target.value)}
                        className={fieldCls}
                    />
                    <p className={`${serif} mt-[6px] text-[11px] text-[#2a8570]`}>
                        Client pays {peso(down)} now, balance {peso(price - down)}. Set 100 to require full payment only.
                        The downpayment percent applies to Psychotherapy and Assessment.
                    </p>
                </>
            )}

            <label className={`${serif} mt-[14px] block text-[11px] text-[#666]`}>Note shown to clients</label>
            <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Please send your receipt right after paying…"
                className={`${serif} mt-[6px] w-full resize-none rounded-[4px] border border-[#00000033] bg-white p-[10px] text-[12px] text-[#202020] outline-none focus:border-[#4a9b8e]`}
            />

            <Notice msg={msg} />
            <button
                type="button"
                disabled={busy}
                onClick={save}
                className={`${serif} mt-[14px] h-[32px] cursor-pointer rounded-[4px] border-0 bg-[#4a9b8e] px-[16px] text-[12px] font-bold text-white hover:bg-[#3f8a7d] disabled:opacity-60`}
            >
                {busy ? "Saving…" : "Save changes"}
            </button>
        </Card>
    );
}

/* ---------------- Add method ---------------- */
function AddMethod({ onAdded }) {
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(null);

    const add = async () => {
        if (name.trim().length < 2) return setMsg({ type: "err", text: "Enter a name (e.g. GoTyme)." });
        setBusy(true);
        setMsg(null);
        try {
            const d = await apiFetch("/admin/payment-methods", {
                method: "POST",
                body: JSON.stringify({ name: name.trim() }),
            });
            setName("");
            onAdded(d.method);
            setMsg({ type: "ok", text: "Added. Click “Edit details” to add the account, then turn it on." });
        } catch (err) {
            setMsg({ type: "err", text: err.message });
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="rounded-[12px] border border-dashed border-[#666] bg-white p-[16px]">
            <CardTitle>Add another way to pay</CardTitle>
            <p className={`${serif} text-[11px] text-[#666]`}>Another bank, an e-wallet, or anything your clients use.</p>
            <div className="mt-[14px] flex gap-[12px]">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="GoTyme"
                    maxLength={60}
                    className={`${serif} h-[30px] flex-1 rounded-[4px] border border-[#00000033] bg-white px-[10px] text-[12px] text-[#202020] outline-none focus:border-[#4a9b8e]`}
                />
                <button
                    type="button"
                    disabled={busy}
                    onClick={add}
                    className={`${serif} h-[30px] cursor-pointer rounded-[4px] border-0 bg-[#4a9b8e] px-[14px] text-[11px] font-bold text-white hover:bg-[#3f8a7d] disabled:opacity-60`}
                >
                    +&nbsp;&nbsp;Add
                </button>
            </div>
            <Notice msg={msg} />
        </section>
    );
}

/* ---------------- Method card ---------------- */
function MethodCard({ m, onChange, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: m.name,
        account_name: m.account_name || "",
        account_number: m.account_number || "",
        bank: m.bank || "",
    });
    const [qr, setQr] = useState(null); // data URL ng bagong QR
    const [removeQr, setRemoveQr] = useState(false);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(null);

    const startEdit = () => {
        setForm({
            name: m.name,
            account_name: m.account_name || "",
            account_number: m.account_number || "",
            bank: m.bank || "",
        });
        setQr(null);
        setRemoveQr(false);
        setMsg(null);
        setEditing(true);
    };

    const put = async (body) => {
        const d = await apiFetch(`/admin/payment-methods/${m.id}`, { method: "PUT", body: JSON.stringify(body) });
        onChange(d.method);
        return d.method;
    };

    const toggle = async (on) => {
        setBusy(true);
        setMsg(null);
        try {
            await put({ enabled: on });
        } catch (err) {
            setMsg({ type: "err", text: err.message });
        } finally {
            setBusy(false);
        }
    };

    const pickQr = async (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (!f) return;
        try {
            setQr(await resizeToJpeg(f, 800, 0.9));
            setRemoveQr(false);
        } catch (err) {
            setMsg({ type: "err", text: err.message });
        }
    };

    const save = async () => {
        if (form.name.trim().length < 2) return setMsg({ type: "err", text: "Name is required." });
        setBusy(true);
        setMsg(null);
        try {
            await put({
                name: form.name.trim(),
                account_name: form.account_name.trim() || null,
                account_number: form.account_number.trim() || null,
                bank: form.bank.trim() || null,
                ...(qr ? { qr } : {}),
                ...(removeQr && !qr ? { remove_qr: true } : {}),
            });
            setEditing(false);
        } catch (err) {
            setMsg({ type: "err", text: err.message });
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!window.confirm(`Delete ${m.name}? Clients will no longer see it.`)) return;
        setBusy(true);
        try {
            await apiFetch(`/admin/payment-methods/${m.id}`, { method: "DELETE" });
            onDelete(m.id);
        } catch (err) {
            setMsg({ type: "err", text: err.message });
            setBusy(false);
        }
    };

    const fields = [
        ["ACCOUNT NAME", m.account_name],
        ["ACCOUNT / MOBILE NUMBER", m.account_number],
        ...(m.bank ? [["BANK", m.bank]] : []),
    ];

    return (
        <Card className="p-[18px]">
            <div className="flex items-center gap-[12px]">
                <span
                    className={`${serif} flex h-[29px] w-[33px] items-center justify-center rounded-[9px] text-[16px] text-white`}
                    style={{ background: m.badge }}
                >
                    {m.letter}
                </span>
                <div className="flex-1">
                    <CardTitle>{m.name}</CardTitle>
                    <p className={`${serif} text-[11px] text-[#666]`}>
                        {m.enabled ? "Shown to clients when they pay" : "Hidden from clients"}
                    </p>
                </div>
                <Toggle on={m.enabled} onChange={toggle} label={`${m.name} enabled`} disabled={busy} />
            </div>

            <div className="my-[14px] h-px bg-[#e4e4e4]" />

            {!editing && (
                <div className={`flex gap-[20px] ${m.enabled ? "" : "opacity-60"}`}>
                    {m.qr_url ? (
                        <img src={m.qr_url} alt={`${m.name} QR`} className="h-[89px] w-[89px] shrink-0 rounded object-cover" />
                    ) : (
                        <div className="grid h-[89px] w-[89px] shrink-0 place-items-center rounded bg-[#f2f2f2] text-[10px] text-[#888]">
                            No QR
                        </div>
                    )}
                    <dl className="m-0 flex flex-col gap-[10px]">
                        {fields.map(([label, value]) => (
                            <div key={label}>
                                <dt className={`${inter} text-[8px] font-bold tracking-[1.28px] text-[#666]`}>{label}</dt>
                                <dd className={`${serif} m-0 text-[13px] text-[#202020]`}>{value || "Not set"}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {editing && (
                <div className="grid gap-[10px]">
                    {[
                        ["name", "Name"],
                        ["account_name", "Account name"],
                        ["bank", "Bank (optional)"],
                    ].map(([key, label]) => (
                        <label key={key} className={`${serif} text-[11px] text-[#666]`}>
                            {label}
                            <input
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className={fieldCls}
                            />
                        </label>
                    ))}
                    {/* Account / mobile number — digits only, max 11 */}
                    <label className={`${serif} text-[11px] text-[#666]`}>
                        Account / mobile number
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={11}
                            value={form.account_number}
                            onChange={(e) =>
                                setForm({ ...form, account_number: e.target.value.replace(/\D/g, "").slice(0, 11) })
                            }
                            placeholder="09XXXXXXXXX"
                            className={fieldCls}
                        />
                    </label>

                    <div className="flex items-center gap-[12px]">
                        {(qr || (m.qr_url && !removeQr)) && (
                            <img
                                src={qr || m.qr_url}
                                alt="QR preview"
                                className="h-[70px] w-[70px] rounded border border-black/10 object-cover"
                            />
                        )}
                        <div className="flex flex-col gap-[6px]">
                            <label
                                className={`${serif} inline-block cursor-pointer rounded-[6px] border border-[#00000052] bg-white px-[10px] py-[5px] text-[12px] hover:bg-[#f2f2f2]`}
                            >
                                {qr || m.qr_url ? "Change QR" : "Upload QR"}
                                <input type="file" accept="image/*" hidden onChange={pickQr} />
                            </label>
                            {(qr || (m.qr_url && !removeQr)) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQr(null);
                                        setRemoveQr(true);
                                    }}
                                    className={`${serif} cursor-pointer border-0 bg-transparent p-0 text-left text-[11px] text-red-600 underline`}
                                >
                                    Remove QR
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Notice msg={msg} />

            <div className="mt-[16px] flex flex-wrap gap-[10px]">
                {!editing ? (
                    <>
                        <button
                            type="button"
                            onClick={startEdit}
                            className={`${serif} h-[33px] cursor-pointer rounded-[7px] border border-[#00000052] bg-white px-[14px] text-[14px] font-bold text-[#202020] hover:bg-[#f2f2f2]`}
                        >
                            Edit details
                        </button>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={remove}
                            className={`${serif} h-[33px] cursor-pointer rounded-[7px] border border-red-300 bg-white px-[14px] text-[13px] text-red-700 hover:bg-red-50 disabled:opacity-60`}
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={save}
                            className={`${serif} h-[33px] cursor-pointer rounded-[7px] border-0 bg-[#4a9b8e] px-[16px] text-[14px] font-bold text-white hover:bg-[#3f8a7d] disabled:opacity-60`}
                        >
                            {busy ? "Saving…" : "Save"}
                        </button>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => setEditing(false)}
                            className={`${serif} h-[33px] cursor-pointer rounded-[7px] border border-[#00000052] bg-white px-[14px] text-[14px] disabled:opacity-60`}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </Card>
    );
}

/* ---------------- Page ---------------- */
export default function PaymentMethods() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [methods, setMethods] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/admin/payment-settings")
            .then((d) => {
                setSettings(d);
                setMethods(d.methods || []);
            })
            .catch((err) => setError(err.message || "Could not load payment settings."));
    }, []);

    const todayLabel = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex min-h-screen w-full bg-[#f2f2f2] antialiased">
            <style>{FONT_CSS}</style>
            <AdminNavigation />

            <main className="flex-1 px-[41px] pb-[60px] pt-[51px]">
                <header className="flex items-start justify-between">
                    <div>
                        <div className={`${inter} text-[20px] font-bold tracking-[4.2px] text-[#4a9b8e]`}>PAYMENT</div>
                        <h1 className={`${serif} mt-[8px] text-[40px] font-bold leading-[1.15] text-[#2f4a42]`}>
                            prices &amp; payment methods.
                        </h1>
                        <p className={`${serif} mt-[8px] max-w-[520px] text-[14px] font-bold text-[#2f4a42]`}>
                            Set the fee for each service, the downpayment percent, and where clients should send their money.
                        </p>
                    </div>
                    <div className="flex h-[30px] w-[190px] items-center justify-center rounded-[6px] border border-[#4a9b8e] bg-[#e3f2ee]">
                        <span className={`${inter} text-[12px] font-bold text-[#2a8570]`}>{todayLabel}</span>
                    </div>
                </header>

                <div className="mt-[28px] inline-flex h-[28px] items-center gap-[2px] rounded-[11px] bg-[#4a9b8e30] p-[4px]">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/payment")}
                        className={`${serif} h-[20px] cursor-pointer rounded-[11px] border-0 bg-transparent px-[12px] text-[10px] text-[#202020]`}
                    >
                        Payments Receive
                    </button>
                    <button type="button" className={`${serif} h-[20px] rounded-[11px] border-0 bg-white px-[12px] text-[10px] text-[#202020]`}>
                        Payment methods
                    </button>
                </div>

                {error && (
                    <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
                )}
                {!settings && !error && <p className={`${serif} mt-6 text-sm text-[#666]`}>Loading…</p>}

                {settings && (
                    <>
                        <div className="mt-[16px] grid grid-cols-2 items-start gap-[24px] max-[1100px]:grid-cols-1">
                            <PricingCard settings={settings} onSaved={setSettings} />
                            <AddMethod onAdded={(m) => setMethods((l) => [...l, m])} />
                        </div>

                        <div className="mt-[24px] grid grid-cols-2 gap-[24px] max-[1100px]:grid-cols-1">
                            {methods.map((m) => (
                                <MethodCard
                                    key={m.id}
                                    m={m}
                                    onChange={(nm) => setMethods((l) => l.map((x) => (x.id === nm.id ? nm : x)))}
                                    onDelete={(id) => setMethods((l) => l.filter((x) => x.id !== id))}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}