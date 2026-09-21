# Academic Course & Assignment Management Portal (Task -2)

## Overview & Objective
This application enhances the UI/UX, backend logic, and database structure of the academic course and assignment management prototype. It provides a modern, responsive role-based portal for **Students** and **Professors**, featuring JWT authentication, course enrollments, individual and group assignment workflows, group leader acknowledgment enforcement, and submission progress analytics.

---

## 1. UI/UX Design Decisions & Rationale (Section 4.3.a)

- **Role-Centric Information Architecture**:
  - **Students**: Enter immediately into an enrolled courses overview with completion percentages, imminent deadlines, and collaborative group tasks.
  - **Professors**: Enter an instructional command center highlighting enrollment counts, submission status distributions, and direct grading tools.
- **Group Leader Acknowledgment Protocol**:
  - In group assignments, any group member can upload source files or project notes.
  - **Invariant Enforcement**: Only the designated **Group Leader** has authority to click *"Acknowledge & Confirm"*. Non-leaders see an informative disabled state explaining that their leader must confirm the team's submission. Once acknowledged, the confirmed state is visually propagated in real time across all group members and the professor's dashboard.
- **Progress Visualization & Micro-Interactions**:
  - Linear 4-step progress tracker: *Not Started (0%)* &rarr; *Submitted (50%)* &rarr; *Acknowledged (80%)* &rarr; *Graded (100%)*.
  - Status badges dynamically color-coded with accessible contrast ratios.
  - Micro-celebration (confetti and checkmark indicators) upon submission and leader acknowledgment.
- **Typography & Ergonomics**:
  - Uses **Plus Jakarta Sans** for body readability and **Space Grotesk** for numeric labels.
  - Neutral cool slate tones paired with deliberate semantic accents (Indigo for curriculum, Emerald for confirmed/acknowledged, Amber for pending, Purple for group tasks).

---

## 2. Component Architecture (Section 4.3.d)

```
src/
├── App.tsx                     # Top-level view router and state coordinator
├── types.ts                    # Shared TypeScript interfaces and domain models
├── index.css                   # Global styles & Tailwind base directives
├── main.tsx                    # React 19 root bootstrap
├── lib/
│   └── api.ts                  # REST API client with JWT Authorization headers
└── components/
    ├── Navbar.tsx              # Brand header, profile info, demo switcher, docs modal
    ├── AuthModal.tsx           # JWT login, registration & instant demo account selector
    ├── StudentDashboard.tsx    # Responsive enrolled courses grid & assignment list
    ├── ProfessorDashboard.tsx  # Taught courses metrics, quick actions & submissions
    ├── CourseDetailView.tsx    # Course syllabus & coursework details
    ├── AssignmentDetail.tsx    # Assignment specs, rubric, group roster & leader ack
    ├── ProfessorSubmissionsView.tsx # Submissions tracker, status filtering & grading modal
    ├── CreateAssignmentModal.tsx    # Dynamic assignment authoring & rubric builder
    └── DocumentationModal.tsx  # In-app architecture, schema viewer & testing guide
```

---

## 3. Database Structure & PostgreSQL Schema (Section 2.1 & 2.2)

The database follows a normalized relational structure located in `server/schema.sql`:

1. **`users`**: Stores students and professors with hashed credentials, roles, and departments.
2. **`courses`**: Course catalog associated with professors, terms, and credit loads.
3. **`course_enrollments`**: Junction table mapping student enrollments to courses with unique constraints.
4. **`assignments`**: Course coursework with deadlines, submission type (`individual` vs `group`), total points, and rubrics.
5. **`assignment_groups`**: Groups formed for group assignments with explicit `leader_id` foreign key.
6. **`group_members`**: Junction table mapping students to assignment groups.
7. **`submissions`**: Central table tracking deliverables, `status` (`pending`, `submitted`, `acknowledged`, `graded`), `acknowledged_by_user_id`, `acknowledged_at`, and grading feedback.

---

## 4. Local Setup Instructions (Section 4.3.b)

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Steps to Run
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env)
# Create a .env file or rely on default fallbacks:
JWT_SECRET="academic_portal_jwt_secure_secret_key_2026"
PORT=3000

# 3. Start development server (boots Express server with Vite middleware)
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## 5. Evaluation Test Credentials

You can use the **Switch Role** dropdown in the top bar to test any persona instantly, or log in manually:

| Persona | Name | Email | Password | Role / Capabilities |
|---|---|---|---|---|
| **Student (Leader)** | Alex Rivera | `alex.rivera@student.edu` | `Password123!` | Leader of *ByteForge* in CS-401. Can acknowledge group submissions. |
| **Student (Member)** | Sarah Chen | `sarah.chen@student.edu` | `Password123!` | Member of *ByteForge*. Can submit work; cannot acknowledge. |
| **Student (Ind.)** | David Kim | `david.kim@student.edu` | `Password123!` | Independent student enrolled in courses. |
| **Professor (CS)** | Dr. Elena Rostova | `elena.rostova@university.edu` | `Password123!` | Instructor for CS-401 & CS-415. Can track submissions & grade. |
| **Professor (SE)** | Prof. Marcus Vance | `marcus.vance@university.edu` | `Password123!` | Instructor for SE-302. |
