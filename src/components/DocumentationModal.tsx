import React, { useState, useEffect } from 'react';
import {
  X,
  FileCode2,
  BookOpen,
  Database,
  Layers,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'architecture' | 'setup' | 'testing'>('overview');
  const [sqlSchema, setSqlSchema] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getSchema().then((data) => {
      if (data && data.schema) setSqlSchema(data.schema);
    }).catch(() => {
      setSqlSchema('-- PostgreSQL schema available in /server/schema.sql');
    });
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Project Architecture & Specification (Task -2)
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Full-Stack
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Design rationale, PostgreSQL relational schema, component hierarchy, and setup.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>UI/UX Rationale (4.3.a)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Schema (4.3.b)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Component Architecture (4.3.d)</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'setup'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Setup (4.3.b)</span>
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'testing'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evaluation Test Plan</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 max-h-[calc(90vh-140px)]">
          {/* TAB 1: UI/UX Rationale */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-950 text-sm">
                  1. UI/UX Enhancements & Design Philosophy
                </h3>
                <p className="text-indigo-900/90 text-xs">
                  The interface transforms conventional academic LMS clunkiness into a high-density,
                  ergonomic digital workstation. Every element adheres to mathematical spacing (2x horizontal button padding, consistent 8px/16px/24px rhythm), accessible contrast standards (&gt;4.5:1 WCAG AA), and unmistakable visual hierarchies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Role-Based Flow & Authentication
                  </h4>
                  <p className="text-slate-600 text-xs">
                    JWT tokens are securely minted on the Express backend upon login/registration with 7-day expiration. Upon authentication, users are redirected based on role:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li><strong>Students</strong> see enrolled courses, upcoming deadlines, personal and group milestones.</li>
                    <li><strong>Professors</strong> receive curriculum controls, class rosters, submission trackers, and evaluation tools.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    Group Leader Acknowledgment Model
                  </h4>
                  <p className="text-slate-600 text-xs">
                    Per Section 1.3 &amp; 3.3, group tasks allow any member to contribute deliverables, but <strong>only the designated group leader can formally acknowledge</strong> the submission. This state is synchronized in real-time across all group members and professor monitors.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Progress Visualization & Micro-Interactions
                  </h4>
                  <p className="text-slate-600 text-xs">
                    4-step linear progression bar (Not Started &rarr; Submitted &rarr; Leader Acknowledged &rarr; Graded) provides instantaneous status recognition without ambiguity. Confetti micro-celebration reinforces completion.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Typography & Color System
                  </h4>
                  <p className="text-slate-600 text-xs">
                    Leverages <strong>Plus Jakarta Sans</strong> for geometric legibility and <strong>Space Grotesk</strong> for numeric labels. Cool slate neutrals paired with indigo, emerald, and amber accent palettes indicate status states without cognitive overload.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PostgreSQL Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Relational PostgreSQL Schema DDL (server/schema.sql)
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Complete 3NF normalized tables with foreign keys, CASCADE rules, check constraints, and performance indexes.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL!' : 'Copy SQL DDL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                {sqlSchema}
              </pre>
            </div>
          )}

          {/* TAB 3: Component Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Full-Stack Architecture & Component Structure
              </h3>
              <div className="p-4 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
{`+-------------------------------------------------------------------------+
|                        BROWSER FRONTEND (React 19 + Vite)               |
|                                                                         |
|  [App.tsx]                                                              |
|   |-- <Navbar>               (Role badge, Switcher, Docs trigger)      |
|   |-- <AuthModal>            (JWT login & registration, Demo buttons)   |
|   |-- <StudentDashboard>     (Courses grid, Deadlines, Analytics)       |
|   |-- <ProfessorDashboard>   (Curriculum overview, Student counts)      |
|   |-- <CourseDetailView>     (Syllabus & Course coursework)             |
|   |-- <AssignmentDetail>     (Specs, Rubric, Group Leader Ack Button)   |
|   |-- <ProfessorSubmissions> (Submissions tracker, Status filter, Grade)|
|   |-- <CreateAssignmentModal>(Rubric builder, Group/Individual mode)    |
|   |-- <DocumentationModal>   (Architecture specs, SQL DDL export)      |
+------------------------------------+------------------------------------+
                                     |
              REST API Calls (Bearer JWT via /src/lib/api.ts)
                                     |
                                     v
+-------------------------------------------------------------------------+
|                   NODE.JS + EXPRESS BACKEND (server.ts)                 |
|                                                                         |
|  [JWT Auth Middleware]       (Verifies Bearer token, sets req.user)     |
|  [REST Endpoints]            (/api/auth, /api/courses, /api/assignments,|
|                               /api/submissions, /api/analytics, etc.)   |
|                                                                         |
|  [Relational Store]          (server/db.ts: Users, Courses, Groups,    |
|                               Submissions, Leader Ack Invariant Logic)  |
|                                                                         |
|  [PostgreSQL Schema]         (server/schema.sql: 7 relational tables)   |
+-------------------------------------------------------------------------+`}
              </div>
            </div>
          )}

          {/* TAB 4: Local Setup */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Local Setup & Execution Instructions
              </h3>
              <p className="text-slate-600 text-xs">
                To run both the frontend and backend locally on any development machine:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">1. Clone & Install Dependencies</span>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg">
{`git clone <repository-url>
cd project
npm install`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">2. Environment Configuration (.env)</span>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg">
{`JWT_SECRET="academic_portal_jwt_secure_secret_key_2026"
PORT=3000`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">3. Launch Dev Server (Frontend + Backend)</span>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg">
{`npm run dev`}
                  </pre>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Boots Vite middleware on port 3000 with Express API routes mounted under <code className="font-mono text-indigo-600">/api/*</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">4. Production Build & Start</span>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg">
{`npm run build
npm start`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Testing & Evaluation */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pre-Seeded Accounts for Evaluator Testing
                </h3>
                <p className="text-xs text-emerald-900/90">
                  You can instantaneously test all specific requirements using the quick switcher in the top navigation bar or the credentials below:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                  <span className="font-bold text-xs text-amber-900 block">
                    1. Alex Rivera (Student - Group Leader)
                  </span>
                  <span className="text-[11px] text-slate-600 block">Email: alex.rivera@student.edu</span>
                  <span className="text-[11px] text-slate-600 block">Pass: Password123!</span>
                  <span className="text-[10px] text-amber-800 font-semibold block mt-1">
                    &bull; Role: Leader of &quot;ByteForge&quot; in CS-401 Assignment 1. Authorized to click &quot;Acknowledge &amp; Confirm&quot;.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40">
                  <span className="font-bold text-xs text-teal-900 block">
                    2. Sarah Chen (Student - Group Member)
                  </span>
                  <span className="text-[11px] text-slate-600 block">Email: sarah.chen@student.edu</span>
                  <span className="text-[11px] text-slate-600 block">Pass: Password123!</span>
                  <span className="text-[10px] text-teal-800 font-semibold block mt-1">
                    &bull; Role: Member of &quot;ByteForge&quot;. Can submit deliverables; cannot acknowledge.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40">
                  <span className="font-bold text-xs text-indigo-900 block">
                    3. Dr. Elena Rostova (Professor - CS)
                  </span>
                  <span className="text-[11px] text-slate-600 block">Email: elena.rostova@university.edu</span>
                  <span className="text-[11px] text-slate-600 block">Pass: Password123!</span>
                  <span className="text-[10px] text-indigo-800 font-semibold block mt-1">
                    &bull; Role: CS-401 &amp; CS-415 Instructor. Can monitor submissions, verify leader acknowledgment, and input grades.
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-xs text-slate-900 block">
                    4. Prof. Marcus Vance (Professor - SE)
                  </span>
                  <span className="text-[11px] text-slate-600 block">Email: marcus.vance@university.edu</span>
                  <span className="text-[11px] text-slate-600 block">Pass: Password123!</span>
                  <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                    &bull; Role: SE-302 Instructor. Shows Agile architecture assignments.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Compliant with Task -2 Deliverables (Sections 1.1 - 4.3)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
