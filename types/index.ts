
export type TagStyle = 
  | 'blue'
  | 'pink'
  | 'purple'
  | 'green'
  | 'cyan'
  | 'amber'
  | 'red'
  | 'gray';

export type ClientColor = 'blue' | 'orange' | 'purple' | 'green' | 'gray';
export type DueStatus = 'urgent' | 'warning' | 'info' | 'normal';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Unbilled';
export type RevisionStatus = 'Creating' | 'Reviewing' | 'Completed';

export interface TagDefinition {
    id: string;
    label: string;
    style: TagStyle;
}

export interface CategoryDefinition {
    id: string;
    label: string;
}

export interface Activity {
    id: string;
    type: 'move' | 'create' | 'comment' | 'upload' | 'update';
    content: string; // e.g. "Moved to In Progress" or user comment
    timestamp: string; // ISO string
    user: string; // "You", "System", "Alex"
}

export interface Revision {
    id: string;
    number: number;
    content: string;
    link?: string;
    date: string; // ISO string
    status: RevisionStatus;
}

export interface Task {
  id: string;
  columnId: string;
  client: string;
  clientColor?: ClientColor;
  title: string;
  tag: string;
  tagStyle: TagStyle;
  date?: string;     // Legacy/Generic date
  createdAt?: string; // Date the project was created
  dueDate?: string;  // Display string (fallback)
  deadline?: string; // ISO Timestamp for calculation (e.g. 2023-11-20T17:00:00.000Z)
  dueStatus?: DueStatus;
  
  // Financials
  budget?: number;
  currency?: string;

  // Revisions
  revisions: Revision[];
  
  // Payment Tracking
  paymentStatus?: PaymentStatus;
  paidAt?: string; // ISO Date string when it was marked paid
  
  // Activity Log
  activities: Activity[]; 

  // Deliverables (New)
  videoLink?: string;
  projectFileLink?: string;
}

export interface Column {
  id: string;
  title: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  location: string;
  projectsDone: number;
  revenue: number;
  img: string;
  industry?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  details: string;
  qty: number;
  rate: number;
}

export interface InvoiceSettings {
  companyName: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  
  // Bank Details
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  
  // Visibility Toggles
  showBankName: boolean;
  showAccountName: boolean;
  showAccountNumber: boolean;
  showIfsc: boolean;
  showUpi: boolean;
  
  // Terms & Notes
  defaultNotes: string;
  showNotes: boolean;
  paymentTerms: string;
  showTerms: boolean;
  
  footerMessage: string;
}

export interface Invoice {
    id: string;
    projectId?: string; // Link to task
    clientImg: string;
    clientName: string;
    clientEmail?: string;
    clientAddress?: string;
    projectName: string;
    date: string;
    dueDate?: string;
    amount: string; // Formatted string e.g. "₹ 15,000"
    status: 'Paid' | 'Pending' | 'Overdue';
    rawAmount: number; // Numeric total
    currency: string; // e.g. 'INR', 'USD'
    
    // Detailed fields
    items: InvoiceItem[];
    subtotal: number;
    
    // Discount
    discountType: 'amount' | 'percent';
    discountValue: number; // The raw value entered (e.g., 10 for 10% or 1000 for ₹1000)
    discount: number; // The calculated monetary amount subtracted
    
    taxRate: number;
    taxAmount: number;
    notes?: string;
    
    // Snapshot of agency details at time of creation
    agencyDetails?: InvoiceSettings;
}

export type DndId = string | number;
