"use client";

import { useState } from "react";
import type React from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            aria-selected={tab.id === activeId}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            className={`tabs-trigger${tab.id === activeId ? " active" : ""}`}
            onKeyDown={(e) => {
              // Arrow key navigation
              if (e.key === "ArrowRight") {
                const idx = tabs.findIndex((t) => t.id === activeId);
                const next = tabs[(idx + 1) % tabs.length];
                if (next) setActiveId(next.id);
                e.preventDefault();
              } else if (e.key === "ArrowLeft") {
                const idx = tabs.findIndex((t) => t.id === activeId);
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                if (prev) setActiveId(prev.id);
                e.preventDefault();
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="tabs-panel"
          tabIndex={0}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
