"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronDown,
  Clock,
  Layers,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import {
  EmptyState,
  NotchedDarkStudio,
  Pill,
  ScoreInfo,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { JobMatch, RequirementEvidenceStatus } from "@/types/vex";

const REQ_BADGE: Record<
  RequirementEvidenceStatus,
  { label: string; tone: "good" | "info" | "warn" | "bad" }
> = {
  has: { label: "Has evidence", tone: "good" },
  transferable: { label: "Transferable", tone: "info" },
  improve: { label: "Needs upgrade", tone: "warn" },
  missing: { label: "Missing", tone: "bad" },
};

export function JobsView() {
  const {
    state,
    selectedJobId,
    setSelectedJobId,
    triageJob,
    prepareApplicationFromJob,
    setActiveSection,
  } = useVexWorkspace();

  const [studioTab, setStudioTab] = useState<"all" | "saved" | "swipe">("all");
  const [arrangement, setArrangement] = useState<string>("All");
  const [experience, setExperience] = useState<string>("All");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [stamp, setStamp] = useState<"saved" | "passed" | null>(null);

  const filteredJobs = useMemo(() => {
    return state.jobs.filter((j) => {
      if (studioTab === "saved" && j.triage !== "saved") return false;
      if (arrangement !== "All" && j.arrangement !== arrangement) return false;
      if (experience !== "All" && j.experienceLevel !== experience) return false;
      if (minSalary > 0 && j.salaryMinGBP < minSalary) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hit =
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [state.jobs, studioTab, arrangement, experience, minSalary, query]);

  const activeJob: JobMatch | null =
    filteredJobs.find((j) => j.id === selectedJobId) ||
    filteredJobs[0] ||
    null;

  const swipeCandidates = useMemo(
    () => state.jobs.filter((j) => j.triage !== "passed"),
    [state.jobs]
  );
  const activeSwipeJob =
    swipeCandidates[swipeIdx % Math.max(1, swipeCandidates.length)] || null;

  const handleSwipe = (decision: "saved" | "passed") => {
    if (!activeSwipeJob) return;
    setStamp(decision);
    triageJob(activeSwipeJob.id, decision);
    setTimeout(() => {
      setStamp(null);
      setSwipeIdx((i) => i + 1);
    }, 280);
  };

  useEffect(() => {
    if (studioTab !== "swipe") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSwipe("saved");
      if (e.key === "ArrowLeft") handleSwipe("passed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const savedCount = state.jobs.filter((j) => j.triage === "saved").length;
  const undisclosedCount = state.jobs.filter((j) => !j.salaryDisclosed).length;
  const mergedCount = state.jobs.filter((j) => j.sourceCount > 1).length;
  const avgFit = Math.round(
    state.jobs.reduce((s, j) => s + j.matchScore, 0) /
      Math.max(1, state.jobs.length)
  );

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Jobs Discovery"
        subtitle="Calibrated fit audits with sentence-level evidence, merged duplicates, and salary transparency."
        actionLabel={
          studioTab === "swipe" ? "Matrix List" : "Pergament Swipe"
        }
        actionIcon={<Sparkles className="h-3.5 w-3.5" />}
        onAction={() =>
          setStudioTab((t) => (t === "swipe" ? "all" : "swipe"))
        }
      />

      <MobilePhilosopherPill
        philosopher="plato"
        guidance="Weigh every mandatory requirement against canonical proof before preparing an application packet."
        actionLabel={
          studioTab === "swipe" ? "Switch to Matrix" : "Open Swipe Deck"
        }
        onAction={() =>
          setStudioTab((t) => (t === "swipe" ? "all" : "swipe"))
        }
      />

      {/* Top Asymmetric Bento Row (matching Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Discovered Roles</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {state.jobs.length}
                <span className="text-sm text-[#6c7581] ml-1.5">live</span>
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-[#6c7581]">
                <span>Avg Fit Score</span>
                <ScoreInfo scoreKey="match" />
              </p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                <span className="text-xl text-[#949eab] mr-0.5">%</span>
                {avgFit}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Shortlisted</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {savedCount}
                <span className="text-sm text-[#6c7581] ml-1.5">saved</span>
              </p>
            </div>
          </div>

          {/* JobsTrustBar + Striped Progress */}
          <div className="space-y-2.5">
            <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5 flex gap-1.5">
              <div
                className="h-1.5 rounded-full vex-striped-lime"
                style={{ width: "44%" }}
              />
              <div
                className="h-1.5 rounded-full vex-striped-lime"
                style={{ width: "26%" }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="good">
                <Clock className="h-3 w-3" />
                <span>Synced 14m ago</span>
              </Pill>
              <Pill tone="info">
                <Layers className="h-3 w-3" />
                <span>{mergedCount} merged duplicates</span>
              </Pill>
              {undisclosedCount > 0 && (
                <Pill tone="warn">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{undisclosedCount} undisclosed salary</span>
                </Pill>
              )}
            </div>
          </div>
        </div>

        {/* Right Bento Card: Triage Channels */}
        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6c7581]">Plato Agora Triage</p>
              <p className="mt-1 font-display text-[30px] font-normal leading-none text-[#181b1e]">
                {state.jobs.filter((j) => j.matchScore >= 80).length} High-Fit
              </p>
            </div>
            <Pill tone="neutral">Human shortlist only</Pill>
          </div>

          <div className="flex items-end justify-between gap-2.5">
            <div className="grid grid-cols-3 gap-2 flex-1 items-end">
              <button
                type="button"
                onClick={() => setStudioTab("all")}
                className="h-[78px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-3 text-left flex flex-col justify-between cursor-pointer"
              >
                <span className="font-mono-code text-xs font-semibold">
                  {state.jobs.filter((j) => j.triage === "inbox").length}
                </span>
                <span className="text-[11px] text-[#6c7581]">Inbox</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab("saved")}
                className="h-[96px] rounded-t-[18px] rounded-b-[12px] bg-[#d4fb35] p-3 text-left flex flex-col justify-between shadow-sm cursor-pointer"
              >
                <span className="font-mono-code text-xs font-bold text-[#15181a]">
                  {savedCount}
                </span>
                <span className="text-[11px] font-semibold text-[#15181a]">
                  Shortlisted
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab("swipe")}
                className="h-[78px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-3 text-left flex flex-col justify-between cursor-pointer"
              >
                <span className="font-mono-code text-xs font-semibold">
                  {swipeCandidates.length}
                </span>
                <span className="text-[11px] text-[#6c7581]">Swipe</span>
              </button>
            </div>

            <VexButton
              variant="dark"
              size="sm"
              onClick={() =>
                setStudioTab((t) => (t === "swipe" ? "all" : "swipe"))
              }
            >
              {studioTab === "swipe" ? "Matrix" : "Swipe"}
            </VexButton>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="vex-snap-rail sm:flex sm:flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#181b1e] pr-1">
            <span>Active filters</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f2224] text-[10px] font-semibold text-white">
              {(arrangement !== "All" ? 1 : 0) +
                (experience !== "All" ? 1 : 0) +
                (minSalary > 0 ? 1 : 0)}
            </span>
          </span>

          <div className="relative">
            <select
              value={arrangement}
              onChange={(e) => setArrangement(e.target.value)}
              aria-label="Filter arrangement"
              className="appearance-none rounded-full bg-white/85 border border-white pl-3.5 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
            >
              <option value="All">All arrangements</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>

          <div className="relative">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              aria-label="Filter seniority"
              className="appearance-none rounded-full bg-white/85 border border-white pl-3.5 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
            >
              <option value="All">All seniority</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>

          <div className="relative">
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              aria-label="Filter minimum salary"
              className="appearance-none rounded-full bg-white/85 border border-white pl-3.5 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
            >
              <option value={0}>Any salary</option>
              <option value={65000}>£65k+ floor</option>
              <option value={72000}>£72k+ floor</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, roles, skills..."
            className="w-full rounded-full bg-white/85 border border-white pl-4 pr-9 py-2 text-xs text-[#181b1e] placeholder:text-[#949eab] outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
        </div>
      </div>

      {/* Dark Master-Detail Studio */}
      <NotchedDarkStudio
        leftHeading="Agora Role Matrix"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "all", label: "All Matches", count: state.jobs.length },
          { id: "saved", label: "Shortlisted", count: savedCount },
          { id: "swipe", label: "Swipe Deck", count: swipeCandidates.length },
        ]}
      >
        {studioTab === "swipe" ? (
          activeSwipeJob ? (
            <div className="max-w-xl mx-auto py-4 space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Use ← Pass · → Save (Amor Fati)</span>
                <span className="font-mono-code text-[#d4fb35]">
                  Folio {(swipeIdx % swipeCandidates.length) + 1} /{" "}
                  {swipeCandidates.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSwipeJob.id}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -12 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="relative rounded-[28px] bg-[#7898b0] p-6 text-white shadow-xl space-y-4"
                >
                  {stamp && (
                    <div
                      className={`absolute top-5 right-5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-md ${
                        stamp === "saved"
                          ? "bg-[#d4fb35] text-[#15181a]"
                          : "bg-[#1f2224] text-white"
                      }`}
                    >
                      {stamp === "saved" ? "Amor Fati · Saved" : "Ataraxia · Passed"}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-bold text-[#181b1e]">
                      {activeSwipeJob.monogram}
                    </span>
                    <div>
                      <p className="text-xs text-white/80">
                        {activeSwipeJob.company} · {activeSwipeJob.location}
                      </p>
                      <h3 className="font-display text-2xl font-normal">
                        {activeSwipeJob.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Pill tone="lime">{activeSwipeJob.matchScore}% Fit</Pill>
                    <Pill tone="glass">{activeSwipeJob.salaryLabel}</Pill>
                    <Pill tone="glass">{activeSwipeJob.arrangement}</Pill>
                  </div>

                  <div className="rounded-[20px] bg-white/15 p-4 text-xs leading-relaxed">
                    <span className="font-semibold text-[#d4fb35]">
                      Plato Oracle:
                    </span>{" "}
                    {activeSwipeJob.platoNote}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeSwipeJob.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-black/20 px-3 py-1 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-3">
                <VexButton
                  variant="ghostDark"
                  onClick={() => handleSwipe("passed")}
                >
                  <X className="h-4 w-4" />
                  <span>Pass (Ataraxia)</span>
                </VexButton>
                <VexButton
                  variant="lime"
                  onClick={() => handleSwipe("saved")}
                >
                  <Check className="h-4 w-4" />
                  <span>Save (Amor Fati)</span>
                </VexButton>
                <VexButton
                  variant="steel"
                  onClick={() => prepareApplicationFromJob(activeSwipeJob.id)}
                >
                  Prepare Packet
                </VexButton>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase className="h-5 w-5" />}
              title="Swipe deck cleared"
              description="All opportunities triaged."
            />
          )
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No roles match your current filters"
            description="Adjust arrangement, seniority, or search terms to inspect all discovered opportunities."
            action={
              <VexButton
                variant="lime"
                size="sm"
                onClick={() => {
                  setArrangement("All");
                  setExperience("All");
                  setMinSalary(0);
                  setQuery("");
                  setStudioTab("all");
                }}
              >
                Reset Filters
              </VexButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Master List */}
            <div className="lg:col-span-5 space-y-2.5">
              {filteredJobs.map((job) => {
                const selected = activeJob?.id === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full flex items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7898b0] text-white shadow-md"
                        : "bg-[#2c3033] text-slate-200 hover:bg-[#33383c]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          selected
                            ? "bg-white text-[#181b1e]"
                            : "bg-[#3d4246] text-[#d4fb35]"
                        }`}
                      >
                        {job.monogram}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {job.title}
                        </p>
                        <p
                          className={`text-[10.5px] truncate ${
                            selected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {job.company} · {job.arrangement}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10.5px] font-semibold shrink-0 ${
                        selected
                          ? "bg-white text-[#181b1e]"
                          : job.triage === "saved"
                          ? "bg-[#d4fb35] text-[#15181a]"
                          : "bg-[#3b3f44] text-slate-300"
                      }`}
                    >
                      {job.triage === "saved" ? "Saved" : job.postedAge}
                    </span>

                    <span className="text-xs font-semibold tabular-nums shrink-0">
                      {job.matchScore}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Steel-Blue Detail Panel: Honest Requirement Audit */}
            {activeJob && (
              <div className="lg:col-span-7 rounded-[26px] bg-gradient-to-br from-[#7d9db5] to-[#7292aa] p-5 sm:p-6 text-white overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeJob.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.17, ease: "easeOut" }}
                    className="h-full flex flex-col justify-between gap-5"
                  >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2">
                    <p className="text-[11px] text-white/75">
                      {activeJob.company} · {activeJob.location} (
                      {activeJob.arrangement})
                    </p>
                    <div className="mt-1 flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display text-2xl font-normal">
                        {activeJob.title}
                      </h3>
                      <span className="rounded-full bg-white text-[#181b1e] px-3 py-0.5 text-[11px] font-semibold">
                        {activeJob.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[11px] text-white/75">Compensation</p>
                    <p className="mt-1 text-base font-semibold">
                      {activeJob.salaryLabel}
                    </p>
                    <p className="text-[10.5px] text-white/80 mt-0.5">
                      Sources: {activeJob.sources.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Red Flags / Stale Warnings */}
                {(activeJob.redFlags.length > 0 || activeJob.staleWarning) && (
                  <div className="rounded-[18px] bg-[#c9332b]/85 px-4 py-2.5 text-xs flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      {activeJob.staleWarning && (
                        <p className="font-semibold">{activeJob.staleWarning}</p>
                      )}
                      <p>{activeJob.redFlags.join(" · ")}</p>
                    </div>
                  </div>
                )}

                {/* Sentence-by-sentence Requirement Evidence Mapping */}
                <div className="space-y-2">
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-white/80">
                    Honest Requirement Mapping vs Canonical Profile
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeJob.requirements.map((req) => {
                      const badge = REQ_BADGE[req.status];
                      return (
                        <div
                          key={req.id}
                          className="rounded-[18px] bg-white/15 border border-white/15 p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Pill tone={badge.tone}>{badge.label}</Pill>
                            <span className="font-mono-code text-[9.5px] text-white/75">
                              {req.mustHave ? "MUST-HAVE" : "NICE-TO-HAVE"}
                            </span>
                          </div>
                          <p className="text-xs font-medium leading-snug">
                            {req.text}
                          </p>
                          <p className="text-[11px] text-white/80">
                            {req.evidenceRef}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <VexButton
                      variant="steel"
                      size="sm"
                      onClick={() =>
                        triageJob(
                          activeJob.id,
                          activeJob.triage === "saved" ? "inbox" : "saved"
                        )
                      }
                    >
                      {activeJob.triage === "saved" ? "Shortlisted ✓" : "Shortlist"}
                    </VexButton>
                    <VexButton
                      variant="steel"
                      size="sm"
                      onClick={() => setActiveSection("resume")}
                    >
                      <span>Tailor CV</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </VexButton>
                  </div>

                  <VexButton
                    variant="lime"
                    onClick={() => prepareApplicationFromJob(activeJob.id)}
                  >
                    Prepare Application Packet
                  </VexButton>
                </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
