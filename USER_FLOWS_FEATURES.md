# Exam Platform - User Flows & Features Guide

## Platform Overview

This is a comprehensive online exam management system with two main user types:

### Student Roles
- Take exams
- View results and history
- Access available exams
- Attempt multiple times (if allowed)

### Admin Roles
- Create and manage exams
- Manage question bank
- View analytics and reports
- Manage user accounts

---

## Complete User Flows

### Flow 1: Student Registration & Login

```
Landing/Login Page
  ↓
1. User enters email & password
2. Click "Login" button
3. System calls authAPI.login()
4. Server validates credentials
  ✓ Success: Returns JWT token + user data
  ✗ Fail: Shows error toast "Invalid credentials"
5. Token stored in localStorage
6. Redirect to /dashboard (home page)
```

**Related Files:**
- `src/pages/auth/Login.jsx` - Login form UI
- `src/api/authAPI.js` - Auth endpoints
- `src/store/authStore.js` - Token storage

**UI Elements:**
- Email input field
- Password input field
- Login button
- "Remember me" checkbox (optional)
- Link to Register page
- Error messages

---

### Flow 2: Student Taking an Exam

```
STEP 1: Dashboard
┌─────────────────────────────────┐
│ Student Dashboard               │
│ - Available Exams (cards)       │
│ - Exam stats (total taken, avg) │
│ - Recent results                │
└─────────────────────────────────┘
         ↓ (click exam card)

STEP 2: Exam Lobby (Instructions)
┌─────────────────────────────────┐
│ Exam Details                    │
│ - Exam title & description      │
│ - Instructions                  │
│ - Time limit                    │
│ - Total questions               │
│ - Passing score                 │
│ [START EXAM BUTTON]             │
└─────────────────────────────────┘
         ↓ (click start)

STEP 3: API Call
  examsAPI.getExamById(examId)
  ↓ Returns exam + questions
  attemptsAPI.startAttempt(examId)
  ↓ Returns attemptId

STEP 4: Exam Room (Main Exam Interface)
┌────────────────────────────────────────────────────────────┐
│ Top Bar:                                                   │
│  [Menu] Exam Title  [Q 5/20] [Progress ▓▓▓▓░░] [Timer]    │
├────────────────────────────────────────────────────────────┤
│ Left Sidebar:             │  Main Area:        │           │
│ Question Nav             │                     │           │
│ - Q1 ✓ (answered)       │  Question Content   │           │
│ - Q2 ◐ (flagged)        │  (text + options)   │           │
│ - Q3 ○ (unanswered)     │                     │           │
│ - Q4 ◐✓ (both)         │  [Previous] [Flag]  │           │
│                         │  [Next]             │           │
└────────────────────────────────────────────────────────────┘

During Exam:
- Answer updates → examStore.setAnswer()
- Auto-saves every 30 seconds
- Timer counts down
- Can flag/unflag questions
- Can navigate between questions
- Tab switching detected & warned

STEP 5: Submit Exam
[Submit Exam Button] (top right)
  ↓ Show confirmation dialog
  ↓ Display: "You answered X of Y questions"
  ↓ Click "Submit Exam"
  ↓ API: attemptsAPI.submitAttempt()
  ↓ Show loading

STEP 6: Results Page
┌──────────────────────────────────┐
│ Exam Results                     │
│ Score: 85%  [Large Circle]      │
│ Status: PASSED ✓                 │
│ Questions: 17/20 correct         │
│ Time Used: 25:30 / 30:00         │
│                                  │
│ [Review Answers] [Back to Home]  │
└──────────────────────────────────┘
```

**Related Files:**
- `src/pages/student/Dashboard.jsx` - Home page
- `src/pages/student/ExamLobby.jsx` - Pre-exam screen
- `src/pages/student/ExamRoom.jsx` - Exam interface
- `src/pages/student/Results.jsx` - Result display
- `src/components/exam/*` - Question components
- `src/api/examsAPI.js`, `attemptsAPI.js`

**Key UI Components:**
- ExamCard (dashboard)
- QuestionNavPanel (left sidebar)
- QuestionRenderer (question display)
- MCQQuestion, ExplainMeQuestion, CodeQuestion (question types)
- Timer (countdown)
- ConfirmDialog (submit confirmation)
- ResultCard (results display)

---

### Flow 3: Admin Creating an Exam

