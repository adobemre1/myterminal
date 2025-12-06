
import React, { useState, useEffect, useRef } from 'react';
import { CommandAction } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, actions }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = actions.filter(action => 
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.section.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].handler();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32">
      <div className="w-full max-w-2xl bg-[#161b22] border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
        
        {/* Search Input */}
        <div className="border-b border-gray-700 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <div className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-400 font-mono">ESC</div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No matching commands.</div>
          ) : (
            filteredActions.map((action, index) => (
              <div 
                key={action.id}
                onClick={() => { action.handler(); onClose(); }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon based on section */}
                  <span className={`text-lg ${index === selectedIndex ? 'text-white' : 'text-gray-500'}`}>
                    {action.section === 'Navigation' && '🧭'}
                    {action.section === 'Editor' && '📝'}
                    {action.section === 'System' && '⚙️'}
                    {action.section === 'AI' && '✨'}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className={`text-[10px] ${index === selectedIndex ? 'text-blue-200' : 'text-gray-500'}`}>
                      {action.section}
                    </div>
                  </div>
                </div>
                
                {action.shortcut && (
                  <div className={`text-xs font-mono px-2 py-1 rounded ${
                    index === selectedIndex ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {action.shortcut}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0d1117] px-4 py-2 border-t border-gray-700 flex justify-between items-center text-[10px] text-gray-500">
          <div className="flex gap-4">
            <span><strong>↑↓</strong> to navigate</span>
            <span><strong>↵</strong> to select</span>
          </div>
          <div>eCylogy v7.0.0</div>
        </div>
      </div>
    </div>
  );
};
