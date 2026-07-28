import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { COURSE_CONFIG, EXAM_CONFIG } from "@/config/courses";
import { C, Screen } from "@/components/ui-crucible";
import { loadCourseQuestions, type Question } from "@/utils/questionLoader";
import { buildSessionQuestions, markSeen } from "@/utils/session";
import { MathText } from "@/components/MathText";

export const Route = createFileRoute("/exam/$courseCode/session")({
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Exam ${params.courseCode}` },
      { name: "description", content: `Timed exam paper for ${params.courseCode}.` },
      { property: "og:title", content: `CRUCIBLE — Exam ${params.courseCode}` },
      { property: "og:description", content: `Sit the timed exam for ${params.courseCode}.` },
    ],
  }),
  component: ExamSession,
});

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

function ExamSession() {
  const { courseCode } = Route.useParams();
  const cfg = COURSE_CONFIG[courseCode];
  const exam = EXAM_CONFIG[courseCode];
  const nav = useNavigate();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState((exam?.minutes ?? 0) * 60);
  const [showSubmit, setShowSubmit] = useState(false);
  const submittedRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const timeLimitSec = (exam?.minutes ?? 0) * 60;

  useEffect(() => {
    if (!exam) {
      nav({ to: "/exam" });
      return;
    }
    loadCourseQuestions(courseCode).then((all) => {
      if (all.length === 0) return;
      const list = buildSessionQuestions(courseCode, all, exam.questions);
      setQuestions(list);
    });
  }, [courseCode, exam, nav]);

  const submit = () => {
    if (submittedRef.current || !questions) return;
    submittedRef.current = true;
    const result: ExamResult = {
      questions,
      answers,
      skipped: [...skipped],
      timeUsedSec: timeLimitSec - timeLeft,
      timeLimitSec,
    };
    localStorage.setItem(`${courseCode}_exam_last`, JSON.stringify(result));
    markSeen(courseCode, questions.map((q) => q.id));
    nav({ to: "/exam/$courseCode/results", params: { courseCode } });
  };

  // Countdown
  useEffect(() => {
    if (!questions) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          submit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  useEffect(() => {
    setVisited((v) => {
      if (v.has(idx)) return v;
      const n = new Set(v);
      n.add(idx);
      return n;
    });
    // Scroll grid button into view
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-i="${idx}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [idx]);

  if (!questions) {
    return (
      <Screen>
        <div className="px-4" style={{ paddingTop: 24, color: C.muted }}>Loading exam…</div>
      </Screen>
    );
  }
  if (questions.length === 0) {
    return (
      <Screen>
        <div className="px-4" style={{ paddingTop: 24 }}>No questions available.</div>
      </Screen>
    );
  }

  const q = questions[idx];
  const selected = answers[q.id];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const skippedCount = [...skipped].filter((id) => !answers[id]).length;
  const unanswered = total - answeredCount;

  const timerColor = timeLeft > 60 ? C.accent : timeLeft > 30 ? C.gold : C.error;
  const timerPulse = timeLeft <= 30;

  const selectOption = (opt: string) => {
    setAnswers((a) => {
      const cur = a[q.id];
      const next = { ...a };
      if (cur === opt) delete next[q.id];
      else next[q.id] = opt;
      return next;
    });
    setSkipped((s) => {
      if (!s.has(q.id)) return s;
      const n = new Set(s);
      n.delete(q.id);
      return n;
    });
  };

  const goto = (i: number) => setIdx(Math.max(0, Math.min(total - 1, i)));

  const skip = () => {
    setSkipped((s) => new Set(s).add(q.id));
    // Advance to next unanswered
    for (let i = 1; i <= total; i++) {
      const j = (idx + i) % total;
      if (!answers[questions[j].id]) {
        setIdx(j);
        return;
      }
    }
    setIdx((idx + 1) % total);
  };

  return (
    <Screen>
      <div
        className="flex items-center justify-between px-4"
        style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
      >
        <span style={{ fontSize: 13, color: C.muted }}>{courseCode}</span>
        <span className="heading" style={{ fontSize: 14 }}>
          Q {idx + 1} of {total}
        </span>
        <span
          className={`heading ${timerPulse ? "timer-pulse" : ""}`}
          style={{ fontSize: 18, color: timerColor }}
        >
          {fmt(timeLeft)}
        </span>
      </div>

      <div ref={gridRef} className="scroll-touch flex overflow-x-auto" style={{ gap: 6, padding: "8px 16px" }}>
        {questions.map((qq, i) => {
          const isCurrent = i === idx;
          const isAnswered = !!answers[qq.id];
          const isSkipped = skipped.has(qq.id) && !isAnswered;
          let bg = "rgba(74,85,104,0.15)";
          let border = `1px solid ${C.muted}`;
          let color = C.muted;
          if (isCurrent) {
            bg = "rgba(0,194,168,0.25)";
            border = `2px solid ${C.accent}`;
            color = C.accent;
          } else if (isAnswered) {
            bg = "rgba(46,204,113,0.25)";
            border = `1px solid ${C.success}`;
            color = C.success;
          } else if (isSkipped) {
            bg = "rgba(201,168,76,0.25)";
            border = `1px solid ${C.gold}`;
            color = C.gold;
          }
          return (
            <button
              type="button"
              key={qq.id}
              data-i={i}
              onClick={() => goto(i)}
              className="heading"
              style={{
                minWidth: 34,
                height: 34,
                borderRadius: 8,
                background: bg,
                border,
                color,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="pb-40">
        <div
          className="mx-4"
          style={{ background: "rgba(247,250,252,0.08)", borderRadius: 16, padding: 20 }}
        >
          <MathText text={q.question} />
        </div>

        <div className="mx-4 mt-3 flex flex-col" style={{ gap: 10 }}>
          {q.options.map((opt) => {
            const isSelected = opt === selected;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => selectOption(opt)}
                className="flex items-center text-left"
                style={{
                  background: isSelected ? "rgba(0,194,168,0.2)" : "rgba(247,250,252,0.08)",
                  border: isSelected ? `2px solid ${C.accent}` : `1px solid rgba(74,85,104,0.4)`,
                  color: isSelected ? C.accent : C.textLight,
                  borderRadius: 12,
                  padding: "14px 16px",
                  minHeight: 52,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: isSelected ? C.accent : "transparent",
                    border: `2px solid ${isSelected ? C.accent : C.muted}`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, fontSize: 15 }}>
                  <MathText text={opt} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 flex"
        style={{
          background: C.primary,
          borderTop: "1px solid rgba(74,85,104,0.3)",
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          gap: 10,
        }}
      >
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => goto(idx - 1)}
          style={{
            flex: 1,
            height: 46,
            borderRadius: 10,
            border: `1px solid ${C.muted}`,
            color: C.textLight,
            background: "transparent",
            fontSize: 14,
            opacity: idx === 0 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={skip}
          style={{
            flex: 1,
            height: 46,
            borderRadius: 10,
            background: "rgba(201,168,76,0.12)",
            border: `1px solid ${C.gold}`,
            color: C.gold,
            fontSize: 14,
          }}
        >
          Skip →
        </button>
        <button
          type="button"
          onClick={() => setShowSubmit(true)}
          className="heading"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 10,
            background: C.error,
            color: C.textLight,
            fontSize: 14,
          }}
        >
          Submit
        </button>
      </div>

      {showSubmit && (
        <div
          className="fixed inset-0 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 50 }}
        >
          <div
            style={{
              background: C.primary,
              border: `1px solid rgba(201,168,76,0.4)`,
              borderRadius: 18,
              padding: 24,
              maxWidth: 320,
              width: "100%",
            }}
          >
            <div className="flex justify-center">
              <AlertTriangle size={32} color={C.gold} />
            </div>
            <h2 className="heading text-center" style={{ fontSize: 20, color: C.gold, marginTop: 12 }}>
              Submit Exam?
            </h2>
            <div
              style={{
                background: "rgba(247,250,252,0.08)",
                borderRadius: 12,
                padding: 14,
                marginTop: 16,
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              <div style={{ color: C.success }}>Answered: {answeredCount}</div>
              <div style={{ color: C.gold }}>Skipped: {skippedCount}</div>
              <div style={{ color: C.error }}>Unanswered: {unanswered}</div>
            </div>
            {unanswered > 0 && (
              <p style={{ fontSize: 13, color: C.error, marginTop: 10 }}>
                Unanswered questions will score zero.
              </p>
            )}
            <p
              className={`heading ${timerPulse ? "timer-pulse" : ""}`}
              style={{ fontSize: 14, color: timerColor, marginTop: 12, textAlign: "center" }}
            >
              Time remaining: {fmt(timeLeft)}
            </p>
            <div className="flex gap-3" style={{ marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setShowSubmit(false)}
                className="heading"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(0,194,168,0.15)",
                  border: `1px solid ${C.accent}`,
                  color: C.accent,
                  fontSize: 14,
                }}
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={submit}
                className="heading"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  background: C.error,
                  color: C.textLight,
                  fontSize: 14,
                }}
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
