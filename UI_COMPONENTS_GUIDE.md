# UI Components Reference Guide

## Complete UI Component Library

This guide documents all reusable UI components available in the project. Another AI can use these to make consistent UI changes.

---

## 1. Button Component
**Location:** `src/components/ui/Button.jsx`

### Props
```jsx
<Button
  variant="primary"           // primary, secondary, danger, ghost, link
  size="md"                   // sm, md, lg
  loading={false}             // Show spinner, disable button
  disabled={false}            // Disable button
  onClick={handler}           // Click handler
  leftIcon={<Icon />}        // Icon before text
  rightIcon={<Icon />}       // Icon after text
  fullWidth={false}          // 100% width
  type="button"              // button, submit, reset
  className=""               // Additional classes
>
  Button Text
</Button>
```

### Variants
- **primary** - Blue background, white text (default)
- **secondary** - Light gray background
- **danger** - Red background (for delete, etc)
- **ghost** - Transparent (just text, hover effect)
- **link** - Transparent blue text (no padding)

### Examples
```jsx
// Primary button
<Button onClick={handleClick}>Save</Button>

// Danger button with icon
<Button variant="danger" leftIcon={<Trash2 size={16} />}>
  Delete
</Button>

// Loading state
<Button loading={isLoading}>
  Submit
</Button>

// Full width
<Button fullWidth>
  Login
</Button>

// Secondary with icon
<Button variant="secondary" rightIcon={<ChevronRight size={16} />}>
  Next
</Button>
```

---

## 2. Badge Component
**Location:** `src/components/ui/Badge.jsx`

### Props
```jsx
<Badge
  variant="primary"           // Color variant
  size="sm"                   // sm, md, lg
  children={content}
/>
```

### Variants (All Available)
```
primary, secondary, success, danger, warning, info
mcq, explain, code           // Question type badges
pass, fail                   // Result badges
draft, published             // Status badges
easy, medium, hard           // Difficulty badges
```

### Examples
```jsx
// Question type
<Badge variant="mcq" size="sm">MCQ</Badge>

// Difficulty
<Badge variant="hard">Hard</Badge>

// Status
<Badge variant="published">Published</Badge>

// Result
<Badge variant="pass">Passed</Badge>
```

---

## 3. Input Component
**Location:** `src/components/ui/Input.jsx`

### Props
```jsx
<Input
  type="text"                 // text, email, password, number
  placeholder="Enter text"
  value={state}
  onChange={handler}
  disabled={false}
  error={errorMessage}        // Shows error state & message
  label="Field Label"
  required={false}
  className=""
/>
```

### Examples
```jsx
// Basic input
<Input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
/>

// With error
<Input 
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
  label="Password"
/>

// Required field
<Input 
  value={name}
  onChange={(e) => setName(e.target.value)}
  label="Full Name"
  required
/>
```

---

## 4. Modal Component
**Location:** `src/components/ui/Modal.jsx`

### Props
```jsx
<Modal
  isOpen={boolean}           // Show/hide modal
  onClose={handler}          // Called when closing
  title="Modal Title"        // Header title
  size="md"                  // sm, md, lg, xl
  children={content}
/>
```

### Examples
```jsx
// Basic modal
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="My Modal">
  Modal content here
</Modal>

// Large modal
<Modal isOpen={show} onClose={() => setShow(false)} title="Settings" size="lg">
  <form>
    {/* form fields */}
  </form>
</Modal>
```

---

## 5. ConfirmDialog Component
**Location:** `src/components/ui/ConfirmDialog.jsx`

### Props
```jsx
<ConfirmDialog
  isOpen={boolean}
  onCancel={handler}              // Cancel button clicked
  onConfirm={handler}             // Confirm button clicked
  title="Confirm Action?"
  message="Are you sure?"
  confirmText="Delete"            // Confirm button label
  cancelText="Cancel"             // Cancel button label
  variant="warning"               // warning, danger, info
  loading={false}                 // Show spinner on confirm button
/>
```

