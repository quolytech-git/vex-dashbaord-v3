"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Bell, Check, Clock, Moon, Plus } from "lucide-react";
import {
  Modal,
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export function AlertsView() {
  const {
    state,
    unreadAlertCount,
    markAlertRead,
    snoozeAlert,
    markAllAlertsRead,
    addPersonalReminder,
    updatePreferences,
    setActiveSection,
  } = useVexWorkspace();

  const [tab, setTab] = useState<"all" | "unread" | "snoozed">("all");
  const [reminderOpen, setReminderOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const filtered = useMemo(() => {
    return state.alerts.filter((a) => {
      if (tab === "unread") return a.unread && !a.snoozed;
      if (tab === "snoozed") return a.snoozed;
      return !a.snoozed;
    });
  }, [state.alerts, tab]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addPersonalReminder(title.trim(), detail.trim() || "Personal reminder.");
    setTitle("");
    setDetail("");
    setReminderOpen(false);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Hermes Alerts"
        subtitle="Low-noise career signal ledger — deadlines, Truth Lock alerts, and quiet hours."
        actionLabel="New Reminder"
        actionIcon={<Plus className="h-3.5 w-3.5" />}
        onAction={() => setReminderOpen(true)}
        extraRight={
          <VexButton variant="white" size="sm" onClick={markAllAlertsRead}>
            <Check className="h-3.5 w-3.5" />
            <span>Mark All Read</span>
          </VexButton>
        }
      />

      <MobilePhilosopherPill
        philosopher="hermes"
        guidance="Only actionable signals surface here — configure noise tiers and Quiet Hours below."
        actionLabel="+ New Reminder"
        onAction={() => setReminderOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Unread Signals</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {unreadAlertCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Noise Tier</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.preferences.alertTier}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Quiet Hours</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.preferences.quietHours ? "On" : "Off"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["Essential", "Standard", "Everything"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => updatePreferences({ alertTier: tier })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                  state.preferences.alertTier === tier
                    ? "bg-[#1f2224] text-[#d4fb35]"
                    : "bg-white text-[#475569]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#6c7581]">Quiet Hours Shield</p>
            <p className="mt-1 font-display text-2xl font-normal">
              21:00 – 08:00
            </p>
            <p className="text-xs text-[#6c7581] mt-1">
              Suppresses non-urgent alerts overnight.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updatePreferences({ quietHours: !state.preferences.quietHours })
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full cursor-pointer transition-colors ${
              state.preferences.quietHours
                ? "bg-[#1f2224] text-[#d4fb35]"
                : "bg-[#eff3f8] text-[#475569]"
            }`}
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <NotchedDarkStudio
        leftHeading="Herald Ledger"
        activeTab={tab}
        onTabChange={setTab}
        tabs={[
          {
            id: "all",
            label: "Active",
            count: state.alerts.filter((a) => !a.snoozed).length,
          },
          { id: "unread", label: "Unread", count: unreadAlertCount },
          {
            id: "snoozed",
            label: "Snoozed",
            count: state.alerts.filter((a) => a.snoozed).length,
          },
        ]}
      >
        <div className="space-y-2.5">
          {filtered.map((al) => (
            <div
              key={al.id}
              className={`rounded-[22px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                al.unread
                  ? "bg-[#7898b0] text-white"
                  : "bg-[#2c3033] text-slate-200"
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Pill tone={al.category === "CV Truth" ? "bad" : "lime"}>
                    {al.category}
                  </Pill>
                  <span className="font-mono-code text-[10.5px] opacity-75">
                    {al.timestamp}
                  </span>
                </div>
                <p className="text-xs font-semibold">{al.title}</p>
                <p className="text-[11.5px] opacity-85">{al.detail}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {al.unread && (
                  <button
                    type="button"
                    onClick={() => markAlertRead(al.id)}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
                {!al.snoozed && (
                  <button
                    type="button"
                    onClick={() => snoozeAlert(al.id)}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium cursor-pointer"
                  >
                    <Clock className="inline h-3 w-3 mr-1" />
                    Snooze
                  </button>
                )}
                <VexButton
                  variant="lime"
                  size="sm"
                  onClick={() => {
                    markAlertRead(al.id);
                    setActiveSection(al.targetSection);
                  }}
                >
                  <span>Open</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </VexButton>
              </div>
            </div>
          ))}
        </div>
      </NotchedDarkStudio>

      <Modal
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        title="Add Hermes Reminder"
        subtitle="Creates a local deadline or interview prep alert."
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none"
          />
          <textarea
            rows={2}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Additional detail..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs outline-none"
          />
          <div className="flex justify-end gap-2">
            <VexButton
              type="button"
              variant="white"
              onClick={() => setReminderOpen(false)}
            >
              Cancel
            </VexButton>
            <VexButton type="submit" variant="dark">
              Save Reminder
            </VexButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
