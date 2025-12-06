
import { Extension } from "../types";

export const DEFAULT_EXTENSIONS: Extension[] = [
    {
        id: 'ext-pypi',
        name: 'PyPI Explorer',
        description: 'Deep integration with Python Package Index. Security scoring and dependency graph.',
        icon: '🐍',
        category: 'Language',
        version: '1.2.0',
        isEnabled: true,
        componentView: 'pypi',
        author: 'eCylogy Core'
    },
    {
        id: 'ext-npm',
        name: 'NPM Intelligence',
        description: 'Node.js package analyzer with TypeScript definition checks.',
        icon: '🟥',
        category: 'Language',
        version: '2.0.1',
        isEnabled: true,
        componentView: 'npm',
        author: 'eCylogy Core'
    },
    {
        id: 'ext-universal',
        name: 'Universal Registry',
        description: 'Polymorphic package manager for Rust, Go, Java, and 10+ languages.',
        icon: '🌐',
        category: 'Tool',
        version: '1.0.0',
        isEnabled: true,
        componentView: 'universal',
        author: 'Sentinel AI'
    },
    {
        id: 'ext-cloud',
        name: 'Cloud Ecosystem',
        description: 'Deploy to Vercel, Netlify, Fly.io, and 15+ providers.',
        icon: '☁️',
        category: 'Tool',
        version: '3.1.0',
        isEnabled: true,
        componentView: 'cloud',
        author: 'DevOps Bot'
    },
    {
        id: 'ext-binary',
        name: 'Binary Lab',
        description: 'Low-level computer science visualization. Bit manipulation and logic gates.',
        icon: '🧮',
        category: 'Tool',
        version: '0.9.beta',
        isEnabled: true,
        componentView: 'academy', // Integrated into academy for now
        author: 'Professor Code'
    },
    {
        id: 'ext-architect',
        name: 'System Rewriter',
        description: 'Self-healing engine capable of rewriting eCylogy in different stacks.',
        icon: '🧬',
        category: 'AI',
        version: '6.0.0',
        isEnabled: true,
        componentView: 'architect',
        author: 'Root'
    }
];

export class ExtensionService {
    private extensions: Extension[] = [];

    constructor() {
        // In a real app, load from DB/LocalStorage
        const stored = localStorage.getItem('ecylogy-extensions');
        if (stored) {
            this.extensions = JSON.parse(stored);
        } else {
            this.extensions = DEFAULT_EXTENSIONS;
        }
    }

    public getExtensions(): Extension[] {
        return this.extensions;
    }

    public toggleExtension(id: string): Extension[] {
        this.extensions = this.extensions.map(ext => 
            ext.id === id ? { ...ext, isEnabled: !ext.isEnabled } : ext
        );
        this.save();
        return this.extensions;
    }

    private save() {
        localStorage.setItem('ecylogy-extensions', JSON.stringify(this.extensions));
    }
}
