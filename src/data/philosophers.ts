import type { CvTemplate, PhilosopherId } from "@/types/vex";

export interface PhilosopherMeta {
  id: PhilosopherId;
  name: string;
  title: string;
  maxim: string;
  domain: string;
  image: string;
  accentHex: string;
}

export const PHILOSOPHERS: Record<PhilosopherId, PhilosopherMeta> = {
  aristotle: {
    id: "aristotle",
    name: "Aristotle",
    title: "Empiricism & Readiness",
    maxim:
      "We are what we repeatedly verify. Readiness comes from evidence, not hope.",
    domain: "Command & Learning",
    image: "/images/aristotle-alexander-academy.jpg",
    accentHex: "#7898b0",
  },
  plato: {
    id: "plato",
    name: "Plato",
    title: "Agora Curator",
    maxim:
      "Weigh each requirement calmly against real proof before committing energy.",
    domain: "Jobs Discovery",
    image: "/images/raphael-athens.jpg",
    accentHex: "#7898b0",
  },
  davinci: {
    id: "davinci",
    name: "Leonardo da Vinci",
    title: "Proportion & Truth",
    maxim:
      "Never adorn a draft with unmeasured numbers; proportion requires exact facts.",
    domain: "Resume & Codex",
    image: "/images/davinci-codex.jpg",
    accentHex: "#222528",
  },
  cicero: {
    id: "cicero",
    name: "Cicero",
    title: "Classical Rhetoric",
    maxim:
      "Every persuasive claim must cite an anchor from your lived work.",
    domain: "Cover Letters",
    image: "/images/cicero-rhetoric-scroll.jpg",
    accentHex: "#7898b0",
  },
  socrates: {
    id: "socrates",
    name: "Socrates",
    title: "Dialectic Clarity",
    maxim:
      "Expose vague answers to gentle scrutiny until the real outcome stands clear.",
    domain: "Interview Prep",
    image: "/images/interview-socrates-dialectic.jpg",
    accentHex: "#222528",
  },
  marcus: {
    id: "marcus",
    name: "Marcus Aurelius",
    title: "Stoic Composure",
    maxim:
      "Amor fati — prepare thoroughly, accept the process calmly, own what is yours.",
    domain: "Interview & Sprint",
    image: "/images/interview-marcus-stoic.jpg",
    accentHex: "#d4fb35",
  },
  zeus: {
    id: "zeus",
    name: "Zeus",
    title: "Sovereign Gatekeeper",
    maxim:
      "Automation proposes; the candidate authorizes every external action.",
    domain: "AI Assistant",
    image: "/images/zeus-temple-crown.jpg",
    accentHex: "#222528",
  },
  hephaestus: {
    id: "hephaestus",
    name: "Hephaestus",
    title: "Craft & Connectors",
    maxim:
      "Inspect every schema and payload before forging a pipeline connection.",
    domain: "MCP Forge",
    image: "/images/hephaestus-mcp-forge.jpg",
    accentHex: "#7898b0",
  },
  hermes: {
    id: "hermes",
    name: "Hermes",
    title: "Swift & Honest Herald",
    maxim:
      "Deliver only signal worth acting on; never submit behind the user's back.",
    domain: "Alerts & Extension",
    image: "/images/hermes-messenger-alerts.jpg",
    accentHex: "#0e7c4d",
  },
  athena: {
    id: "athena",
    name: "Athena",
    title: "Applied Wisdom",
    maxim:
      "Move skills from self-reported assertion to demonstrated proof.",
    domain: "Skill Assessments",
    image: "/images/athena-strategy-owl.jpg",
    accentHex: "#7898b0",
  },
  themis: {
    id: "themis",
    name: "Themis",
    title: "Clear Governance",
    maxim:
      "Your facts belong to you — exportable in full, erasable in one step.",
    domain: "Privacy & Help",
    image: "/images/themis-governance-scales.jpg",
    accentHex: "#6c7581",
  },
  plutus: {
    id: "plutus",
    name: "Plutus",
    title: "Fair Accounting",
    maxim:
      "Transparent quotas and measurable effort saved, with zero hidden fees.",
    domain: "Billing & Quotas",
    image: "/images/plutus-treasury-ledger.jpg",
    accentHex: "#d4fb35",
  },
  apollo: {
    id: "apollo",
    name: "Apollo",
    title: "Market Foresight",
    maxim:
      "Read compensation bands and skill premiums with sober benchmarks.",
    domain: "Career Oracle",
    image: "/images/apollo-career-oracle.jpg",
    accentHex: "#7898b0",
  },
};

