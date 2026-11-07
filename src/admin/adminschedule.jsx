import React, { useState, useEffect, useMemo, useCallback } from "react";
import AdminNavigation from "./adminnavigation";
import ProfileMenu from "../components/ProfileMenu";

const FONT_CSS = `@import url('https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@400;600;700&family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');`;

const inter = "font-['Inter',Helvetica,sans-serif]";
const serif = "font-['Inria_Serif',Georgia,serif]";

/* ------------------------------------------------------------------ */
/*  API helper  (palitan ang URL kung iba ang backend mo)              */
/* ------------------------------------------------------------------ */
const API_URL = "http://localhost:8000/api";

async function api(path, options = {}) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Basahin muna bilang text para makita ang totoong sagot ng server kahit hindi JSON
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    /* hindi JSON */
  }

  if (!res.ok) {
    console.error(`API ${options.method || "GET"} ${path} -> ${res.status}`, text);
    if (res.status === 401) throw new Error("Your session expired. Please sign in again.");
    const firstError = data.errors ? Object.values(data.errors)[0][0] : null;
    throw new Error(firstError || data.message || `Server error (${res.status}). Check the browser console and laravel.log.`);
  }
  return data;
}

/* ------------------------------------------------------------------ */
/*  Date / time helpers                                                */
/* ------------------------------------------------------------------ */
const DAYS_HEADER = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`; // m is 0-based
const parseISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// "13:30" -> "1:30 PM"
const fmt = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh} ${ap}` : `${hh}:${pad(m)} ${ap}`;
};
const fmtLong = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const hoursBetween = (a, b) => {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return (bh * 60 + bm - (ah * 60 + am)) / 60;
};

