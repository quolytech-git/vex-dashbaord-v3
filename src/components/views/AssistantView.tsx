"use client";

import React, { useState } from "react";
import { Bot, Check, Play, ShieldCheck, Terminal, X } from "lucide-react";
import {
  NotchedDarkStudio,
  Pill,
  SectionHeader,
  VexButton,
} from "@/components/kit/Kit";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";
import { MCP_TOOLS_CATALOG } from "@/data/philosophers";
import { useVexWorkspace } from "@/store/VexWorkspaceContext";

export function AssistantView() {
  const { state, proposeZeusPlan, decideZeusPlan, runMcpTool } =
    useVexWorkspace();

  const [studioTab, setStudioTab] = useState<"zeus" | "mcp" | "logs">("zeus");
  const [prompt, setPrompt] = useState("");
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS_CATALOG[0]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Zeus AI & MCP Forge"
        subtitle="Approval-first AI command orchestration alongside Hephaestus MCP tool schema inspection & audit logs."
      />

      <MobilePhilosopherPill
        philosopher="zeus"
        guidance="Zeus always proposes explicit Reads and Writes before acting — approve or cancel every workflow step."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 vex-bento-ice rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#6c7581]">Zeus Plans</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.zeusPlans.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">MCP Tools</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {MCP_TOOLS_CATALOG.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6c7581]">Audit Entries</p>
              <p className="mt-1.5 font-display text-[32px] font-normal leading-none">
                {state.mcpLogs.length}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && prompt.trim()) {
                  proposeZeusPlan(prompt);
                  setPrompt("");
                }
              }}
              placeholder="Ask Zeus to prepare an approval-first workflow..."
              className="flex-1 rounded-full bg-white border border-white px-4 py-2.5 text-xs outline-none"
            />
            <VexButton
              variant="dark"
              onClick={() => {
                if (!prompt.trim()) return;
                proposeZeusPlan(prompt);
                setPrompt("");
              }}
            >
              Propose Plan
            </VexButton>
          </div>
        </div>

        <div className="lg:col-span-5 vex-bento-white rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6c7581]">Sovereign Gatekeeper</span>
            <ShieldCheck className="h-5 w-5 text-[#0e7c4d]" />
          </div>
          <p className="font-display text-2xl font-normal text-[#181b1e]">
            Human-Approved Only
          </p>
          <p className="text-xs text-[#475569]">
            External submissions remain disabled in MCP tools; write-gated tools create local drafts only.
          </p>
        </div>
      </div>

      <NotchedDarkStudio
        leftHeading="Orchestration & Hephaestus MCP"
        activeTab={studioTab}
        onTabChange={setStudioTab}
        tabs={[
          { id: "zeus", label: "Zeus Planner", count: state.zeusPlans.length },
          { id: "mcp", label: "MCP Tools", count: MCP_TOOLS_CATALOG.length },
          { id: "logs", label: "Audit Logs", count: state.mcpLogs.length },
        ]}
      >
        {studioTab === "zeus" && (
          <div className="space-y-3">
            {state.zeusPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-[24px] bg-[#2c3033] p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-[#d4fb35]" />
                    <span className="text-xs font-semibold text-white">
                      {plan.prompt}
                    </span>
                  </div>
                  <Pill
                    tone={
                      plan.status === "executed"
                        ? "lime"
                        : plan.status === "cancelled"
                        ? "bad"
                        : "warn"
                    }
                  >
                    {plan.status.replace("_", " ")}
                  </Pill>
                </div>

                <p className="text-xs text-slate-300">{plan.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded-[16px] bg-[#222528] p-3">
                    <p className="font-mono-code text-[10px] uppercase text-[#7898b0] mb-1">
                      Reads
                    </p>
                    <p className="text-slate-200">{plan.reads.join(" · ")}</p>
                  </div>
                  <div className="rounded-[16px] bg-[#222528] p-3">
                    <p className="font-mono-code text-[10px] uppercase text-[#d4fb35] mb-1">
                      Writes (Gated)
                    </p>
                    <p className="text-slate-200">{plan.writes.join(" · ")}</p>
                  </div>
                </div>

                {plan.status === "awaiting_approval" && (
                  <div className="flex gap-2 pt-1">
                    <VexButton
                      variant="lime"
                      size="sm"
                      onClick={() => decideZeusPlan(plan.id, "executed")}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve & Execute</span>
                    </VexButton>
                    <VexButton
                      variant="ghostDark"
                      size="sm"
                      onClick={() => decideZeusPlan(plan.id, "cancelled")}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </VexButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {studioTab === "mcp" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-2.5">
              {MCP_TOOLS_CATALOG.map((tool) => {
                const selected = selectedTool.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    className={`w-full rounded-[20px] p-4 text-left transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7898b0] text-white"
                        : "bg-[#2c3033] text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code text-xs font-semibold">
                        {tool.name}
                      </span>
                      <Pill tone={tool.mode === "read" ? "lime" : "warn"}>
                        {tool.mode}
                      </Pill>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1">{tool.server}</p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 rounded-[26px] bg-[#7898b0] p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono-code text-[10px] uppercase text-white/80">
                    {selectedTool.server}
                  </p>
                  <h3 className="font-mono-code text-lg font-semibold">
                    {selectedTool.name}
                  </h3>
                </div>
                <VexButton
                  variant="lime"
                  size="sm"
                  onClick={() => runMcpTool(selectedTool.name)}
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Run in Sandbox</span>
                </VexButton>
              </div>
              <p className="text-xs text-white/90">{selectedTool.description}</p>
              <pre className="rounded-[18px] bg-[#1f2224] p-4 font-mono-code text-xs text-[#d4fb35] overflow-x-auto">
                {selectedTool.schemaExample}
              </pre>
            </div>
          </div>
        )}

        {studioTab === "logs" && (
          <div className="space-y-2.5">
            {state.mcpLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-[20px] bg-[#2c3033] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-[#d4fb35]" />
                  <div>
                    <p className="font-mono-code text-xs font-semibold text-white">
                      {log.toolName}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      {log.payloadSummary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-[10.5px] text-slate-400">
                    {log.timestamp}
                  </span>
                  <Pill tone={log.status === "blocked" ? "bad" : "lime"}>
                    {log.status.toUpperCase()}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        )}
      </NotchedDarkStudio>
    </div>
  );
}
