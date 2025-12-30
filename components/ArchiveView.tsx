
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { Task, Client } from '../types';

interface ArchiveViewProps {
  tasks: Task[];
  clients: Client[];
  onTaskClick?: (task: Task) => void;
}

interface ClientStat {
    count: number;
    color: string;
    initials: string;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ tasks, clients, onTaskClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // 1. Filter for completed tasks (Exported column)
  const allArchivedTasks = useMemo(() => {
      return tasks.filter(t => t.columnId === 'exported');
  }, [tasks]);

  // 2. Filter based on Search & Selection
  const displayedTasks = useMemo(() => {
      let filtered = allArchivedTasks;

      // Filter by Client Folder if selected
      if (selectedClient) {
          filtered = filtered.filter(t => t.client === selectedClient);
      }

      // Filter by Search Query
      if (searchQuery) {
          const lower = searchQuery.toLowerCase();
          filtered = filtered.filter(t => 
              t.title.toLowerCase().includes(lower) || 
              t.client.toLowerCase().includes(lower) ||
              t.tag.toLowerCase().includes(lower)
          );
      }

      // Sort by date (mock logic: assuming newer IDs are newer, or use createdAt if available)
      return filtered.reverse(); 
  }, [allArchivedTasks, searchQuery, selectedClient]);

  // 3. Generate Client Folder Stats (Only show if at root and not searching)
  const clientStats = useMemo<Record<string, ClientStat>>(() => {
      if (selectedClient || searchQuery) return {};

      const stats: Record<string, ClientStat> = {};
      
      allArchivedTasks.forEach(task => {
          if (!stats[task.client]) {
              const names = task.client.split(' ');
              const initials = names.length > 1 
                  ? `${names[0][0]}${names[1][0]}`.toUpperCase() 
                  : task.client.slice(0, 2).toUpperCase();
              
              stats[task.client] = {
                  count: 0,
                  color: task.clientColor || 'blue',
                  initials: initials
              };
          }
          stats[task.client].count += 1;
      });
      return stats;
  }, [allArchivedTasks, searchQuery, selectedClient]);

  // Helper for folder styling
  const getFolderStyles = (color: string) => {
      const map: Record<string, string> = {
          blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
          orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
          purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
          green: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
          gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      };
      return map[color] || map['gray'];
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 custom-scrollbar animate-in fade-in duration-300">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border-light dark:border-border-dark gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight flex items-center gap-2">
                    {selectedClient ? (
                        <>
                            <button 
                                onClick={() => setSelectedClient(null)}
                                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                Archive
                            </button>
                            <span className="text-gray-300 dark:text-gray-600">/</span>
                            <span className="text-primary">{selectedClient}</span>
                        </>
                    ) : (
                        'Project Archive'
                    )}
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1 text-sm">
                    {selectedClient 
                        ? `Viewing all archived files for ${selectedClient}` 
                        : 'Repositories of completed and exported projects.'
                    }
                </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group w-full md:w-auto">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 text-sm rounded-lg border-none bg-white dark:bg-surface-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary shadow-sm placeholder-gray-400 w-full md:w-64 transition-all" 
                        placeholder="Search archived projects..." 
                        type="text"
                    />
                </div>
            </div>
        </header>

        {/* Client Folders Section (Hidden when inside a folder or searching) */}
        {!selectedClient && !searchQuery && (
            <section className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Client Folders</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {Object.keys(clientStats).map((name) => {
                        const stat = clientStats[name];
                        return (
                            <div 
                                key={name} 
                                onClick={() => setSelectedClient(name)}
                                className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center active:scale-95"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${getFolderStyles(stat.color)}`}>
                                    <span className="font-bold text-lg">{stat.initials}</span>
                                </div>
                                <h3 className="font-semibold text-text-light dark:text-text-dark mb-1 text-sm truncate w-full">{name}</h3>
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full font-medium">
                                    {stat.count} Files
                                </span>
                            </div>
                        );
                    })}
                    
                    {/* Fallback if no archives */}
                    {Object.keys(clientStats).length === 0 && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-border-light dark:border-gray-700 rounded-xl">
                            <Icon name="folder_off" className="text-3xl text-gray-300 dark:text-gray-600 mb-2" />
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">No folders created yet.</p>
                        </div>
                    )}
                </div>
            </section>
        )}

        {/* Files List Section */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                    {selectedClient ? 'Project Files' : (searchQuery ? 'Search Results' : 'Recently Archived')}
                </h2>
                
                {!selectedClient && !searchQuery && (
                    <div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-primary dark:text-primary-light transition-colors">
                            <Icon name="grid_view" className="text-lg" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 dark:text-gray-500 transition-colors">
                            <Icon name="list" className="text-lg" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                {displayedTasks.map(task => (
                    <div 
                        key={task.id} 
                        onClick={() => onTaskClick && onTaskClick(task)}
                        className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800">
                                Exported
                             </span>
                             <button className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400">
                                <Icon name="more_horiz" className="text-xl" />
                             </button>
                        </div>

                        {/* Large Title */}
                        <h3 className="text-xl font-bold text-text-light dark:text-text-dark leading-snug mb-2 line-clamp-3">
                            {task.title}
                        </h3>

                        {/* Spacer */}
                        <div className="flex-1 min-h-[20px]"></div>

                        {/* Footer Date */}
                        <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Icon name="calendar_today" className="text-lg text-gray-400" />
                            <span className="font-medium">{task.dueDate || 'Completed'}</span>
                        </div>
                    </div>
                ))}

                {displayedTasks.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-600">
                            <Icon name="inventory_2" className="text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-text-light dark:text-text-dark">No projects found</h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                            {searchQuery ? `No results for "${searchQuery}"` : 'This folder is empty.'}
                        </p>
                        {selectedClient && (
                            <button 
                                onClick={() => setSelectedClient(null)}
                                className="mt-4 text-sm text-primary font-medium hover:underline"
                            >
                                Return to all folders
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    </div>
  );
};
