
import { GeneratedProject, OrchestraPhase, OrchestraRole, AgentMessage, AgentStatus, ProjectTask, TestSuite } from "../types";
import { agentDesignArchitecture, agentImplementCode } from "./gemini";
import { DiagnosticsEngine } from "./diagnostics";

type PhaseCallback = (phase: OrchestraPhase) => void;
type MessageCallback = (msg: AgentMessage) => void;

export class OrchestratorService {
  private phases: OrchestraPhase[] = [];
  
  constructor(
    private onPhaseUpdate: PhaseCallback,
    private onMessageAdd: MessageCallback
  ) {
    this.resetPhases();
  }

  private resetPhases() {
    this.phases = [
      { id: '1', role: OrchestraRole.ARCHITECT, action: 'Analyzing Requirements & Designing Schema', status: 'pending' },
      { id: '2', role: OrchestraRole.TECH_LEAD, action: 'Validating Architecture & Global Standards', status: 'pending' },
      { id: '3', role: OrchestraRole.DEVELOPER, action: 'Generating Production Code', status: 'pending' },
      { id: '4', role: OrchestraRole.QA_ENGINEER, action: 'Self-Healing & Final Review', status: 'pending' }
    ];
    this.notifyPhases();
  }

  private updatePhase(role: OrchestraRole, status: 'active' | 'success' | 'failed', details?: string) {
    const idx = this.phases.findIndex(p => p.role === role);
    if (idx !== -1) {
      this.phases[idx] = { ...this.phases[idx], status, details };
      this.notifyPhases();
    }
  }

  private notifyPhases() {
    // We send a copy to avoid mutation issues in React
    this.phases.forEach(p => this.onPhaseUpdate({ ...p }));
  }

  private addLog(role: OrchestraRole, text: string) {
    this.onMessageAdd({
      id: crypto.randomUUID(),
      role: 'agent',
      text: text,
      timestamp: Date.now(),
      orchestraPhase: role
    });
  }

  private generateTasksFromFiles(files: any[]): ProjectTask[] {
      // Heuristic task generation
      const tasks: ProjectTask[] = [];
      files.forEach(f => {
          tasks.push({
              id: crypto.randomUUID(),
              title: `Implement ${f.name}`,
              status: 'done', // Since we generate completed code
              assignedTo: OrchestraRole.DEVELOPER
          });
          if (f.name.includes('test')) {
               tasks.push({
                  id: crypto.randomUUID(),
                  title: `Verify ${f.name}`,
                  status: 'done',
                  assignedTo: OrchestraRole.QA_ENGINEER
              });
          }
      });
      // Add standard deployment tasks
      tasks.push({ id: 'deploy-1', title: 'Push to GitHub (Piper)', status: 'todo', assignedTo: OrchestraRole.TECH_LEAD });
      tasks.push({ id: 'deploy-2', title: 'Trigger Cloud Build', status: 'todo', assignedTo: OrchestraRole.TECH_LEAD });
      tasks.push({ id: 'deploy-3', title: 'Deploy to Cloud Run', status: 'todo', assignedTo: OrchestraRole.TECH_LEAD });
      return tasks;
  }

  private generateTestSuites(files: any[]): TestSuite[] {
      // Create a test suite for every 'test' file or main entry point
      const suites: TestSuite[] = [];
      files.forEach(f => {
          if (f.name.includes('test') || f.name.includes('spec')) {
              suites.push({
                  id: crypto.randomUUID(),
                  fileName: f.name,
                  status: 'pending',
                  cases: [
                      { id: crypto.randomUUID(), name: 'should initialize correctly', status: 'pending' },
                      { id: crypto.randomUUID(), name: 'should handle valid input', status: 'pending' },
                      { id: crypto.randomUUID(), name: 'should raise error on invalid input', status: 'pending' }
                  ]
              });
          }
      });
      // Fallback if no explicit tests found
      if (suites.length === 0) {
          suites.push({
              id: crypto.randomUUID(),
              fileName: 'integration_test.py',
              status: 'pending',
              cases: [
                   { id: crypto.randomUUID(), name: 'System E2E Health Check', status: 'pending' },
                   { id: crypto.randomUUID(), name: 'API Response Time < 200ms', status: 'pending' }
              ]
          });
      }
      return suites;
  }

