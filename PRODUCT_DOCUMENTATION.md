# JS Exam Platform - Complete Product Documentation

## Product Overview
This is a **React-based Online Exam Management System** built with React 18, Vite, Tailwind CSS, and Zustand. It allows:
- **Students**: Take MCQ, Explain Me, and Code writing exams with real-time timer and flagging
- **Admins**: Create exams, manage question bank, view analytics, and manage users

---

## 🏗️ Project Architecture

### Tech Stack
- **Frontend**: React 18 + React Router 6
- **State Management**: Zustand
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Custom + Lucide Icons
- **Code Editor**: Monaco Editor (for code questions)
- **Markdown**: React Markdown for rendering question content
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **Charts**: Recharts

### Environment Variables (VITE)
```
VITE_API_BASE_URL = http://localhost:5000/api
VITE_USE_MOCK = true/false (for mock data testing)
```

---

## 📁 Folder Structure & Purpose

```
src/
├── api/                  # API calls & HTTP configuration
│   ├── axiosInstance.js  # Axios setup with auth interceptors
│   ├── authAPI.js        # Login/Register/User endpoints
│   ├── examsAPI.js       # Exam CRUD & publish/unpublish
│   ├── questionsAPI.js   # Question CRUD operations
│   ├── attemptsAPI.js    # Exam submission & attempts
│   ├── analyticsAPI.js   # Dashboard analytics
│   ├── executeAPI.js     # Code execution for code questions
│   └── aiAPI.js          # AI exam generation
│
├── store/                # Global State Management (Zustand)
│   ├── authStore.js      # User auth state, token, login/logout
│   └── examStore.js      # Active exam state during exam taking
│
├── components/           # Reusable React Components
│   ├── auth/             # Auth components
│   │   ├── ProtectedRoute.jsx    # Route guard for authenticated users
│   │   └── RoleRoute.jsx         # Route guard for ADMIN role
│   │
│   ├── layout/           # Layout wrappers
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── Sidebar.jsx           # Left sidebar navigation
│   │   ├── StudentLayout.jsx     # Student page wrapper
│   │   ├── AdminLayout.jsx       # Admin page wrapper
│   │   └── PageWrapper.jsx       # Page title & subtitle wrapper
│   │
│   ├── exam/             # Exam-taking components
│   │   ├── QuestionRenderer.jsx  # Routes question to correct component
│   │   ├── MCQQuestion.jsx       # Multiple choice question UI
│   │   ├── ExplainMeQuestion.jsx # Text answer with preview
│   │   ├── CodeQuestion.jsx      # Code + MCQ output selection
│   │   ├── QuestionNavPanel.jsx  # Question navigation sidebar
│   │   ├── Timer.jsx             # Countdown timer display
│   │   ├── ExamCard.jsx          # Exam card for dashboard
│   │   ├── ResultCard.jsx        # Result summary card
│   │   ├── AnswerReview.jsx      # Show correct answers after submission
│   │   └── CodeEditorPanel.jsx   # Monaco editor for code preview
│   │
│   ├── admin/            # Admin-specific components
│   │   ├── ExamBuilder.jsx       # Modal to create/edit exams
│   │   ├── QuestionForm.jsx      # Modal to create/edit questions
│   │   ├── BulkImport.jsx        # CSV import for questions
│   │   ├── AnalyticsChart.jsx    # Charts & visualizations
│   │   ├── UserTable.jsx         # User management table
│   │   └── (other admin components)
│   │
│   └── ui/               # Generic UI Components
│       ├── Button.jsx    # Custom button (variants: primary, secondary, danger, ghost, link)
│       ├── Badge.jsx     # Badge labels (variants: mcq, explain, code, pass, fail, etc)
│       ├── Input.jsx     # Text input
│       ├── Modal.jsx     # Modal dialog
│       ├── ConfirmDialog.jsx     # Confirmation modal
│       ├── Spinner.jsx   # Loading spinner
│       ├── Pagination.jsx         # Page navigation
│       ├── SearchBar.jsx          # Search input
│       ├── EmptyState.jsx         # Empty list display
│       ├── ScoreCircle.jsx        # Circular score display
│       └── Tooltip.jsx            # Tooltip component
│
├── pages/                # Full page components
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── student/
│   │   ├── Dashboard.jsx      # Show available exams & recent results
│   │   ├── ExamLobby.jsx      # Pre-exam instructions & start screen
│   │   ├── ExamRoom.jsx       # Main exam taking interface
│   │   ├── Results.jsx        # Result display after submission
│   │   ├── History.jsx        # All past attempts
│   │   └── (other student pages)
│   │
│   └── admin/
│       ├── AdminDashboard.jsx # Admin overview stats
│       ├── QuestionBank.jsx   # Manage all questions (search, filter, create)
│       ├── ExamManager.jsx    # Manage all exams (create, publish, delete)
│       ├── Analytics.jsx      # Detailed analytics & reports
│       ├── UserManager.jsx    # Manage users
│       └── AIExamGenerator.jsx # AI-powered exam creation
│
├── hooks/                # Custom React hooks
│   ├── useAuth.js       # Authentication hook (login/logout)
│   ├── useExam.js       # Active exam state & submission logic
│   ├── useTimer.js      # Countdown timer for exams
│   └── useDebounce.js   # Debounce hook for search
│
├── constants/           # Constant values & configurations
│   ├── routes.js        # All route paths
│   ├── questionTypes.js # Question type definitions (MCQ, EXPLAIN_ME, WRITE_CODE)
│   └── difficulty.js    # Difficulty levels (EASY, MEDIUM, HARD)
│
├── utils/               # Utility functions
│   ├── formatters.js    # Date, duration, score formatting
│   └── validators.js    # Form validation functions
│
├── mockData/            # Mock data for testing (when VITE_USE_MOCK=true)
│   ├── users.js
│   ├── exams.js
│   ├── questions.js
│   └── attempts.js
│
├── App.jsx              # Main app routing
├── main.jsx             # React DOM render entry
└── index.css            # Global styles
```

