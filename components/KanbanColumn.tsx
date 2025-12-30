
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Column, Task } from '../types';
import { TaskCard } from './TaskCard';
import { Icon } from './Icon';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onTaskDoubleClick: (task: Task) => void;
  onUpdateTask?: (task: Task) => void; // Added prop
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onAddTask, onTaskDoubleClick, onUpdateTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    // Reverted to h-full to prevent page scroll
    <div className="w-80 flex flex-col h-full max-h-full rounded-xl bg-gray-50 dark:bg-gray-900/50 p-1 flex-shrink-0 transition-all">
      {/* Header - Removed sticky because this div does not scroll, the list below does */}
      <div className="flex items-center justify-between p-3 mb-2 bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon name={column.icon} className="text-gray-400 text-lg" />
          <h3 className="font-semibold text-text-light dark:text-text-dark">{column.title}</h3>
        </div>
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
          {tasks.length}
        </span>
      </div>

      {/* Sortable Task List - Added overflow-y-auto to allow scrolling INSIDE the column */}
      <div 
        ref={setNodeRef}
        className="flex-1 px-1 space-y-3 pb-2 overflow-y-auto scrollbar-hide"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            
          {/* Drop Zone Visual (Only visible when dragging over an empty area) */}
          {tasks.length === 0 && isOver && (
             <div className="border-2 dashed rounded-xl flex items-center justify-center text-primary min-h-[160px] transition-all duration-200 border-primary bg-primary/10">
                <div className="text-center animate-pulse">
                     <Icon name="arrow_circle_down" className="text-4xl mb-2" />
                     <p className="text-sm font-semibold">Drop card here</p>
                </div>
             </div>
          )}

          {tasks.map((task) => (
            <TaskCard 
                key={task.id} 
                task={task} 
                onDoubleClick={onTaskDoubleClick}
                onUpdateTask={onUpdateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
