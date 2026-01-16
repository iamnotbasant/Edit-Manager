import React, { useState, useMemo, useEffect } from 'react';
import { Task, TagDefinition, Client, Revision, RevisionStatus } from '../types';
import { Icon } from './Icon';
import { CLIENT_COLORS, TAG_STYLES } from '../constants';

interface ProjectDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  availableTags?: TagDefinition[];
  onUpdateTask?: (updatedTask: Task) => void;
  onAddActivity?: (taskId: string, content: string) => void;
  clients?: Client[];
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ task, onClose, availableTags = [], onUpdateTask, onAddActivity, clients = [] }) => {
  // 1. ALL HOOKS MUST BE DECLARED AT THE TOP (Unconditionally)
  
  const [commentInput, setCommentInput] = useState('');
  
  // Revision State
  const [isAddingRevision, setIsAddingRevision] = useState(false);
  const [revContent, setRevContent] = useState('');
  const [revLink, setRevLink] = useState('');
  const [revDate, setRevDate] = useState('');
  const [revStatus, setRevStatus] = useState<RevisionStatus>('Creating');
  
  const [expandedRevisions, setExpandedRevisions] = useState<string[]>([]);

  // Deliverables State
  const [videoLink, setVideoLink] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [isEditingDeliverables, setIsEditingDeliverables] = useState(false);

  // 2. EFFECT: Reset state when the specific task changes
  useEffect(() => {
    if (task) {
        setCommentInput('');
        setRevContent('');
        setRevLink('');
        setRevStatus('Creating');
        setIsAddingRevision(false);
        
        // Reset Deliverables
        setVideoLink(task.videoLink || '');
        setProjectLink(task.projectFileLink || '');
        setIsEditingDeliverables(false);
        
        // Reset date to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setRevDate(now.toISOString().slice(0, 16));
        
        // Optional: Auto-expand the latest revision if exists
        if (task.revisions && task.revisions.length > 0) {
            // Find max id or just empty
            setExpandedRevisions([]); 
        }
    }
  }, [task?.id]);

  // 3. MEMO: Sort revisions
  const sortedRevisions = useMemo(() => {
      if (!task || !task.revisions) return [];
      return [...task.revisions].sort((a, b) => a.number - b.number);
  }, [task]);

  // 4. EARLY RETURN: Only NOW can we return null safely
  if (!task) return null;

  // --- HELPERS ---

  const formatActivityTime = (isoString: string) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24 && date.getDate() === now.getDate()) return `${diffHours} hr ago`;
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
          return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatContentHtml = (content: string) => {
    if (!content) return '';
    
    // 1. Hotlink Image URLs - FIX: Added display block and margin to prevent overlap
    // Regex matches http/https followed by non-whitespace, ending in image extension
    const urlRegex = /(https?:\/\/[^\s<>"')]+\.(?:png|jpg|jpeg|gif|webp)(?:\?[^\s<>"')]+)?)/gi;

    let html = content.replace(urlRegex, (match) => {
        return `<div class="block w-full my-3" onclick="event.stopPropagation()">
            <a href="${match}" target="_blank" rel="noopener noreferrer" class="block w-fit">
                <img src="${match}" class="block max-w-full w-auto h-auto max-h-[300px] rounded-lg border border-gray-200 dark:border-gray-700 object-contain hover:opacity-95 transition-opacity" loading="lazy" alt="Attachment" />
            </a>
        </div>`;
    });
    
    // 2. Highlight Keywords
    html = html.replace(
        /\b(In Progress|To-Do|In Revision|Exported|v2_export\.mp4)\b/g, 
        '<span class="font-semibold text-primary">$1</span>'
    );
    
    // 3. Line breaks
    html = html.replace(/\n/g, '<br/>');
    
    return html;
  };

  // --- HANDLERS ---

  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentInput.trim() || !onAddActivity) return;
      onAddActivity(task.id, commentInput);
      setCommentInput('');
  };

  const handleAddRevision = () => {
      if (!revContent.trim() || !onUpdateTask) return;

      const maxNumber = task.revisions && task.revisions.length > 0 
          ? Math.max(...task.revisions.map(r => r.number)) 
          : 0;

      const newId = `rev-${Date.now()}`;
      const newRevision: Revision = {
          id: newId,
          number: maxNumber + 1,
          content: revContent,
          link: revLink,
          date: new Date(revDate).toISOString(),
          status: revStatus
      };

      const updatedTask = {
          ...task,
          revisions: [...(task.revisions || []), newRevision]
      };

      onUpdateTask(updatedTask);
      setExpandedRevisions(prev => [...prev, newId]); // Auto expand

      // Reset form
      setRevContent('');
      setRevLink('');
      setRevStatus('Creating');
      setIsAddingRevision(false);
  };

  const handleRevisionStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, revId: string) => {
      e.stopPropagation();
      const newStatus = e.target.value as RevisionStatus;
      if (!onUpdateTask || !task.revisions) return;
      
      const updatedRevisions = task.revisions.map(r => 
          r.id === revId ? { ...r, status: newStatus } : r
      );
      
      onUpdateTask({ ...task, revisions: updatedRevisions });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!onUpdateTask) return;
      const selectedLabel = e.target.value;
      const tagDef = availableTags.find(t => t.label === selectedLabel);
      if (tagDef) {
          onUpdateTask({ ...task, tag: tagDef.label, tagStyle: tagDef.style });
      }
  };

  const toggleRevisionExpand = (revId: string) => {
      setExpandedRevisions(prev => 
          prev.includes(revId) ? prev.filter(id => id !== revId) : [...prev, revId]
      );
  };

  const handleSaveDeliverables = () => {
      if (onUpdateTask) {
          onUpdateTask({
              ...task,
              videoLink,
              projectFileLink: projectLink
          });
      }
      setIsEditingDeliverables(false);
  };

  // --- STYLES & DATA ---

  const getStatusStyle = (colId: string) => {
    switch (colId) {
        case 'todo': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        case 'in-progress': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50';
        case 'revision': return 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-700/50';
        case 'exported': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700/50';
        default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getRevisionStatusColor = (status: RevisionStatus) => {
      switch (status) {
          case 'Creating': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
          case 'Reviewing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
          case 'Completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  const matchedClient = clients.find(c => c.name === task.client);
  const clientColorClass = CLIENT_COLORS[task.clientColor || 'gray'];
  const clientInitial = task.client.charAt(0).toUpperCase();

  const assignedTeam = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZrqzs3YuuKUHnUv65Vz3sngJlryb6WdvvqmmuAvR2unECmd1CLdUJXlYbAx4hdWuTQhTkuhGrAIoVf3vxi-3sEvX1pEJ4-hXiRUt8LBqIbxEN5unUkX9o03x4j3Q2fVoOKAn6loLwQ9xuq7aleWfol63yWdmuVS-RvuqefU6AQq192ycXHQkV12EPbw405eVvvRoayunKBVBVp6b7oeiotfFfJ1K2k6wE6TBF4Nrueo9rbpihYsC75a5oUOlF8rqQos1coPkCfGA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl_Y7DVoz86sDqdqUN29A1FLsxLWI18i_YlSRIOjCdqa_B66CcyNXffFkbK4q3oVg7iemkTKxSxEJSntOXnsvp7o4j53SpoFPrWNiz9XCRosU6JBgr0a3U8eq7CgBPdMYQzXvMo46RuSaoQZUfIf7KwREsy9urqsrEha4qzmCJbXH-SAqJ8sy5moDTLHRyptnDY6wUS7z-VIQFu-d3ekLMznuWRDuzpcyUh2qxVrIRG-KEvVeApjq2bnQ8r5cWWM6oulerkLJDyCA"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ backdropFilter: 'blur(4px)' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 transition-opacity" 
        onClick={() => onClose()}
      ></div>

      <div className="relative w-full max-w-4xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border-light dark:border-border-dark">
        
        {/* --- Header --- */}
        <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex justify-between items-start bg-surface-light dark:bg-surface-dark sticky top-0 z-20">
          <div className="flex gap-4">
            {matchedClient ? (
                <img 
                    src={matchedClient.img} 
                    alt={task.client} 
                    className="w-12 h-12 rounded-xl object-cover border border-border-light dark:border-border-dark flex-shrink-0"
                />
            ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 border border-opacity-20 ${clientColorClass.replace('text-', 'border-').replace('dark:text-', 'dark:border-')}`}>
                   <span className={clientColorClass.split(' ')[1]}>{clientInitial}</span>
                </div>
            )}
            
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{task.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide ${getStatusStyle(task.columnId)}`}>
                  {task.columnId === 'todo' ? 'To-Do' : task.columnId.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2">
                <Icon name="business" className="text-base" />
                Client: {task.client}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
                onClick={() => onClose()}
                className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors ml-2" 
                title="Close"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar bg-background-light dark:bg-[#151c28]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Overview Panel */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon name="info" className="text-base" /> Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Due Date</div>
                    <div className="font-semibold text-text-light dark:text-text-dark">{task.dueDate || 'N.A'}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Status</div>
                     <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border ${
                        task.dueStatus === 'urgent' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                     }`}>
                      {task.dueStatus ? task.dueStatus.toUpperCase() : 'NORMAL'}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Duration</div>
                    <div className="font-semibold text-text-light dark:text-text-dark">Est. 45s</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Category</div>
                    <div className="relative">
                        {onUpdateTask && availableTags.length > 0 ? (
                            <select 
                                value={task.tag}
                                onChange={handleTagChange}
                                className={`appearance-none text-xs border border-border-light dark:border-border-dark rounded px-2 py-1 pr-6 font-bold cursor-pointer outline-none w-full ${TAG_STYLES[task.tagStyle]}`}
                            >
                                {availableTags.map(tag => (
                                    <option key={tag.id} value={tag.label} className="bg-white dark:bg-gray-800 text-text-light dark:text-text-dark">
                                        {tag.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className={`text-xs border border-border-light dark:border-border-dark rounded px-1.5 py-0.5 ${TAG_STYLES[task.tagStyle]}`}>
                                {task.tag}
                            </span>
                        )}
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                             <Icon name="expand_more" className="text-xs" />
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revision History - Only visible if in Revision Column */}
              {task.columnId === 'revision' && (
                  <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider flex items-center gap-2">
                            <Icon name="history" className="text-base" /> Revision History
                        </h3>
                        <button 
                            onClick={() => setIsAddingRevision(!isAddingRevision)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors"
                        >
                            <Icon name={isAddingRevision ? "remove" : "add"} className="text-sm" />
                        </button>
                    </div>

                    {isAddingRevision && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-primary/20">
                            <textarea 
                                placeholder="What needs to be revised? Paste image URLs here..."
                                className="w-full text-sm p-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 mb-2 focus:ring-1 focus:ring-primary outline-none text-text-light dark:text-text-dark"
                                rows={2}
                                value={revContent}
                                onChange={(e) => setRevContent(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleAddRevision}
                                    disabled={!revContent.trim()}
                                    className="px-3 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-primary-light disabled:opacity-50"
                                >
                                    Add Note
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {sortedRevisions.map((rev) => {
                            const isExpanded = expandedRevisions.includes(rev.id);
                            return (
                                <div key={rev.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 overflow-hidden">
                                    <div 
                                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => toggleRevisionExpand(rev.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 border flex items-center justify-center text-xs font-bold">
                                                {rev.number}
                                            </div>
                                            <span className="font-semibold text-sm text-text-light dark:text-text-dark">Revision {rev.number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Status Dropdown inside Revision */}
                                            <div onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={rev.status}
                                                    onChange={(e) => handleRevisionStatusChange(e, rev.id)}
                                                    className={`text-[10px] py-0.5 pl-2 pr-6 rounded uppercase font-bold border-none outline-none cursor-pointer ${getRevisionStatusColor(rev.status)}`}
                                                >
                                                    <option value="Creating">Creating</option>
                                                    <option value="Reviewing">Reviewing</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                            <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-gray-400" />
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700">
                                            <div 
                                              className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2"
                                              dangerouslySetInnerHTML={{ __html: formatContentHtml(rev.content) }}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-2">{new Date(rev.date).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {sortedRevisions.length === 0 && (
                             <p className="text-center text-xs text-gray-400 py-4">No revisions logged.</p>
                        )}
                    </div>
                  </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Team */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4">Assigned Team</h3>
                <div className="flex -space-x-2 overflow-hidden mb-4 p-1">
                  {assignedTeam.map((src, i) => (
                      <img key={i} alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-surface-dark" src={src} />
                  ))}
                  <button className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-surface-dark bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Icon name="add" className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm flex-1 flex flex-col h-[400px]">
                <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4">Activity Log</h3>
                
                <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-2">
                    {task.activities && task.activities.length > 0 ? (
                        task.activities.map((activity) => (
                            <div key={activity.id} className="relative pl-4 border-l-2 border-border-light dark:border-border-dark">
                                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface-dark ${
                                    activity.type === 'move' ? 'bg-indigo-500' : 
                                    activity.type === 'create' ? 'bg-green-500' :
                                    activity.type === 'comment' ? 'bg-amber-500' :
                                    'bg-gray-400'
                                }`}></div>
                                
                                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mb-0.5 font-medium">
                                    {formatActivityTime(activity.timestamp)}
                                </p>
                                
                                <div className="text-xs text-text-light dark:text-text-dark leading-snug">
                                    <strong className="font-semibold text-gray-900 dark:text-white mr-1">{activity.user}</strong>
                                    
                                    {/* Render content based on type to ensure HTML validity */}
                                    {activity.type === 'comment' ? (
                                        <div className="block mt-1 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-gray-700 dark:text-gray-300 italic border border-amber-100 dark:border-amber-900/20">
                                            <div dangerouslySetInnerHTML={{ __html: formatContentHtml(activity.content) }} />
                                        </div>
                                    ) : (
                                        <div className="inline" dangerouslySetInnerHTML={{ __html: formatContentHtml(activity.content) }} />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-xs">
                            No recent activity.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <form onSubmit={handleCommentSubmit} className="relative">
                      <input 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full text-sm bg-gray-50 dark:bg-gray-800 border-border-light dark:border-border-dark rounded-lg focus:ring-1 focus:ring-primary focus:border-primary pl-3 pr-10 py-2 text-text-light dark:text-text-dark" 
                        placeholder="Add comment (paste image URL)..." 
                        type="text" 
                      />
                      <button 
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                          <Icon name="send" className="text-sm" />
                      </button>
                  </form>
                </div>
              </div>

              {/* DELIVERABLES & ASSETS (Only when Exported) */}
              {task.columnId === 'exported' && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                              <Icon name="inventory_2" className="text-base" /> Deliverables & Assets
                          </h3>
                          {!isEditingDeliverables && (
                            <button 
                                onClick={() => setIsEditingDeliverables(true)}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                                title="Edit Links"
                            >
                                <Icon name="edit" className="text-xs" />
                            </button>
                          )}
                      </div>

                      {isEditingDeliverables ? (
                          <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-500 mb-1">Video Download Link</label>
                                    <input 
                                        type="url"
                                        placeholder="Paste video URL..."
                                        value={videoLink}
                                        onChange={(e) => setVideoLink(e.target.value)}
                                        className="w-full text-sm p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-500 mb-1">Project Files Link</label>
                                    <input 
                                        type="url"
                                        placeholder="Paste project files URL..."
                                        value={projectLink}
                                        onChange={(e) => setProjectLink(e.target.value)}
                                        className="w-full text-sm p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        onClick={() => setIsEditingDeliverables(false)}
                                        className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveDeliverables}
                                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm"
                                    >
                                        Save Links
                                    </button>
                                </div>
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 gap-3">
                              {task.videoLink ? (
                                  <a 
                                    href={task.videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 hover:shadow-md transition-all group/btn text-center"
                                  >
                                      <Icon name="movie" className="text-2xl mb-2 group-hover/btn:scale-110 transition-transform" />
                                      <span className="text-xs font-bold">Download Video</span>
                                  </a>
                              ) : (
                                  <button 
                                    onClick={() => setIsEditingDeliverables(true)}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-emerald-200 dark:border-emerald-800 text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                                  >
                                      <Icon name="add" className="text-xl mb-1" />
                                      <span className="text-xs font-medium">Add Video</span>
                                  </button>
                              )}

                              {task.projectFileLink ? (
                                  <a 
                                    href={task.projectFileLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 hover:shadow-md transition-all group/btn text-center"
                                  >
                                      <Icon name="folder_zip" className="text-2xl mb-2 group-hover/btn:scale-110 transition-transform" />
                                      <span className="text-xs font-bold">Project Files</span>
                                  </a>
                              ) : (
                                  <button 
                                    onClick={() => setIsEditingDeliverables(true)}
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-emerald-200 dark:border-emerald-800 text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                                  >
                                      <Icon name="add" className="text-xl mb-1" />
                                      <span className="text-xs font-medium">Add Files</span>
                                  </button>
                              )}
                          </div>
                      )}
                  </div>
              )}
            </div>

          </div>
        </div>

        {/* --- Footer --- */}
        <div className="px-6 py-4 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex justify-end gap-3 sticky bottom-0 z-20">
          <button 
            onClick={() => onClose()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-light text-white shadow-sm hover:shadow transition-all flex items-center gap-2">
            <Icon name="edit_square" className="text-lg" />
            Edit Project
          </button>
        </div>

      </div>
    </div>
  );
};