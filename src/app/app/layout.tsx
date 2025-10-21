import { ReactNode } from "react";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { SkipToContent } from "@/components/skip-to-content";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipToContent />
      <div className="min-h-screen bg-background flex">
        {/* Sidebar Navigation */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <KeyboardShortcuts />
    </>
  );
}

