"use client";

import React, { useMemo, useState } from "react";
import {
  Copy,
  Pin,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Modal,
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";
import type { NetworkContact } from "@/types/vex";

export function NetworkView() {
  const { state, toggleContactPinned, addContact, pushToast } =
    useVexWorkspace();

  const [studioTab, setStudioTab] = useState<"all" | "pinned" | "companies">(
    "all"
  );
  const [selectedId, setSelectedId] = useState(state.contacts[0]?.id || "");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [warmth, setWarmth] =
    useState<NetworkContact["warmth"]>("Warm Intro");
  const [note, setNote] = useState("");

  const filtered = useMemo(() => {
    return state.contacts
      .filter((c) => {
        if (studioTab === "pinned" && !c.pinned) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !c.name.toLowerCase().includes(q) &&
            !c.company.toLowerCase().includes(q) &&
            !c.role.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [state.contacts, studioTab, query]);

  const activeContact =
    filtered.find((c) => c.id === selectedId) ||
    filtered[0] ||
    state.contacts[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;
    addContact({
      name: name.trim(),
      role: role.trim() || "Hiring Partner",
      company: company.trim(),
      warmth,
      urgency: "This Week",
      note: note.trim() || "Added from Network Council.",
      avatar: "/images/vex-philosopher.jpg",
    });
    setName("");
    setRole("");
    setCompany("");
    setNote("");
    setAddOpen(false);
  };

  const outreachDraft = activeContact
    ? `Hi ${activeContact.name.split(" ")[0]}, I've just finalised my ${
        state.profile.targetRole
      } dossier for ${activeContact.company} (including our Cross-Team Release Readiness Gate proof case). Would love to share a concise 2-bullet note before the panel reviews.`
    : "";

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Network Council"
        subtitle="Warm referral ledger linked directly to tracked applications and company intelligence."
        actionLabel="Add Contact"
        actionIcon={<Plus className="h-3.5 w-3.5" />}
        onAction={() => setAddOpen(true)}
      />

      <MobilePhilosopherPill
        philosopher="plato"
        guidance="Keep referral outreach concise, truthful, and anchored in one real Proof Case."
        actionLabel="+ Add Contact"
        onAction={() => setAddOpen(true)}
      />

      {/* Top Bento Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Council Contacts</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.contacts.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Warm Intros</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.contacts.filter((c) => c.warmth === "Warm Intro").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Follow-Up Today</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {
                  state.contacts.filter((c) => c.urgency === "Follow-up Today")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {state.contacts.map((c) => (
                <img
                  key={c.id}
                  src={c.avatar || "/images/vex-philosopher.jpg"}
                  alt={c.name}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover object-top"
                />
              ))}
            </div>
            <span className="text-xs text-[#475569]">
              Linked directly to {state.applications.length} tracked applications
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6c7581]">Next Urgent Touch</span>
            <Pill tone="lime">Priority</Pill>
          </div>
          <p className="font-display text-2xl font-normal text-[#181b1e]">
            {activeContact?.name || "No contact selected"}
          </p>
          <p className="text-xs text-[#6c7581]">
            {activeContact?.company} · {activeContact?.urgency}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts or companies..."
            className="w-full rounded-full bg-white/85 border border-white pl-4 pr-9 py-2 text-xs outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6c7581]" />
        </div>
      </div>

      <NotchedDarkStudio
        leftHeading="Referrals & Target Companies"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "all", label: "All Contacts", count: state.contacts.length },
          {
            id: "pinned",
            label: "Pinned",
            count: state.contacts.filter((c) => c.pinned).length,
          },
          { id: "companies", label: "Company Intel", count: state.jobs.length },
        ]}
      >
        {studioTab === "companies" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {state.jobs.map((j) => (
              <div
                key={j.id}
                className="rounded-[22px] bg-[#2c3033] p-5 text-white space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{j.company}</span>
                  <Pill tone="lime">{j.matchScore}% Fit</Pill>
                </div>
                <p className="text-xs text-slate-300">
                  {j.industry} · {j.location}
                </p>
                <p className="text-[11.5px] text-slate-400">{j.platoNote}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-2.5">
              {filtered.map((c) => {
                const selected = activeContact?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full flex items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7898b0] text-white"
                        : "bg-[#2c3033] text-slate-200 hover:bg-[#34393d]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={c.avatar || "/images/vex-philosopher.jpg"}
                        alt={c.name}
                        className="h-9 w-9 rounded-full object-cover object-top shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {c.name}
                        </p>
                        <p
                          className={`text-[10.5px] truncate ${
                            selected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {c.company} · {c.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0 ${
                        selected
                          ? "bg-white text-[#181b1e]"
                          : c.urgency === "Follow-up Today"
                          ? "bg-[#d4fb35] text-[#15181a]"
                          : "bg-[#3b3f44] text-slate-300"
                      }`}
                    >
                      {c.urgency}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeContact && (
              <div className="lg:col-span-7 rounded-[26px] bg-[#7898b0] p-6 text-white space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeContact.avatar || "/images/vex-philosopher.jpg"}
                      alt={activeContact.name}
                      className="h-12 w-12 rounded-full border-2 border-white object-cover object-top"
                    />
                    <div>
                      <h3 className="font-display text-2xl font-normal">
                        {activeContact.name}
                      </h3>
                      <p className="text-xs text-white/80">
                        {activeContact.role} · {activeContact.company}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleContactPinned(activeContact.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                      activeContact.pinned
                        ? "bg-[#d4fb35] text-[#15181a]"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <Pin className="inline h-3.5 w-3.5 mr-1" />
                    {activeContact.pinned ? "Pinned" : "Pin"}
                  </button>
                </div>

                <div className="rounded-[20px] bg-white/15 p-4 text-xs space-y-1">
                  <p className="font-mono-code text-[10px] uppercase text-white/75">
                    Relationship Context · Last touch {activeContact.lastTouch}
                  </p>
                  <p className="leading-relaxed">{activeContact.note}</p>
                </div>

                <div className="rounded-[20px] bg-black/15 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-[10px] uppercase text-[#d4fb35]">
                      Grounded Outreach Draft
                    </span>
                    <VexButton
                      variant="lime"
                      size="sm"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(outreachDraft);
                        } catch {
                          // ignore
                        }
                        pushToast("Copied outreach draft", "good");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Outreach</span>
                    </VexButton>
                  </div>
                  <p className="text-xs leading-relaxed text-white/90">
                    {outreachDraft}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </NotchedDarkStudio>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Network Contact"
        subtitle="Link warm intros and peer contacts to your active applications."
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contact full name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (e.g. Engineering Manager)"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <input
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <select
            value={warmth}
            onChange={(e) =>
              setWarmth(e.target.value as NetworkContact["warmth"])
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          >
            <option value="Warm Intro">Warm Intro</option>
            <option value="Direct Peer">Direct Peer</option>
            <option value="Cold Outreach">Cold Outreach</option>
          </select>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Context or mutual connection..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs outline-none"
          />
          <div className="flex justify-end gap-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Save Contact
            </VexButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
