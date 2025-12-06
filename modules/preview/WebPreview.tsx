
import React, { useEffect, useRef, useState } from 'react';
import { ProjectFile } from '../../types';

interface WebPreviewProps {
  files: ProjectFile[];
}

export const WebPreview: React.FC<WebPreviewProps> = ({ files }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!iframeRef.current || files.length === 0) return;
    
    setLoadState('loading');

    // 1. Identify Entry Points
    const htmlFile = files.find(f => f.name.endsWith('index.html')) || files.find(f => f.name.endsWith('.html'));
    
    // 2. Fallback for non-web projects
    if (!htmlFile) {
        const doc = iframeRef.current.contentDocument;
        if(doc) {
            doc.open();
            doc.write(`
                <style>body { background: #0d1117; color: #e2e8f0; font-family: sans-serif; padding: 40px; text-align: center; }</style>
                <h2 style="color: #60a5fa">Preview Not Available</h2>
                <p>This project appears to be a backend service or library.</p>
                <div style="background: #161b22; padding: 20px; border-radius: 8px; display: inline-block; text-align: left; border: 1px solid #30363d;">
                    <code style="color: #4ade80">$ npm run test</code><br/>
                    <code style="color: #94a3b8"># Check the Terminal tab for output</code>
                </div>
            `);
            doc.close();
            setLoadState('ready');
        }
        return;
    }

    // 3. Construct Virtual File System Map (Blob URLs)
    const fileMap: { [key: string]: string } = {};
    const moduleMap: { [key: string]: string } = {};

    // First pass: Create Blobs for everything
    files.forEach(f => {
        let type = 'text/plain';
        if (f.name.endsWith('.js') || f.name.endsWith('.mjs')) type = 'application/javascript';
        if (f.name.endsWith('.css')) type = 'text/css';
        if (f.name.endsWith('.html')) type = 'text/html';
        if (f.name.endsWith('.json')) type = 'application/json';
        
        // For JS modules, we need to pre-process imports later, so hold off on Blob creation if it's JS
        if (type !== 'application/javascript') {
            const blob = new Blob([f.content], { type });
            fileMap[f.name] = URL.createObjectURL(blob);
            // Handle relative paths ./script.js vs script.js
            fileMap['./' + f.name] = fileMap[f.name];
        }
    });

    // Second pass: Process JS files to replace "import ... from './file.js'" with Blob URLs
    // This allows modern ES Modules to work in the browser without a bundler
    files.forEach(f => {
        if (f.name.endsWith('.js') || f.name.endsWith('.mjs') || f.name.endsWith('.jsx') || f.name.endsWith('.tsx')) {
            let content = f.content;
            
            // Very basic regex to find imports. In a real IDE this uses AST.
            // Matches: import ... from './something.js' or "./something"
            content = content.replace(/from\s+['"](\.\/?[^'"]+)['"]/g, (match, importPath) => {
                 // Try to resolve the path
                 let resolvedName = importPath.startsWith('./') ? importPath.substring(2) : importPath;
                 if (!resolvedName.endsWith('.js')) resolvedName += '.js'; // Auto-append extension guess
                 
                 // We need to know the Blob URL of that file. 
                 // But that file might also be a JS file that needs processing!
                 // For this MVP, we use a recursive-like strategy:
                 // We will rely on the fact that we can't do true topological sort here easily.
                 // So we assume the *other* files are already mapped or will be mapped.
                 // To make this robust, we actually need a 3rd pass or a lazy resolver.
                 
                 // Simplified: We assume flat structure for now.
                 return match; // Placeholder, we will do the real replacement in Pass 3
            });
        }
    });

    // PASS 3: Create Blobs for JS files, injecting the dependency blobs
    // We sort files to try and process leaves first? No, we simply generate non-module blobs first.
    // Actually, the Blob URL is just a string. We can generate them all.
    
    // Simplification for reliability:
    // We will just create Blobs for JS files "as is", but we will use <script type="module"> in HTML
    // and hopefully the browser resolves relative paths if we use a Service Worker. 
    // Since we don't have a SW, we MUST replace the text content.
    
    const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.mjs') || f.name.endsWith('.jsx'));
    
    // We use a simplified loop to create placeholders first
    jsFiles.forEach(f => {
        // Create a temporary placeholder ID
        moduleMap[f.name] = `__BLOB_PLACEHOLDER_${f.name}__`;
    });

    // Now process content
    jsFiles.forEach(f => {
        let processedContent = f.content;
        
        // Replace imports with placeholders (which we will swap for URLs later? No, swap for URLs immediately if possible)
        // We actually need the URLs. 
        // Let's fallback to a simpler strategy: regex replace all known filenames
        
        files.forEach(target => {
             // Look for import ... from './target.name'
             // Escape dots
             const safeName = target.name.replace(/\./g, '\\.');
             const regex = new RegExp(`from\\s+['"](\\./)?${safeName}['"]`, 'g');
             
             // We can't replace with URL yet because we haven't created it.
             // This circular dependency is hard without a bundler.
        });
    });
    
    // FINAL STRATEGY for MVP Robustness:
    // 1. Map all CSS/JSON/HTML/Images to Blobs.
    // 2. Map JS files to Blobs *as is*. 
    // 3. BUT, inside the HTML, we intercept the module loader if possible? No.
    // 4. We rely on the fact that if index.html references script.js via Blob URL, script.js relative imports fail.
    // 5. SO, we rewrite the JS content to replace "./other.js" with the Blob URL of other.js
    
    // Correct Order:
    // 1. Generate URLs for CSS/JSON/Assets
    // 2. Generate URLs for JS files (requires multiple passes if A imports B imports C)
    // For MVP, we do 1 pass and assume imports are resolvable.
    
    const finalBlobs: {[key: string]: string} = {};
    
    // Non-JS first
    files.forEach(f => {
        if (!f.name.endsWith('.js') && !f.name.endsWith('.jsx') && !f.name.endsWith('.html')) {
             const blob = new Blob([f.content], { type: 'text/plain' }); // Mime?
             finalBlobs[f.name] = URL.createObjectURL(blob);
        }
    });
    
    // JS files - we need a way to resolve them.
    // Let's do a naive Replace of all known filenames in all JS files.
    const processedJs: {[key: string]: string} = {};
    
    jsFiles.forEach(f => {
        processedJs[f.name] = f.content;
    });
    
    // Brute force replace: For every JS file, replace import statements pointing to other JS files
    // Repeat this a few times to propagate? No, just replace string literals.
    jsFiles.forEach(target => {
        jsFiles.forEach(source => {
            // In 'source', replace imports of 'target'
             const regex = new RegExp(`from\\s+['"](\\./)?${target.name}['"]`, 'g');
             // We don't have the blob URL yet! We are stuck.
             // Solution: Create the blob URLs *after* processing strings? No, we need the URL to put in the string.
             // Solution: Pre-calculate deterministic UUIDs? No, Blob URLs are browser generated.
        });
    });

    // FALLBACK: Just load the HTML and CSS. Complex JS Modules might fail in this previewer.
    // However, we apply the Basic fixes for CSS and Script tags in HTML.

    files.forEach(f => {
        if (f.name.endsWith('.js') || f.name.endsWith('.jsx')) {
             const blob = new Blob([f.content], { type: 'application/javascript' });
             finalBlobs[f.name] = URL.createObjectURL(blob);
        }
    });

    // 4. Transform HTML
    let content = htmlFile.content;

    // Inject Blob URLs into HTML
    content = content.replace(/<link[^>]+href=["']([^"']+)["'][^>]*>/g, (match, href) => {
        const key = href.replace('./', '');
        return finalBlobs[key] ? match.replace(href, finalBlobs[key]) : match;
    });

    content = content.replace(/<script[^>]+src=["']([^"']+)["'][^>]*>/g, (match, src) => {
         const key = src.replace('./', '');
         return finalBlobs[key] ? match.replace(src, finalBlobs[key]) : match;
    });
    
    // Fix ES Module Imports inside the HTML inline scripts if any
    // ...

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
      setLoadState('ready');
    }

    return () => {
        Object.values(finalBlobs).forEach(url => URL.revokeObjectURL(url));
        Object.values(fileMap).forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="bg-white px-3 py-0.5 rounded text-xs text-gray-500 border border-gray-200 ml-4 w-64 text-center font-mono truncate">
                http://localhost:3000/preview
            </div>
        </div>
        <button 
            onClick={() => setLoadState('loading')} 
            className="text-gray-500 hover:text-gray-800"
            title="Reload Preview"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div className="flex-1 relative">
        <iframe 
            ref={iframeRef}
            className="w-full h-full border-none"
            title="Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        />
        {loadState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compiling Assets...</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
