
import React, { useState } from 'react';
import { CLOUD_PROVIDERS } from '../../services/cloudProviders';
import { CloudProvider, CloudCategory } from '../../types';

interface CloudPlatformHubProps {
    onIntegrate: (provider: CloudProvider) => void;
}

export const CloudPlatformHub: React.FC<CloudPlatformHubProps> = ({ onIntegrate }) => {
    const [selectedCategory, setSelectedCategory] = useState<CloudCategory | 'All'>('All');
    const [search, setSearch] = useState('');

    const categories: (CloudCategory | 'All')[] = ['All', 'Frontend', 'Backend', 'Database', 'Fullstack', 'AI', 'Auth', 'CMS', 'DevOps'];

    const filtered = CLOUD_PROVIDERS.filter(p => {
        const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
        const searchMatch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
        return catMatch && searchMatch;
    });

    return (
        <div className="flex flex-col h-full bg-[#0d1117] text-white">
            {/* Header */}
            <div className="p-8 pb-4 border-b border-gray-800">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-4xl">☁️</span> Cloud Ecosystem Hub
                </h1>
                <p className="text-gray-400 text-sm max-w-2xl">
                    Deploy your OmniCode projects to the world's best free-tier platforms. 
                    Select a provider to automatically generate its "Infrastructure-as-Code" configuration file.
                </p>
                
                <div className="mt-6 space-y-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search 99+ providers..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#161b22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:border-blue-500 outline-none text-white"
                        />
                        <div className="absolute right-3 top-2 text-gray-500 text-xs">
                            {filtered.length} systems
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                                    selectedCategory === cat 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(provider => (
                        <div key={provider.id} className="bg-[#161b22] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-[#0d1117] border border-gray-700 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                    {provider.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                    provider.category === 'Frontend' ? 'bg-purple-900/20 text-purple-400 border-purple-900' :
                                    provider.category === 'Backend' ? 'bg-green-900/20 text-green-400 border-green-900' :
                                    provider.category === 'Database' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900' :
                                    provider.category === 'AI' ? 'bg-red-900/20 text-red-400 border-red-900' :
                                    'bg-blue-900/20 text-blue-400 border-blue-900'
                                }`}>
                                    {provider.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {provider.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2">
                                {provider.description}
                            </p>

                            <div className="bg-[#0d1117] rounded p-3 mb-4 border border-gray-800">
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Free Tier Benefits</div>
                                <ul className="space-y-1">
                                    {provider.freeTierFeatures.slice(0, 3).map((feat, i) => (
                                        <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                            <span className="text-green-500">✓</span> {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-800 flex gap-2">
                                <button 
                                    onClick={() => onIntegrate(provider)}
                                    className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>➕</span> Add {provider.configFile}
                                </button>
                                <a 
                                    href={provider.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3 py-2 bg-[#0d1117] hover:bg-gray-700 text-gray-400 hover:text-white rounded border border-gray-700 transition-colors"
                                    title="Visit Website"
                                >
                                    ↗
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
