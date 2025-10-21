"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

/**
 * Global Keyboard Shortcuts Component
 * Implements app-wide keyboard navigation
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      // Help menu (?)
      if (e.key === "?" && !isInputFocused()) {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      // Navigation shortcuts (only when no input is focused)
      if (!isInputFocused()) {
        switch (e.key) {
          case "d":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/dashboard");
            }
            break;
          case "c":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/compare");
            }
            break;
          case "p":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/catalog");
            }
            break;
          case "a":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/alerts");
            }
            break;
          case "b":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/brand-watch");
            }
            break;
          case "t":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/app/team");
            }
            break;
          case "h":
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              router.push("/");
            }
            break;
        }
      }

      // Escape to close dialogs
      if (e.key === "Escape") {
        setHelpOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const isInputFocused = () => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement ||
      activeElement?.getAttribute("contenteditable") === "true"
    );
  };

  const shortcuts = [
    { category: "Navigation", items: [
      { keys: ["D"], description: "Go to Dashboard" },
      { keys: ["C"], description: "Go to Compare & Price Coach" },
      { keys: ["P"], description: "Go to Product Catalog" },
      { keys: ["A"], description: "Go to Alerts" },
      { keys: ["B"], description: "Go to Brand Watch" },
      { keys: ["T"], description: "Go to Team" },
      { keys: ["H"], description: "Go to Home" },
    ]},
    { category: "General", items: [
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["Cmd", "K"], description: "Open command palette (coming soon)" },
      { keys: ["Esc"], description: "Close dialogs" },
    ]},
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Navigate LeafLedger faster with keyboard shortcuts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent"
                    >
                      <span className="text-sm">{item.description}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, kidx) => (
                          <Badge
                            key={kidx}
                            variant="secondary"
                            className="font-mono text-xs px-2 py-1"
                          >
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


