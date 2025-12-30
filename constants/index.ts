
import { Column, Task, Client, InvoiceSettings, TagDefinition, CategoryDefinition } from "../types";

export const INITIAL_COLUMNS: Column[] = [
  { id: 'todo', title: 'To-Do', icon: 'movie_edit' },
  { id: 'in-progress', title: 'In Progress', icon: 'video_settings' },
  { id: 'revision', title: 'In Revision', icon: 'rate_review' },
  { id: 'exported', title: 'Exported', icon: 'check_circle' },
];

// Helper to get a dynamic ISO string for "Today + 4 hours"
const getDynamicDeadline = () => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString();
};

// Helper for past dates in activities
const getPastDate = (hoursAgo: number) => {
    const d = new Date();
    d.setHours(d.getHours() - hoursAgo);
    return d.toISOString();
};

export const INITIAL_CATEGORIES: CategoryDefinition[] = [
    { id: 'cat1', label: 'Reel' },
    { id: 'cat2', label: 'Ad' },
    { id: 'cat3', label: 'Vlog' },
    { id: 'cat4', label: 'Tutorial' },
    { id: 'cat5', label: 'Gaming' },
    { id: 'cat6', label: 'Documentary' },
    { id: 'cat7', label: 'Music Video' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    columnId: 'in-progress',
    client: 'SkyNet',
    clientColor: 'blue',
    title: 'Tech Review - Rough Cut',
    tag: 'EDITING',
    tagStyle: 'blue',
    dueDate: 'DUE TODAY',
    deadline: getDynamicDeadline(), 
    dueStatus: 'urgent',
    paymentStatus: 'Unbilled',
    revisions: [],
    activities: [
        { id: 'a1', type: 'move', content: 'Moved to In Progress', timestamp: getPastDate(2), user: 'You' },
        { id: 'a2', type: 'create', content: 'Project created', timestamp: getPastDate(24), user: 'System' }
    ]
  },
  {
    id: 't2',
    columnId: 'in-progress',
    client: 'Wanderlust',
    clientColor: 'orange',
    title: 'Travel Documentary - Color Grade',
    tag: 'COLOR',
    tagStyle: 'pink',
    dueDate: 'Due Tomorrow',
    dueStatus: 'warning',
    paymentStatus: 'Unbilled',
    revisions: [],
    activities: [
        { id: 'a3', type: 'comment', content: 'Client requested warmer tones for the sunset scenes.', timestamp: getPastDate(5), user: 'Sarah' },
        { id: 'a4', type: 'create', content: 'Project created', timestamp: getPastDate(48), user: 'System' }
    ]
  },
  {
    id: 't3',
    columnId: 'in-progress',
    client: 'GameOn',
    clientColor: 'purple',
    title: 'Esports Highlights #5',
    tag: 'VFX',
    tagStyle: 'purple',
    dueDate: '3 Days Left',
    dueStatus: 'info',
    paymentStatus: 'Unbilled',
    revisions: [],
    activities: []
  },
  {
    id: 't4',
    columnId: 'in-progress',
    client: 'NatureDocs',
    clientColor: 'green',
    title: 'Forest Sounds - Cut',
    tag: 'ASSEMBLY',
    tagStyle: 'green',
    dueDate: 'Due: Nov 20',
    dueStatus: 'normal',
    paymentStatus: 'Unbilled',
    revisions: [],
    activities: []
  },
  {
    id: 't5',
    columnId: 'todo',
    client: 'GreenFields',
    clientColor: 'gray',
    title: 'Client Interview - Raw Footage',
    tag: 'INGEST',
    tagStyle: 'cyan',
    date: 'Nov 12',
    dueStatus: 'normal',
    paymentStatus: 'Unbilled',
    revisions: [],
    activities: [
        { id: 'a5', type: 'create', content: 'Project created', timestamp: getPastDate(1), user: 'System' }
    ]
  },
  {
    id: 't6',
    columnId: 'revision',
    client: 'Visionary',
    clientColor: 'gray',
    title: 'Product Launch Ad - Feedback',
    tag: 'REVISION',
    tagStyle: 'amber',
    dueDate: 'Nov 25',
    dueStatus: 'normal',
    paymentStatus: 'Unbilled',
    revisions: [
        {
            id: 'r1',
            number: 1,
            content: "Please adjust the color grading on the outdoor shots, they look a bit washed out. Also sync the beat drop at 0:15.",
            date: getPastDate(24),
            status: 'Reviewing'
        },
        {
            id: 'r2',
            number: 2,
            content: "Add subtitles for the Spanish segment.",
            date: getPastDate(2),
            status: 'Creating'
        }
    ],
    activities: [
        { id: 'a6', type: 'move', content: 'Moved to In Revision', timestamp: getPastDate(0.5), user: 'You' },
        { id: 'a7', type: 'upload', content: 'uploaded v2_draft.mp4', timestamp: getPastDate(3), user: 'Alex' }
    ]
  },
  // Exported Tasks for testing cleanup logic
  {
    id: 't7',
    columnId: 'exported',
    client: 'Apex Media',
    clientColor: 'blue',
    title: 'Summer Sale Promo',
    tag: 'FINAL',
    tagStyle: 'green',
    dueDate: 'Oct 25',
    dueStatus: 'normal',
    paymentStatus: 'Paid',
    paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    revisions: [],
    activities: [],
    videoLink: 'https://example.com/video.mp4',
    projectFileLink: 'https://example.com/project.zip'
  },
  {
    id: 't8',
    columnId: 'exported',
    client: 'Summit Studio',
    clientColor: 'orange',
    title: 'Mountain Hike Reel',
    tag: 'FINAL',
    tagStyle: 'green',
    dueDate: 'Oct 30',
    dueStatus: 'normal',
    paymentStatus: 'Pending',
    revisions: [],
    activities: []
  },
  {
    id: 't9',
    columnId: 'exported',
    client: 'Vortex Creators',
    clientColor: 'purple',
    title: 'Tech Unboxing V2',
    tag: 'FINAL',
    tagStyle: 'green',
    dueDate: 'Oct 15',
    dueStatus: 'normal',
    paymentStatus: 'Overdue', 
    revisions: [],
    activities: []
  }
];

