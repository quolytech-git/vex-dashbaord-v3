"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  Info,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  Modal,
  NotchedDarkStudio,
  Pill,
  ScoreGlossaryCard,
  ScoreInfo,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import { PHILOSOPHERS } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { ApplicationTruthState, PhilosopherId } from "@/types/vex";

const COUNCIL_MENTORS: PhilosopherId[] = [
  "marcus",
  "aristotle",
  "plato",
  "socrates",
  "cicero",
  "hermes",
  "athena",
  "apollo",
];

const TRUTH_BADGE: Record<
  ApplicationTruthState,
  { label: string; tone: "warn" | "info" | "good" }
> = {
  prepared: { label: "Prepared", tone: "warn" },
  user_reported: { label: "Self-reported", tone: "info" },
  verified: { label: "Verified", tone: "good" },
};

const OFFER_COMPARISONS = [
  {
    company: "Northbridge Systems",
    role: "Product Operations Lead",
    base: "£78,000",
    bonus: "10% Target",
    pattern: "Hybrid (2d/wk)",
    fit: "86%",
    risk: "1 CV Truth Lock pending",
  },
  {
    company: "Aldermere Financial",
    role: "Frontend Platform Engineer",
    base: "£82,000",
    bonus: "12% Equity/Bonus",
    pattern: "Hybrid (3d/wk)",
    fit: "82%",
    risk: "Verified submitted (hash logged)",
  },
  {
    company: "Meridian Advisory",
    role: "Strategy & Readiness Assoc.",
    base: "£74,000",
    bonus: "8% Perf",
    pattern: "Remote",
    fit: "79%",
    risk: "Panel scheduled Tuesday",
  },
];

