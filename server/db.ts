import bcrypt from 'bcryptjs';
import type {
  Assignment,
  AssignmentGroup,
  Course,
  DashboardAnalytics,
  Submission,
  SubmissionStatus,
  User,
} from '../src/types.ts';

export interface DbUser extends User {
  passwordHash: string;
}

export interface DbCourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
}

// Initial In-Memory Relational State
const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

export const users: DbUser[] = [
  {
    id: 'prof-1',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@university.edu',
    passwordHash: defaultPasswordHash,
    role: 'professor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Department of Computer Science',
    bio: 'Lead Researcher in Distributed Consensus & Fault-Tolerant Cloud Architectures.',
  },
  {
    id: 'prof-2',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@university.edu',
    passwordHash: defaultPasswordHash,
    role: 'professor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Software Engineering Institute',
    bio: 'Industry Fellow specializing in Agile Delivery, DevOps CI/CD, and Microservice Design.',
  },
  {
    id: 'stud-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    passwordHash: defaultPasswordHash,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    studentIdNumber: 'CS-2024-8841',
    bio: 'Senior Undergraduate. Group Leader for Distributed Systems Capstone team "ByteForge".',
  },
  {
    id: 'stud-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@student.edu',
    passwordHash: defaultPasswordHash,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    studentIdNumber: 'CS-2024-8842',
    bio: 'Undergraduate Researcher focusing on Network Protocol Analysis. Member of "ByteForge".',
  },
  {
    id: 'stud-3',
    name: 'Michael Scott',
    email: 'michael.s@student.edu',
    passwordHash: defaultPasswordHash,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    studentIdNumber: 'CS-2024-8843',
    bio: 'Full-stack enthusiast. Member of team "ByteForge".',
  },
  {
    id: 'stud-4',
    name: 'David Kim',
    email: 'david.kim@student.edu',
    passwordHash: defaultPasswordHash,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Software Engineering',
    studentIdNumber: 'SE-2024-9104',
    bio: 'Systems programming specialist working on independent engineering benchmarks.',
  },
  {
    id: 'stud-5',
    name: 'Priya Patel',
    email: 'priya.p@student.edu',
    passwordHash: defaultPasswordHash,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & AI',
    studentIdNumber: 'AI-2024-7720',
    bio: 'Group Leader for Capstone team "NeuralCraft".',
  },
];

export const courses: Course[] = [
  {
    id: 'course-cs401',
    code: 'CS-401',
    title: 'Advanced Distributed Systems & Cloud Infrastructure',
    description: 'Deep dive into consensus algorithms (Raft, Paxos), distributed key-value stores, RPC protocols, fault tolerance, and cloud-native microservices.',
    department: 'Department of Computer Science',
    professorId: 'prof-1',
    professorName: 'Dr. Elena Rostova',
    professorEmail: 'elena.rostova@university.edu',
    term: 'Fall 2026',
    credits: 4,
    colorTheme: 'indigo',
    studentCount: 38,
    assignmentCount: 3,
    enrolledStudentIds: ['stud-1', 'stud-2', 'stud-3', 'stud-4', 'stud-5'],
  },
  {
    id: 'course-se302',
    code: 'SE-302',
    title: 'Software Engineering Principles & Agile Architecture',
    description: 'Hands-on architectural patterns, test-driven development, continuous integration/deployment pipelines, and collaborative software delivery.',
    department: 'Software Engineering Institute',
    professorId: 'prof-2',
    professorName: 'Prof. Marcus Vance',
    professorEmail: 'marcus.vance@university.edu',
    term: 'Fall 2026',
    credits: 3,
    colorTheme: 'emerald',
    studentCount: 42,
    assignmentCount: 2,
    enrolledStudentIds: ['stud-1', 'stud-2', 'stud-4'],
  },
  {
    id: 'course-cs415',
    code: 'CS-415',
    title: 'High-Performance Database Systems & SQL Optimization',
    description: 'Relational storage engines, B-tree indexing, query planners, write-ahead logging (WAL), distributed sharding, and transaction ACID semantics.',
    department: 'Department of Computer Science',
    professorId: 'prof-1',
    professorName: 'Dr. Elena Rostova',
    professorEmail: 'elena.rostova@university.edu',
    term: 'Fall 2026',
    credits: 3,
    colorTheme: 'amber',
    studentCount: 29,
    assignmentCount: 2,
    enrolledStudentIds: ['stud-1', 'stud-3', 'stud-4', 'stud-5'],
  },
];