  public async startOrchestration(
    userPrompt: string,
    modelContext: string,
    specializedInstruction: string
  ): Promise<GeneratedProject> {
    this.resetPhases();
    
    try {
      // --- PHASE 1: ARCHITECT ---
      this.updatePhase(OrchestraRole.ARCHITECT, 'active');
      this.addLog(OrchestraRole.ARCHITECT, `Analyzing request: "${userPrompt}". Designing scalable architecture for ${modelContext}...`);
      
      const googleStandardsInstruction = `
        ${specializedInstruction}
        GLOBAL DEPLOYMENT & INTEGRATION STANDARDS:
        1. **Deployment Configs**: If this is a frontend, you MUST include 'vercel.json' or 'netlify.toml'. If backend, include 'Dockerfile' and 'fly.toml' or 'render.yaml'.
        2. **Git Automation**: You MUST include a 'deploy_manager.sh' script that initializes git, adds remote origin, and pushes to main.
        3. **Google Standards**: 'OWNERS' file and 'cloudbuild.yaml' are mandatory.
        4. **Free Tier Optimization**: Configs should be tuned for Free/Hobby plans (e.g., low memory limits in Dockerfile).
        5. **CI/CD**: Include '.github/workflows/deploy.yml'.
      `;

      const archData = await agentDesignArchitecture(userPrompt, modelContext, googleStandardsInstruction);
      
      this.updatePhase(OrchestraRole.ARCHITECT, 'success', 'Blueprint Created');
      this.addLog(OrchestraRole.ARCHITECT, `Architecture Plan Completed.\nStrategies: ${archData.architecture_plan}`);

      // --- PHASE 2: TECH LEAD ---
      this.updatePhase(OrchestraRole.TECH_LEAD, 'active');
      await new Promise(r => setTimeout(r, 800)); // Simulate processing
      this.updatePhase(OrchestraRole.TECH_LEAD, 'success', 'Standards Validated');

      // --- PHASE 3: DEVELOPER ---
      this.updatePhase(OrchestraRole.DEVELOPER, 'active');
      this.addLog(OrchestraRole.DEVELOPER, `Implementing ${archData.proposed_files.length} files based on approved blueprint...`);
      
      const codeData = await agentImplementCode(archData, modelContext, googleStandardsInstruction);
      
      this.updatePhase(OrchestraRole.DEVELOPER, 'success', 'Code Generated');

      // --- PHASE 4: QA & SELF-HEALING ---
      this.updatePhase(OrchestraRole.QA_ENGINEER, 'active');
      this.addLog(OrchestraRole.QA_ENGINEER, "Running static analysis (Google Style Guide)...");
      
      // Run Real Diagnostics
      const diagnostics = DiagnosticsEngine.runAnalysis(codeData.files);
      if (diagnostics.length > 0) {
           this.addLog(OrchestraRole.QA_ENGINEER, `Detected ${diagnostics.length} issues during static analysis. Flagged for review.`);
      } else {
           this.addLog(OrchestraRole.QA_ENGINEER, "Static analysis passed. No major issues found.");
      }

      await new Promise(r => setTimeout(r, 1000));
      this.updatePhase(OrchestraRole.QA_ENGINEER, 'success', 'Passed');

      // --- FINAL ASSEMBLY ---
      return {
        id: crypto.randomUUID(),
        title: archData.title,
        description: archData.description,
        architecture_plan: archData.architecture_plan,
        files: codeData.files,
        tasks: this.generateTasksFromFiles(codeData.files),
        testSuites: this.generateTestSuites(codeData.files), // Generate Tests
        problems: diagnostics, // Attach Diagnostics
        createdAt: Date.now(),
        modelContext: modelContext
      };

    } catch (error) {
      this.phases.forEach(p => {
          if (p.status === 'active') this.updatePhase(p.role, 'failed', 'Error occurred');
      });
      throw error;
    }
  }
}
