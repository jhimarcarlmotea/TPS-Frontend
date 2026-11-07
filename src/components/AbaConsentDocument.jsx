import SignaturePad from "./SignaturePad";

const PAPER_FONT = "font-['Arial',Helvetica,sans-serif]";

const PAGES = "min-h-[1056px] border-b border-dashed border-black/20 px-8 py-10 sm:px-14";

function PaperField({ label, value, onChange, editable, type = "text", error, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      {editable ? (
        <label className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 font-bold">{label}</span>
          <input
            type={type}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 border-0 border-b border-black bg-transparent px-1 py-0.5 text-[14px] outline-none focus:border-[#2a8570]"
            aria-label={label}
          />
        </label>
      ) : (
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 font-bold">{label}</span>
          <span className="min-h-[1.5em] min-w-0 flex-1 break-words border-b border-black px-1">
            {value || "\u00A0"}
          </span>
        </div>
      )}
      {error && <p className="m-0 mt-1 text-xs font-normal text-red-700">{error}</p>}
    </div>
  );
}

function Choice({ checked, label, editable, onChange }) {
  return (
    <label className={`inline-flex items-start gap-2 ${editable ? "cursor-pointer" : ""}`}>
      {editable ? (
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[#2a8570]"
        />
      ) : (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center border border-black text-xs font-bold">
          {checked ? "✓" : ""}
        </span>
      )}
      <span>{label}</span>
    </label>
  );
}

function Heading({ children }) {
  return <h3 className="mb-2 mt-5 text-[15px] font-bold first:mt-0">{children}</h3>;
}

export default function AbaConsentDocument({
  values,
  onChange,
  errors = {},
  editable = false,
}) {
  const set = (key) => (value) => onChange(key, value);

  return (
    <article className={`${PAPER_FONT} mx-auto max-w-[820px] bg-white text-[14px] leading-[1.4] text-black shadow-[0_1px_6px_rgba(0,0,0,0.18)]`}>
      <section className={PAGES}>
        <h2 className="mb-6 text-center text-[21px] font-bold uppercase leading-tight">
          Informed Consent &amp; Service Agreement for ABA Therapy
        </h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(150px,0.55fr)] gap-5 max-[560px]:grid-cols-1">
            <PaperField label="Client Name:" value={values.clientName} onChange={set("clientName")} editable={editable} error={errors.clientName} />
            <PaperField label="DOB:" value={values.birthdate} onChange={set("birthdate")} editable={editable} type="date" error={errors.birthdate} />
          </div>
          <PaperField label="Parent/Legal Guardian Name(s):" value={values.guardianNames} onChange={set("guardianNames")} editable={editable} error={errors.guardianNames} />
          <PaperField label="Provider / Clinic Name:" value={values.providerName} editable={false} />
        </div>

        <Heading>1. Description of ABA Services</Heading>
        <p className="m-0">
          Applied Behavior Analysis (ABA) is an evidence-based therapy focused on increasing functional behaviors (e.g., communication,
          social skills, daily living skills) and decreasing behaviors that interfere with learning or safety. Services may include:
        </p>
        <ul className="mb-0 mt-3 list-disc space-y-3 pl-10">
          <li><strong>Assessments:</strong> Functional Behavior Assessments (FBA), skill evaluations, and direct observations.</li>
          <li><strong>Direct Therapy:</strong> One-on-one sessions provided by a Registered Behavior Technician (RBT) or Board Certified Assistant Behavior Analyst (BCaBA).</li>
          <li><strong>Supervision &amp; Program Modification:</strong> Ongoing clinical oversight by a Board Certified Behavior Analyst (BCBA).</li>
          <li><strong>Caregiver / Parent Training:</strong> Required sessions to teach families strategies to generalize skills across home and community settings.</li>
        </ul>

        <Heading>2. Benefits and Risks</Heading>
        <ul className="mb-0 mt-0 list-disc space-y-3 pl-10">
          <li><strong>Benefits:</strong> Potential improvements in functional communication, independence, social interaction, and emotional regulation.</li>
          <li><strong>Risks:</strong> Target behaviors may temporarily increase (extinction bursts) or produce emotional frustration as new skills are introduced. ABA does not guarantee specific outcomes, as progress varies by individual.</li>
        </ul>

        <Heading>3. Payment, Deposit, and Advance Payment Policy</Heading>
        <ul className="mb-0 mt-0 list-disc space-y-3 pl-10">
          <li><strong>Non-Refundable Deposit / Advance Payment:</strong> All session deposits, retainer fees, or advance payments are strictly non-refundable. Cash, check, or electronic refunds will not be issued under any circumstances.</li>
          <li><strong>Service Consumption:</strong> All advance payments or deposits must be consumed through scheduled ABA sessions, parent training, supervision, or evaluations.</li>
          <li><strong>Expiration of Unused Credits:</strong> Advance payments credited to the client’s account must be used within [e.g., 60 or 90 days] of the payment date. Unused funds remaining after this period will be forfeited.</li>
        </ul>
      </section>

      <section className={PAGES}>
        <Heading>4. Session Cancellation &amp; Attendance Policy</Heading>
        <p className="m-0">Regular attendance is essential for consistent progress.</p>
        <ul className="mb-0 mt-4 list-disc space-y-4 pl-10">
          <li><strong>Rescheduling:</strong> If a session is canceled with at least [e.g., 24 hours] advance notice, any deposit or advance payment made for that session will remain on account and be applied toward a rescheduled session.</li>
          <li><strong>Late Cancellation / No-Show:</strong> Cancellations made with less than the required notice, or missed sessions, will result in the forfeiture of that session’s deposit/advance payment to cover reserved provider time.</li>
          <li><strong>Attendance Requirement:</strong> Frequent absences (e.g., dropping below [e.g., 80%] attendance) may result in a reduction of scheduled hours or discharge from services.</li>
        </ul>

        <Heading>5. Therapy Environment &amp; Professional Boundaries</Heading>
        <ul className="mb-0 mt-0 list-disc space-y-4 pl-10">
          <li><strong>Parent/Guardian Presence:</strong> A parent or designated adult guardian (18+) must be present in the home/location during all in-home or community therapy sessions.</li>
          <li><strong>Environment:</strong> Families must provide a safe, smoke-free, and distraction-minimized environment for in-home care.</li>
          <li><strong>Professional Boundaries:</strong> Per the Behavior Analyst Certification Board (BACB) Ethics Code, clinical staff cannot accept personal gifts, food, or participate in dual personal relationships.</li>
        </ul>

        <Heading>6. Confidentiality &amp; HIPAA</Heading>
        <p className="m-0">Your protected health information (PHI) is strictly confidential under federal and state laws. Exceptions include:</p>
        <ul className="mb-0 mt-3 list-disc space-y-3 pl-10">
          <li>Mandatory reporting of suspected child/elder abuse, neglect, or imminent harm to self or others.</li>
          <li>Valid court orders or subpoenas.</li>
          <li>Required disclosures to health insurance plans for authorization or reimbursement.</li>
        </ul>
      </section>

      <section className={`${PAGES} border-b-0`}>
        <Heading>7. Media &amp; Telehealth Consent (Optional)</Heading>
        <ul className="mb-0 mt-0 list-disc space-y-5 pl-10">
          <li>
            <Choice
              checked={values.mediaRecording}
              label={<><strong>Video/Audio Recording Consent:</strong> I authorize therapy sessions to be recorded for internal clinical supervision, quality assurance, and training purposes.</>}
              editable={editable}
              onChange={set("mediaRecording")}
            />
          </li>
          <li>
            <Choice
              checked={values.telehealthConsent}
              label={<><strong>Telehealth Consent:</strong> I agree to participate in parent training or clinical supervision conducted via secure video conferencing platforms when appropriate.</>}
              editable={editable}
              onChange={set("telehealthConsent")}
            />
          </li>
        </ul>

        <Heading>8. Voluntary Participation &amp; Termination</Heading>
        <p className="m-0">
          Participation in ABA therapy is voluntary. You have the right to request adjustments to the treatment plan or discontinue services
          at any time by providing written notice to your supervising staff. Please note that voluntary termination does not entitle the client
          to a cash refund of unused advance deposits; all remaining account balances must be consumed via scheduled sessions prior to discharge.
        </p>

        <Heading>ACKNOWLEDGMENT &amp; SIGNATURES</Heading>
        <p className="m-0">
          I acknowledge that I have read, understood, and agree to the terms outlined in this Informed Consent and Service Agreement,
          including the <strong>non-refundable deposit and payment policies.</strong>
        </p>
        <div className={`mt-4 rounded-md border px-3 py-2 ${editable && errors.agreement ? "border-red-400" : "border-black/20"}`}>
          <Choice
            checked={values.agreement}
            label="I have read and agree to this consent and service agreement."
            editable={editable}
            onChange={set("agreement")}
          />
        </div>
        {errors.agreement && <p className="m-0 mt-1 text-xs text-red-700">{errors.agreement}</p>}

        <div className="mt-6 grid gap-5">
          {editable ? (
            <div>
              <SignaturePad
                label="Parent / Legal Guardian Signature"
                value={values.signatureData}
                onChange={set("signatureData")}
                error={errors.signatureData}
                height={110}
              />
            </div>
          ) : (
            <div className="max-w-[520px]">
              <div className="flex min-h-[64px] items-end">
                {values.signatureData && <img src={values.signatureData} alt="Parent or legal guardian signature" className="max-h-[64px] max-w-full object-contain" />}
              </div>
              <div className="border-t border-black pt-1 font-bold">Parent / Legal Guardian Signature</div>
            </div>
          )}
          <PaperField label="Printed Name:" value={values.signerName} onChange={set("signerName")} editable={editable} error={errors.signerName} />
          <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
            <PaperField label="Date:" value={values.signedDate} onChange={set("signedDate")} editable={false} />
            <PaperField label="Relationship to Client:" value={values.relationship} onChange={set("relationship")} editable={editable} error={errors.relationship} />
          </div>
          <div className="grid gap-2">
            <PaperField label="Clinic Representative Signature:" value="" editable={false} />
            <PaperField label="Printed Name & Credentials:" value="" editable={false} />
            <PaperField label="Date:" value="" editable={false} />
          </div>
        </div>
      </section>
    </article>
  );
}
