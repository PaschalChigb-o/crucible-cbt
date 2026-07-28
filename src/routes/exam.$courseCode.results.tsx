import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Minus } from "lucide-react";
import { COURSE_CONFIG } from "@/config/courses";
import { BackBar, C, Divider, Screen } from "@/components/ui-crucible";
import type { Question } from "@/utils/questionLoader";
import { MathText } from "@/components/MathText";

interface ExamResult {
  questions: Question[];
  answers: Record<string, string>;
  skipped: string[];
  timeUsedSec: number;
  timeLimitSec: number;
}

function fmt(sec: number) {
  const m = Math.max(0, Math.floor(sec / 60));
  const s = Math.max(0, sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const Route = createFileRoute("/exam/$courseCode/results")({
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Exam Results ${params.courseCode}` },
      { name: "description", content: `Review your exam results for ${params.courseCode}.` },
      { property: "og:title", content: `CRUCIBLE — Exam Results ${params.courseCode}` },
      { property: "og:description", content: `Exam results for ${params.courseCode}.` },
    ],
  }),
  component: ExamResults,
});

function ExamResults() {
  const { courseCode } = Route.useParams();
  const cfg = COURSE_CONFIG[courseCode];
  const nav = useNavigate();
  const [data, setData] = useState<ExamResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(`${courseCode}_exam_last`);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, [courseCode]);

  if (!data) {
    return (
      <Screen>
        <BackBar to="/home" />
        <div className="px-4">
          No recent exam. <Link to="/exam" style={{ color: C.gold }}>Start one</Link>.
        </div>
      </Screen>
    );
  }

  const total = data.questions.length;
  const correct = data.questions.filter((q) => data.answers[q.id] === q.answer).length;
  const pct = Math.round((correct / total) * 100);
  const pctColor = pct >= 60 ? C.success : C.error;
  const band =
    pct >= 80
      ? { text: "Excellent — Well prepared", color: C.success }
      : pct >= 60
        ? { text: "Good — Keep revising", color: C.gold }
        : pct >= 40
          ? { text: "Fair — More practice needed", color: C.gold }
          : { text: "Needs work — Review material", color: C.error };

  return (
    <Screen>
      <BackBar to="/home" />
      <div className="px-4 text-center" style={{ marginTop: 8 }}>
        <div className="heading" style={{ fontSize: 52, color: C.gold }}>
          {correct} / {total}
        </div>
        <div className="heading" style={{ fontSize: 24, color: pctColor }}>
          {pct}%
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>
          {cfg?.name ?? courseCode}
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
          Time used: {fmt(data.timeUsedSec)}
        </div>
        <div style={{ fontSize: 14, color: band.color, marginTop: 8 }}>
          {band.text}
        </div>
      </div>

      <div className="px-4">
        <Divider />
        <h2 className="heading" style={{ fontSize: 18 }}>Review Answers</h2>
      </div>

      <div className="px-4 pt-3 pb-48 flex flex-col gap-3">
        {data.questions.map((q, i) => (
          <ExamReviewItem
            key={q.id}
            index={i + 1}
            question={q}
            chosen={data.answers[q.id]}
          />
        ))}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 px-4 flex flex-col gap-2"
        style={{
          background: C.primary,
          borderTop: "1px solid rgba(74,85,104,0.3)",
          paddingTop: 12,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"
          onClick={() => nav({ to: "/exam/$courseCode", params: { courseCode } })}
          className="heading w-full"
          style={{ height: 46, background: C.gold, color: C.primary, borderRadius: 12 }}
        >
          Retake Exam
        </button>
        <Link
          to="/exam"
          className="heading text-center"
          style={{
            height: 40,
            lineHeight: "40px",
            border: `1px solid ${C.gold}`,
            color: C.gold,
            borderRadius: 12,
          }}
        >
          Change Course
        </Link>
        <Link
          to="/home"
          className="text-center"
          style={{
            height: 40,
            lineHeight: "40px",
            border: `1px solid ${C.muted}`,
            color: C.muted,
            borderRadius: 12,
          }}
        >
          Go Home
        </Link>
      </div>
    </Screen>
  );
}

function ExamReviewItem({
  index,
  question,
  chosen,
}: {
  index: number;
  question: Question;
  chosen: string | undefined;
}) {
  const answered = !!chosen;
  const correct = answered && chosen === question.answer;
  const [open, setOpen] = useState(!correct);
  const [showWorking, setShowWorking] = useState(false);

  let icon = <Minus size={18} color={C.gold} />;
  let borderColor = C.gold;
  if (correct) {
    icon = <CheckCircle size={18} color={C.success} />;
    borderColor = C.success;
  } else if (answered) {
    icon = <XCircle size={18} color={C.error} />;
    borderColor = C.error;
  }

  return (
    <div
      style={{
        background: "rgba(247,250,252,0.06)",
        borderRadius: 12,
        borderLeft: `3px solid ${borderColor}`,
        padding: 14,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-start gap-3 text-left w-full"
      >
        <span style={{ flexShrink: 0, marginTop: 2 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="heading" style={{ fontSize: 12, color: C.muted }}>
            Q{index}
          </div>
          <div style={{ fontSize: 14 }}>
            <MathText text={question.question} />
          </div>
        </div>
      </button>
      {open && (
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ color: C.muted }}>
            Your answer:{" "}
            <span style={{ color: correct ? C.success : answered ? C.error : C.gold }}>
              <MathText text={chosen ?? "—"} />
            </span>
          </div>
          <div style={{ color: C.muted, marginTop: 4 }}>
            Correct: <span style={{ color: C.success }}>
              <MathText text={question.answer} />
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              background: "rgba(201,168,76,0.08)",
              borderLeft: `3px solid ${C.gold}`,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <MathText text={question.explanation} />
          </div>
          {question.working && (
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setShowWorking((s) => !s)}
                style={{ color: C.accent, fontSize: 13 }}
              >
                {showWorking ? "Hide Working" : "Show Working"}
              </button>
              {showWorking && (
                <div
                  style={{
                    marginTop: 6,
                    background: "rgba(0,194,168,0.06)",
                    borderLeft: `3px solid ${C.accent}`,
                    borderRadius: 8,
                    padding: 10,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <MathText text={question.working} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
