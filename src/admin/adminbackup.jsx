import React, { useRef, useState } from "react";
import AdminNavigation from "./adminnavigation";
import ProfileMenu from "../components/ProfileMenu";

const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@600&family=Inria+Serif:wght@400;700&family=Inter:wght@400;600;700&display=swap');`;

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

/* ---------- Icons (inline SVG, no library needed) ---------- */
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

const Calendar = (p) => (
  <Icon {...p}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </Icon>
);
const Bell = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);
const Download = (p) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </Icon>
);
const RotateCcw = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);
const UploadCloud = (p) => (
  <Icon {...p}>
    <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </Icon>
);
const ChevronDown = (p) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

/* ---------- Data ---------- */
const INITIAL_HISTORY = [
  { id: 1, dateTime: "Oct 15, 2026, 2:00 AM", type: "Automatic", size: "24.5 MB", status: "Completed" },
  { id: 2, dateTime: "Oct 14, 2026, 2:00 AM", type: "Automatic", size: "24.5 MB", status: "Completed" },
  { id: 3, dateTime: "Oct 13, 2026, 2:00 AM", type: "Manual", size: "23.5 MB", status: "Completed" },
  { id: 4, dateTime: "Oct 13, 2026, 2:00 AM", type: "Automatic", size: "24.5 MB", status: "Completed" },
  { id: 5, dateTime: "Oct 12, 2026, 2:00 AM", type: "Automatic", size: "24.5 MB", status: "Completed" },
  { id: 6, dateTime: "Oct 11, 2026, 2:00 AM", type: "Automatic", size: "24.5 MB", status: "Completed" },
];

const INCLUDES = ["Clients", "Appointments", "Payments", "Schedules", "Services"];

/* ---------- Shared card shape (rounded 18 / 7 / 18 / 7) ---------- */
const cardShape =
  "bg-white border border-[#2020203d] rounded-tl-[18px] rounded-tr-[7px] rounded-br-[18px] rounded-bl-[7px]";

