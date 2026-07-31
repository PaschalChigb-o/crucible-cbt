# Crucible Prep

PROJECT OVERVIEW

Build a complete Progressive Web App (PWA) called 

CRUCIBLE — a CBT (Computer-Based Test) examination 

practice application for Nigerian university students 

across all faculties and departments.



App name:     CRUCIBLE

Tagline:      "Enter the crucible. Leave prepared."

Framework:    React with Tailwind CSS

Type:         PWA — offline-first, installable on 

              Android (APK via PWABuilder) and iOS 

              (Add to Home Screen via Safari)



This is a full build from scratch. Build every 

screen, every component, every logic layer, and 

every configuration file completely before presenting 

the preview. Do not stop for confirmation between 

screens — complete the entire app in one build pass.



════════════════════════════════════════════════════

SECTION 1 — VISUAL IDENTITY

════════════════════════════════════════════════════



COLOUR PALETTE

Define all colours as custom tokens in 

tailwind.config.js under theme.extend.colors:



  primary:    '#0D1F3C'   Navy — main background

  accent:     '#00C2A8'   Teal — primary actions

  success:    '#2ECC71'   Emerald — correct answers

  error:      '#E74C3C'   Red — wrong answers

  gold:       '#C9A84C'   Gold — brand, exam mode

  forest:     '#1B4D3E'   Forest green — progress

  muted:      '#4A5568'   Mid-grey — secondary UI

  surface:    '#F7FAFC'   Light — card backgrounds

  textLight:  '#F0F4F8'   Off-white — dark bg text

  textDark:   '#1A1A2E'   Near-black — light bg text



TYPOGRAPHY

Import from Google Fonts in index.html:

  Outfit (weights: 400, 700)

  DM Sans (weights: 400, 500)



Apply globally in index.css:

  All h1, h2, h3, .heading elements:

    font-family: 'Outfit', sans-serif

  All body, p, span, button, input elements:

    font-family: 'DM Sans', sans-serif



LOGO

File location: /public/assets/logo.png

This is a geometric gold flame inside a navy 

shield on a rounded square background.

Use at these sizes:

  Splash screen:    120×120px centered

  Home screen:      80×80px centered

  Top bar icon:     32×32px right-aligned

  PWA manifest:     Reference for 192px and 512px



COURSE IDENTITY

Each course has a unique accent colour and icon.

Apply these as inline style values (not Tailwind 

class names) since they are dynamic:



  GST121  General Studies      #7C83FD  Globe icon

  MTH121  Mathematics          #F97316  Sigma (Σ) icon

  PHY121  Physics              #38BDF8  Lightning bolt

  CHM121  Chemistry            #A78BFA  Flask icon

  STAT122 Statistics           #FB923C  Bar chart icon

  BIO121  Biology              #4ADE80  Leaf icon

  PHY128  Physics Practical    #67E8F9  Microscope icon

  CHM128  Chemistry Practical  #C084FC  Test tube icon

  BIO128  Biology Practical    #86EFAC  Seedling icon



Store in a shared config file 

/src/config/courses.ts:



export const COURSE_CONFIG = {

  GST121:  { name: 'General Studies',

             color: '#7C83FD', icon: 'Globe' },

  MTH121:  { name: 'Mathematics',

             color: '#F97316', icon: 'Sigma' },

  PHY121:  { name: 'Physics',

             color: '#38BDF8', icon: 'Zap' },

  CHM121:  { name: 'Chemistry',

             color: '#A78BFA', icon: 'FlaskConical' },

  STAT122: { name: 'Statistics',

             color: '#FB923C', icon: 'BarChart2' },

  BIO121:  { name: 'Biology',

             color: '#4ADE80', icon: 'Leaf' },

  PHY128:  { name: 'Physics Practical',

             color: '#67E8F9', icon: 'Microscope' },

  CHM128:  { name: 'Chemistry Practical',

             color: '#C084FC', icon: 'TestTube' },

  BIO128:  { name: 'Biology Practical',

             color: '#86EFAC', icon: 'Sprout' },

};



Use lucide-react for all icons.



════════════════════════════════════════════════════

SECTION 2 — MATHEMATICS RENDERING

════════════════════════════════════════════════════



