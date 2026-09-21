import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  findUserByEmail,
  findUserById,
  createNewUser,
  sanitizeUser,
  getCoursesForUser,
  getCourseById,
  getAllAssignments,
  getAssignmentsForCourse,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getGroupByAssignmentAndUser,
  getGroupsForAssignment,
  getSubmissionForUserOrGroup,
  getSubmissionsForAssignment,
  saveSubmission,
  acknowledgeSubmission,
  gradeSubmission,
  getDashboardAnalytics,
  users,
  courses,
} from './server/db.ts';
import type { User } from './src/types.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'academic_portal_jwt_secure_secret_key_2026';

interface AuthenticatedRequest extends Request {
  user?: User;
}

// Generate JWT token
function signToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware: Authenticate JWT Token
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const dbUser = findUserById(decoded.id);
    if (!dbUser) {
      res.status(401).json({ error: 'User not found or invalid session' });
      return;
    }
    req.user = sanitizeUser(dbUser);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // Authentication Endpoints (JWT-Based)
  // ==========================================

  // Register
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, department, studentIdNumber, bio } = req.body;

      if (!name || !email || !password || !role || !department) {
        res.status(400).json({ error: 'Name, email, password, role, and department are required.' });
        return;
      }

      if (role !== 'student' && role !== 'professor') {
        res.status(400).json({ error: 'Role must be either student or professor.' });
        return;
      }

      const existing = findUserByEmail(email);
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = createNewUser({
        name,
        email,
        passwordHash,
        role,
        department,
        studentIdNumber: role === 'student' ? studentIdNumber || `ST-${Date.now().toString().slice(-4)}` : undefined,
        bio: bio || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      });

      const token = signToken(newUser);
      res.status(201).json({ token, user: newUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const dbUser = findUserByEmail(email);
      if (!dbUser) {
        res.status(401).json({ error: 'Invalid email or password credentials.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password credentials.' });
        return;
      }

      const user = sanitizeUser(dbUser);
      const token = signToken(user);
      res.json({ token, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  // Demo Login (One-click instant login for evaluation)
  app.post('/api/auth/demo-login', (req: Request, res: Response) => {
    const { demoRole } = req.body;
    let targetUserId = 'stud-1'; // Default: Alex Rivera (Student Leader)

    switch (demoRole) {
      case 'student-leader':
        targetUserId = 'stud-1'; // Alex Rivera (Leader of ByteForge)
        break;
      case 'student-member':
        targetUserId = 'stud-2'; // Sarah Chen (Member of ByteForge)
        break;
      case 'student-independent':
        targetUserId = 'stud-4'; // David Kim (Independent Student)
        break;
      case 'professor-1':
      case 'professor':
        targetUserId = 'prof-1'; // Dr. Elena Rostova (CS-401 & CS-415)
        break;
      case 'professor-2':
        targetUserId = 'prof-2'; // Prof. Marcus Vance (SE-302)
        break;
      default:
        if (demoRole && findUserById(demoRole)) {
          targetUserId = demoRole;
        }
    }

    const dbUser = findUserById(targetUserId);
    if (!dbUser) {
      res.status(404).json({ error: 'Demo user account not found' });
      return;
    }

    const user = sanitizeUser(dbUser);
    const token = signToken(user);
    res.json({ token, user });
  });

  // Get Current Profile
  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // ==========================================
  // Course Endpoints
  // ==========================================

  app.get('/api/courses', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userCourses = getCoursesForUser(req.user!);
    res.json({ courses: userCourses });
  });

  app.get('/api/courses/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const course = getCourseById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json({ course });
  });

  app.get('/api/courses/:id/assignments', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const courseAssignments = getAssignmentsForCourse(req.params.id);
    res.json({ assignments: courseAssignments });
  });

  // ==========================================
  // Assignment Endpoints
  // ==========================================

  app.get('/api/assignments', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { courseId } = req.query;
    if (courseId && typeof courseId === 'string') {
      const courseAssignments = getAssignmentsForCourse(courseId);
      res.json({ assignments: courseAssignments });
      return;
    }
    const all = getAllAssignments(req.user!);
    res.json({ assignments: all });
  });

  app.get('/api/assignments/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const assignment = getAssignmentById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Include group and submission context for the user
    let group = undefined;
    if (assignment.submissionType === 'group' && req.user!.role === 'student') {
      group = getGroupByAssignmentAndUser(assignment.id, req.user!.id);
    }

    let submission = undefined;
    if (req.user!.role === 'student') {
      submission = getSubmissionForUserOrGroup(assignment.id, req.user!);
    }

    res.json({
      assignment,
      group,
      submission,
    });
  });

  // Create Assignment (Professor only)
  app.post('/api/assignments', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'professor') {
        res.status(403).json({ error: 'Only professors can create assignments.' });
        return;
      }

      const {
        courseId,
        title,
        description,
        instructions,
        deadline,
        submissionType,
        totalPoints,
        rubric,
        attachments,
      } = req.body;

      if (!courseId || !title || !deadline || !submissionType) {
        res.status(400).json({ error: 'courseId, title, deadline, and submissionType are required.' });
        return;
      }

      const newAssignment = createAssignment(
        {
          courseId,
          courseCode: '',
          courseTitle: '',
          title,
          description: description || '',
          instructions: instructions || '',
          deadline,
          submissionType,
          totalPoints: Number(totalPoints) || 100,
          status: 'active',
          allowResubmission: true,
          rubric: rubric || [{ criteria: 'General Quality', points: Number(totalPoints) || 100 }],
          attachments: attachments || [],
        },
        req.user!.id
      );

      res.status(201).json({ assignment: newAssignment });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create assignment' });
    }
  });

  // Edit Assignment (Professor only)
  app.put('/api/assignments/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'professor') {
        res.status(403).json({ error: 'Only professors can edit assignments.' });
        return;
      }

      const updated = updateAssignment(req.params.id, req.body, req.user!.id);
      res.json({ assignment: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update assignment' });
    }
  });

  // Delete Assignment (Professor only)
  app.delete('/api/assignments/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'professor') {
        res.status(403).json({ error: 'Only professors can delete assignments.' });
        return;
      }

      const success = deleteAssignment(req.params.id, req.user!.id);
      if (!success) {
        res.status(404).json({ error: 'Assignment not found or unauthorized.' });
        return;
      }
      res.json({ success: true, message: 'Assignment deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete assignment' });
    }
  });

  // ==========================================
  // Submissions Endpoints & Logic
  // ==========================================

  // Get submissions for an assignment
  app.get('/api/assignments/:id/submissions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const subs = getSubmissionsForAssignment(req.params.id, req.user!);
    const groupsList = req.user!.role === 'professor' ? getGroupsForAssignment(req.params.id) : [];
    res.json({ submissions: subs, groups: groupsList });
  });

  // Submit assignment (Student flow)
  app.post('/api/assignments/:id/submissions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'student') {
        res.status(403).json({ error: 'Only students can submit assignments.' });
        return;
      }

      const { submissionText, repositoryUrl, fileAttachmentName, fileAttachmentSize } = req.body;

      if (!submissionText && !repositoryUrl && !fileAttachmentName) {
        res.status(400).json({ error: 'Please provide submission content, a repository link, or an attachment.' });
        return;
      }

      const submission = saveSubmission(req.params.id, req.user!, {
        submissionText: submissionText || 'No text provided',
        repositoryUrl,
        fileAttachmentName: fileAttachmentName || 'Submission_Document.pdf',
        fileAttachmentSize: fileAttachmentSize || '1.2 MB',
      });

      res.status(200).json({ submission });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Submission failed' });
    }
  });

  // Acknowledge submission:
  // For group assignments: ONLY group leader can acknowledge!
  // Reflected across all group members!
  app.post('/api/submissions/:id/acknowledge', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const submission = acknowledgeSubmission(req.params.id, req.user!);
      res.json({ submission, message: 'Submission acknowledged successfully!' });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Acknowledgment failed' });
    }
  });

  // Grade submission (Professor flow)
  app.post('/api/submissions/:id/grade', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'professor') {
        res.status(403).json({ error: 'Only professors can grade submissions.' });
        return;
      }

      const { gradePoints, feedbackNotes } = req.body;
      if (gradePoints === undefined || gradePoints === null) {
        res.status(400).json({ error: 'Grade points are required.' });
        return;
      }

      const updated = gradeSubmission(req.params.id, req.user!, Number(gradePoints), feedbackNotes || '');
      res.json({ submission: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to grade submission' });
    }
  });

  // ==========================================
  // Analytics & Schema Endpoints
  // ==========================================

  app.get('/api/analytics/dashboard', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const analytics = getDashboardAnalytics(req.user!);
    res.json({ analytics });
  });

  // PostgreSQL Schema DDL readout
  app.get('/api/db/schema', (req: Request, res: Response) => {
    try {
      const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const ddl = fs.readFileSync(schemaPath, 'utf8');
        res.json({ schema: ddl });
      } else {
        res.status(404).json({ error: 'Schema file not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // Vite Middleware & Static Assets
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Academic Portal Server running on http://localhost:${PORT}`);
  });
}

startServer();
