import type { ReactNode } from "react";
import type { Difficulty } from "../types";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="heading">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "", ...props }: { children: ReactNode; className?: string; [key: string]: unknown }) {
  return <section className={`card ${className}`.trim()} {...props}>{children}</section>;
}

export function ProgressBar({ value, max = 100, label, className = "" }: { value: number; max?: number; label: string; className?: string }) {
  const boundedValue = Math.max(0, Math.min(value, max));
  const percent = max > 0 ? (boundedValue / max) * 100 : 0;
  return (
    <div
      className={`bar ${className}`.trim()}
      role="progressbar"
      aria-label={label}
      aria-valuenow={boundedValue}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export function Badge({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "warning" | "danger" | "beginner" | "intermediate" | "advanced" }) {
  const toneClass = {
    info: "b-info",
    success: "b-completed",
    warning: "b-pending",
    danger: "b-rejected",
    beginner: "b-beginner",
    intermediate: "b-intermediate",
    advanced: "b-advanced",
  } satisfies Record<string, string>;
  return <span className={`badge ${toneClass[tone]}`}>{children}</span>;
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return <Badge tone={level.toLowerCase() as Lowercase<Difficulty>}>{level}</Badge>;
}

export function StatCard({ label, value, note, color = "" }: { label: string; value: ReactNode; note?: string; color?: string }) {
  return (
    <Card className={`stat ${color}`.trim()}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {note && <span className="stat-note">{note}</span>}
    </Card>
  );
}

export function LoadState({ state, error }: { state: "loading" | "error"; error?: Error }) {
  return state === "loading"
    ? <div className="card empty" role="status">Loading your learning data…</div>
    : <div className="card inline-alert alert-error" role="alert">Could not load this page. {error?.message ?? "Please try again."}</div>;
}
