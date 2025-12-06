
import React from 'react';
import { OrchestraPhase, OrchestraRole } from '../types';

interface OrchestraStatusProps {
  phases: OrchestraPhase[];
}

const RoleIcon: React.FC<{ role: OrchestraRole }> = ({ role }) => {
  switch (role) {
    case OrchestraRole.ARCHITECT: return <span>📐</span>;
    case OrchestraRole.TECH_LEAD: return <span>🛡️</span>;
    case OrchestraRole.DEVELOPER: return <span>🔨</span>;
    case OrchestraRole.QA_ENGINEER: return <span>🩺</span>;
    default: return <span>🤖</span>;
  }
};

export const OrchestraStatus: React.FC<OrchestraStatusProps> = ({ phases }) => {
  return (
    <div className="bg-[#161b22] border-b border-gray-800 p-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Orchestra Engine Status</h3>
      <div className="flex flex-col gap-3">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              phase.status === 'active' ? 'bg-yellow-400 animate-pulse' :
              phase.status === 'success' ? 'bg-green-500' :
              phase.status === 'failed' ? 'bg-red-500' :
              'bg-gray-700'
            }`} />
            
            {/* Icon */}
            <div className={`w-8 h-8 rounded bg-[#21262d] flex items-center justify-center text-sm border ${
               phase.status === 'active' ? 'border-yellow-500/50' : 'border-gray-700'
            }`}>
              <RoleIcon role={phase.role} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
               <div className={`text-sm font-medium ${
                 phase.status === 'pending' ? 'text-gray-600' : 'text-gray-200'
               }`}>
                 {phase.role}
               </div>
               <div className="text-xs text-gray-500 truncate">
                 {phase.status === 'active' ? phase.action : 
                  phase.status === 'success' ? (phase.details || 'Completed') : 
                  phase.status === 'pending' ? 'Waiting...' : 'Failed'}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