Install and configure KaTeX for mathematical 

expression rendering.



Install: katex

Import KaTeX CSS in main.tsx or index.css:

  import 'katex/dist/katex.min.css'



Create a reusable component /src/components/

MathText.tsx that:



  Accepts a text string as input

  Scans the string for math delimiters:

    Inline math:  \( ... \)  or  $ ... $

    Block math:   \[ ... \]  or  $$ ... $$

  Renders math segments using KaTeX

  Renders non-math segments as plain text

  Falls back to plain text if KaTeX throws 

  an error — never crash on bad math input



Use the MathText component everywhere 

question text, options, explanations, 

and working fields are rendered.

This ensures ALL mathematical notation 

renders exactly as it appears in a textbook:

fractions, integrals, Greek letters, 

subscripts, superscripts, square roots, 

sigma notation, chemical formulas.



════════════════════════════════════════════════════

SECTION 3 — DATA ARCHITECTURE

════════════════════════════════════════════════════



QUESTION BANK FILES

All question banks are local JSON files 

bundled with the app.

Place all uploaded JSON files at:

  /public/data/GST121.json

  /public/data/MTH121.json

  /public/data/PHY121.json

  /public/data/CHM121.json

  /public/data/STAT122.json

  /public/data/BIO121.json

  /public/data/PHY128.json

  /public/data/CHM128.json

  /public/data/BIO128.json



For any course JSON not yet uploaded, 

create a valid placeholder:

{

  "course": "COURSECODE",

  "total": 3,

  "questions": [

    {

      "id": "COURSECODE_C1_001",

      "course": "COURSECODE",

      "chapter": 1,

      "type": "phrase",

      "question": "Placeholder question.",

      "options": ["A","B","C","D"],

      "answer": "A",

      "explanation": "Placeholder explanation.",

      "working": null,

      "variant_of": null

    }

  ]

}



QUESTION SCHEMA (every field required)

{

  "id":          string  — COURSECODE_C[X]_[NNN]

  "course":      string  — course code

  "chapter":     number  — integer

  "type":        string  — "phrase" or "calculation"

  "question":    string  — may contain KaTeX notation

  "options":     array   — exactly 4 strings

  "answer":      string  — exact text of correct option

  "explanation": string  — may contain KaTeX notation

  "working":     string|null — full step-by-step 

                              solution or null

  "variant_of":  string|null — parent ID or null

}



EXAM CONFIG

Store in /src/config/courses.ts alongside 

COURSE_CONFIG:



export const EXAM_CONFIG: Record<string, 

  { questions: number; minutes: number }> = {

  GST121:  { questions: 35, minutes: 35 },

  MTH121:  { questions: 40, minutes: 25 },

  PHY121:  { questions: 35, minutes: 35 },

  CHM121:  { questions: 35, minutes: 30 },

  STAT122: { questions: 40, minutes: 35 },

  BIO121:  { questions: 35, minutes: 35 },

  PHY128:  { questions: 15, minutes: 10 },

  CHM128:  { questions: 15, minutes: 10 },

  BIO128:  { questions: 15, minutes: 10 },

};



QUESTION LOADING UTILITY

Create /src/utils/questionLoader.ts:



export async function loadCourseQuestions(

  courseCode: string

): Promise<Question[]> {

  try {

    const response = await fetch(

      `/data/${courseCode}.json`

    );

    if (!response.ok) throw new Error(

      `Failed to load ${courseCode}`

    );

    const data = await response.json();

    return data.questions;

  } catch (error) {

    console.error(error);

    return [];

  }

}



SHUFFLE UTILITY

Create /src/utils/shuffle.ts:



Fisher-Yates shuffle function that accepts 

an array and returns a new shuffled array 

without mutating the original.



SEEN/UNSEEN TRACKING

localStorage key per course: [COURSECODE]_seen

Value: JSON array of seen question IDs

On new session: filter questions to unseen only

On exhaustion: clear localStorage key,

treat all questions as unseen again



VARIANT FILTERING

Before finalising session question list:

For each selected question where variant_of 

is not null, ensure the parent question is 

not also in the session list.

For each question in the list, ensure none 

