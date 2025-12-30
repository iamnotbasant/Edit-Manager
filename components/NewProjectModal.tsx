
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { Client, CategoryDefinition } from '../types';

interface ProjectData {
  client: string;
  title: string;
  category: string;
  deadlineDate: string;
  deadlineTime: string;
  priority: 'low' | 'medium' | 'urgent';
  budget?: string;
  currency?: string;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: ProjectData) => void;
  clients?: Client[]; 
  categories?: CategoryDefinition[]; // Added prop
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate, clients = [], categories = [] }) => {
  // Calculate defaults
  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 1 week from now
    return date.toISOString().split('T')[0];
  };

  // Split categories into "Most Used" (Top 4) and "More"
  const topCategories = categories.slice(0, 4);
  const moreCategories = categories.slice(4);

  const [formData, setFormData] = useState<ProjectData>({
    client: '', 
    title: '',
    category: categories.length > 0 ? categories[0].label : 'Ad',
    deadlineDate: getDefaultDate(),
    deadlineTime: '17:00', // Default to 5 PM
    priority: 'medium',
    budget: '',
    currency: 'INR'
  });

  const dateRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
        setFormData(prev => ({
            ...prev,
            // Default to first client if available and none selected, else keep previous or empty
            client: prev.client || (clients.length > 0 ? clients[0].name : 'Alpha Inc.'),
            category: categories.length > 0 ? categories[0].label : 'Ad',
            deadlineDate: getDefaultDate(),
            deadlineTime: '17:00',
            currency: 'INR'
        }));
    }
  }, [isOpen, clients, categories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (cat: string) => {
    setFormData(prev => ({ ...prev, category: cat }));
  };

  const handlePriorityChange = (p: 'low' | 'medium' | 'urgent') => {
    setFormData(prev => ({ ...prev, priority: p }));
  };

  const handleSubmit = () => {
    onCreate(formData);
    onClose();
    // Reset fundamental fields
    setFormData(prev => ({
        ...prev,
        title: '',
        category: categories.length > 0 ? categories[0].label : 'Ad',
        deadlineDate: getDefaultDate(),
        deadlineTime: '17:00',
        priority: 'medium',
        budget: '',
        currency: 'INR'
    }));
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.showPicker) {
        try {
            target.showPicker();
        } catch (error) {
            // Fallback or ignore if not supported/allowed
        }
    }
  };
  
  const handleCalendarIconClick = () => {
      if (dateRef.current && dateRef.current.showPicker) {
          try {
              dateRef.current.showPicker();
          } catch (error) {
              // Fallback
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark text-left shadow-modal transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-border-light dark:border-border-dark ring-1 ring-white/10">
          
          {/* Header */}
          <div className="bg-white dark:bg-[#1E293B] px-6 py-5 border-b border-border-light dark:border-border-dark flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary dark:text-primary-light">
                <Icon name="add_to_photos" className="filled" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark tracking-tight" id="modal-title">Create New Project</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Initialize a new video production workflow.</p>
              </div>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="close" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:p-8 bg-gray-50/50 dark:bg-[#0F172A]">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Client & Basics */}
                  <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-4">
                      <Icon name="badge" className="text-lg text-primary dark:text-primary-light" />
                      Client & Basics
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5" htmlFor="client">Client</label>
                        <div className="relative group">
                            <select 
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5 transition-shadow"
                            >
                              {clients.map(client => (
                                  <option key={client.id} value={client.name}>{client.name}</option>
                              ))}
                              {clients.length === 0 && <option>Default Client</option>}
                            </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5" htmlFor="title">Project Title</label>
                        <input 
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
                            placeholder="e.g., Tech Review - iPhone 16" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Category</label>
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Top Categories */}
                          {topCategories.map(cat => (
                              <label key={cat.id} className="cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="category"
                                    checked={formData.category === cat.label}
                                    onChange={() => handleCategoryChange(cat.label)}
                                    className="peer sr-only" 
                                />
                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-secondary-light dark:text-text-secondary-dark peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white peer-checked:shadow-md transition-all select-none hover:border-gray-300 dark:hover:border-gray-500">
                                    {cat.label}
                                </span>
                              </label>
                          ))}
                          
                          {/* More Dropdown Button */}
                          {moreCategories.length > 0 && (
                              <div className="relative">
                                  <select 
                                    className="appearance-none pl-3 pr-6 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-secondary-light dark:text-text-secondary-dark focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    value={moreCategories.some(c => c.label === formData.category) ? formData.category : ''}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                  >
                                      <option value="" disabled hidden className="text-gray-400">More...</option>
                                      {moreCategories.map(cat => (
                                          <option key={cat.id} value={cat.label} className="text-sm">{cat.label}</option>
                                      ))}
                                  </select>
                                  <Icon name="expand_more" className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-4">
                      <Icon name="settings_video_camera" className="text-lg text-primary dark:text-primary-light" />
                      Technical Specs
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Orientation</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { val: '16:9', icon: 'crop_landscape' },
                                { val: '9:16', icon: 'crop_portrait' },
                                { val: '1:1', icon: 'crop_square' }
                            ].map((opt) => (
                              <label key={opt.val} className="cursor-pointer group relative">
                                <input defaultChecked={opt.val === '16:9'} className="peer sr-only" name="orientation" type="radio" value={opt.val} />
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary transition-all h-20">
                                  <Icon name={opt.icon} className="text-gray-400 peer-checked:text-primary mb-1 transform group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark peer-checked:text-primary">{opt.val}</span>
                                </div>
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                              </label>
                            ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">Resolution</label>
                          <select className="block w-full rounded-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5">
                            <option>1080p</option>
                            <option>4K UHD</option>
                            <option>Vertical HD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">Duration</label>
                          <input className="block w-full rounded-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5 placeholder-gray-400 dark:placeholder-gray-500" placeholder="e.g. 60s" type="text" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Logistics */}
                  <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm h-fit">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-4">
                      <Icon name="schedule" className="text-lg text-primary dark:text-primary-light" />
                      Logistics & Deadline
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Deadline <span className="text-red-500">*</span></label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-gray-600">
                          <div className="flex flex-col gap-3">
                            {/* Date Input */}
                            <div className="relative w-full cursor-pointer group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Icon name="calendar_month" className="text-gray-400 text-sm group-hover:text-primary transition-colors" />
                              </div>
                              <input 
                                ref={dateRef}
                                name="deadlineDate"
                                value={formData.deadlineDate}
                                onChange={handleChange}
                                type="date"
                                onClick={handleInputClick}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-9 pr-10 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors" 
                              />
                              {/* Clickable Calendar Icon on Right */}
                              <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-20"
                                onClick={handleCalendarIconClick}
                                aria-label="Open Calendar"
                              >
                                <Icon name="event" className="text-gray-400 hover:text-primary transition-colors" />
                              </div>
                            </div>
                            
                            {/* Time Input */}
                            <div className="relative w-full cursor-pointer group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <Icon name="schedule" className="text-gray-400 text-sm group-hover:text-primary transition-colors" />
                              </div>
                              <input 
                                name="deadlineTime"
                                value={formData.deadlineTime}
                                onChange={handleChange}
                                type="time"
                                onClick={handleInputClick}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-light dark:text-text-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-9 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors" 
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-2 flex items-center gap-1">
                            <Icon name="info" className="text-xs" />
                            Client expects delivery by this date & time.
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Priority Level</label>
                        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 w-full gap-1">
                          {[
                              { val: 'low', label: 'Low', color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
                              { val: 'medium', label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
                              { val: 'urgent', label: 'Urgent', color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' }
                          ].map((opt) => (
                              <label key={opt.val} className="flex-1 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="priority" 
                                    value={opt.val}
                                    checked={formData.priority === opt.val}
                                    onChange={() => handlePriorityChange(opt.val as any)}
                                    className="peer sr-only" 
                                />
                                <span className={`flex items-center justify-center py-2 text-xs font-semibold rounded-md text-text-secondary-light dark:text-text-secondary-dark peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:${opt.text} peer-checked:shadow-sm transition-all hover:text-text-light dark:hover:text-text-dark`}>
                                  <span className={`w-2 h-2 rounded-full ${opt.color} mr-2 opacity-50 peer-checked:opacity-100`}></span>
                                  {opt.label}
                                </span>
                              </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assets & Money */}
                  <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-4">
                      <Icon name="attach_money" className="text-lg text-primary dark:text-primary-light" />
                      Assets & Money
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">Assets Link</label>
                        <div className="relative rounded-lg shadow-sm group">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon name="link" className="text-gray-400 text-lg group-focus-within:text-primary transition-colors" />
                          </div>
                          <input className="block w-full rounded-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark pl-10 focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5 placeholder-gray-400 dark:placeholder-gray-500 transition-all" placeholder="Paste GDrive / Dropbox Link" type="url" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">Budget Estimate</label>
                        <div className="relative rounded-lg shadow-sm group flex">
                          <div className="relative flex-1">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 dark:text-gray-400 font-semibold sm:text-sm">
                                    {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₹'}
                                </span>
                              </div>
                              <input 
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="block w-full rounded-l-lg border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-text-light dark:text-text-dark pl-8 pr-3 focus:border-primary focus:ring-primary focus:ring-opacity-50 sm:text-sm py-2.5 placeholder-gray-400 dark:placeholder-gray-500 font-medium transition-all" 
                                placeholder="0.00" 
                                type="number" 
                              />
                          </div>
                          <div className="relative">
                              <select 
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="h-full rounded-r-lg border-l-0 border-border-light dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-text-secondary-light dark:text-text-secondary-dark sm:text-xs font-semibold px-3 focus:ring-0 focus:border-border-light cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                  <option value="INR">INR</option>
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="GBP">GBP</option>
                              </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-white dark:bg-[#1E293B] px-6 py-4 flex flex-row-reverse gap-3 border-t border-border-light dark:border-border-dark sticky bottom-0 z-10 rounded-b-2xl">
            <button 
                onClick={handleSubmit}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all transform active:scale-95"
            >
              <Icon name="rocket_launch" className="text-lg mr-2" />
              Create Project
            </button>
            <button 
                onClick={onClose}
                className="mt-3 sm:mt-0 inline-flex w-full justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5 text-sm font-medium text-text-light dark:text-text-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:w-auto transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
