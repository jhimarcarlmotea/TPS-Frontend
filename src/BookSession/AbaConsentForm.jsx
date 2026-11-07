import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../auth";
import SignaturePad from "../components/SignaturePad";

const PROVIDER_NAME = "Threefold Behavioral Interventions and Psychological Services";

function ConsentDocumentField({ label, value, onChange, error, type = "text", readOnly = false }) {
  return (
    <label className="flex min-w-0 items-baseline gap-2 text-sm text-[#202020]">
      <span className="shrink-0 font-bold">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        className="min-w-0 flex-1 border-0 border-b border-black bg-transparent px-1 py-0.5 font-serif text-sm outline-none focus:border-tf-teal"
        aria-label={label}
      />
      {error && <span className="text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}

function PolicySection({ title, children }) {
  return (
    <section>
      <h3 className="mb-2 mt-5 font-serif text-base font-bold text-[#202020]">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-[#444]">{children}</div>
    </section>
  );
}

function PolicyItem({ title, children }) {
  return (
    <li>
      {title && <strong>{title}: </strong>}
      {children}
    </li>
  );
}

function today() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dateLabel(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function initialValues(prefill, paymentId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(`tf_aba_consent_draft_${paymentId}`) || "null");
    if (saved) return saved;
  } catch (error) {
    console.error("Could not load ABA consent draft.", error);
  }

  return {
    clientName: prefill?.full_name || "",
    birthdate: prefill?.birthdate || "",
    guardianNames: "",
    providerName: PROVIDER_NAME,
    mediaRecording: false,
    telehealthConsent: false,
    agreement: false,
    signerName: "",
    relationship: "",
    signatureData: "",
  };
}

export default function AbaConsentForm({ paymentId, prefill, onComplete }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => initialValues(prefill, paymentId));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    try {
      sessionStorage.setItem(`tf_aba_consent_draft_${paymentId}`, JSON.stringify(values));
    } catch (error) {
      console.error("Could not save ABA consent draft.", error);
    }
  }, [paymentId, values]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async () => {
    const nextErrors = {};
    if (values.clientName.trim().length < 2) nextErrors.clientName = "Client name is required.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.birthdate) || values.birthdate > today() || values.birthdate < "1900-01-01") {
      nextErrors.birthdate = "Enter a valid date of birth.";
    }
    if (values.guardianNames.trim().length < 2) nextErrors.guardianNames = "Parent or legal guardian name is required.";
    if (!values.agreement) nextErrors.agreement = "Please acknowledge and agree to the consent terms.";
    if (values.signerName.trim().length < 2) nextErrors.signerName = "Printed name is required.";
    if (values.relationship.trim().length < 2) nextErrors.relationship = "Relationship to client is required.";
    if (!values.signatureData) nextErrors.signatureData = "Parent or legal guardian signature is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      await apiFetch("/booking/consent", {
        method: "POST",
        body: JSON.stringify({
          intake: {
            full_name: values.clientName.trim(),
            birthdate: values.birthdate,
            guardian_names: values.guardianNames.trim(),
            provider_name: PROVIDER_NAME,
            guardian_printed_name: values.signerName.trim(),
            guardian_relation: values.relationship.trim(),
          },
          consent: {
            agreement: true,
            media_recording: !!values.mediaRecording,
            telehealth: !!values.telehealthConsent,
          },
          dsm5: [],
          sign: {
            name: values.signerName.trim(),
            certify: true,
            signature_data: values.signatureData,
          },
          guardian: {
            name: values.signerName.trim(),
            relation: values.relationship.trim(),
            signature_data: values.signatureData,
          },
        }),
      });

      try {
        sessionStorage.removeItem(`tf_aba_consent_draft_${paymentId}`);
      } catch (error) {
        console.error("Could not clear ABA consent draft.", error);
      }
      onComplete();
    } catch (error) {
      if (error.message?.includes("session expired")) return navigate("/signin");
      setServerError(error.message || "Could not submit the ABA consent form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <p className="mb-4 text-sm text-[#666]">
        Read the ABA agreement below, enter the client and guardian details, then provide your consent and signature.
      </p>

      <div className="rounded-xl border border-black/10 bg-[#fbfdfc] p-5">
        <h3 className="m-0 text-center font-serif text-lg font-bold text-[#202020]">
          INFORMED CONSENT &amp; SERVICE AGREEMENT FOR ABA THERAPY
        </h3>
        <div className="mt-5 grid gap-3">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(150px,0.55fr)] gap-5 max-[560px]:grid-cols-1">
            <ConsentDocumentField label="Client Name:" value={values.clientName} onChange={(value) => update("clientName", value)} error={errors.clientName} />
            <ConsentDocumentField label="DOB:" value={values.birthdate} onChange={(value) => update("birthdate", value)} error={errors.birthdate} type="date" />
          </div>
          <ConsentDocumentField label="Parent/Legal Guardian Name(s):" value={values.guardianNames} onChange={(value) => update("guardianNames", value)} error={errors.guardianNames} />
          <ConsentDocumentField label="Provider / Clinic Name:" value={PROVIDER_NAME} readOnly />
        </div>

        <PolicySection title="1. Description of ABA Services">
          <p className="m-0">
            Applied Behavior Analysis (ABA) is an evidence-based therapy focused on increasing functional behaviors
            (e.g., communication, social skills, daily living skills) and decreasing behaviors that interfere with
            learning or safety. Services may include:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-6">
            <PolicyItem title="Assessments">Functional Behavior Assessments (FBA), skill evaluations, and direct observations.</PolicyItem>
            <PolicyItem title="Direct Therapy">One-on-one sessions provided by a Registered Behavior Technician (RBT) or Board Certified Assistant Behavior Analyst (BCaBA).</PolicyItem>
            <PolicyItem title="Supervision & Program Modification">Ongoing clinical oversight by a Board Certified Behavior Analyst (BCBA).</PolicyItem>
            <PolicyItem title="Caregiver / Parent Training">Required sessions to teach families strategies to generalize skills across home and community settings.</PolicyItem>
          </ul>
        </PolicySection>

        <PolicySection title="2. Benefits and Risks">
          <ul className="m-0 list-disc space-y-1 pl-6">
            <PolicyItem title="Benefits">Potential improvements in functional communication, independence, social interaction, and emotional regulation.</PolicyItem>
            <PolicyItem title="Risks">Target behaviors may temporarily increase (extinction bursts) or produce emotional frustration as new skills are introduced. ABA does not guarantee specific outcomes, as progress varies by individual.</PolicyItem>
          </ul>
        </PolicySection>

        <PolicySection title="3. Payment, Deposit, and Advance Payment Policy">
          <ul className="m-0 list-disc space-y-1 pl-6">
            <PolicyItem title="Non-Refundable Deposit / Advance Payment">All session deposits, retainer fees, or advance payments are strictly non-refundable. Cash, check, or electronic refunds will not be issued under any circumstances.</PolicyItem>
            <PolicyItem title="Service Consumption">All advance payments or deposits must be consumed through scheduled ABA sessions, parent training, supervision, or evaluations.</PolicyItem>
            <PolicyItem title="Expiration of Unused Credits">Advance payments credited to the client’s account must be used within [e.g., 60 or 90 days] of the payment date. Unused funds remaining after this period will be forfeited.</PolicyItem>
          </ul>
        </PolicySection>

        <PolicySection title="4. Session Cancellation & Attendance Policy">
          <p className="m-0">Regular attendance is essential for consistent progress.</p>
          <ul className="m-0 list-disc space-y-1 pl-6">
            <PolicyItem title="Rescheduling">If a session is canceled with at least [e.g., 24 hours] advance notice, any deposit or advance payment made for that session will remain on account and be applied toward a rescheduled session.</PolicyItem>
            <PolicyItem title="Late Cancellation / No-Show">Cancellations made with less than the required notice, or missed sessions, will result in the forfeiture of that session’s deposit/advance payment to cover reserved provider time.</PolicyItem>
            <PolicyItem title="Attendance Requirement">Frequent absences (e.g., dropping below [e.g., 80%] attendance) may result in a reduction of scheduled hours or discharge from services.</PolicyItem>
          </ul>
        </PolicySection>

        <PolicySection title="5. Therapy Environment & Professional Boundaries">
          <ul className="m-0 list-disc space-y-1 pl-6">
            <PolicyItem title="Parent/Guardian Presence">A parent or designated adult guardian (18+) must be present in the home/location during all in-home or community therapy sessions.</PolicyItem>
            <PolicyItem title="Environment">Families must provide a safe, smoke-free, and distraction-minimized environment for in-home care.</PolicyItem>
            <PolicyItem title="Professional Boundaries">Per the Behavior Analyst Certification Board (BACB) Ethics Code, clinical staff cannot accept personal gifts, food, or participate in dual personal relationships.</PolicyItem>
          </ul>
        </PolicySection>

        <PolicySection title="6. Confidentiality & HIPAA">
          <p className="m-0">Your protected health information (PHI) is strictly confidential under federal and state laws. Exceptions include:</p>
          <ul className="m-0 list-disc space-y-1 pl-6">
            <li>Mandatory reporting of suspected child/elder abuse, neglect, or imminent harm to self or others.</li>
            <li>Valid court orders or subpoenas.</li>
            <li>Required disclosures to health insurance plans for authorization or reimbursement.</li>
          </ul>
        </PolicySection>

        <PolicySection title="7. Media & Telehealth Consent (Optional)">
          <p className="m-0">Select either option only if you give permission. These choices are optional.</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/10 bg-white p-3">
            <input
              type="checkbox"
              checked={values.mediaRecording}
              onChange={(event) => update("mediaRecording", event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-tf-teal"
            />
            <span><strong>Video/Audio Recording Consent:</strong> I authorize therapy sessions to be recorded for internal clinical supervision, quality assurance, and training purposes.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/10 bg-white p-3">
            <input
              type="checkbox"
              checked={values.telehealthConsent}
              onChange={(event) => update("telehealthConsent", event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-tf-teal"
            />
            <span><strong>Telehealth Consent:</strong> I agree to participate in parent training or clinical supervision conducted via secure video conferencing platforms when appropriate.</span>
          </label>
        </PolicySection>

        <PolicySection title="8. Voluntary Participation & Termination">
          <p className="m-0">
            Participation in ABA therapy is voluntary. You have the right to request adjustments to the treatment plan
            or discontinue services at any time by providing written notice to your supervising staff. Please note that
            voluntary termination does not entitle the client to a cash refund of unused advance deposits; all remaining
            account balances must be consumed via scheduled sessions prior to discharge.
          </p>
        </PolicySection>
      </div>

      <section className="mt-5 rounded-xl border border-black/10 bg-white p-5">
        <h3 className="m-0 font-serif text-lg font-normal text-[#202020]">Acknowledgment &amp; signatures</h3>
        <p className="mb-0 mt-2 text-sm leading-relaxed text-[#444]">
          I acknowledge that I have read, understood, and agree to the terms outlined in this Informed Consent and
          Service Agreement, including the <strong>non-refundable deposit and payment policies.</strong>
        </p>
        <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${errors.agreement ? "border-red-400" : "border-black/10"}`}>
          <input
            type="checkbox"
            checked={values.agreement}
            onChange={(event) => update("agreement", event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-tf-teal"
          />
          <span>I have read and agree to this consent and service agreement.</span>
        </label>
        {errors.agreement && <p className="mb-0 mt-1 text-xs text-red-600">{errors.agreement}</p>}

        <div className="mt-5">
          <SignaturePad
            label="Parent / Legal Guardian Signature:"
            value={values.signatureData}
            onChange={(value) => update("signatureData", value)}
            error={errors.signatureData}
            height={120}
          />
        </div>
        <div className="mt-5">
          <ConsentDocumentField label="Printed Name:" value={values.signerName} onChange={(value) => update("signerName", value)} error={errors.signerName} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
          <ConsentDocumentField label="Date:" value={dateLabel(today())} readOnly />
          <ConsentDocumentField label="Relationship to Client:" value={values.relationship} onChange={(value) => update("relationship", value)} error={errors.relationship} />
        </div>
      </section>
      {serverError && (
        <p role="alert" className="mb-0 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {serverError}
        </p>
      )}
      <div className="mt-6 flex justify-end border-t border-dashed border-[#d0e5dd] pt-5">
        <button
          type="button"
          className="rounded-lg border-0 bg-[#2f4a42] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"
          disabled={submitting}
          onClick={submit}
        >
          {submitting ? "Submitting…" : "Submit ABA consent"}
        </button>
      </div>
    </div>
  );
}
