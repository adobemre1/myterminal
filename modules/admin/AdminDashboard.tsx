
import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/auth';
import { User, SystemEvolution, UserRole } from '../../types';

interface AdminDashboardProps {
    authService: AuthService;
    evolution: SystemEvolution;
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ authService, evolution, onClose }) => {
    const [view, setView] = useState<'overview' | 'users' | 'system'>('overview');
    const [users, setUsers] = useState<User[]>([]);
    
    // Invite Modal State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('admin');

    useEffect(() => {
        if (view === 'users') {
            setUsers(authService.getAllUsers());
        }
    }, [view, authService]);

    const handlePromote = (id: string) => {
        try {
            authService.updateUserRole(id, 'admin');
            setUsers(authService.getAllUsers());
        } catch (e) { alert(e instanceof Error ? e.message : e); }
    };

    const handleBan = (id: string) => {
        try {
            authService.toggleBanUser(id);
            setUsers(authService.getAllUsers());
        } catch (e) { alert(e instanceof Error ? e.message : e); }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const msg = await authService.inviteAdmin(inviteEmail, inviteRole);
            alert(msg);
            setShowInviteModal(false);
            setInviteEmail('');
            setUsers(authService.getAllUsers());
        } catch (e) {
            alert(e instanceof Error ? e.message : "Failed to invite");
        }
    }

    const isOwner = authService.isOwner();

    return (
        <div className="flex h-full bg-[#0d1117] text-white">
            {/* Admin Sidebar */}
            <div className="w-64 bg-[#161b22] border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800 bg-[#0d1117]">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                        <span>🛡️</span> Command Center
                    </h2>
                    <div className="text-[10px] text-gray-500 mt-1">
                        {isOwner ? 'Root Access Granted' : 'Admin Privileges'}
                    </div>
                </div>
                <div className="flex-1 p-2 space-y-1">
                    <button 
                        onClick={() => setView('overview')}
                        className={`w-full text-left px-4 py-2 rounded text-sm ${view === 'overview' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setView('users')}
                        className={`w-full text-left px-4 py-2 rounded text-sm ${view === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        User & Roles
                    </button>
                    <button 
                        onClick={() => setView('system')}
                        className={`w-full text-left px-4 py-2 rounded text-sm ${view === 'system' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        System Health
                    </button>
                </div>
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={onClose}
                        className="w-full text-center px-4 py-2 border border-gray-700 rounded text-xs text-gray-400 hover:bg-gray-800"
                    >
                        Exit Console
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                
                {/* INVITE MODAL */}
                {showInviteModal && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                             <h3 className="text-xl font-bold mb-4">Invite New Administrator</h3>
                             <form onSubmit={handleInvite}>
                                 <div className="mb-4">
                                     <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Email Address</label>
                                     <input 
                                        type="email" 
                                        required 
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-gray-600 rounded p-2 text-white"
                                        placeholder="colleague@omnicode.ai"
                                     />
                                 </div>
                                 <div className="mb-6">
                                     <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Role</label>
                                     <select 
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value as UserRole)}
                                        className="w-full bg-[#0d1117] border border-gray-600 rounded p-2 text-white"
                                     >
                                         <option value="user">Standard User</option>
                                         <option value="admin">Administrator</option>
                                         <option value="super_admin" disabled={!isOwner}>Project Owner (Transfer)</option>
                                     </select>
                                     <p className="text-[10px] text-gray-500 mt-1">Admin: Can manage users. User: Can code and view projects.</p>
                                 </div>
                                 <div className="flex justify-end gap-3">
                                     <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                     <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">Send Invitation</button>
                                 </div>
                             </form>
                        </div>
                    </div>
                )}

                {view === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl font-bold mb-8">System Overview</h1>
                        
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Total Users</div>
                                <div className="text-4xl font-bold text-white">{authService.getAllUsers().length}</div>
                                <div className="text-green-500 text-xs mt-2">↑ 12% vs last week</div>
                            </div>
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Knowledge Base</div>
                                <div className="text-4xl font-bold text-blue-400">{evolution.knowledgeCount}</div>
                                <div className="text-gray-400 text-xs mt-2">Libraries Indexed</div>
                            </div>
                            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-2">System Version</div>
                                <div className="text-4xl font-bold text-purple-400">v{evolution.version}</div>
                                <div className="text-gray-400 text-xs mt-2">Sentinel Engine Active</div>
                            </div>
                        </div>

                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">Audit Log</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm py-2 border-b border-gray-800">
                                    <span className="text-green-500 text-xs">●</span>
                                    <span className="flex-1 text-gray-300">Emre Can Yalçın (Owner) accessed Admin Console</span>
                                    <span className="text-gray-500 text-xs">Now</span>
                                </div>
                                {evolution.patterns.slice(0, 4).map(pat => (
                                    <div key={pat.id} className="flex items-center gap-3 text-sm py-2 border-b border-gray-800 last:border-0">
                                        <span className="text-blue-500 text-xs">●</span>
                                        <span className="flex-1 text-gray-300">{pat.insight}</span>
                                        <span className="text-gray-500 text-xs">{new Date(pat.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'users' && (
                    <div className="space-y-6 animate-fade-in">
                         <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">User Management</h1>
                                <p className="text-sm text-gray-500">Manage role-based access control (RBAC)</p>
                            </div>
                            <button 
                                onClick={() => setShowInviteModal(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                <span>✉</span> Invite User
                            </button>
                         </div>

                         <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
                             <table className="w-full text-left text-sm">
                                 <thead className="bg-[#0d1117] text-gray-400 text-xs uppercase">
                                     <tr>
                                         <th className="px-6 py-4">User Identity</th>
                                         <th className="px-6 py-4">Role</th>
                                         <th className="px-6 py-4">Status</th>
                                         <th className="px-6 py-4">Last Activity</th>
                                         <th className="px-6 py-4">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-800">
                                     {users.map(u => (
                                         <tr key={u.id} className="hover:bg-[#21262d] transition-colors">
                                             <td className="px-6 py-4">
                                                 <div className="flex items-center gap-3">
                                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${u.role === 'super_admin' ? 'bg-yellow-900/50 border border-yellow-600' : 'bg-gray-700'}`}>
                                                         {u.avatar || u.name[0]}
                                                     </div>
                                                     <div>
                                                         <div className="font-bold text-white flex items-center gap-2">
                                                            {u.name}
                                                            {u.email === 'adobemre1@gmail.com' && <span className="text-[10px] bg-yellow-900 text-yellow-200 px-1 rounded">OWNER</span>}
                                                         </div>
                                                         <div className="text-gray-500 text-xs">{u.email}</div>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                     u.role === 'super_admin' ? 'bg-red-900/40 text-red-400 border border-red-900' :
                                                     u.role === 'admin' ? 'bg-purple-900/40 text-purple-400 border border-purple-900' :
                                                     'bg-gray-800 text-gray-400 border border-gray-700'
                                                 }`}>
                                                     {u.role.replace('_', ' ')}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4">
                                                 {u.isBanned ? (
                                                     <span className="text-red-500 font-bold text-xs bg-red-900/20 px-2 py-1 rounded">SUSPENDED</span>
                                                 ) : (
                                                     <span className="text-green-500 text-xs bg-green-900/20 px-2 py-1 rounded">Active</span>
                                                 )}
                                             </td>
                                             <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                                 {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Pending'}
                                             </td>
                                             <td className="px-6 py-4 flex gap-2">
                                                 {u.role !== 'super_admin' && (
                                                     <>
                                                        {isOwner && (
                                                            <button 
                                                                onClick={() => handlePromote(u.id)}
                                                                className="text-xs bg-blue-900/30 text-blue-400 border border-blue-900 px-2 py-1 rounded hover:bg-blue-900/50"
                                                                title="Promote to Admin"
                                                            >
                                                                ▲ Promote
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleBan(u.id)}
                                                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                                                                u.isBanned 
                                                                ? 'bg-green-900/30 text-green-400 border-green-900 hover:bg-green-900/50'
                                                                : 'bg-red-900/30 text-red-400 border-red-900 hover:bg-red-900/50'
                                                            }`}
                                                        >
                                                            {u.isBanned ? 'Unlock' : 'Suspend'}
                                                        </button>
                                                     </>
                                                 )}
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                )}

                {view === 'system' && (
                     <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl font-bold mb-8">System Configuration (God Mode)</h1>
                        
                        <div className="bg-red-900/10 border border-red-900/50 rounded-xl p-6">
                            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Dangerous Operations
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">Actions here affect the global Sentinel Engine and all connected clients. Proceed with caution.</p>
                            
                            <div className="flex gap-4">
                                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold text-sm">
                                    Purge Cache
                                </button>
                                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold text-sm">
                                    Reset Neural Weights
                                </button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold text-sm">
                                    Force Sentinel Re-Training
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                             <h3 className="text-lg font-bold mb-4">Environment Variables</h3>
                             <div className="space-y-2 font-mono text-sm">
                                 <div className="flex justify-between p-2 bg-[#0d1117] rounded border border-gray-800">
                                     <span className="text-blue-400">ENV_MODE</span>
                                     <span className="text-gray-400">PRODUCTION</span>
                                 </div>
                                 <div className="flex justify-between p-2 bg-[#0d1117] rounded border border-gray-800">
                                     <span className="text-blue-400">SENTINEL_VERSION</span>
                                     <span className="text-gray-400">{evolution.version}</span>
                                 </div>
                                 <div className="flex justify-between p-2 bg-[#0d1117] rounded border border-gray-800">
                                     <span className="text-blue-400">OWNER_CONTACT</span>
                                     <span className="text-gray-400">adobemre1@gmail.com</span>
                                 </div>
                             </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};
