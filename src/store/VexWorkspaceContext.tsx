"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_WORKSPACE } from "@/data/seedWorkspace";
import type {
  ApplicationRecord,
  ApplicationTruthState,
  CanonicalProfile,
  CoverLetterDraft,
  DiffStatus,
  JobTriageState,
  McpAuditEntry,
  NavSection,
  NetworkContact,
  PhilosopherId,
  PipelineStage,
  ProofCase,
  VexWorkspaceState,
  WorkspacePreferences,
} from "@/types/vex";

const STORAGE_KEY = "vex_workspace_v3_state";

export interface SprintMilestone {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  targetSection: NavSection;
}

export interface ReadinessCheck {
  id: string;
  question: string;
  statusText: string;
  ok: boolean;
  targetSection: NavSection;
}

export interface NextBestAction {
  title: string;
  reason: string;
  ctaLabel: string;
  targetSection: NavSection;
  severity: "bad" | "warn" | "good";
}

interface ToastMessage {
  id: string;
  text: string;
  tone: "good" | "warn" | "bad" | "info";
}

interface VexWorkspaceContextValue {
  state: VexWorkspaceState;
  hydrated: boolean;
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  goBack: () => void;
  canGoBack: boolean;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  sprintOpen: boolean;
  setSprintOpen: (open: boolean) => void;
  coachOpen: boolean;
  setCoachOpen: (open: boolean) => void;
  launcherOpen: boolean;
  setLauncherOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  pushToast: (text: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: string) => void;

  // Derived truth & telemetry invariants
  unsupportedClaimCount: number;
  truthLockActive: boolean;
  profileChecksDone: number;
  sprintMilestones: SprintMilestone[];
  sprintCompletedCount: number;
  readinessChecks: ReadinessCheck[];
  readinessCompletedCount: number;
  readinessPct: number;
  nextBestAction: NextBestAction;
  unreadAlertCount: number;

  // Mutations
  triageJob: (jobId: string, triage: JobTriageState) => void;
  prepareApplicationFromJob: (jobId: string) => void;
  setActiveVariantId: (id: string) => void;
  resolveCvDiff: (
    diffId: string,
    decision: Exclude<DiffStatus, "pending">,
    editedReplacement?: string
  ) => void;
  addGroundedCvSuggestion: (prompt: string) => void;
  selectCvTemplate: (templateId: string) => void;
  updateCvSummary: (summary: string) => void;
  updateCvBullet: (bulletId: string, text: string) => void;
  addCvBullet: (text: string) => void;
  removeCvBullet: (bulletId: string) => void;
  updateCoverLetter: (
    id: string,
    patch: Partial<Pick<CoverLetterDraft, "tone" | "paragraphs" | "status">>
  ) => void;
  citeProofInCoverLetter: (letterId: string, proofId: string) => void;
  createCoverLetter: (company: string, role: string) => void;
  duplicateCoverLetter: (letterId: string) => void;
  deleteCoverLetter: (letterId: string) => void;
  updateApplicationStage: (appId: string, stage: PipelineStage) => void;
  markApplicationSubmitted: (
    appId: string,
    truthState: Exclude<ApplicationTruthState, "prepared">,
    hash?: string
  ) => void;
  toggleApplicationChecklist: (
    appId: string,
    field: keyof ApplicationRecord["checklist"]
  ) => void;
  updateApplicationNotes: (appId: string, notes: string) => void;
  addManualApplication: (input: {
    role: string;
    company: string;
    salary: string;
    notes: string;
  }) => void;
  logInterviewInvite: (company: string, role: string, dateText: string) => void;
  toggleDailyStep: (stepId: string) => void;
  updateProfile: (patch: Partial<CanonicalProfile>) => void;
  addCredential: (label: string) => void;
  removeCredential: (label: string) => void;
  addProofCase: (input: Omit<ProofCase, "id">) => void;
  toggleRepoFeatured: (repoId: string) => void;
  toggleRoadmapMilestone: (id: string) => void;
  toggleContactPinned: (id: string) => void;
  addContact: (input: Omit<NetworkContact, "id" | "pinned" | "lastTouch">) => void;
  submitInterviewDrill: (input: {
    company: string;
    role: string;
    track: "Behavioral" | "Technical" | "HR" | "Company-specific";
    seniority: "Mid" | "Senior" | "Lead";
    mentor: PhilosopherId;
    answerText: string;
    durationMin: number;
  }) => { score: number; feedback: string };
  completeLearningQuiz: (moduleId: string, selectedOption: number) => boolean;
  proposeZeusPlan: (prompt: string) => void;
  decideZeusPlan: (planId: string, decision: "executed" | "cancelled") => void;
  runMcpTool: (toolName: string) => McpAuditEntry;
  markAlertRead: (id: string) => void;
  snoozeAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  addPersonalReminder: (title: string, detail: string) => void;
  updatePreferences: (patch: Partial<WorkspacePreferences>) => void;
  changePlan: (plan: WorkspacePreferences["plan"]) => void;
  toggleExternalApp: (id: string) => void;
  dismissSampleBanner: () => void;
  resetWorkspace: () => void;
}

