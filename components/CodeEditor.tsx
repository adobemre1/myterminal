
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { GhostCursor, CompletionItem, SmartActionType } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  onImageDrop?: (base64: string) => void;
  onSmartAction?: (type: SmartActionType, selection: string) => void; // New
  ghostCursors?: GhostCursor[];
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  readOnly = false,
  onImageDrop,
  onSmartAction,
  ghostCursors = []
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // --- INTELLISENSE STATE ---
  const [suggestions, setSuggestions] = useState<CompletionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  
  // --- CONTEXT MENU STATE ---
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, selection: string } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null); // For calculating cursor position

  const isMarkdown = language === 'markdown';

  useEffect(() => {
    if (isMarkdown && showPreview) {
      Promise.resolve(marked.parse(value)).then(content => setHtmlContent(content));
    }
  }, [value, showPreview, isMarkdown]);

  // --- HEURISTIC INTELLISENSE ENGINE ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (showSuggestions) {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSuggestionIndex(prev => Math.max(prev - 1, 0));
          } else if (e.key === 'Enter' || e.key === 'Tab') {
              e.preventDefault();
              insertSuggestion(suggestions[suggestionIndex]);
          } else if (e.key === 'Escape') {
              setShowSuggestions(false);
          }
      }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      const val = target.value;
      const caret = target.selectionStart;
      
      onChange(val);

      // 1. Calculate Cursor Position for Popup
      if (mirrorRef.current) {
          const subText = val.substring(0, caret);
          mirrorRef.current.textContent = subText;
          const span = document.createElement('span');
          span.textContent = '.';
          mirrorRef.current.appendChild(span);
          setCursorPosition({
              top: span.offsetTop + 20, // offset for line height
              left: span.offsetLeft
          });
      }

      // 2. Token Extraction & Suggestion Logic
      const wordMatch = val.substring(0, caret).match(/(\w+)$/);
      if (wordMatch && !readOnly) {
          const currentWord = wordMatch[1];
          if (currentWord.length > 1) { // Only suggest after 2 chars
              // Extract unique words from document as "Variables"
              const allWords = Array.from(new Set(val.match(/\b\w+\b/g) || []));
              
              // Standard Keywords based on language (Simplified)
              let keywords: string[] = [];
              let snippets: CompletionItem[] = [];

              if (language === 'typescript' || language === 'javascript') {
                  keywords = ['function', 'const', 'let', 'var', 'import', 'export', 'return', 'interface', 'class', 'console', 'log'];
                  snippets = [
                      { label: 'log', kind: 'Snippet', detail: 'console.log()' },
                      { label: 'func', kind: 'Snippet', detail: 'function name() {}' },
                      { label: 'imp', kind: 'Snippet', detail: 'import {} from ""' },
                  ];
              } else if (language === 'python') {
                  keywords = ['def', 'class', 'import', 'from', 'return', 'print', 'if', 'else', 'elif', 'for', 'while'];
                  snippets = [
                      { label: 'pr', kind: 'Snippet', detail: 'print()' },
                      { label: 'def', kind: 'Snippet', detail: 'def name():' },
                  ];
              }

              const matchedKeywords = keywords
                  .filter(k => k.startsWith(currentWord) && k !== currentWord)
                  .map(k => ({ label: k, kind: 'Keyword' as const }));

              const matchedVars = allWords
                  .filter(w => w.startsWith(currentWord) && w !== currentWord && !keywords.includes(w))
                  .map(w => ({ label: w, kind: 'Variable' as const }));
              
              const matchedSnippets = snippets.filter(s => s.label.startsWith(currentWord));

              const combined = [...matchedSnippets, ...matchedKeywords, ...matchedVars].slice(0, 6); // Limit 6 results

              if (combined.length > 0) {
                  setSuggestions(combined);
                  setShowSuggestions(true);
                  setSuggestionIndex(0);
              } else {
                  setShowSuggestions(false);
              }
          } else {
              setShowSuggestions(false);
          }
      } else {
          setShowSuggestions(false);
      }
  };

  const insertSuggestion = (item: CompletionItem) => {
      if (!textareaRef.current) return;
      const textarea = textareaRef.current;
      const caret = textarea.selectionStart;
      const text = textarea.value;
      
      // Find start of current word
      let start = caret - 1;
      while (start >= 0 && /\w/.test(text[start])) start--;
      start++;

      let insertion = item.label;
      // Handle snippets expansion
      if (item.kind === 'Snippet' && item.detail) {
          insertion = item.detail;
      }

      const newText = text.substring(0, start) + insertion + text.substring(caret);
      onChange(newText);
      setShowSuggestions(false);
      
      // Restore focus & move caret
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + insertion.length, start + insertion.length);
      }, 0);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
      if (readOnly) return;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (end > start) {
          e.preventDefault();
          const selectedText = textarea.value.substring(start, end);
          setContextMenu({ x: e.clientX, y: e.clientY, selection: selectedText });
      }
  };

  const triggerAction = (type: SmartActionType) => {
      if (contextMenu && onSmartAction) {
          onSmartAction(type, contextMenu.selection);
      }
      setContextMenu(null);
  };

  // Close context menu on click
  useEffect(() => {
      const closeMenu = () => setContextMenu(null);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (onImageDrop && e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (evt) => {
                  const b64 = (evt.target?.result as string).split(',')[1];
                  onImageDrop(b64);
              };
              reader.readAsDataURL(file);
          }
      }
  };

  return (
    <div 
        className="relative flex flex-col h-full w-full bg-[#0d1117] overflow-hidden group"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
    >
      {isMarkdown && (
        <div className="absolute top-2 right-4 z-20 flex bg-[#161b22] rounded-md border border-gray-700 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowPreview(false)}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${!showPreview ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Code
          </button>
          <button 
            onClick={() => setShowPreview(true)}
             className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${showPreview ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Preview
          </button>
        </div>
      )}

      {isDragging && (
          <div className="absolute inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-blue-500 border-dashed m-4 rounded-xl">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-bold text-white">Vision-to-Code</h3>
              <p className="text-blue-200">Drop image to generate code from design.</p>
          </div>
      )}

      <div className="flex-1 relative flex overflow-hidden">
        {showPreview && isMarkdown ? (
           <div className="flex-1 w-full h-full p-8 bg-[#0d1117] text-gray-200 overflow-y-auto custom-scrollbar markdown-body">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
           </div>
        ) : (
          <>
            <div className="hidden md:flex flex-col items-end px-2 py-4 bg-[#0d1117] text-gray-600 font-mono text-sm border-r border-gray-800 select-none w-12 shrink-0">
              {Array.from({ length: Math.min(value.split('\n').length, 999) }).map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            <div className="flex-1 relative">
                {/* Mirror Div for Caret Tracking */}
                <div 
                    ref={mirrorRef}
                    className="absolute top-0 left-0 p-4 font-mono text-sm leading-6 whitespace-pre-wrap invisible pointer-events-none w-full"
                    style={{ wordBreak: 'break-all' }}
                ></div>

                {/* Heuristic IntelliSense Popup */}
                {showSuggestions && (
                    <div 
                        className="absolute z-50 bg-[#1e2329] border border-gray-700 shadow-xl rounded-md overflow-hidden min-w-[150px]"
                        style={{ top: cursorPosition.top, left: cursorPosition.left + 20 }}
                    >
                        {suggestions.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => insertSuggestion(item)}
                                className={`px-2 py-1 flex items-center gap-2 cursor-pointer text-xs font-mono ${
                                    idx === suggestionIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#2c333e]'
                                }`}
                            >
                                <span className={`w-3 h-3 flex items-center justify-center text-[8px] font-bold rounded-sm ${
                                    item.kind === 'Keyword' ? 'bg-purple-500 text-white' : 
                                    item.kind === 'Variable' ? 'bg-yellow-500 text-black' : 
                                    item.kind === 'Snippet' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                }`}>
                                    {item.kind.charAt(0)}
                                </span>
                                <div className="flex flex-col">
                                    <span>{item.label}</span>
                                    {item.detail && <span className="text-[8px] text-gray-500 opacity-70">{item.detail}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Context Menu (Smart Actions) */}
                {contextMenu && (
                    <div 
                        className="fixed z-[60] bg-[#1e2329] border border-gray-700 shadow-2xl rounded-md overflow-hidden min-w-[180px] animate-fade-in-fast"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing immediately
                    >
                        <div className="px-3 py-2 text-[10px] text-gray-500 uppercase font-bold border-b border-gray-700 bg-[#161b22]">
                            Smart Actions
                        </div>
                        <button onClick={() => triggerAction('refactor')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2">
                            <span>⚡</span> Refactor Code
                        </button>
                        <button onClick={() => triggerAction('explain')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2">
                            <span>🧠</span> Explain Selection
                        </button>
                        <button onClick={() => triggerAction('fix')} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2">
                            <span>🩺</span> Fix Bugs
                        </button>
                    </div>
                )}

                {/* Ghost Cursors Layer */}
                {ghostCursors.map(cursor => (
                    <div 
                        key={cursor.id}
                        className="absolute pointer-events-none transition-all duration-300 z-10"
                        style={{ 
                            top: `${(cursor.x * 24) + 16}px`, 
                            left: `${(cursor.y * 8) + 16}px` 
                        }}
                    >
                        <div className="w-0.5 h-5 absolute top-0 left-0" style={{ backgroundColor: cursor.color }}></div>
                        <div 
                            className="absolute top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap shadow-sm"
                            style={{ backgroundColor: cursor.color }}
                        >
                            {cursor.label}
                        </div>
                    </div>
                ))}

                <textarea
                    ref={textareaRef}
                    className="w-full h-full p-4 bg-[#0d1117] text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-6 custom-scrollbar bg-transparent relative z-0"
                    value={value}
                    onChange={() => {}} // Handled by onInput
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onContextMenu={handleContextMenu}
                    readOnly={readOnly}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                />
            </div>
          </>
        )}
      </div>
      
      <div className="h-6 bg-cyan-900/50 border-t border-cyan-900/30 text-cyan-100 text-[10px] px-3 flex items-center justify-between font-mono select-none z-10">
        <div className="flex items-center gap-4">
          <span className="uppercase font-bold">INS</span>
          <span>{language.toUpperCase()}</span>
          <span>UTF-8</span>
          {ghostCursors.length > 0 && <span className="text-green-400 flex items-center gap-1">● Neural Link Active</span>}
        </div>
        <div>eCylogy v7.0.0 (Cognitive Mesh)</div>
      </div>
    </div>
  );
};
