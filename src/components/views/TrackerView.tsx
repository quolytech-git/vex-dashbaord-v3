"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronDown,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Modal,
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { ApplicationTruthState, PipelineStage } from "@/types/vex";

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: "planned", label: "Planned" },
  { id: "applied", label: "Applied" },
  { id: "assessment", label: "Assessment" },
  { id: "interviewing", label: "Interview" },
  { id: "offer", label: "Offer" },
];

const TRUTH_STYLE: Record<
  ApplicationTruthState,
  { label: string; tone: "warn" | "info" | "good" }
> = {
  prepared: { label: "Prepared (not submitted)", tone: "warn" },
  user_reported: { label: "User-reported submitted", tone: "info" },
  verified: { label: "Verified submitted", tone: "good" },
};

export function TrackerView() {
  const {
    state,
    updateApplicationStage,
    markApplicationSubmitted,
    toggleApplicationChecklist,
    updateApplicationNotes,
    addManualApplication,
    pushToast,
  } = useVexWorkspace();

  const [studioTab, setStudioTab] = useState<"all" | "kanban" | "chronometer">(
    "all"
  );
  const [selectedAppId, setSelectedAppId] = useState(
    state.applications[0]?.id || ""
  );
  const [truthFilter, setTruthFilter] = useState<"all" | ApplicationTruthState>(
    "all"
  );
  const [stageFilter, setStageFilter] = useState<"all" | PipelineStage>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [emailInput, setEmailInput] = useState(
    "Subject: Interview Invitation — Northbridge Systems Product Operations Lead on Thursday 2:00 PM"
  );

  const filteredApps = useMemo(() => {
    return state.applications.filter((a) => {
      if (truthFilter !== "all" && a.truthState !== truthFilter) return false;
      if (stageFilter !== "all" && a.stage !== stageFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !a.company.toLowerCase().includes(q) &&
          !a.role.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [state.applications, truthFilter, stageFilter, query]);

  const activeApp =
    filteredApps.find((a) => a.id === selectedAppId) ||
    filteredApps[0] ||
    state.applications[0];

  const preparedCount = state.applications.filter(
    (a) => a.truthState === "prepared"
  ).length;
  const userReportedCount = state.applications.filter(
    (a) => a.truthState === "user_reported"
  ).length;
  const verifiedCount = state.applications.filter(
    (a) => a.truthState === "verified"
  ).length;

  const handleParseRecruiterEmail = () => {
    const lower = emailInput.toLowerCase();
    const matchedApp =
      state.applications.find((a) =>
        lower.includes(a.company.toLowerCase().split(" ")[0])
      ) || state.applications[0];
    if (!matchedApp) return;
    updateApplicationStage(matchedApp.id, "interviewing");
    pushToast(
      `Parsed recruiter email -> moved ${matchedApp.company} to Interviewing`,
      "good"
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim() || !newCompany.trim()) return;
    addManualApplication({
      role: newRole.trim(),
      company: newCompany.trim(),
      salary: newSalary.trim(),
      notes: newNotes.trim(),
    });
    setNewRole("");
    setNewCompany("");
    setNewSalary("");
    setNewNotes("");
    setAddOpen(false);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Applications Tracker"
        subtitle="Explicit 3-state honesty ledger: Prepared drafts never pretend to be submitted applications."
        actionLabel="Log Application"
        actionIcon={<Plus className="h-3.5 w-3.5" />}
        onAction={() => setAddOpen(true)}
      />

      <MobilePhilosopherPill
        philosopher="hermes"
        guidance="Only applications with your explicit confirmation or extension hash count as submitted. Draft packets stay clearly marked Prepared."
        actionLabel="+ Log Application"
        onAction={() => setAddOpen(true)}
      />

      {/* Top Asymmetric Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Prepared (Draft)</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {preparedCount}
                <span className="text-sm text-[#6c7581] ml-1.5">only</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">User-Reported</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {userReportedCount}
                <span className="text-sm text-[#6c7581] ml-1.5">sent</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Verified Hash</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {verifiedCount}
                <span className="text-sm text-[#6c7581] ml-1.5">proven</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5 flex gap-2">
              <div
                className="h-1.5 rounded-full vex-striped-lime"
                style={{ width: "35%" }}
              />
              <div
                className="h-1.5 rounded-full bg-[#7898b0]"
                style={{ width: "30%" }}
              />
            </div>
            <p className="text-[11.5px] text-[#475569]">
              <strong>3-State Honesty Invariant:</strong> Vex never submits on your behalf or inflates prepared packets as applied.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6c7581]">Pipeline Channels</p>
              <p className="mt-1 font-display text-[30px] font-normal leading-none text-[#181b1e]">
                {state.applications.length} Tracked
              </p>
            </div>
            <Pill tone="good">Human-in-the-loop</Pill>
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <button
              type="button"
              onClick={() => setTruthFilter("prepared")}
              className="h-[78px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-3 text-left flex flex-col justify-between cursor-pointer"
            >
              <span className="font-mono-code text-xs font-semibold">
                {preparedCount}
              </span>
              <span className="text-[11px] text-[#6c7581]">Prepared</span>
            </button>
            <button
              type="button"
              onClick={() => setTruthFilter("verified")}
              className="h-[96px] rounded-t-[18px] rounded-b-[12px] bg-[#d4fb35] p-3 text-left flex flex-col justify-between shadow-sm cursor-pointer"
            >
              <span className="font-mono-code text-xs font-bold text-[#15181a]">
                {verifiedCount}
              </span>
              <span className="text-[11px] font-semibold text-[#15181a]">
                Verified
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTruthFilter("all")}
              className="h-[78px] rounded-t-[18px] rounded-b-[12px] bg-[#eff3f8] p-3 text-left flex flex-col justify-between cursor-pointer"
            >
              <span className="font-mono-code text-xs font-semibold">
                {state.applications.length}
              </span>
              <span className="text-[11px] text-[#6c7581]">All Apps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="vex-snap-rail sm:flex sm:flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={truthFilter}
              onChange={(e) =>
                setTruthFilter(e.target.value as typeof truthFilter)
              }
              aria-label="Filter truth state"
              className="appearance-none rounded-full bg-white/85 border border-white pl-4 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
            >
              <option value="all">All truth states</option>
              <option value="prepared">Prepared (not submitted)</option>
              <option value="user_reported">User-reported submitted</option>
              <option value="verified">Verified submitted</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>

          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) =>
                setStageFilter(e.target.value as typeof stageFilter)
              }
              aria-label="Filter stage"
              className="appearance-none rounded-full bg-white/85 border border-white pl-4 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
            >
              <option value="all">All stages</option>
              {STAGES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracked roles..."
            className="w-full rounded-full bg-white/85 border border-white pl-4 pr-9 py-2 text-xs outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
        </div>
      </div>

      {/* Notched Dark Studio */}
      <NotchedDarkStudio
        leftHeading="3-State Applications Pipeline"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "all", label: "Master Detail", count: filteredApps.length },
          { id: "kanban", label: "Kanban Board" },
          { id: "chronometer", label: "Chronometer" },
        ]}
      >
        {studioTab === "all" && activeApp && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-5 space-y-2.5">
              {filteredApps.map((app) => {
                const selected = activeApp.id === app.id;
                const truth = TRUTH_STYLE[app.truthState];
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full flex items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7898b0] text-white"
                        : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
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
                        {app.monogram}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {app.role}
                        </p>
                        <p
                          className={`text-[10.5px] truncate ${
                            selected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {app.company} · {app.stage}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0 ${
                        selected
                          ? "bg-white text-[#181b1e]"
                          : app.truthState === "verified"
                          ? "bg-[#d4fb35] text-[#15181a]"
                          : "bg-[#3b3f44] text-slate-300"
                      }`}
                    >
                      {truth.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 rounded-[26px] bg-gradient-to-br from-[#7d9db5] to-[#7292aa] p-6 text-white overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.17, ease: "easeOut" }}
                  className="space-y-5"
                >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] text-white/75">
                    {activeApp.company} · {activeApp.salary}
                  </p>
                  <h3 className="font-display text-2xl font-normal">
                    {activeApp.role}
                  </h3>
                </div>
                <Pill tone={TRUTH_STYLE[activeApp.truthState].tone}>
                  {TRUTH_STYLE[activeApp.truthState].label}
                </Pill>
              </div>

              {/* Checklist Gates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    { key: "cvVerified", label: "CV Truth Verified" },
                    { key: "letterAttached", label: "Letter Cited" },
                    { key: "noticeChecked", label: "Notice Checked" },
                  ] as const
                ).map((item) => {
                  const done = activeApp.checklist[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        toggleApplicationChecklist(activeApp.id, item.key)
                      }
                      className={`rounded-[18px] p-3 text-left flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                        done
                          ? "bg-white/25 text-white"
                          : "bg-black/15 text-white/80"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          done
                            ? "bg-[#d4fb35] text-[#15181a]"
                            : "border border-white/40"
                        }`}
                      >
                        {done && <Check className="h-3 w-3" />}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notes */}
              <div>
                <label className="block font-mono-code text-[10px] uppercase text-white/75 mb-1">
                  Application Notes
                </label>
                <textarea
                  rows={2}
                  value={activeApp.notes}
                  onChange={(e) =>
                    updateApplicationNotes(activeApp.id, e.target.value)
                  }
                  className="w-full rounded-[18px] bg-white/15 border border-white/20 p-3 text-xs text-white placeholder:text-white/50 outline-none"
                />
              </div>

              {/* Stage + Explicit Submission State Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80">Stage:</span>
                  <select
                    value={activeApp.stage}
                    onChange={(e) =>
                      updateApplicationStage(
                        activeApp.id,
                        e.target.value as PipelineStage
                      )
                    }
                    className="rounded-full bg-[#1f2224] px-3.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {STAGES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                {activeApp.truthState === "prepared" ? (
                  <div className="flex flex-wrap gap-2">
                    <VexButton
                      variant="steel"
                      size="sm"
                      onClick={() =>
                        markApplicationSubmitted(activeApp.id, "user_reported")
                      }
                    >
                      Mark Self-Reported
                    </VexButton>
                    <VexButton
                      variant="lime"
                      size="sm"
                      onClick={() =>
                        markApplicationSubmitted(activeApp.id, "verified")
                      }
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify with Extension Hash</span>
                    </VexButton>
                  </div>
                ) : (
                  <span className="font-mono-code text-[11px] rounded-full bg-white/15 px-3 py-1">
                    {activeApp.confirmationHash
                      ? `Confirmed: ${activeApp.confirmationHash}`
                      : "Marked submitted by candidate"}
                  </span>
                )}
              </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {studioTab === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {STAGES.map((stage) => {
              const colApps = filteredApps.filter((a) => a.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="rounded-[22px] bg-[#2c3033] p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="font-mono-code text-[11px] font-semibold uppercase text-slate-300">
                      {stage.label}
                    </span>
                    <span className="rounded-full bg-[#383d42] px-2 py-0.5 text-[10px] font-bold text-[#d4fb35]">
                      {colApps.length}
                    </span>
                  </div>
                  {colApps.length === 0 ? (
                    <div className="rounded-[16px] border border-dashed border-white/15 p-4 text-center text-[11px] text-slate-500">
                      Empty
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setStudioTab("all");
                        }}
                        className="w-full rounded-[18px] bg-[#222528] hover:bg-[#7898b0] p-3 text-left transition-colors space-y-2 cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-white">
                          {app.role}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {app.company}
                        </p>
                        <Pill tone={TRUTH_STYLE[app.truthState].tone}>
                          {TRUTH_STYLE[app.truthState].label.split(" ")[0]}
                        </Pill>
                      </button>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}

        {studioTab === "chronometer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Monthly Submission Cadence Calendar */}
            <div className="lg:col-span-6 rounded-[24px] bg-[#2c3033] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  November Cadence Chronometer
                </h3>
                <Calendar className="h-4 w-4 text-[#d4fb35]" />
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[11px]">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i} className="text-slate-500 font-semibold">
                    {d}
                  </span>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const day = i + 1;
                  const active = [8, 12, 19, 25].includes(day);
                  const interview = day === 25;
                  return (
                    <div
                      key={day}
                      className={`h-8 rounded-xl flex items-center justify-center font-mono-code ${
                        interview
                          ? "bg-[#d4fb35] text-[#15181a] font-bold"
                          : active
                          ? "bg-[#7898b0] text-white font-semibold"
                          : "bg-[#222528] text-slate-400"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recruiter Email Parser */}
            <div className="lg:col-span-6 rounded-[24px] bg-[#7898b0] p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#d4fb35]" />
                <h3 className="text-sm font-semibold">
                  Recruiter Email Parser
                </h3>
              </div>
              <p className="text-xs text-white/85">
                Paste an interview invitation or status email to detect company & advance pipeline stage cleanly.
              </p>
              <textarea
                rows={4}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-[18px] bg-white/15 border border-white/25 p-3 text-xs text-white outline-none"
              />
              <VexButton variant="lime" onClick={handleParseRecruiterEmail}>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Parse Email & Update Stage</span>
              </VexButton>
            </div>
          </div>
        )}
      </NotchedDarkStudio>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Log Manual Application"
        subtitle="Creates a Prepared (not submitted) packet so your tracker stays 100% honest."
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            required
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Role Title"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <input
            required
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            placeholder="Company"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <input
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
            placeholder="Salary band (optional)"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <textarea
            rows={2}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Notes or deadline..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs outline-none"
          />
          <div className="flex justify-end gap-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Create Prepared Packet
            </VexButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
