import React from 'react';
import { Icon } from './Icon';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden relative animate-in fade-in duration-300">
        <header className="bg-surface-light dark:bg-surface-dark px-8 py-6 flex flex-col md:flex-row md:items-center justify-between border-b border-border-light dark:border-border-dark flex-shrink-0 transition-colors duration-200 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight">Analytics Overview</h1>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Last updated: Just now
                </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-border-light dark:border-border-dark">
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded bg-transparent text-text-light dark:text-text-dark focus:ring-0 border-none outline-none cursor-pointer font-medium hover:text-primary transition-colors">
                            <option>Last 30 Days</option>
                            <option>This Quarter</option>
                            <option>This Year</option>
                            <option>Custom Range</option>
                        </select>
                        <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Icon name="expand_more" className="text-lg" />
                        </span>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1 self-stretch"></div>
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded bg-transparent text-text-light dark:text-text-dark focus:ring-0 border-none outline-none cursor-pointer font-medium hover:text-primary transition-colors">
                            <option>All Clients</option>
                            <option>GreenFields</option>
                            <option>SkyNet</option>
                            <option>Wanderlust</option>
                        </select>
                        <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Icon name="filter_list" className="text-lg" />
                        </span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-lg shadow-md transition-all active:scale-95">
                    <Icon name="download" className="text-lg" />
                    Export Report
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Projects Completed</p>
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-primary dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <Icon name="check_circle" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">25</h3>
                            <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
                                <Icon name="trending_up" className="text-sm mr-0.5" /> 12%
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">22 last period</p>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark hover:border-blue-100 dark:hover:border-blue-900 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Avg. Completion Time</p>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Icon name="timer" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">7<span className="text-base font-normal text-text-secondary-light ml-1">days</span></h3>
                            <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
                                <Icon name="arrow_downward" className="text-sm mr-0.5" /> 1.5d
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Faster than average</p>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark hover:border-green-100 dark:hover:border-green-900 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Revenue Generated</p>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Icon name="currency_rupee" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">₹1.5L</h3>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                                <Icon name="trending_up" className="text-sm mr-0.5" /> 8%
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Goal: ₹1.2L</p>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark hover:border-amber-100 dark:hover:border-amber-900 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Client Retention</p>
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <Icon name="group_add" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                            <h3 className="text-3xl font-bold text-text-light dark:text-text-dark">85%</h3>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center">
                                Stable
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">2 new clients</p>
                    </div>
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue by Client (Bar Chart simulation) */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col col-span-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Revenue by Client</h3>
                            <button className="text-text-secondary-light hover:text-primary transition-colors">
                                <Icon name="more_vert" />
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-6">
                            <div className="space-y-4">
                                <div className="group">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-text-light dark:text-text-dark">GreenFields</span>
                                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">₹45k (37%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-purple-500 h-2.5 rounded-full group-hover:bg-purple-600 transition-colors" style={{ width: '37%' }}></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-text-light dark:text-text-dark">SkyNet</span>
                                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">₹32.5k (27%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-blue-500 h-2.5 rounded-full group-hover:bg-blue-600 transition-colors" style={{ width: '27%' }}></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-text-light dark:text-text-dark">Wanderlust</span>
                                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">₹28k (23%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-amber-500 h-2.5 rounded-full group-hover:bg-amber-600 transition-colors" style={{ width: '23%' }}></div>
                                    </div>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-text-light dark:text-text-dark">BrandX</span>
                                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">₹15k (13%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-emerald-500 h-2.5 rounded-full group-hover:bg-emerald-600 transition-colors" style={{ width: '13%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t border-border-light dark:border-border-dark flex justify-between items-center text-sm">
                                <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Revenue</span>
                                <span className="font-bold text-lg text-text-light dark:text-text-dark">₹120,500</span>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart (SVG) */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Monthly Revenue Trend</h3>
                                <p className="text-xs text-text-secondary-light mt-1">Comparison with previous period</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
                                    <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">This Year</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 shadow-sm"></span>
                                    <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Last Year</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative min-h-[250px] flex items-end px-4 pb-6 group">
                            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium opacity-60">
                                <span>₹2.5L</span>
                                <span>₹2.0L</span>
                                <span>₹1.5L</span>
                                <span>₹1.0L</span>
                                <span>₹0.5L</span>
                                <span>0</span>
                            </div>
                            <div className="absolute left-10 right-0 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-100 dark:border-gray-700 w-full h-0"></div>
                                <div className="border-t border-gray-200 dark:border-gray-700 w-full h-0"></div>
                            </div>
                            <svg className="absolute left-10 right-0 top-2 bottom-6 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,75 C10,70 20,80 30,65 C40,60 50,70 60,65 C70,60 80,68 90,62 L100,58" fill="none" stroke="#CBD5E1" strokeDasharray="4,4" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                <path d="M0,65 C15,60 25,45 35,50 C50,55 60,35 70,30 C80,25 90,40 100,20 L100,100 L0,100 Z" fill="url(#gradient)" style={{ mixBlendMode: 'multiply' }}></path>
                                <path d="M0,65 C15,60 25,45 35,50 C50,55 60,35 70,30 C80,25 90,40 100,20" fill="none" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                                <circle className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" cx="35" cy="50" r="3" fill="white" stroke="#10b981" strokeWidth="2"></circle>
                                <circle className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" cx="70" cy="30" r="3" fill="white" stroke="#10b981" strokeWidth="2"></circle>
                            </svg>
                            <div className="absolute left-[35%] top-[40%] bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                ₹1.35L Revenue
                            </div>
                            <div className="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark pt-2 font-medium">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row of Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Completion Trends</h3>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex">
                                <button className="px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-gray-700 shadow-sm text-text-light dark:text-text-dark">Weekly</button>
                                <button className="px-3 py-1 text-xs font-medium rounded-md text-text-secondary-light hover:text-text-light dark:hover:text-text-dark transition-colors">Monthly</button>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[220px] pb-2">
                            {[60, 85, 45, 75, 90].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group w-full relative">
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded pointer-events-none">{h}%</div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg h-40 flex items-end justify-center overflow-hidden">
                                        <div className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300 rounded-t-lg" style={{ height: `${h}%` }}></div>
                                    </div>
                                    <span className="text-xs font-medium text-text-secondary-light">W{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Avg. Time Per Phase</h3>
                            <div className="flex gap-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> Ingest
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-400"></span> Edit
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Review
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Commercials', total: '8h', ingest: 20, edit: 50, review: 30 },
                                { label: 'Social Reels', total: '3h', ingest: 15, edit: 65, review: 20 },
                                { label: 'Documentaries', total: '24h', ingest: 30, edit: 50, review: 20 },
                                { label: 'Interviews', total: '6h', ingest: 10, edit: 70, review: 20 },
                                { label: 'Music Videos', total: '12h', ingest: 25, edit: 55, review: 20 }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-light dark:text-text-dark font-medium">{item.label}</span>
                                        <span className="text-text-secondary-light text-xs">{item.total} total</span>
                                    </div>
                                    <div className="flex w-full h-3 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{ width: `${item.ingest}%` }}></div>
                                        <div className="bg-blue-400 h-full" style={{ width: `${item.edit}%` }}></div>
                                        <div className="bg-amber-400 h-full" style={{ width: `${item.review}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Tables/Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Top Clients by Revenue</h3>
                            <a className="text-xs text-primary hover:text-primary-light font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded transition-colors" href="#">View Details</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="pb-3 text-xs font-semibold text-text-secondary-light uppercase tracking-wider pl-2">Client</th>
                                        <th className="pb-3 text-xs font-semibold text-text-secondary-light uppercase tracking-wider text-right w-24">Projects</th>
                                        <th className="pb-3 text-xs font-semibold text-text-secondary-light uppercase tracking-wider text-right pr-2">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
                                    {[
                                        { code: 'GF', color: 'purple', name: 'GreenFields', sub: 'Corp. video', count: 12, rev: '₹45,000', width: 80 },
                                        { code: 'SN', color: 'blue', name: 'SkyNet', sub: 'Tech demo', count: 8, rev: '₹32,500', width: 60 },
                                        { code: 'WL', color: 'amber', name: 'Wanderlust', sub: 'Travel vlog', count: 5, rev: '₹28,000', width: 40 },
                                        { code: 'BX', color: 'red', name: 'BrandX', sub: 'Promo', count: 3, rev: '₹15,000', width: 25 },
                                    ].map((row, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg bg-${row.color}-100 dark:bg-${row.color}-900/30 flex items-center justify-center text-${row.color}-600 font-bold text-xs shadow-sm group-hover:scale-105 transition-transform`}>{row.code}</div>
                                                    <div>
                                                        <div className="font-medium text-text-light dark:text-text-dark">{row.name}</div>
                                                        <div className="text-xs text-text-secondary-light">{row.sub}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className={`bg-${row.color}-500 h-full`} style={{ width: `${row.width}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-medium">{row.count}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right pr-2">
                                                <span className="font-bold text-text-light dark:text-text-dark">{row.rev}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">Profitability Estimates</h3>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Gross Revenue
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Est. Costs
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-5">
                            {[
                                { name: 'GreenFields', rev: '₹45k', cost: '-₹15k', net: '+₹30k', wRev: 75, wCost: 25 },
                                { name: 'SkyNet', rev: '₹32k', cost: '-₹10k', net: '+₹22k', wRev: 60, wCost: 20 },
                                { name: 'Wanderlust', rev: '₹28k', cost: '-₹18k', net: '+₹10k', wRev: 55, wCost: 35 },
                                { name: 'BrandX', rev: '₹15k', cost: '-₹5k', net: '+₹10k', wRev: 30, wCost: 10 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-xs font-medium w-24 truncate text-text-secondary-light">{item.name}</span>
                                    <div className="flex-1 relative h-6 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
                                        <div className="h-full bg-emerald-500 relative group flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${item.wRev}%` }}>
                                            {item.rev}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="h-full bg-red-400 relative group flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${item.wCost}%` }}>
                                            {item.cost}
                                        </div>
                                        <div className="flex-1 bg-transparent"></div>
                                    </div>
                                    <span className="text-xs font-bold w-12 text-right text-emerald-600">{item.net}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};