/* ------------------------------------------------------------------ */
/*  Main Schedule Component                                            */
/* ------------------------------------------------------------------ */
export default function AdminSchedule() {
  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [slots, setSlots] = useState([]); // lahat ng slots ng buwan, galing database
  const [stats, setStats] = useState({ open_slots: 0, booked: 0, pending: 0, not_available: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [availabilityMode, setAvailabilityMode] = useState("available"); // 'available' | 'not_available'
  const [fromTime, setFromTime] = useState("09:00"); // type="time" -> 24h "HH:MM"
  const [toTime, setToTime] = useState("12:00");

  const monthKey = `${view.year}-${pad(view.month + 1)}`;
    const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();
  /* ---------- load from backend ---------- */
  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/admin/schedule?month=${monthKey}`);
      setSlots(data.slots || []);
      setStats(data.stats || {});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  /* ---------- group slots by date ---------- */
  const slotsByDate = useMemo(() => {
    const map = {};
    slots.forEach((s) => {
      (map[s.date] = map[s.date] || []).push(s);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    return map;
  }, [slots]);

  /* ---------- build calendar cells ---------- */
  const cells = useMemo(() => {
    const { year, month } = view;
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out = [];
    for (let i = first.getDay(); i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      out.push({ date: toISO(d.getFullYear(), d.getMonth(), d.getDate()), d: d.getDate(), dow: d.getDay(), other: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: toISO(year, month, d), d, dow: new Date(year, month, d).getDay(), other: false });
    }
    while (out.length % 7 !== 0) {
      const d = new Date(year, month, daysInMonth + (out.length - first.getDay() - daysInMonth) + 1);
      out.push({ date: toISO(d.getFullYear(), d.getMonth(), d.getDate()), d: d.getDate(), dow: d.getDay(), other: true });
    }
    return out;
  }, [view]);

  /* ---------- selected day info ---------- */
  const selDateObj = parseISO(selectedDate);
  const selSlots = slotsByDate[selectedDate] || [];
  const selIsUnavailable = selSlots.some((s) => s.status === "unavailable");
  const selIsPast = selectedDate < todayISO; // lumipas na ang petsa
  const selAvailable = selSlots.filter((s) => s.status === "available");
  const selOpenHours = selAvailable.reduce((sum, s) => sum + hoursBetween(s.start_time, s.end_time), 0);
  const selBooked = selAvailable.reduce((sum, s) => sum + (s.booked || 0), 0);
  const selRequested = selAvailable.reduce((sum, s) => sum + (s.requested || 0), 0);
  const fullDayName = DAY_FULL[selDateObj.getDay()];
  const shortMonth = MONTHS[selDateObj.getMonth()].slice(0, 3);

    
  useEffect(() => {
    const day = slotsByDate[selectedDate] || [];
    setAvailabilityMode(day.some((s) => s.status === "unavailable") ? "not_available" : "available");
  }, [selectedDate, slotsByDate]);

  const handleSelectDay = (cell) => {
    if (cell.date < todayISO) return;
    setSelectedDate(cell.date);
    setError("");
    setNotice("");
    if (cell.other) setView({ year: parseISO(cell.date).getFullYear(), month: parseISO(cell.date).getMonth() });
  };

  const changeMonth = (delta) => {
    const d = new Date(view.year, view.month + delta, 1);

    
    if (
      d.getFullYear() < today.getFullYear() ||
      (d.getFullYear() === today.getFullYear() && d.getMonth() < today.getMonth())
    ) {
      return;
    }

    setView({ year: d.getFullYear(), month: d.getMonth() });
    setError("");
    setNotice("");

    
    const isCurrent = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
    setSelectedDate(isCurrent ? todayISO : toISO(d.getFullYear(), d.getMonth(), 1));
  };

  /* ---------- save to backend ---------- */
  const handleAddAvailability = async () => {
    setError("");
    setNotice("");

    if (selectedDate < todayISO) return setError("This date has already passed.");

    if (availabilityMode === "available") {
      if (!fromTime || !toTime) return setError("Please enter both start and end time.");
      if (fromTime >= toTime) return setError("End time must be later than start time.");
    }

    setSaving(true);
    try {
      await api("/admin/schedule/slots", {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          status: availabilityMode,
          start_time: availabilityMode === "available" ? fromTime : null,
          end_time: availabilityMode === "available" ? toTime : null,
        }),
      });
      await loadSchedule();
      setNotice(
        availabilityMode === "available"
          ? "Time slot added. You can add another one for this day."
          : "Day marked as not available."
      );
      setTimeout(() => setNotice(""), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    setError("");
    setNotice("");
    try {
      await api(`/admin/schedule/slots/${id}`, { method: "DELETE" });
      await loadSchedule();
      setAvailabilityMode("available");
    } catch (e) {
      setError(e.message);
    }
  };

  const statCards = [
    { count: stats.open_slots ?? 0, label: "Open slots · next 30 days" },
    { count: stats.booked ?? 0, label: "Booked sessions" },
    { count: stats.pending ?? 0, label: "Pending requests" },
    { count: stats.not_available ?? 0, label: "Not available" },
  ];

  const headerDate = `${DAY_FULL[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()}`;

  return (
    <div className={`${inter} min-h-screen w-full bg-[#f4f6f5] text-[#1c1c1c] antialiased`}>
      <style>{FONT_CSS}</style>

      <div className="flex w-full items-start">
        <AdminNavigation />

        <main className="flex-1 px-[40px] pt-[32px] pb-[60px] max-w-[1400px]">
          <header className="flex items-start justify-between">
            <div>
              <div className={`${inter} text-[20px] font-bold tracking-[4.2px] text-[#4a9b8e] uppercase`}>SCHEDULE</div>
              <h1 className={`${serif} text-[40px] font-bold leading-[1.15] text-[#2f4a42] mt-[8px]`}>When are you available?</h1>
              <p className={`${serif} text-[15px] text-[#555] mt-[8px] max-w-[620px]`}>
                Set the days and hours clients can book with you. Clients only see the times you open here.
              </p>
            </div>

            <div className="flex items-center gap-[17px] pt-[6px]">
              <div className="flex h-[30px] min-w-[170px] px-[12px] items-center justify-center gap-[8px] rounded-[6px] border border-[#4a9b8e] bg-[#e3f2ee]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a8570" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className={`${inter} text-[12px] font-bold text-[#2a8570]`}>{headerDate}</span>
              </div>

              <button
                aria-label="Notifications"
                className="relative flex h-[37px] w-[46px] items-center justify-center rounded-[8px] border border-[#c7b6b6] bg-white hover:bg-[#f9fbf9] transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a8570" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
                <span className="absolute right-[10px] top-[8px] h-[7px] w-[7px] rounded-full bg-[#e07b6a]" />
              </button>
              <ProfileMenu size={37} />
            </div>
          </header>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-[24px] mt-[34px]">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white border border-[#c7b6b6] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-center min-h-[96px]">
                <div className={`${serif} text-[36px] font-bold text-[#202020] leading-none`}>{card.count}</div>
                <div className={`${serif} text-[14px] text-[#555] font-normal mt-[8px]`}>{card.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1.38fr_1fr] gap-[24px] mt-[24px]">
            {/* ------------------------ Calendar ------------------------ */}
            <div className="bg-white border border-[#c7b6b6] rounded-[10px] p-[28px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`${serif} text-[24px] font-bold text-[#202020]`}>
                      {MONTHS[view.month]} {view.year}
                    </h2>
                    <p className={`${serif} text-[13px] text-[#666] mt-[2px]`}>
                      {loading ? "Loading schedule…" : "Select a date to view availability"}
                    </p>
                  </div>

                  <div className="flex items-center gap-[8px]">
                    <button
                    onClick={() => changeMonth(-1)}
                    disabled={isCurrentMonth}
                    className="w-[28px] h-[28px] rounded-full bg-[#dcf0e8] text-[#1f6b55] flex items-center justify-center hover:bg-[#cbe8dc] transition-colors cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous month"
                  >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="w-[28px] h-[28px] rounded-full bg-[#dcf0e8] text-[#1f6b55] flex items-center justify-center hover:bg-[#cbe8dc] transition-colors cursor-pointer border-0"
                      aria-label="Next month"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-[8px] mt-[20px] text-center">
                  {DAYS_HEADER.map((d, i) => (
                    <div key={i} className={`${serif} text-[14px] font-normal text-[#666]`}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-[8px] mt-[10px]">
                  {cells.map((cell) => {
                    const daySlots = slotsByDate[cell.date] || [];
                    const isUnavailable = daySlots.some((s) => s.status === "unavailable");
                    const availSlots = daySlots.filter((s) => s.status === "available");
                    const isAvailable = !isUnavailable && availSlots.length > 0;
                    const hasSession = availSlots.some((s) => (s.booked || 0) > 0);
                    const isSelected = cell.date === selectedDate;
                    const past = cell.date < todayISO;

                    let cardBg = "bg-white border-[#eef2f0] text-[#202020]";
                    let dayColor = "text-[#202020]";
                    let subtextColor = "text-[#8a9e97]";
                    let hoursColor = "text-[#202020]";
                    let ring = "";

                    if (past) {
                      // Lumipas na: naka-disable at mahina ang kulay
                      cardBg = isUnavailable
                        ? "bg-[#f4e9e7] border-[#ecdcd9] opacity-60"
                        : isAvailable
                          ? "bg-[#e6efec] border-[#dce8e4] opacity-60"
                          : "bg-[#f3f4f4] border-[#eceeed] opacity-50";
                      dayColor = "text-[#9aa5a1]";
                      subtextColor = "text-[#aab4b0]";
                      hoursColor = "text-[#9aa5a1]";
                    } else if (cell.other && !isSelected) {
                      cardBg = "bg-white border-[#f2f5f3] opacity-40";
                      dayColor = "text-[#b0c0b9]";
                      subtextColor = "text-[#c2d0c9]";
                    } else if (isUnavailable) {
                      // Not available: pula/rose para agad makita
                      cardBg = "bg-[#f6d5d0] border-[#e2a9a1] text-[#7a2e22]";
                      dayColor = "text-[#7a2e22]";
                      subtextColor = "text-[#9a4a3e]";
                      hoursColor = "text-[#7a2e22]";
                      if (isSelected) ring = " ring-2 ring-[#184a3e] ring-offset-1";
                    } else if (isAvailable) {
                      cardBg = "bg-[#9ccac0] border-[#8fbeb4] text-[#16382f]";
                      dayColor = "text-[#16382f]";
                      subtextColor = "text-[#285045]";
                      hoursColor = "text-[#16382f]";
                      if (isSelected) ring = " ring-2 ring-[#184a3e] ring-offset-1";
                    } else if (isSelected) {
                      cardBg = "bg-[#184a3e] border-[#184a3e] text-white shadow-md";
                      dayColor = "text-white";
                      subtextColor = "text-[#cce2d9]";
                      hoursColor = "text-[#e2f0ea]";
                    }

                    return (
                      <div
                        key={cell.date}
                        onClick={() => handleSelectDay(cell)}
                        aria-disabled={past}
                        title={past ? "This date has passed" : isUnavailable ? "Not available" : undefined}
                        className={`relative rounded-[8px] border p-[6px] min-h-[66px] flex flex-col items-center justify-center transition-all ${past ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]"
                          } ${cardBg}${ring}`}
                      >
                        {hasSession && <span className="absolute top-[5px] w-[6px] h-[6px] rounded-full bg-[#f3b53f]" />}
                        {isUnavailable && (
                          <span
                            className={`absolute top-[4px] right-[4px] flex h-[13px] w-[13px] items-center justify-center rounded-full ${past ? "bg-[#c9a49e]" : "bg-[#c4574a]"
                              }`}
                          >
                            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </span>
                        )}

                        <div className={`${serif} text-[16px] font-bold leading-tight ${dayColor}`}>{cell.d}</div>
                        <div className={`${serif} text-[11px] leading-tight mt-[1px] ${subtextColor}`}>{DAY_SHORT[cell.dow]}</div>

                        {isUnavailable && (
                          <div className={`${serif} text-[9px] font-bold leading-tight mt-[3px] text-center ${hoursColor}`}>Not available</div>
                        )}
                        {!isUnavailable &&
                          availSlots.slice(0, 2).map((s) => (
                            <div key={s.id} className={`${serif} text-[9px] font-medium leading-tight mt-[2px] text-center ${hoursColor}`}>
                              {fmt(s.start_time)} - {fmt(s.end_time)}
                            </div>
                          ))}
                        {!isUnavailable && availSlots.length > 2 && (
                          <div className={`${serif} text-[9px] leading-tight mt-[2px] ${subtextColor}`}>+{availSlots.length - 2} more</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-[18px] mt-[26px] pt-[14px] border-t border-[#edf2ef] text-[12px] text-[#666]">
                <div className="flex items-center gap-[6px]">
                  <span className="w-[12px] h-[12px] rounded-[3px] bg-[#9ccac0]" />
                  <span className={serif}>Available</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="w-[12px] h-[12px] rounded-[3px] bg-[#f6d5d0] border border-[#e2a9a1]" />
                  <span className={serif}>Not available</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="w-[12px] h-[12px] rounded-[3px] bg-[#f3f4f4] border border-[#dfe2e1]" />
                  <span className={serif}>Past date</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#f3b53f]" />
                  <span className={serif}>Has sessions</span>
                </div>
              </div>
            </div>

            {/* ------------------- Availability settings ------------------- */}
            <div className="bg-white border border-[#c7b6b6] rounded-[10px] p-[28px] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className={`${serif} text-[24px] font-bold text-[#202020]`}>
                  {fullDayName}, {MONTHS[selDateObj.getMonth()]} {selDateObj.getDate()}
                </h3>
                <p className={`${serif} text-[13px] text-[#666] mt-[2px]`}>
                  {selOpenHours} open hours · {selBooked} booked · {selRequested} requested
                </p>

                {selIsUnavailable && (
                  <div className={`${serif} mt-[12px] flex items-center gap-[8px] rounded-[8px] border border-[#e2a9a1] bg-[#f6d5d0] px-[12px] py-[8px] text-[13px] text-[#7a2e22]`}>
                    <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#c4574a]">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>
                    You're not available on this date. Clients can't book it.
                  </div>
                )}

                {/* Available / Not available toggle */}
                <div className={`grid grid-cols-2 gap-[14px] mt-[20px] ${selIsPast ? "pointer-events-none opacity-50" : ""}`}>
                  {[
                    { key: "available", title: "Available", sub: "Client can book this date" },
                    { key: "not_available", title: "Not available", sub: "Not available on this date" },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      onClick={() => setAvailabilityMode(opt.key)}
                      className={`rounded-[8px] border p-[12px] transition-all cursor-pointer ${availabilityMode === opt.key
                        ? "border-[#1f6b55] bg-white shadow-sm ring-1 ring-[#1f6b55]"
                        : "border-[#c7b6b6] bg-[#fbfdfc] opacity-70"
                        }`}
                    >
                      <div className="flex items-center gap-[6px] text-[#202020]">
                        {availabilityMode === opt.key && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f6b55" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        <span className={`${serif} font-bold text-[14px]`}>{opt.title}</span>
                      </div>
                      <div className={`${serif} text-[11px] text-[#666] mt-[3px]`}>{opt.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Saved slots for this day */}
                <div className="mt-[22px]">
                  <div className={`${inter} block text-[11px] font-bold tracking-[1.5px] text-[#666] uppercase mb-[8px]`}>
                    SAVED FOR THIS DAY
                  </div>
                  {selSlots.length === 0 ? (
                    <p className={`${serif} text-[13px] text-[#888]`}>Nothing saved yet. Add a time below.</p>
                  ) : (
                    <div className="flex flex-col gap-[8px]">
                      {selSlots.map((s) => (
                        <div
                          key={s.id}
                          className={`flex items-center justify-between rounded-[6px] border px-[12px] py-[8px] ${s.status === "unavailable" ? "border-[#c9cfcd] bg-[#eef0ef]" : "border-[#a8dbc4] bg-[#e6f4ee]"
                            }`}
                        >
                          <span className={`${serif} text-[13px] text-[#202020]`}>
                            {s.status === "unavailable" ? "Not available all day" : `${fmtLong(s.start_time)} – ${fmtLong(s.end_time)}`}
                          </span>
                          {!selIsPast && (
                            <button
                              onClick={() => handleDeleteSlot(s.id)}
                              className={`${serif} text-[12px] text-[#b4493a] hover:underline cursor-pointer bg-transparent border-0`}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add availability */}
                {selIsPast ? (
                  <div className={`${serif} mt-[24px] rounded-[8px] border border-[#dfe2e1] bg-[#f3f4f4] p-[14px] text-[13px] text-[#6b7571]`}>
                    This date has passed, so its schedule can't be changed.
                  </div>
                ) : availabilityMode === "available" ? (
                  <div className="mt-[24px]">
                    <h4 className={`${serif} text-[20px] font-bold text-[#202020]`}>Add availability</h4>
                    <p className={`${serif} text-[13px] text-[#666] mt-[2px]`}>
                      Pick the time you can see clients. You can add more than one time on the same day.
                    </p>

                    <div className="mt-[16px]">
                      <label className={`${inter} block text-[11px] font-bold tracking-[1.5px] text-[#666] uppercase mb-[6px]`}>
                        FROM AND TO
                      </label>
                      <div className="flex items-center gap-[10px]">
                        <input
                          type="time"
                          value={fromTime}
                          onChange={(e) => setFromTime(e.target.value)}
                          className={`${serif} w-full rounded-[6px] border border-[#c7b6b6] bg-white px-[14px] py-[8px] text-[14px] text-[#202020] outline-none focus:border-[#1f6b55] focus:ring-1 focus:ring-[#1f6b55]`}
                        />
                        <span className={`${serif} text-[13px] font-medium text-[#666] px-[2px]`}>To</span>
                        <input
                          type="time"
                          value={toTime}
                          onChange={(e) => setToTime(e.target.value)}
                          className={`${serif} w-full rounded-[6px] border border-[#c7b6b6] bg-white px-[14px] py-[8px] text-[14px] text-[#202020] outline-none focus:border-[#1f6b55] focus:ring-1 focus:ring-[#1f6b55]`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-[24px]">
                    <h4 className={`${serif} text-[20px] font-bold text-[#202020]`}>Mark as not available</h4>
                    <p className={`${serif} text-[13px] text-[#666] mt-[2px]`}>
                      This closes the whole day. Any open times saved for this day will be removed.
                    </p>
                  </div>
                )}

                <div className={`mt-[20px] bg-[#e6f4ee] border border-[#a8dbc4] rounded-[8px] p-[14px] text-[#175240] ${selIsPast ? "hidden" : ""}`}>
                  <span className={`${serif} text-[13px]`}>
                    {availabilityMode === "available"
                      ? fromTime && toTime
                        ? `You'll open ${fmtLong(fromTime)} – ${fmtLong(toTime)} on ${fullDayName}, ${shortMonth} ${selDateObj.getDate()}.`
                        : "Choose a start and end time."
                      : `You will be marked unavailable on ${fullDayName}, ${shortMonth} ${selDateObj.getDate()}.`}
                  </span>
                </div>

                {error && (
                  <div className={`${serif} mt-[10px] rounded-[8px] border border-[#e8b4ab] bg-[#fdf0ee] p-[10px] text-[13px] text-[#9a3b2e]`}>
                    {error}
                  </div>
                )}

                {notice && (
                  <div className="mt-[10px] text-[13px] font-semibold text-[#1f6b55] flex items-center gap-[6px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={serif}>{notice}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddAvailability}
                disabled={saving || selIsPast}
                className={`${serif} w-full mt-[28px] py-[12px] bg-[#00a58a] hover:bg-[#00937a] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-[8px] text-[15px] font-semibold transition-all shadow-sm hover:shadow cursor-pointer border-0`}
              >
                {saving ? "Saving…" : selIsPast ? "Date has passed" : availabilityMode === "available" ? "+ Add availability" : "Mark as not available"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}