---

## 🔄 Core Data Flow

### 1. Authentication Flow
```
Login/Register Page
    ↓ (authAPI)
Backend Auth Endpoint
    ↓ (returns token + user)
authStore.login(token, user)
    ↓ (stores in localStorage: exam_token, exam_user)
User redirected based on role (Student/Admin)
```

### 2. Exam Taking Flow
```
Student Dashboard (shows available exams)
    ↓ (click exam)
ExamLobby (instructions, start button)
    ↓ (click start)
API: attemptsAPI.startAttempt(examId)
    ↓ (returns attemptId + questions)
examStore.initExam(attemptId, questions, timeLimit, examMeta)
    ↓
ExamRoom (main interface)
    ├─ QuestionNavPanel (left sidebar)
    ├─ QuestionRenderer (center - question display)
    └─ Timer (top right)
    
During exam:
    - Answer changes → examStore.setAnswer()
    - Auto-save every 30 seconds
    - Tab switch detection
    
On Submit:
    - attemptsAPI.submitAttempt(attemptId, answers, tabSwitchCount)
    - Results page shows score
```

### 3. Global State (Zustand Stores)

#### authStore
```js
{
  user: { id, name, email, role },      // User object
  token: "jwt_token",                   // Bearer token
  isAuthenticated: boolean,
  login(token, user),
  logout(),
  setUser(user),
  loadFromStorage(),
  getToken()
}
```

#### examStore (during exam)
```js
{
  attemptId: string,
  examMeta: { title, timeLimitSecs, totalQuestions },
  questions: [{ id, type, content, options, difficulty, points }],
  answers: { qid: { selectedOption|writtenAnswer }, ... },
  flagged: [qid, ...],                 // Flagged question IDs
  currentIndex: number,                // Current question index
  timeRemainingSeconds: number,
  isSubmitting: boolean,
  codeOutputs: { qid: "output", ... }, // Output from code execution
  
  // Methods:
  initExam(), setAnswer(), toggleFlag(), goToQuestion(),
  nextQuestion(), prevQuestion(), setCodeOutput(), 
  tickTimer(), setSubmitting(), resetExam()
}
```

---

## 📊 Key Constants

### Question Types
```js
QUESTION_TYPES = {
  MCQ: 'MCQ',                  // Multiple choice (4 options)
  EXPLAIN_ME: 'EXPLAIN_ME',    // Written text answer (5000 chars)
  WRITE_CODE: 'WRITE_CODE'     // Write code + select output
}
```

### Difficulty Levels
```js
DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
}
```

### Routes
```js
ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',                  // Student dashboard
  EXAM_LOBBY: '/exam/:id/lobby',           // Pre-exam screen
  EXAM_ROOM: '/exam/:id/room',             // Exam taking
  RESULTS: '/results/:id',                  // After submission
  HISTORY: '/history',                      // Past attempts
  ADMIN_DASHBOARD: '/admin',                // Admin overview
  ADMIN_QUESTIONS: '/admin/questions',      // Question bank
  ADMIN_EXAMS: '/admin/exams',              // Exam manager
  ADMIN_ANALYTICS: '/admin/analytics',      // Reports
  ADMIN_USERS: '/admin/users',              // User management
}
```

---

## 🎨 UI Component System

