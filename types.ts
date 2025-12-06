
export enum SupportedLanguage {
  PYTHON = 'python',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  GO = 'go',
  RUST = 'rust',
  JAVA = 'java',
  CPP = 'cpp',
  CSHARP = 'csharp',
  SQL = 'sql',
  HTML = 'html',
  CSS = 'css',
  MARKDOWN = 'markdown',
  JSON = 'json',
  BASH = 'shell',
  POWERSHELL = 'powershell',
  BATCH = 'bat',
  DOCKERFILE = 'dockerfile',
  YAML = 'yaml',
  PHP = 'php',
  RUBY = 'ruby',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  SCALA = 'scala',
  LUA = 'lua',
  HASKELL = 'haskell',
  ASSEMBLY = 'assembly',
  DART = 'dart',
  ELIXIR = 'elixir'
}

export enum AgentStatus {
  IDLE = 'idle',
  ORCHESTRATING = 'orchestrating',
  CONSTRUCTING = 'constructing',
  COMPLETED = 'completed',
  ERROR = 'error',
  EVOLVING = 'evolving',
  ANALYZING_IMAGE = 'analyzing_image',
  REFACTORING = 'refactoring' // New
}

// --- COGNITIVE MESH (v7.0) ---

export interface CommandAction {
  id: string;
  title: string;
  section: 'Navigation' | 'Editor' | 'System' | 'AI';
  shortcut?: string;
  handler: () => void;
}

export interface CompletionItem {
  label: string;
  kind: 'Keyword' | 'Variable' | 'Snippet' | 'Text';
  detail?: string;
}

export interface EditorSelection {
  text: string;
  startLine: number;
  endLine: number;
}

export type SmartActionType = 'explain' | 'refactor' | 'fix' | 'document';

// --- MENU SYSTEM TYPES (v6.0) ---

export interface MenuItem {
  label: string;
  action?: string; // ID passed to handler
  shortcut?: string; // Visual only
  disabled?: boolean;
  type?: 'separator' | 'item';
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

// --- EXTENSION ARCHITECTURE (v6.0) ---

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Language' | 'Tool' | 'Theme' | 'AI';
  version: string;
  isEnabled: boolean;
  componentView?: string; // The ID used in activeView state
  author: string;
}

// --- NEURAL LINK (v6.0) ---

export interface GhostCursor {
  id: string;
  label: string; // e.g. "Architect Agent"
  color: string; // hex
  x: number; // line number
  y: number; // column
  isActive: boolean;
}

// --- AUTH & ADMIN TYPES ---

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: number;
  lastLogin: number;
  isBanned?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// --- DESKTOP TYPES ---

export interface WindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  isFocused: boolean;
}

export interface InstallerState {
    isOpen: boolean;
    progress: number;
    step: 'downloading' | 'extracting' | 'installing' | 'completed';
    platform: 'win' | 'mac' | 'linux';
}

// --- ORCHESTRA TYPES ---

export enum OrchestraRole {
  ARCHITECT = 'Chief Architect',
  TECH_LEAD = 'Tech Lead',
  DEVELOPER = 'Senior Developer',
  QA_ENGINEER = 'QA & Security Engineer',
  SENTINEL = 'System Sentinel'
}

export interface OrchestraPhase {
  id: string;
  role: OrchestraRole;
  action: string;
  status: 'pending' | 'active' | 'success' | 'failed';
  details?: string;
}

// --- TASK MANAGEMENT TYPES ---

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo: OrchestraRole;
}

// --- TESTING & DIAGNOSTICS TYPES ---

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestCase {
  id: string;
  name: string;
  status: TestStatus;
  duration?: number;
  errorLog?: string;
}

export interface TestSuite {
  id: string;
  fileName: string;
  cases: TestCase[];
  status: TestStatus;
}

export interface DiagnosticProblem {
  id: string;
  file: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
}

// --- INTEGRATION TYPES ---