```
Admin Dashboard
  ↓
[Create Exam Button]
  ↓
ExamBuilder Modal Opens
  ├─ Exam Title (text input)
  ├─ Description (textarea)
  ├─ Topic (dropdown)
  ├─ Time Limit (number input - in seconds)
  ├─ Passing Score (number - percentage)
  └─ [Cancel] [Create]
  ↓
Save API: examsAPI.createExam(data)
  ↓
Modal closes
Exam Manager page refreshes
New exam appears in table with status "DRAFT"
```

**Related Files:**
- `src/pages/admin/AdminDashboard.jsx` - Home page
- `src/pages/admin/ExamManager.jsx` - Manage exams
- `src/components/admin/ExamBuilder.jsx` - Create exam modal

**UI Elements:**
- Form inputs for exam details
- Modal for exam creation
- Table showing exams
- Action buttons (Edit, Delete, Publish)

---

### Flow 4: Admin Adding Questions

```
Question Bank Page
  ├─ Search bar (search questions)
  ├─ Type filter (MCQ, Explain, Code)
  ├─ Difficulty filter (Easy, Medium, Hard)
  └─ Pagination
  
Table of Questions:
- Title, Type, Topic, Difficulty, Points, Actions

[Add Question Button] or [Bulk Import Button]
  ↓
Option A: Single Question
  ↓ QuestionForm Modal
  ├─ Title (text)
  ├─ Content (markdown textarea)
  ├─ Type dropdown (MCQ, Explain, Code)
  │
  ├─ If MCQ:
  │  ├─ Option A (text)
  │  ├─ Option B (text)
  │  ├─ Option C (text)
  │  ├─ Option D (text)
  │  └─ Correct Option (radio)
  │
  ├─ If Explain Me:
  │  ├─ Max characters display (5000)
  │  └─ Rich text support
  │
  ├─ If Write Code:
  │  ├─ Starter Code (code editor)
  │  ├─ Correct Output (multiple choice options)
  │  └─ Test Cases (optional)
  │
  ├─ Topic (text)
  ├─ Difficulty (Easy, Medium, Hard)
  ├─ Points (number)
  ├─ Explanation (markdown textarea)
  └─ [Cancel] [Save]
  
Option B: Bulk Import
  ↓ BulkImport Modal
  ├─ CSV File Upload
  ├─ Format specification shown
  └─ [Cancel] [Import]

Save API: questionsAPI.createQuestion(data)
Modal closes
Question Bank refreshes
```

**Related Files:**
- `src/pages/admin/QuestionBank.jsx` - Question management
- `src/components/admin/QuestionForm.jsx` - Create/edit form
- `src/components/admin/BulkImport.jsx` - CSV import

**UI Elements:**
- Search bar
- Filter dropdowns
- Pagination
- Modal forms
- Code editor (for starter code)
- Textarea for markdown content

---

### Flow 5: Linking Questions to Exam

```
Exam Manager Page
  ↓
[Edit Exam] button on exam row
  ↓
ExamBuilder Modal
  ├─ Edit exam details (title, description, etc)
  └─ Question Selection Area:
     ├─ Available Questions List
     │  (search, filter by type/difficulty/topic)
     ├─ Selected Questions List
     │  - Questions added to exam
     │  - Can reorder (drag-drop or up/down)
     │  - Can remove individual questions
     └─ [Save] button
     
Save API: examsAPI.updateExam(examId, data)
Modal closes
Exam in table updates with question count
```

---

### Flow 6: Publishing an Exam

```
Exam Manager Table
  ↓
Row with exam (status: DRAFT)
  ↓
[Publish Button]
  ↓
API: examsAPI.publishExam(examId)
  ↓
Table refreshes
Status changes from "DRAFT" to "PUBLISHED"
Icon changes from lock to globe
Exam now available for students
```

---

### Flow 7: Admin Viewing Analytics

```
Admin Dashboard
  ↓
[View Analytics Button]
  ↓
Analytics Page
  ├─ Overview Stats
  │  ├─ Total Students
  │  ├─ Total Exams
  │  ├─ Total Attempts
  │  └─ Overall Pass Rate
  │
  ├─ Charts & Graphs
  │  ├─ Score Distribution (histogram)
  │  ├─ Attempts Over Time (line chart)
  │  ├─ Difficulty vs Performance (scatter)
  │  └─ Pass/Fail Ratio (pie chart)
  │
  ├─ Filters
  │  ├─ Exam filter (dropdown)
  │  ├─ Date range (from/to)
  │  └─ [Apply]
  │
  └─ Recent Attempts Table
     └─ Student, Exam, Score, Status, Date
```

