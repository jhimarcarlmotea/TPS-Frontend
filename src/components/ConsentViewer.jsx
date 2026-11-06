import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../auth";
import { DSM5_OPTIONS, DSM5_QUESTIONS, domainResults } from "./dsm5";

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

const fmtDate = (s, opts = { month: "long", day: "numeric", year: "numeric" }) =>
    s ? new Date(s.length === 10 ? s + "T00:00" : s).toLocaleDateString("en-US", opts) : "—";

const yn = (v, details) => (v ? `Yes${details ? ` — ${details}` : ""}` : "No");

function Row({ k, v }) {
    return (
        <div className="flex justify-between gap-4 border-b border-black/5 py-2 text-sm last:border-0">
            <dt className="m-0 shrink-0 text-[#666]">{k}</dt>
            <dd className="m-0 break-words text-right font-medium text-[#202020]">{v || "—"}</dd>
        </div>
    );
}

function Block({ title, children }) {
    return (
        <section className="mt-5 first:mt-0">
            <p className={`${inter} m-0 mb-1 text-[11px] font-bold tracking-[0.1em] text-[#4a9b8e]`}>{title}</p>
            {children}
        </section>
    );
}

const TABS = [
    ["consent", "Consent"],
    ["intake", "Intake form"],
    ["dsm", "Symptom checklist"],
];

/**
 * Props:
 *  base        - "/admin" o "/affiliate"
 *  appointment - ang appointment (kailangan ang id at client_name)
 *  onClose     - isara ang modal
 */
