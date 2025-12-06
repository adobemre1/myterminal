
import React from 'react';

interface GoogleCloudPanelProps {
    projectTitle: string;
}

export const GoogleCloudPanel: React.FC<GoogleCloudPanelProps> = ({ projectTitle }) => {
    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-gray-300 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                    {/* Simple Google Cloud Logo Mock */}
                    <div className="w-8 h-8 relative">
                        <div className="absolute top-0 left-0 w-4 h-4 bg-red-500"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 bg-yellow-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500"></div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Google Cloud Console</h2>
                    <div className="text-xs text-gray-400">Project ID: {projectTitle.toLowerCase().replace(/\s/g, '-')}-prod-8392</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cloud Build Status */}
                <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex justify-between">
                        Cloud Build
                        <span className="text-green-500 text-xs">● Active</span>
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Build #8392-a</span>
                            <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded">SUCCESS</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full"></div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                            Step 1: Pull Distroless Image... OK<br/>
                            Step 2: Install Requirements... OK<br/>
                            Step 3: Run PyTest... OK
                        </div>
                    </div>
                </div>

                {/* Cloud Run Status */}
                <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4">
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex justify-between">
                        Cloud Run
                        <span className="text-green-500 text-xs">● Healthy</span>
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                         <div className="flex-1">
                             <div className="text-2xl font-bold text-white">99.99%</div>
                             <div className="text-xs text-gray-500">Uptime (SLA)</div>
                         </div>
                         <div className="flex-1">
                             <div className="text-2xl font-bold text-white">24ms</div>
                             <div className="text-xs text-gray-500">Latency (p95)</div>
                         </div>
                    </div>
                     <div className="text-xs text-blue-400 hover:underline cursor-pointer">View Logs in Operations Suite ↗</div>
                </div>
            </div>
            
            <div className="mt-4 bg-[#161b22] border border-gray-800 rounded-lg p-4 flex-1">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Artifact Registry</h3>
                 <table className="w-full text-left text-xs text-gray-400">
                     <thead>
                         <tr className="border-b border-gray-800">
                             <th className="pb-2">Image</th>
                             <th className="pb-2">Tag</th>
                             <th className="pb-2">Scan Status</th>
                             <th className="pb-2">Size</th>
                         </tr>
                     </thead>
                     <tbody>
                         <tr className="border-b border-gray-800/50">
                             <td className="py-2 text-white">gcr.io/omnicode/backend</td>
                             <td className="py-2 font-mono">latest</td>
                             <td className="py-2 text-green-400">No Vulnerabilities</td>
                             <td className="py-2">124MB</td>
                         </tr>
                          <tr className="border-b border-gray-800/50">
                             <td className="py-2 text-white">gcr.io/omnicode/backend</td>
                             <td className="py-2 font-mono">v4.1.0</td>
                             <td className="py-2 text-green-400">No Vulnerabilities</td>
                             <td className="py-2">122MB</td>
                         </tr>
                     </tbody>
                 </table>
            </div>
        </div>
    );
};