
import React, { useState } from 'react';
import { agentSearchUniversalRegistry } from '../../services/gemini';
import { UniversalPackage } from '../../types';

interface UniversalRegistryProps {
  onInstall: (pkg: UniversalPackage) => void;
}

export const UniversalRegistry: React.FC<UniversalRegistryProps> = ({ onInstall }) => {
  const [language, setLanguage] = useState('Rust');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState<UniversalPackage | null>(null);

  const languages = ['Rust', 'Java', 'PHP', 'Ruby', 'Go', 'C#', 'Swift', 'Kotlin', 'Scala', 'Haskell', 'Lua'];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const pkg = await agentSearchUniversalRegistry(language, query);
      setResult(pkg);
    } catch (err) {
      console.error(err);
      alert("Registry access failed. The Universal Agent could not resolve dependencies.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = async (pkg: UniversalPackage) => {
      setInstalling(true);
      await new Promise(r => setTimeout(r, 500)); // Visual delay
      onInstall(pkg);
      setInstalling(false);
  };

  const getConfigFileForLang = (lang: string) => {
      switch(lang) {
          case 'Rust': return 'Cargo.toml';
          case 'Java': return 'pom.xml';
          case 'PHP': return 'composer.json';
          case 'Ruby': return 'Gemfile';
          case 'Go': return 'go.mod';
          case 'C#': return 'Project.csproj';
          default: return 'README.md';
      }
  };

  return (
    <div className="flex h-full bg-[#0d1117] text-gray-300">
      {/* Sidebar Controls */}
      <div className="w-72 border-r border-gray-800 bg-[#161b22] flex flex-col p-6">
        <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                <span className="text-purple-400">🌐</span> Universal Registry
            </h2>
            <p className="text-xs text-gray-500">Polymorphic Package Manager</p>
        </div>

        <div className="mb-4">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Target Ecosystem</label>
            <div className="grid grid-cols-2 gap-2">
                {languages.map(lang => (
                    <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setResult(null); }}
                        className={`text-xs py-1.5 rounded transition-colors border ${
                            language === lang 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-[#0d1117] text-gray-400 border-gray-700 hover:border-gray-500'
                        }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${language} packages...`}
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-lg py-2.5 pl-4 pr-4 text-sm focus:border-purple-500 outline-none text-white"
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
            >
                {loading ? `Querying ${language} Registry...` : 'Search'}
            </button>
        </form>

        <div className="bg-blue-900/10 border border-blue-900/30 rounded p-3 text-xs text-blue-300">
            <strong>Agent Protocol:</strong> This module simulates API calls to registries like Maven, Crates.io, and Packagist using the Gemini 3.0 Pro Neural Link.
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
         {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <div className="text-6xl mb-4 grayscale opacity-50">🌍</div>
                <p className="text-lg font-medium">Select an ecosystem and search.</p>
                <p className="text-sm">Supports all global registry standards.</p>
            </div>
        )}

        {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                 <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                 <div className="text-purple-400 font-mono text-sm animate-pulse">Resolving dependency graph...</div>
            </div>
        )}

        {result && (
            <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{result.registry}</div>
                             <h1 className="text-3xl font-bold text-white mb-2">{result.name} <span className="text-gray-500 text-xl font-normal">v{result.version}</span></h1>
                             <p className="text-gray-300">{result.description}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#0d1117] rounded-lg flex items-center justify-center text-2xl font-bold text-purple-500 border border-gray-700">
                            {result.language.charAt(0)}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                         <div className="bg-[#0d1117] p-3 rounded border border-gray-700">
                             <div className="text-[10px] text-gray-500 uppercase font-bold">Downloads</div>
                             <div className="text-sm font-mono text-white">{result.stats.downloads}</div>
                         </div>
                         <div className="bg-[#0d1117] p-3 rounded border border-gray-700">
                             <div className="text-[10px] text-gray-500 uppercase font-bold">Stars</div>
                             <div className="text-sm font-mono text-yellow-400">★ {result.stats.stars}</div>
                         </div>
                         <div className="bg-[#0d1117] p-3 rounded border border-gray-700">
                             <div className="text-[10px] text-gray-500 uppercase font-bold">License</div>
                             <div className="text-sm font-mono text-white">{result.health.license}</div>
                         </div>
                    </div>

                    <div className="bg-black/50 rounded border border-gray-700 p-4 font-mono text-sm flex justify-between items-center mb-6">
                        <span className="text-green-400">{result.installCmd}</span>
                        <button className="text-gray-500 hover:text-white" title="Copy">📋</button>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleInstallClick(result)}
                            disabled={installing}
                            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {installing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Injecting...
                                </>
                            ) : (
                                `Inject into ${getConfigFileForLang(result.language)}`
                            )}
                        </button>
                        <button className="px-4 py-3 bg-[#0d1117] border border-gray-700 text-gray-300 rounded-lg hover:text-white transition-colors">
                            View Documentation
                        </button>
                    </div>

                </div>
            </div>
        )}
      </div>
    </div>
  );
};