**Related Files:**
- `src/pages/admin/Analytics.jsx`
- `src/components/admin/AnalyticsChart.jsx`

**UI Elements:**
- Stat cards
- Charts (Recharts library)
- Filters
- Tables

---

## Question Types Explained

### Type 1: MCQ (Multiple Choice)
```
Question Text: "What is 2 + 2?"

A) 3
B) 4
C) 5
D) 6

[Student selects B]
Answer stored: { selectedOption: 1 }
```

**UI Component:** MCQQuestion.jsx
- 4 option buttons
- Radio-style selection (only one)
- Highlighted when selected
- Shows letter (A, B, C, D)

---

### Type 2: Explain Me (Written Answer)
```
Question Text: "Explain the concept of closure in JavaScript"

[Large textarea - 5000 chars max]
- Markdown supported
- Character counter (X/5000)
- Preview button to see formatted text

[Student types answer]
Answer stored: { writtenAnswer: "text here..." }
```

**UI Component:** ExplainMeQuestion.jsx
- Large textarea
- Character count
- Preview/Edit toggle
- Markdown rendering in preview
- No auto-grading (manual review needed)

---

### Type 3: Write Code
```
Question Text: "What is the output of this code?"

[Read-only starter code in Monaco Editor]
function test() {
  let x = 5;
  return x * 2;
}
console.log(test());

Multiple Choice Output Options:
A) 5
B) 10
C) 20
D) Error

[Student selects B]
Answer stored: { selectedOption: 1 }
```

**UI Component:** CodeQuestion.jsx
- Monaco editor (read-only)
- Code highlighting
- MCQ-style output selection
- Optional: Code execution results

---

## Dashboard Layouts

### Student Dashboard Layout
```
┌─────────────────────────────────────────┐
│ NAVBAR (Top)                            │
│  Logo  [Search]  [Notifications]  [Profile] │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │ MAIN CONTENT                │
│          │                              │
│ - Home   │ Welcome back, John!         │
│ - Exams  │                              │
│ - Marks  │ ┌────────────────────────┐  │
│ - Results│ │ Stat Cards             │  │
│ - Help   │ │ Exams: 5  Avg: 78%   │ │
│          │ │ Best: 95%             │  │
│          │ └────────────────────────┘  │
│          │                              │
│          │ Available Exams              │
│          │ ┌──────┬──────┬──────┐     │
│          │ │Exam1 │Exam2 │Exam3 │     │
│          │ │Diff: │Diff: │Diff: │     │
│          │ │Hard  │Easy  │Med   │     │
│          │ └──────┴──────┴──────┘     │
│          │                              │
│          │ Recent Results               │
│          │ • Exam1: 85% - 2 days ago   │
│          │ • Exam2: 92% - 5 days ago   │
│          │ • Exam3: 70% - 1 week ago   │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Related File:** `src/pages/student/Dashboard.jsx`

**UI Elements:**
- Stat cards (BookOpen, Trophy, Target icons)
- Exam cards grid (responsive: 1 col mobile, 3 cols desktop)
- Result cards list

---

### Admin Dashboard Layout
```
┌─────────────────────────────────────────┐
│ NAVBAR                                  │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │ MAIN CONTENT                │
│          │                              │
│ - Home   │ Welcome back, Admin!        │
│ - Exams  │                              │
│ - Quest. │ ┌────────────────────────┐  │
│ - Users  │ │ Overview Stats         │  │
│ - Reports│ │ Students: 156          │  │
│ - AI Gen │ │ Exams: 12              │  │
│          │ │ Attempts: 450          │  │
│          │ │ Pass Rate: 73%         │  │
│          │ └────────────────────────┘  │
│          │                              │
│          │ [Add Question] [Create Exam] [View Analytics]
│          │                              │
│          │ Recent Activity              │
│          │ • Student1: Exam1 - 85% ✓   │
│          │ • Student2: Exam2 - 62% ✓   │
│          │ • Student3: Exam3 - 48% ✗   │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Related File:** `src/pages/admin/AdminDashboard.jsx`

**UI Elements:**
- Stat cards (Users, BookOpen, ClipboardList, TrendingUp)
- Action buttons
- Recent activity list

---

## Exam Manager UI

