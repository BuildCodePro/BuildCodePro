"use client";

import { cn } from "@/lib/utils/cn";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

interface UnderlineTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
  "aria-label"?: string;
}

export function UnderlineTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
  "aria-label": ariaLabel = "Results sections",
}: UnderlineTabsProps<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex min-w-max gap-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "border-b-2 p-0 transition-colors",
                isActive
                  ? "relative z-10 -mb-px border-primary"
                  : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "block rounded-t-lg px-4 py-3 font-body text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary/5 font-semibold text-primary"
                    : "text-stat-label hover:bg-primary/5 hover:text-foreground",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TabPanelProps {
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({
  id,
  labelledBy,
  children,
  className,
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </div>
  );
}
