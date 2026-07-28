import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { COURSE_CONFIG } from "@/config/courses";
import { BackBar, C, Screen } from "@/components/ui-crucible";
import { loadCourseQuestions } from "@/utils/questionLoader";

export const Route = createFileRoute("/study/$courseCode")({
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Study ${params.courseCode}` },
      {
        name: "description",
        content: `Set up a Study Mode session for ${params.courseCode}.`,
      },
      { property: "og:title", content: `CRUCIBLE — Study ${params.courseCode}` },
      {
        property: "og:description",
        content: `Study Mode setup for ${params.courseCode}.`,
      },
    ],
  }),
  component: StudySetup,
});

function StudySetup() {
  const { courseCode } = Route.useParams();
  const cfg = COURSE_CONFIG[courseCode];
  const nav = useNavigate();
  const [total, setTotal] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [customStr, setCustomStr] = useState("");

  useEffect(() => {
    loadCourseQuestions(courseCode).then((q) => setTotal(q.length));
  }, [courseCode]);

  if (!cfg) {
    return (
      <Screen>
        <BackBar to="/study" />
        <div className="px-4">Course not found.</div>
      </Screen>
    );
  }

  const presets = [10, 20, 30, 50].filter((n) => total === null || n <= total);
  const canStart = !!count && count > 0 && (total === null || count <= total);

  return (
    <Screen>
      <BackBar to="/study" />
      <div className="px-4 pb-8" style={{ marginTop: 8 }}>
        <h1 className="heading" style={{ fontSize: 22, color: C.textLight }}>
          {cfg.name}
        </h1>
        <p style={{ fontSize: 14, color: cfg.color, marginBottom: 8 }}>
          {courseCode}
        </p>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
          Choose how many questions to attempt:
        </p>

        <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
          {presets.map((n) => (
            <PresetButton
              key={n}
              label={String(n)}
              active={count === n}
              color={cfg.color}
              onClick={() => {
                setCount(n);
                setCustomStr("");
              }}
            />
          ))}
          {total !== null && (
            <PresetButton
              label="All"
              active={count === total}
              color={cfg.color}
              onClick={() => {
                setCount(total);
                setCustomStr("");
              }}
            />
          )}
        </div>

        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={total ?? undefined}
          placeholder="Custom number"
          value={customStr}
          onChange={(e) => {
            const v = e.target.value;
            setCustomStr(v);
            const n = parseInt(v, 10);
            if (!isNaN(n) && n > 0) setCount(Math.min(n, total ?? n));
            else setCount(null);
          }}
          className="w-full"
          style={{
            border: `1px solid ${C.muted}`,
            background: "rgba(247,250,252,0.08)",
            color: C.textLight,
            borderRadius: 10,
            padding: 12,
            fontSize: 16,
          }}
        />

        {total !== null && (
          <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>
            {total} questions available
          </p>
        )}

        <button
          type="button"
          disabled={!canStart}
          onClick={() =>
            nav({
              to: "/session/$courseCode",
              params: { courseCode },
              search: { count: count! },
            })
          }
          className="heading w-full"
          style={{
            height: 52,
            marginTop: 24,
            background: C.accent,
            color: C.primary,
            borderRadius: 12,
            fontSize: 16,
            opacity: canStart ? 1 : 0.4,
          }}
        >
          Start Revision
        </button>
      </div>
    </Screen>
  );
}

function PresetButton({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="heading"
      style={{
        height: 44,
        minWidth: 64,
        padding: "0 16px",
        borderRadius: 10,
        border: active ? `1.5px solid ${color}` : `1px solid ${C.muted}`,
        background: active ? `${color}33` : "transparent",
        color: active ? color : C.muted,
        fontSize: 15,
      }}
    >
      {label}
    </button>
  );
}