export interface IntegrationConfig {
  id: 'github' | 'vercel' | 'google_cloud';
  name: string;
  connected: boolean;
  token?: string;
  username?: string;
}

// --- CLOUD ECOSYSTEM TYPES ---

export type CloudCategory = 'Frontend' | 'Backend' | 'Database' | 'Fullstack' | 'AI' | 'Auth' | 'DevOps' | 'CMS';

export interface CloudProvider {
    id: string;
    name: string;
    description: string;
    icon: string;
    freeTierFeatures: string[];
    configFile: string;
    configTemplate: string;
    url: string;
    category: CloudCategory;
}

// --- ACADEMY TYPES ---

export interface AcademyTopic {
  id: string;
  title: string;
  prompt: string;
}

export interface AcademyChapter {
  id: string;
  title: string;
  topics: AcademyTopic[];
}

export interface LessonContent {
  title: string;
  htmlContent: string;
  runnableCode: string;
}

// --- REGISTRY TYPES (PyPI / NPM / UNIVERSAL) ---

export interface PackageHealth {
  score: number;
  securityIssues: number;
  lastRelease: string;
  license: string;
  popularity: 'High' | 'Medium' | 'Low';
}

export interface PythonPackage {
  name: string;
  version: string;
  summary: string;
  author: string;
  description: string;
  installCmd: string;
  health: PackageHealth;
  tags: string[];
  dependencies: string[];
}

export interface NpmPackage {
    name: string;
    version: string;
    description: string;
    author: string;
    keywords: string[];
    downloads: string;
    license: string;
    health: PackageHealth;
    installCmd: string;
    peerDependencies?: string[];
}

export interface UniversalPackage {
    language: string;
    registry: string;
    name: string;
    version: string;
    description: string;
    installCmd: string;
    stats: {
        downloads: string;
        stars: string;
    };
    health: PackageHealth;
}

// -----------------------

export interface ProjectFile {
  name: string;
  language: string;
  content: string;
  status?: 'new' | 'modified' | 'staged';
}

export interface GeneratedProject {
  id: string;
  title: string;
  description: string;
  architecture_plan: string;
  files: ProjectFile[];
  tasks: ProjectTask[];
  testSuites: TestSuite[];
  problems: DiagnosticProblem[];
  createdAt: number;
  modelContext?: string;
  deployedUrl?: string;
  aiMetrics?: AIPerformanceMetrics;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  status?: AgentStatus;
  orchestraPhase?: OrchestraRole;
  feedback?: 'like' | 'dislike';
  attachments?: { type: 'image', url: string }[]; // New for Vision
}

export type LibraryCategory = 'Frontend' | 'Backend' | 'AI_Data' | 'DevOps' | 'Mobile' | 'System' | 'Database' | 'Blockchain' | 'Emerging_Tech' | 'Universal';

export interface LibraryDefinition {
  id: string;
  name: string;
  category: LibraryCategory;
  description: string;
  icon: string;
  language: SupportedLanguage;
  specializedPrompt: string;
  isGenerated?: boolean;
  features?: string[];
  defaultFiles?: string[];
  sampleCommand?: string;
  docsUrl?: string;
  // v6.0 Microsite Features
  architectureNotes?: string; // Markdown
  bestPractices?: string[];
  ecosystemTools?: string[];
}

// --- SENTINEL EVOLUTION TYPES ---

export interface LearningPattern {
  id: string;
  trigger: string;
  insight: string;
  timestamp: number;
}

export interface AIPerformanceMetrics {
  accuracyScore: number;
  generationLatency: number;
  tokenEfficiency: number;
  selfCorrectionCount: number;
}

export interface SystemEvolution {
  version: string;
  knowledgeCount: number;
  patterns: LearningPattern[];
  lastUpdate: number;
  globalMetrics: {
      totalProjects: number;
      averageAccuracy: number;
      uptime: number;
  }
}
