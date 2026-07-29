import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { C } from "@/components/ui-crucible";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRUCIBLE — Enter the crucible. Leave prepared." },
      {
        name: "description",
        content:
          "CBT examination practice for 100lvl Nigerian university students. 9 courses, 1350+ questions",
      },
      {
        property: "og:title",
        content: "CRUCIBLE — Enter the crucible. Leave prepared.",
      },
      {
        property: "og:description",
        content:
          "CBT examination practice for 100lvl Nigerian university students. 9 courses, 1350+ questions",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/home" }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: C.primary }}
    >
      <div className="fade-in flex flex-col items-center text-center">
        <img
          src="/assets/logo.png"
          alt="CRUCIBLE"
          width={120}
          height={120}
          style={{ width: 120, height: 120, borderRadius: 24 }}
        />
        <h1
          className="heading"
          style={{ fontSize: 36, color: C.gold, marginTop: 20 }}
        >
          CRUCIBLE
        </h1>
        <p
          style={{
            fontSize: 14,
            color: C.textLight,
            opacity: 0.7,
            marginTop: 8,
          }}
        >
          Enter the crucible. Leave prepared.
        </p>
      </div>
    </div>
  );
}
