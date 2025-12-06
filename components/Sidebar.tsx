import React from 'react';
import { GeneratedProject, User } from '../types';
import { Badge } from './ui/Badge';

// --- SUB-COMPONENTS ---

const SidebarHeader: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => (
  <div className="p-4 border-b border-gray-800 bg-[#0d1117] flex justify-between items-center shrink-0">
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-[10px] text-white">eCy</span>
        <span className="bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">eCylogy</span>
      </h2>
      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Neural Nexus v6.0</p>
    </div>
    <button onClick={onCloseMobile} className="md:hidden text-gray-400 hover:text-white">✕</button>
  </div>
);

const SidebarNav: React.FC<{ activeView: string, onNavChange: (v: any) => void, onCloseMobile?: () => void, hasHistory: boolean, onSelectHistory: () => void }> = ({ activeView, onNavChange, onCloseMobile, hasHistory, onSelectHistory }) => {
  const tabs = [
    { id: 'hub', label: 'Hub' },
    { id: 'workspace', label: 'Code', action: hasHistory ? onSelectHistory : undefined },
    { id: 'academy', label: 'Edu' }
  ];

  return (
    <div className="flex border-b border-gray-800 bg-[#0d1117] shrink-0">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => { 
            if (tab.action) tab.action();
            onNavChange(tab.id); 
            onCloseMobile?.(); 
          }}
          className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeView === tab.id || (tab.id === 'hub' && activeView === 'library-detail') 
            ? 'text-cyan-400 border-cyan-500' 
            : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const SidebarHistory: React.FC<{ 
  history: GeneratedProject[], 
  selectedId?: string, 
  activeView: string,
  onSelect: (p: GeneratedProject) => void,
  onCloseMobile?: () => void
}> = ({ history, selectedId, activeView, onSelect, onCloseMobile }) => (
  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
    <div className="px-2 pt-2 pb-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-[10px]">Recent Projects</h3>
    </div>
    
    {history.length === 0 ? (
      <div className="text-center p-4 text-gray-600 text-xs italic">
        No projects yet.
        <br/>Go to Library Hub to start.
      </div>
    ) : (
      history.map((project) => (
        <button
          key={project.id}
          onClick={() => {
              onSelect(project);
              onCloseMobile?.();
          }}
          className={`w-full text-left p-3 rounded-md transition-all duration-200 group border border-transparent ${
            selectedId === project.id && activeView === 'workspace'
              ? 'bg-cyan-900/20 border-cyan-500/30 text-white' 
              : 'hover:bg-gray-800 text-gray-400 hover:text-gray-100'
          }`}
        >
          <div className="text-sm font-medium truncate">{project.title}</div>
          <div className="text-[10px] text-gray-500 flex justify-between mt-1 items-center">
            <span>{project.files.length} files</span>
            {project.aiMetrics && project.aiMetrics.accuracyScore > 90 ? (
               <Badge variant="success">{project.aiMetrics.accuracyScore}% Acc</Badge>
            ) : (
               <Badge variant="outline">{project.modelContext || 'N/A'}</Badge>
            )}
          </div>
        </button>
      ))
    )}
  </div>
);

const SidebarTools: React.FC<{ activeView: string, onNavChange: (v: any) => void, onCloseMobile?: () => void, isAdmin: boolean }> = ({ activeView, onNavChange, onCloseMobile, isAdmin }) => {
  const tools = [
    { id: 'marketplace', label: 'Extensions', icon: '🧩' },
    { id: 'cloud', label: 'Cloud Ecosystem', icon: '☁️' },
    { id: 'architect', label: 'System Architect', icon: '🧬' },
  ];

  return (
    <div className="p-2 border-t border-gray-800 space-y-1 shrink-0">
        {tools.map(tool => (
           <button 
             key={tool.id}
             onClick={() => { onNavChange(tool.id); onCloseMobile?.(); }} 
             className={`w-full text-left p-2 rounded text-xs flex items-center gap-2 transition-colors ${
               activeView === tool.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
             }`}
           >
             <span className="text-cyan-400">{tool.icon}</span> {tool.label}
           </button>
        ))}
        
        {isAdmin && (
            <button 
              onClick={() => { onNavChange('admin'); onCloseMobile?.(); }} 
              className={`w-full text-left p-2 rounded text-xs flex items-center gap-2 ${
                activeView === 'admin' ? 'bg-red-900/20 text-red-400 border border-red-900' : 'text-red-400 hover:bg-gray-800'
              }`}
            >
              <span>🛡️</span> Admin Console
            </button>
        )}
    </div>
  );
};

const SidebarProfile: React.FC<{ user?: User | null, onLogout?: () => void, onClear: () => void }> = ({ user, onLogout, onClear }) => (
  <div className="p-3 border-t border-gray-800 bg-[#0d1117] shrink-0">
      {user ? (
          <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold shadow">
                  {user.avatar || user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-gray-500 truncate">{user.role}</div>
              </div>
              <button onClick={onLogout} className="text-gray-500 hover:text-red-400" title="Sign Out">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
          </div>
      ) : (
          <div className="text-center text-xs text-gray-500 mb-2">Not logged in</div>
      )}

    <button 
      onClick={onClear}
      className="w-full py-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-red-900 rounded"
    >
      Clear Workspace
    </button>
  </div>
);

// --- MAIN SIDEBAR COMPONENT ---

interface SidebarProps {
  history: GeneratedProject[];
  onSelectProject: (project: GeneratedProject) => void;
  onClearHistory: () => void;
  onGoToHub: () => void;
  selectedProjectId?: string;
  activeView: string;
  onNavChange: (view: any) => void;
  user?: User | null; 
  onLogout?: () => void;
  isOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  history, onSelectProject, onClearHistory, onGoToHub, selectedProjectId,
  activeView, onNavChange, user, onLogout, isOpen = true, onCloseMobile
}) => {
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />
      
      {/* Sidebar Container */}
      <div className={`
          bg-[#161b22] border-r border-gray-800 flex flex-col h-full shrink-0
          fixed md:relative top-0 left-0 bottom-0 z-40 w-64
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarHeader onCloseMobile={onCloseMobile} />
        
        <SidebarNav 
          activeView={activeView} 
          onNavChange={onNavChange} 
          onCloseMobile={onCloseMobile}
          hasHistory={history.length > 0}
          onSelectHistory={() => { if(history.length > 0) onSelectProject(history[0]); }}
        />

        <SidebarHistory 
          history={history} 
          activeView={activeView} 
          selectedId={selectedProjectId} 
          onSelect={(p) => { onSelectProject(p); onNavChange('workspace'); }}
          onCloseMobile={onCloseMobile}
        />
        
        <SidebarTools 
          activeView={activeView} 
          onNavChange={onNavChange} 
          onCloseMobile={onCloseMobile} 
          isAdmin={!!isAdmin} 
        />

        <SidebarProfile 
          user={user} 
          onLogout={onLogout} 
          onClear={onClearHistory} 
        />
      </div>
    </>
  );
};