export interface ScoreDefinition {
  key: string;
  label: string;
  measures: string;
  doesNotPromise: string;
}

export const SCORE_DEFINITIONS: Record<string, ScoreDefinition> = {
  readiness: {
    key: "readiness",
    label: "Readiness score",
    measures:
      "How many of the 7 first-day readiness checks you have completed (profile, jobs, CV truth lock, applications, interview practice, skills).",
    doesNotPromise: "Your chance of getting an interview or a job.",
  },
  match: {
    key: "match",
    label: "Match %",
    measures:
      "The share of a job's listed requirements that your canonical profile has evidence for, weighted toward must-haves.",
    doesNotPromise: "A prediction that the employer will reply or hire you.",
  },
  cvQuality: {
    key: "cvQuality",
    label: "CV truth & quality",
    measures:
      "How many of Vex's CV checks pass: focused summary, concrete bullets, verified skills, and zero unsupported claims.",
    doesNotPromise: "How an individual human recruiter will subjectively rate your CV.",
  },
  ats: {
    key: "ats",
    label: "ATS score",
    measures:
      "How readable your CV is for applicant tracking parsers: single-column structure, standard headings, extractable text, and target keywords.",
    doesNotPromise: "That an ATS will automatically rank you at the top for a specific role.",
  },
  interview: {
    key: "interview",
    label: "Interview STAR score",
    measures:
      "Structure, clarity, and metric grounding of your practice answer checked against the Situation-Task-Action-Result outline.",
    doesNotPromise: "How a real interviewer or panel will score your live conversation.",
  },
  skillLevel: {
    key: "skillLevel",
    label: "Skill level",
    measures:
      "Vex's estimate from the evidence shown beside it (Self-reported -> CV-backed -> Demonstrated in Vex -> Verified).",
    doesNotPromise: "A formal professional certification unless explicitly marked Verified.",
  },
};

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: "editorial-clean",
    name: "Editorial Clean",
    category: "Executive",
    columns: "1-Column ATS",
    description:
      "Crisp section headers paired with dense, scannable impact bullets for product & ops leads.",
    accentColor: "#222528",
  },
  {
    id: "classic-single-col",
    name: "Classic Single-Col",
    category: "Minimal",
    columns: "1-Column ATS",
    description:
      "Traditional chronological hierarchy with ultra-clean section rules and 100% parser safety.",
    accentColor: "#181b1e",
  },
  {
    id: "executive-brief",
    name: "Executive Brief",
    category: "Executive",
    columns: "1-Column Compact",
    description:
      "Lead-heavy summary block highlighting cross-functional metrics above role chronology.",
    accentColor: "#7898b0",
  },
  {
    id: "systems-architect",
    name: "Systems Architect",
    category: "Technical",
    columns: "1-Column ATS",
    description:
      "Structured capability matrix at the top for frontend platform and technical operations roles.",
    accentColor: "#0e7c4d",
  },
  {
    id: "athenian-monograph",
    name: "Athenian Monograph",
    category: "Minimal",
    columns: "1-Column ATS",
    description:
      "Generous vertical breathing room and clean monospace metadata tags for design-minded roles.",
    accentColor: "#6c7581",
  },
  {
    id: "operator-ledger",
    name: "Operator Ledger",
    category: "Operations",
    columns: "1-Column Compact",
    description:
      "High-density delivery and SLA impact layout tailored for Product & Revenue Operations.",
    accentColor: "#2e67b2",
  },
  {
    id: "fellowship-folio",
    name: "Fellowship Folio",
    category: "Executive",
    columns: "1-Column ATS",
    description:
      "Balanced narrative + proof-case highlights suited for advisory and strategy roles.",
    accentColor: "#222528",
  },
  {
    id: "codex-precision",
    name: "Codex Precision",
    category: "Technical",
    columns: "1-Column ATS",
    description:
      "Zero-frills Greenhouse & Lever parser champion with bold measurable outcome callouts.",
    accentColor: "#1c1f22",
  },
];

