
import React, { useState, useEffect } from 'react';
import { Client, Task } from '../types';
import { Icon } from './Icon';

interface ClientDetailsModalProps {
  client: Client | null;
  tasks: Task[];
  onClose: () => void;
  onUpdateClient?: (client: Client) => void;
}

// Optimized CSS: Removed heavy 3D rotation, simplified gradients
const HOLO_STYLES = `
  @keyframes holoSheen {
    0% { background-position: 150% 0%; }
    100% { background-position: -50% 0%; }
  }
  .holo-card-wrapper {
    perspective: 1000px;
  }
  .holo-card {
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
    will-change: transform;
  }
  .holo-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  }
  .holo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 20%,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 30%,
      transparent 45%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 55%
    );
    background-size: 200% 100%;
    background-position: 150% 0%;
    pointer-events: none;
    z-index: 20;
    border-radius: 1.5rem;
  }
  .holo-card:hover .holo-overlay {
    animation: holoSheen 2s infinite linear;
  }
  .texture-grid {
    background-size: 20px 20px;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  }
`;

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, onClose, onUpdateClient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
      if (client) {
          setFormData(client);
          setIsEditing(false);
      }
  }, [client]);

  if (!client) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
      if (onUpdateClient && formData) {
          onUpdateClient({ ...client, ...formData } as Client);
          setIsEditing(false);
      }
  };

  const handleImageEdit = () => {
      const url = prompt("Enter new image URL:", formData.img || client.img);
      if (url) {
          setFormData(prev => ({ ...prev, img: url }));
      }
  };

  const copyToClipboard = (text?: string) => {
      if (text) {
          navigator.clipboard.writeText(text);
      }
  };

  // Theme based on industry
  const getTheme = (industry: string = '') => {
      const i = industry.toLowerCase();
      if (i.includes('tech')) return { bg: 'bg-slate-900', accent: 'text-blue-400', border: 'border-slate-700', gradient: 'from-slate-800 to-slate-900' };
      if (i.includes('media')) return { bg: 'bg-purple-900', accent: 'text-purple-400', border: 'border-purple-700', gradient: 'from-purple-900 to-indigo-950' };
      if (i.includes('finance')) return { bg: 'bg-emerald-900', accent: 'text-emerald-400', border: 'border-emerald-700', gradient: 'from-emerald-900 to-teal-950' };
      return { bg: 'bg-gray-900', accent: 'text-gray-400', border: 'border-gray-700', gradient: 'from-gray-800 to-black' };
  };

  const theme = getTheme(formData.industry || client.industry);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(5px)' }}>
      <style>{HOLO_STYLES}</style>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Card Wrapper */}
      <div className="holo-card-wrapper relative z-10 w-full max-w-sm">
        
        <div className={`holo-card relative rounded-3xl overflow-hidden shadow-2xl border ${theme.border} bg-black`}>
            {/* Holo Overlay (Sheen) */}
            <div className="holo-overlay"></div>

            {/* Background Texture */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
            <div className="absolute inset-0 texture-grid opacity-20"></div>

            {/* Header / Avatar Section */}
            <div className="relative pt-8 pb-4 px-6 flex flex-col items-center border-b border-white/10">
                 {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
                >
                    <Icon name="close" className="text-xl" />
                </button>

                <div className="relative w-28 h-28 mb-4 group">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-white/5 animate-pulse`}></div>
                    <img 
                        src={formData.img || client.img} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-white/10 shadow-lg relative z-10 bg-gray-800" 
                    />
                    {isEditing && (
                        <div 
                            onClick={handleImageEdit}
                            className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center z-20 cursor-pointer border-4 border-transparent hover:bg-black/70 transition-colors"
                            title="Change Image URL"
                        >
                            <Icon name="edit" className="text-white text-2xl" />
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-white/30 text-white font-bold text-2xl text-center focus:outline-none focus:border-white w-full mb-1"
                        placeholder="Client Name"
                    />
                ) : (
                    <h2 className="text-2xl font-bold text-white text-center leading-tight">{client.name}</h2>
                )}

                {isEditing ? (
                    <input 
                         name="industry"
                         value={formData.industry}
                         onChange={handleInputChange}
                         className={`bg-transparent border-b border-white/30 ${theme.accent} text-sm font-medium text-center focus:outline-none focus:border-white w-1/2 uppercase tracking-wider`}
                         placeholder="Industry"
                    />
                ) : (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${theme.accent} text-xs font-bold uppercase tracking-wider mt-2`}>
                        {formData.industry || client.industry || 'General'}
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="relative p-6 space-y-5">
                
                {/* Contact Person */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Icon name="person" className="text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Contact Person</p>
                        {isEditing ? (
                            <input 
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-white/20 text-white text-sm py-0.5 focus:outline-none focus:border-white"
                                placeholder="Name"
                            />
                        ) : (
                            <p className="text-sm font-medium text-white">{client.contactPerson || 'N/A'}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Icon name="mail" className="text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 group">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Email Address</p>
                        {isEditing ? (
                            <input 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-white/20 text-white text-sm py-0.5 focus:outline-none focus:border-white"
                                placeholder="Email"
                            />
                        ) : (
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard(client.email)}>
                                <p className="text-sm font-medium text-white truncate">{client.email || 'N/A'}</p>
                                {client.email && <Icon name="content_copy" className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Icon name="call" className="text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 group">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Phone Number</p>
                        {isEditing ? (
                            <input 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-white/20 text-white text-sm py-0.5 focus:outline-none focus:border-white"
                                placeholder="Phone"
                            />
                        ) : (
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard(client.phone)}>
                                <p className="text-sm font-medium text-white truncate">{client.phone || 'N/A'}</p>
                                {client.phone && <Icon name="content_copy" className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Icon name="location_on" className="text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Location</p>
                        {isEditing ? (
                            <input 
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full bg-transparent border-b border-white/20 text-white text-sm py-0.5 focus:outline-none focus:border-white"
                                placeholder="City, State"
                            />
                        ) : (
                            <p className="text-sm font-medium text-white">{formData.location || 'N/A'}</p>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                         <p className="text-[10px] text-gray-400 uppercase font-bold">Total Revenue</p>
                         <p className={`text-lg font-bold ${theme.accent}`}>
                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.revenue)}
                         </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                         <p className="text-[10px] text-gray-400 uppercase font-bold">Projects</p>
                         <p className="text-lg font-bold text-white">{client.projectsDone}</p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2.5 rounded-lg border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                SAVE CHANGES
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="w-full py-3 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Icon name="edit" className="text-sm text-gray-400 group-hover:text-white" /> 
                            EDIT CARD
                        </button>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
