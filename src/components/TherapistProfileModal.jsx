import React from "react";
import { CLINIC } from "../data/clinic";

/**
 * TherapistProfileModal - Allows clients to view an Admin or Affiliate/Psychologist profile.
 * 
 * Props:
 *  - profile: Object containing { name, role, title, email, phone, avatar_url, bio, focus, tags }
 *  - onClose: () => void
 */
export default function TherapistProfileModal({ profile, onClose }) {
  if (!profile) return null;

  const initials = (profile.name || "Dr. Staff")
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isDirector = profile.role === "ADMIN";
  const displayTitle =
    profile.title ||
    (isDirector
      ? "Clinical Director & Lead Psychologist"
      : "Licensed Psychologist & Affiliate Therapist");

  const bioText =
    profile.bio ||
    (isDirector
      ? "Leading the clinical team at Threefold Therapy. Overseeing comprehensive psychotherapy frameworks, client assessments, and evidence-based clinical practices with extensive years of practice in adult and family psychotherapy."
      : "Providing compassionate, client-centered psychological care. Dedicated to helping individuals develop coping mechanisms, process life challenges, and foster meaningful psychological growth.");

  const tags = profile.tags || [
    "Psychotherapy & Counseling",
    "Evidence-based Intervention",
    "Mental Wellness Support",
  ];

  return (
    <div
      className="fixed inset-0 z-[140] grid place-items-center bg-black/50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#2a6a53] to-[#4a9b8e] relative p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="size-24 rounded-full border-4 border-white bg-[#aac6b7] shadow-md overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="font-serif text-2xl font-bold text-[#1e5441]">
                  {initials}
                </span>
              )}
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isDirector
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-emerald-100 text-emerald-900 border border-emerald-300"
              }`}
            >
              {isDirector ? "Admin / Director" : "Affiliate / Therapist"}
            </span>
          </div>

          <h3 className="m-0 font-serif text-2xl text-[#202020]">{profile.name}</h3>
          <p className="m-0 mt-0.5 text-sm font-medium text-[#2a6a53]">{displayTitle}</p>
          <p className="m-0 mt-1 text-xs text-[#777]">{CLINIC.name}</p>

          {/* Details & Tags */}
          <div className="mt-5 border-t border-black/10 pt-4">
            <p className="m-0 text-[11px] font-bold uppercase tracking-wider text-[#666]">
              Professional Profile &amp; Bio
            </p>
            <p className="m-0 mt-2 text-sm leading-relaxed text-[#444] font-serif">
              {bioText}
            </p>
          </div>

          {/* Specialization Tags */}
          <div className="mt-4">
            <p className="m-0 text-[11px] font-bold uppercase tracking-wider text-[#666]">
              Focus &amp; Areas of Practice
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[#ebfef6] border border-[#2a6a53]/20 px-2.5 py-1 text-xs font-medium text-[#1e5441]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Consultation Info */}
          <div className="mt-5 rounded-xl border border-black/10 bg-[#fbfdfc] p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#666]">Consultation Modalities:</span>
              <span className="font-medium text-[#202020]">Online &amp; In-person</span>
            </div>
            {profile.email && (
              <div className="flex justify-between">
                <span className="text-[#666]">Clinic Contact:</span>
                <span className="font-medium text-[#202020]">{profile.email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#666]">Location:</span>
              <span className="font-medium text-[#202020]">{CLINIC.address}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#2a6a53] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#235845] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
