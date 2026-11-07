import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, Reveal, SectionHead, Photo, btnSolid } from "../components/Layout";
import { CLINIC } from "../data/clinic";
import { useHomeContent } from "../data/useHomecontent";

const ICONS = {
  select: <><rect x="14" y="10" width="36" height="46" rx="5" /><path d="M24 24h16M24 34h16M24 44h10" /></>,
  calendar: <><rect x="10" y="14" width="44" height="40" rx="5" /><path d="M10 26h44M22 8v10M42 8v10" /></>,
  connect: <><circle cx="24" cy="24" r="8" /><circle cx="42" cy="28" r="6" /><path d="M10 52c0-9 6-15 14-15s14 6 14 15M38 40c8 0 14 4 16 12" /></>,
  sprout: <><path d="M32 56V30" /><path d="M32 34c0-10-7-16-18-16 0 10 7 16 18 16zM32 28c0-9 6-14 16-14 0 9-6 14-16 14z" /></>,
  chat: <><path d="M10 14h44v28H30l-12 10V42h-8z" /><path d="M32 36s-10-6-10-12a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 6-10 12-10 12z" /></>,
  blocks: <><rect x="10" y="32" width="20" height="20" rx="3" /><rect x="34" y="32" width="20" height="20" rx="3" /><rect x="22" y="10" width="20" height="20" rx="3" /></>,
  check: <><rect x="14" y="10" width="36" height="46" rx="5" /><path d="M24 34l6 6 11-13" /></>,
};