export const enrollments: DbCourseEnrollment[] = [
  { id: 'enr-1', courseId: 'course-cs401', studentId: 'stud-1', enrolledAt: '2026-08-25T09:00:00Z' },
  { id: 'enr-2', courseId: 'course-cs401', studentId: 'stud-2', enrolledAt: '2026-08-25T09:05:00Z' },
  { id: 'enr-3', courseId: 'course-cs401', studentId: 'stud-3', enrolledAt: '2026-08-25T09:10:00Z' },
  { id: 'enr-4', courseId: 'course-cs401', studentId: 'stud-4', enrolledAt: '2026-08-25T09:15:00Z' },
  { id: 'enr-5', courseId: 'course-cs401', studentId: 'stud-5', enrolledAt: '2026-08-25T09:20:00Z' },
  { id: 'enr-6', courseId: 'course-se302', studentId: 'stud-1', enrolledAt: '2026-08-26T10:00:00Z' },
  { id: 'enr-7', courseId: 'course-se302', studentId: 'stud-2', enrolledAt: '2026-08-26T10:05:00Z' },
  { id: 'enr-8', courseId: 'course-se302', studentId: 'stud-4', enrolledAt: '2026-08-26T10:10:00Z' },
  { id: 'enr-9', courseId: 'course-cs415', studentId: 'stud-1', enrolledAt: '2026-08-27T11:00:00Z' },
  { id: 'enr-10', courseId: 'course-cs415', studentId: 'stud-3', enrolledAt: '2026-08-27T11:05:00Z' },
  { id: 'enr-11', courseId: 'course-cs415', studentId: 'stud-4', enrolledAt: '2026-08-27T11:10:00Z' },
  { id: 'enr-12', courseId: 'course-cs415', studentId: 'stud-5', enrolledAt: '2026-08-27T11:15:00Z' },
];