```
┌─────────────────────────────────────┐
│ Exam Manager                        │
│ [Create Exam Button]                │
├─────────────────────────────────────┤
│                                     │
│ TABLE: Exams                        │
│ ┌───────────────────────────────┐  │
│ │Title │Status │Q │Time │Pass% │ │
│ ├───────────────────────────────┤  │
│ │JS...  │Pub    │20│1h   │70%   │ │
│ │Python │Draft  │15│45m  │60%   │ │
│ │Data   │Pub    │25│2h   │65%   │ │
│ └───────────────────────────────┘  │
│
│ Actions per row:
│ [Publish/Unpublish] [Edit] [Delete]
│
└─────────────────────────────────────┘
```

**Related File:** `src/pages/admin/ExamManager.jsx`

**Table Columns:**
- Title
- Status (Badge: Draft/Published)
- Question Count
- Time Limit
- Passing Score
- Total Attempts
- Actions (Edit, Delete, Publish toggle)

---

## Question Bank UI

```
┌──────────────────────────────────────┐
│ Question Bank                        │
│ [Bulk Import] [Add Question]         │
├──────────────────────────────────────┤
│ Search: [____________] [x]           │
│ Type: [All Types ▼]                  │
│ Difficulty: [All Diff ▼]             │
│ [Apply Filters]                      │
├──────────────────────────────────────┤
│ TABLE: Questions                     │
│ ┌──────────────────────────────────┐ │
│ │Title │Type │Topic │Diff │Pts │Act│ │
│ ├──────────────────────────────────┤ │
│ │What..│MCQ  │JS    │Hard │10 │...│ │
│ │Expl..│Expr │Prog  │Med  │5  │...│ │
│ │Write.│Code │OOP   │Easy │15 │...│ │
│ └──────────────────────────────────┘ │
│
│ Pagination: [< 1 2 3 >]
│ Showing 10-20 of 150
│
└──────────────────────────────────────┘
```

**Related File:** `src/pages/admin/QuestionBank.jsx`

**UI Elements:**
- Search bar
- Filter dropdowns
- Table with 6 columns
- Pagination
- Action buttons per row (Edit, Delete)

---

## Key UI States

### Loading State
```
┌─────────────────────┐
│                     │
│    [Spinning]       │
│    Loading...       │
│                     │
└─────────────────────┘
```

### Empty State
```
┌─────────────────────┐
│                     │
│  📭 No exams        │
│  Create your first  │
│  [Create Exam]      │
│                     │
└─────────────────────┘
```

### Error State
```
┌─────────────────────┐
│ ⚠️ Error            │
│ Failed to load      │
│ [Retry]             │
└─────────────────────┘
```

### Toast Notifications (Real-time feedback)
```
✓ Exam submitted!
✗ Failed to save question
ℹ️ Tab switch detected
```

---

## Mobile Responsive Breakpoints

- **Mobile (< 768px)**: Single column layout, hamburger menu
- **Tablet (768px - 1024px)**: 2 column layouts, visible sidebar
- **Desktop (> 1024px)**: Full 3-4 column layouts, expanded sidebars

**Related Classes:**
- `hidden lg:block` - Hide on mobile, show on desktop
- `sm:px-6 lg:p-8` - Different padding by screen size
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grid

---

## Dark Mode Implementation

All UI components support dark mode:
```
Light Mode: bg-white text-gray-900
Dark Mode:  dark:bg-gray-800 dark:text-white

Borders:
Light: border-gray-200
Dark: dark:border-gray-700

Hover States:
Light: hover:bg-gray-100
Dark: dark:hover:bg-gray-800
```

---

## Summary of Modifiable UI Areas

✅ **Can Easily Modify:**
1. Color schemes (primary, success, danger colors)
2. Card layouts and spacing
3. Table styling and columns
4. Button sizes and styles
5. Typography (sizes, weights)
6. Sidebar and navbar styling
7. Form layouts
8. Modal sizes and styling
9. Icon selections
10. Badge variants and colors
11. Page title and header styling
12. Grid/flex layouts
13. Responsive breakpoints
14. Dark mode adjustments
15. Animation and transition effects

❌ **DO NOT Modify:**
1. Route structure (paths in ROUTES constant)
2. API endpoints
3. State management logic
4. Authentication flow
5. Component prop interfaces
6. Data model structures
7. Event handler logic
8. Validation logic
9. Timer and auto-save mechanism
10. Tab switch detection

