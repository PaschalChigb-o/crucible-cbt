import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export const C = {
  primary: "#0D1F3C",
  accent: "#00C2A8",
  success: "#2ECC71",
  error: "#E74C3C",
  gold: "#C9A84C",
  forest: "#1B4D3E",
  muted: "#4A5568",
  surface: "#F7FAFC",
  textLight: "#F0F4F8",
  textDark: "#1A1A2E",
};

export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"min-h-screen scroll-touch " + (className ?? "")}
      style={{ background: C.primary, color: C.textLight }}
    >
      {children}
    </div>
  );
}

export function BackBar({
  to,
  onClick,
  title,
}: {
  to?: string;
  onClick?: () => void;
  title?: string;
}) {
  const Inner = (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-full"
      style={{ background: "rgba(247,250,252,0.06)", color: C.textLight }}
    >
      <ChevronLeft size={22} />
    </span>
  );
  return (
    <div
      className="flex items-center gap-3 px-4"
      style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
    >
      {to ? (
        <Link to={to as any}>{Inner}</Link>
      ) : (
        <button onClick={onClick} type="button">
          {Inner}
        </button>
      )}
      {title ? (
        <span className="heading text-sm" style={{ color: C.muted }}>
          {title}
        </span>
      ) : null}
    </div>
  );
}

export function Divider() {
  return (
    <div
      className="my-5"
      style={{ height: 1, background: "rgba(74,85,104,0.3)" }}
    />
  );
}