/* ---------- Page ---------- */
export default function BackupRestoreDashboard() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [frequency, setFrequency] = useState("Every day");
  const [backupTime, setBackupTime] = useState("2:00 AM");
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const backUpNow = () => {
    const now = new Date();
    const dateTime = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    setHistory((h) => [
      { id: Date.now(), dateTime, type: "Manual", size: "24.6 MB", status: "Completed" },
      ...h,
    ]);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f2f2f2] antialiased">
      <style>{FONT_CSS}</style>

      <AdminNavigation />

      <main className="min-w-0 flex-1 px-[41px] pb-[60px] pt-[51px]">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <div className={`${inter} text-[20px] font-bold tracking-[4.2px] text-[#4a9b8e]`}>
              BACKUP AND RESTORE
            </div>
            <h1 className={`${serif} mt-[8px] text-[40px] font-bold leading-[1.15] text-[#2f4a42]`}>
              Is your data safe?
            </h1>
            <p className={`${serif} mt-[8px] max-w-xl text-[14px] font-bold text-[#2f4a42]`}>
              Save a copy of your clinic records, or bring back an earlier one if something goes wrong
            </p>
          </div>

          <div className="flex items-center gap-[17px]">
            <div className="flex h-[30px] w-[170px] items-center justify-center gap-[8px] rounded-[6px] border border-[#4a9b8e] bg-[#e3f2ee]">
              <Calendar className="h-[14px] w-[14px] text-[#2a8570]" />
              <span className={`${inter} text-[12px] font-bold text-[#2a8570]`}>Thursday, October 15</span>
            </div>
            <button
              aria-label="Notifications"
              className="relative flex h-[37px] w-[46px] items-center justify-center rounded-[8px] border border-[#c7b6b6] bg-white"
            >
              <Bell className="h-[18px] w-[18px] text-[#2a8570]" />
              <span className="absolute right-[10px] top-[8px] h-[7px] w-[7px] rounded-full bg-[#e07b6a]" />
            </button>
            <ProfileMenu size={37} />
          </div>
        </header>

        {/* Stat cards */}
        <section className="mt-[34px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Last backup" value="Oct 15, 2026" />
          <StatCard title="Last backup size" value="24.6 MB" />
          <StatCard title="Saved backups" value={String(history.length)} />
          <StatCard title="Auto backup schedule" value={autoBackupEnabled ? "Daily" : "Off"} />
        </section>

        <div className="mt-[28px] flex flex-col items-start gap-[24px] xl:flex-row">
          {/* Backup history */}
          <section className={`${cardShape} w-full min-w-0 flex-1 overflow-hidden p-[24px]`}>
            <h2 className={`${serif} text-[24px] font-bold text-[#2f4a42]`}>Backup history</h2>
            <p className={`${serif} mt-[4px] text-[14px] text-[#2f4a42] opacity-60`}>
              Download a copy or restore your system to an earlier point
            </p>

            <div className="mt-[24px] overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid h-[48px] grid-cols-[1.5fr_1fr_.8fr_1fr_1.9fr] items-center bg-[#e6f2ec]">
                  {["Date & Time", "Type", "Size", "Status", "Action"].map((h, i) => (
                    <div
                      key={h}
                      className={`${serif} flex h-full items-center px-[16px] text-[15px] font-bold text-[#2f4a42] ${
                        i > 0 ? "border-l border-[#20202059]" : ""
                      } ${h === "Status" || h === "Action" ? "justify-center" : ""}`}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {history.map((row) => (
                  <div
                    key={row.id}
                    className="grid min-h-[72px] grid-cols-[1.5fr_1fr_.8fr_1fr_1.9fr] items-center border-b border-[#e4e4e4] transition hover:bg-[#f3faf7]"
                  >
                    <div className={`${serif} px-[16px] text-[13px] font-bold text-[#2f4a42]`}>{row.dateTime}</div>
                    <div className={`${serif} px-[16px] text-[13px] font-bold text-[#2f4a42]`}>{row.type}</div>
                    <div className={`${serif} px-[16px] text-[13px] font-bold text-[#2f4a42]`}>{row.size}</div>
                    <div className="flex justify-center px-[8px]">
                      <span className={`${serif} rounded-full bg-[#e3f2ee] px-[10px] py-[3px] text-[12px] font-bold text-[#2a8570]`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-[8px] px-[10px]">
                      <button className={`${serif} inline-flex items-center gap-[5px] rounded-[10px] border border-[#2020203d] bg-white px-[10px] py-[6px] text-[13px] font-bold text-[#2f4a42] transition hover:bg-[#e3f2ee]`}>
                        <Download className="h-[13px] w-[13px]" />
                        Download
                      </button>
                      <button className={`${serif} inline-flex items-center gap-[5px] rounded-[10px] border border-[#2020203d] bg-white px-[10px] py-[6px] text-[13px] font-bold text-[#2f4a42] transition hover:bg-[#e3f2ee]`}>
                        <RotateCcw className="h-[13px] w-[13px]" />
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right column */}
          <div className="flex w-full shrink-0 flex-col gap-[24px] xl:w-[403px]">
            {/* Backup now */}
            <section className={`${cardShape} flex flex-col gap-[16px] px-[20px] py-[24px]`}>
              <div className="flex flex-col gap-[4px]">
                <h2 className={`${serif} text-[20px] font-bold text-[#2f4a42]`}>Backup now</h2>
                <p className={`${serif} text-[14px] text-[#2f4a42] opacity-80`}>
                  Save a copy of your records right away. Includes:
                </p>
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {INCLUDES.map((item) => (
                  <span
                    key={item}
                    className={`${serif} rounded-full bg-[#d6ede7] px-[14px] py-[6px] text-[13px] font-bold text-[#2f4a42]`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button
                onClick={backUpNow}
                className={`${serif} w-full rounded-[12px] bg-[#2f4a42] px-[20px] py-[14px] text-[16px] font-bold text-white transition hover:bg-[#1f322c]`}
              >
                Back up now
              </button>
              <p className={`${serif} text-center text-[12px] font-bold text-[#2f4a42] opacity-60`}>
                Last backup: Oct 15 2026 · 2:00 AM
              </p>
            </section>

            {/* Automatic backup */}
            <section className="flex flex-col gap-[16px] rounded-[16px] border border-[#d8e2e0] bg-white p-[20px]">
              <div className="flex items-center justify-between">
                <h2 className={`${serif} text-[22px] font-bold text-[#2f4a42]`}>Automatic backup</h2>
                <div className="flex items-center gap-[10px]">
                  <span className={`${inter} text-[12px] font-bold text-[#088270]`}>
                    {autoBackupEnabled ? "On" : "Off"}
                  </span>
                  <button
                    role="switch"
                    aria-checked={autoBackupEnabled}
                    aria-label="Automatic backup"
                    onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                    className={`flex h-[28px] w-[52px] items-center rounded-full p-[3px] transition-colors ${
                      autoBackupEnabled ? "bg-[#088270]" : "bg-[#c9d3d0]"
                    }`}
                  >
                    <span
                      className={`h-[22px] w-[22px] rounded-full bg-white transition-transform ${
                        autoBackupEnabled ? "translate-x-[24px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <p className={`${serif} text-[14px] text-[#2f4a42] opacity-80`}>
                Let the system save a copy for you.
              </p>

              <SelectField
                label="HOW OFTEN"
                value={frequency}
                onChange={setFrequency}
                options={["Every day", "Every week", "Every month"]}
                disabled={!autoBackupEnabled}
              />
              <SelectField
                label="TIME"
                value={backupTime}
                onChange={setBackupTime}
                options={["12:00 AM", "2:00 AM", "4:00 AM"]}
                disabled={!autoBackupEnabled}
              />

              <div className="rounded-[10px] bg-[#e2f2ea] px-[16px] py-[12px]">
                <p className={`${inter} text-[13px] font-bold text-[#2f4a42]`}>
                  {autoBackupEnabled
                    ? `Next backup: Sunday, October 18 · ${backupTime}`
                    : "Automatic backup is turned off"}
                </p>
              </div>

              <button
                className={`${inter} flex w-full justify-center rounded-[10px] border-[1.5px] border-[#088270] bg-white px-[20px] py-[14px] text-[13px] font-bold text-[#088270] transition hover:bg-[#e3f2ee]`}
              >
                Save schedule
              </button>
            </section>

            {/* Restore from file */}
            <section className="flex flex-col gap-[14px] rounded-[18px] border border-[#e2e8e5] bg-white p-[26px]">
              <h2 className={`${serif} text-[21px] font-bold leading-[25px] text-[#2f594f]`}>
                Restore from file
              </h2>
              <p className={`${serif} text-[14px] font-bold leading-[18px] text-[#60716b]`}>
                Upload a backup file you saved earlier.
              </p>

              <div className="flex h-[140px] flex-col items-center justify-center gap-[8px] rounded-[12px] border-2 border-dashed border-[#a6dace] bg-[#f3faf7] px-[20px] py-[22px]">
                <UploadCloud className="h-[26px] w-[26px] text-[#239d89]" />
                <p className={`${inter} text-center text-[13px] font-bold leading-[18px] text-[#325f55]`}>
                  {file ? file.name : "Drop your backup file here"}
                </p>
                <p className={`${inter} text-center text-[12px] leading-[18px] text-[#65756f]`}>
                  .zip or .sql · up to 200 MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".zip,.sql"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className={`${inter} rounded-[10px] border border-[#239d89] bg-white px-[14px] py-[6px] text-[12px] font-bold text-[#239d89] transition hover:bg-[#e3f2ee]`}
                >
                  Choose file
                </button>
              </div>

              <div className="rounded-[12px] bg-[#fff1cb] px-[14px] py-[12px]">
                <p className={`${inter} text-[12px] leading-[18px] text-[#89641c]`}>
                  Restoring replaces current data with the backup. A safety copy is made first.
                </p>
              </div>

              <button
                disabled={!file}
                className={`${inter} flex h-[43px] w-full items-center justify-center rounded-[10px] border border-[#ffaaa5] bg-white text-[13px] font-bold text-[#df4034] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
              >
                Restore selected file
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className={`${cardShape} h-[102px] px-[28px] py-[16px]`}>
      <div className={`${serif} text-[32px] font-bold leading-[1.15] text-[#2f4a42]`}>{value}</div>
      <div className={`${serif} mt-[4px] text-[14px] font-bold text-[#2f4a42]`}>{title}</div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, disabled }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className={`${inter} text-[11px] font-bold tracking-[0.8px] text-[#2f4a42]`}>{label}</label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`${inter} w-full appearance-none rounded-[10px] border border-[#2020203d] bg-white px-[16px] py-[12px] text-[13px] text-[#2f4a42] focus:outline-none focus:ring-2 focus:ring-[#4a9b8e] disabled:opacity-50`}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#2f4a42]" />
      </div>
    </div>
  );
}