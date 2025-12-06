
import React, { useState } from 'react';
import { Extension } from '../../types';
import { ExtensionService } from '../../services/extensionRegistry';

interface ExtensionMarketplaceProps {
    onClose: () => void;
}

export const ExtensionMarketplace: React.FC<ExtensionMarketplaceProps> = ({ onClose }) => {
    const svc = new ExtensionService();
    const [extensions, setExtensions] = useState<Extension[]>(svc.getExtensions());
    const [search, setSearch] = useState('');

    const handleToggle = (id: string) => {
        const updated = svc.toggleExtension(id);
        setExtensions(updated);
    };

    const filtered = extensions.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) || 
        e.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-white">
            <div className="p-8 border-b border-gray-800 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <span className="text-4xl">🧩</span> Extension Marketplace
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xl">
                        Customize your Neural Nexus. Enable or disable modules to tailor the IDE to your workflow. 
                        Architecture is fully decoupled (v6.0.0 Standard).
                    </p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white px-4 py-2 border border-gray-700 rounded-lg">
                    Close
                </button>
            </div>

            <div className="px-8 py-4 border-b border-gray-800 bg-[#161b22]">
                <input 
                    type="text" 
                    placeholder="Search extensions..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:border-blue-500 outline-none"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(ext => (
                        <div key={ext.id} className={`border rounded-xl p-5 flex flex-col h-full transition-all ${ext.isEnabled ? 'bg-[#161b22] border-gray-700' : 'bg-[#0d1117] border-gray-800 opacity-70 grayscale'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-[#0d1117] border border-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                    {ext.icon}
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                                    ext.category === 'AI' ? 'bg-purple-900/30 text-purple-400' :
                                    ext.category === 'Language' ? 'bg-blue-900/30 text-blue-400' :
                                    'bg-gray-800 text-gray-400'
                                }`}>
                                    {ext.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold mb-1">{ext.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 flex-1">
                                {ext.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                                <div className="text-[10px] text-gray-500">
                                    v{ext.version} • {ext.author}
                                </div>
                                <button 
                                    onClick={() => handleToggle(ext.id)}
                                    className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                                        ext.isEnabled 
                                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900'
                                        : 'bg-green-600 text-white hover:bg-green-500'
                                    }`}
                                >
                                    {ext.isEnabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
