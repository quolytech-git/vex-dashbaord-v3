"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  Home,
  Mic,
  Plus,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { NavSection } from "@/types/vex";

type TabId = "dashboard" | "jobs" | "tracker" | "profile";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "tracker", label: "Tracker", icon: ClipboardCheck },
  { id: "profile", label: "Me", icon: User },
];

const QUICK_ACTIONS: {
  section: NavSection;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  iconInk?: string;
}[] = [
  {
    section: "assistant",
    label: "Ask Vex AI",
    hint: "Plan & run tasks",
    icon: Sparkles,
    tint: "#d4fb35",
    iconInk: "#15181a",
  },
  {
    section: "resume",
    label: "Tailor CV",
    hint: "Diffs & Truth Lock",
    icon: FileText,
    tint: "#7898b0",
  },
  {
    section: "tracker",
    label: "Log application",
    hint: "3-state ledger",
    icon: Plus,
    tint: "#0e7c4d",
  },
  {
    section: "interviews",
    label: "Practice interview",
    hint: "2-min STAR drills",
    icon: Mic,
    tint: "#222528",
  },
  {
    section: "learning",
    label: "Learn a skill",
    hint: "Quizzes & proof",
    icon: BookOpen,
    tint: "#2e67b2",
  },
  {
    section: "network",
    label: "Add contact",
    hint: "Warm intros",
    icon: Users,
    tint: "#475569",
  },
];

export default function MobileTabBar() {
  const {
    state,
    activeSection,
    setActiveSection,
    setSprintOpen,
    sprintCompletedCount,
    sprintMilestones,
  } = useVexWorkspace();

  const [mounted, setMounted] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!actionsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActionsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actionsOpen]);

  if (!mounted) return null;

  const jobsCount = state.jobs.filter((j) => j.triage !== "passed").length;
  const appsCount = state.applications.length;

  const badges: Partial<Record<TabId, number>> = {
    jobs: jobsCount || undefined,
    tracker: appsCount || undefined,
  };

  function go(sec: NavSection) {
    setActionsOpen(false);
    setActiveSection(sec);
  }

  const renderTab = (tab: (typeof TABS)[number]) => {
    const Icon = tab.icon;
    const active = activeSection === tab.id;
    const badge = badges[tab.id];

    return (
      <button
        key={tab.id}
        type="button"
        aria-label={tab.label}
        aria-current={active ? "page" : undefined}
        onClick={() => go(tab.id)}
        className="flex-1 cursor-pointer active:scale-95 transition-transform"
      >
        <span className="relative flex h-[54px] flex-col items-center justify-center gap-[3px]">
          {active && (
            <motion.span
              layoutId="vex-tab-active"
              className="absolute inset-x-1 inset-y-1 rounded-[18px] bg-[#1f2224] shadow-[0_4px_14px_rgba(24,27,30,0.2)]"
              transition={{ type: "spring", stiffness: 520, damping: 38 }}
            />
          )}
          <span
            className={`relative transition-colors ${
              active ? "text-[#d4fb35]" : "text-[#475569]"
            }`}
          >
            <Icon className="h-[20px] w-[20px]" />
            {typeof badge === "number" && (
              <span
                className={`absolute -top-1.5 -right-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold ring-2 ${
                  active
                    ? "bg-[#d4fb35] text-[#15181a] ring-[#1f2224]"
                    : "bg-[#1f2224] text-white ring-[#eef3fa]"
                }`}
              >
                {badge}
              </span>
            )}
          </span>
          <span
            className={`relative text-[10.5px] leading-none tracking-[0.01em] transition-colors ${
              active ? "font-semibold text-white" : "font-medium text-[#475569]"
            }`}
          >
            {tab.label}
          </span>
        </span>
      </button>
    );
  };

  return createPortal(
    <div className="lg:hidden no-print">
      <AnimatePresence>
        {actionsOpen && (
          <motion.button
            type="button"
            aria-label="Close quick actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActionsOpen(false)}
            className="fixed inset-0 z-[44] cursor-default bg-[#181b1e]/35 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
        <AnimatePresence>
          {actionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 480, damping: 34 }}
              style={{ transformOrigin: "50% 100%" }}
              className="vex-glass pointer-events-auto mx-auto mb-3 max-w-[440px] rounded-[28px] p-3.5"
            >
              <p className="px-1.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#6c7581]">
                Quick actions
              </p>

              <button
                type="button"
                onClick={() => {
                  setActionsOpen(false);
                  setSprintOpen(true);
                }}
                className="mb-2.5 flex w-full cursor-pointer items-center gap-3 rounded-[20px] bg-[#1f2224] px-4 py-3 text-left text-white shadow-sm transition-transform active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#d4fb35] text-[#15181a]">
                  <Zap className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold">
                    24h Sprint ({sprintCompletedCount}/{sprintMilestones.length})
                  </span>
                  <span className="block text-[11px] text-slate-300">
                    Interview-ready in 7 verified steps
                  </span>
                </span>
                <span className="text-[#d4fb35] font-semibold">›</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <motion.button
                      key={a.label}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i, duration: 0.2 }}
                      onClick={() => go(a.section)}
                      className="flex h-full flex-col items-center gap-1.5 rounded-[20px] bg-white/85 px-2 pt-3 pb-2.5 text-center shadow-2xs active:scale-95 transition-transform cursor-pointer"
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-[14px] shadow-xs"
                        style={{
                          backgroundColor: a.tint,
                          color: a.iconInk || "#ffffff",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[11.5px] leading-tight font-semibold text-[#181b1e]">
                        {a.label}
                      </span>
                      <span className="text-[9.5px] leading-tight text-[#6c7581]">
                        {a.hint}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liquid-Glass Bottom Capsule Dock */}
        <nav
          aria-label="Mobile navigation"
          className="vex-glass pointer-events-auto relative mx-auto flex max-w-[440px] items-center rounded-[26px] px-1.5"
        >
          {TABS.slice(0, 2).map(renderTab)}

          <div className="relative flex w-[72px] shrink-0 justify-center">
            <motion.button
              type="button"
              aria-label={actionsOpen ? "Close quick actions" : "Open quick actions"}
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              className="relative -mt-7 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-[#1f2224] text-[#d4fb35] shadow-[0_12px_26px_rgba(24,27,30,0.34)] ring-[5px] ring-[#eef3fa]"
            >
              <motion.span
                animate={{ rotate: actionsOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Plus className="h-7 w-7" />
              </motion.span>
            </motion.button>
          </div>

          {TABS.slice(2).map(renderTab)}
        </nav>
      </div>
    </div>,
    document.body
  );
}
