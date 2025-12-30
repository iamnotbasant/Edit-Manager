import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { InvoiceSettings } from '../types';

interface InvoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InvoiceSettings;
  onSave: (settings: InvoiceSettings) => void;
}

export const InvoiceSettingsModal: React.FC<InvoiceSettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<InvoiceSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 transition-all overflow-y-auto">
      <div className="w-full max-w-7xl bg-background-light dark:bg-background-dark rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">Agency Profile & Invoice Defaults</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <Icon name="close" className="text-xl" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your agency details and default settings for generated invoices.</p>
            </div>
            
            <form id="settings-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Agency Information */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <Icon name="business" className="text-primary" />
                                Agency Information
                            </h3>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Company Logo URL</label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                        <div className="h-16 w-16 rounded-lg bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {formData.logo ? (
                                                <div className="bg-center bg-no-repeat bg-cover w-full h-full" style={{backgroundImage: `url("${formData.logo}")`}}></div>
                                            ) : (
                                                <Icon name="image" className="text-slate-400" />
                                            )}
                                        </div>
                                        <input 
                                            className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" 
                                            name="logo" 
                                            type="text" 
                                            placeholder="https://..."
                                            value={formData.logo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Company Name</label>
                                    <div className="mt-2">
                                        <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="companyName" type="text" value={formData.companyName} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Website</label>
                                    <div className="mt-2">
                                        <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="website" type="url" value={formData.website} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Email Address</label>
                                    <div className="mt-2">
                                        <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="email" type="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Phone Number</label>
                                    <div className="mt-2">
                                        <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="phone" type="text" value={formData.phone} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Address</label>
                                    <div className="mt-2">
                                        <textarea className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="address" rows={3} value={formData.address} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <Icon name="account_balance" className="text-primary" />
                                Default Bank Details
                            </h3>
                            <div className="space-y-4">
                                {/* Bank Name */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Bank Name</label>
                                        <div className="mt-1">
                                            <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="bankName" type="text" value={formData.bankName} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <label className="relative inline-flex items-center cursor-pointer" title="Show on invoice">
                                            <input type="checkbox" name="showBankName" className="sr-only peer" checked={formData.showBankName} onChange={handleChange} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                {/* Account Name */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Account Name</label>
                                        <div className="mt-1">
                                            <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="accountName" type="text" value={formData.accountName} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <label className="relative inline-flex items-center cursor-pointer" title="Show on invoice">
                                            <input type="checkbox" name="showAccountName" className="sr-only peer" checked={formData.showAccountName} onChange={handleChange} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                {/* Account Number */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Account Number</label>
                                        <div className="mt-1">
                                            <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="accountNumber" type="text" value={formData.accountNumber} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <label className="relative inline-flex items-center cursor-pointer" title="Show on invoice">
                                            <input type="checkbox" name="showAccountNumber" className="sr-only peer" checked={formData.showAccountNumber} onChange={handleChange} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                {/* IFSC */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">IFSC Code</label>
                                        <div className="mt-1">
                                            <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="ifsc" type="text" value={formData.ifsc} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <label className="relative inline-flex items-center cursor-pointer" title="Show on invoice">
                                            <input type="checkbox" name="showIfsc" className="sr-only peer" checked={formData.showIfsc} onChange={handleChange} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                {/* UPI */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">UPI ID (Optional)</label>
                                        <div className="mt-1">
                                            <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="upiId" type="text" value={formData.upiId} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <label className="relative inline-flex items-center cursor-pointer" title="Show on invoice">
                                            <input type="checkbox" name="showUpi" className="sr-only peer" checked={formData.showUpi} onChange={handleChange} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Defaults */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <Icon name="description" className="text-primary" />
                                Default Notes & Terms
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Default Notes</label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="showNotes" className="sr-only peer" checked={formData.showNotes} onChange={handleChange} />
                                            <span className="mr-2 text-xs text-slate-500">Enable</span>
                                            <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[14px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <textarea className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="defaultNotes" rows={4} value={formData.defaultNotes} onChange={handleChange}></textarea>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Payment Terms</label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="showTerms" className="sr-only peer" checked={formData.showTerms} onChange={handleChange} />
                                            <span className="mr-2 text-xs text-slate-500">Enable</span>
                                            <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[14px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <textarea className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="paymentTerms" rows={4} value={formData.paymentTerms} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <Icon name="short_text" className="text-primary" />
                                Footer Message
                            </h3>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200 mb-2">Default "Thank you" message</label>
                                <input className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-white dark:bg-slate-900 sm:text-sm sm:leading-6 px-3" name="footerMessage" type="text" value={formData.footerMessage} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 justify-end p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
            <button 
                onClick={onClose}
                className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700" 
                type="button"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" 
                type="submit"
            >
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};