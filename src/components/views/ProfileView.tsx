"use client";

import React, { useState } from "react";
import {
  Award,
  Check,
  Copy,
  GitBranch,
  Plus,
  Star,
  UserCheck,
  X,
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
import type { CanonicalProfile } from "@/types/vex";

export function ProfileView() {
  const {
    state,
    profileChecksDone,
    updateProfile,
    addCredential,
    removeCredential,
    addProofCase,
    toggleRepoFeatured,
    toggleRoadmapMilestone,
    pushToast,
  } = useVexWorkspace();

  const [studioTab, setStudioTab] = useState<
    "overview" | "facts" | "portfolio" | "roadmap"
  >("overview");
  const [newCred, setNewCred] = useState("");
  const [nameInput, setNameInput] = useState(state.profile.name);
  const [roleInput, setRoleInput] = useState(state.profile.targetRole);
  const [headlineInput, setHeadlineInput] = useState(state.profile.headline);
  const [locationInput, setLocationInput] = useState(state.profile.location);
  const [noticeInput, setNoticeInput] = useState(state.profile.noticePeriod);
  const [salaryInput, setSalaryInput] = useState(state.profile.salaryRange);
  const [workPattern, setWorkPattern] = useState<CanonicalProfile["workPattern"]>(
    state.profile.workPattern
  );
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofTitle, setProofTitle] = useState("");
  const [proofMetric, setProofMetric] = useState("");
  const [proofSummary, setProofSummary] = useState("");

  const roadmapDoneCount = state.roadmap.filter((r) => r.completed).length;
  const roadmapPct = Math.round(
    (roadmapDoneCount / Math.max(1, state.roadmap.length)) * 100
  );

  const copyDossierLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://${state.profile.publicHandle}`
      );
    } catch {
      // ignore
    }
    pushToast(`Copied ${state.profile.publicHandle}`, "good");
  };

  const handleSaveFacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      targetRole: roleInput,
      headline: headlineInput,
      location: locationInput,
      noticePeriod: noticeInput,
      salaryRange: salaryInput,
      workPattern,
    });
  };

  const handleAddProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle.trim() || !proofMetric.trim()) return;
    addProofCase({
      title: proofTitle.trim(),
      metric: proofMetric.trim(),
      summary: proofSummary.trim() || "Verified candidate proof artifact.",
    });
    setProofTitle("");
    setProofMetric("");
    setProofSummary("");
    setProofModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Profile & Codex"
        subtitle="Write-once factual source of truth driving every CV, cover letter, fit audit, and extension fill."
        actionLabel="Copy Dossier Link"
        actionIcon={<Copy className="h-3.5 w-3.5" />}
        onAction={copyDossierLink}
        extraRight={
          <Pill tone={profileChecksDone === 6 ? "good" : "warn"}>
            {profileChecksDone}/6 Canonical Checks
          </Pill>
        }
      />

      <MobilePhilosopherPill
        philosopher="davinci"
        guidance="Update your target role, notice period, credentials, and proof artifacts once — every CV and form fill syncs from here."
        actionLabel="Copy Dossier Link"
        onAction={copyDossierLink}
      />

      {/* Top Asymmetric Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Ice Bento: 3 Canonical Metrics + Trajectory */}
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Profile Readiness</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                <span className="text-xl text-[#949eab] mr-0.5">%</span>
                {Math.round((profileChecksDone / 6) * 100)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">LinkedIn Sync</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                <span className="text-xl text-[#949eab] mr-0.5">%</span>
                {state.profile.linkedinAlignmentPct}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Proof Cases & Repos</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none text-[#181b1e]">
                {state.profile.proofCases.length + state.profile.repos.length}
                <span className="text-sm text-[#6c7581] ml-1.5">items</span>
              </p>
            </div>
          </div>

          {/* Trajectory SVG Chart + Striped Track */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#6c7581]">
              <span>Career Codex Trajectory (6 Months)</span>
              <span className="font-mono-code text-[#181b1e]">
                Fit 94% · Evidence 85% · Growth {roadmapPct}%
              </span>
            </div>
            <svg viewBox="0 0 420 74" className="w-full h-16">
              <line x1="0" y1="62" x2="420" y2="62" stroke="rgba(24,27,30,0.08)" />
              <line x1="0" y1="34" x2="420" y2="34" stroke="rgba(24,27,30,0.08)" strokeDasharray="3 3" />
              <polyline
                fill="none"
                stroke="#7898b0"
                strokeWidth="2.5"
                points="12,56 92,48 175,40 258,28 338,19 408,12"
              />
              <polyline
                fill="none"
                stroke="#1f2224"
                strokeWidth="2.5"
                points="12,62 92,58 175,46 258,36 338,29 408,22"
              />
              <circle cx="258" cy="28" r="4.5" fill="#d4fb35" stroke="#1f2224" strokeWidth="1.5" />
              <circle cx="408" cy="12" r="4.5" fill="#7898b0" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Right White Bento: Vitruvian Polymath Fit Map + Dossier Link */}
        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/davinci-profile-bust.jpg"
                alt={state.profile.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <p className="font-display text-lg font-medium text-[#181b1e]">
                  {state.profile.name}
                </p>
                <p className="text-xs text-[#6c7581]">
                  {state.profile.targetRole} · {state.profile.workPattern}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateProfile({ publicEnabled: !state.profile.publicEnabled })
              }
              className={`rounded-full px-3 py-1 text-[10.5px] font-semibold cursor-pointer ${
                state.profile.publicEnabled
                  ? "bg-[#d4fb35] text-[#15181a]"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {state.profile.publicEnabled ? "Public ON" : "Private"}
            </button>
          </div>

          {/* Vitruvian Domain Balance + Dossier URL */}
          <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[#eff3f8] p-3.5">
            <div className="space-y-1 text-xs">
              <p className="font-mono-code text-[10px] uppercase text-[#6c7581]">
                Vitruvian Domain Balance
              </p>
              <p className="font-medium text-[#181b1e]">
                Governance 86% · Release 84%
              </p>
              <p className="text-[11px] text-[#6c7581]">
                SQL Audit 72% · Briefs 91%
              </p>
            </div>
            <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0">
              <polygon
                points="40,8 72,40 40,72 8,40"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
              <polygon
                points="40,14 66,40 40,63 18,40"
                fill="rgba(120,152,176,0.35)"
                stroke="#1f2224"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-full bg-[#1f2224] px-4 py-2 text-xs text-white">
            <span className="font-mono-code text-[11px] truncate">
              {state.profile.publicHandle}
            </span>
            <button
              type="button"
              onClick={copyDossierLink}
              className="rounded-full bg-[#d4fb35] px-3 py-1 text-[10.5px] font-semibold text-[#15181a] shrink-0 cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Dark Master-Detail Codex Studio */}
      <NotchedDarkStudio
        leftHeading="Canonical Profile Codex"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "overview", label: "Overview", count: state.profile.skills.length },
          { id: "facts", label: "Baseline Facts", count: `${profileChecksDone}/6` },
          { id: "portfolio", label: "Proofs & Repos", count: state.profile.repos.length },
          { id: "roadmap", label: "Roadmap", count: `${roadmapDoneCount}/${state.roadmap.length}` },
        ]}
      >
        {studioTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Credentials & Skills */}
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-[24px] bg-[#2c3033] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Verified Credentials ({state.profile.credentials.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.profile.credentials.map((cred) => (
                    <span
                      key={cred}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#383d42] px-3 py-1 text-xs text-white"
                    >
                      <Award className="h-3 w-3 text-[#d4fb35]" />
                      <span>{cred}</span>
                      <button
                        type="button"
                        onClick={() => removeCredential(cred)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    value={newCred}
                    onChange={(e) => setNewCred(e.target.value)}
                    placeholder="Add credential or license..."
                    className="flex-1 rounded-full bg-[#222528] border border-white/10 px-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                  <VexButton
                    variant="lime"
                    size="sm"
                    onClick={() => {
                      addCredential(newCred);
                      setNewCred("");
                    }}
                  >
                    + Add
                  </VexButton>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#2c3033] p-5 space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Attested Skills & Evidence Tiers
                </h3>
                {state.profile.skills.map((sk) => (
                  <div
                    key={sk.id}
                    className="rounded-[18px] bg-[#222528] px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {sk.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {sk.evidence}
                      </p>
                    </div>
                    <Pill
                      tone={
                        sk.level === "Verified"
                          ? "lime"
                          : sk.level === "Demonstrated in Vex"
                          ? "good"
                          : "glass"
                      }
                    >
                      {sk.level}
                    </Pill>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Steel-Blue Proof Cases */}
            <div className="lg:col-span-6 rounded-[26px] bg-[#7898b0] p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/75">
                    Anchored Evidence
                  </p>
                  <h3 className="font-display text-2xl font-normal">
                    Proof Cases ({state.profile.proofCases.length})
                  </h3>
                </div>
                <VexButton
                  variant="lime"
                  size="sm"
                  onClick={() => setProofModalOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Proof</span>
                </VexButton>
              </div>

              <div className="space-y-3">
                {state.profile.proofCases.map((pc) => (
                  <div
                    key={pc.id}
                    className="rounded-[20px] bg-white/15 border border-white/15 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold">{pc.title}</h4>
                      <span className="rounded-full bg-[#d4fb35] px-2.5 py-0.5 text-[10px] font-bold text-[#15181a]">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#d4fb35]">
                      {pc.metric}
                    </p>
                    <p className="text-xs text-white/85 leading-relaxed">
                      {pc.summary}
                    </p>
                    {pc.repoUrl && (
                      <p className="font-mono-code text-[10.5px] text-white/75 pt-1">
                        {pc.repoUrl}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {studioTab === "facts" && (
          <form
            onSubmit={handleSaveFacts}
            className="rounded-[24px] bg-white text-[#181b1e] p-6 max-w-3xl space-y-4"
          >
            <h3 className="font-display text-xl font-medium">
              Edit Canonical Baseline Facts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Full Name
                </label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Target Role
                </label>
                <input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Headline
                </label>
                <input
                  value={headlineInput}
                  onChange={(e) => setHeadlineInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Location
                </label>
                <input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#1f2224]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Work Pattern
                </label>
                <select
                  value={workPattern}
                  onChange={(e) =>
                    setWorkPattern(
                      e.target.value as CanonicalProfile["workPattern"]
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Notice Period
                </label>
                <input
                  value={noticeInput}
                  onChange={(e) => setNoticeInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Target Salary Range
                </label>
                <input
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs outline-none"
                />
              </div>
            </div>
            <VexButton type="submit" variant="dark">
              Save Canonical Facts
            </VexButton>
          </form>
        )}

        {studioTab === "portfolio" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.profile.repos.map((repo) => (
              <div
                key={repo.id}
                className={`rounded-[22px] p-5 flex flex-col justify-between gap-3 border ${
                  repo.featured
                    ? "bg-[#7898b0] border-white/30 text-white"
                    : "bg-[#2c3033] border-white/10 text-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[#d4fb35]" />
                    <h4 className="font-mono-code text-sm font-semibold">
                      {repo.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRepoFeatured(repo.id)}
                    className={`rounded-full px-3 py-1 text-[10.5px] font-semibold cursor-pointer ${
                      repo.featured
                        ? "bg-[#d4fb35] text-[#15181a]"
                        : "bg-[#383d42] text-slate-300"
                    }`}
                  >
                    <Star className="inline h-3 w-3 mr-1" />
                    {repo.featured ? "Pinned" : "Pin"}
                  </button>
                </div>
                <p className="text-xs opacity-90">{repo.description}</p>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/15">
                  <div className="flex flex-wrap gap-1.5">
                    {repo.stack.map((st) => (
                      <span
                        key={st}
                        className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono-code">
                    ★ {repo.stars} · {repo.commits} commits
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {studioTab === "roadmap" && (
          <div className="space-y-3">
            <div className="rounded-[22px] bg-[#2c3033] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300">
                  4-Step Classical Wayfinder Progress
                </p>
                <p className="font-display text-2xl font-normal text-white">
                  {roadmapPct}% Complete
                </p>
              </div>
              <div className="w-48 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full vex-striped-lime"
                  style={{ width: `${roadmapPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.roadmap.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleRoadmapMilestone(m.id)}
                  className={`rounded-[22px] p-4 text-left flex items-start gap-3 transition-all cursor-pointer ${
                    m.completed
                      ? "bg-[#7898b0] text-white"
                      : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      m.completed
                        ? "bg-[#d4fb35] text-[#15181a]"
                        : "border border-slate-500"
                    }`}
                  >
                    {m.completed && <Check className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-code text-[10px] uppercase opacity-75">
                      {m.phase} · {m.dueLabel}
                    </p>
                    <p className="text-xs font-semibold mt-0.5">{m.title}</p>
                    <p className="text-[11px] opacity-85 mt-1">
                      {m.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </NotchedDarkStudio>

      <Modal
        open={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        title="Add Verified Proof Case"
        subtitle="Ground your CVs and Cicero cover letters with concrete outcomes."
      >
        <form onSubmit={handleAddProof} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Artifact Title
            </label>
            <input
              required
              value={proofTitle}
              onChange={(e) => setProofTitle(e.target.value)}
              placeholder="e.g. Support Escalation Triage Automation"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Verifiable Metric
            </label>
            <input
              required
              value={proofMetric}
              onChange={(e) => setProofMetric(e.target.value)}
              placeholder="e.g. Zero missed SLAs across 12 weekly cycles"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Summary
            </label>
            <textarea
              rows={3}
              value={proofSummary}
              onChange={(e) => setProofSummary(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setProofModalOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Save Proof
            </VexButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
