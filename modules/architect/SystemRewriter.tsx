
import React, { useState } from 'react';
import { agentRewriteSystem } from '../../services/gemini';
import { GeneratedProject } from '../../types';

interface SystemRewriterProps {
    onProjectCreated: (project: GeneratedProject) => void;
}

export const SystemRewriter: React.FC<SystemRewriterProps> = ({ onProjectCreated }) => {
    const [targetStack, setTargetStack] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRewrite = async () => {
        if (!targetStack) return;
        setIsGenerating(true);
        try {
            const project = await agentRewriteSystem(targetStack);
            onProjectCreated(project);
        } catch (e) {
            alert("System rewrite failed: " + (e instanceof Error ? e.message : 'Unknown Error'));
        } finally {
            setIsGenerating(false);
        }
    }

    const stacks = [
        "Rust + Tauri + Yew",
        "Go + HTMX + Tailwind",
        "Vue 3 + Vite + Pinia",
        "SvelteKit + Rust (WASM)",
        "Flutter (Web)",
        "Kotlin Multiplatform"
    ];

    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-white p-8 items-center justify-center">
             <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                 {/* Background Animation */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                 <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                     <span className="text-cyan-400 text-3xl">🧬</span> System Architect (Self-Rewriter)
                 </h2>
                 <p className="text-gray-400 mb-8">
                     OmniCode Studio has the capability to rewrite its own source code into any other technology stack.
                     Select a target architecture below to generate a full E2E implementation of this IDE in a new language.
                 </p>

                 <div className="grid grid-cols-2 gap-3 mb-6">
                     {stacks.map(stack => (
                         <button
                            key={stack}
                            onClick={() => setTargetStack(stack)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                                targetStack === stack 
                                ? 'bg-cyan-900/30 border-cyan-500 text-cyan-300' 
                                : 'bg-[#0d1117] border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                         >
                             {stack}
                         </button>
                     ))}
                 </div>

                 <div className="mb-6">
                     <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Custom Stack Definition</label>
                     <input 
                        type="text" 
                        value={targetStack}
                        onChange={(e) => setTargetStack(e.target.value)}
                        placeholder="e.g. Haskell + Elm"
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                     />
                 </div>

                 <button
                    onClick={handleRewrite}
                    disabled={isGenerating || !targetStack}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     {isGenerating ? (
                         <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Re-Architecting System...
                         </>
                     ) : (
                         <>
                            <span>🔄</span> Generate "{targetStack}" Codebase
                         </>
                     )}
                 </button>

                 <div className="mt-4 text-center text-[10px] text-gray-600">
                     Warning: This operation generates a new project in your workspace. It does not overwrite the running browser instance instantly.
                 </div>
             </div>
        </div>
    );
};
