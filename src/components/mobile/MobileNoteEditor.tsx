"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Edit3, Plus, Trash2, X } from "lucide-react";
import type { CoverLetterDraft, ProofCase } from "@/types/vex";

interface MobileNoteEditorProps {
  letter: CoverLetterDraft;
  proofCases: ProofCase[];
  rhetoricScore: number;
  onUpdateParagraph: (index: number, text: string) => void;
  onRemoveParagraph: (index: number) => void;
  onCiteProof: (proofId: string) => void;
  onExportDoc: () => void;
}

export default function MobileNoteEditor({
  letter,
  proofCases,
  rhetoricScore,
  onUpdateParagraph,
  onRemoveParagraph,
  onCiteProof,
  onExportDoc,
}: MobileNoteEditorProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const labels = ["Opening", "Motivation", "Proof", "Closing", "Postscript"];

  return (
    <div className="lg:hidden space-y-4 pb-32">
      <div className="ios-card p-4 space-y-4">
        <div className="border-b border-slate-200/70 pb-3">
          <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#6c7581]">
            {letter.company} · {letter.tone}
          </p>
          <h3 className="font-display text-[20px] font-medium text-[#181b1e]">
            {letter.role}
          </h3>
        </div>

        <div className="space-y-3">
          {letter.paragraphs.map((p, idx) => {
            const isSel = selectedIdx === idx;
            const isEdit = editingIdx === idx;
            const code = String(idx + 1).padStart(2, "0");
            const sec = labels[idx] || "Body";

            return (
              <div key={idx} className="grid grid-cols-[44px_1fr] gap-x-2.5">
                <div className="pt-0.5">
                  <span className="block font-mono-code text-[10px] text-[#6c7581]">
                    {code}
                  </span>
                  <span className="block font-mono-code text-[8px] uppercase text-[#949eab]">
                    {sec}
                  </span>
                </div>
                <div className="min-w-0">
                  {isEdit ? (
                    <div className="rounded-[16px] border border-[#1f2224]/25 bg-white p-2.5 space-y-2">
                      <textarea
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={4}
                        className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-[#181b1e] outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingIdx(null)}
                          className="text-xs text-[#6c7581]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateParagraph(idx, draft);
                            setEditingIdx(null);
                            setSelectedIdx(null);
                            flash("Updated paragraph");
                          }}
                          className="rounded-full bg-[#1f2224] px-3.5 py-1 text-xs font-medium text-[#d4fb35]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedIdx(isSel ? null : idx)}
                      className={`w-full text-left rounded-[12px] px-2 py-1 text-[14px] leading-relaxed text-[#181b1e] transition-colors cursor-pointer ${
                        isSel ? "bg-[#d4fb35]/35" : ""
                      }`}
                    >
                      {p}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* + Cite Proof Rail */}
        <div className="pt-2 border-t border-slate-200/70 space-y-2">
          <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#6c7581]">
            + Cite Verified Proof Case
          </p>
          <div className="vex-snap-rail gap-2">
            {proofCases.map((pc) => {
              const cited = letter.citedProofIds.includes(pc.id);
              return (
                <button
                  key={pc.id}
                  type="button"
                  disabled={cited}
                  onClick={() => {
                    onCiteProof(pc.id);
                    flash(`Cited ${pc.title}`);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    cited
                      ? "bg-[#ecfdf3] text-[#0e7c4d]"
                      : "bg-[#e9eff6] text-[#181b1e]"
                  }`}
                >
                  {cited ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>{pc.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tap-a-line floating toolbar */}
      <AnimatePresence>
        {selectedIdx !== null && editingIdx === null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-4 bottom-[174px] z-40 mx-auto max-w-sm rounded-full bg-[#222528] px-3 py-2 text-white shadow-2xl flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(letter.paragraphs[selectedIdx] || "");
                  setEditingIdx(selectedIdx);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#313538] px-3 py-1 text-xs cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      letter.paragraphs[selectedIdx] || ""
                    );
                    flash("Copied paragraph");
                  } catch {
                    flash("Prepared copy");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#313538] px-3 py-1 text-xs cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
              {letter.paragraphs.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveParagraph(selectedIdx);
                    setSelectedIdx(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#c9332b] px-3 py-1 text-xs cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedIdx(null)}
              className="p-1 text-slate-400 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Rhetoric Score Bar */}
      <div className="sticky bottom-[106px] z-30 rounded-[22px] bg-[#222528] p-3 text-white shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4fb35] text-xs font-bold text-[#15181a]">
            {rhetoricScore}
          </span>
          <div>
            <p className="text-[11px] font-semibold whitespace-nowrap">
              Rhetoric Clarity
            </p>
            <p className="text-[10px] text-slate-300 whitespace-nowrap">
              {letter.citedProofIds.length} proof case(s) cited
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExportDoc}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#7898b0] px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export .doc</span>
        </button>
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#1f2224] px-4 py-2 text-xs text-[#d4fb35] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
