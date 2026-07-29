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
      for (const n of autoDetect(buffer)) push(n);
      buffer = "";
    }
  };

  while (i < input.length) {
    const two = input.substr(i, 2);
    if (two === "\\[") {
      const end = input.indexOf("\\]", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "block", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (two === "\\(") {
      const end = input.indexOf("\\)", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "inline", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (two === "$$") {
      const end = input.indexOf("$$", i + 2);
      if (end !== -1) {
        flushText();
        push({ type: "block", value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
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

// Detect raw LaTeX tokens in undelimited text and wrap them as inline math.
// Handles patterns like \frac{a}{b}, \sqrt{x}, x^{2}, CO_{2}, x^2, H_2O, \alpha, etc.
const LATEX_TOKEN = /(\\[a-zA-Z]+(?:\s*\{[^{}]*\}(?:\s*\{[^{}]*\})?)?|[A-Za-z0-9]+(?:\^|_)(?:\{[^{}]*\}|[A-Za-z0-9]))/g;

function autoDetect(text: string): Node[] {
  if (!text) return [];
  LATEX_TOKEN.lastIndex = 0;
  const nodes: Node[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let found = false;
  while ((m = LATEX_TOKEN.exec(text)) !== null) {
    found = true;
    if (m.index > last) {
      nodes.push({ type: "text", value: text.slice(last, m.index) });
    }
    nodes.push({ type: "inline", value: m[0] });
    last = m.index + m[0].length;
  }
  if (!found) return [{ type: "text", value: text }];
  if (last < text.length) nodes.push({ type: "text", value: text.slice(last) });
  return nodes;
}

