import { createFileRoute, Link } from "@tanstack/react-router";
import { COURSE_CONFIG, COURSE_ORDER } from "@/config/courses";
import { BackBar, C, Screen } from "@/components/ui-crucible";
import { CourseIcon } from "@/components/CourseIcon";

export const Route = createFileRoute("/study/")({
  head: () => ({
    meta: [
      { title: "CRUCIBLE — Study Mode" },
      { name: "description", content: "Pick a course to revise at your own pace." },
      { property: "og:title", content: "CRUCIBLE — Study Mode" },
      {
        property: "og:description",
        content: "Choose from 9 courses to revise with instant feedback.",
      },
    ],
  }),
  component: StudyCourseSelect,
});

function StudyCourseSelect() {
  return (
    <Screen>
      <BackBar to="/home" />
      <div className="px-4" style={{ marginTop: 8 }}>
        <h1 className="heading" style={{ fontSize: 24, color: C.accent }}>
          Study Mode
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
          Pick a course to revise.
        </p>
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {COURSE_ORDER.map((code) => {
            const cfg = COURSE_CONFIG[code];
            return (
              <Link
                key={code}
                to="/study/$courseCode"
                params={{ courseCode: code }}
                className="flex flex-col"
                style={{
                  background: "rgba(247,250,252,0.06)",
                  borderRadius: 14,
                  borderLeft: `3px solid ${cfg.color}`,
                  padding: "14px 12px",
                  minHeight: 100,
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="heading"
                    style={{ fontSize: 15, color: cfg.color }}
                  >
                    {code}
                  </span>
                  <CourseIcon
                    name={cfg.icon}
                    size={20}
                    color={cfg.color}
                    style={{ opacity: 0.8 }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: C.textLight,
                    opacity: 0.85,
                    marginTop: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {cfg.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
