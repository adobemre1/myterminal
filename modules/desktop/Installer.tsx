
import React, { useEffect, useState } from 'react';

interface InstallerProps {
    platform: 'win' | 'mac' | 'linux';
    onComplete: () => void;
    onCancel: () => void;
}

export const Installer: React.FC<InstallerProps> = ({ platform, onComplete, onCancel }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 2;
            if (currentProgress > 100) currentProgress = 100;
            
            setProgress(currentProgress);

            if (currentProgress < 20) setStatus('Downloading core binaries...');
            else if (currentProgress < 40) setStatus('Unpacking assets...');
            else if (currentProgress < 60) setStatus('Configuring Sentinel Engine...');
            else if (currentProgress < 80) setStatus('Installing Python & Node.js runtimes...');
            else if (currentProgress < 95) setStatus('Registering system paths...');
            else setStatus('Finalizing installation...');

            if (Math.random() > 0.7) {
                setLog(prev => [`[EXTRACT] ${Math.random().toString(36).substring(7)}.dll`, ...prev.slice(0, 4)]);
            }

            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(onComplete, 800);
            }
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1e1e1e] border border-gray-700 w-full max-w-md rounded-lg shadow-2xl overflow-hidden font-sans">
                {/* Header */}
                <div className="bg-[#2d2d2d] px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-medium text-white">eCylogy Setup</span>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">eCy</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Installing eCylogy...</h3>
                            <p className="text-xs text-gray-400">Version 5.0.0 (Stable) • {platform === 'win' ? 'Windows x64' : 'macOS Universal'}</p>
                        </div>
                    </div>

                    <div className="mb-2 flex justify-between text-xs text-gray-300">
                         <span>{status}</span>
                         <span>{Math.floor(progress)}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-100 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Logs */}
                    <div className="h-24 bg-black/40 border border-gray-700 rounded p-2 font-mono text-[10px] text-gray-500 overflow-hidden flex flex-col-reverse">
                         {log.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};