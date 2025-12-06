
import React, { useState } from 'react';
import { agentSearchPyPi } from '../../services/gemini';
import { PythonPackage } from '../../types';

interface PyPiExplorerProps {
  onInstall: (pkg: PythonPackage) => void;
}

export const PyPiExplorer: React.FC<PyPiExplorerProps> = ({ onInstall }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PythonPackage | null>(null);
  const [history, setHistory] = useState<PythonPackage[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const pkg = await agentSearchPyPi(query);
      setResult(pkg);
      setHistory(prev => [pkg, ...prev.filter(p => p.name !== pkg.name)].slice(0, 5));
    } catch (err) {
      console.error(err);
      alert("Package not found or AI Service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0d1117] text-gray-300">
      {/* Left: Search & History */}
      <div className="w-80 border-r border-gray-800 bg-[#161b22] flex flex-col p-6">
        <div className="mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                <span className="text-yellow-400">⚡</span> PyPI Registry
            </h2>
            <p className="text-xs text-gray-500">Global Python Package Index Explorer</p>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search e.g. 'pandas'..."
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 outline-none text-white"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
            >
                {loading ? 'Searching Registry...' : 'Search Package'}
            </button>
        </form>

        <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recent Views</h3>
            <div className="space-y-2">
                {history.map(pkg => (
                    <div 
                        key={pkg.name} 
                        onClick={() => setResult(pkg)}
                        className={`p-3 rounded border border-gray-700 hover:border-blue-500 cursor-pointer transition-all ${result?.name === pkg.name ? 'bg-blue-900/20 border-blue-500' : 'bg-[#0d1117]'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-gray-200">{pkg.name}</span>
                            <span className="text-[10px] text-gray-500">{pkg.version}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{pkg.summary}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right: Package Details */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <div className="text-6xl mb-4">🐍</div>
                <p className="text-lg font-medium">Search for a Python package to analyze.</p>
                <p className="text-sm">Powered by Gemini Librarian Agent</p>
            </div>
        )}

        {loading && (
            <div className="h-full flex items-center justify-center">
                 <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {result && (
            <div className="max-w-4xl mx-auto animate-fade-in">
                {/* Header Card */}
                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-6 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-blue-900/20 rounded-lg flex items-center justify-center text-3xl">
                                📦
                             </div>
                             <div>
                                 <h1 className="text-3xl font-bold text-white mb-1">{result.name} <span className="text-gray-500 text-lg font-normal">{result.version}</span></h1>
                                 <p className="text-gray-400">{result.summary}</p>
                             </div>
                        </div>
                        <button 
                            onClick={() => onInstall(result)}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-900/20 transition-transform transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <span>⬇</span> Install Package
                        </button>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                        <div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">License</div>
                            <div className="text-sm font-mono text-white bg-gray-800 inline-block px-2 py-0.5 rounded">{result.health.license}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Health Score</div>
                            <div className={`text-sm font-bold ${result.health.score > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {result.health.score}/100 (OpenSSF)
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Popularity</div>
                            <div className="text-sm text-gray-200">{result.health.popularity}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Last Release</div>
                            <div className="text-sm text-gray-200">{result.health.lastRelease}</div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Col: Readme */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Project Description</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                {/* Simulated Markdown rendering */}
                                {result.description.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line}</p>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Installation</h3>
                             <div className="flex items-center justify-between bg-black rounded border border-gray-700 p-4 font-mono text-sm text-green-400">
                                 <span>{result.installCmd}</span>
                                 <button className="text-gray-500 hover:text-white" title="Copy">📋</button>
                             </div>
                        </div>
                    </div>

                    {/* Right Col: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded border border-blue-900/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                         <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Dependencies</h3>
                            <div className="space-y-2">
                                {result.dependencies.length > 0 ? result.dependencies.map(dep => (
                                    <div key={dep} className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="text-gray-600">↳</span> {dep}
                                    </div>
                                )) : (
                                    <div className="text-gray-500 italic text-sm">No dependencies listed.</div>
                                )}
                            </div>
                        </div>
                        
                         <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Author</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-xs text-white font-bold">
                                    {result.author.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-200">{result.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
