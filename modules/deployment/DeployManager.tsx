import React, { useState, useEffect } from 'react';

interface DeployManagerProps {
  projectTitle: string;
  onDeploy: (url: string) => void;
}

type StepStatus = 'pending' | 'running' | 'done' | 'failed';

interface DeployStep {
    id: string;
    label: string;
    status: StepStatus;
}

export const DeployManager: React.FC<DeployManagerProps> = ({ projectTitle, onDeploy }) => {
  const [steps, setSteps] = useState<DeployStep[]>([
      { id: '1', label: 'Optimize Assets & Minify', status: 'pending' },
      { id: '2', label: 'Build Docker Container', status: 'pending' },
      { id: '3', label: 'Provision Cloud Resources', status: 'pending' },
      { id: '4', label: 'Propagate DNS', status: 'pending' }
  ]);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  const startDeployment = async () => {
      // Reset
      setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
      setDeployedUrl(null);

      for (let i = 0; i < steps.length; i++) {
          setSteps(prev => {
              const newSteps = [...prev];
              newSteps[i].status = 'running';
              return newSteps;
          });

          await new Promise(r => setTimeout(r, 1200)); // Simulate work

          setSteps(prev => {
            const newSteps = [...prev];
            newSteps[i].status = 'done';
            return newSteps;
        });
      }

      const mockUrl = `https://${projectTitle.toLowerCase().replace(/\s+/g, '-')}.omnicode.app`;
      setDeployedUrl(mockUrl);
      onDeploy(mockUrl);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] p-8 items-center justify-center">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🚀
                </div>
                <h2 className="text-2xl font-bold text-white">Production Deployment</h2>
                <p className="text-gray-400 text-sm mt-2">Deploy your OmniCode project to the global edge network.</p>
            </div>

            <div className="space-y-4 mb-8">
                {steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                            step.status === 'done' ? 'border-green-500 bg-green-900/20 text-green-500' :
                            step.status === 'running' ? 'border-blue-500 border-t-transparent animate-spin' :
                            'border-gray-700 text-gray-600'
                        }`}>
                            {step.status === 'done' ? '✓' : idx + 1}
                        </div>
                        <div className={`flex-1 text-sm ${step.status === 'running' ? 'text-blue-400 font-medium' : 'text-gray-400'}`}>
                            {step.label}
                        </div>
                        {step.status === 'done' && <span className="text-xs text-green-500">Done</span>}
                    </div>
                ))}
            </div>

            {deployedUrl ? (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center animate-fade-in">
                    <p className="text-green-400 text-sm mb-2">Deployment Successful!</p>
                    <a href="#" className="text-lg font-bold text-white hover:underline break-all">{deployedUrl}</a>
                </div>
            ) : (
                <button 
                    onClick={startDeployment}
                    disabled={steps.some(s => s.status === 'running')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25"
                >
                    {steps.some(s => s.status === 'running') ? 'Deploying...' : 'Deploy to Live'}
                </button>
            )}
        </div>
    </div>
  );
};