function Icon({ name, size = 64, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Background decorations (from the Figma export) ---------- */
const decoBase = "pointer-events-none absolute z-0 max-[900px]:hidden";

const LEAF = "M0 0C6-11 20-11 28 0 20 11 6 11 0 0z";
const VINE_LEAVES = [
  [40, 20, -35, "#2a6a53", 1.4],
  [40, 45, 215, "#4a9b8e", 1.3],
  [46, 80, -40, "#2a6a53", 1.5],
  [48, 115, 200, "#aac6b7", 1.4],
  [52, 140, -30, "#4a9b8e", 1.4],
  [46, 175, 205, "#2a6a53", 1.5],
  [40, 205, -45, "#6bbfaa", 1.3],
  [38, 235, 215, "#2a6a53", 1.4],
  [40, 265, -35, "#4a9b8e", 1.3],
  [44, 290, -80, "#2a6a53", 1.1],
];

const Vine = ({ className = "", flip = false }) => (
  <svg className={`${decoBase} ${flip ? "-scale-x-100" : ""} ${className}`} viewBox="0 0 100 300" fill="none" aria-hidden="true">
    <path d="M40 0C38 70 56 130 42 190S34 260 44 300" stroke="#2a6a53" strokeWidth="1.5" strokeLinecap="round" />
    {VINE_LEAVES.map(([x, y, r, c, s], idx) => (
      <path key={idx} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d={LEAF} fill={c} opacity="0.9" />
    ))}
  </svg>
);

const Dots = ({ className = "" }) => (
  <svg className={`${decoBase} ${className}`} viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="2.2" fill="#4a9b8e" opacity="0.7" />
    <circle cx="28" cy="5" r="1.6" fill="#4a9b8e" opacity="0.5" />
    <circle cx="48" cy="12" r="2.6" fill="#4a9b8e" opacity="0.8" />
    <circle cx="16" cy="28" r="2.8" fill="#4a9b8e" opacity="0.8" />
    <circle cx="38" cy="30" r="1.8" fill="#4a9b8e" opacity="0.5" />
    <circle cx="6" cy="48" r="1.6" fill="#4a9b8e" opacity="0.5" />
    <circle cx="26" cy="50" r="2.2" fill="#4a9b8e" opacity="0.7" />
    <circle cx="50" cy="46" r="1.6" fill="#4a9b8e" opacity="0.5" />
    <path d="M42 22v6M39 25h6" stroke="#4a9b8e" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
  </svg>
);

const QuestionBubble = ({ className = "" }) => (
  <svg className={`${decoBase} ${className}`} viewBox="0 0 200 320" fill="none" aria-hidden="true">
    <circle cx="90" cy="90" r="70" stroke="#6bbfaa" strokeWidth="1" strokeDasharray="3 5" />
    <rect x="44" y="58" width="92" height="58" rx="12" fill="#fff" stroke="#4a9b8e" strokeWidth="1.8" />
    <path d="M62 116l-8 22 28-22" fill="#fff" stroke="#4a9b8e" strokeWidth="1.8" strokeLinejoin="round" />
    <text x="90" y="100" textAnchor="middle" fontSize="38" fontWeight="700" fill="#4a9b8e" fontFamily="serif">?</text>
    <circle cx="150" cy="140" r="12" fill="#cfe4dc" />
    <circle cx="146" cy="140" r="1.8" fill="#4a9b8e" />
    <circle cx="151" cy="140" r="1.8" fill="#4a9b8e" />
    <circle cx="156" cy="140" r="1.8" fill="#4a9b8e" />
    <circle cx="20" cy="30" r="2" fill="#4a9b8e" opacity="0.6" />
    <circle cx="36" cy="22" r="1.5" fill="#4a9b8e" opacity="0.5" />
    <circle cx="26" cy="46" r="1.5" fill="#4a9b8e" opacity="0.5" />
    <path d="M90 320C84 270 100 220 88 170" stroke="#2a6a53" strokeWidth="1.5" strokeLinecap="round" />
    {[
      [90, 300, -40, "#2a6a53"],
      [88, 270, 210, "#4a9b8e"],
      [94, 240, -35, "#aac6b7"],
      [92, 210, 205, "#2a6a53"],
      [88, 186, -45, "#6bbfaa"],
    ].map(([x, y, r, c], idx) => (
      <path key={idx} transform={`translate(${x} ${y}) rotate(${r}) scale(1.3)`} d={LEAF} fill={c} opacity="0.9" />
    ))}
  </svg>
);

const HeartBubble = ({ className = "" }) => (
  <svg className={`${decoBase} ${className}`} viewBox="0 0 220 340" fill="none" aria-hidden="true">
    <path d="M20 150C20 90 80 56 140 66s70 50 56 100" stroke="#6bbfaa" strokeWidth="1" strokeDasharray="3 5" />
    <rect x="62" y="68" width="100" height="62" rx="12" fill="#fff" stroke="#4a9b8e" strokeWidth="1.8" />
    <path d="M140 130l10 22-30-22" fill="#fff" stroke="#4a9b8e" strokeWidth="1.8" strokeLinejoin="round" />
    <path
      d="M112 112s-20-12-20-26a10 10 0 0 1 20-4 10 10 0 0 1 20 4c0 14-20 26-20 26z"
      fill="#4a9b8e"
    />
    <circle cx="44" cy="52" r="12" fill="#fff" stroke="#4a9b8e" strokeWidth="1.5" />
    <path d="M38 52l4 4 8-9" stroke="#4a9b8e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="190" cy="54" r="2" fill="#4a9b8e" opacity="0.6" />
    <circle cx="204" cy="68" r="1.5" fill="#4a9b8e" opacity="0.5" />
    <path d="M150 340C156 290 134 240 150 190" stroke="#2a6a53" strokeWidth="1.5" strokeLinecap="round" />
    {[
      [150, 320, -140, "#2a6a53"],
      [152, 292, -30, "#4a9b8e"],
      [146, 262, -150, "#aac6b7"],
      [150, 234, -35, "#2a6a53"],
      [146, 208, -145, "#6bbfaa"],
      [150, 190, -80, "#4a9b8e"],
    ].map(([x, y, r, c], idx) => (
      <path key={idx} transform={`translate(${x} ${y}) rotate(${r}) scale(1.3)`} d={LEAF} fill={c} opacity="0.9" />
    ))}
  </svg>
);

function HeroArt({ className = "" }) {
  const leaf = (x, y, r, c, s = 1) => (
    <path key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={c}
      d="M0 0C30-40 90-40 120 0 90 40 30 40 0 0z" />
  );
  return (
    <svg className={className} viewBox="0 0 600 520" aria-hidden="true">
      <circle cx="400" cy="270" r="210" fill="#cfe4dc" opacity=".6" />
      <circle cx="470" cy="330" r="130" fill="#aac6b7" opacity=".55" />
      <path d="M300 520C300 380 330 260 420 120" stroke="#3d865b" strokeWidth="6" fill="none" strokeLinecap="round" />
      {leaf(312, 430, -40, "#6bbfaa")}
      {leaf(306, 360, -150, "#4a9b8e")}
      {leaf(330, 300, -35, "#3d865b", 1.1)}
      {leaf(340, 240, -155, "#7bb4ab")}
      {leaf(375, 190, -45, "#4a9b8e", 1.1)}
      {leaf(395, 140, -150, "#00a58a", .9)}
      {leaf(418, 118, -75, "#3d865b", .8)}
    </svg>
  );
}

const containerClass =
  "w-[min(1240px,calc(100%-clamp(40px,10vw,160px)))] mx-auto relative z-10";
const sectionClass = "py-[clamp(72px,10vw,130px)] relative";

const btnSolidLg =
  "inline-flex items-center justify-center h-12 px-7 rounded-lg bg-tf-navy text-white text-base no-underline whitespace-nowrap transition-[transform,box-shadow,background,color] duration-[250ms] ease-tf hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_rgba(24,28,59,0.55)] active:translate-y-0 active:scale-[0.98] max-[560px]:w-full";

const riseBase =
  "opacity-0 translate-y-[18px] animate-[tf-rise_0.9s_var(--ease-tf)_forwards] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none";

/* ---------- Content ---------- */
const STEPS = [
  { icon: "select", title: "Select your service", text: "Explore and choose from our range of mental health services (Psychotherapy, Counseling, ABA Therapy, Assessment) that best fit your needs." },
  { icon: "calendar", title: "Choose your schedule", text: "Select a convenient date and time for your initial virtual or in-person appointment that works for you." },
  { icon: "connect", title: "Connect with a specialist", text: "Get matched with a licensed therapist or counselor who specializes in your specific area of concern." },
  { icon: "sprout", title: "Start your journey", text: "Attend your scheduled session (in-person or virtual) to begin your path to healing and resilience." },
];

const SERVICES = [
  { icon: "chat", photo: "service-1.png", meta: "1 Hour Session", title: "Psychotherapy & Counseling", text: "Individual talk therapy sessions designed to enhance self-awareness, explore complex emotions, build deep insight, and develop healthy, resilient coping mechanisms tailored for your daily life." },
  { icon: "blocks", photo: "service-2.png", meta: "2 Hour Intensive Session", title: "ABA Therapy", text: "Structured behavioral interventions applying Applied Behavior Analysis. We focus on intensive skill building, positive reinforcement, and the development of key life behaviors in a supportive, encouraging environment." },
  { icon: "check", photo: "service-3.png", meta: "1 Hour Comprehensive Review", title: "Assessment & Consultation", text: "A thorough initial review and diagnostic structured interview. This provides a holistic understanding of your unique mental health landscape, allowing us to recommend highly tailored, effective approaches just for you." },
];

const FAQS = [
  { q: "Is everything I share confidential?", a: "Yes. Your sessions are private and handled according to professional ethics and applicable privacy laws. Limits to confidentiality are explained before your first session." },
  { q: "Do you offer online and in-person sessions?", a: "Yes. You can choose a virtual or an in-person appointment when you book." },
  { q: "How long is a session, and how many will I need?", a: "Sessions run 1 to 2 hours depending on the service. Your specialist will recommend a plan after your first session." },
  { q: "How do I reschedule or cancel?", a: "Open My appointments, pick the session, and choose a new time or cancel. Please do so in advance when possible." },
  { q: "What if I don't feel like it's the right fit?", a: "That's okay. You can ask to be matched with a different specialist at any time." },
  { q: "Can children and teens be seen?", a: "Yes. Our ABA Therapy and counseling services support children and teens, with parents or guardians involved." },
];

/* ---------- Sections ---------- */
function Hero({ data }) {
  const h = data || {};
  return (
    <section
      id="top"
      className="relative flex items-center overflow-hidden isolate min-h-[clamp(600px,75vh,750px)] bg-[url('/img/hero-bg.svg'),linear-gradient(100deg,#faf9f6_0%,#f1f6f3_55%,#e3efe9_100%)] bg-center bg-cover bg-no-repeat"
    >
      <div
        className="absolute inset-0 -z-[2] bg-[linear-gradient(90deg,#faf9f6_0%,#faf9f6_45%,rgba(250,249,246,0)_90%)]"
        aria-hidden="true"
      />
      <div className={`${containerClass} relative z-10 py-20`}>
        <div className="max-w-[540px]">
          <p className={`font-serif text-sm tracking-[0.08em] text-[#5a615d] mb-3 ${riseBase} [animation-delay:0.05s]`}>
            {h.eyebrow || "A SAFE SPACE FOR WELL-BEING"}
          </p>
          <h1 className={`font-serif font-normal text-[clamp(36px,4.5vw,54px)] leading-[1.12] my-3.5 text-[#111] ${riseBase} [animation-delay:0.15s]`}>
            {h.headline || "Professional support for every step of"}{" "}
            <em className="not-italic font-bold text-tf-green">
              {h.highlight || "your journey"}
            </em>.
          </h1>
          <p className={`font-serif text-lg leading-[1.55] max-w-[460px] text-[#333] ${riseBase} [animation-delay:0.3s]`}>
            {h.subtext || "Access compassionate mental health services, professional counseling, therapy, and assessment consultation in a safe and supportive environment."}
          </p>
          <div className={`flex items-center flex-wrap gap-6 mt-9 ${riseBase} [animation-delay:0.45s]`}>
            <Link to="/book" className={btnSolidLg}>{h.ctaLabel || "Book an Appointment"}</Link>
            <a
              href="#how"
              className="font-serif text-[15px] text-black/70 border-b border-transparent no-underline transition-[border-color,color] duration-[250ms] hover:text-black hover:border-current"
            >
              {h.linkLabel || "Learn how it works"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ items }) {
  const steps = items && items.length > 0 ? items : STEPS;
  const treeImgClass =
    "absolute bottom-0 right-0 w-full origin-bottom-right -translate-y-[30%] animate-[tf-sway_9s_ease-in-out_infinite_alternate] motion-reduce:animate-none";

  return (
    <section className={`${sectionClass} bg-tf-mint overflow-visible pt-[clamp(72px,9vw,110px)]`} id="how">
      <div className="absolute top-0 right-[-2%] w-[min(65vw,900px)] h-0 -z-[1] pointer-events-none max-[900px]:w-screen max-[900px]:right-[-10%] max-[900px]:-translate-y-[10%] max-[900px]:opacity-30">
        <Photo src="/img/tree.png" className={treeImgClass} fallback={<HeroArt className={treeImgClass} />} />
      </div>

      <Dots className="bottom-[6%] left-[3%] w-16 h-16" />

      <div className={containerClass}>
        <Reveal>
          <SectionHead
            align="left"
            eyebrow="HOW IT WORKS"
            title="Four steps toward feeling better"
            sub="From your initial check-in to your first session, we prioritize clarity and your comfort."
          />
        </Reveal>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6 mt-12 relative z-10 list-none m-0 p-0">
          {steps.map((s, i) => (
            <li key={s.title} className="m-0 p-0">
              <Reveal delay={i * 90} className="h-full">
                <article className="relative h-full bg-white rounded-2xl px-6 pt-10 pb-8 text-center flex flex-col items-center gap-4 border border-black/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-[350ms] ease-tf hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-20px_rgba(32,62,67,0.45)]">
                  <span className="absolute top-4 left-4 w-[30px] h-[30px] rounded-full bg-tf-teal text-white text-sm grid place-items-center">
                    {i + 1}
                  </span>
                  <Icon name={s.icon} className="text-tf-teal mt-2 w-16 h-16 [stroke-width:1.5]" />
                  <h3 className="m-0 font-serif text-lg font-bold uppercase tracking-[0.04em] text-tf-ink">{s.title}</h3>
                  <p className="m-0 text-sm leading-[1.6] text-tf-body">{s.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Services({ items }) {
  const list = items && items.length > 0 ? items : SERVICES;
  return (
    <section className={`${sectionClass} bg-white overflow-hidden`} id="services">
      <Dots className="top-[5%] left-[6%] w-16 h-16" />
      <Vine className="top-[2%] right-[2%] w-[110px] h-[330px]" />

      <div className={containerClass}>
        <Reveal>
          <SectionHead
            align="center"
            eyebrow="OUR SERVICES"
            title="Comprehensive Mental Health Care"
            sub="Focused care tailored to your unique journey toward clarity and growth."
          />
        </Reveal>
        {list.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal
              key={s.title}
              className={`group grid grid-cols-2 items-center gap-[clamp(40px,6vw,96px)] mt-[clamp(64px,8vw,120px)] max-[900px]:grid-cols-1`}
            >
              <div className={`relative grid place-items-center p-5 ${flip ? "order-2 max-[900px]:order-0" : ""}`}>
                <div className="absolute w-full aspect-[522/404] rounded-[210px_190px_240px_130px] bg-tf-soft transition-[border-radius,transform] duration-[1.2s] ease-tf group-hover:rounded-[130px_240px_190px_210px] group-hover:-rotate-2" />
                <Photo
                  src={`/img/${s.photo}`}
                  className="relative w-[95%] h-auto rounded-2xl object-cover"
                  alt={s.title}
                  fallback={
                    <Icon
                      name={s.icon}
                      size={120}
                      className="relative w-[32%] h-auto text-white transition-transform duration-[600ms] ease-tf group-hover:scale-[1.08] group-hover:-rotate-[3deg]"
                    />
                  }
                />
              </div>
              <div>
                <p className="m-0 flex items-center gap-3 text-[#6c7d82] font-medium text-[15px] uppercase tracking-[0.05em]">
                  <i className="block w-8 h-0.5 bg-tf-teal not-italic" />
                  {s.meta}
                </p>
                <h3 className="m-0 font-serif font-bold text-tf-ink text-[clamp(32px,3.8vw,46px)] leading-[1.12] my-4">
                  {s.title}
                </h3>
                <p className="m-0 text-tf-body leading-[1.7] text-base max-w-[480px] max-[900px]:max-w-none">
                  {s.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function FAQ({ items }) {
  const list = items && items.length > 0 ? items : FAQS;
  const [open, setOpen] = useState(0);
  return (
    <section className={`${sectionClass} bg-tf-mint overflow-hidden`} id="faq">
      <QuestionBubble className="bottom-[2%] left-[2%] w-[200px] h-[320px]" />
      <HeartBubble className="bottom-[4%] right-[2%] w-[200px] h-[310px]" />

      <div className={`${containerClass} max-w-[820px]`}>
        <Reveal>
          <SectionHead align="center" eyebrow="FAQ" title="Frequently asked questions" />
        </Reveal>
        <div className="mt-10 grid gap-4">
          {list.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={f.q || idx}
                className={`rounded-xl bg-white border shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] transition-[border-color,background] duration-300 ${isOpen ? "border-tf-teal" : "border-black/10"
                  }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${idx}`}
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 p-6 border-0 bg-transparent text-tf-ink text-[clamp(16px,2vw,18px)] font-serif font-bold text-left cursor-pointer"
                >
                  <span>{f.q}</span>
                  <i
                    aria-hidden="true"
                    className={`shrink-0 w-9 h-9 rounded-full not-italic text-[22px] grid place-items-center transition-[transform,background,color] duration-[400ms] ease-tf ${isOpen ? "rotate-[135deg] bg-tf-teal text-white" : "bg-tf-soft text-tf-teal"
                      }`}
                  >
                    +
                  </i>
                </button>
                <div
                  id={`faq-${idx}`}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-[450ms] ease-tf ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 px-6 pb-6 text-tf-body leading-[1.7] text-base">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const inquiryInput =
  "w-full rounded-lg border border-black/14 bg-white px-3.5 py-3 font-serif text-[0.95rem] text-[#202020] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#666]/70 focus:border-tf-teal focus:shadow-[0_0_0_3px_rgba(74,155,142,0.15)]";

function ContactInquiry() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [touched, setTouched] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (status === "error") setStatus(null);
  };

  const fieldErrors = {
    name: form.name.trim().length < 2 ? "Name is required." : "",
    email: !form.email.includes("@") ? "Enter a valid email." : "",
    subject: form.subject.trim().length < 2 ? "Subject is required." : "",
    message: form.message.trim().length < 6 ? "Message must be at least a short sentence." : "",
  };
  const hasErrors = Object.values(fieldErrors).some(Boolean);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTouched(false);
  };

  const contacts = [
    { label: "Email", value: CLINIC.email, href: `mailto:${CLINIC.email}` },
    { label: "Phone", value: CLINIC.phone, href: `tel:${CLINIC.phone.replace(/\s/g, "")}` },
    {
      label: "Location",
      value: CLINIC.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.address)}`,
      external: true,
    },
    { label: "Facebook", value: CLINIC.facebookLabel, href: CLINIC.facebook, external: true },
  ];

  return (
    <section className={`${sectionClass} bg-white`} id="inquiry">
      <div className={containerClass}>
        <Reveal>
          <SectionHead
            align="center"
            eyebrow="GET IN TOUCH"
            title="Message the clinic"
            sub="Questions about services or booking? Send an inquiry and our team will respond during clinic hours."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 max-[900px]:grid-cols-1">
          <Reveal className="flex flex-col gap-5">
            {contacts.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-black/8 bg-white px-5 py-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)]"
              >
                <p className="m-0 text-[12px] font-bold tracking-[0.1em] text-tf-teal">{c.label.toUpperCase()}</p>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="mt-1 block font-serif text-lg text-tf-ink no-underline hover:text-tf-teal"
                >
                  {c.value}
                  {c.label === "Location" && (
                    <span className="mt-1 block text-sm font-sans font-medium text-tf-teal">
                      Open in Maps →
                    </span>
                  )}
                </a>
              </div>
            ))}
            <p className="m-0 text-sm text-tf-body">Clinic hours · {CLINIC.hours}</p>
          </Reveal>

          <Reveal delay={100}>
            <form
              onSubmit={submit}
              className="rounded-2xl border border-black/8 bg-white p-7 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.25)] max-[560px]:p-5"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
                <label className="flex flex-col gap-1.5">
                  <span className="font-serif text-sm font-bold text-[#202020]">Your name</span>
                  <input
                    className={`${inquiryInput} ${touched && fieldErrors.name ? "border-red-400" : ""}`}
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Full name"
                    required
                  />
                  {touched && fieldErrors.name && (
                    <span className="text-xs text-red-600">{fieldErrors.name}</span>
                  )}
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-serif text-sm font-bold text-[#202020]">Email</span>
                  <input
                    type="email"
                    className={`${inquiryInput} ${touched && fieldErrors.email ? "border-red-400" : ""}`}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                    required
                  />
                  {touched && fieldErrors.email && (
                    <span className="text-xs text-red-600">{fieldErrors.email}</span>
                  )}
                </label>
              </div>
              <label className="mt-4 flex flex-col gap-1.5">
                <span className="font-serif text-sm font-bold text-[#202020]">Subject</span>
                <input
                  className={`${inquiryInput} ${touched && fieldErrors.subject ? "border-red-400" : ""}`}
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="How can we help?"
                  required
                />
                {touched && fieldErrors.subject && (
                  <span className="text-xs text-red-600">{fieldErrors.subject}</span>
                )}
              </label>
              <label className="mt-4 flex flex-col gap-1.5">
                <span className="font-serif text-sm font-bold text-[#202020]">Message</span>
                <textarea
                  className={`${inquiryInput} min-h-[140px] resize-y ${touched && fieldErrors.message ? "border-red-400" : ""}`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Share a brief note about your inquiry…"
                  required
                />
                {touched && fieldErrors.message && (
                  <span className="text-xs text-red-600">{fieldErrors.message}</span>
                )}
              </label>

              {status === "success" && (
                <p
                  role="status"
                  className="mt-4 rounded-lg border border-tf-teal/40 bg-tf-soft px-4 py-3 text-sm text-tf-ink"
                >
                  Thank you — your inquiry was sent. We will reply to your email shortly.
                </p>
              )}
              {status === "error" && touched && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  Please fix the highlighted fields before submitting.
                </p>
              )}

              <button type="submit" className={`${btnSolid} mt-5 w-full max-[560px]:w-full`}>
                Submit Inquiry
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const content = useHomeContent();

  return (
    <div className="font-sans text-black bg-tf-bg overflow-x-hidden antialiased">
      <Navbar />
      <main>
        <Hero data={content?.hero} />
        <HowItWorks items={content?.steps} />
        <Services items={content?.services} />
        <FAQ items={content?.faqs} />
        <ContactInquiry contact={content?.contact} />
      </main>
      <Footer />
    </div>
  );
}