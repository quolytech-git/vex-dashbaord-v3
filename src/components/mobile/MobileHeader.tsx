"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Compass, MoreHorizontal, Zap } from "lucide-react";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { NavSection } from "@/types/vex";
import MobileSheet from "./MobileSheet";

const SECTION_TITLES: Record<NavSection, string> = {
  dashboard: "Dashboard",
  jobs: "Jobs Discovery",
  resume: "Resume Atelier",
  "cover-letters": "Cover Letters",
  profile: "Profile & Codex",
  tracker: "Applications Tracker",
  extension: "Vex Apply Extension",
  network: "Network Council",
  interviews: "Interview Studio",
  learning: "Learning Academy",
  assistant: "Zeus AI & MCP Forge",
  alerts: "Hermes Alerts",
  settings: "Governance & Billing",
};

export default function MobileHeader() {
  const {
    state,
    activeSection,
    setActiveSection,
    goBack,
    unreadAlertCount,
    coachOpen,
    setCoachOpen,
    setSprintOpen,
    unsupportedClaimCount,
  } = useVexWorkspace();

  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHomeRoot = activeSection === "dashboard";
  const title = SECTION_TITLES[activeSection];

  const destinationGroups: {
    group: string;
    items: { label: string; sub: string; section: NavSection; badge?: string }[];
  }[] = [
    {
      group: "Writing & Documents",
      items: [
        {
          label: "Resume Atelier",
          sub: "Da Vinci · Tracked diffs & Truth Lock",
          section: "resume",
          badge: unsupportedClaimCount > 0 ? `${unsupportedClaimCount}!` : undefined,
        },
        {
          label: "Cover Letters",
          sub: "Cicero · Cited proof letters",
          section: "cover-letters",
        },
        {
          label: "Profile & Codex",
          sub: "Canonical facts, skills & repos",
          section: "profile",
        },
      ],
    },
    {
      group: "Execution & Prep",
      items: [
        {
          label: "Jobs Discovery",
          sub: "Plato · Matrix & Pergament Swipe",
          section: "jobs",
        },
        {
          label: "Applications Tracker",
          sub: "Hermes · 3-state pipeline ledger",
          section: "tracker",
        },
        {
          label: "Vex Apply Extension",
          sub: "Autofill permissions & guardrails",
          section: "extension",
        },
        {
          label: "Interview Studio",
          sub: "Socrates & Marcus · Live STAR drill",
          section: "interviews",
        },
      ],
    },
    {
      group: "Intelligence & Tools",
      items: [
        {
          label: "Zeus AI & MCP Forge",
          sub: "Approval-first planner & Hephaestus tools",
          section: "assistant",
        },
        {
          label: "Learning Academy",
          sub: "Aristotle · Quizzes upgrade skills",
          section: "learning",
        },
        {
          label: "Network Council",
          sub: "Warm intros & company intel",
          section: "network",
        },
      ],
    },
    {
      group: "Account & Governance",
      items: [
        {
          label: "Hermes Alerts",
          sub: `${unreadAlertCount} unread updates`,
          section: "alerts",
          badge: unreadAlertCount > 0 ? String(unreadAlertCount) : undefined,
        },
        {
          label: "Privacy, Billing & Oracle",
          sub: "Themis, Plutus quotas, Apollo & Help",
          section: "settings",
        },
      ],
    },
  ];

  function pick(sec: NavSection) {
    setMoreOpen(false);
    setActiveSection(sec);
  }

  return (
    <>
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className="vex-glass-bar sticky top-0 z-30 px-4 pt-[max(10px,env(safe-area-inset-top))] pb-2.5 lg:hidden no-print"
      >
        {isHomeRoot ? (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveSection("profile")}
              className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
            >
              <img
                src="/images/vex-philosopher.jpg"
                alt={state.profile.name}
                className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover object-top shadow-xs"
              />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-[#6c7581]">
                  {state.profile.targetRole}
                </p>
                <h1 className="truncate font-display text-[20px] font-medium leading-tight tracking-tight text-[#181b1e]">
                  Welcome Back
                </h1>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#1f2224] p-1 text-[11px]">
              {(
                [
                  { id: "dashboard", label: "Overview" },
                  { id: "jobs", label: "Jobs" },
                  { id: "resume", label: "Resume" },
                  { id: "tracker", label: "Tracker" },
                  { id: "interviews", label: "Interviews" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveSection(t.id)}
                  className={`rounded-full px-3 py-1 font-medium cursor-pointer ${
                    activeSection === t.id
                      ? "bg-[#d4fb35] text-[#15181a] font-semibold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection("alerts")}
                aria-label="Open notifications"
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#181b1e]"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadAlertCount > 0 && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#d4fb35]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-label="Open Vex companion navigation"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#181b1e]"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#181b1e]"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>

            <div className="min-w-0 flex-1 text-center">
              <h1 className="truncate font-display text-[19px] font-medium leading-tight tracking-tight text-[#181b1e]">
                {title}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Open module drawer"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#181b1e]"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        )}
      </header>

      <MobileSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Vex Companion"
        subtitle={`${state.profile.name} · ${state.preferences.plan} Plan`}
      >
        <div className="space-y-4">
          {/* 24h Sprint & Coach Guide */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                setSprintOpen(true);
              }}
              className="flex items-center gap-2.5 rounded-[20px] bg-[#1f2224] p-3.5 text-left text-white cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4fb35] text-[#15181a]">
                <Zap className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">24h Sprint</span>
                <span className="block text-[10px] text-slate-300 truncate">
                  7 live checks
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                setCoachOpen(!coachOpen);
              }}
              className="flex items-center gap-2.5 rounded-[20px] bg-white border border-slate-200/80 p-3.5 text-left text-[#181b1e] cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eff6] text-[#181b1e]">
                <Compass className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">Coach Guide</span>
                <span className="block text-[10px] text-[#6c7581] truncate">
                  5-step tour
                </span>
              </span>
            </button>
          </div>

          {destinationGroups.map((grp) => (
            <div key={grp.group} className="space-y-1.5">
              <p className="px-1 font-mono-code text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6c7581]">
                {grp.group}
              </p>
              <div className="space-y-1.5">
                {grp.items.map((item) => {
                  const active = activeSection === item.section;
                  return (
                    <button
                      key={item.section}
                      type="button"
                      onClick={() => pick(item.section)}
                      className={`w-full flex items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-left transition-colors cursor-pointer ${
                        active
                          ? "bg-[#222528] text-white"
                          : "bg-white border border-slate-200/70 text-[#181b1e]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold truncate">
                          {item.label}
                        </p>
                        <p
                          className={`text-[11px] truncate ${
                            active ? "text-slate-300" : "text-[#6c7581]"
                          }`}
                        >
                          {item.sub}
                        </p>
                      </div>
                      {item.badge ? (
                        <span className="rounded-full bg-[#d4fb35] px-2.5 py-0.5 text-[11px] font-bold text-[#15181a]">
                          {item.badge}
                        </span>
                      ) : (
                        <span
                          className={`text-xs ${
                            active ? "text-[#d4fb35]" : "text-[#949eab]"
                          }`}
                        >
                          →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </MobileSheet>
    </>
  );
}
