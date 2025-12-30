import React, { useState } from 'react';
import { Invoice } from '../types';
import { Icon } from './Icon';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { DEFAULT_INVOICE_SETTINGS } from '../constants';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  // Use stored agency settings or fallback to default for legacy invoices
  const agency = invoice.agencyDetails || DEFAULT_INVOICE_SETTINGS;
  const currencyCode = invoice.currency || 'INR';
  const currencySymbol = currencyCode === 'INR' ? '₹' : (currencyCode === 'USD' ? '$' : (currencyCode === 'EUR' ? '€' : '£'));
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';

  // Helper to format money based on invoice currency
  const formatMoney = (amount: number) => {
      return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
          maximumFractionDigits: 2
      }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
      setIsDownloading(true);
      // We pass 'invoice-document' as the second argument to trigger Visual Mode
      await generateInvoicePDF(invoice, 'invoice-document');
      setIsDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop - Click to close */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container - centers content and allows scroll */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center print:p-0">
        
        {/* Content Wrapper */}
        <div className="relative w-full max-w-[210mm] flex flex-col items-center transition-all transform z-10">
            
            {/* Toolbar - Hidden when printing */}
            <div className="no-print w-full mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white dark:bg-surface-dark p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1 pl-2">
                        <button 
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white mr-2 transition-colors" title="Close"
                        >
                            <Icon name="arrow_back" />
                        </button>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                        <button 
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors" title="Print"
                        >
                            <Icon name="print" />
                        </button>
                        <button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors" title="Send Email">
                            <Icon name="mail" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 hidden sm:inline">Status: 
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ml-2 
                                ${invoice.status === 'Paid' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 
                                  invoice.status === 'Overdue' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' : 
                                  'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>
                                {invoice.status}
                            </span>
                        </span>
                        <button 
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isDownloading ? (
                                <Icon name="sync" className="text-[20px] animate-spin" />
                            ) : (
                                <Icon name="download" className="text-[20px]" />
                            )}
                            <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoice Document (The Paper) */}
            <div id="invoice-document" className="relative flex w-full min-h-[297mm] flex-col bg-white text-slate-900 shadow-2xl print:shadow-none print:w-full print:max-w-none rounded-sm overflow-hidden text-left">
                
                {/* Invoice Header */}
                <div className="p-8 md:p-12 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        {/* Agency Info */}
                        <div className="flex flex-col gap-4 max-w-[300px]">
                            <div className="flex items-center gap-3">
                                {agency.logo ? (
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12 flex-shrink-0" style={{backgroundImage: `url("${agency.logo}")`}}></div>
                                ) : (
                                    <div className="bg-primary/10 rounded-lg size-12 flex items-center justify-center text-primary">
                                        <Icon name="business" className="text-2xl" />
                                    </div>
                                )}
                                <h1 className="text-xl font-bold tracking-tight text-slate-900">{agency.companyName}</h1>
                            </div>
                            <div className="text-sm leading-relaxed text-slate-500 whitespace-pre-line">
                                <p>{agency.address}</p>
                                <p>{agency.email}</p>
                                <p>{agency.phone}</p>
                            </div>
                        </div>
                        {/* Invoice Meta */}
                        <div className="flex flex-col items-start md:items-end text-left md:text-right">
                            <h2 className="text-4xl font-bold text-slate-900 mb-1 tracking-tight">INVOICE</h2>
                            <p className="text-lg font-medium text-primary mb-6">{invoice.id}</p>
                            <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-sm">
                                <div className="text-slate-500">Issued Date:</div>
                                <div className="font-medium text-slate-900">{invoice.date}</div>
                                {invoice.dueDate && (
                                    <>
                                        <div className="text-slate-500">Due Date:</div>
                                        <div className="font-medium text-slate-900">{invoice.dueDate}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="h-px bg-slate-100 mx-8 md:mx-12"></div>
                
                {/* Bill To Section */}
                <div className="px-8 md:px-12 py-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Bill To</h3>
                    <div className="flex flex-col gap-1">
                        <p className="text-lg font-bold text-slate-900">{invoice.clientName}</p>
                        <p className="text-sm font-medium text-slate-700">Attn: {invoice.clientName.split(' ')[0]}</p>
                        {invoice.clientAddress && (
                            <p className="text-sm text-slate-500 whitespace-pre-line">{invoice.clientAddress}</p>
                        )}
                        {invoice.clientEmail && (
                            <p className="text-sm text-slate-500 mt-1">{invoice.clientEmail}</p>
                        )}
                    </div>
                </div>
                
                {/* Items Table */}
                <div className="px-8 md:px-12 py-4 flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 w-[50%]">Description</th>
                                <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-[15%]">Qty</th>
                                <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-[15%]">Rate</th>
                                <th className="py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-[20%]">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {invoice.items && invoice.items.length > 0 ? (
                                invoice.items.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-50 group">
                                        <td className="py-4 pr-4">
                                            <p className="font-medium text-slate-900">{item.description}</p>
                                            {item.details && <p className="text-xs text-slate-500 mt-1">{item.details}</p>}
                                        </td>
                                        <td className="py-4 text-center align-top pt-5">{item.qty}</td>
                                        <td className="py-4 text-right align-top pt-5">{formatMoney(item.rate)}</td>
                                        <td className="py-4 text-right align-top pt-5 font-medium text-slate-900">{formatMoney(item.qty * item.rate)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b border-slate-50 group">
                                    <td className="py-4 pr-4">
                                        <p className="font-medium text-slate-900">Video Production Services</p>
                                        <p className="text-xs text-slate-500 mt-1">{invoice.projectName}</p>
                                    </td>
                                    <td className="py-4 text-center align-top pt-5">1</td>
                                    <td className="py-4 text-right align-top pt-5">{invoice.amount}</td>
                                    <td className="py-4 text-right align-top pt-5 font-medium text-slate-900">{invoice.amount}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Summary Section */}
                <div className="px-8 md:px-12 pb-8">
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">{formatMoney(invoice.subtotal ? invoice.subtotal : invoice.rawAmount)}</span>
                            </div>
                            {(invoice.discount > 0 || (invoice.discountValue && invoice.discountValue > 0)) && (
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Discount {invoice.discountType === 'percent' ? `(${invoice.discountValue}%)` : ''}</span>
                                    <span className="font-medium text-red-500">- {formatMoney(invoice.discount ? invoice.discount : invoice.discountValue)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Tax ({invoice.taxRate}%)</span>
                                <span className="font-medium text-slate-900">{formatMoney(invoice.taxAmount ? invoice.taxAmount : 0)}</span>
                            </div>
                            <div className="border-t-2 border-slate-100 pt-3 flex justify-between items-center">
                                <span className="text-sm font-bold uppercase text-slate-900">Total Due</span>
                                <span className="text-2xl font-bold text-primary">{invoice.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Section */}
                <div className="mt-auto bg-slate-50 p-8 md:p-12 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Notes & Terms</h4>
                            <div className="text-xs text-slate-500 list-disc list-inside space-y-1">
                                {invoice.notes ? (
                                    <p className="whitespace-pre-line">{invoice.notes}</p>
                                ) : (
                                    <ul className="list-disc list-inside">
                                        <li>Payment is due within 7 days of invoice date.</li>
                                        <li>Please include the invoice number on your check or bank transfer.</li>
                                        <li>Late payments may be subject to a 2% monthly fee.</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 md:text-right">
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Bank Details</h4>
                            <div className="text-xs text-slate-500 space-y-1">
                                {agency.showBankName && <p>Bank Name: {agency.bankName}</p>}
                                {agency.showAccountName && <p>Account Name: {agency.accountName}</p>}
                                {agency.showAccountNumber && <p>Account No: {agency.accountNumber}</p>}
                                {agency.showIfsc && <p>IFSC: {agency.ifsc}</p>}
                                {agency.showUpi && agency.upiId && <p>UPI: {agency.upiId}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                        <p className="text-slate-400 font-medium text-sm">{agency.footerMessage}</p>
                        <p className="text-slate-400 text-xs mt-1">{agency.website}</p>
                    </div>
                </div>
                
                {/* Decorative bottom bar */}
                <div className="h-2 w-full bg-primary"></div>
            </div>
            
            <div className="no-print h-12"></div>
        </div>
      </div>
    </div>
  );
};