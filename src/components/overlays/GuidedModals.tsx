"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle2,
  Circle,
  Compass,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Puzzle,
  Settings,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Modal, Pill, VexButton } from "@/components/kit/Kit";
import { PHILOSOPHERS } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { NavSection, PhilosopherId } from "@/types/vex";

export function SprintModal() {
  const {
    sprintOpen,
    setSprintOpen,
    sprintMilestones,
    sprintCompletedCount,
    readinessPct,
    setActiveSection,
  } = useVexWorkspace();

  return (
    <Modal
      open={sprintOpen}
      onClose={() => setSprintOpen(false)}
      title="24h Readiness Sprint"
      subtitle="Seven real workspace milestones that advance automatically as you verify facts, resolve CV diffs, and practice."
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5">
        <div className="rounded-[24px] bg-[#222528] p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono-code text-[11px] text-[#d4fb35]">
              <Zap className="h-4 w-4" />
              <span>LIVE WORKSPACE PROGRESS</span>
            </span>
            <Pill tone="lime">
              {sprintCompletedCount}/{sprintMilestones.length} Complete
            </Pill>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-4xl font-normal tracking-tight text-white">
              {readinessPct}%
            </span>
            <span className="text-xs text-slate-300">
              of first-day readiness milestones verified
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full vex-striped-lime transition-all duration-300"
              style={{ width: `${readinessPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {sprintMilestones.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveSection(m.targetSection);
                setSprintOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 rounded-[20px] border p-3.5 text-left transition-colors cursor-pointer ${
                m.done
                  ? "border-[#abefc6] bg-[#ecfdf3]/80"
                  : "border-slate-200/80 bg-white hover:bg-[#e9eff6]/60"
              }`}
            >
              <div className="flex items-start gap-3">
                {m.done ? (
                  <CheckCircle2 className="h-5 w-5 text-[#0e7c4d] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-semibold text-[#181b1e]">
                    0{idx + 1}. {m.label}
                  </p>
                  <p className="text-[11px] text-[#6c7581] mt-0.5">{m.detail}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#6c7581] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

const COACH_STEPS: {
  philosopher: PhilosopherId;
  section: NavSection;
  heading: string;
  body: string;
  invariant: string;
}[] = [
  {
    philosopher: "aristotle",
    section: "dashboard",
    heading: "1. Honest Command & No Mystery Scores",
    body: "Start on Dashboard Overview to see your exact Next Best Action and the 6-check 'Is it ready?' audit. Every percentage carries a `?` popover explaining what it measures — and what it refuses to promise.",
    invariant: "Invariant: Transparent metrics, never fake odds.",
  },
  {
    philosopher: "plato",
    section: "jobs",
    heading: "2. Weigh Role Fit Before Investing Energy",
    body: "In Jobs Discovery, switch between the Master-Detail Matrix and Pergament Swipe deck. Inspect sentence-by-sentence evidence against your Canonical Profile before spending tailoring effort.",
    invariant: "Invariant: Undisclosed salaries and stale roles are flagged upfront.",
  },
  {
    philosopher: "davinci",
    section: "resume",
    heading: "3. Da Vinci Truth Lock Before Export",
    body: "Every proposed CV edit sits in Tracked Revisions with its exact source citation. Unsupported metrics trigger a Truth Lock that blocks PDF/DOCX export until replaced with real numbers or rejected.",
    invariant: "Invariant: Zero invented metrics ever ship.",
  },
  {
    philosopher: "hermes",
    section: "tracker",
    heading: "4. Three-State Human-in-the-Loop Tracker",
    body: "Applications clearly distinguish Prepared (draft only), User-reported submitted, and Verified submitted (with confirmation hash). Vex never submits to employers behind your back.",
    invariant: "Invariant: Always stop before final Submit.",
  },
  {
    philosopher: "socrates",
    section: "interviews",
    heading: "5. Empirical Skill & Interview Proof",
    body: "Use Socrates & Marcus in Interview Studio to score STAR structure honestly, and pass Aristotle's proof checks in Learning Academy to upgrade Self-reported skills to Demonstrated in Vex.",
    invariant: "Invariant: Skills upgrade through real proof, not checkboxes.",
  },
];

export function CoachGuideModal() {
  const { coachOpen, setCoachOpen, setActiveSection } = useVexWorkspace();
  const [stepIdx, setStepIdx] = useState(0);

  const step = COACH_STEPS[stepIdx];
  const mentor = PHILOSOPHERS[step.philosopher];

  useEffect(() => {
    if (!coachOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setStepIdx((i) => Math.min(COACH_STEPS.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setStepIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [coachOpen]);

  return (
    <Modal
      open={coachOpen}
      onClose={() => setCoachOpen(false)}
      title="Philosopher Coach Guide"
      subtitle="Interactive walkthrough of Vex's truth-first career workflow (use ← / → keys)."
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5">
        <div className="rounded-[24px] bg-[#222528] p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="h-9 w-9 rounded-full border border-white/30 object-cover object-top"
              />
              <span className="font-mono-code text-[10.5px] uppercase tracking-wider text-[#d4fb35]">
                {mentor.name} · {mentor.title}
              </span>
            </div>
            <Pill tone="glass">
              Step {stepIdx + 1} / {COACH_STEPS.length}
            </Pill>
          </div>
          <h3 className="font-display text-2xl font-normal tracking-tight text-white">
            {step.heading}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{step.body}</p>
          <p className="font-mono-code text-[11px] text-[#7898b0] pt-1">
            {step.invariant}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <VexButton
            variant="white"
            size="sm"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </VexButton>

          <VexButton
            variant="lime"
            size="sm"
            onClick={() => {
              setActiveSection(step.section);
              setCoachOpen(false);
            }}
          >
            Jump to this Screen
          </VexButton>

          {stepIdx < COACH_STEPS.length - 1 ? (
            <VexButton
              variant="dark"
              size="sm"
              onClick={() =>
                setStepIdx((i) => Math.min(COACH_STEPS.length - 1, i + 1))
              }
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </VexButton>
          ) : (
            <VexButton
              variant="dark"
              size="sm"
              onClick={() => setCoachOpen(false)}
            >
              Finish Tour
            </VexButton>
          )}
        </div>
      </div>
    </Modal>
  );
}

const ALL_MODULES: {
  pillar: string;
  items: {
    id: NavSection;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}[] = [
  {
    pillar: "Command & Discover",
    items: [
      { id: "dashboard", label: "Overview", desc: "Readiness checks & pipeline telemetry", icon: LayoutDashboard },
      { id: "jobs", label: "Jobs Discovery", desc: "Plato matrix & Pergament swipe deck", icon: Briefcase },
    ],
  },
  {
    pillar: "Prepare",
    items: [
      { id: "resume", label: "Resume Atelier", desc: "Da Vinci diffs, 8 templates & Truth Lock", icon: FileText },
      { id: "cover-letters", label: "Cover Letters", desc: "Cicero cited proof letters", icon: Mail },
      { id: "profile", label: "Profile & Codex", desc: "Canonical facts, radar & GitHub", icon: UserCheck },
    ],
  },
  {
    pillar: "Apply",
    items: [
      { id: "tracker", label: "Applications Tracker", desc: "3-state ledger & email parser", icon: KanbanSquare },
      { id: "extension", label: "Vex Extension", desc: "ATS autofill guardrails & permissions", icon: Puzzle },
      { id: "network", label: "Network Council", desc: "Warm intros & outreach drafts", icon: Users },
    ],
  },
  {
    pillar: "Improve & System",
    items: [
      { id: "interviews", label: "Interview Studio", desc: "Socrates & Marcus live STAR drills", icon: MessageSquareText },
      { id: "learning", label: "Learning Academy", desc: "Aristotle quizzes upgrade skills", icon: BookOpen },
      { id: "assistant", label: "Zeus AI & MCP Forge", desc: "Approval-first planner & tools", icon: Bot },
      { id: "alerts", label: "Hermes Alerts", desc: "Quiet hours & deadline ledger", icon: Bell },
      { id: "settings", label: "Governance, Billing & Oracle", desc: "Themis, Plutus, Apollo & Help", icon: Settings },
    ],
  },
];

export function LauncherModal() {
  const {
    launcherOpen,
    setLauncherOpen,
    activeSection,
    setActiveSection,
    setSprintOpen,
    setCoachOpen,
  } = useVexWorkspace();

  return (
    <Modal
      open={launcherOpen}
      onClose={() => setLauncherOpen(false)}
      title="Vex Workspace Modules"
      subtitle="All 6 career pillars and 13 synchronized modules."
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <VexButton
            variant="lime"
            size="sm"
            onClick={() => {
              setLauncherOpen(false);
              setSprintOpen(true);
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Open 24h Sprint</span>
          </VexButton>
          <VexButton
            variant="dark"
            size="sm"
            onClick={() => {
              setLauncherOpen(false);
              setCoachOpen(true);
            }}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Coach Guide</span>
          </VexButton>
        </div>

        <div className="space-y-4">
          {ALL_MODULES.map((grp) => (
            <div key={grp.pillar} className="space-y-2">
              <p className="font-mono-code text-[10px] font-semibold uppercase tracking-wider text-[#6c7581]">
                {grp.pillar}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        setLauncherOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-[18px] border p-3 text-left transition-all cursor-pointer ${
                        active
                          ? "bg-[#222528] border-[#222528] text-white"
                          : "bg-white border-slate-200/80 text-[#181b1e] hover:bg-[#e9eff6]/70"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          active
                            ? "bg-[#d4fb35] text-[#15181a]"
                            : "bg-[#e9eff6] text-[#181b1e]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {item.label}
                        </p>
                        <p
                          className={`text-[11px] truncate ${
                            active ? "text-slate-300" : "text-[#6c7581]"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
