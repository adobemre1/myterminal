import React from 'react';
import { ProjectTask, OrchestraRole } from '../../types';

interface TaskManagerProps {
  tasks: ProjectTask[];
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks }) => {
  const todo = tasks.filter(t => t.status === 'todo');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const done = tasks.filter(t => t.status === 'done');

  const renderCard = (task: ProjectTask) => (
    <div key={task.id} className="bg-[#161b22] border border-gray-700 p-3 rounded mb-2 shadow-sm hover:border-gray-500 transition-colors cursor-pointer group">
        <div className="text-sm text-gray-200 font-medium mb-2">{task.title}</div>
        <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded">
                {task.assignedTo.split(' ')[0]}
            </span>
            <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-blue-500 transition-colors"></div>
        </div>
    </div>
  );

  return (
    <div className="flex h-full p-4 gap-4 overflow-x-auto bg-[#0d1117]">
        {/* TODO COL */}
        <div className="flex-1 min-w-[250px] bg-[#0d1117] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                <span className="font-bold text-sm text-gray-400 uppercase tracking-widest">To Do</span>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{todo.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {todo.map(renderCard)}
            </div>
        </div>

        {/* IN PROGRESS COL */}
        <div className="flex-1 min-w-[250px] bg-[#0d1117] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-blue-900/50 pb-2">
                <span className="font-bold text-sm text-blue-400 uppercase tracking-widest">In Progress</span>
                <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">{inProgress.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-blue-900/5 rounded p-1">
                {inProgress.map(renderCard)}
            </div>
        </div>

        {/* DONE COL */}
        <div className="flex-1 min-w-[250px] bg-[#0d1117] flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-green-900/50 pb-2">
                <span className="font-bold text-sm text-green-400 uppercase tracking-widest">Done</span>
                <span className="bg-green-900/30 text-green-300 text-xs px-2 py-0.5 rounded-full">{done.length}</span>
            </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {done.map(renderCard)}
            </div>
        </div>
    </div>
  );
};