### Tailwind Color System
```
Primary: primary-50, primary-100, ..., primary-900
Success: success-50 to success-900
Danger: danger-50 to danger-900
Warning: warning-50 to warning-900
Info: info-50 to info-900
Gray: gray-50 to gray-900 (neutral)
```

### Button Component
```jsx
<Button
  variant="primary|secondary|danger|ghost|link"  // default: primary
  size="sm|md|lg"                                  // default: md
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  fullWidth={boolean}
  loading={boolean}
  disabled={boolean}
  onClick={handler}
>
  Click Me
</Button>
```

### Badge Component
```jsx
<Badge
  variant="mcq|explain|code|pass|fail|draft|published|info|primary|success|warning|danger"
  size="sm|md|lg"
>
  Content
</Badge>
```

### Modal Component
```jsx
<Modal isOpen={boolean} onClose={handler} title="Modal Title">
  Modal content here
</Modal>
```

### Dark Mode
- Tailwind's dark mode is enabled
- Classes use `dark:` prefix for dark mode styles
- Example: `bg-white dark:bg-gray-800`
- Toggle controlled by system preference or user setting

---

## 🔌 API Integration

### Key API Endpoints

#### Auth
- `POST /auth/login` - Student/Admin login
- `POST /auth/register` - Register new student

#### Exams
- `GET /exams/published` - Get available exams (students)
- `GET /exams` - Get all exams (admin)
- `POST /exams` - Create exam
- `PUT /exams/:id` - Update exam
- `PATCH /exams/:id/publish` - Publish exam
- `DELETE /exams/:id` - Delete exam

