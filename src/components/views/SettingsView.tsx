"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  CreditCard,
  Download,
  HelpCircle,
  RotateCcw,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { APOLLO_BENCHMARKS, HELP_FAQS } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export function SettingsView() {
  const {
    state,
    updatePreferences,
    changePlan,
    toggleExternalApp,
    resetWorkspace,
    setCoachOpen,
    setSprintOpen,
    setActiveSection,
    pushToast,
  } = useVexWorkspace();

  const [tab, setTab] = useState<"privacy" | "billing" | "oracle" | "help">(
    "privacy"
  );
  const [showJson, setShowJson] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vex-workspace-export.json";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Exported full workspace JSON", "good");
  };

  const creditPct = Math.min(
    100,
    Math.round(
      (state.preferences.aiCreditsUsed / state.preferences.aiCreditsLimit) * 100
    )
  );

  const filteredFaqs = HELP_FAQS.filter((f) => {
    if (!faqSearch.trim()) return true;
    const q = faqSearch.toLowerCase();
    return (
      f.q.toLowerCase().includes(q) ||
      f.a.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Governance, Billing & Oracle"
        subtitle="Themis data ownership, Plutus subscription quotas, Apollo market compensation, and Help Center."
        actionLabel="Export JSON"
        actionIcon={<Download className="h-3.5 w-3.5" />}
        onAction={exportJson}
      />

      <MobilePhilosopherPill
        philosopher={
          tab === "billing"
            ? "plutus"
            : tab === "oracle"
            ? "apollo"
            : "themis"
        }
        guidance="All data stays under your ownership — export your full workspace JSON or reset anytime."
      />

      {/* Top Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Active Tier</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.preferences.plan}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">AI Credits Used</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.preferences.aiCreditsUsed}
                <span className="text-sm text-[#6c7581] ml-1">
                  /{state.preferences.aiCreditsLimit}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Connected Apps</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.externalApps.filter((e) => e.connected).length}
              </p>
            </div>
          </div>

          <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5">
            <div
              className="h-1.5 rounded-full vex-striped-lime"
              style={{ width: `${Math.max(8, creditPct)}%` }}
            />
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6c7581]">
              Tours & Accelerators
            </span>
            <Pill tone="lime">Ready</Pill>
          </div>
          <div className="flex flex-wrap gap-2">
            <VexButton
              variant="dark"
              size="sm"
              onClick={() => setCoachOpen(true)}
            >
              <Compass className="h-3.5 w-3.5 text-[#d4fb35]" />
              <span>Replay Coach Guide</span>
            </VexButton>
            <VexButton
              variant="white"
              size="sm"
              onClick={() => setSprintOpen(true)}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Open 24h Sprint</span>
            </VexButton>
          </div>
        </div>
      </div>

      <NotchedDarkStudio
        leftHeading="Themis · Plutus · Apollo"
        activeTab={tab}
        onTabChange={setTab}
        tabs={[
          { id: "privacy", label: "Privacy & Data" },
          { id: "billing", label: "Plutus Billing" },
          { id: "oracle", label: "Apollo Oracle" },
          { id: "help", label: "Help & FAQ", count: HELP_FAQS.length },
        ]}
      >
        {tab === "privacy" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-[24px] bg-[#2c3033] p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Grounded AI Drafting Opt-In
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    AI suggestions only read canonical facts; nothing trains external models.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updatePreferences({
                      aiInferenceOptIn: !state.preferences.aiInferenceOptIn,
                    })
                  }
                  className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer shrink-0 flex items-center ${
                    state.preferences.aiInferenceOptIn
                      ? "bg-[#d4fb35] justify-end"
                      : "bg-slate-600 justify-start"
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 520, damping: 34 }}
                    className="block h-5 w-5 rounded-full bg-[#15181a]"
                  />
                </button>
              </div>

              <div className="rounded-[24px] bg-[#2c3033] p-5 space-y-3">
                <p className="font-mono-code text-[10px] uppercase text-slate-400">
                  Connected External Apps
                </p>
                {state.externalApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-[18px] bg-[#222528] px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {app.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{app.scope}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExternalApp(app.id)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer ${
                        app.connected
                          ? "bg-[#d4fb35] text-[#15181a]"
                          : "bg-[#383d42] text-slate-300"
                      }`}
                    >
                      {app.connected ? "Connected" : "Paused"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-[26px] bg-[#7898b0] p-6 text-white space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#d4fb35]" />
                <h3 className="font-display text-2xl font-normal">
                  Data Portability
                </h3>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Download your entire canonical profile, CV variants, cover letters, applications, and logs in portable JSON, or reset the workspace cleanly.
              </p>
              <div className="flex flex-wrap gap-2">
                <VexButton variant="lime" size="sm" onClick={exportJson}>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Full JSON</span>
                </VexButton>
                <VexButton
                  variant="steel"
                  size="sm"
                  onClick={() => setShowJson((v) => !v)}
                >
                  {showJson ? "Hide JSON" : "Inspect JSON"}
                </VexButton>
                <VexButton variant="danger" size="sm" onClick={resetWorkspace}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Data</span>
                </VexButton>
              </div>
              {showJson && (
                <pre className="max-h-56 overflow-auto rounded-[18px] bg-[#1f2224] p-3 font-mono-code text-[10.5px] text-[#d4fb35]">
                  {JSON.stringify(
                    {
                      profile: state.profile.name,
                      targetRole: state.profile.targetRole,
                      jobs: state.jobs.length,
                      applications: state.applications.length,
                      preferences: state.preferences,
                    },
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          </div>
        )}

        {tab === "billing" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(
                [
                  {
                    id: "Free" as const,
                    price: "£0",
                    credits: "500 AI credits / mo",
                    desc: "Canonical profile, 3-state tracker, manual exports.",
                  },
                  {
                    id: "Pro" as const,
                    price: "£24",
                    credits: "5,000 AI credits / mo",
                    desc: "Full Da Vinci diffs, Cicero proofs, Socrates drills.",
                  },
                  {
                    id: "Ultra" as const,
                    price: "£59",
                    credits: "25,000 AI credits / mo",
                    desc: "Unlimited Apollo oracle benchmarks & priority MCP forge.",
                  },
                ] as const
              ).map((tier) => {
                const active = state.preferences.plan === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={`rounded-[24px] p-5 flex flex-col justify-between gap-4 border ${
                      active
                        ? "bg-[#7898b0] border-white/40 text-white"
                        : "bg-[#2c3033] border-white/10 text-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{tier.id}</span>
                        {active && <Pill tone="lime">Current Plan</Pill>}
                      </div>
                      <p className="mt-2 font-display text-3xl font-normal">
                        {tier.price}
                        <span className="text-xs opacity-75">/mo</span>
                      </p>
                      <p className="text-xs font-medium text-[#d4fb35] mt-1">
                        {tier.credits}
                      </p>
                      <p className="text-xs opacity-85 mt-2">{tier.desc}</p>
                    </div>
                    <VexButton
                      variant={active ? "dark" : "lime"}
                      size="sm"
                      disabled={active}
                      onClick={() => changePlan(tier.id)}
                    >
                      {active ? "Active Tier" : `Switch to ${tier.id}`}
                    </VexButton>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[24px] bg-[#2c3033] p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-300">
                <CreditCard className="h-4 w-4 text-[#d4fb35]" />
                <span>Plutus Invoice Ledger</span>
              </div>
              {state.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-[18px] bg-[#222528] px-4 py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{inv.planLabel}</p>
                    <p className="text-[11px] text-slate-400">
                      {inv.date} · {inv.method}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">
                      {inv.amount}
                    </span>
                    <Pill tone="lime">{inv.status}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "oracle" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <TrendingUp className="h-4 w-4 text-[#d4fb35]" />
              <span>
                Apollo Career Oracle — Market Compensation Bands & Demand Curves
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {APOLLO_BENCHMARKS.map((b) => (
                <div
                  key={b.role}
                  className="rounded-[24px] bg-[#7898b0] p-5 text-white space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code text-[10px] uppercase text-white/75">
                      Market Benchmark
                    </span>
                    <Pill tone="lime">{b.demandTrend}</Pill>
                  </div>
                  <h4 className="font-display text-lg font-normal leading-snug">
                    {b.role}
                  </h4>
                  <p className="font-display text-3xl font-normal">
                    {b.median}
                    <span className="text-xs ml-1 opacity-80">median</span>
                  </p>
                  <div className="text-[11px] text-white/85 space-y-1 pt-2 border-t border-white/20">
                    <p>
                      P25 {b.p25} · P75 {b.p75}
                    </p>
                    <p>Competition: {b.competition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "help" && (
          <div className="space-y-4">
            <input
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search Vex trust invariants, Truth Lock, 3-state tracker..."
              className="w-full max-w-md rounded-full bg-[#2c3033] px-4 py-2.5 text-xs text-white placeholder:text-slate-400 outline-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-[22px] bg-[#2c3033] p-5 space-y-2"
                >
                  <Pill tone="lime">{faq.topic}</Pill>
                  <h4 className="text-xs font-semibold text-white">{faq.q}</h4>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    {faq.a}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSection(faq.section)}
                    className="text-[11px] font-semibold text-[#d4fb35] hover:underline cursor-pointer"
                  >
                    Open {faq.section} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
