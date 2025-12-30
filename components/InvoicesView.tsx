
import React, { useState } from 'react';
import { Icon } from './Icon';
import { NewInvoiceModal } from './NewInvoiceModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { InvoiceSettingsModal } from './InvoiceSettingsModal';
import { Client, Task, Invoice, InvoiceSettings } from '../types';

interface InvoicesViewProps {
    clients: Client[];
    projects: Task[];
    invoiceSettings?: InvoiceSettings;
    onUpdateSettings?: (settings: InvoiceSettings) => void;
    onInvoiceAction?: (invoice: Invoice) => void;
}

const INITIAL_INVOICES: Invoice[] = [
    {
        id: '#INV-2024-001',
        clientImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr9JcL5DShWiatfwNfCGlVmJs4Tg_KDNYMwpJCYQhIO2D-yS8WtZ_Fg1YRjdKU5r5gtTbjf1XcNZGQ3loH-982LTnCnkZYT4JhRR0ggxNwrXbWxLXq2Cgr8dRZ0xe44Ir4MBkc2OPYNppc3tvW5BVXoo9t2vxUSRVWXr25yEn_EOaH5cXRvTBZmNPw6_zML3ucEi8WHSHANnYxsYWWBSN-VqF-mtt5IdyTtEmcIv8i-IHEErs0979YX3zOfIyHtnxjujeG89hAfYI',
        clientName: 'Sarah Wilson',
        clientAddress: '123 Market St, San Francisco, CA',
        clientEmail: 'sarah@example.com',
        projectName: 'Summer Campaign Edit',
        date: 'Oct 24, 2024',
        dueDate: 'Nov 01, 2024',
        amount: '₹ 15,000',
        status: 'Paid',
        rawAmount: 15000,
        currency: 'INR',
        items: [
            { id: 1, description: 'Video Editing', details: 'Core editing services', qty: 1, rate: 10000 },
            { id: 2, description: 'Color Grading', details: 'Basic correction', qty: 1, rate: 5000 }
        ],
        subtotal: 15000,
        discountType: 'amount',
        discountValue: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0,
        notes: 'Thank you for your business!'
    },
    {
        id: '#INV-2024-002',
        clientImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuUfngov8EweQwa4r09xGeo6p1cOgooLmitZ_7SMkjdwQrVWbWqzHZC_O3K_Doc7HpYLsYHbuAUji7ur81n9tB52tcJ6iUhE7P08Gkof5evh7v_OPqkupxmRWdrAJ3zAst1Ix8ub6gOJGDORE0GiIU5ZQXXuhu60zdzExI46gI6AajHsuw_vPuyQ0CozoW7micjvvg_40jEGV8qeT-cU4zQH5iVl3sItbeAvEiygBbeVuxLi3PSfrFgWPZTcSGRT9RGP_z60RdJHY',
        clientName: 'TechFlow Inc.',
        clientAddress: '45 Tech Park, Bangalore',
        clientEmail: 'accounts@techflow.com',
        projectName: 'Product Demo Reel',
        date: 'Nov 02, 2024',
        amount: '₹ 12,500',
        status: 'Pending',
        rawAmount: 12500,
        currency: 'INR',
        items: [{ id: 1, description: 'Demo Reel', details: 'Full production', qty: 1, rate: 12500 }],
        subtotal: 12500,
        discountType: 'amount',
        discountValue: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0
    },
    {
        id: '#INV-2024-003',
        clientImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEB2eXqvvbyJDoFRUx1OtejgNT4NKbjl039ulWpUaVrddYKSoU-nykL--FctG_vKypM0UhWqDq19kgmOKozj9mSQX6ByFM21WnsxUMyXn9UxqIyZSL8nQwJOj0WcsJY_SUK6Hh89Zx1Kd8AwRGMUqLFtVQx0yjRx-lHbdsQPP4Y2TEWw3LGErJzEUJST7PyrOKnEannB0kB0F7tkvG_oHQAA1uJ_Di5q-LkA0ybN9Hfri1_5EiFF-X8a_IKs5rtwwzK3paExOiCKo',
        clientName: 'Marcus Chen',
        projectName: 'Podcast Episode #42',
        date: 'Oct 15, 2024',
        amount: '₹ 2,000',
        status: 'Overdue',
        rawAmount: 2000,
        currency: 'INR',
        items: [{ id: 1, description: 'Audio Sync', details: '', qty: 1, rate: 2000 }],
        subtotal: 2000,
        discountType: 'amount',
        discountValue: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0
    },
    {
        id: '#INV-2024-004',
        clientImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE2YNaa82egX0ABxFMxzs75AYrX5-ep_wYM-iTHXojdCYP7NIC0q2ssvN6tKv_Rh50vbYBJ30G6I_JUyV1AXvCeb8PljqET6oVEyvLKe_YDbl4zwqq6ou_2W3IdQOgswCOJyyfBT60QB5tQAuRkSRWUJo83l0w51QbuGQp6SKyu2C5p22ieQ6JKmJ5D0X-00ywfi_1EVg-GABKFQcLVwCjkj2FY5y9W6jodFwZ8Wk526M9kgb3nFWc9YiUL71Cj5MMLnyNeZMrvWc',
        clientName: 'GreenFields',
        projectName: 'Corporate Interview',
        date: 'Oct 10, 2024',
        amount: '₹ 8,000',
        status: 'Paid',
        rawAmount: 8000,
        currency: 'INR',
        items: [{ id: 1, description: 'Editing', details: '', qty: 1, rate: 8000 }],
        subtotal: 8000,
        discountType: 'amount',
        discountValue: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0
    },
    {
        id: '#INV-2024-005',
        clientImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASfv-5R1O5Lgc4G3jMkP6MMMxYiHcwJKj0__5lyS3oxWVqcTLCkQ1xh5XDTB4vNrOWVFVLm3GhMQcqJsYrlVjbF67YGsIIRjAFtTExZk0sN48y09Gtj4r6jO3R9kSm8_YHVz62zswRXu4DQ1bT_XKmc5rkywf3-rlxsW3WPHjy2UP28kwCJdfUDdoXwf0r2EhmdAkcfySq0Ro9olEZIB9epOHzxv6qHrq0qikJTuFrCNr2ZIu9v2ZWLeoI8VXH1k4nZ907B-qMraY',
        clientName: 'Alice Design',
        projectName: 'UI Animation Package',
        date: 'Oct 05, 2024',
        amount: '₹ 22,000',
        status: 'Paid',
        rawAmount: 22000,
        currency: 'INR',
        items: [{ id: 1, description: 'Animation', details: 'After Effects', qty: 1, rate: 22000 }],
        subtotal: 22000,
        discountType: 'amount',
        discountValue: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0
    }
];

