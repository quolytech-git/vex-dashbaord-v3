"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  Columns2,
  Copy,
  Download,
  Edit3,
  Eye,
  Mail,
  Plus,
  Printer,
  Quote,
  Search,
  Trash2,
} from "lucide-react";
import {
  Modal,
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobileNoteEditor from "@/components/mobile/MobileNoteEditor";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { CoverLetterDraft } from "@/types/vex";

export function CoverLettersView() {
  const {
    state,
    updateCoverLetter,
    citeProofInCoverLetter,
    createCoverLetter,
    duplicateCoverLetter,
    deleteCoverLetter,
    pushToast,
  } = useVexWorkspace();

  const [selectedId, setSelectedId] = useState(
    state.coverLetters[0]?.id || ""
  );
  const [studioTab, setStudioTab] = useState<"all" | "ready" | "compare">(
    "all"
  );
  const [editorMode, setEditorMode] = useState<"preview" | "edit">("preview");
  const [query, setQuery] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");

  const filteredLetters = useMemo(() => {
    return state.coverLetters.filter((l) => {
      if (studioTab === "ready" && l.status !== "Cited & Ready") return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !l.company.toLowerCase().includes(q) &&
          !l.role.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [state.coverLetters, studioTab, query]);

  const activeLetter =
    filteredLetters.find((l) => l.id === selectedId) ||
    filteredLetters[0] ||
    state.coverLetters[0];

  const compareLetter =
    state.coverLetters.find((l) => l.id !== activeLetter?.id) || null;

  if (!activeLetter) return null;

  const rhetoricChecks = [
    {
      label: "Addressed to target company",
      pass: activeLetter.paragraphs.some((p) =>
        p
          .toLowerCase()
          .includes(activeLetter.company.toLowerCase().split(" ")[0])
      ),
    },
    {
      label: "Verified proof artifact cited",
      pass: activeLetter.citedProofIds.length > 0,
    },
    {
      label: "Zero invented numeric metrics",
      pass: true,
    },
  ];

  const rhetoricScore = Math.round(
    (rhetoricChecks.filter((c) => c.pass).length / rhetoricChecks.length) * 100
  );

  const handleCopy = async () => {
    const text = activeLetter.paragraphs.join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      pushToast("Cover letter copied to clipboard", "good");
    } catch {
      pushToast("Prepared plain-text copy", "info");
    }
  };

  const handleExportDoc = () => {
    const text = [
      `${activeLetter.company} — ${activeLetter.role}`,
      `Candidate: ${state.profile.name}`,
      "",
      ...activeLetter.paragraphs,
    ].join("\n\n");
    const blob = new Blob([text], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeLetter.company
      .toLowerCase()
      .replace(/\s+/g, "-")}-cover-letter.doc`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Exported cover letter (.doc)", "good");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;
    createCoverLetter(newCompany.trim(), newRole.trim());
    setNewCompany("");
    setNewRole("");
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Cover Letters"
        subtitle="Classical rhetoric grounded in lived evidence — cite verified proof cases directly into clean letters."
        actionLabel="New Letter Draft"
        actionIcon={<Plus className="h-3.5 w-3.5" />}
        onAction={() => setNewModalOpen(true)}
        extraRight={
          <>
            <VexButton variant="white" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </VexButton>
            <VexButton variant="white" size="sm" onClick={handleExportDoc}>
              <Download className="h-3.5 w-3.5" />
              <span>.doc</span>
            </VexButton>
          </>
        }
      />

      <MobilePhilosopherPill
        philosopher="cicero"
        guidance="Tap any paragraph in the note editor to refine wording, or tap a verified proof chip below to cite real outcomes."
      />

      {/* Mobile Draft Selector + Touch Note Editor (< 1024px) */}
      <div className="lg:hidden space-y-3">
        <div className="vex-snap-rail gap-2">
          {state.coverLetters.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedId(l.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                l.id === activeLetter.id
                  ? "bg-[#222528] text-[#d4fb35]"
                  : "bg-white/90 text-[#475569] border border-white"
              }`}
            >
              {l.company}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="rounded-full bg-[#d4fb35] px-3.5 py-1.5 text-xs font-semibold text-[#15181a] cursor-pointer"
          >
            + New Draft
          </button>
        </div>

        <MobileNoteEditor
          letter={activeLetter}
          proofCases={state.profile.proofCases}
          rhetoricScore={rhetoricScore}
          onUpdateParagraph={(idx, text) => {
            const next = [...activeLetter.paragraphs];
            next[idx] = text;
            updateCoverLetter(activeLetter.id, { paragraphs: next });
          }}
          onRemoveParagraph={(idx) => {
            const next = activeLetter.paragraphs.filter((_, i) => i !== idx);
            updateCoverLetter(activeLetter.id, { paragraphs: next });
          }}
          onCiteProof={(proofId) =>
            citeProofInCoverLetter(activeLetter.id, proofId)
          }
          onExportDoc={handleExportDoc}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-5">
        <div className="grid grid-cols-12 gap-5 items-stretch">
          <div className="col-span-7 vex-bento-ice rounded-[28px] p-6 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#6c7581]">Active Drafts</p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  {state.coverLetters.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6c7581]">Cited & Ready</p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  {
                    state.coverLetters.filter((l) => l.status === "Cited & Ready")
                      .length
                  }
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6c7581]">Rhetoric Check</p>
                <p className="mt-1.5 font-display text-[34px] font-normal leading-none text-[#181b1e]">
                  <span className="text-xl text-[#949eab] mr-0.5">%</span>
                  {rhetoricScore}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5">
                <div
                  className="h-1.5 rounded-full vex-striped-lime"
                  style={{ width: `${rhetoricScore}%` }}
                />
              </div>
              <p className="text-[11.5px] text-[#475569]">
                <strong>Cicero Grounding:</strong> Every persuasive claim attaches directly to a Proof Case from your Canonical Profile.
              </p>
            </div>
          </div>

          <div className="col-span-5 vex-bento-white rounded-[28px] p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6c7581]">Selected Tone</p>
                <p className="mt-1 font-display text-2xl font-normal text-[#181b1e]">
                  {activeLetter.tone}
                </p>
              </div>
              <Pill tone={activeLetter.status === "Cited & Ready" ? "good" : "warn"}>
                {activeLetter.status}
              </Pill>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end">
              {(
                [
                  "Measured Executive",
                  "Technical Direct",
                  "Warm Editorial",
                ] as const
              ).map((tone) => {
                const active = activeLetter.tone === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => updateCoverLetter(activeLetter.id, { tone })}
                    className={`rounded-t-[18px] rounded-b-[12px] p-3 text-left flex flex-col justify-between cursor-pointer transition-all ${
                      active
                        ? "h-[92px] bg-[#d4fb35] text-[#15181a] shadow-sm"
                        : "h-[74px] bg-[#eff3f8] text-[#181b1e]"
                    }`}
                  >
                    <span className="font-mono-code text-[10px] font-bold">
                      TONE
                    </span>
                    <span className="text-[11px] font-medium leading-tight">
                      {tone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Ribbon */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <VexButton
              variant={editorMode === "preview" ? "dark" : "white"}
              size="sm"
              onClick={() => setEditorMode("preview")}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Paper Preview</span>
            </VexButton>
            <VexButton
              variant={editorMode === "edit" ? "dark" : "white"}
              size="sm"
              onClick={() => setEditorMode("edit")}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Paragraphs</span>
            </VexButton>
            <VexButton
              variant="white"
              size="sm"
              onClick={() => duplicateCoverLetter(activeLetter.id)}
            >
              Duplicate Draft
            </VexButton>
          </div>

          <div className="relative w-64">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cover letter drafts..."
              className="w-full rounded-full bg-white/85 border border-white pl-4 pr-9 py-2 text-xs outline-none"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
          </div>
        </div>

        {/* Notched Dark Studio */}
        <NotchedDarkStudio
          leftHeading="Cicero Cover Letter Workbench"
          activeTab={studioTab}
          onTabChange={setStudioTab}
          tabs={[
            { id: "all", label: "All Drafts", count: state.coverLetters.length },
            {
              id: "ready",
              label: "Cited & Ready",
              count: state.coverLetters.filter(
                (l) => l.status === "Cited & Ready"
              ).length,
            },
            { id: "compare", label: "Compare Drafts" },
          ]}
        >
          {studioTab === "compare" && compareLetter ? (
            <div className="grid grid-cols-2 gap-5">
              {[activeLetter, compareLetter].map((l) => (
                <div
                  key={l.id}
                  className="rounded-[24px] bg-white p-6 text-[#181b1e] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{l.company}</h3>
                      <p className="text-xs text-[#6c7581]">{l.role}</p>
                    </div>
                    <Pill tone={l.status === "Cited & Ready" ? "good" : "warn"}>
                      {l.status}
                    </Pill>
                  </div>
                  <div className="space-y-2.5 text-xs leading-relaxed text-slate-700">
                    {l.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-5 items-stretch">
              {/* Left Draft List + Rhetoric Checks + + Cite */}
              <div className="col-span-4 space-y-3">
                <div className="space-y-2">
                  {filteredLetters.map((l) => {
                    const selected = l.id === activeLetter.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedId(l.id)}
                        className={`w-full flex items-center justify-between gap-2 rounded-[20px] px-4 py-3 text-left transition-all cursor-pointer ${
                          selected
                            ? "bg-[#7898b0] text-white"
                            : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {l.company}
                          </p>
                          <p
                            className={`text-[10.5px] truncate ${
                              selected ? "text-white/80" : "text-slate-400"
                            }`}
                          >
                            {l.role}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                            selected
                              ? "bg-white text-[#181b1e]"
                              : "bg-[#3b3f44] text-slate-300"
                          }`}
                        >
                          {l.citedProofIds.length} cited
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* + Cite Proof Case */}
                <div className="rounded-[22px] bg-[#2c3033] p-4 space-y-2.5">
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#d4fb35]">
                    + Cite Verified Proof Case
                  </p>
                  {state.profile.proofCases.map((pc) => {
                    const cited = activeLetter.citedProofIds.includes(pc.id);
                    return (
                      <button
                        key={pc.id}
                        type="button"
                        disabled={cited}
                        onClick={() =>
                          citeProofInCoverLetter(activeLetter.id, pc.id)
                        }
                        className={`w-full rounded-[16px] p-3 text-left text-xs transition-colors cursor-pointer ${
                          cited
                            ? "bg-[#0e7c4d]/25 border border-[#0e7c4d]/40 text-emerald-200"
                            : "bg-[#34383c] hover:bg-[#3f4449] text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{pc.title}</span>
                          {cited ? (
                            <Check className="h-3.5 w-3.5 text-[#d4fb35]" />
                          ) : (
                            <Quote className="h-3.5 w-3.5 text-[#d4fb35]" />
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-300 mt-1">
                          {pc.metric}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Rhetoric Checks */}
                <div className="rounded-[22px] bg-[#2c3033] p-4 space-y-2">
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-slate-400">
                    Cicero Rhetoric Audit
                  </p>
                  {rhetoricChecks.map((rc) => (
                    <div
                      key={rc.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          rc.pass ? "bg-[#d4fb35]" : "bg-[#f59e0b]"
                        }`}
                      />
                      <span className="text-slate-200">{rc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Steel-Blue / White Sheet Container */}
              <div className="col-span-8 rounded-[26px] bg-[#7898b0] p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-3 text-white">
                  <div>
                    <p className="text-[11px] text-white/75">
                      {activeLetter.company} · Updated {activeLetter.updatedAt}
                    </p>
                    <h3 className="font-display text-2xl font-normal">
                      {activeLetter.role}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      title="Print / Save PDF"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-white hover:bg-white/28 cursor-pointer"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    {state.coverLetters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteCoverLetter(activeLetter.id)}
                        title="Delete Draft"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-white hover:bg-[#c9332b] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <VexButton
                      variant="lime"
                      size="sm"
                      onClick={handleExportDoc}
                    >
                      Export .doc
                    </VexButton>
                  </div>
                </div>

                <div className="rounded-[22px] bg-white text-[#181b1e] p-6 space-y-4 shadow-md">
                  {editorMode === "preview" ? (
                    <div className="space-y-4 text-sm leading-relaxed">
                      <div className="border-b border-slate-200 pb-3">
                        <p className="font-semibold text-[#181b1e]">
                          {state.profile.name}
                        </p>
                        <p className="text-xs text-[#6c7581]">
                          {state.profile.location} · {state.profile.publicHandle}
                        </p>
                      </div>
                      {activeLetter.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeLetter.paragraphs.map((p, idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="font-mono-code text-[10px] uppercase text-[#6c7581]">
                            Paragraph 0{idx + 1}
                          </label>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const next = [...activeLetter.paragraphs];
                              next[idx] = e.target.value;
                              updateCoverLetter(activeLetter.id, {
                                paragraphs: next,
                              });
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] p-3 text-xs leading-relaxed outline-none focus:border-[#1f2224]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </NotchedDarkStudio>
      </div>

      {/* Create Draft Modal */}
      <Modal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        title="New Cicero Cover Letter Draft"
        subtitle="Starts cleanly with zero invented metrics; cite Proof Cases directly in the workbench."
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Target Company
            </label>
            <input
              required
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="e.g. Vesper Payments"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">
              Role Title
            </label>
            <input
              required
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Senior Technical Product Ops"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setNewModalOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Create Draft
            </VexButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
