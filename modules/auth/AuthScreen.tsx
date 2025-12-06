
import React, { useState } from 'react';
import { AuthService } from '../../services/auth';

interface AuthScreenProps {
    authService: AuthService;
    onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ authService, onLoginSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await authService.login(email, password);
                onLoginSuccess();
            } else if (mode === 'register') {
                await authService.register(email, name);
                onLoginSuccess();
            } else if (mode === 'forgot') {
                const msg = await authService.sendPasswordResetEmail(email);
                setSuccessMsg(msg);
                setTimeout(() => setMode('login'), 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-violet-600 to-cyan-600"></div>

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#080c14] border border-gray-700 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        <span className="bg-gradient-to-br from-cyan-400 to-violet-500 text-transparent bg-clip-text">eCy</span>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    {mode === 'login' && 'Welcome to eCylogy'}
                    {mode === 'register' && 'Join the Ecosystem'}
                    {mode === 'forgot' && 'Account Recovery'}
                </h2>
                <p className="text-gray-400 text-center text-sm mb-8">
                    {mode === 'login' && 'Sign in to access your projects'}
                    {mode === 'register' && 'Create your universal developer profile'}
                    {mode === 'forgot' && 'Enter your email to reset credentials'}
                </p>

                {error && (
                    <div className="mb-4 bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded text-sm text-center flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 bg-green-900/20 border border-green-800 text-green-300 px-4 py-3 rounded text-sm text-center">
                         {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div className="animate-fade-in">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-[#080c14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                placeholder="e.g. Emre Can Yalçın"
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-[#080c14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                            placeholder="name@company.com"
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Password</label>
                                {mode === 'login' && (
                                    <button 
                                        type="button"
                                        onClick={() => setMode('forgot')}
                                        className="text-[10px] text-cyan-400 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-[#080c14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center gap-2 mt-6"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <>
                                {mode === 'login' && 'Sign In'}
                                {mode === 'register' && 'Create Account'}
                                {mode === 'forgot' && 'Send Reset Link'}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm border-t border-gray-800 pt-4">
                    {mode !== 'forgot' ? (
                        <>
                            <span className="text-gray-500">
                                {mode === 'login' ? "New here? " : "Already have an account? "}
                            </span>
                            <button 
                                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                                className="text-cyan-400 hover:text-cyan-300 font-bold"
                            >
                                {mode === 'login' ? "Create an account" : "Sign in"}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => { setMode('login'); setError(''); }}
                            className="text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto text-xs"
                        >
                            ← Back to Login
                        </button>
                    )}
                </div>
                
                {mode === 'login' && (
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-gray-600 mb-1">PROJECT OWNER ACCESS</p>
                        <code className="bg-[#080c14] border border-gray-800 px-2 py-1 rounded text-[10px] text-gray-400 font-mono block w-fit mx-auto cursor-help" title="Use the configured password S3nsu4l.">
                            adobemre1@gmail.com
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
};