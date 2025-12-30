import React, { useState } from 'react';
import { Icon } from './Icon';
import { Client } from '../types';
import { NewClientModal } from './NewClientModal';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onClientClick?: (client: Client) => void; // Added prop
}

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onAddClient, onClientClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats Calculations
  const totalClients = clients.length;
  const activeProjects = 18; // Placeholder or calculate from tasks if available
  const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);

  // Currency Formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-10 custom-scrollbar relative">
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={onAddClient} 
      />
      
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-light dark:border-border-dark mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-tight">Clients Directory</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">Manage relationships, track projects, and monitor revenue.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex w-full sm:w-[320px] items-center rounded-lg bg-surface-light dark:bg-surface-dark h-11 border border-border-light dark:border-border-dark focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-center pl-3 pr-2">
                <Icon name="search" className="text-[20px]" />
              </div>
              <input 
                className="flex w-full bg-transparent border-none text-text-light dark:text-text-dark placeholder:text-text-secondary-light/70 dark:placeholder:text-text-secondary-dark/70 focus:ring-0 text-sm h-full font-medium" 
                placeholder="Search client by name..."
              />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-primary hover:bg-primary-light active:scale-95 transition-all text-white text-sm font-semibold leading-normal shadow-sm hover:shadow-md"
            >
              <Icon name="add" className="mr-2 text-[20px]" />
              <span className="truncate">Add Client</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Stat 1 */}
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-semibold uppercase tracking-wider">Total Clients</p>
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Icon name="groups" className="text-[20px]" />
              </div>
            </div>
            <p className="text-text-light dark:text-text-dark tracking-tight text-3xl font-black">{totalClients}</p>
          </div>
          
          {/* Stat 2 */}
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-semibold uppercase tracking-wider">Active Projects</p>
              <div className="p-2 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <Icon name="video_library" className="text-[20px]" />
              </div>
            </div>
            <p className="text-text-light dark:text-text-dark tracking-tight text-3xl font-black">{activeProjects}</p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col gap-1 rounded-2xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <Icon name="payments" className="text-[20px]" />
              </div>
            </div>
            <p className="text-text-light dark:text-text-dark tracking-tight text-3xl font-black">{formatCurrency(totalRevenue)}</p>
            <p className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1 mt-1">
              <Icon name="arrow_upward" className="text-[14px]" />
              ₹45k added this week
            </p>
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          
          {clients.map(client => (
              <div key={client.id} onClick={() => onClientClick && onClientClick(client)}>
                  <ClientCard 
                    name={client.name} 
                    location={client.location}
                    projectsDone={client.projectsDone}
                    revenue={formatCurrency(client.revenue)}
                    img={client.img}
                  />
              </div>
          ))}

        </div>
      </div>
    </div>
  );
};

const ClientCard: React.FC<{name: string, location: string, projectsDone: number, revenue: string, img: string}> = ({name, location, projectsDone, revenue, img}) => (
  <div className="flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden cursor-pointer h-full">
    <div className="p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center gap-4">
        <img alt="Client avatar" className="w-14 h-14 rounded-full object-cover shrink-0 bg-gray-100 ring-2 ring-transparent group-hover:ring-primary/20 transition-all" src={img} />
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight group-hover:text-primary transition-colors truncate">{name}</h3>
          <div className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark">
            <Icon name="location_on" className="text-[18px] flex-shrink-0" />
            <span className="text-sm font-medium truncate">{location}</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-border-light dark:bg-border-dark w-full"></div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col gap-0.5">
          <span className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-bold uppercase tracking-widest">Projects</span>
          <span className="text-text-light dark:text-text-dark text-sm font-bold">{projectsDone} Done</span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-text-secondary-light dark:text-text-secondary-dark text-[10px] font-bold uppercase tracking-widest">Revenue</span>
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{revenue}</span>
        </div>
      </div>
    </div>
  </div>
);