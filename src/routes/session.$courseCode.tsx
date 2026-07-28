import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { COURSE_CONFIG } from "@/config/courses";
import { BackBar, C, Screen } from "@/components/ui-crucible";
import { loadCourseQuestions, type Question } from "@/utils/questionLoader";
import { buildSessionQuestions, markSeen } from "@/utils/session";
import { MathText } from "@/components/MathText";

const searchSchema = z.object({ count: z.number().int().positive().default(10) });

export const Route = createFileRoute("/session/$courseCode")({
  validateSearch: searchSchema,
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Study Session ${params.courseCode}` },
      { name: "description", content: `Answer study questions for ${params.courseCode} with instant feedback.` },
      { property: "og:title", content: `CRUCIBLE — Study ${params.courseCode}` },
      { property: "og:description", content: `Study session for ${params.courseCode}.` },
    ],
  }),
  component: StudySession,
});

interface StudyResult {
  questions: Question[];
  answers: Record<string, string>;
}

function StudySession() {
  const { courseCode } = Route.useParams();
  const { count } = Route.useSearch();
  const cfg = COURSE_CONFIG[courseCode];
  const nav = useNavigate();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showWorking, setShowWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadCourseQuestions(courseCode).then((all) => {
      if (cancelled) return;
      if (all.length === 0) {
        setError("Failed to load questions for this course.");
        return;
      }
      const list = buildSessionQuestions(courseCode, all, count);
      setQuestions(list);
    });
    return () => {
      cancelled = true;
    };
  }, [courseCode, count]);

  if (error) {
    return (
      <Screen>
        <BackBar to="/study" />
        <div className="px-4">
          <p style={{ color: C.error }}>{error}</p>
        </div>
      </Screen>
    );
  }
  if (!questions) {
    return (
      <Screen>
        <BackBar to="/study" />
        <div className="px-4" style={{ color: C.muted }}>Loading…</div>
      </Screen>
    );
  }
  if (questions.length === 0) {
    return (
      <Screen>
        <BackBar to="/study" />
        <div className="px-4">
          <p>No questions available.</p>
        </div>
      </Screen>
    );
  }

  const q = questions[idx];
  const selected = answers[q.id];
  const answered = !!selected;
  const isLast = idx === questions.length - 1;
  const progress = ((idx + (answered ? 1 : 0)) / questions.length) * 100;

  const onSelect = (opt: string) => {
    if (answered) return;
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  };

  const onNext = () => {
    setShowWorking(false);
    if (isLast) {
      const result: StudyResult = { questions, answers };
      localStorage.setItem(
        `${courseCode}_study_last`,
        JSON.stringify(result),
      );
      markSeen(courseCode, questions.map((x) => x.id));
      nav({ to: "/results/$courseCode", params: { courseCode } });
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <Screen>
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
      >
        <span style={{ fontSize: 13, color: C.muted }}>{courseCode}</span>
        <span className="heading" style={{ fontSize: 14 }}>
          Q {idx + 1} of {questions.length}
        </span>
        <span style={{ width: 40 }} />
      </div>

      <div className="mx-4 mt-3" style={{ height: 4, background: "rgba(74,85,104,0.3)", borderRadius: 999 }}>
        <div
          style={{ height: "100%", width: `${progress}%`, background: cfg.color, borderRadius: 999, transition: "width 200ms" }}
        />
      </div>

      <div
        className="mx-4 mt-4"
        style={{ background: "rgba(247,250,252,0.08)", borderRadius: 16, padding: 20 }}
      >
        <MathText
          text={q.question}
          className="block"
        />
      </div>

      <div className="mx-4 mt-3 flex flex-col" style={{ gap: 10 }}>
        {q.options.map((opt) => {
          const isCorrect = opt === q.answer;
          const isSelected = opt === selected;
          let bg = "rgba(247,250,252,0.08)";
          let border = "1px solid rgba(74,85,104,0.4)";
          let color = C.textLight;
          let icon: React.ReactNode = null;
          if (answered) {
            if (isCorrect) {
              bg = "rgba(46,204,113,0.15)";
              border = `2px solid ${C.success}`;
              color = C.success;
              icon = <CheckCircle size={18} color={C.success} />;
            } else if (isSelected) {
              bg = "rgba(231,76,60,0.15)";
              border = `2px solid ${C.error}`;
              color = C.error;
              icon = <XCircle size={18} color={C.error} />;
            }
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              disabled={answered}
              className="flex items-center"
              style={{
                background: bg,
                border,
                color,
                borderRadius: 12,
                padding: "14px 16px",
                minHeight: 52,
                textAlign: "left",
                width: "100%",
                gap: 12,
              }}
            >
              <span style={{ flex: 1, fontSize: 15 }}>
                <MathText text={opt} />
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      {answered && (
        <>
          <div
            className="mx-4 mt-4"
            style={{
              background: "rgba(201,168,76,0.08)",
              borderLeft: `3px solid ${C.gold}`,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div
              className="heading"
              style={{
                fontSize: 11,
                color: C.gold,
                letterSpacing: 1.5,
                marginBottom: 6,
              }}
            >
              EXPLANATION
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <MathText text={q.explanation} />
            </div>
          </div>

          {q.working && (
            <div className="mx-4 mt-3">
              <button
                type="button"
                onClick={() => setShowWorking((s) => !s)}
                className="inline-flex items-center gap-1"
                style={{ color: C.accent, fontSize: 13 }}
              >
                {showWorking ? "Hide Working" : "Show Working"}
                {showWorking ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showWorking && (
                <div
                  style={{
                    marginTop: 8,
                    background: "rgba(0,194,168,0.06)",
                    borderLeft: `3px solid ${C.accent}`,
                    borderRadius: 10,
                    padding: 14,
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <MathText text={q.working} />
                </div>
              )}
            </div>
          )}

          <div className="mx-4" style={{ marginTop: 16, paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}>
            <button
              type="button"
              onClick={onNext}
              className="heading w-full"
              style={{
                height: 48,
                background: C.accent,
                color: C.primary,
                borderRadius: 12,
                fontSize: 15,
              }}
            >
              {isLast ? "See Results" : "Next Question"}
            </button>
          </div>
        </>
      )}
    </Screen>
  );
}
