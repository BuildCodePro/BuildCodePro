import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type AnalysisStepStatus = "pending" | "in_progress" | "completed";

export interface AnalysisStepTask {
  id: string;
  label: string;
  status: AnalysisStepStatus;
}

interface AnalysisProgressTasksProps {
  tasks: AnalysisStepTask[];
  className?: string;
}

function TaskIcon({ status }: { status: AnalysisStepStatus }) {
  if (status === "completed") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15">
        <Check className="size-3 text-success" aria-hidden="true" />
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <span
          className="absolute inline-flex size-full animate-ping rounded-full bg-ai-cyan/60"
          aria-hidden="true"
        />
        <span
          className="relative size-4 rounded-full bg-ai-cyan"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span
      className="size-4 shrink-0 rounded-full bg-slate-200"
      aria-hidden="true"
    />
  );
}

export function AnalysisProgressTasks({
  tasks,
  className,
}: AnalysisProgressTasksProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {tasks.map((task) => (
        <li
          key={task.id}
          className={cn(
            "flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors",
            task.status === "completed" &&
            "border-emerald-100 bg-emerald-50/80",
            task.status === "in_progress" &&
            "border-ai-cyan bg-ai-cyan/5",
            task.status === "pending" && "border-transparent bg-slate-50/60",
          )}
        >
          <TaskIcon status={task.status} />
          <span
            className={cn(
              "font-body text-sm",
              task.status === "completed" && "font-medium text-success",
              task.status === "in_progress" && "font-medium text-ai-cyan",
              task.status === "pending" && "text-slate-400",
            )}
          >
            {task.label}
          </span>
        </li>
      ))}
    </ul>
  );
}