
import React from 'react';
import { GeneratedProject, LibraryDefinition, CloudProvider, GhostCursor, SystemEvolution, AgentMessage, AgentStatus, OrchestraPhase, SmartActionType } from '../types';
import { AdminDashboard } from '../modules/admin/AdminDashboard';
import { SettingsManager } from '../modules/settings/SettingsManager';
import { ExtensionMarketplace } from '../modules/extensions/ExtensionMarketplace';
import { GitHubSync } from '../modules/integrations/GitHubSync';
import { GoogleCloudPanel } from '../modules/integrations/GoogleCloudPanel';
import { LibraryHub } from './LibraryHub';
import { LanguageDetail } from './LanguageDetail';
import { AcademyViewer } from '../modules/academy/AcademyViewer';
import { PyPiExplorer } from '../modules/python/PyPiExplorer';
import { NpmExplorer } from '../modules/javascript/NpmExplorer';
import { UniversalRegistry } from '../modules/universal/UniversalRegistry';
import { CloudPlatformHub } from '../modules/cloud/CloudPlatformHub';
import { SystemRewriter } from '../modules/architect/SystemRewriter';
import { NeuralGraph } from './NeuralGraph';
import { TaskManager } from '../modules/tasks/TaskManager';
import { DeployManager } from '../modules/deployment/DeployManager';
import { WebPreview } from '../modules/preview/WebPreview';
import { TestRunner } from '../modules/testing/TestRunner';
import { CodeEditor } from './CodeEditor';
import { SentinelConsole } from './SentinelConsole';
import { Terminal } from './Terminal';
import { OrchestraStatus } from './OrchestraStatus';
import { Button } from './Button';
import { FileTree } from './FileTree';
import { AuthService } from '../services/auth';
import { VoiceInput } from './VoiceInput'; 

interface ViewRouterProps {
    activeView: string;
    setActiveView: (view: any) => void;
    currentProject: GeneratedProject | null;
    setCurrentProject: (p: GeneratedProject) => void;
    history: GeneratedProject[];
    setHistory: (h: GeneratedProject[]) => void;
    selectedLibrary: LibraryDefinition | null;
    setSelectedLibrary: (l: LibraryDefinition) => void;
    authService: AuthService;
    systemEvolution: SystemEvolution;
    isConstructing: boolean;
    activeFileIndex: number;
    setActiveFileIndex: (i: number) => void;
    ghostCursors: GhostCursor[];
    terminalLogs: string[];
    setTerminalLogs: React.Dispatch<React.SetStateAction<string[]>>;
    isSetupRunning: boolean;
    setIsSetupRunning: (b: boolean) => void;
    showAgent: boolean;
    setShowAgent: (b: boolean) => void;
    agentStatus: AgentStatus;
    orchestraPhases: OrchestraPhase[];
    agentMessages: AgentMessage[];
    promptInput: string;
    setPromptInput: React.Dispatch<React.SetStateAction<string>>;
    handleStartWorkflow: () => void;
    handleImageDrop: (b64: string) => void;
    handleSkipConstruction: () => void;
    
    // Handlers
    handleInitializeProject: (lib: LibraryDefinition) => void;
    handleAutoEvolve: (q: string) => void;
    handleInstallPythonPackage: (p: any) => void;
    handleInstallNpmPackage: (p: any) => void;
    handleInstallUniversalPackage: (p: any) => void;
    handleCloudIntegration: (p: CloudProvider) => void;
    constructProjectVisually: (p: GeneratedProject) => void;
    handleRunSetup: () => void;
    handleSmartAction: (action: SmartActionType, selection: string, language: string) => Promise<string | undefined>;
}