export interface McpToolDef {
  name: string;
  server: string;
  mode: "read" | "write_gated";
  description: string;
  schemaExample: string;
}

export const MCP_TOOLS_CATALOG: McpToolDef[] = [
  {
    name: "vex_profile_read",
    server: "vex-codex-core",
    mode: "read",
    description:
      "Returns canonical profile facts, verified credentials, and skill evidence levels.",
    schemaExample: `{ "includeSkills": true, "includeProofCases": true }`,
  },
  {
    name: "vex_cv_diff_audit",
    server: "vex-davinci-atelier",
    mode: "read",
    description:
      "Scans pending CV variants for unverified numbers or claims not present in baseline facts.",
    schemaExample: `{ "variantId": "var-northbridge", "strictTruthLock": true }`,
  },
  {
    name: "vex_job_fit_audit",
    server: "vex-plato-agora",
    mode: "read",
    description:
      "Maps job requirements into has / transferable / improve / missing against canonical evidence.",
    schemaExample: `{ "jobId": "job-northbridge" }`,
  },
  {
    name: "vex_tracker_prepare_draft",
    server: "vex-hermes-ledger",
    mode: "write_gated",
    description:
      "Creates a Prepared (not submitted) packet in Applications Tracker. Never auto-submits.",
    schemaExample: `{ "jobId": "job-meridian", "requireHumanReview": true }`,
  },
];

export const APOLLO_BENCHMARKS = [
  {
    role: "Product Operations Lead (London Hybrid)",
    p25: "£66,000",
    median: "£78,000",
    p75: "£91,000",
    demandTrend: "+18% YoY",
    competition: "Medium (19 applicants / role)",
  },
  {
    role: "Senior Technical Product Ops (Fintech)",
    p25: "£72,000",
    median: "£84,000",
    p75: "£98,000",
    demandTrend: "+24% YoY",
    competition: "Low-Med (14 applicants / role)",
  },
  {
    role: "Frontend Platform Engineer (React / TS)",
    p25: "£74,000",
    median: "£86,000",
    p75: "£102,000",
    demandTrend: "+11% YoY",
    competition: "High (38 applicants / role)",
  },
];

export const HELP_FAQS = [
  {
    topic: "CV & Truth Lock",
    q: "Why does Vex block PDF/DOCX export on unsupported CV claims?",
    a: "Every proposed AI metric that does not trace back to your canonical profile or proof cases triggers a Truth Lock. You must either supply a real verified number or reject the suggestion before export unlocks.",
    section: "resume" as const,
  },
  {
    topic: "Applying & 3-State Tracker",
    q: "What is the difference between Prepared, User-reported, and Verified submitted?",
    a: "Prepared means a tailored draft packet exists locally. User-reported means you marked it applied manually. Verified submitted means the Vex Apply Extension captured a confirmation page hash after you explicitly clicked final submit.",
    section: "tracker" as const,
  },
  {
    topic: "Jobs & Fit Scores",
    q: "Does an 86% Match score predict that I will get hired?",
    a: "No. As stated in every ScoreInfo popover, Match % measures how many listed job requirements map to verified or transferable evidence in your canonical profile.",
    section: "jobs" as const,
  },
  {
    topic: "Skill Verification",
    q: "How do skills upgrade from Self-reported to Demonstrated in Vex?",
    a: "Complete the empirical proof check quiz in Aristotle Learning Academy or attach a verifiable Proof Case in your Canonical Profile.",
    section: "learning" as const,
  },
  {
    topic: "Privacy & Ownership",
    q: "Can I export all my Vex workspace data or erase it?",
    a: "Yes. Under Themis Governance in Settings you can inspect and download your entire workspace JSON at any time or reset to clean defaults.",
    section: "settings" as const,
  },
];
