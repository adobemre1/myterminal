
import React, { useEffect, useState } from 'react';
import { SystemEvolution } from '../types';
import { Installer } from '../modules/desktop/Installer';

interface LandingPageProps {
  onLaunch: () => void;
  evolution: SystemEvolution;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, evolution }) => {
  const [typedText, setTypedText] = useState('');
  const [installing, setInstalling] = useState<'win' | 'mac' | 'linux' | null>(null);
  
  const fullText = "import { Future } from 'eCylogy';";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Installer Overlay */}
      {installing && (
          <Installer 
            platform={installing} 
            onCancel={() => setInstalling(null)}
            onComplete={() => {
                setInstalling(null);
                onLaunch(); // "Launch" the app after install
            }}
          />
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800/50 backdrop-blur-md sticky top-0 z-50 bg-[#080c14]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-violet-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-cyan-900/20">
            eCy
          </div>
          <span className="font-bold text-xl tracking-tight">eCylogy</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#download" className="hover:text-white transition-colors">Download</a>
          <a href="#sentinel" className="hover:text-white transition-colors">Sentinel AI</a>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setInstalling('win')}
             className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2"
           >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.67L24 0v11.551H10.949V1.78zM0 12.45h9.75v9.451L0 20.55V12.45zm10.949 0H24v11.77l-13.051-1.78V12.45z"/></svg>
              Download
           </button>
          <button 
            onClick={onLaunch}
            className="px-5 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Launch Web IDE
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-900/10 rounded-full blur-[100px] -z-10"></div>

        <div className="mb-6 font-mono text-cyan-400 text-sm bg-cyan-900/20 px-4 py-2 rounded-full border border-cyan-800/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          v{evolution.version} Live • {evolution.knowledgeCount} ModelFiles Active
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl leading-tight">
          The Autonomous <br/>
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">Coding Ecosystem.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          eCylogy is the first universal IDE powered by a self-healing Multi-Agent Orchestra. 
          Generate, optimize, and deploy Enterprise-Grade software in any language.
        </p>

        <div id="download" className="flex flex-col md:flex-row gap-4 items-center">
          <button 
            onClick={() => setInstalling('win')}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold rounded-lg shadow-xl shadow-cyan-600/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.67L24 0v11.551H10.949V1.78zM0 12.45h9.75v9.451L0 20.55V12.45zm10.949 0H24v11.77l-13.051-1.78V12.45z"/></svg>
            Download for Windows
          </button>
          <button 
            onClick={() => setInstalling('mac')}
            className="px-8 py-4 bg-[#161b22] hover:bg-[#1c2128] text-white border border-gray-700 hover:border-gray-500 text-lg font-medium rounded-lg transition-all flex items-center gap-3"
          >
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.69.8-1.27 2.09-1.11 3.21 1.19.08 2.37-.88 3.1-1.71z"/></svg>
             Download for macOS
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">v{evolution.version} | Free for non-commercial use</p>

        {/* Code Visual */}
        <div className="mt-16 w-full max-w-3xl bg-[#161b22] rounded-xl border border-gray-800 shadow-2xl overflow-hidden text-left relative group">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0d1117]">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-xs text-gray-500 font-mono">architect_agent.ts</div>
          </div>
          <div className="p-6 font-mono text-sm overflow-hidden">
            <div className="text-violet-400">{typedText}<span className="animate-pulse">|</span></div>
            <div className="text-gray-500 mt-2">// The Sentinel Engine auto-detects missing libraries</div>
            <div className="text-cyan-300 mt-1">const</div> <div className="text-white inline">project</div> = <div className="text-yellow-300 inline">await</div> <div className="text-white inline">Orchestra.build(</div>
            <div className="pl-4 text-green-300">'Full Stack SaaS',</div>
            <div className="pl-4 text-green-300">'React + Python + Docker'</div>
            <div className="text-white">);</div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute bottom-4 right-4 bg-green-900/80 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-700/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            ● System Active
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-4 bg-[#080c14] border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-[#161b22] border border-gray-800 hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🎻
              </div>
              <h3 className="text-xl font-bold mb-3">Orchestra Engine</h3>
              <p className="text-gray-400 leading-relaxed">
                4 Specialized Agents (Architect, Tech Lead, Dev, QA) collaborate to build your project, ensuring global coding standards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-[#161b22] border border-gray-800 hover:border-violet-500/50 transition-colors group">
              <div className="w-12 h-12 bg-violet-900/20 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-xl font-bold mb-3">Sentinel Evolution</h3>
              <p className="text-gray-400 leading-relaxed">
                The system learns. If you request a library it doesn't know, it researches and integrates it into the core permanently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-[#161b22] border border-gray-800 hover:border-green-500/50 transition-colors group">
              <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Native Desktop App</h3>
              <p className="text-gray-400 leading-relaxed">
                Download the Electron-based native app for Windows, macOS, and Linux. Full filesystem access and offline mode.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 text-sm border-t border-gray-800 bg-[#080c14]">
        <p>© 2025 eCylogy Inc. Built with Google Gemini 3.0 Pro.</p>
      </footer>
    </div>
  );
};