### Examples
```jsx
// Delete confirmation
<ConfirmDialog
  isOpen={showConfirm}
  onCancel={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Question?"
  message="This action cannot be undone."
  confirmText="Delete"
  variant="danger"
/>

// With loading
<ConfirmDialog
  isOpen={showConfirm}
  onCancel={() => setShowConfirm(false)}
  onConfirm={handleSubmit}
  title="Submit Exam?"
  message={`You have answered 15 of 20 questions.`}
  confirmText="Submit"
  loading={isSubmitting}
/>
```

---

## 6. Spinner Component
**Location:** `src/components/ui/Spinner.jsx`

### Props
```jsx
<Spinner
  size="md"                   // sm, md, lg
  className=""               // Additional classes
/>
```

### Examples
```jsx
// During loading
{loading ? <Spinner size="lg" /> : <Content />}

// Inline spinner
<Button loading={isLoading}>
  <Spinner size="sm" /> Loading...
</Button>
```

---

## 7. EmptyState Component
**Location:** `src/components/ui/EmptyState.jsx`

### Props
```jsx
<EmptyState
  title="No items"
  description="Create your first item"
  actionLabel="Create"           // Optional button
  onAction={handler}             // Optional handler
  icon={<Icon />}               // Optional custom icon
/>
```

### Examples
```jsx
// No exams
{exams.length === 0 ? (
  <EmptyState
    title="No exams available"
    description="Check back later or create one."
  />
) : (
  <ExamList exams={exams} />
)}

// No results with action
{results.length === 0 ? (
  <EmptyState
    title="No results yet"
    description="Take an exam to see your results"
    actionLabel="Go to Exams"
    onAction={() => navigate('/dashboard')}
  />
) : null}
```

---

## 8. Pagination Component
**Location:** `src/components/ui/Pagination.jsx`

### Props
```jsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handler}         // Called with new page number
/>
```

### Examples
```jsx
const [page, setPage] = useState(1);

<Pagination 
  currentPage={page}
  totalPages={10}
  onPageChange={(newPage) => setPage(newPage)}
/>
```

---

## 9. SearchBar Component
**Location:** `src/components/ui/SearchBar.jsx`

### Props
```jsx
<SearchBar
  value={searchTerm}
  onChange={handler}             // Called with new search term
  placeholder="Search..."
  className=""
/>
```

### Examples
```jsx
const [search, setSearch] = useState('');

<SearchBar 
  value={search}
  onChange={setSearch}
  placeholder="Search questions..."
/>
```

---

## 10. Badge Component (Score)
**Location:** `src/components/ui/ScoreCircle.jsx`

### Props
```jsx
<ScoreCircle
  score={85}                  // 0-100 value
  size="md"                   // sm, md, lg
  showLabel={true}            // Show percentage text
/>
```

### Examples
```jsx
// Large score circle
<ScoreCircle score={92} size="lg" showLabel />

// Small badge
<ScoreCircle score={45} size="sm" />
```

---

## 11. Tooltip Component
**Location:** `src/components/ui/Tooltip.jsx`

### Props
```jsx
<Tooltip
  content="Help text"
  position="top"              // top, bottom, left, right
  delay={200}
>
  {children}
</Tooltip>
```

### Examples
```jsx
<Tooltip content="Click to flag this question">
  <button onClick={toggleFlag}>
    <Flag size={20} />
  </button>
</Tooltip>
```

---

## Styling Guidelines

### Tailwind Utility Classes

#### Colors
```
bg-primary-600, text-primary-600
bg-success-100, text-success-700
bg-danger-600, text-danger-600
bg-warning-500, text-warning-700
bg-gray-800, text-gray-900
```

#### Spacing
```
p-4        → padding all sides
px-6       → padding left & right
py-3       → padding top & bottom
m-4        → margin
mx-auto    → margin left & right auto (center)
gap-4      → gap between flex/grid items
```

#### Display
```
flex         → display: flex
grid         → display: grid
block        → display: block
hidden       → display: none
lg:hidden    → hidden on large screens
flex-1       → flex: 1 (grow)
flex-shrink-0 → don't shrink
```