of its variants (questions where variant_of 

equals this question's ID) are also selected.

This ensures a student never sees both 

a question and its rephrased variant 

in the same session.



SESSION STATE

localStorage key: [COURSECODE]_[mode]_session

where mode is 'study' or 'exam'

Value:

{

  "questions": [],    array of question IDs

  "current": 0,       current index

  "answers": {},      map of ID to selected answer

  "skipped": [],      array of skipped IDs (exam)

  "startTime": 0,     timestamp

  "timeLimit": 0,     seconds (exam only)

  "complete": false

}

On app reload: detect existing session,

offer Resume or Start New.



════════════════════════════════════════════════════

SECTION 4 — ROUTING

════════════════════════════════════════════════════



Use React Router. Define all routes in App.tsx:



/                       SplashScreen

/home                   HomeScreen

/study                  StudyCourseSelect

/study/:courseCode      StudySetup

/session/:courseCode    StudySession

/results/:courseCode    StudyResults

/exam                   ExamCourseSelect

/exam/:courseCode       ExamBriefing

/exam/:courseCode/      ExamSession

  session

/exam/:courseCode/      ExamResults

  results

/admin                  AdminPanel



Wrap all routes in a React error boundary 

that catches rendering errors and shows:

  "Something went wrong loading this screen."

  Back button returning to /home

  Background: primary, text: textLight



════════════════════════════════════════════════════

SECTION 5 — SCREENS

════════════════════════════════════════════════════



─────────────────────────

SCREEN 1: SPLASH SCREEN

Route: /



Background: primary (#0D1F3C)

Full screen, nothing else visible.



Center vertically and horizontally:

  Logo: /public/assets/logo.png at 120×120px

  App name: CRUCIBLE

    Outfit Bold, 36px, gold (#C9A84C)

    Margin top: 20px

  Tagline: "Enter the crucible. Leave prepared."

    DM Sans Regular, 14px, 

    textLight at 70% opacity

    Margin top: 8px



Animation: entire center block fades in 

over 800ms on mount.



Auto-navigate to /home after 2500ms.

No buttons or interaction.



─────────────────────────

SCREEN 2: HOME SCREEN

Route: /home



Background: primary



TOP BAR:

  Left: CRUCIBLE in Outfit Bold, 22px, gold

  Right: logo icon 32×32px



HERO SECTION (centered, padding top 48px):

  Logo: 80×80px centered

  

  "Enter the crucible."

  Outfit Bold, 22px, gold, centered

  Margin top: 16px

  

  "Leave prepared."

  DM Sans, 15px, textLight at 70%, centered

  Margin top: 4px

  

  Thin divider: 48px wide, 1px, 

  gold at 30% opacity, centered

  Margin top: 20px, margin bottom: 20px

  

  "9 courses · 1,350 questions"

  DM Sans, 13px, accent, centered



MODE BUTTONS (padding: 0 24px, margin top: 40px):



  STUDY MODE BUTTON:

    Full width, height: 64px

    Background: accent at 12% opacity

    Border: 1.5px solid accent

    Border radius: 14px

    Layout: horizontal flex, 

            align items center, gap: 12px

    Left: BookOpen icon, accent, 22px

    Center (flex column):

      "Study Mode"

        Outfit Bold, 17px, accent

      "Revise at your own pace"

        DM Sans, 12px, accent at 70%

    Right: ChevronRight icon, accent, 18px

    Tap: navigate to /study



  Gap: 14px



  EXAM MODE BUTTON:

    Full width, height: 64px

    Background: gold at 12% opacity

    Border: 1.5px solid gold

    Border radius: 14px

    Layout: horizontal flex,

            align items center, gap: 12px

    Left: Timer icon, gold, 22px

    Center (flex column):

      "Exam Mode"

        Outfit Bold, 17px, gold

      "Timed exam conditions"

        DM Sans, 12px, gold at 70%

    Right: ChevronRight icon, gold, 18px

    Tap: navigate to /exam



PLATFORM BANNER (bottom):

  Detect standalone mode:

  if (window.matchMedia(

    '(display-mode: standalone)').matches 

    || navigator.standalone) {

    render nothing

  }

  iOS Safari: 

    "Tap Share ⬆ then Add to Home Screen"

  Android Chrome: 

    "Tap ⋮ then Add to Home Screen"

  Desktop: 

    "Open on your phone to install"

  

  DM Sans 11px, textLight at 50%

  Padding: 12px 24px, centered

  Border-top: 1px solid muted at 20%



─────────────────────────

SCREEN 3: STUDY COURSE SELECTION

Route: /study



Background: primary

Back arrow top left → /home



Heading: "Study Mode"

  Outfit Bold, 24px, accent

Subheading: "Pick a course to revise."

  DM Sans, 14px, muted

Margin bottom: 24px



3×3 course card grid (padding: 0 16px):

Each card:

  Background: surface at 6% opacity

  Border radius: 14px

  Border-left: 3px solid [course color]

  Padding: 14px 12px

  Min height: 100px



  Top row (flex, space-between):

    Course code: Outfit Bold, 15px, 

    [course color]

    Course icon: 20px, [course color], 

    opacity 0.8



  Course name: DM Sans, 12px, 

  textLight at 85%

  Margin top: 6px



  Tap: navigate to /study/:courseCode



─────────────────────────

SCREEN 4: STUDY SETUP SCREEN

Route: /study/:courseCode



Background: primary

Back arrow → /study



Course name: Outfit Bold, 22px, textLight

Course code: DM Sans, 14px, [course color]

Margin bottom: 8px

"Choose how many questions to attempt:"

DM Sans, 14px, muted



QUESTION COUNT PRESETS:

Row of buttons: [10] [20] [30] [50] [All]

  Active: background [course color] at 20%,

          border 1.5px solid [course color],

          text [course color]

  Inactive: background transparent,

            border 1px solid muted,

            text muted

  Height: 44px, border radius: 10px

  Hide any preset exceeding total questions



Custom input:

  Placeholder: "Custom number"

  Type: number, min: 1, 

  max: total questions

  Border: 1px solid muted

  Focus border: [course color]

  Background: surface at 8% opacity

  Text: textLight, font-size: 16px

  Border radius: 10px, padding: 12px



START BUTTON:

  "Start Revision"

  Full width, height: 52px

  Background: accent

  Text: Outfit Bold, 16px, primary

  Border radius: 12px

  Disabled (opacity 0.4) until 

  question count is selected

  Tap: load questions, navigate to 

  /session/:courseCode passing count 

  via router state



─────────────────────────

SCREEN 5: STUDY SESSION SCREEN

Route: /session/:courseCode



On mount:

  Load questions from /public/data/

  [courseCode].json using loadCourseQuestions

  Apply seen/unseen filter

  Apply variant filtering

  Shuffle with Fisher-Yates

  Take [count] questions from result

  If loading fails: show error state with 

  back button



TOP BAR:

  Left: course code, DM Sans 13px, muted

  Center: "Q [current] of [total]"

    Outfit Bold, 14px, textLight

  No timer



PROGRESS BAR:

  Full width, height: 4px

  Background: muted at 30%

  Fill: [course color] — progresses 

  as questions are answered

  Border radius: pill



QUESTION CARD:

  Background: surface at 8% opacity

  Border radius: 16px

  Padding: 20px

  Margin: 16px

  Question text: render with MathText 

  component, DM Sans 17px, textLight, 

  line-height: 1.6



OPTIONS (4 buttons, stacked, gap: 10px):

  Default:

    Background: surface at 8% opacity

    Border: 1px solid muted at 40%

    Text: DM Sans 15px, textLight

    Border radius: 12px

    Padding: 14px 16px

    Min height: 52px

    Render option text with MathText



  After answer selected — Correct option:

    Background: success at 15% opacity

    Border: 2px solid success

    Text: success

    Right icon: CheckCircle, success, 18px



  After answer selected — Wrong selected:

    Background: error at 15% opacity

    Border: 2px solid error

    Text: error

    Right icon: XCircle, error, 18px



  After answer selected — Correct (revealed):

    If student chose wrong, also highlight 

    the correct option with success styling



  After selection: all options non-interactive



EXPLANATION PANEL (appears after selection):

  Background: gold at 8% opacity

  Border-left: 3px solid gold

  Border radius: 10px

  Padding: 14px 16px

  Margin top: 12px



  Label: "EXPLANATION"

    Outfit Bold, 11px, gold, 

    letter-spacing: 1.5px

  Text: render with MathText, 

  DM Sans 14px, textLight



WORKING PANEL (only when working ≠ null):

  Collapsible, collapsed by default

  Toggle: "Show Working" / "Hide Working"

    DM Sans 13px, accent

  Expanded content:

    Background: accent at 6% opacity

    Border-left: 3px solid accent

    Border radius: 10px

    Padding: 14px

    Render with MathText

    DM Sans 13px, textLight

    Preserve line breaks



NEXT BUTTON (appears after selection):

  Full width, height: 48px

  Background: accent

  Text: Outfit Bold, 15px, primary

  Label: "Next Question" 

  or "See Results" on final question

  Border radius: 12px

  Margin top: 16px



On session complete: mark all question IDs 

as seen in localStorage, navigate to 

/results/:courseCode with session data.



─────────────────────────

SCREEN 6: STUDY RESULTS SCREEN

Route: /results/:courseCode



Background: primary

Back arrow top left → /home



SCORE CARD (centered, top):

  Score: "[correct] / [total]"

    Outfit Bold, 52px, gold

  Percentage: "[X]%"

    Outfit Bold, 24px

    ≥ 60%: success color

    < 60%: error color

  Course name: DM Sans 14px, muted

  Margin top: 8px



PERFORMANCE BAND:

  ≥ 80%: "Excellent — Well prepared"  success

  60–79%: "Good — Keep revising"       gold

  40–59%: "Fair — More practice needed" gold

  < 40%: "Needs work — Review material" error

  DM Sans, 14px, centered

  Margin top: 8px



DIVIDER: full width, 1px, muted at 20%

Margin: 20px 0



REVIEW HEADING: "Review Answers"

  Outfit Bold, 18px, textLight



REVIEW LIST (scrollable):

Each item:

  Flex row, align start, gap: 12px

  Left indicator:

    ✓ (CheckCircle, success) if correct

    ✗ (XCircle, error) if wrong

  Content:

    Question number: DM Sans Bold 

    12px, muted

    Question text (2 lines, 

    truncated, expandable): 

    MathText, DM Sans 14px, textLight

    

  Tapping expands to show:

    Full question text

    Student answer (labeled)

    Correct answer (labeled, 

    in success color if different)

    Explanation with MathText

    Working (collapsible) if not null



  Correct items: 

    border-left: 3px solid success

  Wrong items: 

    border-left: 3px solid error



ACTION BUTTONS (bottom, stacked, gap: 12px):

  "Retake" — accent background, 

  Outfit Bold, primary text

  "Change Course" — transparent, 

  border accent, accent text



─────────────────────────

SCREEN 7: EXAM COURSE SELECTION

Route: /exam



Background: primary

Back arrow → /home



Heading: "Select Exam Paper"

  Outfit Bold, 24px, gold

Subheading: "Tap a course to view its brief."

  DM Sans, 14px, muted



Same 3×3 course card grid as Study selection.

Cards have gold border treatment:

  Border: 1.5px solid gold at 50% opacity

  Border-left: 3px solid [course color]

  All other card styling identical



Tap: navigate to /exam/:courseCode



─────────────────────────

SCREEN 8: PRE-EXAM BRIEFING SCREEN

Route: /exam/:courseCode



On mount: read courseCode from URL param

Look up in EXAM_CONFIG.

If not found: show "Course not found" 

with back button.



Background: primary

Back arrow → /exam



Course name: Outfit Bold, 22px, gold

Course code: DM Sans, 14px, [course color]

Margin bottom: 24px



INFO CARDS ROW (flex, gap: 12px):

  Card 1: Questions

    Background: surface at 8% opacity

    Border-radius: 12px

    Padding: 16px

    Icon: FileQuestion, gold, 24px centered

    Value: "[X]" Outfit Bold 28px gold

    Label: "Questions" DM Sans 12px muted



  Card 2: Time

    Same styling

    Icon: Clock, gold, 24px centered

    Value: "[Y]m" Outfit Bold 28px gold

    Label: "Time Allowed" DM Sans 12px muted



RULES CARD:

  Background: gold at 6% opacity

  Border-left: 3px solid gold

  Border radius: 12px

  Padding: 16px

  Margin top: 20px



  Label: "EXAM RULES"

    Outfit Bold, 11px, gold, 

    letter-spacing: 1.5px

  

  Rules list (DM Sans 14px, textLight, 

  line-height: 2):

    — Answers are not revealed during exam

    — You may skip and return to questions

    — Unanswered questions score zero

    — Submit before time runs out

    — Timer starts when you tap Begin



BEGIN BUTTON:

  "Begin Exam"

  Full width, height: 56px

  Background: gold

  Text: Outfit Bold, 17px, primary

  Border radius: 14px

  Margin top: 24px

  Tap: navigate to 

  /exam/:courseCode/session



CANCEL BUTTON:

  "Cancel"

  Full width, height: 44px

  Background: transparent

  Text: DM Sans, 14px, muted

  Margin top: 10px

  Tap: navigate back to /exam



─────────────────────────

SCREEN 9: EXAM SESSION SCREEN

Route: /exam/:courseCode/session



On mount:

  Read courseCode from URL

  Load EXAM_CONFIG[courseCode]

  If not found: redirect to /exam

  Load questions via loadCourseQuestions

  Apply shuffle and variant filtering

  Take EXAM_CONFIG[courseCode].questions 

  from result (or all if fewer available)

  Initialise timer: 

  timeLeft = minutes * 60 (in seconds)

  Start countdown interval

  Initialise state:

    answers: {} (map of questionId → answer)

    skipped: [] (array of questionIds)

    currentIndex: 0



TOP BAR:

  Left: course code, DM Sans 13px, muted

  Center: "Q [n] of [total]"

    Outfit Bold 14px, textLight

  Right: countdown timer MM:SS

    Outfit Bold, 18px

    > 60s remaining:  accent (#00C2A8)

    31–60s:           gold (#C9A84C)

    ≤ 30s:            error (#E74C3C)

    ≤ 30s: add CSS pulse animation

    At 0: auto-submit, navigate to 

    /exam/:courseCode/results



QUESTION NAVIGATION GRID:

  Horizontal scrollable row beneath top bar

  One numbered button per question

  Button size: 34×34px, border radius: 8px

  Font: DM Sans Bold 12px

  Gap: 6px, padding: 8px 16px



  States (apply as inline styles):

    Not visited:

      background: muted at 15%

      border: 1px solid muted

      color: muted

    Current:

      background: accent at 25%

      border: 2px solid accent

      color: accent

    Answered:

      background: success at 25%

      border: 1px solid success

      color: success

    Skipped:

      background: gold at 25%

      border: 1px solid gold

      color: gold



  Tapping any grid button navigates 

  to that question index.

  Auto-scroll grid to keep current 

  button visible.



QUESTION CARD:

  Background: surface at 8% opacity

  Border radius: 16px

  Padding: 20px

  Margin: 12px 16px

  Question text: MathText component

  DM Sans 17px, textLight, 

  line-height: 1.6



OPTIONS (4 buttons, stacked, gap: 10px):

  Default:

    Background: surface at 8% opacity

    Border: 1px solid muted at 40%

    Text: DM Sans 15px, textLight

    Border radius: 12px, padding: 14px 16px

    Min height: 52px

    Render with MathText



  Selected (not submitted yet):

    Background: accent at 20% opacity

    Border: 2px solid accent

    Text: accent

    Left: filled circle indicator

    DO NOT show correct/wrong feedback

    DO NOT show explanation

    Tapping selected option again: deselects



  No explanation panel in exam mode.

  No working panel in exam mode.



BOTTOM ACTION BAR:

  Fixed bottom, background: primary

  Border-top: 1px solid muted at 30%

  Padding: 12px 16px

  padding-bottom: 

    calc(12px + env(safe-area-inset-bottom))

  Flex row, gap: 10px



  PREV button (flex: 1):

    "← Prev"

    Height: 46px, border radius: 10px

    Background: transparent

    Border: 1px solid muted

    Text: DM Sans 14px, textLight

    Disabled on question 1



  SKIP button (flex: 1):

    "Skip →"

    Height: 46px, border radius: 10px

    Background: gold at 12% opacity

    Border: 1px solid gold

    Text: DM Sans 14px, gold

    On tap: mark current as skipped,

    advance to next unanswered question



  SUBMIT button (flex: 1):

    "Submit"

    Height: 46px, border radius: 10px

    Background: error (#E74C3C)

    Text: Outfit Bold 14px, textLight

    Always active throughout exam

    On tap: show submit confirmation popup



SUBMIT CONFIRMATION POPUP:

  Backdrop: black at 70% opacity

  Cannot be dismissed by tapping backdrop



  Popup:

    Background: primary

    Border: 1px solid gold at 40%

    Border radius: 18px

    Padding: 24px

    Max width: 320px, centered on screen



    Icon: AlertTriangle, gold, 32px, centered

    

    "Submit Exam?"

    Outfit Bold, 20px, gold, centered

    Margin top: 12px



    SUMMARY CARD:

      Background: surface at 8% opacity

      Border radius: 12px

      Padding: 14px

      Margin top: 16px

      Three rows:

        "Answered:   [X]" — success color

        "Skipped:    [Y]" — gold color

        "Unanswered: [Z]" — error color

      DM Sans 14px, each on own line



    WARNING (only if unanswered > 0):

      "Unanswered questions will score zero."

      DM Sans 13px, error, margin top: 10px



    LIVE TIMER inside popup:

      "Time remaining: MM:SS"

      Outfit Bold 14px

      Same colour rules as main timer

      Updates live while popup open



    BUTTON ROW (flex, gap: 10px, 

    margin top: 20px):

      "Continue Exam" (flex: 1):

        Height: 48px, border radius: 12px

        Background: accent at 15%

        Border: 1px solid accent

        Text: Outfit Bold 14px, accent

        Dismisses popup



      "Confirm Submit" (flex: 1):

        Height: 48px, border radius: 12px

        Background: error

        Text: Outfit Bold 14px, textLight

        On tap: stop timer, save results 

        to localStorage, navigate to 

        /exam/:courseCode/results



─────────────────────────

SCREEN 10: EXAM RESULTS SCREEN

Route: /exam/:courseCode/results



Background: primary

Top: back arrow → /home



SCORE CARD:

  "[correct] / [total]"

  Outfit Bold 52px, gold, centered

  Percentage: Outfit Bold 24px

    ≥ 60%: success | < 60%: error

  Course name: DM Sans 14px, muted

  "Time used: MM:SS": DM Sans 13px, muted



PERFORMANCE BAND:

  Same thresholds as Study results



DIVIDER + "Review Answers" heading



REVIEW LIST:

  For each question in the exam:

    Show: question number, full question 

    text (MathText), student answer, 

    correct answer, indicator



    ✓ CheckCircle success — answered correctly

    ✗ XCircle error — answered incorrectly  

    — Minus gold — skipped or unanswered



    Correct items expanded: collapsed by default

    Wrong/unanswered: expanded by default

    

    Each shows:

      Student answer labeled 

      "Your answer:" in muted

      Correct answer labeled 

      "Correct:" in success

      Explanation with MathText

      Working (collapsible) if not null



ACTION BUTTONS:

  "Retake Exam" — gold background, 

  Outfit Bold, primary text

  "Change Course" — transparent, 

  border gold, gold text

  "Go Home" — transparent, 

  border muted, muted text



─────────────────────────

SCREEN 11: ADMIN PANEL

Route: /admin



Not linked from navigation — accessed 

by typing URL directly.



Background: primary



Heading: "Admin — Import Question Bank"

  Outfit Bold, 20px, gold

Instruction: "Upload a valid CRUCIBLE JSON 

  file to update a course question bank."

  DM Sans, 14px, muted



UPLOAD ZONE:

  Border: 2px dashed muted

  Border radius: 16px

  Background: surface at 5% opacity

  Padding: 40px

  Center text: "Tap to select JSON file"

  DM Sans, 14px, muted

  Accepts .json only



On file selected: show

  File name

  Detected course code

  Question count from total field

  Validation: Valid ✓ or Invalid ✗



IMPORT BUTTON:

  "Import to App"

  Background: accent

  Disabled until valid JSON loaded

  On import: write to localStorage as 

  override for that course's questions

  Success: "Course [X] updated — 

  [Y] questions loaded" in success color

  Error: "Invalid file — check format" 

  in error color



════════════════════════════════════════════════════

SECTION 6 — PWA CONFIGURATION

════════════════════════════════════════════════════



Generate /public/manifest.json:

{

  "name": "CRUCIBLE",

  "short_name": "CRUCIBLE",

  "description": "CBT Examination Practice App",

  "start_url": "/",

  "display": "standalone",

  "orientation": "portrait",

  "background_color": "#0D1F3C",

  "theme_color": "#0D1F3C",

  "icons": [

    {

      "src": "/assets/logo.png",

      "sizes": "192x192",

      "type": "image/png"

    },

    {

      "src": "/assets/logo.png",

      "sizes": "512x512",

      "type": "image/png"

    }

  ]

}



Generate /public/sw.js service worker:

  Cache name: crucible-v1

  On install: cache all app shell files

  and all files in /data/ folder

  On fetch: cache-first for /data/ requests

  Network-first for all other requests

  with cache fallback



Register service worker in main.tsx:

  if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

      navigator.serviceWorker.register('/sw.js')

    })

  }



════════════════════════════════════════════════════

SECTION 7 — MOBILE-FIRST RULES

════════════════════════════════════════════════════



Apply globally to every screen:



Minimum tap target: 48×48px on all 

interactive elements



No hover-dependent interactions — 

all interactions are tap-based



Minimum font sizes:

  Body text: 14px

  Question text: 17px

  Input fields: 16px (prevents iOS zoom)



Single column layout everywhere

The 3×3 course grid is the only 

multi-column element



All scrollable content:

  -webkit-overflow-scrolling: touch

  overscroll-behavior: contain



Fixed bottom elements use:

  padding-bottom: 

    calc([base]px + env(safe-area-inset-bottom))



No horizontal scroll on any screen



Minimum card width in 3-column grid: 

works correctly on screens ≥ 360px wide



════════════════════════════════════════════════════

SECTION 8 — DO NOT BUILD

════════════════════════════════════════════════════



Do not include any of the following:

  User authentication or login

  Supabase or any external database

  API calls for question data

  Leaderboards or social features

  Difficulty filtering

  Dark/light mode toggle

  Push notifications

  EXE packaging

  Any screen not listed above



════════════════════════════════════════════════════

SECTION 9 — BUILD CHECKLIST

════════════════════════════════════════════════════



Before presenting the preview confirm:



□ All 11 screens built and routed

□ COURSE_CONFIG and EXAM_CONFIG in 

  /src/config/courses.ts

□ loadCourseQuestions utility working

□ Fisher-Yates shuffle utility working

□ Seen/unseen localStorage tracking

□ Variant filtering logic

□ Session recovery on reload

□ KaTeX installed and MathText component 

  rendering in all question/option/

  explanation/working fields

□ All course accent colours applied 

  as inline styles

□ Course icons from lucide-react

□ Countdown timer with colour states 

  and pulse animation

□ Question navigation grid with 

  4 states (unvisited/current/

  answered/skipped)

□ Submit confirmation popup with 

  live timer

□ Auto-submit at timer 00:00

□ Platform banner with standalone 

  detection

□ manifest.json at /public/

□ Service worker registered

□ All uploaded JSON files placed 

  at /public/data/

□ Placeholder JSON for any missing 

  course files

□ No Supabase dependencies

□ No external API calls

□ Mobile-first rules applied globally

□ safe-area-inset padding on all 

  fixed bottom elements

□ Error boundary wrapping all routes



════════════════════════════════════════════════════

BUILD NOW

════════════════════════════════════════════════════



Build the complete CRUCIBLE application 

following every specification in this prompt.



Work through the build in this order:

1. Project setup and dependencies 

   (Tailwind config, fonts, KaTeX, 

   React Router, lucide-react)

2. Shared config files 

   (courses.ts, questionLoader.ts, shuffle.ts)

3. MathText component

4. All 11 screens in route order

5. PWA files (manifest.json, sw.js)

6. Place all uploaded JSON files 

   at /public/data/

7. Final checklist verification



Do not stop between steps.

Complete the entire build before 

presenting the preview.

Present the live preview URL when done.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://crucible-cbt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61d86f20-c826-459f-8c7e-be769a6c2c18).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