export const ViewRouter: React.FC<ViewRouterProps> = (props) => {
    const { 
        activeView, setActiveView, currentProject, setCurrentProject, authService, 
        systemEvolution, isConstructing, activeFileIndex, setActiveFileIndex, 
        ghostCursors, terminalLogs, setTerminalLogs, isSetupRunning, handleRunSetup,
        showAgent, setShowAgent, agentStatus, orchestraPhases, agentMessages,
        promptInput, setPromptInput, handleStartWorkflow, handleImageDrop, handleSkipConstruction
    } = props;

    const activeFile = currentProject?.files[activeFileIndex];
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [agentMessages]);

    // --- EXTENSION & MODULE ROUTING ---

    if (activeView === 'admin') return <AdminDashboard authService={authService} evolution={systemEvolution} onClose={() => setActiveView('hub')} />;
    if (activeView === 'settings') return <SettingsManager onClose={() => setActiveView('workspace')} />;
    if (activeView === 'marketplace') return <ExtensionMarketplace onClose={() => setActiveView('hub')} />;
    
    if (activeView === 'github') return currentProject ? <GitHubSync files={currentProject.files} projectTitle={currentProject.title} /> : <div className="p-8 text-gray-500">Open a project first.</div>;
    if (activeView === 'gcp') return currentProject ? <GoogleCloudPanel projectTitle={currentProject.title} /> : <div className="p-8 text-gray-500">Open a project first.</div>;
    if (activeView === 'hub') return <LibraryHub onSelectLibrary={(lib) => { props.setSelectedLibrary(lib); setActiveView('library-detail'); }} onAutoEvolve={props.handleAutoEvolve} isEvolving={agentStatus === AgentStatus.EVOLVING} />;
    if (activeView === 'library-detail' && props.selectedLibrary) return <LanguageDetail library={props.selectedLibrary} onBack={() => setActiveView('hub')} onCreateProject={props.handleInitializeProject} />;
    if (activeView === 'academy') return <AcademyViewer onTryCode={(code) => { /* Reuse logic */ }} />;
    if (activeView === 'pypi') return <PyPiExplorer onInstall={props.handleInstallPythonPackage} />;
    if (activeView === 'npm') return <NpmExplorer onInstall={props.handleInstallNpmPackage} />;
    if (activeView === 'universal') return <UniversalRegistry onInstall={props.handleInstallUniversalPackage} />;
    if (activeView === 'cloud') return <CloudPlatformHub onIntegrate={props.handleCloudIntegration} />;
    if (activeView === 'architect') return <SystemRewriter onProjectCreated={(p) => { props.constructProjectVisually(p); setActiveView('workspace'); }} />;
    
    if (activeView === 'neural') {
        return currentProject ? (
            <div className="w-full h-full flex flex-col bg-[#0d1117]">
                <div className="flex-1 overflow-hidden relative">
                    <NeuralGraph files={currentProject.files} />
                </div>
            </div>
        ) : ( <div className="flex items-center justify-center h-full text-gray-500">No project selected</div> );
    }

    if (activeView === 'tasks') return currentProject ? <TaskManager tasks={currentProject.tasks} /> : <div className="flex items-center justify-center h-full text-gray-500">No project selected</div>;
    if (activeView === 'deploy') return currentProject ? <DeployManager projectTitle={currentProject.title} onDeploy={(url) => setTerminalLogs(prev => [...prev, `[DEPLOY] Deployed to ${url}`])} /> : <div className="flex items-center justify-center h-full text-gray-500">No project selected</div>;
    if (activeView === 'preview') return currentProject ? <WebPreview files={currentProject.files} /> : <div className="flex items-center justify-center h-full text-gray-500">No project selected</div>;
    if (activeView === 'testing') return currentProject ? <TestRunner testSuites={currentProject.testSuites || []} onRunTests={() => setTerminalLogs(prev => [...prev, '> running_tests_full_suite'])} /> : <div className="flex items-center justify-center h-full text-gray-500">No project selected</div>;

    // --- DEFAULT WORKSPACE VIEW ---
    return (
        <div className="flex h-full w-full">
            {/* Left Rail (Explorer/Agent) */}
            <div className={`
                bg-[#0d1117] border-r border-gray-800 flex flex-col transition-all duration-300
                md:relative md:translate-x-0 w-80 shrink-0
                ${activeView === 'workspace' || activeView === 'preview' ? 'flex' : 'hidden md:flex'}
            `}>
                {activeView !== 'workspace' && activeView !== 'preview' ? (
                    <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#0d1117]">
                            <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Navigation</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <SentinelConsole evolution={systemEvolution} />
                        </div>
                    </div>
                ) : showAgent && activeView === 'workspace' ? (
                    <div className="flex flex-col h-full bg-[#161b22]">
                        <div className="p-3 border-b border-gray-800 font-bold text-xs uppercase tracking-wider text-gray-400 flex justify-between items-center">
                            <span>Orchestra Engine</span>
                            <span className={`w-2 h-2 rounded-full ${agentStatus === AgentStatus.IDLE ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                        </div>
                        {agentStatus === AgentStatus.ORCHESTRATING && (<OrchestraStatus phases={orchestraPhases} />)}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {agentMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[95%] rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none shadow-sm' : 'bg-[#21262d] border border-gray-700 text-gray-200 rounded-bl-none shadow-sm'}`}>
                                {msg.orchestraPhase && <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1 flex items-center gap-1"><span>●</span> {msg.orchestraPhase}</div>}
                                {msg.text}
                            </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        </div>
                        <div className="p-3 border-t border-gray-800 bg-[#0d1117]">
                            <div className="relative">
                                <textarea 
                                    value={promptInput}
                                    onChange={(e) => setPromptInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleStartWorkflow();
                                        }
                                    }}
                                    placeholder="Describe features or drop an image..."
                                    disabled={agentStatus === AgentStatus.ORCHESTRATING}
                                    className="w-full bg-[#21262d] border border-gray-700 rounded-md p-2 pr-10 text-sm text-white focus:outline-none focus:border-cyan-500 min-h-[80px] resize-none placeholder-gray-600 disabled:opacity-50"
                                />
                                <div className="absolute bottom-2 right-2">
                                    <VoiceInput onTranscript={(txt) => setPromptInput(prev => prev + ' ' + txt)} disabled={agentStatus === AgentStatus.ORCHESTRATING} />
                                </div>
                            </div>
                            <Button 
                                className="w-full mt-2 text-xs py-2 font-semibold tracking-wide" 
                                onClick={handleStartWorkflow}
                                disabled={agentStatus === AgentStatus.ORCHESTRATING}
                                isLoading={agentStatus === AgentStatus.ORCHESTRATING}
                                variant="primary"
                            >
                                Send to Neural Link
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#0d1117]">
                            <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Explorer</span>
                            {currentProject && <span className="text-[10px] bg-cyan-900/50 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-900 truncate max-w-[120px]">{currentProject.title}</span>}
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            {currentProject && currentProject.files.length > 0 ? (
                                <FileTree 
                                    files={currentProject.files} 
                                    activeFileIndex={activeFileIndex}
                                    onSelectFile={(idx) => { setActiveFileIndex(idx); setActiveView('workspace'); }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-4 text-center">
                                    <span className="text-4xl mb-2 opacity-50">📂</span>
                                    <span className="text-xs">Workspace Empty</span>
                                </div>
                            )}
                        </div>
                        <SentinelConsole evolution={systemEvolution} />
                    </div>
                )}
            </div>

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
                <div className="flex-1 flex flex-col min-h-0 relative">
                    <div className="flex items-center bg-[#0d1117] border-b border-gray-800 h-9 overflow-x-auto custom-scrollbar justify-between pr-2">
                        <div className="flex h-full">
                            {activeFile ? (
                                <div className="h-full px-4 text-sm text-gray-200 bg-[#1e293b] border-t-2 border-cyan-500 border-r border-gray-800 flex items-center gap-2 min-w-fit">
                                    <span className="opacity-80">📄</span>
                                    <span>{activeFile.name}</span>
                                    {isConstructing && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>}
                                </div>
                            ) : (
                                <div className="px-4 text-xs text-gray-600 flex items-center h-full italic">No file selected</div>
                            )}
                        </div>
                        {isConstructing && (
                            <button onClick={handleSkipConstruction} className="text-[10px] bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700 hover:bg-cyan-800">
                                ⚡ Skip Animation
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 relative overflow-hidden">
                        {activeFile ? (
                            <CodeEditor 
                                value={activeFile.content}
                                language={activeFile.language}
                                onChange={(val) => {
                                    if (!currentProject) return;
                                    const newFiles = [...currentProject.files];
                                    newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content: val };
                                    const updated = { ...currentProject, files: newFiles };
                                    setCurrentProject(updated);
                                }}
                                onSmartAction={async (type, selection) => {
                                    const newCode = await props.handleSmartAction(type, selection, activeFile.language);
                                    if (newCode && currentProject) {
                                        const fullText = activeFile.content;
                                        const updatedText = fullText.replace(selection, newCode);
                                        const newFiles = [...currentProject.files];
                                        newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content: updatedText };
                                        setCurrentProject({ ...currentProject, files: newFiles });
                                    }
                                }}
                                readOnly={isConstructing}
                                onImageDrop={handleImageDrop}
                                ghostCursors={ghostCursors}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-700 select-none">
                                <div className="w-16 h-16 mb-4 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center text-2xl font-bold opacity-30">
                                    eCy
                                </div>
                                <p className="text-sm font-medium">eCylogy Studio</p>
                                <p className="text-xs mt-2 max-w-xs text-center opacity-60">Global Standard Environment<br/>Monorepo Ready</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-64 border-t border-gray-800 flex flex-col bg-[#0d1117]">
                    <Terminal 
                        logs={terminalLogs} 
                        onRunSetup={handleRunSetup}
                        isRunning={isSetupRunning}
                        problems={currentProject?.problems || []} 
                    />
                </div>
            </div>
        </div>
    );
}