export function DashboardView() {
  const {
    state,
    setActiveSection,
    setSelectedJobId,
    setSprintOpen,
    setCoachOpen,
    readinessChecks,
    readinessCompletedCount,
    readinessPct,
    sprintCompletedCount,
    sprintMilestones,
    nextBestAction,
    toggleDailyStep,
    dismissSampleBanner,
    unsupportedClaimCount,
    truthLockActive,
    logInterviewInvite,
  } = useVexWorkspace();

  const [horizon, setHorizon] = useState<"7d" | "30d" | "all">("7d");
  const [mentorIdx, setMentorIdx] = useState(0);
  const [studioTab, setStudioTab] = useState<
    "pipeline" | "steps" | "checks" | "glossary"
  >("pipeline");
  const [selectedAppId, setSelectedAppId] = useState<string>(
    state.applications[0]?.id || ""
  );
  const [filterTruth, setFilterTruth] = useState<"all" | ApplicationTruthState>(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCompany, setInviteCompany] = useState("Northbridge Systems");
  const [inviteRole, setInviteRole] = useState("Product Operations Lead");
  const [inviteDate, setInviteDate] = useState("Thu 28 Nov · 14:00 GMT");
  const [offersOpen, setOffersOpen] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);

  const activeMentor = PHILOSOPHERS[COUNCIL_MENTORS[mentorIdx]];
  const savedJobs = state.jobs.filter((j) => j.triage === "saved");
  const avgCompatibility = useMemo(() => {
    if (state.jobs.length === 0) return 0;
    return Math.round(
      state.jobs.reduce((acc, j) => acc + j.matchScore, 0) / state.jobs.length
    );
  }, [state.jobs]);

  const horizonMult = horizon === "7d" ? 1 : horizon === "30d" ? 3.2 : 6.0;
  const prepMinutes = Math.round(186 * horizonMult);
  const completedDailyCount = state.dailySteps.filter((d) => d.done).length;
  const cvQualityScore = truthLockActive ? 81 : 94;

  const filteredApps = useMemo(() => {
    return state.applications.filter((a) => {
      if (filterTruth !== "all" && a.truthState !== filterTruth) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !a.company.toLowerCase().includes(q) &&
          !a.role.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [state.applications, filterTruth, searchQuery]);

  const activeApp =
    filteredApps.find((a) => a.id === selectedAppId) ||
    filteredApps[0] ||
    state.applications[0];

  const activeJobForApp = state.jobs.find((j) => j.id === activeApp?.jobId);

  const verifiedSubmittedCount = state.applications.filter(
    (a) => a.truthState === "verified"
  ).length;
  const userReportedCount = state.applications.filter(
    (a) => a.truthState === "user_reported"
  ).length;

  const activeVariant =
    state.cvVariants.find((v) => v.id === state.activeVariantId) ||
    state.cvVariants[0];

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    logInterviewInvite(inviteCompany, inviteRole, inviteDate);
    setInviteOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Sample Data Banner */}
      <AnimatePresence>
        {!state.preferences.sampleBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-[22px] border border-white bg-white/80 backdrop-blur-md px-4 py-2.5 text-xs shadow-2xs"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="shrink-0 rounded-full bg-[#1f2224] px-2.5 py-0.5 font-mono-code text-[10px] font-semibold uppercase tracking-wider text-[#d4fb35]">
                Sample Data
              </span>
              <span className="text-[#475569]">
                Jobs, applications, and readiness scores are illustrative so you can explore Vex safely. Nothing is ever auto-submitted.
              </span>
            </div>
            <button
              type="button"
              onClick={dismissSampleBanner}
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 self-end sm:self-center text-xs font-medium text-[#181b1e] hover:underline cursor-pointer"
            >
              <span>Got it</span>
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MOBILE iOS COMPANION HOME (< 1024px) — Exact Folder 1 Mobile Spec     */}
      {/* ===================================================================== */}
      <div className="space-y-5 lg:hidden">
        {/* 1. Primary Dark Obsidian Readiness Hero + Vertical Acid-Lime Track Notch */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative overflow-hidden rounded-[28px] bg-[#1f2224] p-5 text-white shadow-[0_16px_38px_rgba(24,27,30,0.22)]"
        >
          <div className="flex items-stretch justify-between gap-3">
            <div className="flex flex-1 flex-col justify-between space-y-5 pr-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-code text-[10px] uppercase tracking-[0.14em] text-[#d4fb35]">
                  VEX · {state.preferences.plan.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSection("jobs")}
                  className="cursor-pointer rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-[11px] font-medium text-white"
                >
                  + Target Role
                </button>
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-[11.5px] text-slate-300">
                  <span>Readiness Score</span>
                  <ScoreInfo scoreKey="readiness" dark />
                </p>
                <p className="mt-0.5 font-display text-[44px] font-light leading-none tracking-[-0.03em] text-white">
                  {readinessPct}%
                </p>
                <p className="mt-1.5 text-[11.5px] text-slate-300">
                  {verifiedSubmittedCount + userReportedCount} sent ·{" "}
                  {
                    state.applications.filter((a) => a.stage === "interviewing")
                      .length
                  }{" "}
                  interview
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate font-medium text-white">
                  {state.profile.name}
                </span>
                <span>
                  {completedDailyCount}/{state.dailySteps.length} today
                </span>
              </div>
            </div>

            {/* Signature Vertical Notched Lime Action Strip */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveSection("tracker")}
              aria-label="Open Applications Pipeline"
              className="flex w-[58px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[22px] bg-[#d4fb35] text-[#15181a] shadow-sm"
            >
              <ArrowRight className="h-5 w-5" />
              <span className="font-mono-code text-[9.5px] font-bold uppercase tracking-[0.06em]">
                Track
              </span>
            </motion.button>
          </div>
        </motion.section>

        {/* Compact Single-Strip Next Best Action */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={() => setActiveSection(nextBestAction.targetSection)}
          className="ios-card flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              nextBestAction.severity === "bad"
                ? "bg-[#c9332b]"
                : nextBestAction.severity === "warn"
                ? "bg-[#c46a0b]"
                : "bg-[#0e7c4d]"
            }`}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-mono-code text-[9.5px] uppercase tracking-[0.1em] text-[#6c7581]">
              Next best action
            </span>
            <span className="block truncate text-[13px] font-semibold text-[#181b1e]">
              {nextBestAction.title}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#1f2224] px-3.5 py-1.5 text-[11px] font-semibold text-[#d4fb35]">
            {nextBestAction.ctaLabel}
          </span>
        </motion.button>

        {/* 2. 4 Circular Quick Actions Row */}
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            {
              label: "Jobs",
              section: "jobs" as const,
              bg: "bg-white text-[#181b1e]",
              icon: Search,
            },
            {
              label: "Letters",
              section: "cover-letters" as const,
              bg: "bg-white text-[#181b1e]",
              icon: FileText,
            },
            {
              label: "Apply",
              section: "extension" as const,
              bg: "bg-white text-[#181b1e]",
              icon: Check,
            },
            {
              label: "MCP",
              section: "assistant" as const,
              bg: "bg-[#d4fb35] text-[#15181a]",
              icon: Sparkles,
            },
          ].map((qa, i) => {
            const Icon = qa.icon;
            return (
              <motion.button
                key={qa.label}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveSection(qa.section)}
                className="flex cursor-pointer flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_14px_rgba(140,160,185,0.18)] ${qa.bg}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11.5px] font-medium text-[#181b1e]">
                  {qa.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 3. Philosopher Council Circular Avatar Row */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[19px] font-medium text-[#181b1e]">
              Philosopher Council
            </h2>
            <button
              type="button"
              onClick={() =>
                setMentorIdx((i) => (i + 1) % COUNCIL_MENTORS.length)
              }
              className="cursor-pointer text-[12px] font-medium text-[#475569]"
            >
              Cycle ›
            </button>
          </div>
          <div className="no-scrollbar flex items-start gap-3.5 overflow-x-auto pb-0.5">
            {COUNCIL_MENTORS.slice(0, 6).map((id, i) => {
              const p = PHILOSOPHERS[id];
              const selected = mentorIdx === i;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMentorIdx(i)}
                  className="flex shrink-0 cursor-pointer flex-col items-center gap-1"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`h-12 w-12 rounded-full object-cover object-top transition-all ${
                      selected
                        ? "ring-2 ring-[#1f2224] ring-offset-2 ring-offset-[#eef3fa] scale-105"
                        : "border-2 border-white"
                    }`}
                  />
                  <span className="text-[10.5px] font-medium text-[#181b1e]">
                    {p.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="ios-card px-3.5 py-2.5 text-[12px] leading-snug text-[#475569] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeMentor.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                <span className="font-semibold text-[#181b1e]">
                  {activeMentor.name}:
                </span>{" "}
                &ldquo;{activeMentor.maxim}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>
        </section>

        {/* 4. Native iOS Segmented Horizon + 2-Card Split Bento Pair */}
        <section className="space-y-3">
          <div className="grid grid-cols-3 rounded-[14px] bg-white/80 p-1 border border-white">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHorizon(h.id)}
                className={`relative min-h-[34px] cursor-pointer rounded-[10px] text-[12px] font-semibold ${
                  horizon === h.id ? "text-[#d4fb35]" : "text-[#6c7581]"
                }`}
              >
                {horizon === h.id && (
                  <motion.span
                    layoutId="vex-mobile-horizon-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    className="absolute inset-0 rounded-[10px] bg-[#1f2224] shadow-xs"
                  />
                )}
                <span className="relative z-10">{h.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Left Acid-Lime Bento Card */}
            <div className="flex flex-col justify-between rounded-[24px] bg-[#d4fb35] p-4 text-left text-[#15181a] shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-[11.5px] font-semibold">
                  <span>Match Fit</span>
                  <ScoreInfo scoreKey="match" />
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSection("jobs")}
                  aria-label="Open Job Matches"
                  className="font-mono-code text-[10px] cursor-pointer hover:opacity-70"
                >
                  •••
                </button>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection("jobs")}
                className="text-left cursor-pointer"
              >
                <p className="mt-2 font-display text-[32px] font-normal leading-none">
                  {avgCompatibility}%
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-[#15181a]/80">
                  {savedJobs.length} shortlisted across boards
                </p>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < 6 ? "bg-[#15181a]" : "bg-[#15181a]/25"
                      }`}
                    />
                  ))}
                </div>
              </button>
            </div>

            {/* Right Dark Obsidian Bento Card */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection("resume")}
              className="flex cursor-pointer flex-col justify-between rounded-[24px] bg-[#1f2224] p-4 text-left text-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-slate-300">
                  CV Quality
                </span>
                <span className="font-mono-code text-[10px] text-[#d4fb35]">
                  •••
                </span>
              </div>
              <p className="mt-2 font-display text-[32px] font-normal leading-none">
                {cvQualityScore}
                <span className="ml-0.5 text-[15px] text-[#7898b0]">/100</span>
              </p>
              <svg
                viewBox="0 0 120 68"
                className="mt-2 h-14 w-full"
                aria-hidden="true"
              >
                <polygon
                  points="60,6 104,24 92,58 28,58 16,24"
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1"
                />
                <polygon
                  points="60,14 92,28 82,52 38,52 28,28"
                  fill="rgba(212,251,53,0.2)"
                  stroke="#d4fb35"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.button>
          </div>
        </section>

        {/* 5. Today's Activity Card */}
        <section className="ios-card p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[18px] font-medium text-[#181b1e]">
              Today&apos;s Activity
            </h3>
            <button
              type="button"
              onClick={() => setActiveSection("tracker")}
              className="text-xs font-medium text-[#2e67b2] cursor-pointer"
            >
              Tracker ›
            </button>
          </div>
          <div className="divide-y divide-slate-200/70">
            {state.dailySteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between gap-2.5 py-2.5"
              >
                <button
                  type="button"
                  onClick={() => toggleDailyStep(step.id)}
                  className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                >
                  <motion.span
                    animate={{ scale: step.done ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.22 }}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      step.done
                        ? "bg-[#d4fb35] border-[#1f2224] text-[#15181a]"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {step.done && <Check className="h-3 w-3" />}
                  </motion.span>
                  <span
                    className={`text-xs truncate transition-colors ${
                      step.done
                        ? "line-through text-[#949eab]"
                        : "text-[#181b1e] font-medium"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection(step.targetSection)}
                  className="shrink-0 rounded-full bg-[#e9eff6] px-2.5 py-1 text-[10.5px] font-semibold text-[#181b1e] cursor-pointer"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (>= 1024px) — Animated Reference Image Geometry          */}
      {/* ===================================================================== */}
      <div className="hidden lg:block space-y-5">
        <SectionHeader
          title="Command"
          actionLabel="Log Interview Invite"
          actionIcon={<Plus className="h-3.5 w-3.5" />}
          onAction={() => setInviteOpen(true)}
          extraRight={
            <>
              <VexButton
                variant="white"
                size="sm"
                onClick={() => setMathOpen(true)}
              >
                <Info className="h-3.5 w-3.5 text-[#7898b0]" />
                <span>How Fit Math Works</span>
              </VexButton>
              <VexButton
                variant="white"
                size="sm"
                onClick={() => setOffersOpen(true)}
              >
                <span>Compare Offers</span>
              </VexButton>
            </>
          }
        />

        {/* Top Asymmetric Bento Summary Row */}
        <div className="grid grid-cols-12 gap-4 xl:gap-5 items-stretch">
          {/* Left Wide Ice-Tint Bento Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="col-span-7 vex-bento-ice rounded-[28px] p-5 xl:p-6 flex flex-col justify-between gap-5"
          >
            {/* 3 KPI Figures Side-by-Side */}
            <div className="grid grid-cols-3 gap-3 xl:gap-6">
              <div>
                <p className="flex items-center gap-1 text-[11.5px] xl:text-xs text-[#6c7581]">
                  <span>Truth Risk</span>
                  <ScoreInfo scoreKey="cvQuality" />
                </p>
                <p className="mt-2 font-display text-[30px] xl:text-[36px] font-light leading-none tracking-[-0.03em] text-[#181b1e]">
                  <span className="text-[18px] xl:text-[22px] text-[#949eab] mr-1">
                    #
                  </span>
                  {unsupportedClaimCount}
                  <span className="text-[13px] xl:text-[14px] text-[#6c7581] ml-1.5 font-normal">
                    {truthLockActive ? "locked" : "clear"}
                  </span>
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1 text-[11.5px] xl:text-xs text-[#6c7581]">
                  <span>Avg Match Fit</span>
                  <ScoreInfo scoreKey="match" />
                </p>
                <p className="mt-2 font-display text-[30px] xl:text-[36px] font-light leading-none tracking-[-0.03em] text-[#181b1e]">
                  <span className="text-[18px] xl:text-[22px] text-[#949eab] mr-1">
                    %
                  </span>
                  {avgCompatibility}.0
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1 text-[11.5px] xl:text-xs text-[#6c7581]">
                  <span>Practised ({horizon.toUpperCase()})</span>
                  <ScoreInfo scoreKey="interview" />
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={horizon}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="mt-2 font-display text-[30px] xl:text-[36px] font-light leading-none tracking-[-0.03em] text-[#181b1e]"
                  >
                    {prepMinutes}
                    <span className="text-[13px] xl:text-[15px] text-[#6c7581] ml-1.5 font-normal">
                      min
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Aligned 4-Phase Timeline Track with Animated Striped Lime Bars */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-4 gap-2 text-[11px] font-medium text-[#6c7581]">
                <span>Discover</span>
                <span>Tailor CV</span>
                <span>Apply</span>
                <span>Interview</span>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center rounded-full bg-white/80 p-1">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="h-2 rounded-full vex-striped-lime w-full"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
                  style={{
                    transformOrigin: "left",
                    width: truthLockActive ? "70%" : "100%",
                  }}
                  className="h-2 rounded-full vex-striped-lime"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="h-2 rounded-full vex-striped-lime w-[78%]"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.65, delay: 0.24, ease: "easeOut" }}
                  style={{
                    transformOrigin: "left",
                    width: `${Math.min(
                      100,
                      Math.max(35, state.interviews.length * 32)
                    )}%`,
                  }}
                  className="h-2 rounded-full vex-striped-lime"
                />
              </div>

              {/* Centered Avatar Clusters */}
              <div className="grid grid-cols-4 gap-2 items-center pt-1">
                {[[0, 1, 2], [3, 4], [5, 6], [7]].map((group, gi) => (
                  <div key={gi} className="flex items-center -space-x-2">
                    {group.map((idx) => {
                      const p = PHILOSOPHERS[COUNCIL_MENTORS[idx]];
                      const selected = mentorIdx === idx;
                      return (
                        <motion.button
                          key={p.id}
                          type="button"
                          whileHover={{ scale: 1.14, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          title={`${p.name} — ${p.title}`}
                          onClick={() => setMentorIdx(idx)}
                          className={`h-7 w-7 xl:h-8 xl:w-8 rounded-full overflow-hidden border-2 cursor-pointer ${
                            selected
                              ? "border-[#1f2224] ring-2 ring-[#d4fb35] z-10"
                              : "border-white shadow-2xs"
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-full bg-white/75 px-3.5 py-1.5 text-[11px] text-[#475569]">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeMentor.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className="block truncate"
                    >
                      <strong className="text-[#181b1e]">
                        {activeMentor.name}:
                      </strong>{" "}
                      &ldquo;{activeMentor.maxim}&rdquo;
                    </motion.span>
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setMentorIdx((i) => (i + 1) % COUNCIL_MENTORS.length)
                  }
                  className="shrink-0 font-semibold text-[#181b1e] hover:underline cursor-pointer"
                >
                  Next ›
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right White Bento Card — Stepped Channel Cards + Dark CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              delay: 0.05,
            }}
            className="col-span-5 vex-bento-white rounded-[28px] p-5 xl:p-6 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[11.5px] xl:text-xs text-[#6c7581]">
                  <span>Available Readiness & Next Action</span>
                  <ScoreInfo scoreKey="readiness" />
                </p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span className="font-display text-[32px] xl:text-[38px] font-light leading-none tracking-[-0.03em] text-[#181b1e]">
                    {readinessPct}%
                  </span>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-[11px] font-medium ${
                      truthLockActive
                        ? "border-[#fecaca] bg-[#fef2f2] text-[#c9332b]"
                        : "border-slate-200 bg-[#f8fafc] text-[#475569]"
                    }`}
                  >
                    {truthLockActive ? "Truth Lock" : "Unlocked"}
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSprintOpen(true)}
                title="Open 24h Sprint Breakdown"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef3fa] text-[#181b1e] hover:bg-[#d4fb35] cursor-pointer"
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* 3 Vertical Rounded-Top Stepped Cards with Spring Lift */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-2.5 pt-1">
              <div className="grid grid-cols-3 gap-2 w-full xl:flex-1 items-end">
                <motion.button
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveSection("profile")}
                  className="h-[80px] xl:h-[84px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-2.5 xl:p-3 text-left hover:bg-[#e4ecf5] flex flex-col justify-between cursor-pointer min-w-0"
                >
                  <span className="font-mono-code text-[11px] font-semibold text-[#181b1e] whitespace-nowrap">
                    {readinessCompletedCount}/6
                  </span>
                  <span className="text-[11px] text-[#6c7581] truncate">
                    Profile
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveSection(nextBestAction.targetSection)}
                  className="h-[96px] xl:h-[104px] rounded-t-[20px] rounded-b-[14px] bg-[#d4fb35] p-2.5 xl:p-3 text-left shadow-sm hover:brightness-97 flex flex-col justify-between cursor-pointer min-w-0"
                >
                  <span className="font-mono-code text-[11px] font-bold text-[#15181a] whitespace-nowrap">
                    #{activeVariant.atsScore} ATS
                  </span>
                  <span className="text-[11px] font-semibold text-[#15181a] truncate">
                    {nextBestAction.ctaLabel}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveSection("tracker")}
                  className="h-[80px] xl:h-[84px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-2.5 xl:p-3 text-left hover:bg-[#e4ecf5] flex flex-col justify-between cursor-pointer min-w-0"
                >
                  <span className="font-mono-code text-[11px] font-semibold text-[#181b1e] whitespace-nowrap">
                    {verifiedSubmittedCount} Ver.
                  </span>
                  <span className="text-[11px] text-[#6c7581] truncate">
                    Submitted
                  </span>
                </motion.button>
              </div>

              <VexButton
                variant="dark"
                size="sm"
                onClick={() => setSprintOpen(true)}
                className="shrink-0 self-end xl:self-auto"
              >
                Sprint {sprintCompletedCount}/{sprintMilestones.length}
              </VexButton>
            </div>
          </motion.div>
        </div>

        {/* Middle Filter & Control Ribbon with Animated Horizon Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#181b1e] pr-1">
              <span>Active filters</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f2224] text-[10px] font-semibold text-white">
                {(filterTruth !== "all" ? 1 : 0) + (horizon !== "7d" ? 1 : 0) + 1}
              </span>
            </span>

            <div className="relative">
              <select
                value={filterTruth}
                onChange={(e) =>
                  setFilterTruth(e.target.value as typeof filterTruth)
                }
                aria-label="Filter by submission truth state"
                className="appearance-none rounded-full bg-white/90 border border-white pl-4 pr-9 py-2 text-xs font-medium text-[#475569] shadow-2xs focus:outline-none hover:bg-white cursor-pointer"
              >
                <option value="all">All truth states</option>
                <option value="prepared">Prepared (not submitted)</option>
                <option value="user_reported">User-reported submitted</option>
                <option value="verified">Verified submitted</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-white p-1 shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-[#6c7581] ml-2" />
              {(
                [
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "all", label: "All Time" },
                ] as const
              ).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHorizon(h.id)}
                  className={`relative rounded-full px-3 py-1 text-[11.5px] font-medium cursor-pointer ${
                    horizon === h.id
                      ? "text-[#d4fb35]"
                      : "text-[#475569] hover:text-[#181b1e]"
                  }`}
                >
                  {horizon === h.id && (
                    <motion.span
                      layoutId="vex-desktop-horizon-pill"
                      transition={{ type: "spring", stiffness: 520, damping: 38 }}
                      className="absolute inset-0 rounded-full bg-[#1f2224]"
                    />
                  )}
                  <span className="relative z-10">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-56 xl:w-68">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role..."
              className="w-full rounded-full bg-white/90 border border-white pl-4 pr-9 py-2 text-xs text-[#181b1e] placeholder:text-[#949eab] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#d4fb35]"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>
        </div>

        {/* Bottom Signature Dark Obsidian #222528 Studio */}
        <NotchedDarkStudio
          leftHeading="Truthful Pipeline"
          activeTab={studioTab}
          onTabChange={setStudioTab}
          tabs={[
            {
              id: "pipeline",
              label: "Pipeline",
              count: filteredApps.length,
            },
            {
              id: "steps",
              label: "Today Steps",
              count: `${completedDailyCount}/${state.dailySteps.length}`,
            },
            {
              id: "checks",
              label: "Is It Ready?",
              count: `${readinessCompletedCount}/6`,
            },
            { id: "glossary", label: "Glossary", count: 6 },
          ]}
          rightControls={
            <>
              <button
                type="button"
                onClick={() => setCoachOpen(true)}
                title="Open Philosopher Coach Guide"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#313538] text-slate-300 hover:text-white hover:bg-[#3e4347] cursor-pointer"
              >
                <Compass className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("tracker")}
                title="Open Full Tracker"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#313538] text-slate-300 hover:text-white hover:bg-[#3e4347] cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </>
          }
        >
          {studioTab === "pipeline" && (
            <div className="grid grid-cols-12 gap-4 xl:gap-5 items-stretch">
              {/* Left Master List (~40%) */}
              <div className="col-span-5 flex flex-col justify-between gap-2.5 min-w-0">
                <div className="space-y-2.5">
                  {filteredApps.map((app) => {
                    const selected = activeApp?.id === app.id;
                    const truth = TRUTH_BADGE[app.truthState];
                    return (
                      <motion.button
                        key={app.id}
                        type="button"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`relative w-full flex items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left cursor-pointer ${
                          selected
                            ? "bg-[#7898b0] text-white shadow-md"
                            : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                              selected
                                ? "bg-white text-[#181b1e]"
                                : "bg-[#3d4246] text-[#d4fb35]"
                            }`}
                          >
                            {app.monogram}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {app.company}
                            </p>
                            <p
                              className={`text-[10.5px] truncate ${
                                selected ? "text-white/80" : "text-slate-400"
                              }`}
                            >
                              {app.updatedAt}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-[10.5px] font-semibold shrink-0 transition-colors ${
                            selected
                              ? "bg-white text-[#181b1e]"
                              : "bg-[#3b3f44] text-slate-300"
                          }`}
                        >
                          {truth.label}
                        </span>

                        <span className="text-xs font-semibold tabular-nums shrink-0">
                          {app.salary.split("–")[0].trim()}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setStudioTab("steps")}
                  className="w-full rounded-[20px] bg-[#2c3033] hover:bg-[#34393d] px-4 py-3 flex items-center justify-between text-xs text-slate-300 cursor-pointer"
                >
                  <span>
                    Today&apos;s Measurable Steps ({completedDailyCount}/
                    {state.dailySteps.length})
                  </span>
                  <span className="text-[#d4fb35] font-medium">
                    View Steps →
                  </span>
                </button>
              </div>

              {/* Right Steel-Blue #7898b0 Detail Panel (~60%) with AnimatePresence Crossfade */}
              {activeApp && (
                <div className="col-span-7 rounded-[26px] bg-gradient-to-br from-[#7d9db5] to-[#7292aa] p-5 xl:p-6 text-white shadow-inner overflow-hidden min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeApp.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="h-full flex flex-col justify-between gap-5"
                    >
                      {/* Crisp Horizontal 3-Column Header */}
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-6 min-w-0">
                          <p className="text-[11px] text-white/75">
                            Application packet
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-display text-[17px] xl:text-[20px] font-normal tracking-tight text-white truncate">
                              {activeApp.role}
                            </span>
                            <span className="shrink-0 rounded-full bg-white/22 px-2.5 py-0.5 text-[10px] font-medium text-white">
                              {TRUTH_BADGE[activeApp.truthState].label}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-3 min-w-0">
                          <p className="text-[11px] text-white/75">Company</p>
                          <p className="mt-1 text-sm xl:text-base font-medium text-white truncate">
                            {activeApp.company.split(" ")[0]}
                          </p>
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-2 min-w-0">
                          <img
                            src={activeMentor.image}
                            alt={activeMentor.name}
                            className="h-9 w-9 shrink-0 rounded-full border-2 border-white/70 object-cover object-top"
                          />
                          <div className="text-left min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">
                              {activeMentor.name}
                            </p>
                            <p className="text-[10px] text-white/75 truncate">
                              {activeMentor.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 4 Sub-Cards Grid with Arrow Nudge */}
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 xl:gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (activeJobForApp)
                              setSelectedJobId(activeJobForApp.id);
                            setActiveSection("jobs");
                          }}
                          className="group rounded-[20px] bg-gradient-to-br from-white/20 to-white/10 border border-white/20 p-3.5 xl:p-4 text-left hover:from-white/28 hover:to-white/16 flex flex-col justify-between min-h-[96px] xl:min-h-[108px] cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-display text-xl xl:text-[22px] leading-tight font-normal">
                              {activeJobForApp
                                ? `${activeJobForApp.matchScore}%`
                                : "84%"}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                          <span className="text-[11px] text-white/90 truncate">
                            Role Fit Audit
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveSection("resume")}
                          className="group rounded-[20px] bg-gradient-to-br from-white/20 to-white/10 border border-white/20 p-3.5 xl:p-4 text-left hover:from-white/28 hover:to-white/16 flex flex-col justify-between min-h-[96px] xl:min-h-[108px] cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-display text-xl xl:text-[22px] leading-tight font-normal">
                              {activeApp.checklist.cvVerified
                                ? "Clear"
                                : "Locked"}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                          <span className="text-[11px] text-white/90 truncate">
                            CV Truth Lock
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveSection("cover-letters")}
                          className="group rounded-[20px] bg-gradient-to-br from-white/20 to-white/10 border border-white/20 p-3.5 xl:p-4 text-left hover:from-white/28 hover:to-white/16 flex flex-col justify-between min-h-[96px] xl:min-h-[108px] cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-display text-xl xl:text-[22px] leading-tight font-normal">
                              {activeApp.checklist.letterAttached
                                ? "Cited"
                                : "Draft"}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                          <span className="text-[11px] text-white/90 truncate">
                            Cicero Letter
                          </span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setInviteOpen(true)}
                          className="vex-hatched-slot rounded-[20px] border border-dashed border-white/40 p-3.5 xl:p-4 flex flex-col items-center justify-center gap-1.5 text-white/95 hover:bg-white/10 min-h-[96px] xl:min-h-[108px] cursor-pointer"
                        >
                          <Plus className="h-5 w-5" />
                          <span className="text-[10.5px] font-medium">
                            Log Invite
                          </span>
                        </motion.button>
                      </div>

                      {/* Notes & Evidence Bar */}
                      <div className="rounded-[18px] bg-black/15 px-4 py-2.5 text-xs text-white/90 flex items-center justify-between gap-3">
                        <span className="truncate">{activeApp.notes}</span>
                        {activeApp.confirmationHash && (
                          <span className="font-mono-code text-[10px] rounded-full bg-white/15 px-2.5 py-0.5 shrink-0">
                            Hash: {activeApp.confirmationHash}
                          </span>
                        )}
                      </div>

                      {/* Footer Summary Row + Lime Primary CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-x-5 xl:gap-x-7 gap-y-2">
                          <div>
                            <p className="text-[10.5px] text-white/75">Stage</p>
                            <p className="text-sm xl:text-base font-medium capitalize whitespace-nowrap">
                              {activeApp.stage}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10.5px] text-white/75">
                              Salary Band
                            </p>
                            <p className="text-sm xl:text-base font-medium whitespace-nowrap">
                              {activeApp.salary}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10.5px] text-white/75">
                              Source
                            </p>
                            <p className="text-sm xl:text-base font-medium whitespace-nowrap">
                              {activeApp.source}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          <button
                            type="button"
                            onClick={() => setActiveSection("resume")}
                            title="Review CV Diffs"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-white hover:bg-white/28 cursor-pointer"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveSection("interviews")}
                            title="Practice Interview"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-white hover:bg-white/28 cursor-pointer"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                          <VexButton
                            variant="lime"
                            onClick={() => setActiveSection("tracker")}
                          >
                            Open in Tracker
                          </VexButton>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {studioTab === "steps" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.dailySteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between gap-3 rounded-[22px] bg-[#2c3033] p-4"
                >
                  <button
                    type="button"
                    onClick={() => toggleDailyStep(step.id)}
                    className="flex items-center gap-3 text-left min-w-0 cursor-pointer"
                  >
                    <motion.span
                      animate={{ scale: step.done ? [1, 1.25, 1] : 1 }}
                      transition={{ duration: 0.22 }}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        step.done
                          ? "bg-[#d4fb35] border-[#d4fb35] text-[#15181a]"
                          : "border-slate-500"
                      }`}
                    >
                      {step.done && <Check className="h-3 w-3" />}
                    </motion.span>
                    <div className="min-w-0">
                      <p className="font-mono-code text-[9.5px] uppercase text-[#7898b0]">
                        {step.category} · {step.duration}
                      </p>
                      <p
                        className={`text-xs font-medium mt-0.5 truncate ${
                          step.done
                            ? "line-through text-slate-500"
                            : "text-white"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </button>
                  <VexButton
                    variant="lime"
                    size="sm"
                    onClick={() => setActiveSection(step.targetSection)}
                  >
                    Open
                  </VexButton>
                </div>
              ))}
            </div>
          )}

          {studioTab === "checks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {readinessChecks.map((check) => (
                <motion.button
                  key={check.id}
                  type="button"
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveSection(check.targetSection)}
                  className="flex items-center justify-between gap-3 rounded-[22px] bg-[#2c3033] hover:bg-[#34393d] p-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        check.ok ? "bg-[#d4fb35]" : "bg-[#f59e0b]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {check.question}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {check.statusText}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#d4fb35] shrink-0" />
                </motion.button>
              ))}
            </div>
          )}

          {studioTab === "glossary" && <ScoreGlossaryCard dark />}
        </NotchedDarkStudio>
      </div>

      {/* Log Interview Invite Modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Log Interview Invitation"
        subtitle="Record a recruiter invite to advance your pipeline stage and notify Hermes Alerts."
      >
        <form onSubmit={submitInvite} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Company
            </label>
            <input
              required
              value={inviteCompany}
              onChange={(e) => setInviteCompany(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Role
            </label>
            <input
              required
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Scheduled Date & Format
            </label>
            <input
              required
              value={inviteDate}
              onChange={(e) => setInviteDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Log Invitation
            </VexButton>
          </div>
        </form>
      </Modal>

      {/* Compare Offers Modal */}
      <Modal
        open={offersOpen}
        onClose={() => setOffersOpen(false)}
        title="Compare Target Offers & Pipeline Roles"
        subtitle="Side-by-side comparison across compensation bands, hybrid terms, and verified risks."
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OFFER_COMPARISONS.map((o) => (
            <div
              key={o.company}
              className="rounded-[22px] border border-slate-200 bg-white p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#181b1e]">
                  {o.company}
                </span>
                <Pill tone="lime">{o.fit} Fit</Pill>
              </div>
              <p className="text-[11px] text-[#6c7581]">{o.role}</p>
              <p className="font-display text-2xl font-normal text-[#181b1e]">
                {o.base}
              </p>
              <div className="text-[11px] text-[#475569] space-y-1 pt-2 border-t border-slate-100">
                <p>Bonus: {o.bonus}</p>
                <p>Mode: {o.pattern}</p>
                <p className="text-[#c9332b] font-medium">{o.risk}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* How Fit Math Works Modal */}
      <Modal
        open={mathOpen}
        onClose={() => setMathOpen(false)}
        title="How Vex Fit & Readiness Math Works"
        subtitle="Every percentage traces back to concrete evidence — never opaque black-box odds."
      >
        <ScoreGlossaryCard />
      </Modal>
    </div>
  );
}