const VexWorkspaceContext = createContext<VexWorkspaceContextValue | null>(null);

export function VexWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<VexWorkspaceState>(SEED_WORKSPACE);
  const [hydrated, setHydrated] = useState(false);
  const [activeSection, setActiveSectionRaw] = useState<NavSection>("dashboard");
  const [history, setHistory] = useState<NavSection[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    SEED_WORKSPACE.jobs[0]?.id || null
  );
  const [sprintOpen, setSprintOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<VexWorkspaceState>;
        if (parsed && parsed.profile && parsed.jobs) {
          setState({ ...SEED_WORKSPACE, ...parsed });
        }
      }
    } catch {
      // keep seed state
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  const setActiveSection = useCallback((next: NavSection) => {
    setActiveSectionRaw((prev) => {
      if (prev !== next) {
        setHistory((h) => [...h.slice(-8), prev]);
      }
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setActiveSectionRaw("dashboard");
        return prev;
      }
      const last = prev[prev.length - 1];
      setActiveSectionRaw(last);
      return prev.slice(0, -1);
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (text: string, tone: ToastMessage["tone"] = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3800);
    },
    []
  );

  const unsupportedClaimCount = useMemo(
    () =>
      state.cvDiffs.filter(
        (d) => d.hasUnsupportedClaim && d.status === "pending"
      ).length,
    [state.cvDiffs]
  );

  const truthLockActive = unsupportedClaimCount > 0;

  const profileChecksDone = useMemo(() => {
    const p = state.profile;
    const checks = [
      Boolean(p.name.trim()),
      Boolean(p.targetRole.trim()),
      Boolean(p.workPattern),
      Boolean(p.headline.trim()),
      state.cvVariants.length > 0,
      p.skills.length >= 4,
    ];
    return checks.filter(Boolean).length;
  }, [state.profile, state.cvVariants.length]);

  const sprintMilestones: SprintMilestone[] = useMemo(() => {
    const savedJobs = state.jobs.filter((j) => j.triage === "saved").length;
    const verifiedOrReported = state.applications.filter(
      (a) => a.truthState === "verified" || a.truthState === "user_reported"
    ).length;
    const citedLetters = state.coverLetters.filter(
      (l) => l.citedProofIds.length > 0
    ).length;
    const upgradedSkills = state.profile.skills.filter(
      (s) => s.level !== "Self-reported"
    ).length;

    return [
      {
        id: "sp-1",
        label: "Canonical Profile Ready",
        detail: `${profileChecksDone}/6 core facts verified`,
        done: profileChecksDone === 6,
        targetSection: "profile",
      },
      {
        id: "sp-2",
        label: "CV Truth Lock Cleared",
        detail: truthLockActive
          ? `${unsupportedClaimCount} unsupported claim pending`
          : "Zero unverified numbers in active draft",
        done: !truthLockActive,
        targetSection: "resume",
      },
      {
        id: "sp-3",
        label: "Relevant Roles Shortlisted",
        detail: `${savedJobs} role(s) saved in Agora`,
        done: savedJobs >= 2,
        targetSection: "jobs",
      },
      {
        id: "sp-4",
        label: "Verified Proof Cited in Cover Letter",
        detail: `${citedLetters} letter(s) grounded in proof cases`,
        done: citedLetters >= 1,
        targetSection: "cover-letters",
      },
      {
        id: "sp-5",
        label: "Application Authoritatively Submitted",
        detail: `${verifiedOrReported} submitted (never auto-submitted)`,
        done: verifiedOrReported >= 1,
        targetSection: "tracker",
      },
      {
        id: "sp-6",
        label: "Mock Interview Practiced",
        detail: `${state.interviews.length} STAR session(s) logged`,
        done: state.interviews.length >= 1,
        targetSection: "interviews",
      },
      {
        id: "sp-7",
        label: "Skill Upgraded via Proof Check",
        detail: `${upgradedSkills}/${state.profile.skills.length} skills evidenced`,
        done: upgradedSkills >= 3 && state.learning.some((l) => l.quizPassed),
        targetSection: "learning",
      },
    ];
  }, [
    profileChecksDone,
    truthLockActive,
    unsupportedClaimCount,
    state.jobs,
    state.applications,
    state.coverLetters,
    state.interviews.length,
    state.profile.skills,
    state.learning,
  ]);

  const sprintCompletedCount = useMemo(
    () => sprintMilestones.filter((m) => m.done).length,
    [sprintMilestones]
  );

  const readinessChecks: ReadinessCheck[] = useMemo(() => {
    const saved = state.jobs.filter((j) => j.triage === "saved").length;
    const prepared = state.applications.filter(
      (a) => a.truthState === "prepared"
    ).length;
    const verified = state.applications.filter(
      (a) => a.truthState === "verified"
    ).length;
    const userReported = state.applications.filter(
      (a) => a.truthState === "user_reported"
    ).length;
    const pendingDiffs = state.cvDiffs.filter(
      (d) => d.status === "pending"
    ).length;

    return [
      {
        id: "rc-1",
        question: "Is my profile ready?",
        statusText:
          profileChecksDone === 6
            ? "Ready for applying"
            : `${profileChecksDone}/6 checks complete`,
        ok: profileChecksDone === 6,
        targetSection: "profile",
      },
      {
        id: "rc-2",
        question: "Have I found relevant jobs?",
        statusText: `${state.jobs.length} found · ${saved} saved`,
        ok: saved >= 2,
        targetSection: "jobs",
      },
      {
        id: "rc-3",
        question: "Which applications are ready?",
        statusText: truthLockActive
          ? `0 ready · ${unsupportedClaimCount} needs audit`
          : `${prepared} prepared & unlocked`,
        ok: !truthLockActive && prepared >= 0,
        targetSection: "tracker",
      },
      {
        id: "rc-4",
        question: "Which have actually been submitted?",
        statusText: `${verified} verified · ${userReported} self-reported`,
        ok: verified + userReported >= 1,
        targetSection: "tracker",
      },
      {
        id: "rc-5",
        question: "What do I need to improve?",
        statusText:
          pendingDiffs > 0 ? `${pendingDiffs} CV diff items` : "CV diffs clean",
        ok: pendingDiffs === 0,
        targetSection: "resume",
      },
      {
        id: "rc-6",
        question: "Am I prepared for an interview?",
        statusText: `Practised (${state.interviews.length} sessions)`,
        ok: state.interviews.length >= 1,
        targetSection: "interviews",
      },
    ];
  }, [
    state.jobs,
    state.applications,
    state.cvDiffs,
    state.interviews.length,
    profileChecksDone,
    truthLockActive,
    unsupportedClaimCount,
  ]);

  const readinessCompletedCount = useMemo(
    () => readinessChecks.filter((c) => c.ok).length,
    [readinessChecks]
  );

  const readinessPct = Math.round(
    (sprintCompletedCount / sprintMilestones.length) * 100
  );

  const nextBestAction: NextBestAction = useMemo(() => {
    if (truthLockActive) {
      return {
        title: `Fix ${unsupportedClaimCount} unsupported CV claim`,
        reason:
          "Export stays blocked until each unverified number is backed by real evidence or rejected.",
        ctaLabel: "Review CV",
        targetSection: "resume",
        severity: "bad",
      };
    }
    const preparedApps = state.applications.filter(
      (a) => a.truthState === "prepared"
    );
    if (preparedApps.length > 0) {
      return {
        title: `Review & submit ${preparedApps[0].company} packet`,
        reason:
          "Your tailored CV and proof citations are clean. Review notice period and submit manually via Vex Apply.",
        ctaLabel: "Open Tracker",
        targetSection: "tracker",
        severity: "warn",
      };
    }
    return {
      title: "Run targeted mock drill with Socrates",
      reason:
        "All CV drafts and packets are verified. Sharpen STAR metrics ahead of upcoming interviews.",
      ctaLabel: "Practice Interview",
      targetSection: "interviews",
      severity: "good",
    };
  }, [truthLockActive, unsupportedClaimCount, state.applications]);

  const unreadAlertCount = useMemo(
    () => state.alerts.filter((a) => a.unread && !a.snoozed).length,
    [state.alerts]
  );

  // Mutations
  const triageJob = useCallback(
    (jobId: string, triage: JobTriageState) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === jobId ? { ...j, triage } : j)),
      }));
      if (triage === "saved") {
        pushToast("Saved to shortlist (Amor Fati)", "good");
      } else if (triage === "passed") {
        pushToast("Moved to Passed (Ataraxia)", "info");
      }
    },
    [pushToast]
  );

  const prepareApplicationFromJob = useCallback(
    (jobId: string) => {
      const job = state.jobs.find((j) => j.id === jobId);
      if (!job) return;
      const existing = state.applications.find((a) => a.jobId === jobId);
      if (existing) {
        setActiveSection("tracker");
        pushToast(`Opened existing ${job.company} packet`, "info");
        return;
      }
      const newApp: ApplicationRecord = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        role: job.title,
        company: job.company,
        monogram: job.monogram,
        salary: job.salaryLabel,
        stage: "planned",
        truthState: "prepared",
        updatedAt: "Just now",
        source: "Vex Prepared",
        checklist: {
          cvVerified: !truthLockActive,
          letterAttached: false,
          noticeChecked: false,
        },
        notes: "Prepared from Agora fit audit. Review before manual submission.",
      };
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId ? { ...j, triage: "saved" } : j
        ),
        applications: [newApp, ...prev.applications],
      }));
      setActiveSection("tracker");
      pushToast(
        `Prepared ${job.company} packet (Prepared — not submitted)`,
        "good"
      );
    },
    [state.jobs, state.applications, truthLockActive, pushToast, setActiveSection]
  );

  const setActiveVariantId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeVariantId: id }));
  }, []);

  const resolveCvDiff = useCallback(
    (
      diffId: string,
      decision: Exclude<DiffStatus, "pending">,
      editedReplacement?: string
    ) => {
      setState((prev) => {
        const target = prev.cvDiffs.find((d) => d.id === diffId);
        if (!target) return prev;

        const nextDiffs = prev.cvDiffs.map((d) => {
          if (d.id !== diffId) return d;
          return {
            ...d,
            status: decision,
            proposed: editedReplacement?.trim()
              ? editedReplacement.trim()
              : d.proposed,
            hasUnsupportedClaim:
              decision === "accepted" && editedReplacement?.trim()
                ? false
                : decision === "rejected"
                ? false
                : d.hasUnsupportedClaim,
            sourceNote:
              decision === "accepted" && editedReplacement?.trim()
                ? "Verified by candidate edit"
                : d.sourceNote,
          };
        });

        const nextVariants = prev.cvVariants.map((v) => {
          if (v.id !== target.variantId) return v;
          if (decision === "rejected") {
            return { ...v, atsScore: Math.min(96, v.atsScore + 2) };
          }
          const finalLine = editedReplacement?.trim() || target.proposed;
          const updatedBullets = v.bullets.map((b) =>
            b.text === target.original
              ? { ...b, text: finalLine, verified: true, source: "Diff accepted" }
              : b
          );
          const updatedSummary = target.section.startsWith("Summary")
            ? finalLine
            : v.summary;
          return {
            ...v,
            summary: updatedSummary,
            bullets: updatedBullets,
            atsScore: Math.min(96, v.atsScore + 5),
          };
        });

        const stillBlocked = nextDiffs.some(
          (d) => d.hasUnsupportedClaim && d.status === "pending"
        );

        const nextApps = prev.applications.map((a) =>
          a.id === "app-northbridge"
            ? {
                ...a,
                checklist: { ...a.checklist, cvVerified: !stillBlocked },
              }
            : a
        );

        return {
          ...prev,
          cvDiffs: nextDiffs,
          cvVariants: nextVariants,
          applications: nextApps,
        };
      });

      pushToast(
        decision === "rejected"
          ? "Unsupported claim rejected — original kept safely"
          : "CV revision accepted into manuscript",
        "good"
      );
    },
    [pushToast]
  );

  const addGroundedCvSuggestion = useCallback(
    (prompt: string) => {
      const clean = prompt.trim();
      if (!clean) return;
      setState((prev) => {
        const variant = prev.cvVariants.find(
          (v) => v.id === prev.activeVariantId
        );
        if (!variant) return prev;

        const newDiff = {
          id: `diff-${Date.now()}`,
          section: "Experience · Grounded Addition",
          variantId: variant.id,
          original: variant.bullets[0]?.text || variant.summary,
          proposed: `${
            variant.bullets[0]?.text.replace(/\.$/, "") || "Coordinated launches"
          } with verified WCAG AA intake gates & 14 documented rollouts (per Proof #1 & #2).`,
          sourceNote: `Vex Scribe grounded response to "${clean.slice(0, 40)}"`,
          hasUnsupportedClaim: false,
          status: "pending" as const,
        };

        return {
          ...prev,
          cvDiffs: [newDiff, ...prev.cvDiffs],
          preferences: {
            ...prev.preferences,
            aiCreditsUsed: prev.preferences.aiCreditsUsed + 4,
          },
        };
      });
      pushToast("Vex Scribe drafted a grounded diff for review", "info");
    },
    [pushToast]
  );

  const selectCvTemplate = useCallback(
    (templateId: string) => {
      setState((prev) => ({
        ...prev,
        cvVariants: prev.cvVariants.map((v) =>
          v.id === prev.activeVariantId ? { ...v, templateId } : v
        ),
      }));
      pushToast("ATS-safe template applied to active variant", "good");
    },
    [pushToast]
  );

  const updateCvSummary = useCallback((summary: string) => {
    setState((prev) => ({
      ...prev,
      cvVariants: prev.cvVariants.map((v) =>
        v.id === prev.activeVariantId ? { ...v, summary } : v
      ),
    }));
  }, []);

  const updateCvBullet = useCallback((bulletId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      cvVariants: prev.cvVariants.map((v) =>
        v.id === prev.activeVariantId
          ? {
              ...v,
              bullets: v.bullets.map((b) =>
                b.id === bulletId ? { ...b, text } : b
              ),
            }
          : v
      ),
    }));
  }, []);

  const addCvBullet = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      setState((prev) => ({
        ...prev,
        cvVariants: prev.cvVariants.map((v) =>
          v.id === prev.activeVariantId
            ? {
                ...v,
                bullets: [
                  ...v.bullets,
                  {
                    id: `b-${Date.now()}`,
                    text: clean,
                    verified: true,
                    source: "Candidate entry",
                  },
                ],
              }
            : v
        ),
      }));
      pushToast("Added manuscript bullet", "good");
    },
    [pushToast]
  );

  const removeCvBullet = useCallback((bulletId: string) => {
    setState((prev) => ({
      ...prev,
      cvVariants: prev.cvVariants.map((v) =>
        v.id === prev.activeVariantId
          ? {
              ...v,
              bullets: v.bullets.filter((b) => b.id !== bulletId),
            }
          : v
      ),
    }));
  }, []);

  const updateCoverLetter = useCallback(
    (
      id: string,
      patch: Partial<Pick<CoverLetterDraft, "tone" | "paragraphs" | "status">>
    ) => {
      setState((prev) => ({
        ...prev,
        coverLetters: prev.coverLetters.map((l) =>
          l.id === id ? { ...l, ...patch, updatedAt: "Just now" } : l
        ),
      }));
    },
    []
  );

  const citeProofInCoverLetter = useCallback(
    (letterId: string, proofId: string) => {
      setState((prev) => {
        const proof = prev.profile.proofCases.find((p) => p.id === proofId);
        if (!proof) return prev;
        return {
          ...prev,
          coverLetters: prev.coverLetters.map((l) => {
            if (l.id !== letterId) return l;
            if (l.citedProofIds.includes(proofId)) return l;
            const citationSentence = `Additionally, ${proof.title} (${proof.metric}) demonstrates ${proof.summary.charAt(0).toLowerCase()}${proof.summary.slice(1)}`;
            const nextParagraphs = [...l.paragraphs];
            const insertIdx = Math.max(1, nextParagraphs.length - 1);
            nextParagraphs.splice(insertIdx, 0, citationSentence);
            return {
              ...l,
              citedProofIds: [...l.citedProofIds, proofId],
              paragraphs: nextParagraphs,
              status: "Cited & Ready",
              updatedAt: "Just now",
            };
          }),
        };
      });
      pushToast("Cited verified proof artifact into draft", "good");
    },
    [pushToast]
  );

  const createCoverLetter = useCallback(
    (company: string, role: string) => {
      const id = `cl-${Date.now()}`;
      const draft: CoverLetterDraft = {
        id,
        title: `${company} · ${role}`,
        company,
        role,
        tone: "Measured Executive",
        status: "Draft",
        updatedAt: "Just now",
        citedProofIds: [],
        paragraphs: [
          `Dear ${company} Hiring Team,`,
          `I am writing to express strong interest in the ${role} role. My background combines cross-team release governance with structured operational delivery.`,
          `I welcome the chance to walk through concrete evidence from my Vex Codex portfolio and discuss how I can support ${company}.`,
        ],
      };
      setState((prev) => ({
        ...prev,
        coverLetters: [draft, ...prev.coverLetters],
      }));
      pushToast(`Created cover letter draft for ${company}`, "good");
    },
    [pushToast]
  );

  const duplicateCoverLetter = useCallback(
    (letterId: string) => {
      setState((prev) => {
        const src = prev.coverLetters.find((l) => l.id === letterId);
        if (!src) return prev;
        const copy: CoverLetterDraft = {
          ...src,
          id: `cl-${Date.now()}`,
          title: `${src.title} (Copy)`,
          status: "Draft",
          updatedAt: "Just now",
        };
        return {
          ...prev,
          coverLetters: [copy, ...prev.coverLetters],
        };
      });
      pushToast("Duplicated cover letter draft", "info");
    },
    [pushToast]
  );

  const deleteCoverLetter = useCallback(
    (letterId: string) => {
      setState((prev) => {
        if (prev.coverLetters.length <= 1) return prev;
        return {
          ...prev,
          coverLetters: prev.coverLetters.filter((l) => l.id !== letterId),
        };
      });
      pushToast("Removed cover letter draft", "info");
    },
    [pushToast]
  );

  const updateApplicationStage = useCallback(
    (appId: string, stage: PipelineStage) => {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === appId ? { ...a, stage, updatedAt: "Just now" } : a
        ),
      }));
      pushToast(`Moved application to ${stage}`, "info");
    },
    [pushToast]
  );

  const markApplicationSubmitted = useCallback(
    (
      appId: string,
      truthState: Exclude<ApplicationTruthState, "prepared">,
      hash?: string
    ) => {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === appId
            ? {
                ...a,
                stage: a.stage === "planned" ? "applied" : a.stage,
                truthState,
                confirmationHash:
                  truthState === "verified"
                    ? hash || `vex-conf-${Math.random().toString(16).slice(2, 10)}`
                    : a.confirmationHash,
                updatedAt: "Just now",
              }
            : a
        ),
      }));
      pushToast(
        truthState === "verified"
          ? "Submission verified with confirmation hash"
          : "Marked as user-reported submitted",
        "good"
      );
    },
    [pushToast]
  );

  const toggleApplicationChecklist = useCallback(
    (appId: string, field: keyof ApplicationRecord["checklist"]) => {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === appId
            ? {
                ...a,
                checklist: {
                  ...a.checklist,
                  [field]: !a.checklist[field],
                },
              }
            : a
        ),
      }));
    },
    []
  );

  const updateApplicationNotes = useCallback((appId: string, notes: string) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === appId ? { ...a, notes, updatedAt: "Just now" } : a
      ),
    }));
  }, []);

  const addManualApplication = useCallback(
    (input: { role: string; company: string; salary: string; notes: string }) => {
      const app: ApplicationRecord = {
        id: `app-${Date.now()}`,
        role: input.role,
        company: input.company,
        monogram: input.company.trim().charAt(0).toUpperCase() || "V",
        salary: input.salary || "Salary undisclosed",
        stage: "planned",
        truthState: "prepared",
        updatedAt: "Just now",
        source: "Manual Entry",
        checklist: {
          cvVerified: !truthLockActive,
          letterAttached: false,
          noticeChecked: false,
        },
        notes: input.notes || "Logged manually in Applications Tracker.",
      };
      setState((prev) => ({
        ...prev,
        applications: [app, ...prev.applications],
      }));
      pushToast(`Added ${input.company} as Prepared packet`, "good");
    },
    [truthLockActive, pushToast]
  );

  const logInterviewInvite = useCallback(
    (company: string, role: string, dateText: string) => {
      setState((prev) => {
        const hit = prev.applications.find((a) =>
          a.company.toLowerCase().includes(company.toLowerCase().split(" ")[0])
        );
        const nextApps = hit
          ? prev.applications.map((a) =>
              a.id === hit.id
                ? {
                    ...a,
                    stage: "interviewing" as const,
                    updatedAt: dateText,
                    notes: `${a.notes} · Invite logged: ${dateText}`,
                  }
                : a
            )
          : [
              {
                id: `app-${Date.now()}`,
                role,
                company,
                monogram: company.charAt(0).toUpperCase() || "V",
                salary: "Disclosed on call",
                stage: "interviewing" as const,
                truthState: "user_reported" as const,
                updatedAt: dateText,
                source: "Manual Entry" as const,
                checklist: {
                  cvVerified: true,
                  letterAttached: true,
                  noticeChecked: true,
                },
                notes: `Interview invite logged (${dateText})`,
              },
              ...prev.applications,
            ];

        return {
          ...prev,
          applications: nextApps,
          alerts: [
            {
              id: `al-${Date.now()}`,
              category: "Interview",
              title: `Interview invite logged: ${company}`,
              detail: `${role} scheduled for ${dateText}`,
              timestamp: "Just now",
              unread: true,
              snoozed: false,
              targetSection: "interviews",
            },
            ...prev.alerts,
          ],
        };
      });
      pushToast(`Logged interview invite for ${company}`, "good");
    },
    [pushToast]
  );

  const toggleDailyStep = useCallback((stepId: string) => {
    setState((prev) => ({
      ...prev,
      dailySteps: prev.dailySteps.map((s) =>
        s.id === stepId ? { ...s, done: !s.done } : s
      ),
    }));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<CanonicalProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      }));
      pushToast("Canonical profile facts updated", "good");
    },
    [pushToast]
  );

  const addCredential = useCallback(
    (label: string) => {
      const clean = label.trim();
      if (!clean) return;
      setState((prev) => {
        if (prev.profile.credentials.includes(clean)) return prev;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            credentials: [...prev.profile.credentials, clean],
          },
        };
      });
      pushToast(`Added credential: ${clean}`, "good");
    },
    [pushToast]
  );

  const removeCredential = useCallback((label: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        credentials: prev.profile.credentials.filter((c) => c !== label),
      },
    }));
  }, []);

  const addProofCase = useCallback(
    (input: Omit<ProofCase, "id">) => {
      const next: ProofCase = {
        ...input,
        id: `proof-${Date.now()}`,
      };
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          proofCases: [next, ...prev.profile.proofCases],
        },
      }));
      pushToast(`Added verified proof case: ${input.title}`, "good");
    },
    [pushToast]
  );

  const toggleRepoFeatured = useCallback((repoId: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        repos: prev.profile.repos.map((r) =>
          r.id === repoId ? { ...r, featured: !r.featured } : r
        ),
      },
    }));
  }, []);

  const toggleRoadmapMilestone = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    }));
  }, []);

  const toggleContactPinned = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      ),
    }));
  }, []);

  const addContact = useCallback(
    (input: Omit<NetworkContact, "id" | "pinned" | "lastTouch">) => {
      const contact: NetworkContact = {
        ...input,
        id: `ct-${Date.now()}`,
        pinned: false,
        lastTouch: "Just now",
      };
      setState((prev) => ({
        ...prev,
        contacts: [contact, ...prev.contacts],
      }));
      pushToast(`Added ${input.name} to Network Council`, "good");
    },
    [pushToast]
  );

  const submitInterviewDrill = useCallback(
    (input: {
      company: string;
      role: string;
      track: "Behavioral" | "Technical" | "HR" | "Company-specific";
      seniority: "Mid" | "Senior" | "Lead";
      mentor: PhilosopherId;
      answerText: string;
      durationMin: number;
    }) => {
      const txt = input.answerText.trim();
      const hasNumbers = /\d+/.test(txt);
      const hasActionVerbs =
        /\b(built|led|designed|standardised|coordinated|reduced|verified|shipped)\b/i.test(
          txt
        );
      const wordCount = txt.split(/\s+/).filter(Boolean).length;
      const base = 66;
      const lenPts = Math.min(14, Math.round(wordCount / 5));
      const metricPts = hasNumbers ? 10 : 0;
      const verbPts = hasActionVerbs ? 8 : 3;
      const score = Math.min(97, base + lenPts + metricPts + verbPts);

      const feedback = [
        wordCount >= 35
          ? "Good Situation & Task framing."
          : "Expand Situation context slightly so stakes are clear.",
        hasNumbers
          ? "Strong concrete Result metric anchored in lived numbers."
          : "Add at least one verified metric (e.g., 14 releases or handoff cycle time).",
        hasActionVerbs
          ? "Ownership verbs read decisively."
          : "Clarify your personal Action rather than team 'we'.",
      ].join(" ");

      const session = {
        id: `int-${Date.now()}`,
        company: input.company,
        role: input.role,
        track: input.track,
        seniority: input.seniority,
        mentor: input.mentor,
        date: "Just now",
        durationMin: Math.max(1, input.durationMin),
        starScore: score,
        feedback,
        answerDraft: txt,
      };

      setState((prev) => ({
        ...prev,
        interviews: [session, ...prev.interviews],
        preferences: {
          ...prev.preferences,
          aiCreditsUsed: prev.preferences.aiCreditsUsed + 6,
        },
      }));
      pushToast(`STAR drill scored ${score}/100`, "good");
      return { score, feedback };
    },
    [pushToast]
  );

  const completeLearningQuiz = useCallback(
    (moduleId: string, selectedOption: number) => {
      const mod = state.learning.find((m) => m.id === moduleId);
      if (!mod) return false;
      const isCorrect = selectedOption === mod.correctIndex;
      if (!isCorrect) {
        pushToast(
          "Not quite — re-read the empirical framing and try again",
          "warn"
        );
        return false;
      }

      setState((prev) => ({
        ...prev,
        learning: prev.learning.map((m) =>
          m.id === moduleId ? { ...m, progress: 100, quizPassed: true } : m
        ),
        profile: {
          ...prev.profile,
          skills: prev.profile.skills.map((s) =>
            s.name === mod.skillTarget
              ? {
                  ...s,
                  level: "Demonstrated in Vex",
                  evidence: `Passed Aristotle proof check in ${mod.title}`,
                }
              : s
          ),
        },
      }));
      pushToast(
        `Upgraded "${mod.skillTarget}" to Demonstrated in Vex!`,
        "good"
      );
      return true;
    },
    [state.learning, pushToast]
  );

  const proposeZeusPlan = useCallback(
    (prompt: string) => {
      const clean = prompt.trim();
      if (!clean) return;
      const plan = {
        id: `zp-${Date.now()}`,
        prompt: clean,
        summary: `Reads Canonical Profile & Target Roles to prepare a grounded draft response to "${clean.slice(
          0,
          60
        )}" without submitting externally.`,
        reads: ["Canonical Profile", "CV Variants", "Job Fit Matrix"],
        writes: ["Draft Note / Checklist Update (Awaiting Approval)"],
        status: "awaiting_approval" as const,
        timestamp: "Just now",
      };
      setState((prev) => ({
        ...prev,
        zeusPlans: [plan, ...prev.zeusPlans],
      }));
      pushToast("Zeus drafted an approval-first execution plan", "info");
    },
    [pushToast]
  );

  const decideZeusPlan = useCallback(
    (planId: string, decision: "executed" | "cancelled") => {
      setState((prev) => ({
        ...prev,
        zeusPlans: prev.zeusPlans.map((p) =>
          p.id === planId ? { ...p, status: decision } : p
        ),
        preferences:
          decision === "executed"
            ? {
                ...prev.preferences,
                aiCreditsUsed: prev.preferences.aiCreditsUsed + 5,
              }
            : prev.preferences,
      }));
      pushToast(
        decision === "executed"
          ? "Authorised Zeus plan executed cleanly"
          : "Zeus action plan cancelled — nothing modified",
        decision === "executed" ? "good" : "info"
      );
    },
    [pushToast]
  );

  const runMcpTool = useCallback(
    (toolName: string): McpAuditEntry => {
      const blocked = toolName === "vex_cv_diff_audit" && truthLockActive;
      const entry: McpAuditEntry = {
        id: `mcp-${Date.now()}`,
        toolName,
        payloadSummary: blocked
          ? `Blocked: ${unsupportedClaimCount} unverified CV diff still pending`
          : `Executed ${toolName} cleanly against local canonical store`,
        status: blocked ? "blocked" : "ok",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setState((prev) => ({
        ...prev,
        mcpLogs: [entry, ...prev.mcpLogs],
      }));
      pushToast(
        `MCP sandbox: ${toolName} (${entry.status.toUpperCase()})`,
        blocked ? "warn" : "good"
      );
      return entry;
    },
    [truthLockActive, unsupportedClaimCount, pushToast]
  );

  const markAlertRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === id ? { ...a, unread: false } : a
      ),
    }));
  }, []);

  const snoozeAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === id ? { ...a, snoozed: true, unread: false } : a
      ),
    }));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => ({ ...a, unread: false })),
    }));
    pushToast("All alerts marked as read", "info");
  }, [pushToast]);

  const addPersonalReminder = useCallback(
    (title: string, detail: string) => {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            id: `al-${Date.now()}`,
            category: "Reminder",
            title,
            detail,
            timestamp: "Just now",
            unread: true,
            snoozed: false,
            targetSection: "tracker",
          },
          ...prev.alerts,
        ],
      }));
      pushToast("Personal Hermes reminder added", "good");
    },
    [pushToast]
  );

  const updatePreferences = useCallback(
    (patch: Partial<WorkspacePreferences>) => {
      setState((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...patch },
      }));
    },
    []
  );

  const changePlan = useCallback(
    (plan: WorkspacePreferences["plan"]) => {
      const limit = plan === "Free" ? 500 : plan === "Pro" ? 5000 : 25000;
      const amount = plan === "Free" ? "£0.00" : plan === "Pro" ? "£24.00" : "£59.00";
      setState((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          plan,
          aiCreditsLimit: limit,
        },
        invoices: [
          {
            id: `inv-${Date.now().toString().slice(-6)}`,
            date: "Today",
            planLabel: `Vex ${plan} (Switched)`,
            amount,
            status: "Active",
            method: "Visa •••• 4443",
          },
          ...prev.invoices,
        ],
      }));
      pushToast(`Switched billing tier to Vex ${plan}`, "good");
    },
    [pushToast]
  );

  const toggleExternalApp = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      externalApps: prev.externalApps.map((app) =>
        app.id === id ? { ...app, connected: !app.connected } : app
      ),
    }));
  }, []);

  const dismissSampleBanner = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, sampleBannerDismissed: true },
    }));
  }, []);

  const resetWorkspace = useCallback(() => {
    setState(SEED_WORKSPACE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    pushToast("Workspace reset to canonical sample state", "info");
  }, [pushToast]);

  return (
    <VexWorkspaceContext.Provider
      value={{
        state,
        hydrated,
        activeSection,
        setActiveSection,
        goBack,
        canGoBack: history.length > 0,
        selectedJobId,
        setSelectedJobId,
        sprintOpen,
        setSprintOpen,
        coachOpen,
        setCoachOpen,
        launcherOpen,
        setLauncherOpen,
        toasts,
        pushToast,
        dismissToast,
        unsupportedClaimCount,
        truthLockActive,
        profileChecksDone,
        sprintMilestones,
        sprintCompletedCount,
        readinessChecks,
        readinessCompletedCount,
        readinessPct,
        nextBestAction,
        unreadAlertCount,
        triageJob,
        prepareApplicationFromJob,
        setActiveVariantId,
        resolveCvDiff,
        addGroundedCvSuggestion,
        selectCvTemplate,
        updateCvSummary,
        updateCvBullet,
        addCvBullet,
        removeCvBullet,
        updateCoverLetter,
        citeProofInCoverLetter,
        createCoverLetter,
        duplicateCoverLetter,
        deleteCoverLetter,
        updateApplicationStage,
        markApplicationSubmitted,
        toggleApplicationChecklist,
        updateApplicationNotes,
        addManualApplication,
        logInterviewInvite,
        toggleDailyStep,
        updateProfile,
        addCredential,
        removeCredential,
        addProofCase,
        toggleRepoFeatured,
        toggleRoadmapMilestone,
        toggleContactPinned,
        addContact,
        submitInterviewDrill,
        completeLearningQuiz,
        proposeZeusPlan,
        decideZeusPlan,
        runMcpTool,
        markAlertRead,
        snoozeAlert,
        markAllAlertsRead,
        addPersonalReminder,
        updatePreferences,
        changePlan,
        toggleExternalApp,
        dismissSampleBanner,
        resetWorkspace,
      }}
    >
      {children}
    </VexWorkspaceContext.Provider>
  );
}

export function useVexWorkspace() {
  const ctx = useContext(VexWorkspaceContext);
  if (!ctx) {
    throw new Error("useVexWorkspace must be used within VexWorkspaceProvider");
  }
  return ctx;
}
