import React from "react";
import { CLINIC } from "../data/clinic";
import { peso, to12 } from "./payUtils";

/**
 * ReceiptModal
 * Props:
 *  - appointment : raw appointment object (from Confirmation or MyAppointments raw)
 *  - onClose     : () => void
 *
 * Print strategy: window.open() → document.write() so only receipt content
 * goes to the printer regardless of modal/overlay state.
 */
export default function ReceiptModal({ appointment, onClose }) {
  if (!appointment) return null;

  /* ── Date ───────────────────────────────────────────────────── */
  const rawDate = appointment.date || appointment.raw?.date;
  let dateFormatted = "—";
  if (rawDate) {
    const [y, m, d] = String(rawDate).slice(0, 10).split("-").map(Number);
    dateFormatted = new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /* ── Time ────────────────────────────────────────────────────── */
  const startTime = appointment.start_time || appointment.raw?.start_time;
  const endTime   = appointment.end_time   || appointment.raw?.end_time;
  const timeFormatted = startTime
    ? `${to12(String(startTime).slice(0, 5))}${endTime ? ` – ${to12(String(endTime).slice(0, 5))}` : ""}`
    : appointment.time || "—";

  /* ── Reference / Receipt No. ─────────────────────────────────── */
  const reference =
    appointment.reference ||
    appointment.raw?.reference ||
    appointment.reference_number ||
    `TF-${appointment.id || "0000"}`;

  /* ── Client Info ─────────────────────────────────────────────── */
  const clientName   = appointment.client_name   || appointment.raw?.client_name   || appointment.client?.name  || "—";
  const clientEmail  = appointment.client_email  || appointment.raw?.client_email  || appointment.client?.email || "—";
  const clientMobile = appointment.client_mobile || appointment.raw?.client_mobile || appointment.client?.mobile || "—";

  /* ── Service / Psychologist ──────────────────────────────────── */
  const serviceName =
    appointment.service?.full_name ||
    appointment.service?.name ||
    appointment.service_name ||
    appointment.raw?.service_name ||
    "Psychotherapy & Consultation";

  const psychName =
    appointment.psychologist?.name ||
    (typeof appointment.psychologist === "string" ? appointment.psychologist : null) ||
    appointment.raw?.psychologist ||
    "To be assigned";

  /* ── Payment ─────────────────────────────────────────────────── */
  const payment       = appointment.payment || appointment.raw?.payment || {};
  const amountPaid    = Number(payment.amount_paid  || appointment.raw?.amount_paid  || appointment.amount_paid  || 0);
  const balance       = Number(payment.balance      || appointment.raw?.balance      || appointment.balance      || 0);
  const totalFee      = Number(payment.total_fee    || appointment.raw?.total_amount || appointment.total_amount || (amountPaid + balance) || 0);
  const paymentMethod = payment.method || appointment.raw?.method || appointment.method || appointment.raw?.payment_method || "Online Payment";
  const refNum        = appointment.raw?.reference_number || appointment.reference_number || "—";

  /* ── GCash proof photo (screen-only, hidden in print) ────────── */
  const proofUrl =
    appointment.raw?.receipt_url ||
    appointment.receipt_url      ||
    null;

  /* ── Status ──────────────────────────────────────────────────── */
  const status = appointment.status || appointment.raw?.label || "Confirmed";

  /* ── Issue Date ──────────────────────────────────────────────── */
  const issueDateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* ── Print Handler ───────────────────────────────────────────── */
  const handlePrint = () => {
    const totalDisplay = totalFee > 0 ? peso(totalFee) : peso(amountPaid);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Official Receipt — ${reference}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      color: #202020;
      background: #fff;
      padding: 32px 40px;
    }
    /* ── Clinic header ── */
    .clinic-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #2a6a53;
      padding-bottom: 18px;
      margin-bottom: 18px;
    }
    .clinic-name {
      font-size: 22px;
      font-weight: 800;
      color: #2a6a53;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .clinic-sub {
      font-size: 10px;
      color: #555;
      margin-top: 3px;
      max-width: 280px;
      line-height: 1.4;
    }
    .receipt-label-block {
      text-align: right;
    }
    .official-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #888;
    }
    .receipt-num {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: 800;
      color: #111;
      margin-top: 2px;
    }
    /* ── Receipt no banner ── */
    .ref-banner {
      background: #1a362d;
      color: #fff;
      border-radius: 10px;
      padding: 14px 20px;
      text-align: center;
      margin-bottom: 20px;
    }
    .ref-banner .label {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      opacity: 0.65;
    }
    .ref-banner .num {
      font-family: 'Courier New', monospace;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 3px;
      margin-top: 4px;
    }
    .ref-banner .hint {
      font-size: 9px;
      opacity: 0.5;
      margin-top: 4px;
    }
    /* ── Status badge ── */
    .status-badge {
      display: inline-block;
      background: #d1fae5;
      border: 1px solid #34d399;
      color: #065f46;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 3px 10px;
      margin-bottom: 14px;
    }
    /* ── Two-col info ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-label {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 4px;
    }
    .info-val {
      font-size: 12px;
      font-weight: 600;
      color: #111;
    }
    .info-sub {
      font-size: 10px;
      color: #555;
      margin-top: 2px;
    }
    .text-right { text-align: right; }
    /* ── Appointment box ── */
    .appt-box {
      border: 1px solid #d1fae5;
      background: #f0fdf4;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .appt-box .section-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #2a6a53;
      margin-bottom: 10px;
    }
    .appt-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .appt-key { font-size: 9px; color: #666; }
    .appt-val { font-size: 11px; font-weight: 600; color: #111; margin-top: 2px; }
    /* ── Payment table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 20px;
    }
    thead tr {
      border-bottom: 1px solid #d1d5db;
    }
    thead th {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #666;
      padding: 6px 0;
    }
    tbody td { padding: 8px 0; }
    tfoot td { padding-top: 6px; }
    .text-green { color: #2a6a53; }
    .text-amber { color: #92400e; }
    .font-bold { font-weight: 700; }
    .text-sm { font-size: 10px; color: #777; }
    .border-top { border-top: 1px solid #d1d5db; }
    /* ── Footer ── */
    .receipt-footer {
      border-top: 1px dashed #d1d5db;
      margin-top: 24px;
      padding-top: 16px;
      text-align: center;
    }
    .footer-verified {
      font-size: 10px;
      font-weight: 700;
      color: #2a6a53;
      margin-bottom: 4px;
    }
    .footer-note { font-size: 9px; color: #777; line-height: 1.5; }
    /* ── Sig lines ── */
    .sig-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 36px;
    }
    .sig-line {
      border-top: 1px solid #333;
      padding-top: 6px;
      font-size: 9px;
      color: #555;
      text-align: center;
    }
    @media print {
      body { padding: 20px 28px; }
    }
  </style>
</head>
<body>
  <!-- Clinic Header -->
  <div class="clinic-header">
    <div>
      <div class="clinic-name">${CLINIC.name}</div>
      <div class="clinic-sub">${CLINIC.fullName}</div>
      <div class="clinic-sub" style="margin-top:5px;">
        ${CLINIC.address}<br/>
        ${CLINIC.phone} &nbsp;·&nbsp; ${CLINIC.email}
      </div>
    </div>
    <div class="receipt-label-block">
      <div class="official-label">Official Receipt</div>
      <div class="receipt-num">${reference}</div>
      <div style="font-size:9px;color:#888;margin-top:3px;">Issued: ${issueDateStr}</div>
    </div>
  </div>

  <!-- Reference Number Banner -->
  <div class="ref-banner">
    <div class="label">Official Receipt No. / Reference</div>
    <div class="num">${reference}</div>
    <div class="hint">Keep this number for your records &amp; clinic visits</div>
  </div>

  <!-- Status -->
  <div style="margin-bottom:14px;">
    <span class="status-badge">${status}</span>
  </div>

  <!-- Billed To / Receipt Details -->
  <div class="info-grid">
    <div>
      <div class="info-label">Billed To</div>
      <div class="info-val">${clientName}</div>
      ${clientEmail !== "—" ? `<div class="info-sub">${clientEmail}</div>` : ""}
      ${clientMobile !== "—" ? `<div class="info-sub">${clientMobile}</div>` : ""}
    </div>
    <div class="text-right">
      <div class="info-label">Issue Date</div>
      <div class="info-val">${issueDateStr}</div>
      <div style="margin-top:10px;">
        <div class="info-label">Payment Method</div>
        <div class="info-val">${paymentMethod}</div>
      </div>
      ${refNum !== "—" ? `<div style="margin-top:10px;"><div class="info-label">GCash/Transaction Ref</div><div class="info-val" style="font-family:monospace;">${refNum}</div></div>` : ""}
    </div>
  </div>

  <!-- Appointment Particulars -->
  <div class="appt-box">
    <div class="section-label">Appointment Particulars</div>
    <div class="appt-grid">
      <div>
        <div class="appt-key">Service</div>
        <div class="appt-val">${serviceName}</div>
      </div>
      <div>
        <div class="appt-key">Assigned Psychologist</div>
        <div class="appt-val">${psychName}</div>
      </div>
      <div>
        <div class="appt-key">Scheduled Date</div>
        <div class="appt-val">${dateFormatted}</div>
      </div>
      <div>
        <div class="appt-key">Scheduled Time</div>
        <div class="appt-val">${timeFormatted}</div>
      </div>
    </div>
  </div>

  <!-- Payment Summary -->
  <table>
    <thead>
      <tr>
        <th style="text-align:left;">Description</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-weight:600;color:#111;">${serviceName}</div>
          <div class="text-sm">Professional consultation session fee</div>
        </td>
        <td style="text-align:right;font-weight:600;">${totalDisplay}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="border-top">
        <td style="font-weight:600;">Total Consultation Fee</td>
        <td style="text-align:right;font-weight:600;">${totalDisplay}</td>
      </tr>
      <tr>
        <td class="text-green font-bold">Amount Paid / Downpayment</td>
        <td class="text-green font-bold" style="text-align:right;">${peso(amountPaid)}</td>
      </tr>
      ${balance > 0 ? `<tr>
        <td class="text-amber font-bold">Remaining Balance (Due after session)</td>
        <td class="text-amber font-bold" style="text-align:right;">${peso(balance)}</td>
      </tr>` : ""}
    </tfoot>
  </table>

  <!-- Signature lines -->
  <div class="sig-row">
    <div class="sig-line">Authorized Signatory / Clinic Representative</div>
    <div class="sig-line">Client Signature over Printed Name</div>
  </div>

  <!-- Footer -->
  <div class="receipt-footer">
    <div class="footer-verified">✓ Electronic Verification Validated</div>
    <div class="footer-note">
      Thank you for entrusting your mental wellness with Threefold Therapy.<br/>
      This document serves as an official electronic acknowledgment receipt.<br/>
      Please present this reference number when attending your session.
    </div>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=820,height=700,scrollbars=yes");
    if (!win) {
      alert("Pop-up was blocked. Please allow pop-ups for this site and try again.");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    // slight delay so images / fonts can render before print dialog
    setTimeout(() => {
      win.print();
    }, 500);
  };

  /* ── Render ──────────────────────────────────────────────────── */
  const totalDisplay = totalFee > 0 ? peso(totalFee) : peso(amountPaid);

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-black/55 flex items-start justify-center p-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-[600px] rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* ── Top action bar ───────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-[#f4f9f7] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-sm text-[#1a2e26]">Official Booking Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2a6a53] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1f5240] transition cursor-pointer"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/20 bg-white px-3 py-2 text-xs font-medium text-[#555] hover:bg-black/5 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* ── Receipt body ─────────────────────────────────────── */}
        <div className="p-6 text-[#202020] font-sans space-y-5">

          {/* Clinic Header */}
          <div className="flex justify-between items-start gap-4 pb-4 border-b-2 border-[#2a6a53]">
            <div>
              <h1 className="m-0 font-serif text-2xl font-black tracking-tight text-[#2a6a53] uppercase">
                {CLINIC.name}
              </h1>
              <p className="m-0 mt-0.5 text-[11px] text-[#666] leading-relaxed">{CLINIC.fullName}</p>
              <p className="m-0 mt-1.5 text-[11px] text-[#777]">{CLINIC.address}</p>
              <p className="m-0 mt-0.5 text-[11px] text-[#777]">
                {CLINIC.phone} &nbsp;·&nbsp; {CLINIC.email}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block rounded-full border border-[#2a6a53]/30 bg-[#ebfef6] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1a5240]">
                {status}
              </span>
              <p className="m-0 mt-2 text-[9px] font-black uppercase tracking-widest text-[#999]">Official Receipt</p>
              <p className="m-0 mt-0.5 font-mono text-sm font-bold text-[#111]">{reference}</p>
              <p className="m-0 mt-0.5 text-[10px] text-[#aaa]">Issued {issueDateStr}</p>
            </div>
          </div>

          {/* Reference Number Banner */}
          <div className="rounded-xl bg-[#1a362d] text-white px-6 py-4 text-center">
            <p className="m-0 text-[9px] font-black tracking-[3px] uppercase opacity-60">
              Official Receipt No. / Reference
            </p>
            <p className="m-0 mt-2 font-mono text-2xl font-black tracking-widest">
              {reference}
            </p>
            <p className="m-0 mt-1.5 text-[10px] opacity-50">
              Keep this number for your records &amp; clinic visits
            </p>
          </div>

          {/* Billed To / Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-black/10 text-xs">
            <div>
              <p className="m-0 text-[9px] font-black uppercase tracking-widest text-[#999]">Billed To</p>
              <p className="m-0 mt-1 font-bold text-[14px] text-[#111]">{clientName}</p>
              {clientEmail !== "—" && <p className="m-0 mt-0.5 text-[#555]">{clientEmail}</p>}
              {clientMobile !== "—" && <p className="m-0 text-[#555]">{clientMobile}</p>}
            </div>
            <div className="text-right">
              <p className="m-0 text-[9px] font-black uppercase tracking-widest text-[#999]">Payment Method</p>
              <p className="m-0 mt-1 font-semibold text-[#111]">{paymentMethod}</p>
              {refNum !== "—" && (
                <>
                  <p className="m-0 mt-2 text-[9px] font-black uppercase tracking-widest text-[#999]">GCash / Transaction Ref</p>
                  <p className="m-0 mt-0.5 font-mono font-semibold text-[#111]">{refNum}</p>
                </>
              )}
            </div>
          </div>

          {/* Appointment Particulars */}
          <div className="rounded-xl border border-[#c8e6da] bg-[#f0fdf4] p-4">
            <p className="m-0 text-[9px] font-black uppercase tracking-widest text-[#2a6a53] mb-3">
              Appointment Particulars
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="text-[#777] text-[10px]">Service</dt>
                <dd className="m-0 mt-0.5 font-semibold text-[#111]">{serviceName}</dd>
              </div>
              <div>
                <dt className="text-[#777] text-[10px]">Assigned Psychologist</dt>
                <dd className="m-0 mt-0.5 font-semibold text-[#111]">{psychName}</dd>
              </div>
              <div>
                <dt className="text-[#777] text-[10px]">Scheduled Date</dt>
                <dd className="m-0 mt-0.5 font-medium text-[#111]">{dateFormatted}</dd>
              </div>
              <div>
                <dt className="text-[#777] text-[10px]">Scheduled Time</dt>
                <dd className="m-0 mt-0.5 font-medium text-[#111]">{timeFormatted}</dd>
              </div>
            </dl>
          </div>

          {/* Payment Summary Table */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/15">
                <th className="py-2 text-left text-[9px] font-black uppercase tracking-widest text-[#777]">Description</th>
                <th className="py-2 text-right text-[9px] font-black uppercase tracking-widest text-[#777]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-3">
                  <p className="m-0 font-semibold text-[#111]">{serviceName}</p>
                  <p className="m-0 text-[10px] text-[#777] mt-0.5">Professional consultation session fee</p>
                </td>
                <td className="py-3 text-right font-semibold">{totalDisplay}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-black/15">
                <td className="pt-3 font-semibold text-[#111]">Total Consultation Fee</td>
                <td className="pt-3 text-right font-semibold text-[#111]">{totalDisplay}</td>
              </tr>
              <tr>
                <td className="pt-2 font-bold text-[#2a6a53]">Amount Paid / Downpayment</td>
                <td className="pt-2 text-right font-bold text-[#2a6a53]">{peso(amountPaid)}</td>
              </tr>
              {balance > 0 && (
                <tr>
                  <td className="pt-1.5 font-semibold text-amber-800 text-[11px]">Remaining Balance (due after session)</td>
                  <td className="pt-1.5 text-right font-bold text-amber-800">{peso(balance)}</td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* GCash Proof Photo — SCREEN ONLY, never prints */}
          {proofUrl && (
            <div className="rounded-xl border border-dashed border-[#2a6a53]/30 bg-[#f9fefb] overflow-hidden">
              <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-[#2a6a53]/10">
                <svg className="size-4 text-[#2a6a53]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-bold text-[#2a6a53] uppercase tracking-wider">
                  Payment Proof (GCash Screenshot)
                </span>
                <span className="ml-auto text-[10px] text-[#aaa] italic">Screen view only — not printed</span>
              </div>
              <img
                src={proofUrl}
                alt="GCash payment proof"
                className="w-full max-h-72 object-contain p-3"
                onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-dashed border-black/15 pt-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2a6a53]">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Electronic Verification Validated
            </div>
            <p className="m-0 mt-1 text-[11px] text-[#777]">
              Thank you for entrusting your mental wellness with Threefold Therapy.
            </p>
            <p className="m-0 mt-0.5 text-[10px] text-[#aaa]">
              Please present this reference number when attending your session.
            </p>
          </div>
        </div>

        {/* ── Bottom action bar ─────────────────────────────────── */}
        <div className="flex justify-end gap-2 border-t border-black/10 bg-[#f4f9f7] px-6 py-3.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2a6a53] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1f5240] transition cursor-pointer"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/20 bg-white px-4 py-2 text-xs font-medium text-[#555] hover:bg-black/5 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
