"use client";

import React, { useState } from "react";
import { PHILOSOPHERS } from "@/data/philosophers";
import type { PhilosopherId } from "@/types/vex";

interface MobilePhilosopherPillProps {
  philosopher: PhilosopherId;
  guidance?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function MobilePhilosopherPill({
  philosopher,
  guidance,
  actionLabel,
  onAction,
}: MobilePhilosopherPillProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = PHILOSOPHERS[philosopher];

  return (
    <div className="ios-card overflow-hidden p-3.5 lg:hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={meta.image}
            alt={meta.name}
            className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover object-top shadow-xs"
          />
          <div className="min-w-0">
            <p className="font-mono-code text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#6c7581]">
              {meta.name} · {meta.title}
            </p>
            <p className="line-clamp-2 text-[12px] leading-snug font-medium text-[#181b1e]">
              &ldquo;{meta.maxim}&rdquo;
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#e9eff6] px-2.5 py-1 font-mono-code text-[10px] font-medium text-[#181b1e]">
          {expanded ? "Hide" : "Insight"}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2.5 border-t border-slate-200/70 pt-3 text-[12px] leading-relaxed text-[#475569]">
          <p className="text-[#181b1e]">
            {guidance || `Domain: ${meta.domain}. Every metric and recommendation in this section follows ${meta.name}'s truth-first discipline.`}
          </p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex min-h-[36px] cursor-pointer items-center rounded-full bg-[#1f2224] px-4 py-1.5 text-[11.5px] font-medium text-[#d4fb35]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
