
import React from 'react';
import { SystemEvolution } from '../types';

interface SentinelConsoleProps {
  evolution: SystemEvolution;
}

export const SentinelConsole: React.FC<SentinelConsoleProps> = ({ evolution }) => {
  
  // Helper for simple bar chart
  const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
      <div className="mb-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>{label}</span>
              <span>{value}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${color}`} 
                style={{ width: `${value}%` }}
              ></div>
          </div>
      </div>
  );

  return (
    <div className="border-t border-gray-800 bg-[#0d1117] p-2">
      <div className="bg-[#161b22] border border-gray-800 rounded-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#21262d] p-2 flex justify-between items-center border-b border-gray-800">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Sentinel ML Ops v{evolution.version}
            </h4>
            <div className="flex gap-2 text-[10px] font-mono text-gray-500">
                <span>Projects: {evolution.globalMetrics.totalProjects}</span>
                <span className="text-gray-700">|</span>
                <span>Latency: ~1.2s</span>
            </div>
        </div>

        <div className="p-3 grid grid-cols-2 gap-4">
            {/* Left: Metrics */}
            <div>
                <MetricBar label="Model Accuracy" value={evolution.globalMetrics.averageAccuracy} color="bg-green-500" />
                <MetricBar label="System Uptime" value={evolution.globalMetrics.uptime} color="bg-blue-500" />
                <MetricBar label="Knowledge Index" value={Math.min(100, (evolution.knowledgeCount / 30) * 100)} color="bg-purple-500" />
            </div>

            {/* Right: Logs */}
            <div className="border-l border-gray-700 pl-3">
                 <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Neural Logs</div>
                 <div className="space-y-1 max-h-16 overflow-y-auto custom-scrollbar">
                    {evolution.patterns.length === 0 ? (
                        <div className="text-[10px] text-gray-600 font-mono italic">
                            Awaiting input stream...
                        </div>
                    ) : (
                        evolution.patterns.map(pattern => (
                            <div key={pattern.id} className="text-[9px] font-mono">
                                <span className="text-green-500/80">➜</span> {pattern.trigger}
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
