"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { SCORE_DEFINITIONS } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export type PillTone =
  | "neutral"
  | "good"
  | "warn"
  | "bad"
  | "info"
  | "dark"
  | "lime"
  | "steel"
  | "glass";

const PILL_STYLES: Record<PillTone, string> = {
  neutral: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  good: "bg-[#ecfdf3] text-[#0e7c4d] border-[#abefc6]",
  warn: "bg-[#fffaeb] text-[#b45309] border-[#fde68a]",
  bad: "bg-[#fef2f2] text-[#c9332b] border-[#fecaca]",
  info: "bg-[#eff6ff] text-[#2e67b2] border-[#bfdbfe]",
  dark: "bg-[#222528] text-white border-[#34383c]",
  lime: "bg-[#d4fb35] text-[#15181a] border-[#c4ee1d]",
  steel: "bg-[#7898b0] text-white border-[#8ba8be]",
  glass: "bg-white/20 text-white border-white/25 backdrop-blur-xs",
};

export function Pill({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors ${PILL_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VexButton({
  variant = "dark",
  size = "md",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "lime" | "white" | "steel" | "ghostDark" | "danger";
  size?: "sm" | "md";
}) {
  const styles = {
    dark: "bg-[#1f2224] text-white hover:bg-[#111315] hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(24,27,30,0.18)] hover:shadow-[0_10px_24px_rgba(24,27,30,0.26)]",
    lime: "bg-[#d4fb35] text-[#15181a] hover:bg-[#c8f221] hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(212,251,53,0.3)] hover:shadow-[0_10px_24px_rgba(212,251,53,0.42)] font-semibold",
    white:
      "bg-white/92 text-[#181b1e] border border-white hover:bg-white hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(140,160,185,0.14)] hover:shadow-[0_8px_20px_rgba(140,160,185,0.24)]",
    steel:
      "bg-white/18 text-white border border-white/25 hover:bg-white/28 hover:-translate-y-0.5 backdrop-blur-xs",
    ghostDark:
      "bg-[#313538] text-[#e2e8f0] hover:bg-[#3e4347] hover:-translate-y-0.5",
    danger:
      "bg-[#c9332b] text-white hover:bg-[#ad2720] hover:-translate-y-0.5 shadow-[0_6px_16px_rgba(201,51,43,0.26)]",
  }[variant];

  const sizing =
    size === "sm"
      ? "px-3.5 py-1.5 text-[11.5px]"
      : "px-4.5 py-2.5 text-xs";

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium active:scale-[0.95] disabled:opacity-45 disabled:pointer-events-none cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4fb35] ${styles} ${sizing} ${className}`}
    >
      {children}
    </button>
  );
}

export function ScoreInfo({
  scoreKey,
  dark = false,
}: {
  scoreKey: keyof typeof SCORE_DEFINITIONS;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const def = SCORE_DEFINITIONS[scoreKey];
  if (!def) return null;

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label={`Explain ${def.label}`}
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 ${
          dark
            ? "text-white/60 hover:bg-white/15 hover:text-white"
            : "text-[#8c96a3] hover:bg-slate-200/70 hover:text-[#181b1e]"
        }`}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 460, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed sm:absolute left-4 right-4 sm:left-0 sm:right-auto bottom-20 sm:bottom-auto sm:top-full mt-2 z-50 sm:w-72 rounded-[22px] border border-white/90 bg-white/96 backdrop-blur-xl p-4 text-left shadow-2xl text-[#181b1e]"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono-code text-[10px] font-semibold uppercase tracking-wider text-[#6c7581]">
                {def.label}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-[#6c7581] hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[12px] text-[#181b1e] leading-relaxed">
              <strong className="font-semibold">Measures:</strong>{" "}
              {def.measures}
            </p>
            <p className="mt-1.5 text-[11px] text-[#c9332b] leading-relaxed">
              <strong>Does not promise:</strong> {def.doesNotPromise}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Responsive Page Header matching the uploaded reference image
 */
export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  extraRight,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  extraRight?: React.ReactNode;
}) {
  const { goBack, activeSection, setLauncherOpen } = useVexWorkspace();

  return (
    <div className="hidden lg:flex items-center justify-between gap-4 pb-1">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={goBack}
          aria-label={activeSection === "dashboard" ? "Back" : "Back to previous"}
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 border border-white text-[#181b1e] shadow-[0_4px_14px_rgba(140,160,185,0.14)] hover:bg-white hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-[28px] xl:text-[36px] leading-none font-normal tracking-[-0.03em] text-[#181b1e]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs text-[#6c7581] truncate max-w-sm xl:max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {extraRight}
        <button
          type="button"
          onClick={() => setLauncherOpen(true)}
          aria-label="Workspace quick launcher"
          title="All Vex Modules"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 border border-white text-[#475569] shadow-[0_4px_14px_rgba(140,160,185,0.14)] hover:bg-white hover:text-[#181b1e] hover:-translate-y-0.5 cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        {actionLabel && onAction && (
          <VexButton variant="white" onClick={onAction}>
            {actionIcon}
            <span>{actionLabel}</span>
          </VexButton>
        )}
      </div>
    </div>
  );
}

/**
 * Signature Dark Obsidian #222528 Master-Detail Container with Animated Top-Center Concave Notch Tabs
 */
export function NotchedDarkStudio<T extends string>({
  leftHeading,
  tabs,
  activeTab,
  onTabChange,
  rightControls,
  children,
}: {
  leftHeading: string;
  tabs: { id: T; label: string; count?: number | string }[];
  activeTab: T;
  onTabChange: (id: T) => void;
  rightControls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative rounded-[28px] lg:rounded-[34px] bg-[#222528] text-white shadow-[0_24px_60px_rgba(24,27,30,0.22)]">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between px-4 sm:px-6 pt-0 pb-4 gap-3">
        {/* Desktop Top-Center Concave Notch Cutout */}
        <div className="lg:order-2 flex justify-center min-w-0">
          <div className="vex-notch-bridge hidden lg:flex items-center gap-1.5 px-3 py-2">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3.5 xl:px-4 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
                    active
                      ? "text-[#15181a]"
                      : "bg-white/95 text-[#475569] hover:text-[#181b1e] hover:bg-white border border-slate-200/70"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`vex-notch-pill-${leftHeading}`}
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-[#d4fb35] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`relative z-10 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                        active
                          ? "bg-[#1f2224] text-white"
                          : "bg-[#e9eff6] text-[#181b1e]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal Snap Rail Tabs inside dark studio */}
          <div className="lg:hidden no-scrollbar flex items-center gap-1.5 w-full overflow-x-auto pt-4 pb-1">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium cursor-pointer ${
                    active
                      ? "bg-[#d4fb35] text-[#15181a] font-semibold"
                      : "bg-[#313538] text-[#cbd5e1]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] font-semibold ${
                        active
                          ? "bg-[#1f2224] text-white"
                          : "bg-[#222528] text-white"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:order-1 pt-1 lg:pt-5 flex items-center justify-between lg:justify-start gap-3">
          <h2 className="text-[15px] font-medium text-[#e2e8f0]">
            {leftHeading}
          </h2>
        </div>

        <div className="lg:order-3 hidden lg:flex items-center gap-2 pt-4">
          {rightControls}
        </div>
      </div>

      {/* Animated Tab Body Crossfade */}
      <div className="px-4 sm:px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export function TruthLockWarningBanner({
  unsupportedCount,
  onReviewCv,
}: {
  unsupportedCount: number;
  onReviewCv: () => void;
}) {
  if (unsupportedCount <= 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-[#fecaca] bg-[#fef2f2]/95 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9332b] text-white"
        >
          <ShieldAlert className="h-4.5 w-4.5" />
        </motion.span>
        <div>
          <p className="text-xs font-semibold text-[#991b1b]">
            Truth Lock Active — {unsupportedCount} unsupported CV claim pending
          </p>
          <p className="text-[11.5px] text-[#7f1d1d]/85 mt-0.5">
            PDF & DOCX exports stay blocked until every invented metric is replaced with real facts or rejected.
          </p>
        </div>
      </div>
      <VexButton variant="danger" size="sm" onClick={onReviewCv}>
        Review Claim
      </VexButton>
    </motion.div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#181b1e]/55 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className={`relative z-10 w-full ${maxWidthClass} max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] border border-white/80 bg-[#f6f9fd] p-5 sm:p-6 shadow-2xl`}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 sm:hidden" />
            <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-3.5 mb-4">
              <div>
                <h2 className="font-display text-xl font-medium tracking-tight text-[#181b1e]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-xs text-[#6c7581]">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${title}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-[#475569] hover:text-[#181b1e] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ScoreGlossaryCard({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Object.values(SCORE_DEFINITIONS).map((def, i) => (
        <motion.div
          key={def.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={`rounded-[20px] p-4 border ${
            dark
              ? "bg-[#2c3033] border-white/10 text-white"
              : "bg-white/80 border-white text-[#181b1e]"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold">{def.label}</span>
            <span className="h-2 w-2 rounded-full bg-[#d4fb35]" />
          </div>
          <p
            className={`text-[11.5px] leading-relaxed ${
              dark ? "text-slate-300" : "text-[#475569]"
            }`}
          >
            {def.measures}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#f87171]">
            Not: {def.doesNotPromise}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/25 bg-white/5 p-8 text-center flex flex-col items-center justify-center gap-2.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#d4fb35]">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="text-xs text-slate-300 max-w-md">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
