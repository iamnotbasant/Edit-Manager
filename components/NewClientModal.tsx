
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

  // Image Handling State
  const [logoMode, setLogoMode] = useState<'url' | 'upload'>('url');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFilePreview, setLogoFilePreview] = useState<string>('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setLogoFilePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple validation
      if (!formData.name) return;

      // Determine Image Source
      let finalImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`;
      
      if (logoMode === 'url' && logoUrl.trim()) {
          finalImg = logoUrl;
      } else if (logoMode === 'upload' && logoFilePreview) {
          finalImg = logoFilePreview;
      }

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
          img: finalImg
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
      setLogoUrl('');
      setLogoFilePreview('');
      setLogoMode('url');
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
                        
                        {/* Improved Image Handler */}
                        <div className="space-y-3 col-span-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-text-light dark:text-text-dark">Company Logo</label>
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                                    <button 
                                        type="button"
                                        onClick={() => setLogoMode('url')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${logoMode === 'url' ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        Image URL
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setLogoMode('upload')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${logoMode === 'upload' ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>

                            {logoMode === 'url' ? (
                                <div className="relative">
                                    <input 
                                        type="url"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-light dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary-light/60 dark:placeholder:text-text-secondary-dark/60"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <Icon name="link" className="absolute left-2.5 top-2.5 text-text-secondary-light dark:text-text-secondary-dark text-[18px]" />
                                    {logoUrl && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 animate-in fade-in">
                                            <Icon name="check_circle" className="text-sm" />
                                            Preview available via hotlink
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-light dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50/30 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-primary/50 transition-all group relative overflow-hidden">
                                        {logoFilePreview ? (
                                            <img src={logoFilePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="p-2 rounded-full bg-white dark:bg-gray-700 mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Icon name="cloud_upload" className="text-text-secondary-light dark:text-text-secondary-dark text-2xl" />
                                                </div>
                                                <p className="text-sm text-text-light dark:text-text-dark font-medium">Click to upload or drag and drop</p>
                                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">SVG, PNG, JPG (max. 800x400px)</p>
                                            </div>
                                        )}
                                        <input className="hidden" type="file" accept="image/*" onChange={handleFileChange}/>
                                    </label>
                                </div>
                            )}
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