export const INITIAL_CLIENTS: Client[] = [
    {
        id: 'c1',
        name: 'Apex Media',
        location: 'San Francisco, CA',
        projectsDone: 5,
        revenue: 25000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvOqVrSmGPSuqKIH0ybTu_MbYAdhSdxdzCGKituHV_0jCal8k6bNJJ-YegF8XWupL5rpN0NKAq4kzZw2jcXxrhoKgg57lV5C1nFM3py9hPUQ528l84e103S8KqMkdU1qOgZImpmDnxteWTz0QZVV-kXlgWaTboNU3TgNzPnnYxJM1Mn-5uMxP0OyGwT4HmKC4X6U8Go4NSQgJ4xHYsU_4SUCAEDE1wNoP4Fv8tMWUwuOSbXfMyb-RNX-ygDxFxXppiE-DCo14g-A',
        industry: 'media'
    },
    {
        id: 'c2',
        name: 'Summit Studio',
        location: 'Denver, CO',
        projectsDone: 12,
        revenue: 145000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWcJyqZMIgbe5Yttfh0SbdOgdg3NmonQHvtD7eXui4CC7UkPPOmPBhKrcoLhZSOIErUaBC0Wf6pAjL7W1a5vd1VVXjgQdjfSDH9EIySLZirHo0wxfI1jes45wuYYok6WeiCGxcicx_Nji5tYmMtUQYxs5dd3ztEzfTCV1-DwjLKllaiBQut971az98tlBbtRABMJDVrrw7GisC88lunoB7XCOcx-Czs4qW1lsLBazeF4qxjP8QT6twmYsXLJ6zxE9XrdcAApURPxo',
        industry: 'tech'
    },
    {
        id: 'c3',
        name: 'Vortex Creators',
        location: 'Austin, TX',
        projectsDone: 3,
        revenue: 85000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL3kzyS4uN-nvjSZ565pL4eq9iz_fHraS0wH3v4YqxKKAhklTy6YJzKnudHV2MDRQjaNBjv7KyMOgIFP3rZKEN7eYVEGikf6nwK1WNLyJGs7UGwereUqcT-VYGOTrWglMi_1u8tP9Yv6iYaj2m6V1nju3iqwV4WBstGwQuqMfvjtLjlQ90SirbnVeWn0fR-_t8n_Bt2rGPhDi7TPRpUzkm9YVaGBIBP0mmOLpEdqX8xZqPMfFVp33FtyHwQWcTTHSqYo37tCA86vk',
        industry: 'retail'
    },
    {
        id: 'c4',
        name: 'Horizon Films',
        location: 'London, UK',
        projectsDone: 8,
        revenue: 320000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCESNKeRT3rHHidZH7Jfbgq_F9xh4IQ_HdwvdogNbHtkgh_suS9GGNlWQROlHqsMgE9ZQjVuZ4M0oEFEOG5PZdmpRxQbt2CIYpJqjuGdB4z8YsYvm6IkYwvYnV80eJDTXH5j8PkZ8vWplhAvQgUVHXzBBrQMl12_Nl02ovk4MQURktEzmmMLAKBingqNzf651B_v8ZprxY39mznVqan94n6djK50ej3ihWTQbBlAzma7UGMvTvMqQXkwXVr3sGmYXJEOGcG9pRcS2k',
        industry: 'media'
    },
    {
        id: 'c5',
        name: 'Elevate Corp',
        location: 'New York, NY',
        projectsDone: 15,
        revenue: 550000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1yQlNm6V7btUzpJ96Rof9w4L8hFzeP-kWZhkms3OVopyf63S4OXx7vVtchhTToMwIVy3m6S4argoUBxxsk2SEsMVMkMsqya95VFyAviKkssrE4tuTV70h9lQ_0B3x_QCxyAo4PwRrq5PgRwRKHDIjDTg4qKdKmNxZMJtxk8e6BQhFJzHe_EjSfpX70AwNooISVmlW16nvGroW_5EPlT1fMlNmuEQZ4mlCeyD586eT78I9xBcBl3N5meISSwhZi3J4S4Mq1FshBrg',
        industry: 'finance'
    },
    {
        id: 'c6',
        name: 'Streamline',
        location: 'Los Angeles, CA',
        projectsDone: 2,
        revenue: 15000,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASl-f-G2GvWKMSqnXIWFliNZZB2dt4OkuAbZXic6PMfU0B5Qqao8B4tv7qogyyIg4de95I8h-IQ5vXiLB4Um5MX6MAkiEElvWymv2SWMeqaneG8nIh5HTLr5L1JTzrr0xAioay05wOD1K-8o3ZLj9uOWZxZIn-P5I_tUOXUusnk6w9Y7-s90w2qMugSxyKNeeOfWeBy5g0ktQCWh7h1iGCM4QkD2IG0IPt4J9-PsjzIAKcNPRGW2vA1N3g1uma8l4zUDpUtjWq164',
        industry: 'tech'
    }
];

