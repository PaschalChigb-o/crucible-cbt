import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Timer, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { C } from "@/components/ui-crucible";
import { COURSE_ORDER } from "@/config/courses";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "CRUCIBLE — Home" },
      {
        name: "description",
        content:
          "Pick Study Mode to revise or Exam Mode to sit a timed practice paper.",
      },
      { property: "og:title", content: "CRUCIBLE — Home" },
      {
        property: "og:description",
        content: "Study and Exam modes across 9 Nigerian university courses.",
      },
    ],
  }),
  component: Home,
});

function useInstallHint() {
  const [hint, setHint] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-ignore iOS
      window.navigator?.standalone;
    if (standalone) return;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) setHint("Tap Share ⬆ then Add to Home Screen");
    else if (/Android/.test(ua)) setHint("Tap ⋮ then Add to Home Screen");
    else setHint("Open on your phone to install");
  }, []);
  return hint;
}

function Home() {
  const hint = useInstallHint();
  // Total = sum of banks — approx count for the tagline. Static message keeps it simple.
  const totalCourses = COURSE_ORDER.length;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: C.primary, color: C.textLight }}
    >
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: "calc(14px + env(safe-area-inset-top))" }}
      >
        <span className="heading" style={{ fontSize: 22, color: C.gold }}>
          CRUCIBLE
        </span>
        <img
          src="/assets/logo.png"
          alt="CRUCIBLE"
          width={32}
          height={32}
          style={{ width: 32, height: 32, borderRadius: 8 }}
        />
      </div>

      <div className="flex flex-col items-center px-6" style={{ paddingTop: 48 }}>
        <img
          src="/assets/logo.png"
          alt="CRUCIBLE"
          width={80}
          height={80}
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
        <h1
          className="heading text-center"
          style={{ fontSize: 22, color: C.gold, marginTop: 16 }}
        >
          Enter the crucible.
        </h1>
        <p
          className="text-center"
          style={{ fontSize: 15, color: C.textLight, opacity: 0.7, marginTop: 4 }}
        >
          Leave prepared.
        </p>
        <div
          style={{
            width: 48,
            height: 1,
            background: "rgba(201,168,76,0.3)",
            marginTop: 20,
            marginBottom: 20,
          }}
        />
        <p style={{ fontSize: 13, color: C.accent }}>
          {totalCourses} courses · 1,350+ questions
        </p>
      </div>

      <div className="flex-1 px-6" style={{ marginTop: 40 }}>
        <Link
          to="/study"
          className="flex items-center rounded-2xl"
          style={{
            width: "100%",
            height: 64,
            gap: 12,
            padding: "0 16px",
            background: "rgba(0,194,168,0.12)",
            border: `1.5px solid ${C.accent}`,
            borderRadius: 14,
            color: C.accent,
          }}
        >
          <BookOpen size={22} color={C.accent} />
          <div className="flex flex-1 flex-col">
            <span className="heading" style={{ fontSize: 17, color: C.accent }}>
              Study Mode
            </span>
            <span style={{ fontSize: 12, color: C.accent, opacity: 0.7 }}>
              Revise at your own pace
            </span>
          </div>
          <ChevronRight size={18} color={C.accent} />
        </Link>

        <div style={{ height: 14 }} />

        <Link
          to="/exam"
          className="flex items-center"
          style={{
            width: "100%",
            height: 64,
            gap: 12,
            padding: "0 16px",
            background: "rgba(201,168,76,0.12)",
            border: `1.5px solid ${C.gold}`,
            borderRadius: 14,
            color: C.gold,
          }}
        >
          <Timer size={22} color={C.gold} />
          <div className="flex flex-1 flex-col">
            <span className="heading" style={{ fontSize: 17, color: C.gold }}>
              Exam Mode
            </span>
            <span style={{ fontSize: 12, color: C.gold, opacity: 0.7 }}>
              Timed exam conditions
            </span>
          </div>
          <ChevronRight size={18} color={C.gold} />
        </Link>
      </div>

      {hint ? (
        <div
          className="text-center"
          style={{
            padding: "12px 24px",
            borderTop: "1px solid rgba(74,85,104,0.2)",
            color: C.textLight,
            opacity: 0.5,
            fontSize: 11,
            paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}
