-- =====================================================================
-- Task -2: Academic Course & Assignment Portal
-- PostgreSQL Relational Database Schema DDL
-- =====================================================================

-- 1. Users Table (Role-based: Students and Professors)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'professor')),
    department VARCHAR(128) NOT NULL,
    student_id_number VARCHAR(64),
    avatar VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(128) NOT NULL,
    professor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    term VARCHAR(64) NOT NULL,
    credits INTEGER DEFAULT 3,
    color_theme VARCHAR(64) DEFAULT 'indigo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Course Enrollments Junction Table (Students enrolled in Courses)
CREATE TABLE IF NOT EXISTS course_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_course_student UNIQUE(course_id, student_id)
);

-- 4. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    submission_type VARCHAR(32) NOT NULL CHECK (submission_type IN ('individual', 'group')),
    total_points INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    allow_resubmission BOOLEAN DEFAULT TRUE,
    rubric_json JSONB,
    attachments_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Groups Table (Handles Group Assignments)
CREATE TABLE IF NOT EXISTS assignment_groups (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    leader_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_assignment_group_name UNIQUE(assignment_id, name)
);

-- 6. Group Members Junction Table
CREATE TABLE IF NOT EXISTS group_members (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL REFERENCES assignment_groups(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_leader BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_group_student UNIQUE(group_id, student_id)
);

-- 7. Submissions Table (Tracks Individual and Group Submissions & Leader Acknowledgments)
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    submission_type VARCHAR(32) NOT NULL CHECK (submission_type IN ('individual', 'group')),
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    group_id VARCHAR(64) REFERENCES assignment_groups(id) ON DELETE CASCADE,
    submitted_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    submission_text TEXT,
    repository_url VARCHAR(512),
    file_attachment_name VARCHAR(255),
    file_attachment_size VARCHAR(64),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (status IN ('pending', 'submitted', 'acknowledged', 'graded')),
    acknowledged_by_user_id VARCHAR(64) REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    grade_points NUMERIC(5, 2),
    feedback_notes TEXT,
    timeline_json JSONB
);

-- Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_professor ON courses(professor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_groups_assignment ON assignment_groups(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_group ON submissions(group_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