export const INITIAL_AVAILABLE_TAGS: TagDefinition[] = [
    { id: '1', label: 'EDITING', style: 'blue' },
    { id: '2', label: 'COLOR', style: 'pink' },
    { id: '3', label: 'VFX', style: 'purple' },
    { id: '4', label: 'ASSEMBLY', style: 'green' },
    { id: '5', label: 'INGEST', style: 'cyan' },
    { id: '6', label: 'REVISION', style: 'amber' },
    { id: '7', label: 'FINAL', style: 'green' },
    { id: '8', label: 'RUSH', style: 'red' },
];

export const TAG_STYLES = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export const CLIENT_COLORS = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
    companyName: "Creative Cut Studios",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6nsWj-DijOv2qo2VHKfUB2Z5yZJ02iAalhT4kJ0kQmOYlSW0AYkvMu1EU6IRBUWtaVtgKgYnaogT7CSZxVA9XLldFW8wiLm6eBz2sGXERMMN6LMrqbxaJuwLpGF17Aj8ROrtTnNV0fSnRBaXFRv2CQ9jzziVJWfeFlDnF7iUQdSoR2ZfKVA3b-AHHB0ivKjJwzhI6hBlXgW4HaKr_IZxdbwQSWdRQsEiAuycY6JuMVFLFE6KcCG6OPKYJrw3GQ9XFtLR_MQRcW5I",
    website: "https://creativecut.com",
    email: "contact@creativecut.com",
    phone: "+91 98765 43210",
    address: "123 Film Street, Andheri West\nMumbai, MH 400053",
    
    bankName: "HDFC Bank",
    accountName: "Creative Cut Studios",
    accountNumber: "1234 5678 9012",
    ifsc: "HDFC0001234",
    upiId: "",
    
    // Default visibility to true
    showBankName: true,
    showAccountName: true,
    showAccountNumber: true,
    showIfsc: true,
    showUpi: true,
    
    defaultNotes: "Please include the invoice number on your check or bank transfer.",
    showNotes: true,
    
    paymentTerms: "Payment is due within 7 days of invoice date.\nLate payments may be subject to a 2% monthly fee.",
    showTerms: true,
    
    footerMessage: "Thank you for your business!"
};
