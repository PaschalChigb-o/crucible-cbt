import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FileQuestion, Clock } from "lucide-react";
import { COURSE_CONFIG, EXAM_CONFIG } from "@/config/courses";
import { BackBar, C, Screen } from "@/components/ui-crucible";

export const Route = createFileRoute("/exam/$courseCode/")({
  head: ({ params }) => ({
    meta: [
      { title: `CRUCIBLE — Exam Brief ${params.courseCode}` },
      { name: "description", content: `Read the exam brief before starting your ${params.courseCode} paper.` },
      { property: "og:title", content: `CRUCIBLE — Exam ${params.courseCode}` },
      { property: "og:description", content: `Exam brief for ${params.courseCode}.` },
    ],
  }),
  component: ExamBriefing,
});

function ExamBriefing() {
  const { courseCode } = Route.useParams();
  const cfg = COURSE_CONFIG[courseCode];
  const exam = EXAM_CONFIG[courseCode];
  const nav = useNavigate();

  if (!cfg || !exam) {
    return (
      <Screen>
        <BackBar to="/exam" />
        <div className="px-4">
          <p>Course not found.</p>
          <Link to="/exam" style={{ color: C.accent }}>Back to exams</Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackBar to="/exam" />
      <div className="px-4 pb-8" style={{ marginTop: 8 }}>
        <h1 className="heading" style={{ fontSize: 22, color: C.gold }}>{cfg.name}</h1>
        <p style={{ fontSize: 14, color: cfg.color, marginBottom: 24 }}>{courseCode}</p>

        <div className="flex gap-3">
          <InfoCard icon={<FileQuestion size={24} color={C.gold} />} value={String(exam.questions)} label="Questions" />
          <InfoCard icon={<Clock size={24} color={C.gold} />} value={`${exam.minutes}m`} label="Time Allowed" />
        </div>

        <div
          style={{
            background: "rgba(201,168,76,0.06)",
            borderLeft: `3px solid ${C.gold}`,
            borderRadius: 12,
            padding: 16,
            marginTop: 20,
          }}
        >
          <div className="heading" style={{ fontSize: 11, color: C.gold, letterSpacing: 1.5, marginBottom: 8 }}>
            EXAM RULES
          </div>
          <ul style={{ fontSize: 14, color: C.textLight, lineHeight: 2, listStyle: "none" }}>
            <li>— Answers are not revealed during exam</li>
            <li>— You may skip and return to questions</li>
            <li>— Unanswered questions score zero</li>
            <li>— Submit before time runs out</li>
            <li>— Timer starts when you tap Begin</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => nav({ to: "/exam/$courseCode/session", params: { courseCode } })}
          className="heading w-full"
          style={{
            height: 56,
            marginTop: 24,
            background: C.gold,
            color: C.primary,
            borderRadius: 14,
            fontSize: 17,
          }}
        >
          Begin Exam
        </button>

        <Link
          to="/exam"
          className="text-center block"
          style={{
            height: 44,
            lineHeight: "44px",
            marginTop: 10,
            color: C.muted,
            fontSize: 14,
          }}
        >
          Cancel
        </Link>
      </div>
    </Screen>
  );
}

function InfoCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div
      className="flex-1 text-center"
      style={{ background: "rgba(247,250,252,0.08)", borderRadius: 12, padding: 16 }}
    >
      <div className="flex justify-center" style={{ marginBottom: 6 }}>{icon}</div>
      <div className="heading" style={{ fontSize: 28, color: C.gold }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{label}</div>
    </div>
  );
}
