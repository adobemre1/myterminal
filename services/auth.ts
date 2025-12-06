
import { User, UserRole, AuthState } from "../types";

const AUTH_STORAGE_KEY = 'omnicode-auth-v2';
const USERS_STORAGE_KEY = 'omnicode-users-db-v2';

// --- OWNER CREDENTIALS (ROOT) ---
const OWNER_USER: User = {
    id: 'owner-root-001',
    email: 'adobemre1@gmail.com',
    name: 'Emre Can Yalçın',
    role: 'super_admin',
    createdAt: Date.now(),
    lastLogin: Date.now(),
    avatar: '👑' // Special Icon for Owner
};

const OWNER_PASSWORD_HASH = 'S3nsu4l.'; // In a real app, this would be a bcrypt hash

export class AuthService {
    private currentUser: User | null = null;

    constructor() {
        this.loadSession();
        this.ensureOwnerExists();
    }

    private loadSession() {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    private ensureOwnerExists() {
        const users = this.getUsersDB();
        if (!users.find(u => u.email === OWNER_USER.email)) {
            users.unshift(OWNER_USER); // Add owner to top
            this.saveUsersDB(users);
        }
    }

    private getUsersDB(): User[] {
        const db = localStorage.getItem(USERS_STORAGE_KEY);
        return db ? JSON.parse(db) : [OWNER_USER];
    }

    private saveUsersDB(users: User[]) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // --- AUTHENTICATION ---

    public login(email: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.getUsersDB();
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    reject(new Error("User not found."));
                    return;
                }

                if (user.isBanned) {
                    reject(new Error("Access Denied: Your account has been suspended by the Project Owner."));
                    return;
                }

                // Password Check Logic
                let isValid = false;
                
                if (user.role === 'super_admin' && user.email === OWNER_USER.email) {
                    // Check Hardcoded Owner Password
                    isValid = password === OWNER_PASSWORD_HASH;
                } else {
                    // Check Demo/General Password
                    // In real app: verifyHash(password, user.passwordHash)
                    isValid = password.length > 5; 
                }

                if (isValid) {
                    user.lastLogin = Date.now();
                    this.currentUser = user;
                    
                    // Update user in DB (lastLogin)
                    const updatedUsers = users.map(u => u.id === user.id ? user : u);
                    this.saveUsersDB(updatedUsers);
                    
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error("Invalid password."));
                }
            }, 800);
        });
    }

    public register(email: string, name: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.getUsersDB();
                if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                    reject(new Error("This email is already registered. Try logging in."));
                    return;
                }

                const newUser: User = {
                    id: crypto.randomUUID(),
                    email,
                    name,
                    role: 'user', // Default role is always user
                    createdAt: Date.now(),
                    lastLogin: Date.now(),
                    avatar: '👤'
                };

                users.push(newUser);
                this.saveUsersDB(users);
                
                this.currentUser = newUser;
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    }

    // --- MAIL INTEGRATION SIMULATION ---

    public sendPasswordResetEmail(email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.getUsersDB();
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    // Security best practice: Don't reveal if user exists
                    // But for this MVP we will resolve anyway to simulate success
                    resolve("If an account exists, a reset link has been sent.");
                    return;
                }
                
                console.log(`[MAIL_SERVER] Sending Password Reset Template to ${email}...`);
                resolve(`Recovery email sent to ${email}. Please check your inbox.`);
            }, 1000);
        });
    }

    public inviteAdmin(email: string, role: UserRole): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.isAdmin()) return reject(new Error("Unauthorized"));

            setTimeout(() => {
                const users = this.getUsersDB();
                if (users.find(u => u.email === email)) {
                    reject(new Error("User already exists in the system. Edit their role instead."));
                    return;
                }

                // Create the user in "Pending" state (Simulated by creating them immediately for MVP)
                const newUser: User = {
                    id: crypto.randomUUID(),
                    email,
                    name: 'Pending Invitation...',
                    role: role,
                    createdAt: Date.now(),
                    lastLogin: 0,
                    avatar: '✉️'
                };

                users.push(newUser);
                this.saveUsersDB(users);
                console.log(`[MAIL_SERVER] Sending Invitation to ${email} with role ${role}...`);
                
                resolve(`Invitation sent to ${email}. They can now set up their account.`);
            }, 1000);
        });
    }

    // --- SESSION MANAGEMENT ---

    public logout() {
        this.currentUser = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    public getUser(): User | null {
        return this.currentUser;
    }

    public isAdmin(): boolean {
        return this.currentUser?.role === 'admin' || this.currentUser?.role === 'super_admin';
    }

    public isOwner(): boolean {
        return this.currentUser?.email === OWNER_USER.email;
    }

    // --- ADMIN ACTIONS ---

    public getAllUsers(): User[] {
        if (!this.isAdmin()) throw new Error("Unauthorized Access Logged.");
        return this.getUsersDB();
    }

    public updateUserRole(userId: string, newRole: UserRole) {
        if (!this.isOwner()) throw new Error("Only the Project Owner (Emre Can Yalçın) can promote/demote admins.");
        
        const users = this.getUsersDB();
        const targetUser = users.find(u => u.id === userId);
        
        if (targetUser?.email === OWNER_USER.email) {
             throw new Error("Cannot change role of the Project Owner.");
        }

        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users[idx].role = newRole;
            this.saveUsersDB(users);
        }
    }

    public toggleBanUser(userId: string) {
        if (!this.isAdmin()) throw new Error("Unauthorized");
        
        const users = this.getUsersDB();
        const targetUser = users.find(u => u.id === userId);

        if (targetUser?.email === OWNER_USER.email) {
            throw new Error("CRITICAL SECURITY: Cannot ban the System Root/Owner.");
        }

        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users[idx].isBanned = !users[idx].isBanned;
            this.saveUsersDB(users);
        }
    }
}
