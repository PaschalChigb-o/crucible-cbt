export interface Question {
  id: string;
  course: string;
  chapter: number | string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  working: string | null;
  variant_of: string | null;
}

/**
 * Loads and normalizes a course's question bank.
 * Handles two schemas:
 *  - { course, total, questions: [...] }
 *  - [ ... ]  (root array; PHY121)
 * Also strips option letter prefixes like "A) " when needed.
 */
export async function loadCourseQuestions(
  courseCode: string,
): Promise<Question[]> {
  try {
    // Check localStorage override first (admin import)
    const override = localStorage.getItem(`${courseCode}_override`);
    let raw: unknown;
    if (override) {
      raw = JSON.parse(override);
    } else {
      const response = await fetch(`/data/${courseCode}.json`);
      if (!response.ok) throw new Error(`Failed to load ${courseCode}`);
      raw = await response.json();
    }

    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as any)?.questions)
        ? (raw as any).questions
        : [];

    const normalized: Question[] = list.map((q: any) => {
      const answer: string =
        typeof q.answer === "string"
          ? q.answer
          : typeof q.correct_answer === "string"
            ? q.correct_answer
            : "";
      return {
        id: String(q.id ?? ""),
        course: String(q.course ?? courseCode),
        chapter: q.chapter ?? 1,
        type: String(q.type ?? "phrase"),
        question: String(q.question ?? ""),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        answer,
        explanation: String(q.explanation ?? ""),
        working: q.working ?? null,
        variant_of: q.variant_of ?? null,
      };
    });

    return normalized.filter((q) => q.id && q.options.length === 4);
  } catch (error) {
    console.error("[loadCourseQuestions]", error);
    return [];
  }
}
