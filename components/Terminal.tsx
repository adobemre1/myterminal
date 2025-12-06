
import React, { useState } from 'react';
import { DiagnosticProblem } from '../types';

interface TerminalProps {
  logs: string[];
  problems?: DiagnosticProblem[]; // NEW PROP
  onRunSetup?: () => void;
  isRunning?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, problems = [], onRunSetup, isRunning }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');

  return (
    <div className="h-full bg-[#0d1117] flex flex-col font-mono text-sm border-t border-gray-800">
      {/* Terminal Tabs */}
      <div className="flex items-center justify-between px-4 bg-[#161b22] border-b border-gray-800 select-none">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('problems')}
            className={`py-2 text-xs uppercase font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'problems' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
          >
            Problems 
            <span className={`px-1.5 rounded-full text-[10px] ${problems.length > 0 ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'}`}>
                {problems.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('output')}
            className={`py-2 text-xs uppercase font-semibold border-b-2 transition-colors ${activeTab === 'output' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
          >
            Output
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`py-2 text-xs uppercase font-semibold border-b-2 transition-colors ${activeTab === 'terminal' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
          >
            Terminal
          </button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 py-1">
             <button 
                onClick={onRunSetup}
                disabled={isRunning}
                className="flex items-center gap-2 px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition-colors disabled:opacity-50"
             >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {isRunning ? 'Running...' : 'Run Setup'}
             </button>
             <div className="w-px h-4 bg-gray-700 mx-2"></div>
             <button className="text-gray-400 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#0d1117]">
        {activeTab === 'terminal' && (
          <div className="space-y-1">
             <div className="text-gray-500 mb-4 select-none">
                OmniCode Integrated Terminal (Bash/PowerShell)
                <br/>Global Standards Enforcement: <span className="text-green-500">Active</span>
             </div>
             {logs.map((log, i) => (
                <div key={i} className="font-mono text-gray-300 whitespace-pre-wrap break-all flex">
                    <span className="text-gray-500 mr-3 select-none">$</span>
                    <span>{log}</span>
                </div>
             ))}
             <div className="flex items-center text-gray-300 mt-1">
               <span className="text-gray-500 mr-3 select-none">$</span>
               <span className="w-2 h-4 bg-gray-500 animate-pulse block"></span>
             </div>
          </div>
        )}
        
        {activeTab === 'output' && (
             <div className="text-gray-400 italic font-mono space-y-2">
                <div>[Info] OmniCode Language Server initialized.</div>
                <div>[Info] Analyzing project structure...</div>
                <div className="text-green-500">[Success] Architecture conforms to Global Standard v4.2.</div>
                {isRunning && (
                    <div className="text-blue-400">[Running] Environment setup in progress...</div>
                )}
             </div>
        )}

        {activeTab === 'problems' && (
             <div className="space-y-2">
                 {problems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-500">
                        <span className="text-2xl mb-2">✓</span>
                        <span>No problems detected in workspace.</span>
                    </div>
                 ) : (
                     problems.map(prob => (
                         <div key={prob.id} className="flex gap-2 p-2 hover:bg-[#21262d] rounded cursor-pointer group">
                             <div className={`mt-0.5 ${
                                 prob.severity === 'error' ? 'text-red-500' : 
                                 prob.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                             }`}>
                                 {prob.severity === 'error' && '⛔'}
                                 {prob.severity === 'warning' && '⚠️'}
                                 {prob.severity === 'info' && 'ℹ️'}
                             </div>
                             <div>
                                 <div className="text-gray-300 text-xs font-medium">
                                     {prob.message} <span className="text-gray-600 ml-2">[{prob.code}]</span>
                                 </div>
                                 <div className="text-gray-500 text-[10px]">
                                     {prob.file} <span className="mx-1">:</span> Line {prob.line}
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
        )}
      </div>
    </div>
  );
};
