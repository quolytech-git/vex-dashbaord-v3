"use client";

import React, { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileUp,
  MessageCircle,
  PlayCircle,
  Send,
} from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  ScoreInfo,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export function LearningView() {
  const { state, completeLearningQuiz, pushToast } = useVexWorkspace();

  const [step, setStep] = useState<
    "videos" | "quiz" | "pdf" | "tutor" | "skills"
  >("quiz");
  const [selectedModId, setSelectedModId] = useState(
    state.learning[0]?.id || ""
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tutorInput, setTutorInput] = useState("");
  const [tutorThread, setTutorThread] = useState([
    {
      q: "Why does SQL Cohort Diagnostics matter for Product Ops?",
      a: "Aristotle hint: Aggregate weekly totals mix new signups with legacy users. Cohort anchoring isolates the causal Day-7 lift from an onboarding change.",
    },
  ]);

  const activeModule =
    state.learning.find((m) => m.id === selectedModId) || state.learning[0];

  const demonstratedCount = state.profile.skills.filter(
    (s) => s.level === "Demonstrated in Vex" || s.level === "Verified"
  ).length;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Learning Academy"
        subtitle="Close real job-requirement gaps and upgrade skills from Self-reported to Demonstrated in Vex."
      />

      <MobilePhilosopherPill
        philosopher="aristotle"
        guidance="Pass a short empirical proof check quiz below to upgrade your skill evidence tier in real time across Jobs and Profile."
      />

      {/* Top Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Skills Proven</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {demonstratedCount}/{state.profile.skills.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Quizzes Passed</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.learning.filter((m) => m.quizPassed).length}/
                {state.learning.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Roles Unlocked</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {activeModule.rolesUnlocked}
              </p>
            </div>
          </div>

          <div className="h-2.5 w-full rounded-full bg-white/80 p-0.5">
            <div
              className="h-1.5 rounded-full vex-striped-lime"
              style={{
                width: `${Math.round(
                  (demonstratedCount / state.profile.skills.length) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6c7581]">
              Recommended Gap Target
            </span>
            <Pill tone="lime">{activeModule.salaryBoost}</Pill>
          </div>
          <h2 className="font-display text-2xl font-normal text-[#181b1e]">
            {activeModule.title}
          </h2>
          <p className="text-xs text-[#6c7581]">
            Upgrades &ldquo;{activeModule.skillTarget}&rdquo; to Demonstrated in Vex.
          </p>
        </div>
      </div>

      {/* 5-Step Dark Studio */}
      <NotchedDarkStudio
        leftHeading="5-Step Aristotle Curriculum"
        activeTab={step}
        onTabChange={setStep}
        tabs={[
          { id: "videos", label: "01 Lessons" },
          { id: "quiz", label: "02 Proof Quiz" },
          { id: "pdf", label: "03 PDF Scan" },
          { id: "tutor", label: "04 AI Tutor" },
          { id: "skills", label: "05 Skill Matrix" },
        ]}
      >
        {step === "quiz" && activeModule && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 space-y-2.5">
              {state.learning.map((m) => {
                const selected = m.id === activeModule.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModId(m.id)}
                    className={`w-full flex items-center justify-between gap-2 rounded-[20px] px-4 py-3.5 text-left cursor-pointer ${
                      selected
                        ? "bg-[#7898b0] text-white"
                        : "bg-[#2c3033] text-slate-200"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{m.title}</p>
                      <p className="text-[10.5px] opacity-75">
                        {m.durationMin}m · {m.salaryBoost}
                      </p>
                    </div>
                    <Pill tone={m.quizPassed ? "lime" : "glass"}>
                      {m.quizPassed ? "Passed" : "Quiz"}
                    </Pill>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-8 rounded-[26px] bg-[#7898b0] p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[10px] uppercase text-[#d4fb35]">
                  EMPIRICAL PROOF CHECK
                </span>
                <Pill tone={activeModule.quizPassed ? "lime" : "glass"}>
                  {activeModule.quizPassed ? "Demonstrated ✓" : "Pending"}
                </Pill>
              </div>
              <h3 className="text-base font-semibold leading-snug">
                {activeModule.question}
              </h3>
              <div className="space-y-2">
                {activeModule.options.map((opt, idx) => {
                  const chosen = answers[activeModule.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setAnswers((p) => ({ ...p, [activeModule.id]: idx }))
                      }
                      className={`w-full rounded-[18px] p-3.5 text-left text-xs transition-all cursor-pointer ${
                        chosen
                          ? "bg-[#d4fb35] text-[#15181a] font-semibold"
                          : "bg-white/15 text-white hover:bg-white/22"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <VexButton
                variant="dark"
                onClick={() =>
                  completeLearningQuiz(
                    activeModule.id,
                    answers[activeModule.id] ?? -1
                  )
                }
              >
                Verify & Upgrade Skill Evidence
              </VexButton>
            </div>
          </div>
        )}

        {step === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {state.learning.map((m) => (
              <div
                key={m.id}
                className="rounded-[22px] bg-[#2c3033] p-5 space-y-3"
              >
                <div className="h-28 rounded-[16px] bg-[#7898b0]/30 flex items-center justify-center">
                  <PlayCircle className="h-10 w-10 text-[#d4fb35]" />
                </div>
                <p className="text-xs font-semibold text-white">{m.title}</p>
                <p className="text-[11px] text-slate-400">
                  {m.durationMin} min lecture · {m.rolesUnlocked} unlocked roles
                </p>
                <VexButton
                  variant="lime"
                  size="sm"
                  onClick={() => {
                    setSelectedModId(m.id);
                    setStep("quiz");
                  }}
                >
                  Open Proof Quiz
                </VexButton>
              </div>
            ))}
          </div>
        )}

        {step === "pdf" && (
          <div className="rounded-[24px] bg-[#7898b0] p-6 text-white max-w-xl space-y-4">
            <FileUp className="h-7 w-7 text-[#d4fb35]" />
            <h3 className="font-display text-2xl font-normal">
              PDF Syllabus Gap Scanner
            </h3>
            <p className="text-xs text-white/90">
              Drop a role spec or certification syllabus PDF to map missing empirical checks directly onto your Aristotle track.
            </p>
            <VexButton
              variant="lime"
              onClick={() =>
                pushToast(
                  "Scanned syllabus: matched SQL Cohort & Experiment Design gaps",
                  "good"
                )
              }
            >
              Simulate Northbridge Spec Scan
            </VexButton>
          </div>
        )}

        {step === "tutor" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-2.5">
              {tutorThread.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[20px] bg-[#2c3033] p-4 space-y-1.5"
                >
                  <p className="text-xs font-semibold text-[#d4fb35]">
                    You: {item.q}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="Ask Aristotle Socratic Tutor..."
                className="flex-1 rounded-full bg-[#2c3033] px-4 py-2.5 text-xs text-white outline-none"
              />
              <VexButton
                variant="lime"
                onClick={() => {
                  if (!tutorInput.trim()) return;
                  setTutorThread((p) => [
                    ...p,
                    {
                      q: tutorInput.trim(),
                      a: "Socratic check: What single metric distinguishes correlation from causal improvement in your last launch checklist?",
                    },
                  ]);
                  setTutorInput("");
                }}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Ask</span>
              </VexButton>
            </div>
          </div>
        )}

        {step === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.profile.skills.map((sk) => (
              <div
                key={sk.id}
                className="rounded-[20px] bg-[#2c3033] p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{sk.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sk.evidence}
                  </p>
                </div>
                <Pill
                  tone={
                    sk.level === "Verified"
                      ? "lime"
                      : sk.level === "Demonstrated in Vex"
                      ? "good"
                      : "glass"
                  }
                >
                  {sk.level}
                </Pill>
              </div>
            ))}
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
