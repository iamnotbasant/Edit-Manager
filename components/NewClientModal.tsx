import React, { useState } from 'react';
import { Icon } from './Icon';
import { Client } from '../types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
      name: '',
      industry: '',
      contactPerson: '',
      location: '',
      email: '',
      phone: '',
      notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple validation
      if (!formData.name) return;

      const newClient: Client = {
          id: `c-${Date.now()}`,
          name: formData.name,
          location: formData.location || 'Unknown',
          industry: formData.industry,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          projectsDone: 0,
          revenue: 0,
          // Placeholder image logic
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`
      };

      onAdd(newClient);
      
      // Reset form
      setFormData({
        name: '',
        industry: '',
        contactPerson: '',
        location: '',
        email: '',
        phone: '',
        notes: ''
      });
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px] p-4 sm:p-6 transition-all">
        <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark flex flex-col max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-visible animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark tracking-tight">Add New Client</h2>
                <button 
                    onClick={onClose}
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Icon name="close" className="text-[24px]" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Client Name</label>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60" 
                                placeholder="e.g. Apex Media" 
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Industry</label>
                            <div className="relative">
                                <select 
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                >
                                    <option disabled value="">Select industry</option>
                                    <option value="tech">Technology</option>
                                    <option value="media">Media & Production</option>
                                    <option value="retail">Retail</option>
                                    <option value="finance">Finance</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-3 top-2.5 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark text-[20px]" />
                            </div>
                        </div>
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Contact Person</label>
                            <input 
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60" 
                                placeholder="e.g. Jane Doe" 
                                type="text"
                            />
                        </div>
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Location</label>
                            <div className="relative">
                                <input 
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60" 
                                    placeholder="City, State" 
                                    type="text"
                                />
                                <Icon name="location_on" className="absolute left-2.5 top-2.5 text-text-secondary-light dark:text-text-secondary-dark text-[18px]" />
                            </div>
                        </div>
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Email Address</label>
                            <div className="relative">
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60" 
                                    placeholder="email@company.com" 
                                    type="email"
                                />
                                <Icon name="mail" className="absolute left-2.5 top-2.5 text-text-secondary-light dark:text-text-secondary-dark text-[18px]" />
                            </div>
                        </div>
                        <div className="space-y-1.5 col-span-2 md:col-span-1">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Phone Number</label>
                            <div className="relative">
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60" 
                                    placeholder="+1 (555) 000-0000" 
                                    type="tel"
                                />
                                <Icon name="call" className="absolute left-2.5 top-2.5 text-text-secondary-light dark:text-text-secondary-dark text-[18px]" />
                            </div>
                        </div>
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Company Logo</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-light dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50/30 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-primary/50 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-2 rounded-full bg-white dark:bg-gray-700 mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                            <Icon name="cloud_upload" className="text-text-secondary-light dark:text-text-secondary-dark text-2xl" />
                                        </div>
                                        <p className="text-sm text-text-light dark:text-text-dark font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                    <input className="hidden" type="file"/>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-sm font-semibold text-text-light dark:text-text-dark">Notes</label>
                            <textarea 
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60 resize-none" 
                                placeholder="Add any additional details about this client..." 
                                rows={3}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-5 border-t border-border-light dark:border-border-dark bg-gray-50/40 dark:bg-gray-800/40 flex justify-end gap-3 rounded-b-2xl">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-border-light dark:border-gray-600 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light hover:shadow-md active:scale-95 transition-all shadow-sm flex items-center gap-2"
                    >
                        <Icon name="check" className="text-[18px]" />
                        Create Client
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};