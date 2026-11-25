"use client";

import React, { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Compass,
  CreditCard,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Puzzle,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import {
  CoachGuideModal,
  LauncherModal,
  SprintModal,
} from "@/components/overlays/GuidedModals";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { NavSection } from "@/types/vex";

const PRIMARY_CAPSULE_TABS: { id: NavSection; label: string }[] = [
  { id: "dashboard", label: "Overview" },
  { id: "jobs", label: "Jobs" },
  { id: "resume", label: "Resume" },
  { id: "tracker", label: "Tracker" },
  { id: "interviews", label: "Interviews" },
  { id: "assistant", label: "Assistant" },
];

const SECONDARY_ICON_ACTIONS: {
  id?: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClickType?: "coach";
}[] = [
  { id: "cover-letters", label: "Cover Letters", icon: Mail },
  { id: "profile", label: "Profile", icon: UserCheck },
  { id: "extension", label: "Extension", icon: Puzzle },
  { id: "network", label: "Network", icon: Users },
  { id: "learning", label: "Learning", icon: BookOpen },
  { label: "Coach", icon: Compass, onClickType: "coach" },
];

type SidebarGroup =
  | "COMMAND"
  | "DISCOVER"
  | "PREPARE"
  | "APPLY"
  | "IMPROVE"
  | "SYSTEM";

const SIDEBAR_ITEMS: {
  id: NavSection;
  label: string;
  group: SidebarGroup;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Overview", group: "COMMAND", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs Discovery", group: "DISCOVER", icon: Briefcase },
  { id: "resume", label: "Resume Atelier", group: "PREPARE", icon: FileText },
  { id: "cover-letters", label: "Cover Letters", group: "PREPARE", icon: Mail },
  { id: "profile", label: "Profile & Codex", group: "PREPARE", icon: UserCheck },
  { id: "tracker", label: "Job Tracker", group: "APPLY", icon: KanbanSquare },
  { id: "extension", label: "Vex Extension", group: "APPLY", icon: Puzzle },
  { id: "network", label: "Network Council", group: "APPLY", icon: Users },
  { id: "interviews", label: "Interview Studio", group: "IMPROVE", icon: MessageSquareText },
  { id: "learning", label: "Learning Hub", group: "IMPROVE", icon: BookOpen },
  { id: "assistant", label: "Zeus AI & MCP", group: "SYSTEM", icon: Bot },
  { id: "alerts", label: "Hermes Alerts", group: "SYSTEM", icon: Bell },
  { id: "settings", label: "Governance", group: "SYSTEM", icon: Settings },
];