#### Questions
- `GET /questions` - Fetch with filters (search, type, difficulty, page)
- `POST /questions` - Create question
- `PUT /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question
- `POST /questions/bulk-import` - CSV import

#### Attempts (Exam Submissions)
- `POST /attempts` - Start exam (get questions & attemptId)
- `GET /attempts/my` - Student's past attempts
- `GET /attempts` - All attempts (admin)
- `POST /attempts/:id/submit` - Submit exam with answers
- `POST /attempts/:id/auto-save` - Auto-save single answer

#### Code Execution
- `POST /execute` - Execute code and return output

#### Analytics
- `GET /analytics/overview` - Dashboard stats

---

## 🔐 Important Business Logic & Restrictions

### Exam Room Behavior
1. **Tab Switch Detection** - Notifies after 1 switch, flags suspicious after 3+ switches
2. **Auto-Save** - Saves answers every 30 seconds
3. **Timer** - Auto-submits when time expires
4. **Navigation** - Can jump to any question, flag/unflag questions
5. **Submit Confirmation** - Shows count of answered questions before final submit

### Question Rendering Logic
```
QuestionRenderer.jsx:
- If type === MCQ → <MCQQuestion /> (single choice from 4 options)
- If type === EXPLAIN_ME → <ExplainMeQuestion /> (textarea + preview)
- If type === WRITE_CODE → <CodeQuestion /> (read-only starter code + output MCQ)
```

### Score Calculation
- Based on correctly answered questions
- Calculated on backend during submission
- Color coding: Green (≥70%), Yellow (50-69%), Red (<50%)

### Role-Based Access
- `/exam/:id/room` - Only students (ProtectedRoute + block admins)
- `/admin/*` - Only admins (RoleRoute with ADMIN check)
- Auth redirects: Logged-in students → /dashboard, Logged-in admins → /admin

---

## 🎯 Important Files for UI Modification

### Primary Layout Files (Don't break these)
- `src/App.jsx` - Route structure (DO NOT modify routing logic)
- `src/components/layout/StudentLayout.jsx` - Student page wrapper
- `src/components/layout/AdminLayout.jsx` - Admin page wrapper
- `src/components/layout/Navbar.jsx` - Top navigation
- `src/components/layout/Sidebar.jsx` - Left sidebar menu

### Page Files (Can modify styles & layout)
- `src/pages/student/Dashboard.jsx` - Student home (exams list, stats)
- `src/pages/student/ExamRoom.jsx` - Main exam interface
- `src/pages/student/Results.jsx` - Score display
- `src/pages/admin/AdminDashboard.jsx` - Admin overview
- `src/pages/admin/QuestionBank.jsx` - Question management
- `src/pages/admin/ExamManager.jsx` - Exam management

### Component Files (Can modify styles extensively)
- All files in `src/components/ui/` - Reusable UI components
- All files in `src/components/exam/` - Exam-specific components
- All files in `src/components/admin/` - Admin-specific components

---

## 📝 Data Models (Received from Backend)

### Question Object
```js
{
  id: string,
  content: string,              // Markdown formatted
  type: 'MCQ|EXPLAIN_ME|WRITE_CODE',
  options: [                     // For MCQ/WRITE_CODE
    'Option A text',
    'Option B text',
    'Option C text',
    'Option D text'
  ],
  correctOption: number,         // Index of correct answer
  starterCode: string,           // For WRITE_CODE
  topic: string,
  difficulty: 'EASY|MEDIUM|HARD',
  points: number,
  explanation: string
}
```

### Exam Object
```js
{
  id: string,
  title: string,
  description: string,
  topic: string,
  totalQuestions: number,
  timeLimitSecs: number,         // Total exam time in seconds
  passingScore: number,          // Pass threshold %
  status: 'DRAFT|PUBLISHED',
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### Attempt Object (Exam Submission)
```js
{
  id: string,
  examId: string,
  userId: string,
  userName: string,
  examTitle: string,
  score: number,                 // 0-100
  totalQuestions: number,
  answeredQuestions: number,
  passed: boolean,
  tabSwitches: number,
  submittedAt: ISO8601,
  createdAt: ISO8601
}
```

### Answer Object (Stored in answersStore)
```js
// For MCQ/WRITE_CODE:
{ selectedOption: 0 }    // Index of selected option

// For EXPLAIN_ME:
{ writtenAnswer: "text..." }

// Can also include:
{ timeSpent: number }    // Optional - time spent on this question
```

---

## ⚠️ Critical - DO NOT MODIFY

1. **authStore.js** - Authentication logic, token management
2. **examStore.js** - Exam state machine
3. **Route structure in App.jsx** - Role-based routing
4. **API integration logic** - Auth interceptors, token handling
5. **Auto-save & timer logic** - Core exam functionality
6. **Submission validation** - Data integrity

---

## 🎨 Current UI/UX Features

1. **Dark Mode Support** - Full dark theme support via Tailwind
2. **Responsive Design** - Mobile, tablet, desktop breakpoints
3. **Real-time Timer** - Countdown for exam
4. **Question Navigation** - Jump between questions
5. **Flagging System** - Mark questions for review
6. **Progress Bar** - Show completion percentage
7. **Toast Notifications** - Real-time feedback
8. **Loading States** - Spinner during async operations
9. **Empty States** - Friendly messages when no data
10. **Confirmation Dialogs** - Confirm destructive actions

---

## 🚀 What You Can Safely Change

✅ **Styles & Classnames** - All Tailwind classes
✅ **Component Layout** - Grid, flexbox, positioning
✅ **Colors & Themes** - Background, text, border colors
✅ **Spacing & Sizing** - Padding, margins, widths
✅ **Typography** - Font sizes, weights, families
✅ **Icons** - Lucide React icons
✅ **Component Props** - Button variants, Badge variants, etc
✅ **Page Section Order** - Reorder content sections
✅ **Form Fields** - Input fields, labels, validations
✅ **Cards & Containers** - Styling of cards, sections

❌ **DO NOT CHANGE**
- State management logic
- API calls & endpoint structure
- Route paths & routing logic
- Authentication flow
- Component prop interfaces (unless adding optional props)
- Auto-save & timer mechanism
- Exam submission logic

---

## 📦 Dependencies Summary

| Package | Purpose |
|---------|---------|
| react 18.2 | UI framework |
| react-router-dom 6 | Client routing |
| zustand 4.5 | State management |
| axios 1.6 | HTTP client |
| tailwindcss 3.4 | CSS framework |
| lucide-react 0.344 | Icon library |
| react-hot-toast 2.4 | Notifications |
| recharts 2.12 | Charts & graphs |
| @monaco-editor 4.6 | Code editor |
| react-markdown 9.0 | Markdown renderer |
| date-fns 3.3 | Date utilities |

---

## 🔧 Development Tips

### Mock Data Testing
Set `VITE_USE_MOCK=true` to use mock data instead of API calls

### Browser DevTools
- React DevTools - Check component state & props
- Redux DevTools - Not used (using Zustand instead)
- Network tab - Monitor API calls

### Common Props Patterns
- All buttons accept `disabled`, `loading`, `onClick` props
- All pages accept `loading` state and show spinner
- All tables support pagination and filtering
- All forms support edit mode (edit existing vs create new)

---

## Summary for UI Changes

**When an AI tool is modifying the UI:**

1. ✅ Keep the component structure intact (don't remove Outlet, Provider, etc)
2. ✅ Preserve prop interfaces and state management
3. ✅ Modify classNames freely - all Tailwind based
4. ✅ Add new UI sections using existing components
5. ✅ Change colors, spacing, typography with Tailwind utilities
6. ✅ Rearrange page sections and content flow
7. ✅ Update icons and badge variants
8. ❌ Don't change API endpoints or state logic
9. ❌ Don't remove event handlers or callbacks
10. ❌ Don't modify authentication or routing