const getStatusColor = (status: string) => {
    switch(status) {
        case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
        case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
        case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ clients, projects, invoiceSettings, onUpdateSettings, onInvoiceAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Smart formatter: Only shows decimals if necessary (e.g. 100.00 -> 100, but 100.50 -> 100.50)
  const formatCurrency = (amount: number, currencyCode = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
    }).format(amount);
  };

  const handleGenerateInvoice = (newInvoice: Invoice) => {
    // Ensure display amount string matches our smart format
    const formatted = formatCurrency(newInvoice.rawAmount, newInvoice.currency);
    const invoiceToAdd = { ...newInvoice, amount: formatted };
    
    setInvoices([invoiceToAdd, ...invoices]);
    if (onInvoiceAction) onInvoiceAction(invoiceToAdd);
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setInvoices(prev => prev.map(inv => {
          if (inv.id === id) {
              // Cycle: Pending -> Paid -> Overdue -> Pending
              let newStatus: 'Pending' | 'Paid' | 'Overdue' = 'Pending';
              if (inv.status === 'Pending') newStatus = 'Paid';
              else if (inv.status === 'Paid') newStatus = 'Overdue';
              else if (inv.status === 'Overdue') newStatus = 'Pending';

              const updatedInv = { ...inv, status: newStatus };
              if (onInvoiceAction) onInvoiceAction(updatedInv);
              return updatedInv;
          }
          return inv;
      }));
  };

  // Derived Stats
  const totalRevenue = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + (inv.rawAmount || 0) : sum, 0);
  const totalPending = invoices.reduce((sum, inv) => inv.status === 'Pending' ? sum + (inv.rawAmount || 0) : sum, 0);
  const totalOverdue = invoices.reduce((sum, inv) => inv.status === 'Overdue' ? sum + (inv.rawAmount || 0) : sum, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden relative animate-in fade-in duration-300">
        
        <NewInvoiceModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            clients={clients}
            projects={projects}
            onGenerate={handleGenerateInvoice}
            invoiceSettings={invoiceSettings}
        />

        {invoiceSettings && onUpdateSettings && (
            <InvoiceSettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={invoiceSettings}
                onSave={onUpdateSettings}
            />
        )}

        {selectedInvoice && (
            <InvoiceDetailModal 
                invoice={selectedInvoice} 
                onClose={() => setSelectedInvoice(null)} 
            />
        )}

        <header className="bg-surface-light dark:bg-surface-dark px-6 py-5 flex items-center justify-between border-b border-border-light dark:border-border-dark flex-shrink-0 transition-colors duration-200">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Invoices</h1>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Invoice Settings"
                >
                    <Icon name="settings" className="text-xl" />
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg shadow-sm transition-colors active:scale-95"
                >
                    <Icon name="add" className="text-xl" />
                    New Invoice
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Paid Revenue</p>
                        <p className="text-3xl font-bold text-text-light dark:text-text-dark">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Icon name="account_balance_wallet" className="text-2xl" />
                    </div>
                </div>
                {/* Pending */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Pending</p>
                        <p className="text-3xl font-bold text-text-light dark:text-text-dark">{formatCurrency(totalPending)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <Icon name="hourglass_empty" className="text-2xl" />
                    </div>
                </div>
                {/* Overdue */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Overdue</p>
                        <p className="text-3xl font-bold text-text-light dark:text-text-dark">{formatCurrency(totalOverdue)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <Icon name="error_outline" className="text-2xl" />
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Transactions</h2>
                    <div className="flex gap-2">
                        <button className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Filter">
                             <Icon name="filter_list" className="text-lg" />
                        </button>
                        <button className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Export">
                             <Icon name="download" className="text-lg" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark">
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {invoices.map((inv) => (
                                <tr 
                                    key={inv.id} 
                                    onClick={() => setSelectedInvoice(inv)}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-5 text-sm font-medium text-primary dark:text-primary-light">{inv.id}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <img alt="Client" className="h-10 w-10 rounded-full bg-gray-200 object-cover" src={inv.clientImg || 'https://ui-avatars.com/api/?name=Unknown&background=random'} />
                                            <span className="text-base font-bold text-text-light dark:text-text-dark whitespace-nowrap">{inv.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{inv.projectName}</td>
                                    <td className="px-6 py-5 text-sm text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">{inv.date}</td>
                                    <td className="px-6 py-5 text-base font-bold text-text-light dark:text-text-dark">
                                        {formatCurrency(inv.rawAmount, inv.currency)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <button 
                                            onClick={(e) => handleToggleStatus(e, inv.id)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold cursor-pointer hover:shadow-md active:scale-95 transition-all select-none ${getStatusColor(inv.status)}`}
                                            title="Click to change status"
                                        >
                                            {inv.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-5 border-t border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Showing {invoices.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Previous</button>
                        <button className="px-4 py-1.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