const SIDEBAR_GROUPS: SidebarGroup[] = [
  "COMMAND",
  "DISCOVER",
  "PREPARE",
  "APPLY",
  "IMPROVE",
  "SYSTEM",
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    state,
    activeSection,
    setActiveSection,
    setSprintOpen,
    setCoachOpen,
    setLauncherOpen,
    unreadAlertCount,
    unsupportedClaimCount,
    sprintCompletedCount,
    sprintMilestones,
    readinessPct,
    toasts,
    dismissToast,
  } = useVexWorkspace();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getBadge = (id: NavSection) => {
    if (id === "jobs") {
      const saved = state.jobs.filter((j) => j.triage === "saved").length;
      return saved > 0 ? { text: String(saved), tone: "lime" as const } : null;
    }
    if (id === "resume" && unsupportedClaimCount > 0) {
      return { text: `${unsupportedClaimCount}!`, tone: "bad" as const };
    }
    if (id === "tracker") {
      return { text: String(state.applications.length), tone: "neutral" as const };
    }
    if (id === "alerts" && unreadAlertCount > 0) {
      return { text: String(unreadAlertCount), tone: "lime" as const };
    }
    return null;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="vex-app min-h-screen flex flex-col text-[#181b1e]">
        {/* Full Responsive Desktop/Laptop Navbar (>= 1024px) */}
        <header className="hidden lg:block sticky top-0 z-30 backdrop-blur-md bg-[#eef3fa]/78 border-b border-white/60 no-print">
          <div className="flex items-center justify-between gap-2 xl:gap-4 px-4 xl:px-7 py-3 max-w-[1620px] w-full mx-auto">
            {/* Left: Brand + Sidebar Collapse Toggle + Launcher + Dark Pill Capsule + 6 Tool Icons */}
            <div className="flex items-center gap-2 xl:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 pr-1 cursor-pointer shrink-0 group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 xl:h-6 xl:w-6 text-[#181b1e] transition-transform duration-300 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7" />
                </svg>
                <span className="font-display text-[19px] xl:text-[21px] font-medium tracking-[-0.03em] text-[#181b1e]">
                  vex
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarCollapsed((v) => !v)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="flex h-8 w-8 xl:h-9 xl:w-9 shrink-0 items-center justify-center rounded-full bg-white/90 border border-white text-[#475569] shadow-2xs hover:bg-white hover:text-[#181b1e] hover:-translate-y-0.5 cursor-pointer"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                ) : (
                  <PanelLeftClose className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setLauncherOpen(true)}
                title="All 13 Vex Modules"
                aria-label="Open module launcher"
                className="flex h-8 w-8 xl:h-9 xl:w-9 shrink-0 items-center justify-center rounded-full bg-white/90 border border-white text-[#475569] shadow-2xs hover:bg-white hover:text-[#181b1e] hover:-translate-y-0.5 cursor-pointer"
              >
                <LayoutGrid className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
              </button>

              {/* Animated Dark Obsidian Pill Capsule */}
              <nav
                aria-label="Primary workspace sections"
                className="flex items-center gap-0.5 xl:gap-1 rounded-full bg-[#1f2224] p-1 xl:p-1.5 shadow-[0_8px_22px_rgba(24,27,30,0.16)] overflow-x-auto no-scrollbar"
              >
                <button
                  type="button"
                  onClick={() => setSprintOpen(true)}
                  title={`24h Sprint (${sprintCompletedCount}/${sprintMilestones.length})`}
                  className="flex h-7 w-9 xl:h-8 xl:w-10 shrink-0 items-center justify-center rounded-full bg-[#d6e3ef] text-[#1f2224] hover:bg-white cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                </button>

                {PRIMARY_CAPSULE_TABS.map((tab) => {
                  const active = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSection(tab.id)}
                      className={`relative inline-flex items-center gap-1.5 rounded-full px-2.5 xl:px-3.5 py-1.5 text-[11.5px] xl:text-[12px] cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? "text-[#15181a] font-semibold"
                          : "text-[#cbd5e1] hover:text-white font-medium"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="vex-desktop-capsule-pill"
                          transition={{
                            type: "spring",
                            stiffness: 520,
                            damping: 38,
                          }}
                          className="absolute inset-0 rounded-full bg-[#d4fb35] shadow-xs"
                        />
                      )}
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#15181a]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                      {tab.id === "resume" && unsupportedClaimCount > 0 && (
                        <motion.span
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.4,
                            ease: "easeInOut",
                          }}
                          className="relative z-10 ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c9332b] px-1 text-[9.5px] font-bold text-white"
                        >
                          {unsupportedClaimCount}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Secondary Circular Tool Icons */}
              <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
                {SECONDARY_ICON_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  const active = item.id ? activeSection === item.id : false;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      title={item.label}
                      aria-label={item.label}
                      onClick={() => {
                        if (item.onClickType === "coach") {
                          setCoachOpen(true);
                        } else if (item.id) {
                          setActiveSection(item.id);
                        }
                      }}
                      className={`flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full border hover:-translate-y-0.5 cursor-pointer ${
                        active
                          ? "bg-[#1f2224] border-[#1f2224] text-[#d4fb35] shadow-sm"
                          : "bg-white/85 border-white text-[#475569] hover:bg-white hover:text-[#181b1e] shadow-2xs"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
              {unsupportedClaimCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveSection("resume")}
                  title="CV Truth Lock Active — review unsupported claim"
                  className="hidden 2xl:inline-flex items-center gap-1.5 rounded-full bg-[#fef2f2] border border-[#fecaca] px-3 py-1.5 text-[11px] font-semibold text-[#c9332b] hover:bg-[#fee2e2] cursor-pointer"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Truth Lock ({unsupportedClaimCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSprintOpen(true)}
                title="24h Sprint Progress"
                className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-white px-3 py-1.5 text-[11.5px] font-medium text-[#181b1e] shadow-2xs hover:bg-white hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-[#181b1e] fill-[#d4fb35]" />
                <span>
                  {sprintCompletedCount}/{sprintMilestones.length} Sprint
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("alerts")}
                aria-label="Notifications"
                title="Hermes Alerts"
                className={`relative flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full border hover:-translate-y-0.5 cursor-pointer ${
                  activeSection === "alerts"
                    ? "bg-[#1f2224] border-[#1f2224] text-[#d4fb35]"
                    : "bg-white/90 border-white text-[#475569] hover:bg-white hover:text-[#181b1e]"
                }`}
              >
                <Bell className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                {unreadAlertCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2.6 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d4fb35] border border-[#1f2224] px-1 text-[9px] font-bold text-[#15181a]"
                  >
                    {unreadAlertCount}
                  </motion.span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("settings")}
                aria-label="Settings, Billing & Oracle"
                title="Themis Privacy, Plutus Billing & Apollo Oracle"
                className={`flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full border hover:-translate-y-0.5 cursor-pointer ${
                  activeSection === "settings"
                    ? "bg-[#1f2224] border-[#1f2224] text-[#d4fb35]"
                    : "bg-white/90 border-white text-[#475569] hover:bg-white hover:text-[#181b1e]"
                }`}
              >
                <Settings className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("profile")}
                title={`${state.profile.name} · ${state.preferences.plan} Plan`}
                className="flex items-center rounded-full bg-white/90 border border-white p-0.5 hover:bg-white hover:-translate-y-0.5 shadow-2xs cursor-pointer"
              >
                <img
                  src="/images/vex-philosopher.jpg"
                  alt={state.profile.name}
                  className="h-7 w-7 xl:h-8 xl:w-8 rounded-full object-cover object-top"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile & Tablet Liquid-Glass Sticky Compact Header (< 1024px) */}
        <MobileHeader />

        {/* Body Layout: Animated Collapsible Desktop Sidebar + Main Canvas */}
        <div className="flex-1 w-full max-w-[1620px] mx-auto flex items-start gap-3.5 xl:gap-5 px-4 lg:px-5 xl:px-7 pt-3 lg:pt-4 pb-28 lg:pb-10">
          {/* Desktop Floating Frosted Glass Sidebar */}
          <motion.aside
            aria-label="Workspace sidebar"
            initial={false}
            animate={{ width: sidebarCollapsed ? 76 : 220 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="hidden lg:flex shrink-0 sticky top-[76px] max-h-[calc(100vh-96px)] flex-col justify-between rounded-[28px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_14px_38px_rgba(140,160,185,0.14)] p-2.5 overflow-hidden no-print"
          >
            {/* Sidebar Nav Groups */}
            <nav className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-1">
              {SIDEBAR_GROUPS.map((grp) => {
                const items = SIDEBAR_ITEMS.filter((it) => it.group === grp);
                return (
                  <div key={grp} className="space-y-1">
                    {!sidebarCollapsed ? (
                      <p className="px-3 pt-1 font-mono-code text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#8c96a3]">
                        {grp}
                      </p>
                    ) : (
                      <div className="mx-3 my-1.5 h-px bg-slate-200/70" />
                    )}

                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.id;
                      const badge = getBadge(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveSection(item.id)}
                          title={sidebarCollapsed ? item.label : undefined}
                          className={`group relative w-full flex items-center ${
                            sidebarCollapsed
                              ? "justify-center px-0 py-2.5"
                              : "justify-between px-3 py-2"
                          } rounded-[16px] text-left cursor-pointer`}
                        >
                          {active && (
                            <motion.span
                              layoutId="vex-sidebar-active-pill"
                              transition={{
                                type: "spring",
                                stiffness: 480,
                                damping: 36,
                              }}
                              className="absolute inset-0 rounded-[16px] bg-[#1f2224] shadow-[0_6px_16px_rgba(24,27,30,0.18)]"
                            />
                          )}

                          <span className="relative z-10 flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                active
                                  ? "text-[#d4fb35]"
                                  : "text-[#6c7581] group-hover:text-[#181b1e]"
                              }`}
                            />
                            {!sidebarCollapsed && (
                              <span
                                className={`text-[12px] truncate ${
                                  active
                                    ? "font-semibold text-white"
                                    : "font-medium text-[#475569] group-hover:text-[#181b1e]"
                                }`}
                              >
                                {item.label}
                              </span>
                            )}
                          </span>

                          {!sidebarCollapsed && badge && (
                            <span
                              className={`relative z-10 rounded-full px-1.5 py-0.5 font-mono-code text-[9.5px] font-bold ${
                                badge.tone === "bad"
                                  ? "bg-[#c9332b] text-white"
                                  : badge.tone === "lime"
                                  ? active
                                    ? "bg-[#d4fb35] text-[#15181a]"
                                    : "bg-[#d4fb35]/80 text-[#15181a]"
                                  : active
                                  ? "bg-white/15 text-white"
                                  : "bg-[#e9eff6] text-[#475569]"
                              }`}
                            >
                              {badge.text}
                            </span>
                          )}

                          {sidebarCollapsed && badge && (
                            <span
                              className={`absolute top-1.5 right-2 z-10 h-2 w-2 rounded-full ${
                                badge.tone === "bad"
                                  ? "bg-[#c9332b]"
                                  : "bg-[#d4fb35] ring-1 ring-[#1f2224]"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            {/* Bottom 24h Sprint Mini Card inside Sidebar */}
            <div className="pt-2 border-t border-slate-200/70">
              {!sidebarCollapsed ? (
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSprintOpen(true)}
                  className="w-full rounded-[20px] bg-[#1f2224] p-3 text-left text-white shadow-sm cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 font-mono-code text-[10px] font-semibold text-[#d4fb35]">
                      <Zap className="h-3 w-3" />
                      <span>24H SPRINT</span>
                    </span>
                    <span className="font-mono-code text-[10px] text-slate-300">
                      {sprintCompletedCount}/{sprintMilestones.length}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${readinessPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-1 rounded-full vex-striped-lime"
                    />
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSprintOpen(true)}
                  title={`24h Sprint ${sprintCompletedCount}/${sprintMilestones.length}`}
                  className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f2224] text-[#d4fb35] shadow-sm cursor-pointer"
                >
                  <Zap className="h-4.5 w-4.5" />
                </motion.button>
              )}
            </div>
          </motion.aside>

          {/* Main Workspace Canvas */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>

        {/* Mobile Liquid-Glass Capsule Bottom Dock (< 1024px) */}
        <MobileTabBar />

        {/* Guided Modals */}
        <SprintModal />
        <CoachGuideModal />
        <LauncherModal />

        {/* Animated Live Toast Feed */}
        <div className="fixed bottom-24 lg:bottom-5 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-xs w-[calc(100%-2rem)] sm:w-full pointer-events-none no-print">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                onClick={() => dismissToast(t.id)}
                className={`pointer-events-auto rounded-2xl border px-4 py-3 text-xs font-medium shadow-xl cursor-pointer backdrop-blur-md ${
                  t.tone === "bad"
                    ? "border-[#fecaca] bg-[#fef2f2]/95 text-[#991b1b]"
                    : t.tone === "warn"
                    ? "border-[#fde68a] bg-[#fffaeb]/95 text-[#92400e]"
                    : t.tone === "good"
                    ? "border-[#d4fb35] bg-[#1f2224]/95 text-[#d4fb35]"
                    : "border-white/20 bg-[#222528]/95 text-white"
                }`}
              >
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
