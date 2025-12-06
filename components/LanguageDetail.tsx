
import React, { useState } from 'react';
import { LibraryDefinition } from '../types';
import { Badge } from './ui/Badge';

interface LanguageDetailProps {
  library: LibraryDefinition;
  onBack: () => void;
  onCreateProject: (lib: LibraryDefinition) => void;
}

export const LanguageDetail: React.FC<LanguageDetailProps> = ({ library, onBack, onCreateProject }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'cli' | 'ecosystem'>('overview');

  return (
    <div className="flex-1 h-full bg-[#0d1117] overflow-y-auto custom-scrollbar flex flex-col">
      {/* Top Navigation */}
      <div className="px-8 py-4 border-b border-gray-800 flex items-center gap-4 bg-[#161b22]/50 backdrop-blur-sm sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{library.category} Library</span>
      </div>

      {/* Hero Section */}
      <div className="px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
           {/* Icon & Identity */}
           <div className="w-24 h-24 bg-[#161b22] border border-gray-700 rounded-2xl flex items-center justify-center text-6xl shadow-xl shrink-0">
              {library.icon}
           </div>
           
           <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{library.name}</h1>
              <p className="text-lg text-gray-400 leading-relaxed mb-6 max-w-3xl">
                 {library.description}
              </p>
              
              <div className="flex gap-4">
                 <button 
                   onClick={() => onCreateProject(library)}
                   className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                 >
                    <span>⚡</span> Initialize {library.name} Project
                 </button>
                 {library.docsUrl && (
                     <a 
                       href={library.docsUrl}
                       target="_blank"
                       rel="noreferrer"
                       className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-gray-300 font-medium rounded-lg border border-gray-700 transition-colors flex items-center gap-2"
                     >
                        Documentation <span>↗</span>
                     </a>
                 )}
              </div>
           </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-gray-800 mb-8">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('architecture')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'architecture' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Architecture & Standards
            </button>
            <button 
                onClick={() => setActiveTab('cli')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'cli' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                CLI & Scripts
            </button>
            <button 
                onClick={() => setActiveTab('ecosystem')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ecosystem' ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Ecosystem
            </button>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[400px]">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-purple-400">★</span> Key Features
                        </h3>
                        <ul className="space-y-3">
                            {library.features ? library.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {feat}
                                </li>
                            )) : (
                                <li className="text-gray-500 italic">No specific features listed.</li>
                            )}
                        </ul>
                    </div>
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-yellow-400">⚡</span> Quick Start
                        </h3>
                        <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-800">
                            {library.sampleCommand && (
                                <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-600">$</span>
                                <span className="text-green-400">{library.sampleCommand}</span>
                                </div>
                            )}
                            <div className="text-gray-500 text-xs italic">
                                Initialize this project to get a fully configured setup.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'architecture' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Core Architecture</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {library.architectureNotes || "Architecture details not available for this library."}
                        </p>
                    </div>

                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Standard File Structure</h3>
                        <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-800">
                            {library.defaultFiles ? library.defaultFiles.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 py-1">
                                    <span className="text-gray-600">├──</span> 
                                    <span className={file.includes('.') ? 'text-blue-300' : 'text-yellow-300'}>{file}</span>
                                </div>
                            )) : (
                                <div className="text-gray-500 italic">Standard structure varies.</div>
                            )}
                            <div className="flex items-center gap-2 py-1 text-gray-600">└── README.md</div>
                        </div>
                    </div>

                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Best Practices</h3>
                        <ul className="space-y-2">
                            {library.bestPractices ? library.bestPractices.map((bp, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                    <Badge variant="info">TIP</Badge> {bp}
                                </li>
                            )) : (
                                <li className="text-gray-500 italic">No specific best practices listed.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'cli' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Common CLI Commands</h3>
                        <div className="space-y-3">
                            <div className="bg-black/50 p-3 rounded border border-gray-700 flex justify-between items-center">
                                <code className="text-green-400 text-sm">{library.sampleCommand}</code>
                                <span className="text-gray-500 text-xs">Run Development Server</span>
                            </div>
                            {/* Simulated commands based on language */}
                            <div className="bg-black/50 p-3 rounded border border-gray-700 flex justify-between items-center">
                                <code className="text-green-400 text-sm">{library.sampleCommand?.split(' ')[0]} test</code>
                                <span className="text-gray-500 text-xs">Run Test Suite</span>
                            </div>
                            <div className="bg-black/50 p-3 rounded border border-gray-700 flex justify-between items-center">
                                <code className="text-green-400 text-sm">{library.sampleCommand?.split(' ')[0]} build</code>
                                <span className="text-gray-500 text-xs">Build for Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ecosystem' && (
                <div className="animate-fade-in">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Related Tools & Libraries</h3>
                        <div className="flex flex-wrap gap-3">
                            {library.ecosystemTools ? library.ecosystemTools.map((tool, i) => (
                                <span key={i} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors">
                                    {tool}
                                </span>
                            )) : (
                                <div className="text-gray-500 italic">No specific ecosystem tools listed.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        {/* Footer info */}
        <div className="mt-12 text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
            This microsite is generated by the OmniCode Sentinel Engine based on Global Standards for {library.name}.
        </div>

      </div>
    </div>
  );
};
