"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Download,
  Edit3,
  FileText,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  ScoreInfo,
  SectionHeader,
  TruthLockWarningBanner,
  VexButton,
} from "@/components/kit/Kit";
import MobileManuscriptEditor from "@/components/mobile/MobileManuscriptEditor";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { CV_TEMPLATES } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export function ResumeView() {
  const {
    state,
    setActiveVariantId,
    resolveCvDiff,
    addGroundedCvSuggestion,
    selectCvTemplate,
    updateCvSummary,
    updateCvBullet,
    addCvBullet,
    removeCvBullet,
    truthLockActive,
    unsupportedClaimCount,
    pushToast,
  } = useVexWorkspace();

  const [studioTab, setStudioTab] = useState<
    "diffs" | "manuscript" | "templates"
  >("diffs");
  const [selectedDiffId, setSelectedDiffId] = useState<string>(
    state.cvDiffs[0]?.id || ""
  );
  const [editingDiffId, setEditingDiffId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [templateCategory, setTemplateCategory] = useState("All");
  const [templateSearch, setTemplateSearch] = useState("");

  const activeVariant =
    state.cvVariants.find((v) => v.id === state.activeVariantId) ||
    state.cvVariants[0];

  const activeTemplate =
    CV_TEMPLATES.find((t) => t.id === activeVariant.templateId) ||
    CV_TEMPLATES[0];

  const variantDiffs = useMemo(
    () => state.cvDiffs.filter((d) => d.variantId === activeVariant.id),
    [state.cvDiffs, activeVariant.id]
  );

  const selectedDiff =
    variantDiffs.find((d) => d.id === selectedDiffId) || variantDiffs[0];

  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter((t) => {
      if (templateCategory !== "All" && t.category !== templateCategory) {
        return false;
      }
      if (templateSearch.trim()) {
        const q = templateSearch.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [templateCategory, templateSearch]);

  const handleExport = (format: "PDF" | "DOCX") => {
    if (truthLockActive) {
      pushToast(
        `Export blocked: resolve ${unsupportedClaimCount} unsupported claim first`,
        "bad"
      );
      return;
    }
    if (format === "PDF") {
      window.print();
    } else {
      const content = [
        `${state.profile.name} — ${activeVariant.targetRole}`,
        `${state.profile.location} · ${state.profile.workPattern}`,
        "",
        "EXECUTIVE SUMMARY",
        activeVariant.summary,
        "",
        "EXPERIENCE & KEY IMPACT",
        ...activeVariant.bullets.map((b) => `- ${b.text}`),
      ].join("\n");
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeVariant.label
        .toLowerCase()
        .replace(/\s+/g, "-")}.doc`;
      a.click();
      URL.revokeObjectURL(url);
      pushToast(`Exported ${activeVariant.label} (.doc)`, "good");
    }
  };

  const skillsLine = state.profile.skills.map((s) => s.name).join(" · ");

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Resume Atelier"
        subtitle="Single-column ATS manuscript synced with line-by-line diffs, proof sources, and strict Truth Lock verification."
        actionLabel={truthLockActive ? "Export Locked" : "Export PDF"}
        actionIcon={
          truthLockActive ? (
            <ShieldAlert className="h-3.5 w-3.5 text-[#c9332b]" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )
        }
        onAction={() => handleExport("PDF")}
        extraRight={
          <VexButton
            variant="white"
            size="sm"
            disabled={truthLockActive}
            onClick={() => handleExport("DOCX")}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export DOCX</span>
          </VexButton>
        }
      />

      <MobilePhilosopherPill
        philosopher="davinci"
        guidance="Tap any line in the numbered manuscript below to edit, copy, accept tracked diffs, or resolve the Truth Lock claim."
      />

      <TruthLockWarningBanner
        unsupportedCount={unsupportedClaimCount}
        onReviewCv={() => setStudioTab("diffs")}
      />

      {/* Mobile Touch-First Numbered-Gutter Manuscript Editor (< 1024px) */}
      <MobileManuscriptEditor
        variant={activeVariant}
        variants={state.cvVariants}
        onSelectVariant={setActiveVariantId}
        candidateName={state.profile.name}
        candidateMeta={`${activeVariant.targetRole} · ${state.profile.workPattern} · ${state.profile.location}`}
        diffs={variantDiffs}
        onDecideDiff={resolveCvDiff}
        onUpdateSummary={updateCvSummary}
        onUpdateBullet={updateCvBullet}
        onAddBullet={addCvBullet}
        onRemoveBullet={removeCvBullet}
        onSendAi={addGroundedCvSuggestion}
        onExport={handleExport}
        truthLockActive={truthLockActive}
        unsupportedClaimCount={unsupportedClaimCount}
        skillsLine={skillsLine}
      />

      {/* Desktop Top Bento Summary + Studio */}
      <div className="hidden lg:block space-y-5">
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* Left Ice Bento */}
          <div className="col-span-7 vex-bento-ice rounded-[28px] p-6 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="flex items-center gap-1 text-xs text-[#6c7581]">
                  <span>ATS Readability</span>
                  <ScoreInfo scoreKey="ats" />
                </p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  <span className="text-xl text-[#949eab] mr-0.5">%</span>
                  {activeVariant.atsScore}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6c7581]">Pending Diffs</p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  {variantDiffs.filter((d) => d.status === "pending").length}
                  <span className="text-sm text-[#6c7581] ml-1.5">items</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6c7581]">Truth Guardrail</p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  {truthLockActive ? `${unsupportedClaimCount} Risk` : "Clear"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5 flex gap-2">
                <div
                  className="h-1.5 rounded-full vex-striped-lime"
                  style={{ width: `${activeVariant.atsScore * 0.6}%` }}
                />
                <div
                  className="h-1.5 rounded-full vex-striped-lime"
                  style={{ width: truthLockActive ? "12%" : "28%" }}
                />
              </div>
              <p className="text-[11.5px] text-[#475569]">
                <strong>AI Draft Rule:</strong> Suggestions never overwrite your CV until explicitly accepted; unverified numbers block export.
              </p>
            </div>
          </div>

          {/* Right White Bento: Variants */}
          <div className="col-span-5 vex-bento-white rounded-[28px] p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6c7581]">Active Layout</p>
                <p className="mt-1 font-display text-2xl font-normal text-[#181b1e]">
                  {activeTemplate.name}
                </p>
              </div>
              <Pill tone="good">{activeTemplate.columns}</Pill>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end">
              {state.cvVariants.map((v) => {
                const active = v.id === activeVariant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVariantId(v.id)}
                    className={`rounded-t-[18px] rounded-b-[12px] p-3 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      active
                        ? "h-[96px] bg-[#d4fb35] text-[#15181a] shadow-sm"
                        : "h-[78px] bg-[#eff3f8] text-[#181b1e] hover:bg-[#e5ecf5]"
                    }`}
                  >
                    <span className="font-mono-code text-[10.5px] font-bold">
                      ATS {v.atsScore}%
                    </span>
                    <span className="text-[11px] font-medium leading-tight truncate">
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Ribbon: Variant + Da Vinci Scribe Input */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#181b1e]">
              Da Vinci Scribe
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && aiPrompt.trim()) {
                    addGroundedCvSuggestion(aiPrompt);
                    setAiPrompt("");
                  }
                }}
                placeholder="Ask AI to sharpen summary or cite proof..."
                className="w-[350px] rounded-full bg-white/85 border border-white pl-4 pr-20 py-2 text-xs text-[#181b1e] placeholder:text-[#949eab] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!aiPrompt.trim()) return;
                  addGroundedCvSuggestion(aiPrompt);
                  setAiPrompt("");
                }}
                className="absolute right-1.5 rounded-full bg-[#1f2224] px-3 py-1 text-[10.5px] font-semibold text-[#d4fb35] cursor-pointer"
              >
                Draft
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={activeVariant.templateId}
                onChange={(e) => selectCvTemplate(e.target.value)}
                aria-label="Choose ATS template"
                className="appearance-none rounded-full bg-white/85 border border-white pl-4 pr-8 py-2 text-xs text-[#475569] outline-none cursor-pointer"
              >
                {CV_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    Template: {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
            </div>
          </div>
        </div>

        {/* Dark Obsidian Master-Detail Resume Studio */}
        <NotchedDarkStudio
          leftHeading="Da Vinci Atelier"
          activeTab={studioTab}
          onTabChange={setStudioTab}
          tabs={[
            {
              id: "diffs",
              label: "Tracked Diffs",
              count: variantDiffs.filter((d) => d.status === "pending").length,
            },
            { id: "manuscript", label: "Live A4 Sheet" },
            { id: "templates", label: "ATS Templates", count: 8 },
          ]}
        >
          {studioTab === "diffs" && (
            <div className="grid grid-cols-12 gap-5 items-stretch">
              {/* Left List of Tracked Diffs + Quick A4 Summary */}
              <div className="col-span-5 space-y-2.5">
                {variantDiffs.length === 0 ? (
                  <div className="rounded-[22px] bg-[#2c3033] p-5 text-xs text-slate-300">
                    No tracked revisions pending for {activeVariant.label}. Use Da Vinci Scribe above to propose grounded refinements.
                  </div>
                ) : (
                  variantDiffs.map((d) => {
                    const selected = selectedDiff?.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDiffId(d.id)}
                        className={`w-full flex items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left transition-all cursor-pointer ${
                          selected
                            ? "bg-[#7898b0] text-white shadow-md"
                            : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {d.section}
                          </p>
                          <p
                            className={`text-[10.5px] truncate ${
                              selected ? "text-white/80" : "text-slate-400"
                            }`}
                          >
                            {d.proposed}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[10.5px] font-semibold shrink-0 ${
                            d.hasUnsupportedClaim && d.status === "pending"
                              ? "bg-[#c9332b] text-white"
                              : selected
                              ? "bg-white text-[#181b1e]"
                              : d.status === "accepted"
                              ? "bg-[#d4fb35] text-[#15181a]"
                              : "bg-[#3b3f44] text-slate-300"
                          }`}
                        >
                          {d.hasUnsupportedClaim && d.status === "pending"
                            ? "Risk"
                            : d.status}
                        </span>
                      </button>
                    );
                  })
                )}

                {/* Quick Scribe Prompts */}
                <div className="pt-2 space-y-2">
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-slate-400 px-1">
                    Quick Scribe Instructions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Cite 14 releases proof",
                      "Align summary for Product Ops",
                      "Add WCAG AA metric",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => addGroundedCvSuggestion(p)}
                        className="rounded-full bg-[#2c3033] hover:bg-[#383d41] px-3 py-1.5 text-[11px] text-slate-200 cursor-pointer"
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Steel-Blue Detail Card */}
              {selectedDiff && (
                <div className="col-span-7 rounded-[26px] bg-gradient-to-br from-[#7d9db5] to-[#7292aa] p-6 text-white overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedDiff.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.17, ease: "easeOut" }}
                      className="h-full flex flex-col justify-between gap-5"
                    >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-white/75">
                        Tracked Revision · {activeVariant.label}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-normal">
                        {selectedDiff.section}
                      </h3>
                    </div>
                    <Pill
                      tone={
                        selectedDiff.hasUnsupportedClaim &&
                        selectedDiff.status === "pending"
                          ? "bad"
                          : "glass"
                      }
                    >
                      {selectedDiff.hasUnsupportedClaim &&
                      selectedDiff.status === "pending"
                        ? "Truth Lock Blocker"
                        : selectedDiff.status.toUpperCase()}
                    </Pill>
                  </div>

                  {/* Original vs Proposed Frosted Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-[20px] bg-black/15 p-4 space-y-1">
                      <span className="font-mono-code text-[10px] uppercase text-white/75">
                        Original Baseline Line
                      </span>
                      <p className="text-xs text-white/90 line-through">
                        {selectedDiff.original}
                      </p>
                    </div>

                    <div className="rounded-[20px] bg-white/18 border border-white/20 p-4 space-y-2">
                      <span className="font-mono-code text-[10px] uppercase text-[#d4fb35]">
                        Proposed AI Tailoring
                      </span>
                      {editingDiffId === selectedDiff.id ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl bg-white p-3 text-xs text-[#181b1e] outline-none"
                        />
                      ) : (
                        <p className="text-sm font-medium leading-relaxed text-white">
                          {selectedDiff.proposed}
                        </p>
                      )}
                      <p className="text-[11px] text-white/80">
                        Source: {selectedDiff.sourceNote}
                      </p>
                    </div>

                    {selectedDiff.hasUnsupportedClaim &&
                      selectedDiff.status === "pending" && (
                        <div className="rounded-[18px] bg-[#c9332b] px-4 py-3 text-xs flex items-start gap-2">
                          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{selectedDiff.unsupportedReason}</span>
                        </div>
                      )}
                  </div>

                  {/* Footer Actions */}
                  {selectedDiff.status === "pending" ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        {editingDiffId === selectedDiff.id ? (
                          <VexButton
                            variant="lime"
                            onClick={() => {
                              resolveCvDiff(
                                selectedDiff.id,
                                "accepted",
                                editText
                              );
                              setEditingDiffId(null);
                            }}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Verify & Accept Edit</span>
                          </VexButton>
                        ) : (
                          <VexButton
                            variant="steel"
                            onClick={() => {
                              setEditingDiffId(selectedDiff.id);
                              setEditText(selectedDiff.original);
                            }}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Supply Real Metric</span>
                          </VexButton>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <VexButton
                          variant="danger"
                          onClick={() =>
                            resolveCvDiff(selectedDiff.id, "rejected")
                          }
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject Claim</span>
                        </VexButton>
                        {!selectedDiff.hasUnsupportedClaim && (
                          <VexButton
                            variant="lime"
                            onClick={() =>
                              resolveCvDiff(selectedDiff.id, "accepted")
                            }
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept Revision</span>
                          </VexButton>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                      <span>
                        Decision locked cleanly ({selectedDiff.status}).
                      </span>
                      <VexButton
                        variant="lime"
                        size="sm"
                        onClick={() => setStudioTab("manuscript")}
                      >
                        Preview A4 Sheet
                      </VexButton>
                    </div>
                  )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {studioTab === "manuscript" && (
            <div className="rounded-[24px] bg-white text-[#181b1e] p-8 max-w-3xl mx-auto shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-mono-code text-[10px] text-[#6c7581]">
                <span>0&quot; · · · 2&quot; · · · 4&quot; · · · 6&quot; · · · 8.27&quot; (A4)</span>
                <span>
                  {activeTemplate.name} · {activeTemplate.columns}
                </span>
              </div>

              <header
                className="border-b-2 pb-4"
                style={{ borderColor: activeTemplate.accentColor }}
              >
                <h2 className="font-display text-3xl font-normal tracking-tight">
                  {state.profile.name}
                </h2>
                <p className="font-mono-code text-xs uppercase tracking-wider text-[#6c7581] mt-1">
                  {activeVariant.targetRole} · {state.profile.workPattern} ·{" "}
                  {state.profile.location}
                </p>
              </header>

              <section className="space-y-2">
                <h3 className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#6c7581]">
                  Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-[#181b1e]">
                  {activeVariant.summary}
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#6c7581]">
                  Experience & Key Impact
                </h3>
                <ul className="space-y-2.5">
                  {activeVariant.bullets.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-start justify-between gap-3 text-sm leading-relaxed"
                    >
                      <span>• {b.text}</span>
                      <span className="font-mono-code text-[10px] text-[#0e7c4d] shrink-0 mt-1">
                        {b.source}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#6c7581]">
                  Attested Skills
                </h3>
                <p className="text-xs text-[#475569]">{skillsLine}</p>
              </section>
            </div>
          )}

          {studioTab === "templates" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {["All", "Executive", "Technical", "Minimal", "Operations"].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTemplateCategory(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                          templateCategory === cat
                            ? "bg-[#d4fb35] text-[#15181a]"
                            : "bg-[#2c3033] text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
                <div className="relative w-60">
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Filter 8 ATS templates..."
                    className="w-full rounded-full bg-[#2c3033] px-4 py-1.5 text-xs text-white placeholder:text-slate-400 outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {filteredTemplates.map((tpl) => {
                  const chosen = activeVariant.templateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className={`rounded-[22px] p-4 flex flex-col justify-between gap-3 border transition-all ${
                        chosen
                          ? "bg-[#7898b0] border-white/40 text-white"
                          : "bg-[#2c3033] border-white/10 text-slate-200"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-code uppercase opacity-75">
                            {tpl.category}
                          </span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
                            {tpl.columns}
                          </span>
                        </div>
                        <h4 className="font-display text-lg font-normal">
                          {tpl.name}
                        </h4>
                        {/* Live mini preview using candidate's real facts */}
                        <div className="rounded-xl bg-white text-[#181b1e] p-2.5 text-[9.5px] space-y-1">
                          <p
                            className="font-bold border-b pb-0.5"
                            style={{ borderColor: tpl.accentColor }}
                          >
                            {state.profile.name}
                          </p>
                          <p className="text-[#6c7581] truncate">
                            {activeVariant.targetRole}
                          </p>
                          <p className="line-clamp-2 text-[8.5px] text-slate-600">
                            {activeVariant.summary}
                          </p>
                        </div>
                        <p className="text-[11px] opacity-85">
                          {tpl.description}
                        </p>
                      </div>

                      <VexButton
                        variant={chosen ? "lime" : "steel"}
                        size="sm"
                        onClick={() => selectCvTemplate(tpl.id)}
                      >
                        {chosen ? "Active Layout ✓" : "Use Template"}
                      </VexButton>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </NotchedDarkStudio>
      </div>
    </div>
  );
}
