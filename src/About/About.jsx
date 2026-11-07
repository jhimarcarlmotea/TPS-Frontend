import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer, Reveal, Photo, container, btnSolid } from "../components/Layout";
import { apiFetch } from "../auth";

const DEFAULT_HEADLINE = "Care that listens first.";
const DEFAULT_INTRO =
  "Threefold Behavioral Interventions and Psychological Services is a clinic in Pasig that offers psychotherapy and counseling, ABA therapy, and assessment in a safe, supportive environment. Your wellbeing comes first, and you move at your own pace.";

const OFFER = [
  {
    title: "Psychotherapy & Counseling",
    text: "Individual talk therapy to build self-awareness and healthier ways of coping.",
    to: "/services#psychotherapy",
  },
  {
    title: "ABA Therapy",
    text: "Structured, skills-focused behavioral support for children and teens.",
    to: "/services#aba",
  },
  {
    title: "Assessment & Consultation",
    text: "A thorough review and structured interview to guide the right next steps.",
    to: "/services#assessment",
  },
];

const PROMISES = [
  "Online and in-person sessions",
  "Private, confidential care",
  "Licensed, experienced professionals",
];

const initials = (p) =>
  `${(p.first_name || "").charAt(0)}${(p.last_name || "").charAt(0)}`.toUpperCase() || "T";

function Monogram({ p, className = "" }) {
  return (
    <div className={`grid place-items-center bg-[#cfe4dc] ${className}`} aria-hidden="true">
      <span className="font-serif text-[clamp(44px,6vw,64px)] text-[#214f44]">{initials(p)}</span>
    </div>
  );
}

function Person({ p, delay }) {
  const [open, setOpen] = useState(false);
  const name = `${p.first_name || ""} ${p.last_name || ""}`.trim();
  const bg = (p.background || "").trim();
  const long = bg.length > 240;
  const portrait = "aspect-[5/4] w-full object-cover object-top";

  return (
    <Reveal delay={delay} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_-14px_rgba(32,62,67,0.35)]">
        {p.avatar_url ? (
          <Photo
            src={p.avatar_url}
            alt={`Portrait of ${name}`}
            className={portrait}
            fallback={<Monogram p={p} className={portrait} />}
          />
        ) : (
          <Monogram p={p} className={portrait} />
        )}

        <div className="flex flex-1 flex-col p-6">
          <h3 className="m-0 font-serif text-[22px] font-bold leading-tight text-tf-ink">{name}</h3>
          {p.title && <p className="m-0 mt-1 text-sm font-semibold text-tf-teal">{p.title}</p>}

          {bg ? (
            <>
              <p
                className={`m-0 mt-4 whitespace-pre-line text-[15px] leading-[1.7] text-tf-body ${open ? "" : "line-clamp-5"}`}
              >
                {bg}
              </p>
              {long && (
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  className="mt-3 w-fit cursor-pointer border-0 bg-transparent p-0 font-serif text-sm font-bold text-tf-ink underline underline-offset-4 hover:text-tf-teal"
                >
                  {open ? "Show less" : "Read full background"}
                </button>
              )}
            </>
          ) : (
            <p className="m-0 mt-4 text-[15px] italic text-tf-body/70">Background coming soon.</p>
          )}
        </div>
      </article>
    </Reveal>
  );
}

function TeamSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-7" aria-hidden="true">
      {[0, 1, 2].map((n) => (
        <div key={n} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <div className="aspect-[5/4] animate-pulse bg-[#dcebe5]" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-full animate-pulse rounded bg-black/5" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-black/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Team({ team, error, onRetry }) {
  return (
    <section className="relative bg-tf-mint py-[clamp(72px,10vw,120px)]" id="team">
      <div className={container}>
        <Reveal>
          <h2 className="m-0 max-w-[620px] font-serif text-[clamp(30px,3.8vw,44px)] font-normal leading-[1.15] text-tf-ink">
            The people behind your care
          </h2>
          <p className="m-0 mt-4 max-w-[560px] text-lg leading-relaxed text-tf-body">
            Meet the professionals you may be working with. They listen first, then guide you at a pace that feels right.
          </p>
        </Reveal>

        <div className="mt-12">
          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-white px-6 py-5">
              <p className="m-0 text-tf-body">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 cursor-pointer rounded-lg border border-black/20 bg-white px-4 py-2 font-serif text-sm hover:bg-black/5"
              >
                Try again
              </button>
            </div>
          )}

          {!error && team === null && <TeamSkeleton />}

          {team && team.length === 0 && (
            <p className="m-0 rounded-xl bg-white px-6 py-10 text-center text-tf-body">
              Our team profiles will be posted here soon.
            </p>
          )}

          {team && team.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-stretch gap-7">
              {team.map((p, i) => (
                <Person key={p.id} p={p} delay={(i % 3) * 90} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    setData(null);
    apiFetch("/about/team")
      .then(setData)
      .catch((e) => setError(e.message || "Could not load the team."));
  };
  useEffect(load, []);

  const headline = data?.about?.headline || DEFAULT_HEADLINE;
  const intro = data?.about?.intro || DEFAULT_INTRO;

  return (
    <div className="overflow-x-hidden bg-tf-bg font-sans text-black antialiased">
      <Navbar />
      <main>
        {/* Intro (mae-edit ni admin sa Manage home page > About) */}
        <section
          id="top"
          className="bg-[linear-gradient(100deg,#faf9f6_0%,#f1f6f3_55%,#e3efe9_100%)] py-[clamp(72px,10vw,128px)]"
        >
          <div className={`${container} grid grid-cols-[1.25fr_1fr] items-center gap-[clamp(40px,7vw,110px)] max-[900px]:grid-cols-1`}>
            <div>
              <h1 className="m-0 font-serif text-[clamp(38px,5vw,60px)] font-normal leading-[1.1] text-[#111]">
                {headline}
              </h1>
              <p className="m-0 mt-6 max-w-[540px] whitespace-pre-line text-lg leading-[1.7] text-tf-body">{intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Link to="/book" className={`${btnSolid} h-12 px-7 text-base no-underline`}>
                  Book an appointment
                </Link>
                <a
                  href="#team"
                  className="border-b border-transparent font-serif text-[15px] text-black/70 no-underline transition-colors hover:border-current hover:text-black"
                >
                  Meet the team
                </a>
              </div>
            </div>

            <ul className="m-0 list-none border-l-[3px] border-tf-teal p-0 pl-7 max-[900px]:max-w-[420px]">
              {PROMISES.map((t) => (
                <li key={t} className="py-4 font-serif text-[20px] leading-snug text-tf-ink first:pt-0 last:pb-0">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What we do */}
        <section className="bg-white py-[clamp(64px,8vw,104px)]">
          <div className={container}>
            <Reveal>
              <h2 className="m-0 max-w-[560px] font-serif text-[clamp(28px,3.4vw,38px)] font-normal leading-[1.15] text-tf-ink">
                What we do
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-3 gap-x-10 gap-y-8 max-[900px]:grid-cols-1">
              {OFFER.map((o, i) => (
                <Reveal key={o.title} delay={i * 90}>
                  <div className="border-t-2 border-tf-teal pt-5">
                    <h3 className="m-0 font-serif text-[21px] font-bold text-tf-ink">{o.title}</h3>
                    <p className="m-0 mt-2 text-[15px] leading-[1.7] text-tf-body">{o.text}</p>
                    <Link
                      to={o.to}
                      className="mt-3 inline-block font-serif text-sm font-bold text-tf-teal no-underline hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Team team={data ? data.team || [] : null} error={error} onRetry={load} />

        {/* CTA */}
        <section className="bg-white py-[clamp(64px,8vw,96px)]">
          <div className={`${container} flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-tf-navy px-[clamp(24px,5vw,64px)] py-[clamp(32px,5vw,56px)]`}>
            <div className="max-w-[520px]">
              <h2 className="m-0 font-serif text-[clamp(24px,3vw,34px)] font-normal leading-[1.2] text-white">
                Ready to talk to someone?
              </h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-white/80">
                Choose a service and a time that works for you. We will match you with the right professional.
              </p>
            </div>
            <Link
              to="/book"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 text-base text-tf-navy no-underline transition-transform hover:-translate-y-0.5 max-[560px]:w-full"
            >
              Book an appointment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}