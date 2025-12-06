import React, { useState } from 'react';
import { ProjectFile } from '../types';

interface FileTreeProps {
  files: ProjectFile[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: { [key: string]: TreeNode };
  fileIndex?: number;
}

const FileIcon: React.FC<{ name: string; type: 'file' | 'folder'; isOpen?: boolean }> = ({ name, type, isOpen }) => {
  if (type === 'folder') {
    return (
      <svg className={`w-4 h-4 text-gray-400 mr-1.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
  }
  
  // Simple extension based icon color
  let colorClass = "text-gray-400";
  if (name.endsWith('.ts') || name.endsWith('.tsx')) colorClass = "text-blue-400";
  if (name.endsWith('.js') || name.endsWith('.jsx')) colorClass = "text-yellow-400";
  if (name.endsWith('.py')) colorClass = "text-green-400";
  if (name.endsWith('.json')) colorClass = "text-yellow-200";
  if (name.endsWith('.md')) colorClass = "text-purple-400";
  if (name.endsWith('.sh') || name.endsWith('.ps1')) colorClass = "text-gray-200";
  if (name.endsWith('html')) colorClass = "text-orange-500";
  if (name.endsWith('css')) colorClass = "text-blue-300";

  return (
    <svg className={`w-4 h-4 ${colorClass} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ files, activeFileIndex, onSelectFile }) => {
  
  // Build Tree Structure
  const buildTree = (files: ProjectFile[]) => {
    const root: { [key: string]: TreeNode } = {};
    
    files.forEach((file, index) => {
      const parts = file.name.split('/');
      let currentLevel = root;
      
      parts.forEach((part, partIndex) => {
        const isFile = partIndex === parts.length - 1;
        const path = parts.slice(0, partIndex + 1).join('/');
        
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: path,
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : {},
            fileIndex: isFile ? index : undefined
          };
        }
        if (!isFile) {
          currentLevel = currentLevel[part].children!;
        }
      });
    });
    return root;
  };

  const tree = buildTree(files);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(Object.keys(tree))); // Default open root folders

  const toggleFolder = (path: string) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    setExpandedFolders(newSet);
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = node.fileIndex === activeFileIndex;

    return (
      <div key={node.path}>
        <div 
          className={`flex items-center py-1 cursor-pointer select-none hover:bg-[#21262d] transition-colors ${isActive ? 'bg-[#373e47] text-white' : 'text-gray-400'}`}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onSelectFile(node.fileIndex!);
            }
          }}
        >
          <FileIcon name={node.name} type={node.type} isOpen={isExpanded} />
          <span className="text-sm truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {Object.values(node.children)
              .sort((a, b) => {
                 // Folders first, then files
                 if (a.type === b.type) return a.name.localeCompare(b.name);
                 return a.type === 'folder' ? -1 : 1;
              })
              .map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-2">
      <div className="px-3 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between">
        <span>Explorer</span>
        <span className="text-xs">...</span>
      </div>
      {Object.values(tree)
        .sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        })
        .map(node => renderNode(node, 0))}
    </div>
  );
};
