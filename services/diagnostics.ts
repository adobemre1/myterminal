
import { DiagnosticProblem, ProjectFile } from "../types";

/**
 * A simulation of a Static Analysis Engine (Linter).
 * In a real app, this would use AST parsers or Language Servers.
 * Here, we use regex patterns to detect "bad practices" or common errors to demonstrate the capability.
 */
export class DiagnosticsEngine {
    
    public static runAnalysis(files: ProjectFile[]): DiagnosticProblem[] {
        const problems: DiagnosticProblem[] = [];

        files.forEach(file => {
            const lines = file.content.split('\n');
            lines.forEach((line, index) => {
                const lineNum = index + 1;

                // 1. Check for TODOs
                if (line.includes('TODO') || line.includes('FIXME')) {
                    problems.push({
                        id: crypto.randomUUID(),
                        file: file.name,
                        line: lineNum,
                        severity: 'info',
                        message: 'Pending task identified in comments.',
                        code: 'TODO-001'
                    });
                }

                // 2. Check for Console Logs (Frontend warning)
                if ((file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.tsx')) && line.includes('console.log')) {
                    problems.push({
                        id: crypto.randomUUID(),
                        file: file.name,
                        line: lineNum,
                        severity: 'warning',
                        message: 'Console log statement detected in production code.',
                        code: 'NO-LOG'
                    });
                }

                // 3. Check for Pass (Python warning)
                if (file.name.endsWith('.py') && line.trim() === 'pass') {
                     problems.push({
                        id: crypto.randomUUID(),
                        file: file.name,
                        line: lineNum,
                        severity: 'warning',
                        message: 'Empty block detected (pass). Ensure implementation is complete.',
                        code: 'PY-PASS'
                    });
                }

                // 4. Critical: Empty Catch Blocks (Security)
                if (line.includes('catch') && line.includes('{}')) {
                     problems.push({
                        id: crypto.randomUUID(),
                        file: file.name,
                        line: lineNum,
                        severity: 'error',
                        message: 'Empty catch block swallows errors silently.',
                        code: 'SEC-001'
                    });
                }
                
                // 5. Check for Hardcoded Secrets (Simulation)
                if ((line.includes('api_key') || line.includes('token')) && line.includes('= "') && !line.includes('process.env') && !line.includes('os.environ')) {
                     problems.push({
                        id: crypto.randomUUID(),
                        file: file.name,
                        line: lineNum,
                        severity: 'error',
                        message: 'Potential hardcoded secret detected. Use environment variables.',
                        code: 'SEC-002'
                    });
                }
            });

            // File-level checks
            if (file.content.trim().length === 0) {
                 problems.push({
                    id: crypto.randomUUID(),
                    file: file.name,
                    line: 1,
                    severity: 'error',
                    message: 'File is empty.',
                    code: 'EMPTY-FILE'
                });
            }
        });

        return problems;
    }
}
