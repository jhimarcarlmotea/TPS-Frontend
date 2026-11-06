import React from "react";
import { CLINIC } from "../data/clinic";

const LEGAL_CONTENT = {
  privacy: {
    title: "Data Privacy Policy",
    subtitle: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-[#333]">
        <p>
          At <strong>{CLINIC.name}</strong>, we are deeply committed to protecting your privacy and ensuring the confidentiality, integrity, and security of your personal and sensitive health information in compliance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012 (DPA), and the Psychology Act of 2009 (RA 10029).
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">1. Information We Collect</h4>
        <p>To provide high-quality mental health and behavioral care, we collect the following categories of information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Personal Identifying Information:</strong> Full name, nickname, date of birth, age, biological sex, gender identity, civil status, occupation, and home address.</li>
          <li><strong>Contact Information:</strong> Phone number, email address, and emergency contact details (name, relationship, mobile number).</li>
          <li><strong>Sensitive Health Information:</strong> Reason for seeking psychological services, symptom checklist assessments (e.g., DSM-5 Level 1 measure), previous psychotherapy history, medical history, psychiatric diagnoses, and current medications.</li>
          <li><strong>Transaction Records:</strong> Booking references, payment receipts, proof of payments, and appointment logs.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">2. Purpose of Collection &amp; Use</h4>
        <p>Your information is collected and processed solely for legitimate clinical and administrative purposes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Conducting intake reviews, clinical evaluations, and mental health counseling.</li>
          <li>Matching you with the most appropriate psychologist or behavioral therapist.</li>
          <li>Scheduling, confirming, rescheduling, or communicating about appointments.</li>
          <li>Processing booking fees and generating official transaction receipts.</li>
          <li>Complying with statutory and regulatory healthcare requirements.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">3. Strict Confidentiality &amp; Ethical Limits</h4>
        <p>
          All information disclosed during therapy sessions is protected by psychologist-client privileged communication. However, in accordance with professional codes of ethics and Philippine law, confidentiality may be broken only under the following strictly defined conditions:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Where there is a clear and imminent danger that the client will harm themselves or others.</li>
          <li>Where there is reasonable cause to suspect abuse, neglect, or exploitation of a minor, an elderly individual, or a vulnerable person.</li>
          <li>Pursuant to a valid and legally binding subpoena or court order issued by a court of competent jurisdiction.</li>
          <li>When express, written, and informed consent is given by the client or legal guardian.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">4. Data Storage &amp; Security</h4>
        <p>
          We employ robust organizational, physical, and technological security measures to protect your data from unauthorized access, loss, destruction, alteration, or disclosure. Digital records are encrypted and access is strictly restricted to authorized healthcare professionals and clinical staff bound by non-disclosure agreements.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">5. Your Rights as a Data Subject</h4>
        <p>Under the Data Privacy Act of 2012, you possess the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be informed of the processing of your personal data.</li>
          <li>Reasonable access to your personal and clinical records on file.</li>
          <li>Request correction or rectification of erroneous or outdated data.</li>
          <li>Suspend, withdraw, or order the blocking, removal, or destruction of your personal data from our active system, subject to legal health retention guidelines.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">6. Data Protection Inquiries</h4>
        <p>
          If you have questions, concerns, or requests regarding your personal data and rights, please reach out to our clinic administration at:
        </p>
        <p className="bg-[#f0f6f4] p-3 rounded-lg border border-[#2a6a53]/20 font-medium text-xs">
          <strong>Data Protection Office — {CLINIC.name}</strong><br />
          Email: {CLINIC.email}<br />
          Address: {CLINIC.address}<br />
          Phone: {CLINIC.phone}
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Policies, Session Guidelines & Client Agreement",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-[#333]">
        <p>
          Welcome to <strong>{CLINIC.name}</strong>. By accessing our website, creating an account, or booking appointments, you agree to comply with and be bound by the following Terms of Service.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">1. Scope of Services</h4>
        <p>
          Threefold Therapy provides professional mental wellness services, including individual psychotherapy, psychological assessments, behavioral therapy (such as ABA therapy), and clinical consultations conducted by qualified professionals.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">2. Emergency Disclaimer (Not an Emergency Center)</h4>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-900 text-xs">
          <strong>Important:</strong> Our clinic and online services do not provide 24/7 crisis intervention or emergency rescue. If you or someone you know is in immediate danger of self-harm or a life-threatening crisis, please do not wait for an appointment. Proceed immediately to the nearest hospital emergency room or contact the National Center for Mental Health Crisis Hotline at <strong>1553</strong> (toll-free Luzon) or <strong>0917-899-USAP (8727)</strong>.
        </div>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">3. Appointments &amp; Punctuality</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sessions are scheduled in advance based on clinician availability.</li>
          <li>For in-person sessions, please arrive 10–15 minutes before your scheduled start time.</li>
          <li>For online teletherapy sessions, please ensure a stable internet connection and a private, quiet space.</li>
          <li>If you arrive late, your session will still end at the scheduled time to respect the schedules of succeeding clients.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">4. Payment, Downpayments &amp; Balance</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>A non-refundable booking downpayment or full session payment is required to confirm and hold your slot.</li>
          <li>Any remaining balance is payable immediately following the conclusion of the session.</li>
          <li>Payments may be made via GCash, bank transfer, PayMongo, or accepted clinic payment methods.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">5. Rescheduling &amp; Cancellation Policy</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Rescheduling requests must be filed at least 24 hours prior to the scheduled session.</li>
          <li>Appointments cancelled by the client or missed without prior notice (no-shows) are non-refundable.</li>
          <li>In the rare event that a clinician must reschedule due to unforeseen emergencies, the client will be offered an immediate alternate schedule or a full credit.</li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">6. Code of Conduct</h4>
        <p>
          We are committed to maintaining a safe, respectful, and therapeutic environment. Abusive language, harassment, threats, or disruptive behavior toward clinicians or staff will result in the immediate termination of services without refund.
        </p>
      </div>
    ),
  },
  cookies: {
    title: "Cookie Policy",
    subtitle: "How we use cookies and browser storage",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-[#333]">
        <p>
          This Cookie Policy explains how <strong>{CLINIC.name}</strong> uses cookies and similar technologies in our web application to recognize you when you visit our platform.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">1. What Are Cookies?</h4>
        <p>
          Cookies are small text files placed on your device by websites you visit. They are widely used to make web applications function efficiently, preserve user login sessions, and provide basic operational insights.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">2. Cookies We Use</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Essential &amp; Authentication Cookies:</strong> These cookies are strictly necessary to provide you with secure access to your client portal, authenticate your login session via secure Sanctum tokens, and protect against Cross-Site Request Forgery (CSRF).
          </li>
          <li>
            <strong>Booking Flow State (Session Storage):</strong> We use browser session storage temporarily during the booking process so your chosen slot, service selection, and intake details are preserved across booking steps without loss.
          </li>
          <li>
            <strong>Preferences &amp; Security Cookies:</strong> These help remember your preferences (such as audio/video devices during teletherapy consultations) and uphold connection security.
          </li>
        </ul>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">3. We Do Not Sell Your Data</h4>
        <p>
          We do not use advertising or behavioral tracking cookies that track you across third-party websites. We never sell or monetize your browsing or health data.
        </p>

        <h4 className="font-serif text-base font-bold text-[#1a362d] mt-4">4. Managing Cookies</h4>
        <p>
          Most web browsers allow you to control cookies through their settings preferences. However, please note that disabling strictly necessary cookies may prevent you from logging in, booking appointments, or participating in teletherapy sessions.
        </p>
      </div>
    ),
  },
};

export default function LegalModal({ type, onClose }) {
  if (!type || !LEGAL_CONTENT[type]) return null;

  const data = LEGAL_CONTENT[type];

  return (
    <div
      className="fixed inset-0 z-[150] grid place-items-center bg-black/55 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/10 bg-[#f7faf8] px-6 py-5">
          <div>
            <h3 className="m-0 font-serif text-xl font-bold text-[#1a362d]">{data.title}</h3>
            {data.subtitle && (
              <p className="m-0 mt-0.5 text-xs font-sans text-[#666]">{data.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#555] hover:bg-black/5 transition cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 text-sm">{data.content}</div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-black/10 bg-[#f7faf8] px-6 py-3.5 text-xs text-[#777]">
          <span>Effective Date: 2026 · {CLINIC.name}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2a6a53] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#235845] transition cursor-pointer"
          >
            Understood &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
