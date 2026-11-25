"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Copy,
  MessageSquareText,
  Mic,
  Play,
  Square,
} from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  ScoreInfo,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { PHILOSOPHERS } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { PhilosopherId } from "@/types/vex";

const TRACKS = ["Behavioral", "Technical", "HR", "Company-specific"] as const;
const SENIORITY = ["Mid", "Senior", "Lead"] as const;
const MENTORS: PhilosopherId[] = ["socrates", "marcus", "aristotle", "davinci"];

const QUESTIONS: Record<(typeof TRACKS)[number], string> = {
  Behavioral:
    "Tell me about a time a cross-functional launch nearly slipped. How did you establish release readiness without slowing engineering down?",
  Technical:
    "Walk through how you design deterministic API retry queues and accessible multi-step validation states for onboarding flows.",
  HR:
    "Why Product Operations Lead at this stage, and how do your 4-week notice period and hybrid expectations fit?",
  "Company-specific":
    "Meridian Advisory wants weekly executive briefs backed by SQL funnel cohorts. How would you structure your first 30 days?",
};

export function InterviewsView() {
  const { state, submitInterviewDrill, pushToast } = useVexWorkspace();

  const [studioTab, setStudioTab] = useState<"drill" | "history" | "followup">(
    "drill"
  );
  const [track, setTrack] = useState<(typeof TRACKS)[number]>("Behavioral");
  const [seniority, setSeniority] =
    useState<(typeof SENIORITY)[number]>("Senior");
  const [mentor, setMentor] = useState<PhilosopherId>("socrates");
  const [company, setCompany] = useState("Meridian Advisory");
  const [answer, setAnswer] = useState(
    "In Q3 at my previous team, ad-hoc launch spreadsheets caused support handoff gaps. I designed a Cross-Team Release Readiness Gate across engineering, QA, and support, resulting in 100% documented handoffs across 14 releases."
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [lastResult, setLastResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const handleScore = () => {
    setTimerRunning(false);
    const res = submitInterviewDrill({
      company,
      role: state.profile.targetRole,
      track,
      seniority,
      mentor,
      answerText: answer,
      durationMin: Math.max(1, Math.ceil(seconds / 60)),
    });
    setLastResult(res);
  };

  const avgStar = Math.round(
    state.interviews.reduce((s, i) => s + i.starScore, 0) /
      Math.max(1, state.interviews.length)
  );

  const thankYouTemplate = `Subject: Thank you — ${state.profile.targetRole} conversation (${company})\n\nHi team,\n\nThank you for today's discussion around ${track.toLowerCase()} decision-making and release governance. As mentioned, I'm attaching the brief summary of our 14-release Readiness Gate framework.\n\nBest regards,\n${state.profile.name}`;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Interview Studio"
        subtitle="Socratic pressure-testing & Marcus Stoic composure drills scored honestly against the STAR framework."
        actionLabel={timerRunning ? "Stop Timer" : "Start Live Timer"}
        actionIcon={
          timerRunning ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )
        }
        onAction={() => setTimerRunning((v) => !v)}
      />

      <MobilePhilosopherPill
        philosopher={mentor}
        guidance="Score your draft answer honestly against Situation, Task, Action, and concrete lived Result numbers."
      />

      {/* Top Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Mock Sessions</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.interviews.length}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-[#6c7581]">
                <span>Avg STAR Score</span>
                <ScoreInfo scoreKey="interview" />
              </p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {avgStar}
                <span className="text-sm text-[#6c7581] ml-1">/100</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Live Timer</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none font-mono-code">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="vex-snap-rail sm:flex sm:flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTrack(t)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                  track === t
                    ? "bg-[#1f2224] text-[#d4fb35]"
                    : "bg-white text-[#475569]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <p className="text-xs text-[#6c7581]">Switch Interview Mentor</p>
          <div className="grid grid-cols-4 gap-2">
            {MENTORS.map((m) => {
              const p = PHILOSOPHERS[m];
              const active = mentor === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMentor(m)}
                  className={`rounded-[18px] p-2.5 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? "bg-[#d4fb35] text-[#15181a]"
                      : "bg-[#eff3f8] text-[#181b1e]"
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-9 w-9 rounded-full object-cover object-top"
                  />
                  <span className="text-[10.5px] font-semibold">
                    {p.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <NotchedDarkStudio
        leftHeading="Dialectic & Composure Studio"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "drill", label: "Live STAR Drill" },
          { id: "history", label: "Analytics & History", count: state.interviews.length },
          { id: "followup", label: "Follow-Up Note" },
        ]}
      >
        {studioTab === "drill" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {SENIORITY.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeniority(s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
                      seniority === s
                        ? "bg-[#d4fb35] text-[#15181a]"
                        : "bg-[#2c3033] text-slate-300"
                    }`}
                  >
                    {s} Tier
                  </button>
                ))}
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-full bg-[#2c3033] px-3.5 py-1 text-xs text-white outline-none"
                />
              </div>

              <div className="rounded-[24px] bg-[#7898b0] p-5 text-white space-y-2">
                <p className="font-mono-code text-[10px] uppercase text-[#d4fb35]">
                  {PHILOSOPHERS[mentor].name} Prompt · {track} ({seniority})
                </p>
                <p className="text-sm font-medium leading-relaxed">
                  {QUESTIONS[track]}
                </p>
              </div>

              <textarea
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write or speak your STAR answer using concrete verified metrics..."
                className="w-full rounded-[22px] bg-[#2c3033] border border-white/10 p-4 text-xs leading-relaxed text-white outline-none"
              />

              <div className="flex items-center justify-between">
                <VexButton
                  variant="ghostDark"
                  onClick={() => setTimerRunning((v) => !v)}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timerRunning ? "Pause" : "Run Timer"}</span>
                </VexButton>
                <VexButton variant="lime" onClick={handleScore}>
                  <Mic className="h-3.5 w-3.5" />
                  <span>Score STAR Answer</span>
                </VexButton>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-[26px] bg-[#2c3033] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Honest Rubric Feedback
                </span>
                <ScoreInfo scoreKey="interview" dark />
              </div>

              {lastResult ? (
                <div className="rounded-[22px] bg-[#7898b0] p-5 text-white space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl font-normal">
                      {lastResult.score}
                    </span>
                    <Pill tone="lime">STAR Scored</Pill>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {lastResult.feedback}
                  </p>
                </div>
              ) : (
                <div className="rounded-[22px] bg-[#222528] p-5 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">
                    Ready to evaluate your STAR structure
                  </p>
                  <p>
                    Click &ldquo;Score STAR Answer&rdquo; to verify Situation framing, action ownership, and concrete numerical proof.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {studioTab === "history" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {state.interviews.map((sess) => (
              <div
                key={sess.id}
                className="rounded-[22px] bg-[#2c3033] p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {sess.company}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sess.track} · {sess.seniority} · {sess.date}
                    </p>
                  </div>
                  <Pill tone="lime">{sess.starScore}/100</Pill>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sess.feedback}
                </p>
              </div>
            ))}
          </div>
        )}

        {studioTab === "followup" && (
          <div className="rounded-[24px] bg-white text-[#181b1e] p-6 max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-medium">
                Grounded Thank-You Follow-Up
              </h3>
              <VexButton
                variant="dark"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(thankYouTemplate);
                  } catch {
                    // ignore
                  }
                  pushToast("Copied thank-you note", "good");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Note</span>
              </VexButton>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#475569]">
              {thankYouTemplate}
            </pre>
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
