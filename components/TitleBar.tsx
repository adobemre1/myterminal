
import React, { useState, useEffect, useRef } from 'react';
import { MenuSection } from '../types';

interface TitleBarProps {
  title?: string;
  onAction?: (actionId: string) => void;
}

const MENU_STRUCTURE: MenuSection[] = [
  {
    label: 'File',
    items: [
      { label: 'New Project', action: 'file.new', shortcut: 'Ctrl+N' },
      { label: 'Open Workspace...', action: 'file.open', shortcut: 'Ctrl+O' },
      { type: 'separator', label: '-' },
      { label: 'Save Project', action: 'file.save', shortcut: 'Ctrl+S' },
      { label: 'Export to Disk (.sh)', action: 'file.export', shortcut: 'Ctrl+E' },
      { type: 'separator', label: '-' },
      { label: 'Settings', action: 'file.settings', shortcut: 'Ctrl+,' },
      { label: 'Exit', action: 'file.exit' }
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', action: 'edit.undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', action: 'edit.redo', shortcut: 'Ctrl+Y' },
      { type: 'separator', label: '-' },
      { label: 'Cut', action: 'edit.cut', shortcut: 'Ctrl+X', disabled: true },
      { label: 'Copy', action: 'edit.copy', shortcut: 'Ctrl+C', disabled: true },
      { label: 'Paste', action: 'edit.paste', shortcut: 'Ctrl+V', disabled: true },
      { type: 'separator', label: '-' },
      { label: 'Find in Files', action: 'edit.find', shortcut: 'Ctrl+Shift+F' }
    ]
  },
  {
    label: 'Selection',
    items: [
      { label: 'Select All', action: 'sel.all', shortcut: 'Ctrl+A' },
      { label: 'Expand Selection', action: 'sel.expand', shortcut: 'Alt+Shift+Right' },
      { label: 'Shrink Selection', action: 'sel.shrink', shortcut: 'Alt+Shift+Left' }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Explorer', action: 'view.explorer', shortcut: 'Ctrl+Shift+E' },
      { label: 'Terminal', action: 'view.terminal', shortcut: 'Ctrl+`' },
      { label: 'Output', action: 'view.output', shortcut: 'Ctrl+Shift+U' },
      { type: 'separator', label: '-' },
      { label: 'Extension Marketplace', action: 'view.extensions', shortcut: 'Ctrl+Shift+X' },
      { label: 'Neural Graph', action: 'view.neural' }
    ]
  },
  {
    label: 'Go',
    items: [
      { label: 'Go to File...', action: 'go.file', shortcut: 'Ctrl+P' },
      { label: 'Go to Definition', action: 'go.definition', shortcut: 'F12' }
    ]
  },
  {
    label: 'Run',
    items: [
      { label: 'Start Debugging', action: 'run.debug', shortcut: 'F5' },
      { label: 'Run Without Debugging', action: 'run.start', shortcut: 'Ctrl+F5' }
    ]
  },
  {
    label: 'Terminal',
    items: [
      { label: 'New Terminal', action: 'term.new', shortcut: 'Ctrl+Shift+`' },
      { label: 'Run Setup Script', action: 'term.setup' }
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', action: 'help.docs' },
      { label: 'Academy', action: 'help.academy' },
      { type: 'separator', label: '-' },
      { label: 'About eCylogy', action: 'help.about' }
    ]
  }
];

export const TitleBar: React.FC<TitleBarProps> = ({ title = "eCylogy Studio", onAction }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (index: number) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const handleHover = (index: number) => {
    if (activeMenuIndex !== null) {
      setActiveMenuIndex(index);
    }
  };

  const handleItemClick = (action: string | undefined) => {
    if (action && onAction) {
      onAction(action);
    }
    setActiveMenuIndex(null);
  };

  return (
    <div className="h-8 bg-[#161b22] flex items-center justify-between select-none border-b border-gray-800 w-full z-50 drag-region">
      
      {/* Left: Icon & Menus */}
      <div className="flex items-center h-full px-2 no-drag" ref={menuRef}>
        <div className="w-5 h-5 bg-gradient-to-br from-cyan-600 to-violet-600 rounded mr-3 flex items-center justify-center text-[8px] font-bold text-white shadow-sm cursor-pointer hover:opacity-80">
           eCy
        </div>
        
        <div className="flex text-xs text-gray-300 h-full relative">
          {MENU_STRUCTURE.map((menu, index) => (
            <div key={menu.label} className="relative h-full flex items-center">
              <button 
                className={`px-2.5 h-6 rounded-sm transition-colors mx-0.5 ${
                  activeMenuIndex === index 
                  ? 'bg-[#30363d] text-white' 
                  : 'hover:bg-[#21262d] text-gray-400 hover:text-white'
                }`}
                onClick={() => handleMenuClick(index)}
                onMouseEnter={() => handleHover(index)}
              >
                {menu.label}
              </button>

              {/* Dropdown */}
              {activeMenuIndex === index && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#1e2329] border border-gray-700 rounded-md shadow-2xl py-1 z-[100] animate-fade-in-fast">
                  {menu.items.map((item, i) => {
                    if (item.type === 'separator') {
                      return <div key={i} className="h-px bg-gray-700 my-1 mx-2"></div>;
                    }
                    return (
                      <button
                        key={i}
                        disabled={item.disabled}
                        onClick={() => handleItemClick(item.action)}
                        className={`w-full text-left px-4 py-1.5 flex justify-between items-center hover:bg-blue-600 hover:text-white group ${
                          item.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className={`text-[10px] ${item.disabled ? 'text-gray-600' : 'text-gray-500 group-hover:text-blue-200'}`}>
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Title */}
      <div className="text-xs text-gray-500 font-medium absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 pointer-events-none">
         <span>{title}</span>
         {title !== 'eCylogy Studio' && <span className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px] text-gray-400 border border-gray-700">Workspace</span>}
      </div>

      {/* Right: Window Controls (Simulation) */}
      <div className="flex h-full items-center no-drag">
         <div className="flex items-center px-4 gap-2 mr-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Sentinel Active"></span>
            <span className="text-[10px] text-gray-500 font-mono">v6.0.0</span>
         </div>
         <button className="h-full px-4 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M14 8v1H3V8h11z"/></svg>
         </button>
         <button className="h-full px-4 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
             <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></svg>
         </button>
         <button className="h-full px-4 hover:bg-red-600 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
             <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"/></svg>
         </button>
      </div>
    </div>
  );
};
