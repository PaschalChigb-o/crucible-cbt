import { useMemo } from "react";
import katex from "katex";

/**
 * MathText renders a string that may contain inline math delimited by
 * \( ... \) or $ ... $, and block math delimited by \[ ... \] or $$ ... $$.
 * Non-math text is rendered as-is (with line breaks preserved).
 * Falls back to plain text on any KaTeX error.
 */
export function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const nodes = useMemo(() => parseMath(text ?? ""), [text]);
  return (
    <span className={className} style={{ whiteSpace: "pre-wrap" }}>
      {nodes.map((n, i) => {
        if (n.type === "text") return <span key={i}>{n.value}</span>;
        try {
          const html = katex.renderToString(n.value, {
            throwOnError: false,
            displayMode: n.type === "block",
            output: "html",
          });
          return (
            <span
              key={i}
              style={{ display: n.type === "block" ? "block" : "inline" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={i}>{n.value}</span>;
        }
      })}
    </span>
  );
}

type Node =
  | { type: "text"; value: string }
  | { type: "inline"; value: string }
  | { type: "block"; value: string };

function parseMath(input: string): Node[] {
  const out: Node[] = [];
  let i = 0;
  const push = (n: Node) => {
    if (n.type === "text" && !n.value) return;
    out.push(n);
  };
  let buffer = "";
  const flushText = () => {
    if (buffer) {
      push({ type: "text", value: buffer });
      buffer = "";
    }
  };

  while (i < input.length) {
    const two = input.substr(i, 2);
    // \[ ... \]
    if (two === "\\[") {
      const end = input.indexOf("\\]", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "block", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // \( ... \)
    if (two === "\\(") {
      const end = input.indexOf("\\)", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "inline", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // $$ ... $$
    if (two === "$$") {
      const end = input.indexOf("$$", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "block", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // $ ... $
    if (input[i] === "$") {
      const end = input.indexOf("$", i + 1);
      if (end !== -1) {
        flushText();
        push({ type: "inline", value: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buffer += input[i];
    i++;
  }
  flushText();
  return out;
}