export const assignments: Assignment[] = [
  {
    id: 'asg-cs401-1',
    courseId: 'course-cs401',
    courseCode: 'CS-401',
    courseTitle: 'Advanced Distributed Systems & Cloud Infrastructure',
    title: 'Milestone 1: Distributed Raft Consensus Implementation',
    description: 'Implement a distributed leader election and log replication module following the Raft consensus specification in Node.js or Go.',
    instructions: '1. Form your assigned group of 2-3 engineers.\n2. Implement Leader Election with randomized heartbeat timeouts (150ms-300ms).\n3. Ensure safety invariants: only a candidate with up-to-date log can become leader.\n4. Provide unit tests simulating network partitions.\n5. The Group Leader must review the final pull request and submit the official group submission with repository link and test verification summary.',
    deadline: '2026-09-28T23:59:00Z',
    submissionType: 'group',
    totalPoints: 100,
    status: 'active',
    allowResubmission: true,
    rubric: [
      { criteria: 'Leader Election & Randomized Election Timers', points: 30 },
      { criteria: 'Log Replication & AppendEntries RPC Handling', points: 30 },
      { criteria: 'Network Partition & Split-Vote Resilience Test Suite', points: 25 },
      { criteria: 'Documentation & Clean Commit History', points: 15 },
    ],
    attachments: [
      { name: 'Raft_Consensus_Extended_Paper.pdf', url: '#', size: '1.4 MB' },
      { name: 'Cluster_Simulation_Harness.zip', url: '#', size: '4.8 MB' },
    ],
    createdAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'asg-cs401-2',
    courseId: 'course-cs401',
    courseCode: 'CS-401',
    courseTitle: 'Advanced Distributed Systems & Cloud Infrastructure',
    title: 'Lab 2: Microservice API Gateway & Circuit Breakers',
    description: 'Construct a resilient reverse proxy and API Gateway with rate-limiting, circuit-breaking token buckets, and health probes.',
    instructions: 'Individual laboratory exercise. Build an API gateway that routes incoming traffic to upstream services, tracks latency percentiles (p50, p95, p99), and trips circuit breakers when error rates exceed 20%.',
    deadline: '2026-10-05T23:59:00Z',
    submissionType: 'individual',
    totalPoints: 50,
    status: 'active',
    allowResubmission: true,
    rubric: [
      { criteria: 'Routing & Header Transformation Proxy', points: 15 },
      { criteria: 'Circuit Breaker State Machine (Closed, Open, Half-Open)', points: 20 },
      { criteria: 'Token Bucket Rate Limiter with Redis/Memory', points: 15 },
    ],
    attachments: [
      { name: 'Gateway_Architecture_Spec.pdf', url: '#', size: '820 KB' },
    ],
    createdAt: '2026-09-12T14:00:00Z',
  },
  {
    id: 'asg-se302-1',
    courseId: 'course-se302',
    courseCode: 'SE-302',
    courseTitle: 'Software Engineering Principles & Agile Architecture',
    title: 'Project 1: Automated CI/CD Pipeline & Code Quality Gates',
    description: 'Design and deploy a containerized deployment pipeline integrating automated linting, test coverage enforcement (>80%), and semantic releases.',
    instructions: 'Group Project: Collaborate to construct a complete GitHub Actions or GitLab CI pipeline. Group leader must confirm all team members reviewed the workflow configuration and submit the live pipeline logs and repository badge.',
    deadline: '2026-09-25T18:00:00Z',
    submissionType: 'group',
    totalPoints: 100,
    status: 'active',
    allowResubmission: true,
    rubric: [
      { criteria: 'Multi-stage Docker Build & Optimization', points: 25 },
      { criteria: 'Automated Test & Coverage Gate Enforcement', points: 30 },
      { criteria: 'Security Scanning (SAST/Dependency Check)', points: 25 },
      { criteria: 'Group Collaborative Workflow & PR Evidence', points: 20 },
    ],
    attachments: [
      { name: 'Agile_Pipeline_Standards.pdf', url: '#', size: '1.1 MB' },
    ],
    createdAt: '2026-09-08T08:30:00Z',
  },
  {
    id: 'asg-se302-2',
    courseId: 'course-se302',
    courseCode: 'SE-302',
    courseTitle: 'Software Engineering Principles & Agile Architecture',
    title: 'Case Study: Monolith to Event-Driven Microservices',
    description: 'Analyze legacy monolithic e-commerce codebase and formulate a domain-driven strangler fig refactoring strategy.',
    instructions: 'Individual essay and architectural diagram submission. Identify bounded contexts, propose event streams with Apache Kafka/RabbitMQ, and detail zero-downtime database migration.',
    deadline: '2026-10-12T23:59:00Z',
    submissionType: 'individual',
    totalPoints: 50,
    status: 'active',
    allowResubmission: true,
    rubric: [
      { criteria: 'Bounded Context & Domain Event Identification', points: 20 },
      { criteria: 'Strangler Fig Migration Phasing', points: 15 },
      { criteria: 'Data Consistency (Saga Pattern vs 2PC)', points: 15 },
    ],
    attachments: [
      { name: 'Legacy_Monolith_Source_Schema.sql', url: '#', size: '240 KB' },
    ],
    createdAt: '2026-09-15T11:00:00Z',
  },
];

