"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Edit3,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { CvDiffItem, CvVariant } from "@/types/vex";
import MobileSheet from "./MobileSheet";

interface MobileManuscriptEditorProps {
  variant: CvVariant;
  variants: CvVariant[];
  onSelectVariant: (id: string) => void;
  candidateName: string;
  candidateMeta: string;
  diffs: CvDiffItem[];
  onDecideDiff: (
    diffId: string,
    decision: "accepted" | "rejected",
    edited?: string
  ) => void;
  onUpdateSummary: (s: string) => void;
  onUpdateBullet: (id: string, text: string) => void;
  onAddBullet: (text: string) => void;
  onRemoveBullet: (id: string) => void;
  onSendAi: (prompt: string) => void;
  onExport: (fmt: "PDF" | "DOCX") => void;
  truthLockActive: boolean;
  unsupportedClaimCount: number;
  skillsLine: string;
}

interface Block {
  key: string;
  section: string;
  code: string;
  text: string;
  style: "name" | "meta" | "body";
  highlight: "none" | "suggestion" | "risk";
  diff?: CvDiffItem;
  onEdit?: (val: string) => void;
  onRemove?: () => void;
}

export default function MobileManuscriptEditor({
  variant,
  variants,
  onSelectVariant,
  candidateName,
  candidateMeta,
  diffs,
  onDecideDiff,
  onUpdateSummary,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onSendAi,
  onExport,
  truthLockActive,
  unsupportedClaimCount,
  skillsLine,
}: MobileManuscriptEditorProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showOriginalOnly, setShowOriginalOnly] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [newBulletText, setNewBulletText] = useState("");
  const [addingBullet, setAddingBullet] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const pendingDiffs = diffs.filter((d) => d.status === "pending");
  const riskDiffs = pendingDiffs.filter((d) => d.hasUnsupportedClaim);

  const blocks: Block[] = useMemo(() => {
    const list: Block[] = [
      {
        key: "header-name",
        section: "Header",
        code: "01",
        text: candidateName,
        style: "name",
        highlight: "none",
      },
      {
        key: "header-meta",
        section: "Header",
        code: "01",
        text: candidateMeta,
        style: "meta",
        highlight: "none",
      },
      {
        key: "summary",
        section: "Profile",
        code: "02",
        text: variant.summary,
        style: "body",
        highlight: "none",
        onEdit: onUpdateSummary,
      },
    ];

    diffs
      .filter((d) => !(d.hasUnsupportedClaim && d.status === "rejected"))
      .forEach((d) => {
        const pending = d.status === "pending" && !showOriginalOnly;
        list.push({
          key: `diff-${d.id}`,
          section: "Diffs",
          code: "03",
          text: showOriginalOnly
            ? d.original
            : d.status === "accepted" || pending
            ? d.proposed
            : d.original,
          style: "body",
          highlight: pending
            ? d.hasUnsupportedClaim
              ? "risk"
              : "suggestion"
            : "none",
          diff: d,
        });
      });

    variant.bullets.forEach((b) => {
      list.push({
        key: `bullet-${b.id}`,
        section: "Work",
        code: "04",
        text: b.text,
        style: "body",
        highlight: "none",
        onEdit: (v) => onUpdateBullet(b.id, v),
        onRemove: () => onRemoveBullet(b.id),
      });
    });

    list.push({
      key: "skills",
      section: "Skills",
      code: "05",
      text: skillsLine,
      style: "meta",
      highlight: "none",
    });

    return list;
  }, [
    candidateName,
    candidateMeta,
    variant,
    diffs,
    showOriginalOnly,
    skillsLine,
    onUpdateSummary,
    onUpdateBullet,
    onRemoveBullet,
  ]);

  const selectedBlock = blocks.find((b) => b.key === selectedKey) || null;

  let lastSection = "";

  return (
    <div className="lg:hidden space-y-4 pb-32">
      {/* Variant Snap Rail */}
      <div className="vex-snap-rail gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelectVariant(v.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
              v.id === variant.id
                ? "bg-[#222528] text-[#d4fb35]"
                : "bg-white/90 text-[#475569] border border-white"
            }`}
          >
            {v.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowOriginalOnly((v) => !v)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
            showOriginalOnly
              ? "bg-[#7898b0] text-white"
              : "bg-white/90 text-[#475569] border border-white"
          }`}
        >
          {showOriginalOnly ? "Showing Original" : "Compare Tailored"}
        </button>
      </div>

      {/* Numbered-Gutter Manuscript Sheet */}
      <div className="ios-card p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
          <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#6c7581]">
            1-COL MANUSCRIPT · TAP LINE TO EDIT
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
              truthLockActive
                ? "bg-[#fef2f2] text-[#c9332b]"
                : "bg-[#ecfdf3] text-[#0e7c4d]"
            }`}
          >
            {truthLockActive ? `${unsupportedClaimCount} Risk` : "Truth Clear"}
          </span>
        </div>

        <div className="space-y-3">
          {blocks.map((b) => {
            const firstInSection = b.section !== lastSection;
            lastSection = b.section;
            const isSelected = selectedKey === b.key;
            const isEditing = editingKey === b.key;

            const textStyle =
              b.style === "name"
                ? "font-display text-[22px] font-medium text-[#181b1e] leading-tight"
                : b.style === "meta"
                ? "text-[12.5px] text-[#6c7581] leading-snug"
                : "text-[14px] text-[#181b1e] leading-relaxed";

            const highlightCls =
              b.highlight === "risk"
                ? "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]"
                : b.highlight === "suggestion"
                ? "bg-[#e9eff6] text-[#181b1e] border border-[#7898b0]/40"
                : isSelected
                ? "bg-[#d4fb35]/35"
                : "";

            return (
              <div key={b.key} className="grid grid-cols-[44px_1fr] gap-x-2.5">
                <div className="pt-0.5">
                  {firstInSection && (
                    <>
                      <span className="block font-mono-code text-[10px] text-[#6c7581]">
                        {b.code}
                      </span>
                      <span className="block font-mono-code text-[8px] uppercase tracking-wider text-[#949eab]">
                        {b.section}
                      </span>
                    </>
                  )}
                </div>

                <div className="min-w-0">
                  {isEditing ? (
                    <div className="rounded-[16px] border border-[#1f2224]/25 bg-white p-2.5 shadow-sm space-y-2">
                      <textarea
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={3}
                        className="w-full resize-none bg-transparent text-[13.5px] text-[#181b1e] outline-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingKey(null)}
                          className="rounded-full px-3 py-1 text-xs text-[#6c7581] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (b.diff) {
                              onDecideDiff(b.diff.id, "accepted", draft);
                            } else {
                              b.onEdit?.(draft);
                            }
                            setEditingKey(null);
                            setSelectedKey(null);
                            flash("Saved manuscript change");
                          }}
                          className="rounded-full bg-[#1f2224] px-3.5 py-1 text-xs font-medium text-[#d4fb35] cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedKey(isSelected ? null : b.key)
                      }
                      className={`w-full text-left rounded-[12px] px-2 py-1 transition-colors cursor-pointer ${highlightCls}`}
                    >
                      <span className={textStyle}>{b.text}</span>
                      {b.highlight === "risk" && (
                        <span className="mt-1 block font-mono-code text-[10px] text-[#c9332b]">
                          Truth Lock: tap to replace metric or reject
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Bullet inline */}
          <div className="grid grid-cols-[44px_1fr] gap-x-2.5 pt-1">
            <span />
            {addingBullet ? (
              <div className="rounded-[16px] border border-slate-200 bg-white p-2.5 space-y-2">
                <textarea
                  value={newBulletText}
                  onChange={(e) => setNewBulletText(e.target.value)}
                  placeholder="Add grounded experience bullet..."
                  rows={2}
                  className="w-full resize-none bg-transparent text-xs outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingBullet(false)}
                    className="text-xs text-[#6c7581]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddBullet(newBulletText);
                      setNewBulletText("");
                      setAddingBullet(false);
                    }}
                    className="rounded-full bg-[#1f2224] px-3 py-1 text-xs text-[#d4fb35]"
                  >
                    Add Bullet
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingBullet(true)}
                className="w-fit inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3.5 py-1.5 text-xs font-medium text-[#475569] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Bullet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tap-a-line floating toolbar */}
      <AnimatePresence>
        {selectedBlock && !editingKey && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-4 bottom-[174px] z-40 mx-auto max-w-md rounded-full bg-[#222528] px-3 py-2 text-white shadow-2xl flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(selectedBlock.onEdit || selectedBlock.diff) && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(selectedBlock.text);
                    setEditingKey(selectedBlock.key);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#313538] px-3 py-1 text-[11px] font-medium cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(selectedBlock.text);
                    flash("Copied line");
                  } catch {
                    flash("Prepared copy");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#313538] px-3 py-1 text-[11px] font-medium cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
              {selectedBlock.diff && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBlock.diff?.hasUnsupportedClaim) {
                        setDraft(selectedBlock.diff.original);
                        setEditingKey(selectedBlock.key);
                      } else if (selectedBlock.diff) {
                        onDecideDiff(selectedBlock.diff.id, "accepted");
                        setSelectedKey(null);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#d4fb35] px-3 py-1 text-[11px] font-semibold text-[#15181a] cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    <span>
                      {selectedBlock.diff.hasUnsupportedClaim
                        ? "Replace Metric"
                        : "Accept"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBlock.diff) {
                        onDecideDiff(selectedBlock.diff.id, "rejected");
                        setSelectedKey(null);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#c9332b] px-3 py-1 text-[11px] font-medium text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              {selectedBlock.onRemove && (
                <button
                  type="button"
                  onClick={() => {
                    selectedBlock.onRemove?.();
                    setSelectedKey(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#c9332b] px-3 py-1 text-[11px] font-medium text-white cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedKey(null)}
              className="p-1 text-slate-400 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Floating ATS Score + Action Bar */}
      <div className="sticky bottom-[106px] z-30 rounded-[22px] bg-[#222528] p-3 text-white shadow-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7898b0] text-xs font-bold text-white">
            {variant.atsScore}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold leading-none whitespace-nowrap">
              ATS {variant.atsScore}%
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5 whitespace-nowrap">
              {pendingDiffs.length} diff · {riskDiffs.length} risk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setAuditOpen(true)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-medium cursor-pointer ${
              truthLockActive
                ? "bg-[#c9332b] text-white"
                : "bg-[#313538] text-slate-200"
            }`}
          >
            Audit ({pendingDiffs.length})
          </button>
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#313538] px-2.5 py-1.5 text-[11px] font-medium text-white cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-[#d4fb35]" />
            <span>AI</span>
          </button>
          <button
            type="button"
            onClick={() => onExport("PDF")}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#d4fb35] px-3 py-1.5 text-[11px] font-semibold text-[#15181a] cursor-pointer"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#1f2224] px-4 py-2 text-xs text-[#d4fb35] shadow-lg">
          {toast}
        </div>
      )}

      {/* AI Copilot Bottom Sheet */}
      <MobileSheet
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="Da Vinci AI Scribe"
        subtitle="Grounded suggestions only"
      >
        <div className="space-y-3">
          <div className="space-y-2">
            {[
              "Tighten my Executive Profile for Product Operations Lead",
              "Draft a grounded bullet citing Proof Case #1",
              "Align summary keywords with Northbridge Systems",
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  onSendAi(q);
                  setAiOpen(false);
                }}
                className="w-full rounded-[16px] border border-slate-200 bg-white p-3 text-left text-xs font-medium text-[#181b1e] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Da Vinci Scribe..."
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (!aiPrompt.trim()) return;
                onSendAi(aiPrompt);
                setAiPrompt("");
                setAiOpen(false);
              }}
              className="rounded-full bg-[#1f2224] px-4 py-2 text-xs font-semibold text-[#d4fb35] cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </MobileSheet>

      {/* Truth Lock Audit Sheet */}
      <MobileSheet
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        title="Tracked Revisions & Truth Lock"
        subtitle={`${pendingDiffs.length} pending · ${riskDiffs.length} export blocker`}
      >
        <div className="space-y-3">
          {diffs.map((d) => (
            <div
              key={d.id}
              className={`rounded-[18px] border p-3.5 space-y-2 ${
                d.hasUnsupportedClaim && d.status === "pending"
                  ? "border-[#fecaca] bg-[#fef2f2]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[10px] font-semibold uppercase text-[#6c7581]">
                  {d.section}
                </span>
                <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[10px] font-semibold capitalize">
                  {d.status}
                </span>
              </div>
              <p className="text-xs text-[#181b1e]">{d.proposed}</p>
              {d.hasUnsupportedClaim && d.status === "pending" && (
                <p className="text-[11px] text-[#c9332b] flex items-start gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{d.unsupportedReason}</span>
                </p>
              )}
              {d.status === "pending" && (
                <div className="flex gap-2 pt-1">
                  {!d.hasUnsupportedClaim && (
                    <button
                      type="button"
                      onClick={() => onDecideDiff(d.id, "accepted")}
                      className="rounded-full bg-[#1f2224] px-3 py-1 text-xs font-medium text-[#d4fb35] cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDecideDiff(d.id, "rejected")}
                    className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-[#181b1e] cursor-pointer"
                  >
                    Reject / Keep Orig
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </MobileSheet>
    </div>
  );
}
