"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { AlertsView } from "@/components/views/AlertsView";
import { AssistantView } from "@/components/views/AssistantView";
import { CoverLettersView } from "@/components/views/CoverLettersView";
import { DashboardView } from "@/components/views/DashboardView";
import { ExtensionView } from "@/components/views/ExtensionView";
import { InterviewsView } from "@/components/views/InterviewsView";
import { JobsView } from "@/components/views/JobsView";
import { LearningView } from "@/components/views/LearningView";
import { NetworkView } from "@/components/views/NetworkView";
import { ProfileView } from "@/components/views/ProfileView";
import { ResumeView } from "@/components/views/ResumeView";
import { SettingsView } from "@/components/views/SettingsView";
import { TrackerView } from "@/components/views/TrackerView";
import {
  useVexWorkspace,
  VexWorkspaceProvider,
} from "@/store/VexWorkspaceContext";

function VexWorkspaceRouter() {
  const { activeSection } = useVexWorkspace();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeSection]);

  const renderView = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardView />;
      case "jobs":
        return <JobsView />;
      case "resume":
        return <ResumeView />;
      case "cover-letters":
        return <CoverLettersView />;
      case "profile":
        return <ProfileView />;
      case "tracker":
        return <TrackerView />;
      case "extension":
        return <ExtensionView />;
      case "network":
        return <NetworkView />;
      case "interviews":
        return <InterviewsView />;
      case "learning":
        return <LearningView />;
      case "assistant":
        return <AssistantView />;
      case "alerts":
        return <AlertsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <VexWorkspaceProvider>
      <VexWorkspaceRouter />
    </VexWorkspaceProvider>
  );
}
