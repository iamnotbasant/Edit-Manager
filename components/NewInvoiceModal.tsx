
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { Client, Task, Invoice, InvoiceItem, InvoiceSettings } from '../types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Task[];
  onGenerate: (invoice: Invoice) => void;
  invoiceSettings?: InvoiceSettings;
}

const CURRENCIES = [
    { code: 'INR', symbol: '₹', locale: 'en-IN' },
    { code: 'USD', symbol: '$', locale: 'en-US' },
    { code: 'EUR', symbol: '€', locale: 'en-IE' },
    { code: 'GBP', symbol: '£', locale: 'en-GB' },
];

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({ isOpen, onClose, clients, projects, onGenerate, invoiceSettings }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(''); // Use ID instead of Title directly
  const [invoiceId, setInvoiceId] = useState('');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Video Editing Service', details: 'Basic cuts and transitions', qty: 10, rate: 2500 }
  ]);
  
  // Currency State
  const [currency, setCurrency] = useState('INR');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  
  // Discount States
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [discountValue, setDiscountValue] = useState<number>(0);
  
  const [taxRate, setTaxRate] = useState<number>(18);
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
              setIsCurrencyOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset/Init when opening
  useEffect(() => {
    if (isOpen) {
        setInvoiceId(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
        
        // Load defaults from invoiceSettings if available
        if (invoiceSettings) {
            const parts = [];
            if (invoiceSettings.showTerms && invoiceSettings.paymentTerms) {
                parts.push(invoiceSettings.paymentTerms);
            }
            if (invoiceSettings.showNotes && invoiceSettings.defaultNotes) {
                parts.push(invoiceSettings.defaultNotes);
            }
            setNotes(parts.join('\n\n'));
        }
    }
  }, [isOpen, invoiceSettings]);

  if (!isOpen) return null;

  const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  // Helper to format money based on selected currency
  const formatMoney = (amount: number) => {
      return new Intl.NumberFormat(currentCurrency.locale, {
          style: 'currency',
          currency: currentCurrency.code,
          maximumFractionDigits: 2
      }).format(amount);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  
  let discountAmount = 0;
  if (discountType === 'percent') {
      discountAmount = (subtotal * discountValue) / 100;
  } else {
      discountAmount = discountValue;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', details: '', qty: 1, rate: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClientId) {
        alert("Please select a client");
        return;
    }
    
    setIsGenerating(true);

    try {
      const client = clients.find(c => c.id === selectedClientId);
      const project = projects.find(p => p.id === selectedProjectId);
      
      const formattedAmount = formatMoney(total);
      const formattedDate = new Date(issuedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

      const newInvoice: Invoice = {
          id: '#' + invoiceId,
          projectId: selectedProjectId, // Important for sync
          clientName: client?.name || 'Unknown Client',
          clientImg: client?.img || '',
          clientEmail: client?.email || '',
          clientAddress: client?.location || '',
          projectName: project?.title || 'General Services',
          date: formattedDate,
          dueDate: formattedDueDate,
          amount: formattedAmount,
          status: 'Pending',
          rawAmount: total,
          currency: currency,
          // Details
          items: items,
          subtotal: subtotal,
          discountType: discountType,
          discountValue: discountValue,
          discount: discountAmount,
          taxRate: taxRate,
          taxAmount: taxAmount,
          notes: notes,
          // Save snapshot of agency details
          agencyDetails: invoiceSettings
      };

      // 1. Update App State ONLY
      onGenerate(newInvoice);

      // 2. Close & Reset immediately
      setIsGenerating(false);
      onClose();
      
      // Reset minimal state for next time
      setTimeout(() => {
          setItems([{ id: 1, description: 'Video Editing Service', details: '', qty: 10, rate: 2500 }]);
          setDiscountValue(0);
          setSelectedClientId('');
          setSelectedProjectId('');
          setNotes('');
          setCurrency('INR');
      }, 500);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  const handleDatePicker = (e: React.MouseEvent<HTMLInputElement>) => {
      // Try to open picker programmatically
      try {
          (e.target as HTMLInputElement).showPicker();
      } catch (err) {
          // ignore
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-border-dark flex items-center justify-between bg-white dark:bg-surface-dark sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details below to generate an invoice</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-all duration-200"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0f172a] p-8 custom-scrollbar">
          <form className="grid grid-cols-1 lg:grid-cols-12 gap-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Invoice Details Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
                  <Icon name="receipt" className="text-primary text-lg" />
                  Invoice Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Invoice ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-medium">#</span>
                      </div>
                      <input 
                        className="block w-full pl-7 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-primary focus:border-primary cursor-text hover:border-gray-300 dark:hover:border-gray-600 transition-colors" 
                        type="text" 
                        value={invoiceId}
                        onChange={(e) => setInvoiceId(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Icon name="edit" className="text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Client</label>
                    <div className="relative">
                      <select 
                        className="block w-full py-2.5 px-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer" 
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                      >
                        <option disabled value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                      <button className="absolute right-8 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light text-xs font-medium px-2 py-1 rounded hover:bg-primary/5 transition-colors" type="button">
                          + New
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Issued</label>
                      <div className="relative">
                        <input 
                            className="block w-full py-2.5 pl-3 pr-10 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm cursor-pointer" 
                            type="date"
                            value={issuedDate}
                            onChange={(e) => setIssuedDate(e.target.value)}
                            onClick={handleDatePicker}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon name="calendar_today" className="text-gray-400 text-sm" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Due Date</label>
                      <div className="relative">
                        <input 
                            className="block w-full py-2.5 pl-3 pr-10 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary shadow-sm cursor-pointer" 
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            onClick={handleDatePicker}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon name="calendar_today" className="text-gray-400 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-fit">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Icon name="description" className="text-gray-400 text-lg" />
                  Notes & Terms
                </h3>
                <textarea 
                    className="block w-full p-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary resize-none placeholder-gray-400 leading-relaxed" 
                    placeholder="Add payment terms, thank you notes, or specific instructions..." 
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-full flex flex-col">
                
                {/* Project Ref Row */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Project Reference</label>
                    <select 
                        className="block w-full py-2.5 px-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm hover:border-gray-300 transition-colors"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                      <option disabled value="">Select associated project...</option>
                      {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-px h-10 bg-gray-100 dark:bg-gray-700 mx-2 hidden md:block"></div>
                  
                  {/* Currency Selector */}
                  <div className="hidden md:block relative" ref={currencyDropdownRef}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Currency</label>
                    <button 
                        className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-32 justify-between" 
                        type="button"
                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    >
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary p-0.5 rounded text-xs w-5 h-5 flex items-center justify-center">{currentCurrency.symbol}</span>
                            <span>{currentCurrency.code}</span>
                        </div>
                        <Icon name="expand_more" className="text-lg text-gray-400" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isCurrencyOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            {CURRENCIES.map(curr => (
                                <button
                                    key={curr.code}
                                    type="button"
                                    onClick={() => { setCurrency(curr.code); setIsCurrencyOpen(false); }}
                                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${curr.code === currency ? 'bg-primary/5 text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                    <span className="font-bold w-4 text-center">{curr.symbol}</span>
                                    <span>{curr.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Services & Items</h3>
                  </div>
                  
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-3">
                    <div className="col-span-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Details</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Qty</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Rate</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</div>
                  </div>

                  {/* Item Rows */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg transition-colors group relative">
                        <div className="col-span-1 md:col-span-6">
                            <input 
                                className="block w-full border-0 bg-transparent p-2 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary rounded-md placeholder-gray-400" 
                                placeholder="Item description" 
                                type="text" 
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            />
                            <input 
                                className="block w-full border-0 bg-transparent px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 focus:ring-0 placeholder-gray-300" 
                                placeholder="Add description..." 
                                type="text" 
                                value={item.details}
                                onChange={(e) => handleItemChange(item.id, 'details', e.target.value)}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <input 
                                className="block w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm text-right text-gray-900 dark:text-white focus:ring-primary focus:border-primary rounded-md" 
                                type="number" 
                                value={item.qty}
                                onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="relative">
                            <input 
                                className="block w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm text-right text-gray-900 dark:text-white focus:ring-primary focus:border-primary rounded-md" 
                                type="number" 
                                value={item.rate}
                                onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3">
                            <span className="text-sm font-bold text-gray-900 dark:text-white py-2">
                                {(item.qty * item.rate).toLocaleString('en-US')}
                            </span>
                            <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 md:static" 
                                title="Remove" 
                                type="button"
                            >
                            <Icon name="delete" className="text-lg" />
                            </button>
                        </div>
                        </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddItem}
                    className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group" 
                    type="button"
                  >
                    <span className="bg-primary/10 group-hover:bg-primary/20 text-primary rounded-full p-0.5 transition-colors">
                      <Icon name="add" className="text-lg" />
                    </span>
                    Add New Item
                  </button>
                </div>

                {/* Footer Totals */}
                <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div className="flex flex-col items-end space-y-3 w-full md:w-1/2 ml-auto">
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatMoney(subtotal)}</span>
                    </div>
                    
                    {/* Discount Row */}
                    <div className="flex justify-between items-center w-full text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 dark:text-gray-400">Discount</span>
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
                            <button 
                                type="button"
                                onClick={() => setDiscountType('amount')}
                                className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${discountType === 'amount' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                {currentCurrency.symbol}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setDiscountType('percent')}
                                className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${discountType === 'percent' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                %
                            </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                            className="w-24 text-right p-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:ring-primary focus:border-primary" 
                            placeholder="0" 
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Tax (GST %)</span>
                      <div className="flex items-center gap-2">
                        <input 
                            className="w-24 text-right p-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:ring-primary focus:border-primary" 
                            type="number" 
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        />
                        <span className="text-gray-400 text-xs w-4">%</span>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 w-full my-2"></div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-base font-bold text-gray-900 dark:text-white">Total Due</span>
                      <span className="text-xl font-bold text-primary">{formatMoney(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Action Buttons Footer */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-border-dark bg-white dark:bg-surface-dark flex items-center justify-between sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" type="button"
          >
              Cancel
          </button>
          <div className="flex gap-4">
            <button className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-gray-200" type="button">
                Save Draft
            </button>
            <button 
                onClick={handleSubmit}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-primary/30 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`} type="button"
            >
                {isGenerating ? <Icon name="sync" className="text-xl animate-spin" /> : <Icon name="send" className="text-xl" />}
                {isGenerating ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
