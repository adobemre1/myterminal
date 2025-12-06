
import React, { useState, useEffect } from 'react';
import { TestSuite, TestCase } from '../../types';

interface TestRunnerProps {
    testSuites: TestSuite[];
    onRunTests: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ testSuites, onRunTests }) => {
    const [running, setRunning] = useState(false);
    const [localSuites, setLocalSuites] = useState<TestSuite[]>(testSuites);

    useEffect(() => {
        setLocalSuites(testSuites);
    }, [testSuites]);

    const handleRun = async () => {
        setRunning(true);
        // Reset statuses
        const resetSuites = localSuites.map(s => ({
            ...s,
            status: 'pending' as const,
            cases: s.cases.map(c => ({ ...c, status: 'pending' as const, errorLog: undefined }))
        }));
        setLocalSuites(resetSuites);

        // Simulation Loop
        for (let i = 0; i < resetSuites.length; i++) {
            const suite = resetSuites[i];
            
            // Set Suite Running
            setLocalSuites(prev => {
                const copy = [...prev];
                copy[i].status = 'running';
                return copy;
            });

            // Run Cases
            for (let j = 0; j < suite.cases.length; j++) {
                await new Promise(r => setTimeout(r, 600)); // Simulate test duration
                
                setLocalSuites(prev => {
                    const copy = [...prev];
                    const randomFail = Math.random() > 0.9; // 10% chance of random fail simulation
                    const isSuccess = !randomFail;
                    
                    copy[i].cases[j].status = isSuccess ? 'passed' : 'failed';
                    copy[i].cases[j].duration = Math.floor(Math.random() * 50) + 10;
                    
                    if (!isSuccess) {
                        copy[i].cases[j].errorLog = `AssertionError: Expected 200 but got 500\n    at ${suite.fileName}:${j * 10 + 5}`;
                        copy[i].status = 'failed';
                    }
                    return copy;
                });
            }

            // Finalize Suite Status (if not already failed)
            setLocalSuites(prev => {
                 const copy = [...prev];
                 if (copy[i].status !== 'failed') copy[i].status = 'passed';
                 return copy;
            });
        }
        setRunning(false);
    };

    const totalTests = localSuites.reduce((acc, s) => acc + s.cases.length, 0);
    const passedTests = localSuites.reduce((acc, s) => acc + s.cases.filter(c => c.status === 'passed').length, 0);
    const failedTests = localSuites.reduce((acc, s) => acc + s.cases.filter(c => c.status === 'failed').length, 0);

    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-gray-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 bg-[#161b22] flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        Test Suite Runner
                        {running && <span className="text-xs font-normal text-blue-400 animate-pulse">● Running tests...</span>}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Global Standard Quality Assurance (PyTest/Jest Simulation)</p>
                </div>
                <button
                    onClick={handleRun}
                    disabled={running}
                    className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-md font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {running ? (
                         <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>
                    )}
                    Run All Tests
                </button>
            </div>

            {/* Summary Bar */}
            <div className="flex border-b border-gray-800 bg-[#0d1117]">
                <div className="flex-1 p-4 border-r border-gray-800 text-center">
                    <div className="text-2xl font-bold text-white">{totalTests}</div>
                    <div className="text-xs uppercase text-gray-500 font-bold">Total</div>
                </div>
                 <div className="flex-1 p-4 border-r border-gray-800 text-center">
                    <div className="text-2xl font-bold text-green-500">{passedTests}</div>
                    <div className="text-xs uppercase text-green-700 font-bold">Passed</div>
                </div>
                 <div className="flex-1 p-4 text-center">
                    <div className={`text-2xl font-bold ${failedTests > 0 ? 'text-red-500' : 'text-gray-500'}`}>{failedTests}</div>
                    <div className="text-xs uppercase text-gray-500 font-bold">Failed</div>
                </div>
            </div>

            {/* Test List */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                {localSuites.map(suite => (
                    <div key={suite.id} className="border border-gray-700 rounded-lg overflow-hidden bg-[#161b22]">
                        <div className="bg-[#21262d] px-4 py-3 flex items-center justify-between border-b border-gray-700">
                             <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-blue-300">{suite.fileName}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                {suite.status === 'passed' && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">PASS</span>}
                                {suite.status === 'failed' && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">FAIL</span>}
                                {suite.status === 'running' && <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">RUNNING</span>}
                                {suite.status === 'pending' && <span className="text-xs text-gray-500">PENDING</span>}
                             </div>
                        </div>
                        <div className="p-0">
                            {suite.cases.map(testCase => (
                                <div key={testCase.id} className="border-b border-gray-800 last:border-0 px-4 py-3 hover:bg-[#21262d]/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {testCase.status === 'passed' && <span className="text-green-500">✓</span>}
                                            {testCase.status === 'failed' && <span className="text-red-500">✕</span>}
                                            {testCase.status === 'running' && <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>}
                                            {testCase.status === 'pending' && <span className="text-gray-600">○</span>}
                                            
                                            <span className={`text-sm ${testCase.status === 'failed' ? 'text-red-300' : 'text-gray-300'}`}>
                                                {testCase.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-600">{testCase.duration ? `${testCase.duration}ms` : '-'}</span>
                                    </div>
                                    {testCase.errorLog && (
                                        <div className="mt-2 ml-6 p-3 bg-red-900/10 border-l-2 border-red-500 text-red-300 font-mono text-xs whitespace-pre-wrap">
                                            {testCase.errorLog}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
