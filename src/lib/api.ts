import type {
  Assignment,
  AssignmentGroup,
  Course,
  DashboardAnalytics,
  Submission,
  User,
} from '../types.ts';

const TOKEN_KEY = 'academic_portal_token';
const USER_KEY = 'academic_portal_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'professor';
    department: string;
    studentIdNumber?: string;
    bio?: string;
  }): Promise<{ token: string; user: User }> => {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  demoLogin: async (demoRole: string): Promise<{ token: string; user: User }> => {
    return request('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ demoRole }),
    });
  },

  getMe: async (): Promise<{ user: User }> => {
    return request('/api/auth/me');
  },

  // Courses
  getCourses: async (): Promise<{ courses: Course[] }> => {
    return request('/api/courses');
  },

  getCourse: async (id: string): Promise<{ course: Course }> => {
    return request(`/api/courses/${id}`);
  },

  getCourseAssignments: async (courseId: string): Promise<{ assignments: Assignment[] }> => {
    return request(`/api/courses/${courseId}/assignments`);
  },

  // Assignments
  getAssignments: async (courseId?: string): Promise<{ assignments: Assignment[] }> => {
    const url = courseId ? `/api/assignments?courseId=${courseId}` : '/api/assignments';
    return request(url);
  },

  getAssignmentDetails: async (
    id: string
  ): Promise<{
    assignment: Assignment;
    group?: AssignmentGroup;
    submission?: Submission;
  }> => {
    return request(`/api/assignments/${id}`);
  },

  createAssignment: async (data: any): Promise<{ assignment: Assignment }> => {
    return request('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAssignment: async (id: string, data: any): Promise<{ assignment: Assignment }> => {
    return request(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAssignment: async (id: string): Promise<{ success: boolean }> => {
    return request(`/api/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  // Submissions
  getSubmissionsForAssignment: async (
    assignmentId: string
  ): Promise<{ submissions: Submission[]; groups: AssignmentGroup[] }> => {
    return request(`/api/assignments/${assignmentId}/submissions`);
  },

  submitAssignment: async (
    assignmentId: string,
    payload: {
      submissionText: string;
      repositoryUrl?: string;
      fileAttachmentName?: string;
      fileAttachmentSize?: string;
    }
  ): Promise<{ submission: Submission }> => {
    return request(`/api/assignments/${assignmentId}/submissions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  acknowledgeSubmission: async (
    submissionId: string
  ): Promise<{ submission: Submission; message: string }> => {
    return request(`/api/submissions/${submissionId}/acknowledge`, {
      method: 'POST',
    });
  },

  gradeSubmission: async (
    submissionId: string,
    payload: { gradePoints: number; feedbackNotes: string }
  ): Promise<{ submission: Submission }> => {
    return request(`/api/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Analytics & Schema
  getAnalytics: async (): Promise<{ analytics: DashboardAnalytics }> => {
    return request('/api/analytics/dashboard');
  },

  getSchema: async (): Promise<{ schema: string }> => {
    return request('/api/db/schema');
  },
};
