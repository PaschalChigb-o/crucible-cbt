import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { COURSE_CONFIG } from "@/config/courses";
import { BackBar, C, Divider, Screen } from "@/components/ui-crucible";
import type { Question } from "@/utils/questionLoader";
import { MathText } from "@/components/MathText";

interface StudyResult {
  questions: Question[];
  answers: Record<string, string>;
}

export const Route = createFileRoute("/results/$courseCode")({
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Results ${params.courseCode}` },
      { name: "description", content: `Review your study session answers for ${params.courseCode}.` },
      { property: "og:title", content: `CRUCIBLE — Results ${params.courseCode}` },
      { property: "og:description", content: `Study session results for ${params.courseCode}.` },
    ],
  }),
  component: StudyResults,
});

function StudyResults() {
  const { courseCode } = Route.useParams();
  const cfg = COURSE_CONFIG[courseCode];
  const nav = useNavigate();
  const [data, setData] = useState<StudyResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(`${courseCode}_study_last`);
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
        <div className="px-4">No recent session. <Link to="/study" style={{ color: C.accent }}>Start one</Link>.</div>
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
        <div style={{ fontSize: 14, color: band.color, marginTop: 8 }}>
          {band.text}
        </div>
      </div>

      <div className="px-4">
        <Divider />
        <h2 className="heading" style={{ fontSize: 18, color: C.textLight }}>
          Review Answers
        </h2>
      </div>

      <div className="px-4 pb-32 pt-3 flex flex-col gap-3">
        {data.questions.map((q, i) => (
          <ReviewItem
            key={q.id}
            index={i + 1}
            question={q}
            chosen={data.answers[q.id]}
          />
        ))}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 px-4"
        style={{
          background: C.primary,
          borderTop: "1px solid rgba(74,85,104,0.3)",
          paddingTop: 12,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              nav({ to: "/study/$courseCode", params: { courseCode } })
            }
            className="heading w-full"
            style={{ height: 48, background: C.accent, color: C.primary, borderRadius: 12 }}
          >
            Retake
          </button>
          <Link
            to="/study"
            className="heading text-center"
            style={{
              height: 44,
              lineHeight: "44px",
              border: `1px solid ${C.accent}`,
              color: C.accent,
              borderRadius: 12,
            }}
          >
            Change Course
          </Link>
        </div>
      </div>
    </Screen>
  );
}

function ReviewItem({
  index,
  question,
  chosen,
}: {
  index: number;
  question: Question;
  chosen: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [showWorking, setShowWorking] = useState(false);
  const correct = chosen === question.answer;
  const borderColor = correct ? C.success : C.error;
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="text-left"
      style={{
        background: "rgba(247,250,252,0.06)",
        borderRadius: 12,
        borderLeft: `3px solid ${borderColor}`,
        padding: 14,
      }}
    >
      <div className="flex items-start gap-3">
        {correct ? (
          <CheckCircle size={18} color={C.success} style={{ flexShrink: 0, marginTop: 2 }} />
        ) : (
          <XCircle size={18} color={C.error} style={{ flexShrink: 0, marginTop: 2 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="heading" style={{ fontSize: 12, color: C.muted }}>
            Q{index}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textLight,
              overflow: open ? "visible" : "hidden",
              display: open ? "block" : "-webkit-box",
              WebkitLineClamp: open ? undefined : 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <MathText text={question.question} />
          </div>
          {open && (
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ color: C.muted }}>
                Your answer: <span style={{ color: correct ? C.success : C.error }}>
                  <MathText text={chosen ?? "—"} />
                </span>
              </div>
              {!correct && (
                <div style={{ color: C.muted, marginTop: 4 }}>
                  Correct: <span style={{ color: C.success }}>
                    <MathText text={question.answer} />
                  </span>
                </div>
              )}
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
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWorking((s) => !s);
                    }}
                    style={{ color: C.accent, fontSize: 13 }}
                  >
                    {showWorking ? "Hide Working" : "Show Working"}
                  </span>
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
      </div>
    </button>
  );
}