export default function ConsentViewer({ base, appointment, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tab, setTab] = useState("consent");

    useEffect(() => {
        let alive = true;
        apiFetch(`${base}/appointments/${appointment.id}/consent`)
            .then((d) => alive && setData(d.consent))
            .catch((err) => alive && setError(err.message || "Could not load the consent form."))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, [base, appointment.id]);

    const results = useMemo(() => (data ? domainResults(data.dsm5) : []), [data]);
    const flagged = results.filter((r) => r.flagged);
    const selfHarm = data ? data.dsm5[10] : 0;

    const i = data?.intake || {};
    const contacts = i.emergency || [];
    const agreements = data?.agreements || {};

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/45 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className={`${serif} m-0 text-xl text-[#202020]`}>Consent &amp; intake forms</h3>
                        <p className={`${serif} m-0 mt-0.5 text-sm text-[#666]`}>
                            {appointment.client_name}
                            {data && <> · submitted {fmtDate(data.submitted_at, { month: "short", day: "numeric", year: "numeric" })}</>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`${serif} cursor-pointer rounded-md border border-[#c7b6b6] bg-white px-4 py-1.5 text-sm`}
                    >
                        Close
                    </button>
                </div>

                {loading && <p className={`${serif} mt-6 text-sm text-[#666]`}>Loading…</p>}
                {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
                {!loading && !error && !data && (
                    <p className={`${serif} mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900`}>
                        The client has not submitted the consent form yet.
                    </p>
                )}

                {data && (
                    <>
                        {selfHarm >= 1 && (
                            <p className="mb-0 mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                                <strong>Please review promptly:</strong> the client reported thoughts of hurting themselves
                                (question 11 answered {selfHarm} · {DSM5_OPTIONS[selfHarm].label}).
                            </p>
                        )}

                        <div className="mt-4 inline-flex gap-[3px] rounded-[11px] bg-[#4a9b8e30] p-[3px]">
                            {TABS.map(([id, label]) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setTab(id)}
                                    className={`${serif} h-[26px] cursor-pointer rounded-[9px] border-0 px-[14px] text-[12px] text-[#202020] ${tab === id ? "bg-white font-bold" : "bg-transparent"
                                        }`}
                                >
                                    {label}
                                    {id === "dsm" && flagged.length > 0 && (
                                        <span className="ml-1.5 rounded-full bg-[#fdf1bc] px-1.5 text-[10px] text-[#7a5400]">{flagged.length}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
                            {/* ---------- Consent ---------- */}
                            {tab === "consent" && (
                                <>
                                    <Block title="AGREEMENTS ACCEPTED">
                                        <dl className="m-0">
                                            <Row k="Read and understood the agreement" v={agreements.read ? "Yes" : "No"} />
                                            <Row k="Limits of confidentiality" v={agreements.confidentiality ? "Yes" : "No"} />
                                            <Row k="Not a 24/7 crisis facility" v={agreements.crisis ? "Yes" : "No"} />
                                            <Row k="Punctuality, cancellation & fees" v={agreements.fees ? "Yes" : "No"} />
                                            <Row k="Data privacy consent (RA 10173)" v={agreements.privacy ? "Yes" : "No"} />
                                        </dl>
                                    </Block>
                                    <Block title="SIGNATURE">
                                        <dl className="m-0">
                                            <Row k="Client’s printed name" v={data.signed_name} />
                                            <Row k="Date signed" v={fmtDate(data.signed_date)} />
                                            <Row k="Submitted" v={fmtDate(data.submitted_at, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} />
                                        </dl>
                                        {(data.signature_data || agreements?.signature_data) && (
                                            <div className="mt-3">
                                                <p className="m-0 text-xs font-semibold text-[#666]">Drawn Signature:</p>
                                                <div className="mt-1 inline-block rounded-lg border border-black/15 bg-white p-2">
                                                    <img
                                                        src={data.signature_data || agreements?.signature_data}
                                                        alt="Client digital signature"
                                                        className="max-h-24 max-w-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Block>
                                    {data.is_minor && data.guardian && (
                                        <Block title="PARENT / GUARDIAN (CLIENT IS UNDER 18)">
                                            <dl className="m-0">
                                                <Row k="Printed name" v={data.guardian.name} />
                                                <Row k="Relationship to minor" v={data.guardian.relation} />
                                            </dl>
                                            {(data.guardian_signature_data || agreements?.guardian_signature_data) && (
                                                <div className="mt-3">
                                                    <p className="m-0 text-xs font-semibold text-[#666]">Guardian Drawn Signature:</p>
                                                    <div className="mt-1 inline-block rounded-lg border border-black/15 bg-white p-2">
                                                        <img
                                                            src={data.guardian_signature_data || agreements?.guardian_signature_data}
                                                            alt="Guardian digital signature"
                                                            className="max-h-24 max-w-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Block>
                                    )}
                                </>
                            )}

                            {/* ---------- Intake ---------- */}
                            {tab === "intake" && (
                                <>
                                    <Block title="SECTION 1: GENERAL INFORMATION">
                                        <dl className="m-0">
                                            <Row k="Full name" v={i.full_name} />
                                            <Row k="Nickname" v={i.nickname} />
                                            <Row k="Gender / pronouns" v={i.gender} />
                                            <Row k="Civil status" v={i.civil_status} />
                                            <Row k="Date of birth" v={fmtDate(i.birthdate)} />
                                            <Row k="Age" v={i.age} />
                                            <Row k="Address" v={i.address} />
                                            <Row k="Mobile" v={i.mobile} />
                                            <Row k="Email" v={i.email} />
                                            <Row k="Occupation / grade level" v={i.occupation} />
                                            <Row k="How they heard about the clinic" v={i.heard_about} />
                                        </dl>
                                    </Block>
                                    <Block title="SECTION 2: EMERGENCY CONTACTS">
                                        {contacts.map((c, idx) => (
                                            <dl key={idx} className="m-0 mb-2">
                                                <Row k={`(${idx + 1}) Name`} v={c.name} />
                                                <Row k="Relationship" v={c.relation} />
                                                <Row k="Mobile" v={c.mobile} />
                                            </dl>
                                        ))}
                                    </Block>
                                    <Block title="SECTION 3: REASON FOR SEEKING SUPPORT">
                                        <dl className="m-0">
                                            <Row k="Main reason" v={i.reason} />
                                            <Row k="Experiencing for" v={i.duration_unit ? `${i.duration_unit} (days / weeks / months / years)` : ""} />
                                            <Row k="Goals for therapy" v={i.goals} />
                                        </dl>
                                    </Block>
                                    <Block title="SECTION 4: MEDICAL & MENTAL HEALTH HISTORY">
                                        <dl className="m-0">
                                            <Row k="Previous psychotherapy / counseling" v={yn(i.prev_therapy, i.prev_therapy_details)} />
                                            <Row k="Formal mental health diagnosis" v={yn(i.diagnosed, i.diagnosed_details)} />
                                            <Row k="Current prescription medications" v={yn(i.medications, i.medications_details)} />
                                            <Row k="Significant medical conditions / surgeries" v={yn(i.medical, i.medical_details)} />
                                        </dl>
                                    </Block>
                                </>
                            )}

                            {/* ---------- DSM-5 ---------- */}
                            {tab === "dsm" && (
                                <>
                                    <Block title="DOMAIN SUMMARY (HIGHEST SCORE PER DOMAIN)">
                                        <p className="m-0 mb-2 text-xs text-[#666]">
                                            Highlighted domains reached the DSM-5 Level 1 follow-up threshold. This is a screening guide only;
                                            clinical judgment applies.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 max-[640px]:grid-cols-1">
                                            {results.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${r.flagged ? "border-[#e8c547] bg-[#fdf1bc]" : "border-black/10 bg-white"
                                                        }`}
                                                >
                                                    <span className="text-[#202020]">
                                                        <strong>{r.id}.</strong> {r.name}
                                                    </span>
                                                    <span className={`shrink-0 font-bold ${r.flagged ? "text-[#7a5400]" : "text-[#2a8570]"}`}>
                                                        {r.highest} · {DSM5_OPTIONS[r.highest].label}
                                                        {r.flagged ? " ⚑" : ""}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Block>

                                    <Block title="ALL ANSWERS">
                                        <ol className="m-0 list-none p-0">
                                            {DSM5_QUESTIONS.map((q, idx) => {
                                                const v = data.dsm5[idx];
                                                return (
                                                    <li key={idx} className="flex items-start justify-between gap-4 border-b border-black/5 py-2 text-sm last:border-0">
                                                        <span className="text-[#444]">
                                                            <strong className="mr-1 text-[#4a9b8e]">{idx + 1}.</strong>
                                                            {q.length > 140 ? q.slice(0, 140) + "…" : q}
                                                        </span>
                                                        <span
                                                            className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${v >= 3 ? "bg-red-100 text-red-700" : v >= 1 ? "bg-[#fdf1bc] text-[#7a5400]" : "bg-[#e3f2ee] text-[#2a8570]"
                                                                }`}
                                                        >
                                                            {v} · {DSM5_OPTIONS[v]?.label}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    </Block>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}