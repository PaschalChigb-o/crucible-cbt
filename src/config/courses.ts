export type CourseCode =
  | "GST121"
  | "MTH121"
  | "PHY121"
  | "CHM121"
  | "STAT122"
  | "BIO121"
  | "PHY128"
  | "CHM128"
  | "BIO128";

export const COURSE_CONFIG: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  GST121: { name: "General Studies", color: "#7C83FD", icon: "Globe" },
  MTH121: { name: "Mathematics", color: "#F97316", icon: "Sigma" },
  PHY121: { name: "Physics", color: "#38BDF8", icon: "Zap" },
  CHM121: { name: "Chemistry", color: "#A78BFA", icon: "FlaskConical" },
  STAT122: { name: "Statistics", color: "#FB923C", icon: "BarChart2" },
  BIO121: { name: "Biology", color: "#4ADE80", icon: "Leaf" },
  PHY128: { name: "Physics Practical", color: "#67E8F9", icon: "Microscope" },
  CHM128: { name: "Chemistry Practical", color: "#C084FC", icon: "TestTube" },
  BIO128: { name: "Biology Practical", color: "#86EFAC", icon: "Sprout" },
};

export const EXAM_CONFIG: Record<
  string,
  { questions: number; minutes: number }
> = {
  GST121: { questions: 35, minutes: 35 },
  MTH121: { questions: 40, minutes: 25 },
  PHY121: { questions: 35, minutes: 35 },
  CHM121: { questions: 35, minutes: 30 },
  STAT122: { questions: 40, minutes: 35 },
  BIO121: { questions: 35, minutes: 35 },
  PHY128: { questions: 15, minutes: 10 },
  CHM128: { questions: 15, minutes: 10 },
  BIO128: { questions: 15, minutes: 10 },
};

export const COURSE_ORDER: string[] = [
  "GST121",
  "MTH121",
  "PHY121",
  "CHM121",
  "STAT122",
  "BIO121",
  "PHY128",
  "CHM128",
  "BIO128",
];
