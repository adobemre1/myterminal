import React, { useState } from 'react';
import { KNOWLEDGE_BASE } from '../services/knowledgeBase';
import { LibraryCategory, LibraryDefinition } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface LibraryHubProps {
  onSelectLibrary: (lib: LibraryDefinition) => void;
  onAutoEvolve: (query: string) => void; 
  isEvolving: boolean;
}

export const LibraryHub: React.FC<LibraryHubProps> = ({ onSelectLibrary, onAutoEvolve, isEvolving }) => {
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: (LibraryCategory | 'All')[] = ['All', 'Frontend', 'Backend', 'AI_Data', 'DevOps', 'Blockchain', 'Emerging_Tech'];

  const filteredLibs = KNOWLEDGE_BASE.filter(lib => {
    const matchesCategory = selectedCategory === 'All' || lib.category === selectedCategory;
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lib.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white overflow-hidden">
      
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2">
          ModelFile Hub
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Browse the Global Standard Library Directory. Select a technology to view its architecture standards and capabilities before initializing.
        </p>
      </div>

      {/* Filters */}
      <div className="px-8 pb-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-800">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {cat.replace('_', ' & ')}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
           <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <input 
             type="text" 
             placeholder="Search ModelFiles..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#161b22] border border-gray-700 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
           />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLibs.map(lib => (
            <Card
              key={lib.id}
              onClick={() => onSelectLibrary(lib)}
              hoverEffect
              className="flex flex-col items-start text-left"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl grayscale">{lib.icon}</span>
              </div>
              
              <div className="mb-4 w-10 h-10 rounded-lg bg-[#21262d] flex items-center justify-center text-xl shadow-inner">
                {lib.icon}
              </div>
              
              <h3 className="text-lg font-bold text-gray-200 group-hover:text-blue-400 mb-1">
                {lib.name}
              </h3>
              
              <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed h-8">
                {lib.description}
              </p>
              
              <div className="mt-auto w-full pt-4 border-t border-gray-800 flex justify-between items-center">
                <Badge variant="default" className="font-mono text-gray-500">
                  {lib.language}
                </Badge>
                <span className="text-xs text-blue-500 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  View Details <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </Card>
          ))}
          
          {/* AUTO EVOLUTION BUTTON */}
          {filteredLibs.length === 0 && searchTerm.length > 2 && (
             <div className="col-span-full py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-800 rounded-xl hover:border-blue-500/50 transition-colors">
                 <div className="text-4xl mb-4">🛸</div>
                 <h3 className="text-xl font-bold text-white mb-2">Technology "{searchTerm}" not found.</h3>
                 <p className="text-gray-400 text-sm mb-6 max-w-md">
                    The Sentinel can access global knowledge to auto-generate a new ModelFile, integrate standards, and upgrade the system instantly.
                 </p>
                 <button 
                    onClick={() => onAutoEvolve(searchTerm)}
                    disabled={isEvolving}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                    {isEvolving ? (
                        <>
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Evolving System...
                        </>
                    ) : (
                        <>
                           Initialize Integration Protocol
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </>
                    )}
                 </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};