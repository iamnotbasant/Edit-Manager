
import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { INITIAL_COLUMNS, INITIAL_TASKS, INITIAL_CLIENTS, DEFAULT_INVOICE_SETTINGS, INITIAL_AVAILABLE_TAGS, INITIAL_CATEGORIES } from './constants';
import { Task, Column, TagStyle, ClientColor, DueStatus, Client, InvoiceSettings, TagDefinition, Invoice, Activity, CategoryDefinition } from './types';
import { KanbanColumn } from './components/KanbanColumn';
import { TaskCard } from './components/TaskCard';
import { Icon } from './components/Icon';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { CalendarSidebar } from './components/CalendarSidebar';
import { ClientsView } from './components/ClientsView';
import { InvoicesView } from './components/InvoicesView';
import { ArchiveView } from './components/ArchiveView';
import { ClientDetailsModal } from './components/ClientDetailsModal';
import { SettingsView } from './components/SettingsView';

type ViewState = 'projects' | 'clients' | 'invoices' | 'archive' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('projects');
  // Default to collapsed (YouTube style "Mini" sidebar)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [availableTags, setAvailableTags] = useState<TagDefinition[]>(INITIAL_AVAILABLE_TAGS);
  const [availableCategories, setAvailableCategories] = useState<CategoryDefinition[]>(INITIAL_CATEGORIES);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Selection States
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(DEFAULT_INVOICE_SETTINGS);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Derived state for filtering
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // 1. Search Filtering
    if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        result = result.filter(t => 
            t.title.toLowerCase().includes(lower) || 
            t.client.toLowerCase().includes(lower) || 
            t.tag.toLowerCase().includes(lower)
        );
    }

    // 2. Exported Cleanup Logic (Payment based)
    const now = new Date();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const CLEANUP_DAYS = 7;

    result = result.filter(t => {
        if (t.columnId !== 'exported') return true; // Keep all non-exported

        if (t.paymentStatus === 'Paid' && t.paidAt) {
            const paidDate = new Date(t.paidAt);
            const diffDays = (now.getTime() - paidDate.getTime()) / MS_PER_DAY;
            
            // If paid more than 7 days ago, hide it (return false)
            if (diffDays > CLEANUP_DAYS) {
                return false;
            }
        }
        return true;
    });

    return result;
  }, [tasks, searchQuery]);

  // Handle Drag Start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  // Handle Drag Over (Moving between columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Helper to get formatted column name
    const getColumnName = (id: string) => {
        const col = INITIAL_COLUMNS.find(c => c.id === id);
        return col ? col.title : id;
    };

    // Scenario 1: Dragging over another Task
    if (isActiveTask && isOverTask) {
        setTasks((prev) => {
            const activeIndex = prev.findIndex((t) => t.id === activeId);
            const overIndex = prev.findIndex((t) => t.id === overId);
            
            if (activeIndex === -1 || overIndex === -1) return prev;

            const newTasks = [...prev];
            const movingTask = newTasks[activeIndex];
            const targetColumnId = prev[overIndex].columnId;

            // Only log if column actually changes
            if (movingTask.columnId !== targetColumnId) {
                movingTask.columnId = targetColumnId;
                
                // ADD ACTIVITY LOG
                const newActivity: Activity = {
                    id: `act-${Date.now()}`,
                    type: 'move',
                    content: `Moved to ${getColumnName(targetColumnId)}`,
                    timestamp: new Date().toISOString(),
                    user: 'You'
                };
                // Prepend new activity
                movingTask.activities = [newActivity, ...(movingTask.activities || [])];
                
                return arrayMove(newTasks, activeIndex, overIndex);
            }
            return arrayMove(prev, activeIndex, overIndex);
        });
    }

    // Scenario 2: Dragging over a Column (empty or not)
    if (isActiveTask && isOverColumn) {
        setTasks((prev) => {
            const activeIndex = prev.findIndex((t) => t.id === activeId);
            if (activeIndex === -1) return prev;

            if (prev[activeIndex].columnId !== overId) {
                 const newTasks = [...prev];
                 const movingTask = newTasks[activeIndex];
                 const targetColumnId = String(overId);
                 
                 movingTask.columnId = targetColumnId;

                 // ADD ACTIVITY LOG
                 const newActivity: Activity = {
                    id: `act-${Date.now()}`,
                    type: 'move',
                    content: `Moved to ${getColumnName(targetColumnId)}`,
                    timestamp: new Date().toISOString(),
                    user: 'You'
                };
                movingTask.activities = [newActivity, ...(movingTask.activities || [])];

                 return newTasks; 
            }
            return prev;
        });
    }
  };

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
  };
  
  // Create New Project Handler
  const handleCreateProject = (data: any) => {
      // Map form data to Task object
      let dueStatus: DueStatus = 'normal';
      if (data.priority === 'urgent') dueStatus = 'urgent';
      else if (data.priority === 'medium') dueStatus = 'warning';

      // Pick a random style for visual variety
      const colors: ClientColor[] = ['blue', 'orange', 'purple', 'green', 'gray'];
      
      const randomClientColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Default tag based on category if possible, or random
      const defaultTag = availableTags.find(t => t.label === data.category.toUpperCase()) || availableTags[0];

      const today = new Date();
      // Updated format to MMM DD, YYYY (e.g., Nov 14, 2024)
      const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Calculate precise deadline ISO string for logic
      let deadlineIso = undefined;
      let formattedDueDate = undefined;

      if (data.deadlineDate) {
          // Parse date parts
          const [y, m, d] = data.deadlineDate.split('-').map(Number);
          // Parse time parts (default to 17:00 if not provided)
          const timeStr = data.deadlineTime || '17:00';
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          const deadlineObj = new Date(y, m - 1, d, hours, minutes);
          deadlineIso = deadlineObj.toISOString();
          
          formattedDueDate = `Due: ${deadlineObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }

      const newTask: Task = {
          id: `new-${Date.now()}`,
          columnId: 'todo', // Always add to Todo
          client: data.client,
          clientColor: randomClientColor,
          title: data.title || 'Untitled Project',
          tag: defaultTag.label,
          tagStyle: defaultTag.style,
          createdAt: formattedDate, // Store creation date
          dueDate: formattedDueDate,
          deadline: deadlineIso,
          dueStatus: dueStatus,
          paymentStatus: 'Unbilled', // Default for new projects
          
          // Budget info
          budget: data.budget ? parseFloat(data.budget) : undefined,
          currency: data.currency || 'INR',

          revisions: [],
          activities: [
              { 
                  id: `act-${Date.now()}`, 
                  type: 'create', 
                  content: 'Project created', 
                  timestamp: new Date().toISOString(), 
                  user: 'You' 
              }
          ]
      };

      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
  };

  // Add Manual Activity (Comment)
  const handleAddActivity = (taskId: string, content: string) => {
      if (!content.trim()) return;

      const newActivity: Activity = {
          id: `act-${Date.now()}`,
          type: 'comment',
          content: content,
          timestamp: new Date().toISOString(),
          user: 'You'
      };

      setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
              return {
                  ...t,
                  activities: [newActivity, ...(t.activities || [])]
              };
          }
          return t;
      }));

      // Update selected task in modal if open
      if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(prev => prev ? {
              ...prev,
              activities: [newActivity, ...(prev.activities || [])]
          } : null);
      }
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  // Update Client Handler
  const handleUpdateClient = (updatedClient: Client) => {
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
      if (selectedClient && selectedClient.id === updatedClient.id) {
          setSelectedClient(updatedClient);
      }
  };

  const handleTaskDoubleClick = (task: Task) => {
      setSelectedTask(task);
  };

  const handleClientClick = (client: Client) => {
      setSelectedClient(client);
  };

  const handleUpdateTask = (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      if (selectedTask && selectedTask.id === updatedTask.id) {
          setSelectedTask(updatedTask); // Keep modal synced
      }
  };

  // Sync Invoice status to Project Task
  const handleInvoiceAction = (invoice: Invoice) => {
      if (!invoice.projectId) return;

      setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === invoice.projectId) {
              // Map invoice status to task payment status
              const paymentStatus = invoice.status;
              let paidAt = task.paidAt;

              if (paymentStatus === 'Paid' && !paidAt) {
                  paidAt = new Date().toISOString(); // Mark paid now
              } else if (paymentStatus !== 'Paid') {
                  paidAt = undefined; // Reset if unmarked
              }

              return {
                  ...task,
                  paymentStatus: paymentStatus,
                  paidAt: paidAt
              };
          }
          return task;
      }));
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // Sidebar Items Configuration
  const navItems = [
      { icon: 'grid_view', id: 'projects', label: 'Dashboard' },
      { icon: 'group', id: 'clients', label: 'Clients' },
      { icon: 'receipt_long', id: 'invoices', label: 'Invoices' },
      { icon: 'folder_open', id: 'archive', label: 'Archive' }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0f0f0f] text-text-light dark:text-text-dark transition-colors duration-200 font-sans">
      
      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateProject}
        clients={clients}
        categories={availableCategories}
      />

      <ProjectDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        availableTags={availableTags}
        onUpdateTask={handleUpdateTask}
        onAddActivity={handleAddActivity}
        clients={clients}
      />

      {/* Client Details Modal - Triggered from Clients View */}
      <ClientDetailsModal 
        client={selectedClient}
        tasks={tasks}
        onClose={() => setSelectedClient(null)}
        onUpdateClient={handleUpdateClient}
      />

      {/* Sidebar & Main Content Wrapper */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Fixed Sidebar - Youtube Style with Dynamic Width & No Border */}
        <aside 
            className={`
                ${isSidebarCollapsed ? 'w-[72px]' : 'w-60'} 
                bg-white dark:bg-[#0f0f0f] 
                flex flex-col z-50 flex-shrink-0 
                transition-all duration-300 ease-in-out
                ${!isSidebarCollapsed ? 'px-3' : 'px-1'}
                pb-2
            `}
        >
            
            {/* Toggle Button Only - Aligned properly */}
            <div className={`h-14 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start pl-1'}`}>
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-white transition-colors"
                >
                    <Icon name="menu" className="text-[24px]" />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col gap-1 py-2 overflow-y-auto custom-scrollbar hover:overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button 
                            key={item.id}
                            onClick={() => setCurrentView(item.id as ViewState)}
                            className={`
                                flex items-center rounded-lg transition-all duration-200 group relative
                                ${isSidebarCollapsed 
                                    ? 'flex-col justify-center py-3.5 gap-1 mx-1' 
                                    : 'flex-row py-2.5 px-3 gap-5 mx-0'
                                }
                                ${isActive 
                                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                }
                            `}
                            title={isSidebarCollapsed ? item.label : ''}
                        >
                            <Icon 
                                name={item.icon} 
                                className="text-[24px]" 
                                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                            />
                            <span 
                                className={`
                                    ${isSidebarCollapsed 
                                        ? 'text-[10px] tracking-tight' 
                                        : 'text-[14px] tracking-normal'
                                    }
                                    truncate
                                `}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                <div className="my-2 border-t border-gray-100 dark:border-gray-800 mx-2"></div>

                 {/* Settings Item */}
                 <button 
                    onClick={() => setCurrentView('settings')}
                    className={`
                        flex items-center rounded-lg transition-all duration-200 group relative
                        ${isSidebarCollapsed 
                            ? 'flex-col justify-center py-3.5 gap-1 mx-1' 
                            : 'flex-row py-2.5 px-3 gap-5 mx-0'
                        }
                        ${currentView === 'settings' 
                             ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' 
                             : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                    `}
                     title={isSidebarCollapsed ? 'Settings' : ''}
                >
                    <Icon 
                        name="settings" 
                        className="text-[24px]" 
                        style={{ fontVariationSettings: currentView === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
                    />
                    <span 
                        className={`
                            ${isSidebarCollapsed 
                                ? 'text-[10px] tracking-tight' 
                                : 'text-[14px] tracking-normal'
                            }
                        `}
                    >
                        Settings
                    </span>
                </button>
            </nav>

            {/* Bottom Profile Section */}
            <div className={`mt-auto transition-all duration-300 ${isSidebarCollapsed ? 'px-1 py-2' : 'px-0 py-2'}`}>
                <button className={`flex items-center w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${isSidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 text-left'}`}>
                    <div className="relative flex-shrink-0">
                        <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1yQlNm6V7btUzpJ96Rof9w4L8hFzeP-kWZhkms3OVopyf63S4OXx7vVtchhTToMwIVy3m6S4argoUBxxsk2SEsMVMkMsqya95VFyAviKkssrE4tuTV70h9lQ_0B3x_QCxyAo4PwRrq5PgRwRKHDIjDTg4qKdKmNxZMJtxk8e6BQhFJzHe_EjSfpX70AwNooISVmlW16nvGroW_5EPlT1fMlNmuEQZ4mlCeyD586eT78I9xBcBl3N5meISSwhZi3J4S4Mq1FshBrg" 
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gray-300 dark:group-hover:ring-gray-600 transition-all"
                        />
                    </div>
                    
                    {/* Profile Text - Hide on collapse */}
                    <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Alex Creator</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin</p>
                    </div>
                </button>
            </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* Conditional Rendering based on currentView */}
            {currentView === 'projects' ? (
                <>
                    {/* Projects Header - Cleaner, No Border */}
                    <div className="bg-white dark:bg-[#0f0f0f] px-6 py-3 flex items-center justify-between flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Video Projects</h1>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-primary transition-colors">search</span>
                                <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] text-text-light dark:text-text-dark focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-48 lg:w-64 transition-all placeholder-gray-500" 
                                    placeholder="Search" 
                                    type="text" 
                                />
                            </div>
                            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <Icon name="filter_list" className="text-base" />
                                Filter
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full shadow-sm hover:opacity-90 transition-opacity"
                            >
                                <Icon name="add" className="text-base" />
                                New
                            </button>
                        </div>
                    </div>

                    {/* Split View: Kanban + Calendar */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Kanban Board Area */}
                        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative bg-white dark:bg-[#0f0f0f] scrollbar-hide">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="flex h-full gap-6 min-w-max pb-4">
                                    {INITIAL_COLUMNS.map((col) => (
                                        <KanbanColumn 
                                            key={col.id} 
                                            column={col} 
                                            tasks={filteredTasks.filter(t => t.columnId === col.id)} 
                                            onAddTask={() => setIsModalOpen(true)}
                                            onTaskDoubleClick={handleTaskDoubleClick}
                                            onUpdateTask={handleUpdateTask}
                                        />
                                    ))}
                                </div>

                                <DragOverlay dropAnimation={dropAnimation}>
                                    {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                        
                        {/* Calendar Sidebar */}
                        <CalendarSidebar tasks={tasks} />
                    </div>
                </>
            ) : currentView === 'clients' ? (
                <ClientsView 
                    clients={clients} 
                    onAddClient={handleAddClient} 
                    onClientClick={handleClientClick}
                />
            ) : currentView === 'archive' ? (
                <ArchiveView 
                    tasks={tasks} 
                    clients={clients} 
                    onTaskClick={(task) => setSelectedTask(task)} 
                />
            ) : currentView === 'settings' ? (
                <SettingsView 
                    tags={availableTags}
                    onUpdateTags={setAvailableTags}
                    categories={availableCategories}
                    onUpdateCategories={setAvailableCategories}
                />
            ) : (
                <InvoicesView 
                    clients={clients} 
                    projects={tasks} 
                    invoiceSettings={invoiceSettings}
                    onUpdateSettings={setInvoiceSettings}
                    onInvoiceAction={handleInvoiceAction}
                />
            )}

        </main>
      </div>
    </div>
  );
}
