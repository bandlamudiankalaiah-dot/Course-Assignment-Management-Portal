export type UserRole = 'student' | 'professor';

export type SubmissionType = 'individual' | 'group';

export type SubmissionStatus = 'pending' | 'submitted' | 'acknowledged' | 'graded';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  studentIdNumber?: string;
  bio?: string;
}

export interface RubricItem {
  criteria: string;
  points: number;
}

export interface AssignmentAttachment {
  name: string;
  url: string;
  size: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  instructions: string;
  deadline: string; // ISO string
  submissionType: SubmissionType;
  totalPoints: number;
  status: 'active' | 'closed';
  allowResubmission: boolean;
  rubric: RubricItem[];
  attachments: AssignmentAttachment[];
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  isLeader: boolean;
  avatar?: string;
}

export interface AssignmentGroup {
  id: string;
  assignmentId: string;
  courseId: string;
  name: string;
  leaderId: string;
  leaderName: string;
  memberIds: string[];
  members: GroupMember[];
}

export interface SubmissionTimelineEvent {
  timestamp: string;
  actor: string;
  action: string;
  note?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  courseId: string;
  submissionType: SubmissionType;
  // If individual:
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  // If group:
  groupId?: string;
  groupName?: string;
  leaderId?: string;
  leaderName?: string;
  // Submission details:
  submittedByUserId: string;
  submittedByUserName: string;
  submissionText: string;
  repositoryUrl?: string;
  fileAttachmentName?: string;
  fileAttachmentSize?: string;
  submittedAt: string;
  status: SubmissionStatus;
  acknowledgedByUserId?: string;
  acknowledgedByUserName?: string;
  acknowledgedAt?: string;
  gradePoints?: number;
  maxPoints?: number;
  feedbackNotes?: string;
  timeline: SubmissionTimelineEvent[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  professorId: string;
  professorName: string;
  professorEmail: string;
  term: string;
  credits: number;
  colorTheme: string;
  studentCount: number;
  assignmentCount: number;
  enrolledStudentIds?: string[];
}

export interface DashboardAnalytics {
  totalCourses: number;
  totalAssignments: number;
  pendingSubmissions: number;
  acknowledgedSubmissions: number;
  gradedSubmissions: number;
  completionRate: number;
  recentActivities: Array<{
    id: string;
    type: 'submission' | 'acknowledgment' | 'grade' | 'assignment';
    title: string;
    description: string;
    timestamp: string;
    badge: string;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}
