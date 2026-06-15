import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <section className={`empty-state ${compact ? "empty-state--compact" : ""}`}>
      <span className="empty-state__icon"><Icon /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