#### Sizing
```
w-full       → width: 100%
w-64         → width: 16rem
h-12         → height: 3rem
min-h-screen → min-height: 100vh
max-w-7xl    → max-width: 80rem
```

#### Borders & Shadows
```
border border-gray-200         → border with color
rounded-lg                     → border radius
rounded-full                   → 50% radius (circle)
shadow-md                      → box shadow
shadow-lg
```

#### Typography
```
text-sm, text-base, text-lg, text-xl, text-2xl
font-medium, font-semibold, font-bold
text-center, text-left, text-right
```

#### Dark Mode
```
dark:bg-gray-800              → dark mode background
dark:text-white               → dark mode text
dark:border-gray-700          → dark mode border
```

---

## Layout Patterns

### Flex Column (Vertical Stack)
```jsx
<div className="flex flex-col gap-4">
  <Item />
  <Item />
  <Item />
</div>
```

### Flex Row (Horizontal)
```jsx
<div className="flex gap-4">
  <Item />
  <Item />
</div>
```

### Grid (Responsive)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

### Centered Content
```jsx
<div className="flex items-center justify-center min-h-screen">
  <Content />
</div>
```

### Space Between
```jsx
<div className="flex justify-between items-center">
  <Left />
  <Right />
</div>
```

---

## Icon Usage (Lucide React)

All icons from lucide-react are available:

```jsx
import { Icon1, Icon2, Icon3 } from 'lucide-react';

<Icon1 size={24} className="text-primary-600" />
<Icon2 size={16} strokeWidth={3} />
<Icon3 size={20} className="dark:text-white" />
```

### Common Icons Used in Project
```
ChevronLeft, ChevronRight     → Navigation
Plus, Edit, Trash2            → CRUD actions
Send                          → Submit
Flag                          → Flag question
Check, X                      → Success/Error
Menu, X                       → Mobile menu
Eye, Edit3                    → Preview toggle
BookOpen, Trophy, Target      → Dashboard stats
Users, TrendingUp             → Analytics
```

---

## Form Pattern Example

```jsx
import { Button, Input, Badge } from './ui';

export function ExamForm() {
  const [formData, setFormData] = useState({
    title: '',
    timeLimitSecs: 3600,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await examsAPI.createExam(formData);
      toast.success('Exam created!');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Exam Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
      />
      
      <Input
        label="Time Limit (seconds)"
        type="number"
        value={formData.timeLimitSecs}
        onChange={(e) => handleChange('timeLimitSecs', parseInt(e.target.value))}
      />

      {errors.submit && <Badge variant="danger">{errors.submit}</Badge>}

      <div className="flex gap-3">
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
        >
          Create Exam
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

---

## Page Layout Pattern

```jsx
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export function MyPage() {
  return (
    <PageWrapper
      title="Page Title"
      subtitle="Page description"
      actions={
        <Button leftIcon={<Plus size={16} />}>
          Add New
        </Button>
      }
    >
      {/* Page content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Content */}
      </div>
    </PageWrapper>
  );
}
```

---

## Common Patterns & Best Practices

### Loading State
```jsx
if (loading) {
  return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
}
```

### Error State
```jsx
if (error) {
  return <EmptyState title="Error" description={error.message} />;
}
```

### Empty State
```jsx
if (data.length === 0) {
  return (
    <EmptyState
      title="No items"
      description="Create your first item"
      actionLabel="Create"
      onAction={() => setShowForm(true)}
    />
  );
}
```

### Table Pattern
```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <th className="text-left py-3 px-4 font-medium text-gray-500">Header</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className="py-3 px-4">{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

### Card Pattern
```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
    Card Title
  </h3>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Card content
  </p>
</div>
```

---

## Summary

This UI component library provides all the building blocks needed to modify the exam platform's interface. Every component is:
- **Reusable** - Used across multiple pages
- **Configurable** - Props for customization
- **Accessible** - Proper semantics and keyboard support
- **Dark Mode Enabled** - Full dark mode support
- **Mobile Responsive** - Works on all screen sizes

When modifying UI, combine these components with Tailwind utilities to create consistent, professional interfaces.

