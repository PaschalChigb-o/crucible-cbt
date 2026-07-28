import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackBar, C, Screen } from "@/components/ui-crucible";
import { COURSE_CONFIG } from "@/config/courses";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "CRUCIBLE — Admin" },
      { name: "description", content: "Import a CRUCIBLE question bank JSON file." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "CRUCIBLE — Admin" },
      { property: "og:description", content: "Question bank import panel." },
    ],
  }),
  component: Admin,
});

interface Parsed {
  raw: string;
  course: string;
  count: number;
  valid: boolean;
  reason?: string;
  filename: string;
}

function Admin() {
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [status, setStatus] = useState<{ text: string; color: string } | null>(null);

  const onFile = async (f: File | null) => {
    setStatus(null);
    if (!f) {
      setParsed(null);
      return;
    }
    try {
      const text = await f.text();
      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : data?.questions;
      const course = Array.isArray(data)
        ? (data[0]?.course as string) ?? "UNKNOWN"
        : (data?.course as string) ?? "UNKNOWN";
      const count = Array.isArray(list) ? list.length : 0;
      const valid = !!course && Array.isArray(list) && count > 0 && !!COURSE_CONFIG[course];
      setParsed({
        raw: text,
        course,
        count,
        valid,
        reason: valid ? undefined : "Unknown course or empty question list",
        filename: f.name,
      });
    } catch (e: any) {
      setParsed({
        raw: "",
        course: "—",
        count: 0,
        valid: false,
        reason: e?.message ?? "Invalid JSON",
        filename: f.name,
      });
    }
  };

  const importIt = () => {
    if (!parsed || !parsed.valid) return;
    try {
      localStorage.setItem(`${parsed.course}_override`, parsed.raw);
      setStatus({
        text: `Course ${parsed.course} updated — ${parsed.count} questions loaded`,
        color: C.success,
      });
    } catch {
      setStatus({ text: "Invalid file — check format", color: C.error });
    }
  };

  return (
    <Screen>
      <BackBar to="/home" />
      <div className="px-4" style={{ marginTop: 8 }}>
        <h1 className="heading" style={{ fontSize: 20, color: C.gold }}>
          Admin — Import Question Bank
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
          Upload a valid CRUCIBLE JSON file to update a course question bank.
        </p>

        <label
          className="block text-center cursor-pointer"
          style={{
            border: `2px dashed ${C.muted}`,
            borderRadius: 16,
            background: "rgba(247,250,252,0.05)",
            padding: 40,
            fontSize: 14,
            color: C.muted,
          }}
        >
          Tap to select JSON file
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            style={{ display: "none" }}
          />
        </label>

        {parsed && (
          <div
            style={{
              background: "rgba(247,250,252,0.08)",
              borderRadius: 12,
              padding: 14,
              marginTop: 16,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <div>File: <span style={{ color: C.textLight }}>{parsed.filename}</span></div>
            <div>Course: <span style={{ color: C.accent }}>{parsed.course}</span></div>
            <div>Questions: <span style={{ color: C.gold }}>{parsed.count}</span></div>
            <div>
              Validation:{" "}
              <span style={{ color: parsed.valid ? C.success : C.error }}>
                {parsed.valid ? "Valid ✓" : `Invalid ✗ (${parsed.reason})`}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={importIt}
          disabled={!parsed?.valid}
          className="heading w-full"
          style={{
            height: 48,
            marginTop: 16,
            background: C.accent,
            color: C.primary,
            borderRadius: 12,
            opacity: parsed?.valid ? 1 : 0.4,
          }}
        >
          Import to App
        </button>

        {status && (
          <p style={{ marginTop: 12, fontSize: 14, color: status.color }}>
            {status.text}
          </p>
        )}
      </div>
    </Screen>
  );
}
