
import { useState, useRef, useEffect } from 'react';
import { AgentMessage, AgentStatus, OrchestraPhase, GeneratedProject, GhostCursor, OrchestraRole, LibraryDefinition, SmartActionType } from '../types';
import { OrchestratorService } from '../services/orchestrator';
import { SentinelService } from '../services/sentinel';
import { agentVisionToCode, agentSmartRefactor, agentExplainCode } from '../services/gemini';

export const useAgent = (
    sentinel: SentinelService,
    onProjectGenerated: (project: GeneratedProject) => void,
    addTerminalLog: (log: string) => void
) => {
    const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
    const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
    const [orchestraPhases, setOrchestraPhases] = useState<OrchestraPhase[]>([]);
    const [ghostCursors, setGhostCursors] = useState<GhostCursor[]>([]);
    
    // Initial Welcome Message
    useEffect(() => {
        const savedChat = localStorage.getItem('omnicode-chat-history');
        if (savedChat) {
            try {
                const parsed = JSON.parse(savedChat);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setAgentMessages(parsed);
                    return;
                }
            } catch (e) {}
        }
        
        setAgentMessages([{
            id: 'init',
            role: 'system',
            text: 'eCylogy v7.0.0 Neural Nexus Ready.\nMultimodal capabilities active. Drop images to code.\nRight-click code to use Smart Refactoring.',
            timestamp: Date.now(),
            status: AgentStatus.IDLE
        }]);
    }, []);

    // Persistence
    useEffect(() => {
        if (agentMessages.length > 0) {
            localStorage.setItem('omnicode-chat-history', JSON.stringify(agentMessages));
        }
    }, [agentMessages]);

    const addMessage = (text: string, role: 'user' | 'agent' | 'system', status: AgentStatus = AgentStatus.IDLE, orchestraPhase?: OrchestraRole) => {
        setAgentMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role,
            text,
            timestamp: Date.now(),
            status,
            orchestraPhase
        }]);
    };

    const handleVisionInput = async (base64: string) => {
        setAgentStatus(AgentStatus.ANALYZING_IMAGE);
        addMessage("Image dropped. Analyzing UI components via Neural Nexus...", 'system', AgentStatus.ANALYZING_IMAGE);
        try {
            const project = await agentVisionToCode(base64);
            onProjectGenerated(project);
            addMessage("Code generated from Vision input.", 'agent', AgentStatus.COMPLETED);
            setAgentStatus(AgentStatus.IDLE);
        } catch (e) {
            console.error(e);
            addMessage("Vision processing failed. Ensure your API key supports Gemini Vision.", 'system', AgentStatus.ERROR);
            setAgentStatus(AgentStatus.ERROR);
        }
    };

    const handleSmartAction = async (action: SmartActionType, selection: string, language: string): Promise<string | undefined> => {
        if (!selection.trim()) return;
        
        addTerminalLog(`> agent_action --type=${action} --len=${selection.length}`);
        
        let prompt = "";
        switch (action) {
            case 'refactor': prompt = "Refactor this code to be cleaner, more efficient, and follow standard style guides."; break;
            case 'fix': prompt = "Identify and fix any potential bugs, errors, or security vulnerabilities in this snippet."; break;
            case 'document': prompt = "Add JSDoc/Docstring documentation comments to this code."; break;
        }

        if (action === 'explain') {
             setAgentStatus(AgentStatus.REFACTORING); // Re-use refactoring status for busy state
             addMessage(`**Analyzing selection...**\n\`\`\`${language}\n${selection.substring(0, 80)}...\n\`\`\``, 'user');
             try {
                 const explanation = await agentExplainCode(selection);
                 addMessage(explanation, 'agent', AgentStatus.COMPLETED);
             } catch (e) {
                 addMessage("Failed to explain code.", 'system', AgentStatus.ERROR);
             }
             setAgentStatus(AgentStatus.IDLE);
             return;
        }

        setAgentStatus(AgentStatus.REFACTORING);
        try {
            addMessage(`Applying Smart Action: ${action.toUpperCase()}`, 'system', AgentStatus.REFACTORING);
            const newCode = await agentSmartRefactor(selection, prompt, language);
            
            addMessage("Refactoring complete.", 'agent', AgentStatus.COMPLETED);
            setAgentStatus(AgentStatus.IDLE);
            return newCode;
        } catch (e) {
            console.error(e);
            addMessage("Refactoring failed.", 'system', AgentStatus.ERROR);
            setAgentStatus(AgentStatus.ERROR);
        }
    };

    const startOrchestration = async (promptInput: string, library?: LibraryDefinition) => {
        if (!promptInput.trim()) return;
        if (!process.env.API_KEY) {
            addMessage("System Error: API_KEY is missing.", 'system', AgentStatus.ERROR);
            return;
        }
        
        addMessage(promptInput, 'user');
        setAgentStatus(AgentStatus.ORCHESTRATING);
        addTerminalLog("> Starting Orchestra Engine...");
        addTerminalLog("> assigning_roles");

        const startTime = Date.now();

        try {
            const orchestrator = new OrchestratorService(
                (updatedPhase) => {
                    setOrchestraPhases(prev => {
                        const idx = prev.findIndex(p => p.id === updatedPhase.id);
                        if (idx === -1) return [...prev, updatedPhase];
                        const newArr = [...prev];
                        newArr[idx] = updatedPhase;
                        return newArr;
                    });

                    // Neural Cursors Simulation
                    if (updatedPhase.status === 'active') {
                        const color = updatedPhase.role === 'Chief Architect' ? '#3b82f6' :
                                      updatedPhase.role === 'Senior Developer' ? '#10b981' : '#f59e0b';
                        setGhostCursors([{
                            id: updatedPhase.role,
                            label: updatedPhase.role,
                            color: color,
                            x: Math.floor(Math.random() * 10),
                            y: Math.floor(Math.random() * 20),
                            isActive: true
                        }]);
                    } else {
                        setGhostCursors([]);
                    }
                },
                (msg) => setAgentMessages(prev => [...prev, msg])
            );

            const projectData = await orchestrator.startOrchestration(
                promptInput,
                library?.name || "General Project",
                library?.specializedPrompt || ""
            );

            setAgentStatus(AgentStatus.CONSTRUCTING);
            onProjectGenerated(projectData); // Hand off to App for visual construction

            const endTime = Date.now();
            sentinel.calculateMetrics(projectData, endTime - startTime);

            setAgentStatus(AgentStatus.COMPLETED);
            addMessage(`Project "${projectData.title}" successfully orchestrated and built.`, 'system', AgentStatus.COMPLETED);

        } catch (error) {
            console.error(error);
            setAgentStatus(AgentStatus.ERROR);
            addMessage("Critical Orchestration Failure.", 'system', AgentStatus.ERROR);
            addTerminalLog(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
        }
    };

    return {
        agentMessages,
        agentStatus,
        orchestraPhases,
        ghostCursors,
        setGhostCursors,
        setAgentStatus,
        addMessage,
        handleVisionInput,
        handleSmartAction,
        startOrchestration
    };
};
