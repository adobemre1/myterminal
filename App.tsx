
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { TitleBar } from './components/TitleBar'; 
import { ViewRouter } from './components/ViewRouter';
import { CommandPalette } from './components/CommandPalette'; // New

// Auth & Admin
import { AuthService } from './services/auth';
import { AuthScreen } from './modules/auth/AuthScreen';

// Database & Services
import { DatabaseService } from './services/database';
import { SentinelService } from './services/sentinel';
import { useAgent } from './hooks/useAgent';

import { GeneratedProject, AgentStatus, ProjectFile, LibraryDefinition, CommandAction } from './types';

const sentinel = new SentinelService();
const authService = new AuthService();
const dbService = new DatabaseService();

const App: React.FC = () => {
  // --- Auth & System State ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!authService.getUser());
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isDbReady, setIsDbReady] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // --- Project State ---
  const [history, setHistory] = useState<GeneratedProject[]>([]);
  const [currentProject, setCurrentProject] = useState<GeneratedProject | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  
  // --- View State ---
  const [activeView, setActiveView] = useState('hub');
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryDefinition | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAgent, setShowAgent] = useState<boolean>(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false); // New

  // --- Construction State ---
  const [isConstructing, setIsConstructing] = useState(false);
  const skipConstructionRef = useRef(false);
  const [isSetupRunning, setIsSetupRunning] = useState<boolean>(false);
  const [systemEvolution, setSystemEvolution] = useState(sentinel.getEvolutionState());
  const [promptInput, setPromptInput] = useState<string>('');

  // --- Logic Helpers ---
  const addLog = (l: string) => setTerminalLogs(prev => [...prev, l]);

  const constructProjectVisually = async (fullProject: GeneratedProject) => {
    skipConstructionRef.current = false;
    setIsConstructing(true);
    const visualProject = { ...fullProject, files: [] };
    setCurrentProject(visualProject);
    addLog(`> mkdir "${fullProject.title}"`);
    addLog(`> cd "${fullProject.title}"`);
    addLog(`> git init`);

    const files = fullProject.files;
    const constructedFiles: ProjectFile[] = [];
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        addLog(`> touch ${file.name}`);
        constructedFiles.push({ ...file, content: '' });
        setCurrentProject({ ...fullProject, files: [...constructedFiles] });
        setActiveFileIndex(i);

        if (skipConstructionRef.current) {
             constructedFiles[i].content = file.content;
             setCurrentProject({ ...fullProject, files: [...constructedFiles] });
             continue; 
        }

        const chunkSize = 150;
        for (let c = 0; c < file.content.length; c += chunkSize) {
            if (skipConstructionRef.current) break;
            constructedFiles[i].content = file.content.substring(0, c + chunkSize);
            setCurrentProject({ ...fullProject, files: [...constructedFiles] });
            
            agent.setGhostCursors([{
                id: 'constructor',
                label: 'Auto-Constructor',
                color: '#ec4899',
                x: i,
                y: c / 10,
                isActive: true
            }]);
            
            await delay(5); 
        }
        
        constructedFiles[i].content = file.content;
        setCurrentProject({ ...fullProject, files: [...constructedFiles] });
        if(!skipConstructionRef.current) await delay(50);
    }
    
    agent.setGhostCursors([]);
    const finalProject = { ...fullProject, files: constructedFiles };
    setCurrentProject(finalProject);
    await dbService.saveProject(finalProject);
    const allProjects = await dbService.getAllProjects();
    setHistory(allProjects);
    addLog(`> echo "Project construction complete."`);
    setIsConstructing(false);
  };

  const agent = useAgent(sentinel, constructProjectVisually, addLog);

  // --- Initialization ---
  useEffect(() => {
    const bootSequence = async () => {
        try {
            await dbService.init();
            const projects = await dbService.getAllProjects();
            setHistory(projects);
            setIsDbReady(true);
            addLog("eCylogyDB Initialized.");
        } catch (e) {
            console.error("Critical DB Failure", e);
        }
    };
    bootSequence();
  }, []);

  useEffect(() => {
      if (currentProject && isDbReady) {
          dbService.saveProject(currentProject).catch(e => console.error("Auto-save failed", e));
          setHistory(prev => prev.map(p => p.id === currentProject.id ? currentProject : p));
      }
  }, [currentProject, isDbReady]);

  // --- HANDLERS ---
  const handleLoginSuccess = () => { setIsAuthenticated(true); setShowLanding(true); };
  const handleLogout = () => { authService.logout(); setIsAuthenticated(false); };

  const ensureActiveProject = (): GeneratedProject => {
      if (currentProject) return currentProject;
      const blankProject: GeneratedProject = {
          id: crypto.randomUUID(),
          title: "Untitled Playground",
          description: "Auto-created project.",
          architecture_plan: "Dynamic Sandbox",
          files: [{ name: "README.md", language: "markdown", content: "# Untitled Playground" }],
          tasks: [], testSuites: [], problems: [], createdAt: Date.now(), modelContext: "Universal Sandbox"
      };
      setCurrentProject(blankProject);
      dbService.saveProject(blankProject).then(() => setHistory(prev => [blankProject, ...prev]));
      return blankProject;
  };

  const handleInitializeProject = (lib: LibraryDefinition) => {
    setActiveView('workspace');
    setShowAgent(true);
    setIsMobileMenuOpen(false);
    agent.addMessage(`**ModelFile Loaded: ${lib.name}**\n${lib.description}`, 'system');
    addLog(`> loading_modelfile "${lib.id}"`);
  };

  const installPackageGeneric = (name: string, version: string, configFileName: string, appendFormat: (current: string) => string) => {
      const activeProj = ensureActiveProject();
      addLog(`> install ${name}@${version}`);
      
      const newFiles = [...activeProj.files];
      const idx = newFiles.findIndex(f => f.name === configFileName);
      
      if (idx !== -1) {
          newFiles[idx].content = appendFormat(newFiles[idx].content);
      } else {
          let lang = 'text';
          if (configFileName.endsWith('json')) lang = 'json';
          if (configFileName.endsWith('toml')) lang = 'yaml';
          newFiles.push({ name: configFileName, language: lang, content: appendFormat('') });
      }

      const updatedProject = { ...activeProj, files: newFiles };
      setCurrentProject(updatedProject);
      dbService.saveProject(updatedProject);
      setActiveView('workspace'); 
  };

  const handleAutoEvolve = async (query: string) => {
     agent.setAgentStatus(AgentStatus.EVOLVING);
     try {
        const result = await sentinel.acquireKnowledge(query);
        setSystemEvolution({ ...sentinel.getEvolutionState() });
        handleInitializeProject(result.lib);
        agent.setAgentStatus(AgentStatus.IDLE);
        addLog(`[SENTINEL] Upgraded to v${sentinel.getEvolutionState().version}`);
     } catch (e) {
         agent.setAgentStatus(AgentStatus.ERROR);
         alert("Evolution failed: " + e);
     }
  };

  const handleRunSetup = async () => {
    if (!currentProject || isSetupRunning) return;
    setIsSetupRunning(true);
    addLog(`> ./setup_env.sh --verbose`);
    await new Promise(r => setTimeout(r, 1500));
    addLog(`[SUCCESS] Environment ready.`);
    setIsSetupRunning(false);
  };

  const handleDownloadProject = () => {
      if (!currentProject) { alert("Open a project to export."); return; }
      const safeTitle = currentProject.title.replace(/\s+/g, '_').toLowerCase();
      let shScript = `#!/bin/bash\n# Generated by eCylogy\nmkdir -p "${safeTitle}"\ncd "${safeTitle}"\n`;
      currentProject.files.forEach(f => {
          shScript += `cat << 'EOF' > "${f.name}"\n${f.content.replace(/'/g, "'\\''")}\nEOF\n`;
      });
      const blob = new Blob([shScript], { type: 'text/x-sh' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${safeTitle}_install.sh`; a.click();
      addLog(`[EXPORT] Downloaded installer script.`);
  };

  // --- UNIFIED COMMAND DISPATCHER (The Brain) ---
  const executeCommand = (actionId: string) => {
      console.log("Executing:", actionId);
      switch(actionId) {
          // File
          case 'file.new': case 'new': setActiveView('hub'); break;
          case 'file.save': case 'save': 
              if(currentProject) dbService.saveProject(currentProject); 
              addLog('> Project saved to database.'); 
              break;
          case 'file.export': handleDownloadProject(); break;
          case 'file.settings': case 'settings': setActiveView('settings'); break;
          case 'file.exit': handleLogout(); break;
          
          // View / Navigation
          case 'view.explorer': case 'explorer': setActiveView('workspace'); break;
          case 'view.terminal': case 'terminal': setActiveView('workspace'); break; // Focus terminal logic todo
          case 'view.extensions': case 'extensions': setActiveView('marketplace'); break;
          case 'view.neural': setActiveView('neural'); break;
          case 'view.output': setActiveView('workspace'); break;
          
          // Run
          case 'run.start': case 'run': handleRunSetup(); break;
          
          // Help
          case 'help.academy': case 'docs': setActiveView('academy'); break;
          case 'help.about': alert(`eCylogy v7.0.0\nCognitive Mesh Active\nSentinel v${systemEvolution.version}`); break;
          
          // Editor
          case 'theme': addLog('> Theme switched (Simulated)'); break;
          
          default: addLog(`> Command '${actionId}' not implemented yet.`);
      }
  };

  // --- COMMAND PALETTE CONFIG ---
  const commandActions: CommandAction[] = [
    { id: 'new', title: 'New Project', section: 'System', shortcut: 'Ctrl+N', handler: () => executeCommand('new') },
    { id: 'save', title: 'Save Project', section: 'System', shortcut: 'Ctrl+S', handler: () => executeCommand('save') },
    { id: 'explorer', title: 'Show Explorer', section: 'Navigation', shortcut: 'Ctrl+Shift+E', handler: () => executeCommand('explorer') },
    { id: 'extensions', title: 'Extensions Marketplace', section: 'Navigation', shortcut: 'Ctrl+Shift+X', handler: () => executeCommand('extensions') },
    { id: 'settings', title: 'Open Settings', section: 'System', shortcut: 'Ctrl+,', handler: () => executeCommand('settings') },
    { id: 'run', title: 'Run Setup', section: 'System', shortcut: 'Ctrl+F5', handler: () => executeCommand('run') },
    { id: 'docs', title: 'Open Academy', section: 'AI', handler: () => executeCommand('docs') },
    { id: 'theme', title: 'Toggle Theme', section: 'Editor', handler: () => executeCommand('theme') },
  ];

  // --- GLOBAL KEYS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsMobileMenuOpen(prev => !prev);
      }
      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        executeCommand('save');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject]);

  // --- RENDER ---

  if (!isAuthenticated) return <AuthScreen authService={authService} onLoginSuccess={handleLoginSuccess} />;
  if (showLanding) return <LandingPage onLaunch={() => setShowLanding(false)} evolution={systemEvolution} />;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-gray-300 font-sans overflow-hidden border border-gray-900 relative">
      
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        actions={commandActions} 
      />

      <TitleBar 
         title={currentProject ? `${currentProject.title} - eCylogy` : "eCylogy"} 
         onAction={executeCommand}
      />
      
      <div className="flex-1 flex min-h-0 relative">
        <button className="md:hidden absolute top-2 left-2 z-50 p-2 bg-gray-800 rounded border border-gray-700 text-white" onClick={() => setIsMobileMenuOpen(true)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        <Sidebar 
          activeView={activeView as any}
          history={history} 
          onSelectProject={(p) => { setCurrentProject(p); setActiveFileIndex(0); setActiveView('workspace'); }} 
          onClearHistory={() => { dbService.clearAllProjects(); setHistory([]); setCurrentProject(null); }}
          onGoToHub={() => setActiveView('hub')}
          onNavChange={(v) => setActiveView(v)}
          selectedProjectId={currentProject?.id}
          user={authService.getUser()}
          onLogout={handleLogout}
          isOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Quick Rail */}
        <div className="hidden md:flex w-12 bg-[#0d1117] border-r border-gray-800 flex-col items-center py-4 gap-4 z-20">
            <div onClick={() => executeCommand('hub')} className={`cursor-pointer p-2 rounded-md ${activeView === 'hub' ? 'text-cyan-400 bg-gray-800' : 'text-gray-500 hover:text-white'}`} title="Hub"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>
            <div onClick={() => { setActiveView('workspace'); setShowAgent(!showAgent); }} className={`cursor-pointer p-2 rounded-md ${activeView === 'workspace' && showAgent ? 'text-cyan-400 bg-gray-800' : 'text-gray-500 hover:text-white'}`} title="Chat"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div>
            <div onClick={() => executeCommand('extensions')} className={`cursor-pointer p-2 rounded-md ${activeView === 'marketplace' ? 'text-cyan-400 bg-gray-800' : 'text-gray-500 hover:text-white'}`} title="Extensions"><span className="text-lg">🧩</span></div>
            <div className="w-6 h-px bg-gray-800 my-1"></div>
            <div onClick={() => executeCommand('settings')} className={`cursor-pointer p-2 rounded-md ${activeView === 'settings' ? 'text-cyan-400 bg-gray-800' : 'text-gray-500 hover:text-white'}`} title="Settings"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
            <ViewRouter 
                activeView={activeView} setActiveView={setActiveView}
                currentProject={currentProject} setCurrentProject={setCurrentProject}
                history={history} setHistory={setHistory}
                selectedLibrary={selectedLibrary} setSelectedLibrary={setSelectedLibrary}
                authService={authService} systemEvolution={systemEvolution}
                isConstructing={isConstructing}
                activeFileIndex={activeFileIndex} setActiveFileIndex={setActiveFileIndex}
                ghostCursors={agent.ghostCursors}
                terminalLogs={terminalLogs} setTerminalLogs={setTerminalLogs}
                isSetupRunning={isSetupRunning} setIsSetupRunning={setIsSetupRunning}
                showAgent={showAgent} setShowAgent={setShowAgent}
                agentStatus={agent.agentStatus} orchestraPhases={agent.orchestraPhases}
                agentMessages={agent.agentMessages}
                promptInput={promptInput} setPromptInput={setPromptInput}
                handleStartWorkflow={() => agent.startOrchestration(promptInput, selectedLibrary || undefined)}
                handleImageDrop={agent.handleVisionInput}
                handleSkipConstruction={() => { skipConstructionRef.current = true; }}
                handleInitializeProject={handleInitializeProject}
                handleAutoEvolve={handleAutoEvolve}
                handleInstallPythonPackage={(p) => installPackageGeneric(p.name, p.version, 'requirements.txt', c => `${c}\n${p.name}==${p.version}`)}
                handleInstallNpmPackage={(p) => installPackageGeneric(p.name, p.version, 'package.json', c => JSON.stringify({ ...JSON.parse(c||'{}'), dependencies: {...JSON.parse(c||'{}').dependencies, [p.name]: `^${p.version}`} }, null, 2))}
                handleInstallUniversalPackage={(p) => installPackageGeneric(p.name, p.version, 'README.md', c => `${c}\n- ${p.name}`)}
                handleCloudIntegration={(p) => {
                    const activeProj = ensureActiveProject();
                    addLog(`> integrate ${p.id}`);
                    const newFiles = [...activeProj.files, { name: p.configFile, language: 'yaml', content: p.configTemplate }];
                    const updated = { ...activeProj, files: newFiles };
                    setCurrentProject(updated); dbService.saveProject(updated);
                }}
                constructProjectVisually={constructProjectVisually}
                handleRunSetup={handleRunSetup}
                handleSmartAction={agent.handleSmartAction}
            />
        </div>
      </div>
    </div>
  );
};

export default App;
