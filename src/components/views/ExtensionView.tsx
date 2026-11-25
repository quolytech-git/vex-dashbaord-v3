"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Chrome,
  Monitor,
  Puzzle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

const ATS_MATRIX = [
  {
    key: "greenhouse" as const,
    name: "Greenhouse",
    support: "Full Parity",
    detail: "Auto-fills profile, notice period, CV, and captures confirmation hash.",
  },
  {
    key: "lever" as const,
    name: "Lever",
    support: "Full Parity",
    detail: "Maps structured links, proof artifacts, and halts cleanly before Submit.",
  },
  {
    key: "ashby" as const,
    name: "Ashby",
    support: "Partial",
    detail: "Fills standard fields; custom essay prompts flagged for human input.",
  },
  {
    key: "workday" as const,
    name: "Workday",
    support: "Assisted",
    detail: "Step-by-step field copy assistant; multi-page forms verified manually.",
  },
];

const ONBOARDING_STEPS = [
  "01 Download Extension Bundle",
  "02 Pin Vex Apply in Chrome",
  "03 Authorise Site Permissions",
  "04 Inspect Field Mapping",
  "05 Pause Gate Before Submit",
  "06 Capture Confirmation Hash",
];

export function ExtensionView() {
  const { state, updatePreferences, pushToast, truthLockActive } =
    useVexWorkspace();
  const [studioTab, setStudioTab] = useState<
    "popup" | "matrix" | "onboarding"
  >("popup");
  const [activeOnboardStep, setActiveOnboardStep] = useState(0);

  const g = state.preferences.extensionGuardrails;
  const sp = state.preferences.sitePermissions;

  const toggleGuardrail = (key: keyof typeof g) => {
    updatePreferences({
      extensionGuardrails: { ...g, [key]: !g[key] },
    });
    pushToast("Updated Vex Apply guardrail", "info");
  };

  const toggleSite = (key: keyof typeof sp) => {
    updatePreferences({
      sitePermissions: { ...sp, [key]: !sp[key] },
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Vex Apply Extension"
        subtitle="Chrome companion that pre-fills verified profile facts and always stops before final submission."
        actionLabel="Test Popup Sync"
        actionIcon={<Chrome className="h-3.5 w-3.5" />}
        onAction={() =>
          pushToast(
            truthLockActive
              ? "Popup flagged CV Truth Lock — fix Diff #2 before export"
              : "Vex Apply extension fields synced cleanly",
            truthLockActive ? "warn" : "good"
          )
        }
      />

      <MobilePhilosopherPill
        philosopher="hermes"
        guidance="Desktop Chrome is required to run autofill on ATS pages, but you can inspect and toggle all safety guardrails right here on mobile."
      />

      {/* Mobile Desktop-Chrome-Only Honest Notice */}
      <div className="lg:hidden rounded-[22px] border border-[#bfdbfe] bg-[#eff6ff] p-4 flex items-start gap-3 text-xs text-[#1e3a8a]">
        <Monitor className="h-5 w-5 shrink-0 mt-0.5 text-[#2e67b2]" />
        <div>
          <p className="font-semibold">Desktop Chrome Only</p>
          <p className="mt-0.5 text-[#1e40af]/85">
            Browser form autofill runs on desktop Chrome. Inspect ATS compatibility and adjust your persistent submission guardrails below.
          </p>
        </div>
      </div>

      {/* Top Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Guardrails Active</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {Object.values(g).filter(Boolean).length}/4
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Enabled ATS Sites</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {Object.values(sp).filter(Boolean).length}/4
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Auto-Submit</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#0e7c4d]">
                Never
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "verifiedSkillsOnly", label: "Verified Skills Only" },
                {
                  key: "alwaysStopBeforeSubmit",
                  label: "Always Stop Before Submit",
                },
                {
                  key: "captureConfirmationHash",
                  label: "Capture Confirmation Hash",
                },
                { key: "flagUnstatedFields", label: "Flag Unstated Fields" },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleGuardrail(item.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  g[item.key]
                    ? "bg-[#1f2224] text-[#d4fb35]"
                    : "bg-white text-[#6c7581]"
                }`}
              >
                {g[item.key] ? "✓ " : ""}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6c7581]">Human Pause Gate</p>
              <p className="mt-1 font-display text-2xl font-normal text-[#181b1e]">
                Inspect Before Submit
              </p>
            </div>
            <ShieldCheck className="h-6 w-6 text-[#0e7c4d]" />
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Every ATS field is tagged as <strong>Filled from Profile</strong>,{" "}
            <strong>Needs Human Input</strong>, or <strong>Blocked by Truth Lock</strong>.
          </p>
        </div>
      </div>

      {/* Dark Master-Detail Studio */}
      <NotchedDarkStudio
        leftHeading="Vex Apply Command Hub"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "popup", label: "Popup Simulator" },
          { id: "matrix", label: "ATS Matrix & Sites", count: 4 },
          { id: "onboarding", label: "Chrome Onboarding", count: 6 },
        ]}
      >
        {studioTab === "popup" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 rounded-[24px] bg-[#2c3033] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4fb35] text-xs font-bold text-[#15181a]">
                    V
                  </span>
                  <span className="text-xs font-semibold text-white">
                    Vex Apply · Greenhouse Tab
                  </span>
                </div>
                <Pill tone={truthLockActive ? "bad" : "lime"}>
                  {truthLockActive ? "CV Locked" : "Ready"}
                </Pill>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    field: "Full Name & Email",
                    val: state.profile.name,
                    status: "Filled",
                  },
                  {
                    field: "Notice Period",
                    val: state.profile.noticePeriod,
                    status: "Needs Review",
                  },
                  {
                    field: "Tailored CV Attachment",
                    val: truthLockActive
                      ? "Blocked (Diff #2)"
                      : "Northbridge_Tailored.pdf",
                    status: truthLockActive ? "Blocked" : "Filled",
                  },
                  {
                    field: "Work Authorisation",
                    val: "EU / UK Right to Work",
                    status: "Filled",
                  },
                ].map((f) => (
                  <div
                    key={f.field}
                    className="rounded-[16px] bg-[#222528] p-3 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-[11px] text-slate-400">{f.field}</p>
                      <p className="font-medium text-white">{f.val}</p>
                    </div>
                    <Pill
                      tone={
                        f.status === "Blocked"
                          ? "bad"
                          : f.status === "Needs Review"
                          ? "warn"
                          : "good"
                      }
                    >
                      {f.status}
                    </Pill>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-[26px] bg-[#7898b0] p-6 text-white flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <p className="font-mono-code text-[10px] uppercase text-white/80">
                  Safety Architecture
                </p>
                <h3 className="font-display text-2xl font-normal">
                  Zero-Surprise Submission Protocol
                </h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  Vex pre-fills deterministic fields from your Canonical Profile, pauses cleanly on custom questions, and records a cryptographic confirmation hash only after you click the employer&apos;s Submit button yourself.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-[18px] bg-white/15 p-4 text-xs space-y-1">
                  <ShieldCheck className="h-4 w-4 text-[#d4fb35]" />
                  <p className="font-semibold">Verified-Skills-Only</p>
                  <p className="text-white/80">
                    Never injects unverified claims into ATS screening forms.
                  </p>
                </div>
                <div className="rounded-[18px] bg-white/15 p-4 text-xs space-y-1">
                  <ShieldAlert className="h-4 w-4 text-[#d4fb35]" />
                  <p className="font-semibold">Human Final Click</p>
                  <p className="text-white/80">
                    Final Submit button remains disabled for automation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {studioTab === "matrix" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {ATS_MATRIX.map((site) => {
              const enabled = sp[site.key];
              return (
                <div
                  key={site.key}
                  className={`rounded-[22px] p-5 flex items-start justify-between gap-4 border ${
                    enabled
                      ? "bg-[#7898b0] border-white/30 text-white"
                      : "bg-[#2c3033] border-white/10 text-slate-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-xl font-normal">
                        {site.name}
                      </h4>
                      <Pill tone={site.support === "Full Parity" ? "lime" : "glass"}>
                        {site.support}
                      </Pill>
                    </div>
                    <p className="text-xs opacity-90">{site.detail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSite(site.key)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 cursor-pointer ${
                      enabled
                        ? "bg-[#1f2224] text-[#d4fb35]"
                        : "bg-[#3c4146] text-slate-300"
                    }`}
                  >
                    {enabled ? "Allowed" : "Blocked"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {studioTab === "onboarding" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ONBOARDING_STEPS.map((st, idx) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setActiveOnboardStep(idx)}
                  className={`rounded-[18px] p-3 text-left text-xs font-medium cursor-pointer ${
                    activeOnboardStep === idx
                      ? "bg-[#d4fb35] text-[#15181a] font-semibold"
                      : "bg-[#2c3033] text-slate-300"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="rounded-[24px] bg-[#7898b0] p-6 text-white space-y-2">
              <p className="font-mono-code text-[10px] uppercase text-white/80">
                Chrome Onboarding Step 0{activeOnboardStep + 1}
              </p>
              <h3 className="font-display text-2xl font-normal">
                {ONBOARDING_STEPS[activeOnboardStep]}
              </h3>
              <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
                Install the signed Vex Apply unpacked or Web Store extension, enable only the ATS domains you actively use (Greenhouse, Lever, Ashby), and verify every pre-filled field at the pause gate before submitting.
              </p>
            </div>
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
