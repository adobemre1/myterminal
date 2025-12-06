
import { GeneratedProject, AgentMessage } from "../types";

const DB_NAME = 'eCylogyDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_SETTINGS = 'settings';

export class DatabaseService {
    private db: IDBDatabase | null = null;

    constructor() {}

    /**
     * Initialize the Database and Handle Upgrades
     */
    public init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("Database error:", event);
                reject("Failed to open database");
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // Create Projects Store
                if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
                    db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
                }

                // Create Settings/Meta Store
                if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
                    db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                this.migrateLocalStorage(); // Auto-migrate legacy data
                resolve();
            };
        });
    }

    /**
     * Migrate data from legacy LocalStorage to IndexedDB
     */
    private async migrateLocalStorage() {
        const legacyProjects = localStorage.getItem('omnicode-projects');
        if (legacyProjects) {
            try {
                const projects: GeneratedProject[] = JSON.parse(legacyProjects);
                if (Array.isArray(projects) && projects.length > 0) {
                    console.log(`[DB] Migrating ${projects.length} projects from LocalStorage...`);
                    for (const p of projects) {
                        await this.saveProject(p);
                    }
                    localStorage.removeItem('omnicode-projects'); // Clean up
                    console.log(`[DB] Migration complete.`);
                }
            } catch (e) {
                console.error("Migration failed", e);
            }
        }
    }

    // --- PROJECT OPERATIONS ---

    public saveProject(project: GeneratedProject): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB not initialized");
            const transaction = this.db.transaction([STORE_PROJECTS], 'readwrite');
            const store = transaction.objectStore(STORE_PROJECTS);
            const request = store.put(project);

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Failed to save project");
        });
    }

    public getAllProjects(): Promise<GeneratedProject[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB not initialized");
            const transaction = this.db.transaction([STORE_PROJECTS], 'readonly');
            const store = transaction.objectStore(STORE_PROJECTS);
            const request = store.getAll();

            request.onsuccess = () => {
                // Sort by createdAt descending
                const res = request.result as GeneratedProject[];
                res.sort((a, b) => b.createdAt - a.createdAt);
                resolve(res);
            };
            request.onerror = () => reject("Failed to fetch projects");
        });
    }

    public deleteProject(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB not initialized");
            const transaction = this.db.transaction([STORE_PROJECTS], 'readwrite');
            const store = transaction.objectStore(STORE_PROJECTS);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Failed to delete project");
        });
    }

    public clearAllProjects(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB not initialized");
            const transaction = this.db.transaction([STORE_PROJECTS], 'readwrite');
            const store = transaction.objectStore(STORE_PROJECTS);
            const request = store.clear();
            request.onsuccess = () => resolve();
        });
    }

    // --- CHAT PERSISTENCE (Optional, usually kept in localstorage for speed, but can move here) ---
    // For now, we keep chat in localStorage for simplicity as it's usually ephemeral or small text.
}