export const groups: AssignmentGroup[] = [
  {
    id: 'grp-byteforge',
    assignmentId: 'asg-cs401-1',
    courseId: 'course-cs401',
    name: 'ByteForge Engineering',
    leaderId: 'stud-1', // Alex Rivera
    leaderName: 'Alex Rivera',
    memberIds: ['stud-1', 'stud-2', 'stud-3'],
    members: [
      { id: 'stud-1', name: 'Alex Rivera', email: 'alex.rivera@student.edu', isLeader: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'stud-2', name: 'Sarah Chen', email: 'sarah.chen@student.edu', isLeader: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
      { id: 'stud-3', name: 'Michael Scott', email: 'michael.s@student.edu', isLeader: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'grp-neuralcraft',
    assignmentId: 'asg-cs401-1',
    courseId: 'course-cs401',
    name: 'NeuralCraft Systems',
    leaderId: 'stud-5', // Priya Patel
    leaderName: 'Priya Patel',
    memberIds: ['stud-5', 'stud-4'],
    members: [
      { id: 'stud-5', name: 'Priya Patel', email: 'priya.p@student.edu', isLeader: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { id: 'stud-4', name: 'David Kim', email: 'david.kim@student.edu', isLeader: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'grp-se302-team1',
    assignmentId: 'asg-se302-1',
    courseId: 'course-se302',
    name: 'AgileDev Squad A',
    leaderId: 'stud-1',
    leaderName: 'Alex Rivera',
    memberIds: ['stud-1', 'stud-2', 'stud-4'],
    members: [
      { id: 'stud-1', name: 'Alex Rivera', email: 'alex.rivera@student.edu', isLeader: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'stud-2', name: 'Sarah Chen', email: 'sarah.chen@student.edu', isLeader: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
      { id: 'stud-4', name: 'David Kim', email: 'david.kim@student.edu', isLeader: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    ],
  },
];

export const submissions: Submission[] = [
  // CS-401 Assignment 1 (Group): ByteForge has submitted, awaiting or already in submission status. Let's make it 'submitted' so Alex (leader) can acknowledge it in the demo!
  {
    id: 'sub-1',
    assignmentId: 'asg-cs401-1',
    courseId: 'course-cs401',
    submissionType: 'group',
    groupId: 'grp-byteforge',
    groupName: 'ByteForge Engineering',
    leaderId: 'stud-1',
    leaderName: 'Alex Rivera',
    submittedByUserId: 'stud-2', // Submitted by Sarah Chen (member), waiting for Alex Rivera (leader) to acknowledge!
    submittedByUserName: 'Sarah Chen',
    submissionText: 'Implemented complete Raft state machine with leader election, term numbering, log replication RPCs, and cluster simulation harness. Passed all 24 concurrency partition tests.',
    repositoryUrl: 'https://github.com/byteforge-academic/raft-consensus-engine',
    fileAttachmentName: 'ByteForge_Raft_Test_Results_Log.pdf',
    fileAttachmentSize: '2.3 MB',
    submittedAt: '2026-09-18T16:20:00Z',
    status: 'submitted', // Notice: Pending Group Leader acknowledgment! Perfect demonstration for Section 1.3!
    acknowledgedByUserId: undefined,
    acknowledgedByUserName: undefined,
    acknowledgedAt: undefined,
    gradePoints: undefined,
    maxPoints: 100,
    feedbackNotes: undefined,
    timeline: [
      {
        timestamp: '2026-09-18T16:20:00Z',
        actor: 'Sarah Chen (Group Member)',
        action: 'Uploaded initial project bundle and committed repository link',
        note: 'Submission saved. Status marked as Submitted. Awaiting official group leader acknowledgment.',
      },
    ],
  },
  // CS-401 Assignment 1 (Group): NeuralCraft has acknowledged!
  {
    id: 'sub-2',
    assignmentId: 'asg-cs401-1',
    courseId: 'course-cs401',
    submissionType: 'group',
    groupId: 'grp-neuralcraft',
    groupName: 'NeuralCraft Systems',
    leaderId: 'stud-5',
    leaderName: 'Priya Patel',
    submittedByUserId: 'stud-5',
    submittedByUserName: 'Priya Patel',
    submissionText: 'Implemented Raft in TypeScript with gRPC protobuf transport. Handled split votes with jittered backoff timers and simulated network disconnects.',
    repositoryUrl: 'https://github.com/neuralcraft/raft-grpc-implementation',
    fileAttachmentName: 'NeuralCraft_Verification_Report.pdf',
    fileAttachmentSize: '1.9 MB',
    submittedAt: '2026-09-17T14:10:00Z',
    status: 'acknowledged',
    acknowledgedByUserId: 'stud-5',
    acknowledgedByUserName: 'Priya Patel (Group Leader)',
    acknowledgedAt: '2026-09-17T15:00:00Z',
    gradePoints: undefined,
    maxPoints: 100,
    feedbackNotes: undefined,
    timeline: [
      {
        timestamp: '2026-09-17T14:10:00Z',
        actor: 'Priya Patel (Group Leader)',
        action: 'Uploaded group deliverables and repository links',
      },
      {
        timestamp: '2026-09-17T15:00:00Z',
        actor: 'Priya Patel (Group Leader)',
        action: 'Officially acknowledged submission on behalf of team NeuralCraft',
        note: 'Verified all member contributions and passed automated verification suite.',
      },
    ],
  },
  // SE-302 Assignment 1 (Group): Graded
  {
    id: 'sub-3',
    assignmentId: 'asg-se302-1',
    courseId: 'course-se302',
    submissionType: 'group',
    groupId: 'grp-se302-team1',
    groupName: 'AgileDev Squad A',
    leaderId: 'stud-1',
    leaderName: 'Alex Rivera',
    submittedByUserId: 'stud-1',
    submittedByUserName: 'Alex Rivera',
    submissionText: 'GitHub Actions workflow pipeline with automated unit testing, ESLint quality gate, SonarCloud integration, and automated Docker container publishing.',
    repositoryUrl: 'https://github.com/agiledev-squad-a/ci-cd-pipeline-showcase',
    fileAttachmentName: 'SquadA_Pipeline_Report.pdf',
    fileAttachmentSize: '3.1 MB',
    submittedAt: '2026-09-16T11:45:00Z',
    status: 'graded',
    acknowledgedByUserId: 'stud-1',
    acknowledgedByUserName: 'Alex Rivera (Group Leader)',
    acknowledgedAt: '2026-09-16T12:00:00Z',
    gradePoints: 96,
    maxPoints: 100,
    feedbackNotes: 'Exemplary CI/CD pipeline configuration! Excellent security gate scanning and caching configuration. Minor recommendation: consider pinning GitHub action SHA digests instead of tags.',
    timeline: [
      { timestamp: '2026-09-16T11:45:00Z', actor: 'Alex Rivera', action: 'Submitted deliverables' },
      { timestamp: '2026-09-16T12:00:00Z', actor: 'Alex Rivera (Group Leader)', action: 'Acknowledged submission' },
      { timestamp: '2026-09-19T09:30:00Z', actor: 'Prof. Marcus Vance', action: 'Graded: 96 / 100 with comprehensive feedback' },
    ],
  },
];

// Helper database functions

export function findUserByEmail(email: string): DbUser | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): DbUser | undefined {
  return users.find((u) => u.id === id);
}

export function sanitizeUser(user: DbUser): User {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export function createNewUser(userData: Omit<DbUser, 'id'>): User {
  const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser: DbUser = {
    ...userData,
    id,
  };
  users.push(newUser);
  return sanitizeUser(newUser);
}

export function getCoursesForUser(user: User): Course[] {
  if (user.role === 'professor') {
    return courses.filter((c) => c.professorId === user.id);
  }
  // If student: return courses where student is enrolled
  const enrolledCourseIds = enrollments
    .filter((e) => e.studentId === user.id)
    .map((e) => e.courseId);
  return courses.filter((c) => enrolledCourseIds.includes(c.id));
}

export function getCourseById(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getAssignmentsForCourse(courseId: string): Assignment[] {
  return assignments.filter((a) => a.courseId === courseId);
}

export function getAllAssignments(user: User): Assignment[] {
  if (user.role === 'professor') {
    const profCourseIds = courses
      .filter((c) => c.professorId === user.id)
      .map((c) => c.id);
    return assignments.filter((a) => profCourseIds.includes(a.courseId));
  }
  const enrolledCourseIds = enrollments
    .filter((e) => e.studentId === user.id)
    .map((e) => e.courseId);
  return assignments.filter((a) => enrolledCourseIds.includes(a.courseId));
}

export function getAssignmentById(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}

export function createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>, professorId: string): Assignment {
  const course = courses.find((c) => c.id === data.courseId && c.professorId === professorId);
  if (!course) {
    throw new Error('Course not found or unauthorized to create assignment for this course.');
  }

  const newAssignment: Assignment = {
    ...data,
    id: `asg-${Date.now()}`,
    courseCode: course.code,
    courseTitle: course.title,
    createdAt: new Date().toISOString(),
  };
  assignments.unshift(newAssignment);
  course.assignmentCount += 1;
  return newAssignment;
}

export function updateAssignment(id: string, updates: Partial<Assignment>, professorId: string): Assignment {
  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) {
    throw new Error('Assignment not found');
  }
  const course = courses.find((c) => c.id === assignment.courseId && c.professorId === professorId);
  if (!course) {
    throw new Error('Unauthorized to edit this assignment.');
  }

  Object.assign(assignment, updates);
  return assignment;
}

export function deleteAssignment(id: string, professorId: string): boolean {
  const index = assignments.findIndex((a) => a.id === id);
  if (index === -1) return false;
  const asg = assignments[index];
  const course = courses.find((c) => c.id === asg.courseId && c.professorId === professorId);
  if (!course) return false;

  assignments.splice(index, 1);
  if (course.assignmentCount > 0) course.assignmentCount -= 1;
  return true;
}

export function getGroupByAssignmentAndUser(assignmentId: string, userId: string): AssignmentGroup | undefined {
  return groups.find(
    (g) => g.assignmentId === assignmentId && g.memberIds.includes(userId)
  );
}

export function getGroupsForAssignment(assignmentId: string): AssignmentGroup[] {
  return groups.filter((g) => g.assignmentId === assignmentId);
}

export function getSubmissionForUserOrGroup(assignmentId: string, user: User): Submission | undefined {
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return undefined;

  if (assignment.submissionType === 'group') {
    const group = getGroupByAssignmentAndUser(assignmentId, user.id);
    if (!group) return undefined;
    return submissions.find((s) => s.assignmentId === assignmentId && s.groupId === group.id);
  }

  // Individual
  return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === user.id);
}

export function getSubmissionsForAssignment(assignmentId: string, user: User): Submission[] {
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return [];

  if (user.role === 'professor') {
    // Return all submissions for this assignment
    return submissions.filter((s) => s.assignmentId === assignmentId);
  }

  // If student: return their own or their group's submission
  const sub = getSubmissionForUserOrGroup(assignmentId, user);
  return sub ? [sub] : [];
}

export function saveSubmission(
  assignmentId: string,
  user: User,
  data: {
    submissionText: string;
    repositoryUrl?: string;
    fileAttachmentName?: string;
    fileAttachmentSize?: string;
  }
): Submission {
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) {
    throw new Error('Assignment not found');
  }

  if (user.role !== 'student') {
    throw new Error('Only students can submit assignments');
  }

  let existingSubmission: Submission | undefined;
  let groupId: string | undefined;
  let groupName: string | undefined;
  let leaderId: string | undefined;
  let leaderName: string | undefined;

  if (assignment.submissionType === 'group') {
    const group = getGroupByAssignmentAndUser(assignmentId, user.id);
    if (!group) {
      throw new Error('You are not assigned to a group for this group assignment.');
    }
    groupId = group.id;
    groupName = group.name;
    leaderId = group.leaderId;
    leaderName = group.leaderName;
    existingSubmission = submissions.find((s) => s.assignmentId === assignmentId && s.groupId === group.id);
  } else {
    existingSubmission = submissions.find((s) => s.assignmentId === assignmentId && s.studentId === user.id);
  }

  const now = new Date().toISOString();

  if (existingSubmission) {
    if (existingSubmission.status === 'graded') {
      throw new Error('This submission has already been graded and finalized.');
    }
    existingSubmission.submissionText = data.submissionText;
    existingSubmission.repositoryUrl = data.repositoryUrl || existingSubmission.repositoryUrl;
    existingSubmission.fileAttachmentName = data.fileAttachmentName || existingSubmission.fileAttachmentName;
    existingSubmission.fileAttachmentSize = data.fileAttachmentSize || existingSubmission.fileAttachmentSize;
    existingSubmission.submittedAt = now;
    existingSubmission.submittedByUserId = user.id;
    existingSubmission.submittedByUserName = user.name;
    // Reset acknowledgment if resubmitting
    existingSubmission.status = 'submitted';
    existingSubmission.acknowledgedByUserId = undefined;
    existingSubmission.acknowledgedByUserName = undefined;
    existingSubmission.acknowledgedAt = undefined;

    existingSubmission.timeline.push({
      timestamp: now,
      actor: `${user.name} (${assignment.submissionType === 'group' && user.id === leaderId ? 'Group Leader' : 'Student'})`,
      action: 'Updated and resubmitted assignment deliverables',
      note: 'Pending acknowledgment.',
    });

    return existingSubmission;
  }

  // Create new submission
  const newSub: Submission = {
    id: `sub-${Date.now()}`,
    assignmentId,
    courseId: assignment.courseId,
    submissionType: assignment.submissionType,
    studentId: assignment.submissionType === 'individual' ? user.id : undefined,
    studentName: assignment.submissionType === 'individual' ? user.name : undefined,
    studentEmail: assignment.submissionType === 'individual' ? user.email : undefined,
    groupId,
    groupName,
    leaderId,
    leaderName,
    submittedByUserId: user.id,
    submittedByUserName: user.name,
    submissionText: data.submissionText,
    repositoryUrl: data.repositoryUrl,
    fileAttachmentName: data.fileAttachmentName,
    fileAttachmentSize: data.fileAttachmentSize,
    submittedAt: now,
    status: 'submitted',
    maxPoints: assignment.totalPoints,
    timeline: [
      {
        timestamp: now,
        actor: `${user.name} (${assignment.submissionType === 'group' && user.id === leaderId ? 'Group Leader' : 'Student'})`,
        action: 'Submitted assignment deliverables',
        note: assignment.submissionType === 'group' 
          ? `Submitted on behalf of ${groupName}. Requires formal acknowledgment by Group Leader (${leaderName}).`
          : 'Submission recorded. Please review and acknowledge to finalize.',
      },
    ],
  };

  submissions.unshift(newSub);
  return newSub;
}

// CRITICAL LOGIC: For group assignments, ONLY the group leader can acknowledge submission!
export function acknowledgeSubmission(submissionId: string, user: User): Submission {
  const submission = submissions.find((s) => s.id === submissionId);
  if (!submission) {
    throw new Error('Submission not found.');
  }

  if (submission.status === 'acknowledged' || submission.status === 'graded') {
    return submission; // already acknowledged
  }

  if (submission.submissionType === 'group') {
    const group = groups.find((g) => g.id === submission.groupId);
    if (!group) {
      throw new Error('Associated group not found.');
    }

    // STRICT CHECK: ONLY THE GROUP LEADER CAN ACKNOWLEDGE!
    if (group.leaderId !== user.id) {
      throw new Error(`Unauthorized: Only the Group Leader (${group.leaderName}) is authorized to formally acknowledge this group submission.`);
    }

    const now = new Date().toISOString();
    submission.status = 'acknowledged';
    submission.acknowledgedByUserId = user.id;
    submission.acknowledgedByUserName = `${user.name} (Group Leader)`;
    submission.acknowledgedAt = now;
    submission.timeline.push({
      timestamp: now,
      actor: `${user.name} (Group Leader)`,
      action: 'Officially acknowledged and validated submission on behalf of all group members',
      note: 'Acknowledgment verified. The submission is now confirmed and locked for grading.',
    });

    return submission;
  }

  // Individual submission
  if (submission.studentId !== user.id && user.role !== 'professor') {
    throw new Error('Unauthorized to acknowledge this submission.');
  }

  const now = new Date().toISOString();
  submission.status = 'acknowledged';
  submission.acknowledgedByUserId = user.id;
  submission.acknowledgedByUserName = user.name;
  submission.acknowledgedAt = now;
  submission.timeline.push({
    timestamp: now,
    actor: user.name,
    action: 'Confirmed and acknowledged individual submission accuracy',
  });

  return submission;
}

export function gradeSubmission(
  submissionId: string,
  professor: User,
  gradePoints: number,
  feedbackNotes: string
): Submission {
  if (professor.role !== 'professor') {
    throw new Error('Only professors can grade submissions.');
  }

  const submission = submissions.find((s) => s.id === submissionId);
  if (!submission) {
    throw new Error('Submission not found.');
  }

  const now = new Date().toISOString();
  submission.status = 'graded';
  submission.gradePoints = Number(gradePoints);
  submission.feedbackNotes = feedbackNotes;
  submission.timeline.push({
    timestamp: now,
    actor: professor.name,
    action: `Assigned grade: ${gradePoints} / ${submission.maxPoints || 100}`,
    note: feedbackNotes,
  });

  return submission;
}

export function getDashboardAnalytics(user: User): DashboardAnalytics {
  const userCourses = getCoursesForUser(user);
  const userAssignments = getAllAssignments(user);

  let pendingSubmissions = 0;
  let acknowledgedSubmissions = 0;
  let gradedSubmissions = 0;

  if (user.role === 'professor') {
    const profAssignmentIds = userAssignments.map((a) => a.id);
    const profSubmissions = submissions.filter((s) => profAssignmentIds.includes(s.assignmentId));

    acknowledgedSubmissions = profSubmissions.filter((s) => s.status === 'acknowledged').length;
    gradedSubmissions = profSubmissions.filter((s) => s.status === 'graded').length;
    // Total enrolled students across courses
    const totalPossibleSubmissions = userCourses.reduce((acc, c) => acc + (c.studentCount || 0), 0);
    pendingSubmissions = Math.max(0, totalPossibleSubmissions - profSubmissions.length);

    const completionRate = totalPossibleSubmissions > 0
      ? Math.round(((acknowledgedSubmissions + gradedSubmissions) / totalPossibleSubmissions) * 100)
      : 85;

    return {
      totalCourses: userCourses.length,
      totalAssignments: userAssignments.length,
      pendingSubmissions,
      acknowledgedSubmissions,
      gradedSubmissions,
      completionRate,
      recentActivities: [
        {
          id: 'act-1',
          type: 'submission',
          title: 'New Group Deliverable',
          description: 'ByteForge Engineering submitted Milestone 1 in CS-401',
          timestamp: '2 hours ago',
          badge: 'Submitted',
        },
        {
          id: 'act-2',
          type: 'acknowledgment',
          title: 'Leader Acknowledged',
          description: 'Priya Patel (Leader) acknowledged Raft submission for NeuralCraft',
          timestamp: '1 day ago',
          badge: 'Acknowledged',
        },
        {
          id: 'act-3',
          type: 'grade',
          title: 'Grade Recorded',
          description: 'Prof. Marcus Vance graded AgileDev Squad A (96/100)',
          timestamp: '2 days ago',
          badge: 'Graded',
        },
      ],
    };
  }

  // Student analytics
  userAssignments.forEach((asg) => {
    const sub = getSubmissionForUserOrGroup(asg.id, user);
    if (!sub || sub.status === 'pending') {
      pendingSubmissions += 1;
    } else if (sub.status === 'acknowledged') {
      acknowledgedSubmissions += 1;
    } else if (sub.status === 'graded') {
      gradedSubmissions += 1;
    } else if (sub.status === 'submitted') {
      pendingSubmissions += 1;
    }
  });

  const total = userAssignments.length;
  const completed = acknowledgedSubmissions + gradedSubmissions;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    totalCourses: userCourses.length,
    totalAssignments: userAssignments.length,
    pendingSubmissions,
    acknowledgedSubmissions,
    gradedSubmissions,
    completionRate,
    recentActivities: [
      {
        id: 'act-s1',
        type: 'submission',
        title: 'Group Milestone Submitted',
        description: 'Sarah Chen uploaded Raft consensus archive for team ByteForge',
        timestamp: 'Yesterday at 4:20 PM',
        badge: 'Submitted',
      },
      {
        id: 'act-s2',
        type: 'grade',
        title: 'Assignment Graded',
        description: 'Received 96/100 from Prof. Vance on CI/CD Pipeline project',
        timestamp: '3 days ago',
        badge: 'Graded',
      },
      {
        id: 'act-s3',
        type: 'assignment',
        title: 'Upcoming Deadline',
        description: 'CS-401 Milestone 1 due on Sept 28th',
        timestamp: 'In 8 days',
        badge: 'Active',
      },
    ],
  };
}
