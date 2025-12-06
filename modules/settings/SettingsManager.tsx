
import React, { useState } from 'react';
import { IntegrationConfig } from '../../types';

interface SettingsManagerProps {
    onClose: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ onClose }) => {
    const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
        { id: 'google_cloud', name: 'Google Cloud Platform', connected: true, username: 'omnicode-prod' },
        { id: 'github', name: 'GitHub (Source)', connected: false },
        { id: 'vercel', name: 'Vercel (Edge)', connected: false },
    ]);

    // Token inputs state
    const [tokens, setTokens] = useState<{[key: string]: string}>({});

    const toggleConnect = (id: string) => {
        if (!integrations.find(i => i.id === id)?.connected && !tokens[id] && id !== 'google_cloud') {
            alert(`Please enter a valid Personal Access Token for ${id} first.`);
            return;
        }

        setIntegrations(prev => prev.map(i => {
            if (i.id === id) {
                return { 
                    ...i, 
                    connected: !i.connected, 
                    username: !i.connected ? (id === 'github' ? 'octocat' : 'team_vercel') : undefined 
                };
            }
            return i;
        }));
    };

    return (
        <div className="flex flex-col h-full bg-[#0d1117] p-8 items-center justify-center">
             <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Integration Hub</h2>
                    <p className="text-gray-400 text-sm">Manage secure connections to external orchestration providers.</p>
                </div>

                <div className="space-y-4">
                    {integrations.map(integ => (
                        <div key={integ.id} className="flex flex-col gap-2 p-4 bg-[#21262d] rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black/30 rounded flex items-center justify-center text-xl">
                                        {integ.id === 'google_cloud' && '☁️'}
                                        {integ.id === 'github' && '🐙'}
                                        {integ.id === 'vercel' && '▲'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200">{integ.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {integ.connected ? `Connected as ${integ.username}` : 'Not connected'}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleConnect(integ.id)}
                                    className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                                        integ.connected 
                                        ? 'bg-red-900/20 text-red-400 border border-red-900 hover:bg-red-900/40' 
                                        : 'bg-blue-600 text-white hover:bg-blue-500'
                                    }`}
                                >
                                    {integ.connected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                            
                            {!integ.connected && integ.id !== 'google_cloud' && (
                                <div className="mt-2 flex gap-2">
                                    <input 
                                        type="password" 
                                        placeholder={`Paste ${integ.name} Personal Access Token`}
                                        className="flex-1 bg-[#0d1117] border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 focus:border-blue-500 outline-none"
                                        value={tokens[integ.id] || ''}
                                        onChange={(e) => setTokens({...tokens, [integ.id]: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-gray-300 mb-2">Global Policies (Google Standard)</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs text-gray-400">
                            <input type="checkbox" checked readOnly className="rounded bg-gray-800 border-gray-600 text-blue-500" />
                            Enforce 'OWNERS' file presence
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-400">
                            <input type="checkbox" checked readOnly className="rounded bg-gray-800 border-gray-600 text-blue-500" />
                            Require deployment config (vercel.json / Dockerfile)
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-400">
                            <input type="checkbox" checked readOnly className="rounded bg-gray-800 border-gray-600 text-blue-500" />
                            Automatic Free Tier Optimization
                        </label>
                    </div>
                </div>
             </div>
        </div>
    );
};
