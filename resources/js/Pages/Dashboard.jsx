import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Platform Icons helper component (matches both IT and User Dashboards)
const PlatformIcon = ({ name, className }) => {
    switch (name) {
        case 'ERP System':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
        case 'Customer Portal':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            );
        case 'Office WiFi & Network':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.9 9.9 0 0114.14 0M1.414 8.414a15 15 0 0121.172 0" />
                </svg>
            );
        case 'Email & Office Suite':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case 'Hardware & Peripherals':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case 'Other':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            );
        default:
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
    }
};

// Date formatter
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Status badge helper
const getStatusBadge = (status) => {
    switch (status) {
        case 'open':
            return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
        case 'in_progress':
            return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
        case 'resolved':
            return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
        case 'closed':
            return 'bg-slate-100 text-slate-600 border border-slate-200';
        default:
            return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
};

// ==========================================
// 1. IT STAFF VIEW COMPONENT
// ==========================================
function ITDashboardView({ tickets = [], platforms = [], canReply = false, activeTab, setActiveTab, isItHod = false }) {
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [selectedCommonIssue, setSelectedCommonIssue] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [readFilter, setReadFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyMessage, setReplyMessage] = useState('');

    const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

    useEffect(() => {
        setSelectedTicketId(null);
    }, [activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        platform_id: '',
        common_issue_id: '',
        title: '',
        description: '',
    });

    // Handle selecting a platform card
    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setSelectedCommonIssue(null);
        setData(prev => ({
            ...prev,
            platform_id: platform.id,
            common_issue_id: '',
            title: '',
        }));
    };

    // Handle selecting a common issue
    const handleIssueSelect = (issue) => {
        setSelectedCommonIssue(issue);
        setData(prev => ({
            ...prev,
            common_issue_id: issue ? issue.id : '',
            title: issue ? issue.title : '',
            description: issue ? issue.description : '',
        }));
    };

    // Submit a ticket
    const handleSubmitTicket = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            onSuccess: () => {
                reset();
                setSelectedPlatform(null);
                setSelectedCommonIssue(null);
                setActiveTab('queue');
            }
        });
    };

    // Metrics calculations
    const totalTickets = tickets.length;

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesRead = readFilter === 'all' ||
            (readFilter === 'unread' ? !ticket.is_read :
                readFilter === 'read' ? ticket.is_read :
                    (!ticket.replies || ticket.replies.length === 0));
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.description.toLowerCase().includes(searchLower) ||
            ticket.user?.name.toLowerCase().includes(searchLower) ||
            ticket.platform?.name.toLowerCase().includes(searchLower);

        return matchesRead && matchesSearch;
    });

    // Handle selecting ticket (sets ID and marks as read if unread)
    const handleSelectTicket = (ticket) => {
        setSelectedTicketId(ticket.id);
        if (!ticket.is_read) {
            router.patch(route('tickets.read', ticket.id), {}, {
                preserveScroll: true,
            });
        }
    };

    // Handle posting a reply from IT
    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedTicket) return;

        router.post(route('tickets.replies.store', selectedTicket.id), {
            message: replyMessage,
            update_status: null
        }, {
            onSuccess: () => {
                setReplyMessage('');
            }
        });
    };

    const unreadCount = tickets.filter(t => !t.is_read).length;

    return (
        <div className="py-6 text-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                {/* QUEUE TAB */}
                {activeTab === 'queue' && (
                    <>
                        {/* STATS BANNER */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-indigo-500/[0.04] to-transparent border border-indigo-100 p-5 rounded-2xl flex items-center justify-between text-left shadow-sm relative overflow-hidden group">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tickets</span>
                                    <span className="block text-3xl font-black mt-1 text-slate-800">{totalTickets}</span>
                                </div>
                                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-rose-500/[0.04] to-transparent border border-rose-100 p-5 rounded-2xl flex items-center justify-between text-left shadow-sm relative overflow-hidden group">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread Tickets</span>
                                    <span className="block text-3xl font-black mt-1 text-rose-600 flex items-center">
                                        {unreadCount}
                                        {unreadCount > 0 && (
                                            <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                                                New
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500/[0.04] to-transparent border border-emerald-100 p-5 rounded-2xl flex items-center justify-between text-left shadow-sm relative overflow-hidden group">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Read Tickets</span>
                                    <span className="block text-3xl font-black mt-1 text-emerald-600">{totalTickets - unreadCount}</span>
                                </div>
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* MAIN SPLIT-VIEW CONTROLLER */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* LEFT: Ticket Queue List & Filters */}
                            <div className={`${selectedTicket ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'} space-y-4`}>
                                {/* SEARCH AND FILTERS */}
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-5 shadow-sm text-left">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-405 mb-2">
                                            Filter by Read Status
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: 'all', label: 'All', count: tickets.length },
                                                { id: 'unread', label: 'Unread', count: tickets.filter(t => !t.is_read).length, isUnread: true },
                                                { id: 'read', label: 'Read', count: tickets.filter(t => t.is_read).length },
                                                { id: 'no_replies', label: 'No Replies', count: tickets.filter(t => !t.replies || t.replies.length === 0).length }
                                            ].map((filter) => {
                                                const isActive = readFilter === filter.id;
                                                let activeStyle = "";
                                                if (isActive) {
                                                    activeStyle = filter.isUnread && filter.count > 0
                                                        ? 'bg-rose-600 border-rose-700 text-white shadow-sm shadow-rose-600/10'
                                                        : 'bg-indigo-600 border-indigo-700 text-white shadow-sm shadow-indigo-600/10';
                                                } else {
                                                    activeStyle = 'bg-slate-50/60 border-slate-200/60 text-slate-650 hover:bg-slate-100/80';
                                                }
                                                return (
                                                    <button
                                                        key={filter.id}
                                                        onClick={() => setReadFilter(filter.id)}
                                                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center space-x-1.5 transition-all duration-150 ${activeStyle}`}
                                                    >
                                                        <span>{filter.label}</span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold leading-none ${isActive
                                                            ? 'bg-white/20 text-white'
                                                            : filter.isUnread && filter.count > 0
                                                                ? 'bg-rose-500/10 text-rose-600'
                                                                : 'bg-slate-200 text-slate-500'
                                                            }`}>
                                                            {filter.count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* TICKET ITEMS */}
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                                    {filteredTickets.length === 0 ? (
                                        <div className="bg-white border border-slate-100 p-8 text-center rounded-2xl text-slate-405">
                                            No tickets found in queue.
                                        </div>
                                    ) : (
                                        filteredTickets.map((ticket) => {
                                            const isSelected = selectedTicket?.id === ticket.id;
                                            return (
                                                <div
                                                    key={ticket.id}
                                                    onClick={() => handleSelectTicket(ticket)}
                                                    className={`p-5 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden ${isSelected
                                                        ? 'bg-indigo-500/[0.02] border-indigo-500 shadow-sm pl-6'
                                                        : 'bg-white border-slate-150 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {/* Left Accent indicator */}
                                                    {isSelected && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl" />
                                                    )}

                                                    <div className="flex justify-between items-start mb-2.5">
                                                        <div className="flex items-center space-x-2">
                                                            {!ticket.is_read ? (
                                                                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full leading-none uppercase tracking-wider animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                                                                    New
                                                                </span>
                                                            ) : (
                                                                <span className="bg-slate-100 text-slate-500 text-[10px] font-extrabold px-2.5 py-1 rounded-full leading-none uppercase tracking-wider">
                                                                    Read
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-400">
                                                            {formatDate(ticket.created_at)}
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-slate-800 text-base line-clamp-1 mb-1.5">
                                                        {ticket.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                                                        <span className="text-indigo-500">{ticket.platform?.name}</span>
                                                        <span className="text-slate-700 font-bold">By: {ticket.user?.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: Ticket Conversation & Solutions */}
                            {selectedTicket && (
                                <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                    {/* Details Header */}
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl text-left shadow-sm">
                                        <button
                                            onClick={() => setSelectedTicketId(null)}
                                            className="lg:hidden text-xs font-semibold text-indigo-500 flex items-center mb-4 hover:underline"
                                        >
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                                            </svg>
                                            Back to list
                                        </button>

                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                                            <div>
                                                <span className="text-xs text-slate-400 block mb-0.5">
                                                    SUBMITTED BY
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold text-slate-800 text-base">
                                                        {selectedTicket.user?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-slate-400 block mb-0.5">
                                                    CREATED ON
                                                </span>
                                                <span className="font-semibold text-slate-700 text-sm">
                                                    {formatDate(selectedTicket.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-850">
                                            {selectedTicket.title}
                                        </h3>

                                        <div className="flex items-center space-x-2 text-sm text-indigo-500 font-semibold mt-1">
                                            <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                            <span>Platform: {selectedTicket.platform?.name}</span>
                                            {selectedTicket.common_issue && (
                                                <>
                                                    <span className="text-slate-300">•</span>
                                                    <span>Issue Template: {selectedTicket.common_issue?.title}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedTicket.description}
                                        </div>
                                    </div>

                                    {/* Chat logs */}
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col space-y-4 h-[350px] shadow-sm">
                                        <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 text-left">
                                            Conversation Activity
                                        </h4>
                                        <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-left">
                                            {selectedTicket.replies?.length === 0 ? (
                                                <div className="h-full flex flex-col justify-center items-center text-slate-400 space-y-2">
                                                    <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <p className="text-sm">No solutions or messages posted yet.</p>
                                                </div>
                                            ) : (
                                                selectedTicket.replies.map((reply) => {
                                                    const isITReply = reply.user?.role === 'it' || reply.user?.role === 'admin';
                                                    return (
                                                        <div
                                                            key={reply.id}
                                                            className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-left shadow-sm ${isITReply
                                                                ? 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                                                                : 'mr-auto bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'
                                                                }`}
                                                        >
                                                            <div className={`flex justify-between items-center gap-4 mb-1.5 border-b pb-1 text-[10px] ${isITReply ? 'border-white/10 text-indigo-100' : 'border-slate-200/55 text-slate-400'
                                                                }`}>
                                                                <span className="font-extrabold uppercase tracking-wide">
                                                                    {reply.user?.department_name || 'User'} {isITReply && <span className="ml-1 bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold text-[9px]">IT Agent (You)</span>}
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatDate(reply.created_at)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                {reply.message}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply panel */}
                                    {canReply && (
                                        <form onSubmit={handlePostReply} className="bg-white border border-slate-100 p-5 rounded-2xl space-y-4 shadow-sm">
                                            <div className="text-left">
                                                <textarea
                                                    rows={3}
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    placeholder="Write support solution or ask clarifying details..."
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 py-2.5 px-3.5"
                                                />
                                            </div>
                                            <div className="flex justify-end items-center text-left">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                                >
                                                    Publish Reply
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* SUBMIT TICKET TAB */}
                {activeTab === 'new-ticket' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Step 1: Select Platform */}
                        {!selectedPlatform ? (
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2 text-left">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Step 1: Select the platform having the issue
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {platforms.map((platform) => {
                                        let themeClasses = "";
                                        let iconBg = "";
                                        switch (platform.name) {
                                            case 'ERP System':
                                                themeClasses = "hover:shadow-blue-500/5 hover:border-blue-500/30";
                                                iconBg = "bg-blue-500/10 text-blue-600";
                                                break;
                                            case 'Customer Portal':
                                                themeClasses = "hover:shadow-indigo-500/5 hover:border-indigo-500/30";
                                                iconBg = "bg-indigo-500/10 text-indigo-600";
                                                break;
                                            case 'Office WiFi & Network':
                                                themeClasses = "hover:shadow-emerald-500/5 hover:border-emerald-500/30";
                                                iconBg = "bg-emerald-500/10 text-emerald-600";
                                                break;
                                            case 'Email & Office Suite':
                                                themeClasses = "hover:shadow-cyan-500/5 hover:border-cyan-500/30";
                                                iconBg = "bg-cyan-500/10 text-cyan-600";
                                                break;
                                            case 'Hardware & Peripherals':
                                                themeClasses = "hover:shadow-amber-500/5 hover:border-amber-500/30";
                                                iconBg = "bg-amber-500/10 text-amber-600";
                                                break;
                                            default:
                                                themeClasses = "hover:shadow-slate-500/5 hover:border-slate-500/30";
                                                iconBg = "bg-slate-500/10 text-slate-600";
                                        }
                                        return (
                                            <div
                                                key={platform.id}
                                                onClick={() => handlePlatformSelect(platform)}
                                                className={`bg-white border border-slate-150 cursor-pointer p-6 rounded-2xl flex flex-col justify-between h-48 group text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${themeClasses}`}
                                            >
                                                <div>
                                                    <div className={`p-3 rounded-xl w-fit group-hover:scale-110 transition-all duration-300 ${iconBg}`}>
                                                        <PlatformIcon name={platform.name} className="h-6 w-6" />
                                                    </div>
                                                    <h4 className="text-lg font-bold mt-4 text-slate-800">
                                                        {platform.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                        {platform.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm font-semibold text-indigo-500 mt-2">
                                                    Report an issue
                                                    <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Platform selected flow */
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                {/* Left pane: Selected Platform & Common Issues list */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                                        <button
                                            onClick={() => setSelectedPlatform(null)}
                                            className="text-sm font-semibold text-indigo-550 flex items-center hover:underline"
                                        >
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" />
                                            </svg>
                                            Back to platforms
                                        </button>
                                        <div className="flex items-center space-x-3 border-t border-slate-100 pt-4 text-left">
                                            <div className="p-2.5 bg-indigo-500/10 text-indigo-650 rounded-lg">
                                                <PlatformIcon name={selectedPlatform.name} className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{selectedPlatform.name}</h3>
                                                <p className="text-xs text-slate-500 line-clamp-1">{selectedPlatform.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedPlatform.name !== 'Other' && (
                                        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                                            <h4 className="font-bold text-slate-800 text-sm text-left">
                                                Select standard issue type
                                            </h4>
                                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-left">
                                                <div
                                                    onClick={() => handleIssueSelect(null)}
                                                    className={`p-3.5 rounded-xl border text-sm cursor-pointer text-left transition-all duration-200 ${selectedCommonIssue === null
                                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-semibold'
                                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                >
                                                    Write a custom issue...
                                                </div>
                                                {selectedPlatform.common_issues?.map((issue) => (
                                                    <div
                                                        key={issue.id}
                                                        onClick={() => handleIssueSelect(issue)}
                                                        className={`p-3.5 rounded-xl border text-sm cursor-pointer text-left transition-all duration-200 ${selectedCommonIssue?.id === issue.id
                                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-semibold'
                                                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                                            }`}
                                                    >
                                                        <div className="font-bold">{issue.title}</div>
                                                        <div className="text-xs text-slate-400 mt-1 line-clamp-2 font-normal">
                                                            {issue.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right pane: Submission Form */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 text-left">
                                            Submit Issue Details
                                        </h3>

                                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                                            <div className="text-left">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Issue Summary / Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    disabled={selectedCommonIssue !== null}
                                                    placeholder="Provide a clear, brief summary of the problem"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all duration-200"
                                                />
                                                {errors.title && <span className="text-rose-500 text-xs mt-1 block">{errors.title}</span>}
                                            </div>

                                            <div className="text-left">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Detailed Description
                                                </label>
                                                <textarea
                                                    rows={6}
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Describe exactly what happened, step by step. Mention any error messages seen, and what actions you were trying to do."
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                                                />
                                                {errors.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description}</span>}
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
                                                >
                                                    {processing ? 'Submitting...' : 'Submit Support Ticket'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* MANAGE PLATFORMS TAB */}
                {activeTab === 'manage-platforms' && isItHod && (
                    <ManagePlatformsView platforms={platforms} />
                )}
            </div>
        </div>
    );
}

// ==========================================
// 1.5 MANAGE PLATFORMS VIEW COMPONENT
// ==========================================
function ManagePlatformsView({ platforms = [] }) {
    const { errors } = usePage().props;

    const [showAddPlatform, setShowAddPlatform] = useState(false);
    const [newPlatformName, setNewPlatformName] = useState('');
    const [newPlatformDesc, setNewPlatformDesc] = useState('');

    const [editingPlatformId, setEditingPlatformId] = useState(null);
    const [editPlatformName, setEditPlatformName] = useState('');
    const [editPlatformDesc, setEditPlatformDesc] = useState('');

    const [addingIssuePlatformId, setAddingIssuePlatformId] = useState(null);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [newIssueDesc, setNewIssueDesc] = useState('');

    const [editingIssueId, setEditingIssueId] = useState(null);
    const [editIssueTitle, setEditIssueTitle] = useState('');
    const [editIssueDesc, setEditIssueDesc] = useState('');

    const handleCreatePlatform = (e) => {
        e.preventDefault();
        router.post(route('platforms.store'), {
            name: newPlatformName,
            description: newPlatformDesc
        }, {
            onSuccess: () => {
                setShowAddPlatform(false);
                setNewPlatformName('');
                setNewPlatformDesc('');
            }
        });
    };

    const handleUpdatePlatform = (e, platformId) => {
        e.preventDefault();
        router.patch(route('platforms.update', platformId), {
            name: editPlatformName,
            description: editPlatformDesc
        }, {
            onSuccess: () => {
                setEditingPlatformId(null);
            }
        });
    };

    const handleDestroyPlatform = (platform) => {
        if (confirm(`Are you sure you want to delete the platform "${platform.name}"? This will permanently delete all associated issue categories and tickets!`)) {
            router.delete(route('platforms.destroy', platform.id));
        }
    };

    const handleCreateIssue = (e, platformId) => {
        e.preventDefault();
        router.post(route('platforms.issues.store', platformId), {
            title: newIssueTitle,
            description: newIssueDesc
        }, {
            onSuccess: () => {
                setAddingIssuePlatformId(null);
                setNewIssueTitle('');
                setNewIssueDesc('');
            }
        });
    };

    const handleUpdateIssue = (e, issueId) => {
        e.preventDefault();
        router.patch(route('issues.update', issueId), {
            title: editIssueTitle,
            description: editIssueDesc
        }, {
            onSuccess: () => {
                setEditingIssueId(null);
            }
        });
    };

    const handleDestroyIssue = (issue) => {
        if (confirm(`Are you sure you want to delete the issue category "${issue.title}"?`)) {
            router.delete(route('issues.destroy', issue.id));
        }
    };

    return (
        <div className="py-6 text-slate-800 animate-fadeIn text-left">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-slate-800">Manage Platforms & Issue Categories</h3>
                        <p className="text-sm text-slate-500">Configure standard support desk platforms and templates</p>
                    </div>
                    {!showAddPlatform && (
                        <button
                            onClick={() => setShowAddPlatform(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl text-sm shadow-md transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Platform</span>
                        </button>
                    )}
                </div>

                {showAddPlatform && (
                    <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm text-left animate-slideIn">
                        <h4 className="font-bold text-slate-800 text-base mb-4">Create New Platform</h4>
                        <form onSubmit={handleCreatePlatform} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Platform Name</label>
                                    <input
                                        type="text"
                                        value={newPlatformName}
                                        onChange={(e) => setNewPlatformName(e.target.value)}
                                        placeholder="e.g. Finance Hub, Marketing Portal"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5 px-3.5"
                                        required
                                    />
                                    {errors?.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={newPlatformDesc}
                                        onChange={(e) => setNewPlatformDesc(e.target.value)}
                                        placeholder="e.g. ERP tool for company accountants"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5 px-3.5"
                                    />
                                    {errors?.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description}</span>}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddPlatform(false);
                                        setNewPlatformName('');
                                        setNewPlatformDesc('');
                                    }}
                                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
                                >
                                    Save Platform
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {platforms.map((platform) => (
                        <div key={platform.id} className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
                            <div>
                                {editingPlatformId === platform.id ? (
                                    <form onSubmit={(e) => handleUpdatePlatform(e, platform.id)} className="space-y-4 text-left border-b border-slate-100 pb-4 mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Platform Name</label>
                                                <input
                                                    type="text"
                                                    value={editPlatformName}
                                                    onChange={(e) => setEditPlatformName(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2 px-3"
                                                    required
                                                />
                                                {errors?.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    value={editPlatformDesc}
                                                    onChange={(e) => setEditPlatformDesc(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2 px-3"
                                                />
                                                {errors?.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description}</span>}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingPlatformId(null)}
                                                className="px-3 py-1.5 border border-slate-200 text-slate-600 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs hover:bg-indigo-550 transition-all"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div className="flex items-center space-x-3 text-left">
                                            <div className="p-3 bg-indigo-500/10 text-indigo-650 rounded-xl">
                                                <PlatformIcon name={platform.name} className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">{platform.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2">{platform.description || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => {
                                                    setEditingPlatformId(platform.id);
                                                    setEditPlatformName(platform.name);
                                                    setEditPlatformDesc(platform.description || '');
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                                                title="Edit Platform"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDestroyPlatform(platform)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                                                title="Delete Platform"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Categories</h5>
                                        {addingIssuePlatformId !== platform.id && (
                                            <button
                                                onClick={() => {
                                                    setAddingIssuePlatformId(platform.id);
                                                    setNewIssueTitle('');
                                                    setNewIssueDesc('');
                                                }}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center"
                                            >
                                                <svg className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Category
                                            </button>
                                        )}
                                    </div>

                                    {addingIssuePlatformId === platform.id && (
                                        <form onSubmit={(e) => handleCreateIssue(e, platform.id)} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-left animate-slideIn">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Category Title</label>
                                                <input
                                                    type="text"
                                                    value={newIssueTitle}
                                                    onChange={(e) => setNewIssueTitle(e.target.value)}
                                                    placeholder="e.g. Password Reset, System Crash"
                                                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-1.5 px-2.5"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Default Template Text (Optional)</label>
                                                <textarea
                                                    value={newIssueDesc}
                                                    onChange={(e) => setNewIssueDesc(e.target.value)}
                                                    placeholder="This text will pre-fill the issue description for the user"
                                                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-1.5 px-2.5"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAddingIssuePlatformId(null)}
                                                    className="px-2.5 py-1.5 border border-slate-200 text-slate-650 font-semibold rounded-lg text-[11px] hover:bg-slate-100 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-2.5 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-[11px] hover:bg-indigo-500 transition-all"
                                                >
                                                    Save Category
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {platform.common_issues && platform.common_issues.length > 0 ? (
                                            platform.common_issues.map((issue) => (
                                                <div key={issue.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                                                    {editingIssueId === issue.id ? (
                                                        <form onSubmit={(e) => handleUpdateIssue(e, issue.id)} className="space-y-2 text-left">
                                                            <div>
                                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={editIssueTitle}
                                                                    onChange={(e) => setEditIssueTitle(e.target.value)}
                                                                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-1.5 px-2.5"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description Template</label>
                                                                <textarea
                                                                    value={editIssueDesc}
                                                                    onChange={(e) => setEditIssueDesc(e.target.value)}
                                                                    className="w-full rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-1.5 px-2.5"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                            <div className="flex justify-end space-x-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingIssueId(null)}
                                                                    className="px-2 py-1 border border-slate-200 text-slate-500 rounded text-[10px] hover:bg-slate-100 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] hover:bg-indigo-500 transition-all"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div className="flex justify-between items-start text-left">
                                                            <div className="flex-1 min-w-0 pr-2">
                                                                <span className="block font-bold text-slate-800 text-sm truncate">{issue.title}</span>
                                                                {issue.description && (
                                                                    <span className="block text-xs text-slate-450 line-clamp-2 mt-0.5">{issue.description}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex space-x-0.5">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingIssueId(issue.id);
                                                                        setEditIssueTitle(issue.title);
                                                                        setEditIssueDesc(issue.description || '');
                                                                    }}
                                                                    className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-white transition-colors"
                                                                    title="Edit Category"
                                                                >
                                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDestroyIssue(issue)}
                                                                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors"
                                                                    title="Delete Category"
                                                                >
                                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xl">
                                                No issue templates configured.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 2. STANDARD USER VIEW COMPONENT
// ==========================================
function UserDashboardView({ tickets = [], platforms = [], activeTab, setActiveTab }) {
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [selectedCommonIssue, setSelectedCommonIssue] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    const isITUser = (usr) => usr && (usr.role === 'it' || usr.role === 'admin' || usr.department_name === 'IT');
    const markAsRead = (t) => t?.replies?.length && localStorage.setItem(`seen_replies_${t.id}`, t.replies.length.toString());

    useEffect(() => {
        setSelectedTicket(null);
    }, [activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        platform_id: '',
        common_issue_id: '',
        title: '',
        description: '',
    });

    // Handle selecting a platform card
    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setSelectedCommonIssue(null);
        setData(prev => ({
            ...prev,
            platform_id: platform.id,
            common_issue_id: '',
            title: '',
        }));
    };

    // Handle selecting a common issue
    const handleIssueSelect = (issue) => {
        setSelectedCommonIssue(issue);
        setData(prev => ({
            ...prev,
            common_issue_id: issue ? issue.id : '',
            title: issue ? issue.title : '',
            description: issue ? issue.description : '',
        }));
    };

    // Submit a ticket
    const handleSubmitTicket = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            onSuccess: () => {
                reset();
                setSelectedPlatform(null);
                setSelectedCommonIssue(null);
                setActiveTab('my-tickets');
            }
        });
    };

    // Submit a message reply to a ticket conversation
    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        router.post(route('tickets.replies.store', selectedTicket.id), {
            message: replyMessage
        }, {
            onSuccess: () => {
                setReplyMessage('');
                // Refresh the active ticket object from the updated tickets array
                const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
                if (updatedTicket) {
                    setSelectedTicket(updatedTicket);
                }
            }
        });
    };

    // Refresh selectedTicket details when tickets list updates (e.g. dynamic reload)
    useEffect(() => {
        if (selectedTicket) {
            const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
            if (updatedTicket) {
                setSelectedTicket(updatedTicket);
                markAsRead(updatedTicket);
            }
        }
    }, [tickets]);

    // Select a ticket to view conversation details
    const handleViewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        markAsRead(ticket);
    };

    return (
        <div className="py-8 text-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* SUBMIT TICKET TAB */}
                {activeTab === 'new-ticket' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Step 1: Select Platform */}
                        {!selectedPlatform ? (
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2 text-left">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Step 1: Select the platform having the issue
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {platforms.map((platform) => {
                                        let themeClasses = "";
                                        let iconBg = "";
                                        switch (platform.name) {
                                            case 'ERP System':
                                                themeClasses = "hover:shadow-blue-500/5 hover:border-blue-500/30";
                                                iconBg = "bg-blue-500/10 text-blue-600";
                                                break;
                                            case 'Customer Portal':
                                                themeClasses = "hover:shadow-indigo-500/5 hover:border-indigo-500/30";
                                                iconBg = "bg-indigo-500/10 text-indigo-600";
                                                break;
                                            case 'Office WiFi & Network':
                                                themeClasses = "hover:shadow-emerald-500/5 hover:border-emerald-500/30";
                                                iconBg = "bg-emerald-500/10 text-emerald-600";
                                                break;
                                            case 'Email & Office Suite':
                                                themeClasses = "hover:shadow-cyan-500/5 hover:border-cyan-500/30";
                                                iconBg = "bg-cyan-500/10 text-cyan-600";
                                                break;
                                            case 'Hardware & Peripherals':
                                                themeClasses = "hover:shadow-amber-500/5 hover:border-amber-500/30";
                                                iconBg = "bg-amber-500/10 text-amber-600";
                                                break;
                                            default:
                                                themeClasses = "hover:shadow-slate-500/5 hover:border-slate-500/30";
                                                iconBg = "bg-slate-500/10 text-slate-600";
                                        }
                                        return (
                                            <div
                                                key={platform.id}
                                                onClick={() => handlePlatformSelect(platform)}
                                                className={`bg-white border border-slate-150 cursor-pointer p-6 rounded-2xl flex flex-col justify-between h-48 group text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${themeClasses}`}
                                            >
                                                <div>
                                                    <div className={`p-3 rounded-xl w-fit group-hover:scale-110 transition-all duration-300 ${iconBg}`}>
                                                        <PlatformIcon name={platform.name} className="h-6 w-6" />
                                                    </div>
                                                    <h4 className="text-lg font-bold mt-4 text-slate-800">
                                                        {platform.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                        {platform.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm font-semibold text-indigo-500 mt-2">
                                                    Report an issue
                                                    <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Platform selected flow */
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                {/* Left pane: Selected Platform & Common Issues list */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                                        <button
                                            onClick={() => setSelectedPlatform(null)}
                                            className="text-sm font-semibold text-indigo-550 flex items-center hover:underline"
                                        >
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" />
                                            </svg>
                                            Back to platforms
                                        </button>
                                        <div className="flex items-center space-x-3 border-t border-slate-100 pt-4 text-left">
                                            <div className="p-2.5 bg-indigo-500/10 text-indigo-650 rounded-lg">
                                                <PlatformIcon name={selectedPlatform.name} className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{selectedPlatform.name}</h3>
                                                <p className="text-xs text-slate-500 line-clamp-1">{selectedPlatform.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedPlatform.name !== 'Other' && (
                                        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                                            <h4 className="font-bold text-slate-850 text-sm text-left">
                                                Select standard issue type
                                            </h4>
                                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-left">
                                                <div
                                                    onClick={() => handleIssueSelect(null)}
                                                    className={`p-3.5 rounded-xl border text-sm cursor-pointer text-left transition-all duration-200 ${selectedCommonIssue === null
                                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-605 font-semibold'
                                                        : 'border-slate-200 hover:bg-slate-50 text-slate-705'
                                                        }`}
                                                >
                                                    Write a custom issue...
                                                </div>
                                                {selectedPlatform.common_issues?.map((issue) => (
                                                    <div
                                                        key={issue.id}
                                                        onClick={() => handleIssueSelect(issue)}
                                                        className={`p-3.5 rounded-xl border text-sm cursor-pointer text-left transition-all duration-200 ${selectedCommonIssue?.id === issue.id
                                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-605 font-semibold'
                                                            : 'border-slate-200 hover:bg-slate-50 text-slate-705'
                                                            }`}
                                                    >
                                                        <div className="font-bold">{issue.title}</div>
                                                        <div className="text-xs text-slate-400 mt-1 line-clamp-2 font-normal">
                                                            {issue.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right pane: Submission Form */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-850 mb-6 text-left">
                                            Submit Issue Details
                                        </h3>

                                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                                            <div className="text-left">
                                                <label className="block text-sm font-semibold text-slate-705 mb-2">
                                                    Issue Summary / Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    disabled={selectedCommonIssue !== null}
                                                    placeholder="Provide a clear, brief summary of the problem"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all duration-200"
                                                />
                                                {errors.title && <span className="text-rose-500 text-xs mt-1 block">{errors.title}</span>}
                                            </div>

                                            <div className="text-left">
                                                <label className="block text-sm font-semibold text-slate-705 mb-2">
                                                    Detailed Description
                                                </label>
                                                <textarea
                                                    rows={6}
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Describe exactly what happened, step by step. Mention any error messages seen, and what actions you were trying to do."
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200"
                                                />
                                                {errors.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description}</span>}
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
                                                >
                                                    {processing ? 'Submitting...' : 'Submit Support Ticket'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* MY TICKETS TAB */}
                {activeTab === 'my-tickets' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
                        {/* Left Panel: Ticket Queue List */}
                        <div className={`${selectedTicket ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'} space-y-4`}>
                            <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-left">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Your Open & Historical Tickets
                                </h3>
                                <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">
                                    Total: {tickets.length}
                                </span>
                            </div>

                            {tickets.length === 0 ? (
                                <div className="bg-white border border-slate-100 p-8 text-center rounded-2xl text-slate-400 space-y-3 shadow-sm">
                                    <svg className="h-12 w-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="font-medium">You haven't submitted any tickets yet.</p>
                                    <button
                                        onClick={() => setActiveTab('new-ticket')}
                                        className="text-sm font-semibold text-indigo-500 hover:underline"
                                    >
                                        Submit your first ticket now
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                                    {tickets.map((ticket) => {
                                        const isSelected = selectedTicket?.id === ticket.id;
                                        const lastReply = ticket.replies && ticket.replies.length > 0 ? ticket.replies[ticket.replies.length - 1] : null;
                                        const isLastReplyFromIT = lastReply && isITUser(lastReply.user);
                                        const seenCount = parseInt(localStorage.getItem(`seen_replies_${ticket.id}`) || '0', 10);
                                        const hasNewITReply = isLastReplyFromIT && ticket.replies.length > seenCount;
                                        return (
                                            <div
                                                key={ticket.id}
                                                onClick={() => handleViewTicketDetails(ticket)}
                                                className={`p-5 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden ${isSelected
                                                    ? 'bg-indigo-500/[0.02] border-indigo-500 shadow-sm pl-6'
                                                    : 'bg-white border-slate-150 hover:border-slate-350'
                                                    }`}
                                            >
                                                {/* Left border indicator */}
                                                {isSelected && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl" />
                                                )}

                                                <div className="flex justify-between items-start mb-2.5">
                                                    {hasNewITReply && (
                                                        <span className="bg-indigo-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full leading-none uppercase tracking-wider animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                                                            New Reply
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(ticket.created_at)}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-805 text-base line-clamp-1 mb-1.5">
                                                    {ticket.title}
                                                </h4>
                                                <div className="flex items-center space-x-2 text-xs text-indigo-550 font-semibold mb-2">
                                                    <PlatformIcon name={ticket.platform?.name} className="h-3.5 w-3.5" />
                                                    <span>{ticket.platform?.name}</span>
                                                </div>
                                                {ticket.replies?.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-150 flex items-center space-x-2 text-xs text-slate-400">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        <span>{ticket.replies.length} replies • Last: {formatDate(ticket.replies[ticket.replies.length - 1].created_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Panel: Conversation details */}
                        {selectedTicket && (
                            <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                {/* Ticket Detail Header Card */}
                                <div className="bg-white border border-slate-100 p-6 rounded-2xl relative text-left shadow-sm">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden text-xs font-semibold text-indigo-500 flex items-center mb-4 hover:underline"
                                    >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                                        </svg>
                                        Back to queue
                                    </button>
                                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                                        <span className="text-xs text-slate-400">
                                            Created: {formatDate(selectedTicket.created_at)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {selectedTicket.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm text-indigo-550 font-semibold mt-1">
                                        <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                        <span>Platform: {selectedTicket.platform?.name}</span>
                                        {selectedTicket.common_issue && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span>Category: {selectedTicket.common_issue?.title}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-4 p-4.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {/* Chat Log / Ticket Replies */}
                                <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col space-y-4 h-[400px] shadow-sm">
                                    <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 text-left">
                                        Conversation Activity
                                    </h4>
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-left">
                                        {selectedTicket.replies?.length === 0 ? (
                                            <div className="h-full flex flex-col justify-center items-center text-slate-400 space-y-2">
                                                <p className="text-sm">No replies yet. The IT department will view your issue soon.</p>
                                            </div>
                                        ) : (
                                            selectedTicket.replies.map((reply) => {
                                                const isITReply = isITUser(reply.user);
                                                return (
                                                    <div
                                                        key={reply.id}
                                                        className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-left shadow-sm ${isITReply
                                                            ? 'mr-auto bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'
                                                            : 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                                                            }`}
                                                    >
                                                        <div className={`flex justify-between items-center gap-4 mb-1.5 border-b pb-1 text-[10px] ${isITReply ? 'border-slate-200/55 text-slate-450' : 'border-white/10 text-indigo-100'
                                                            }`}>
                                                            <span className="font-extrabold uppercase tracking-wide">
                                                                {reply.user?.department_name || 'User'} {isITReply && <span className="ml-1 bg-slate-200/20 text-slate-700 px-1.5 py-0.2 rounded font-semibold text-[9px]">IT Department</span>}
                                                            </span>
                                                            <span className="font-medium">
                                                                {formatDate(reply.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                            {reply.message}
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Reply panel for User */}
                                <form onSubmit={handlePostReply} className="bg-white border border-slate-100 p-5 rounded-2xl space-y-4 shadow-sm">
                                    <div className="text-left">
                                        <textarea
                                            rows={3}
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            placeholder="Write message back to IT..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-850 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 py-2.5 px-3.5"
                                        />
                                    </div>
                                    <div className="flex justify-end items-center text-left">
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 3. MAIN WRAPPER/ROUTER COMPONENT
// ==========================================
export default function Dashboard({ tickets = [], platforms = [], canReply = false, isItHod = false }) {
    const user = usePage().props.auth.user;
    // Fallback detection in case isItHod prop is not passed correctly or role is explicitly it/admin
    const resolvedIsItHod = isItHod || user.role === 'admin' || user.role === 'it' || (
        // Check if user is IT HOD based on department / role check matching model
        user.role?.toLowerCase() === 'hod' && user.department_id === 24
    );

    const [activeTab, setActiveTab] = useState(resolvedIsItHod ? 'queue' : 'new-ticket');

    const unreadCount = tickets.filter(t => !t.is_read).length;
    const pageTitle = resolvedIsItHod
        ? (unreadCount > 0 ? `(${unreadCount}) IT Service Desk` : "IT Service Desk")
        : "User Dashboard";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold leading-tight text-slate-800 text-left">
                        {resolvedIsItHod ? "IT Service Desk Dashboard" : "Ticketing System"}
                    </h2>
                    <div className="flex space-x-1 p-0.5 rounded-lg bg-slate-100/80 border border-slate-200/60">
                        {resolvedIsItHod ? (
                            <>
                                <button
                                    onClick={() => setActiveTab('queue')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${activeTab === 'queue'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    <span>Tickets Queue ({tickets.length})</span>
                                    {unreadCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                                            {unreadCount} New
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('new-ticket')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'new-ticket'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    Submit Ticket
                                </button>
                                {isItHod && (
                                    <button
                                        onClick={() => setActiveTab('manage-platforms')}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'manage-platforms'
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        Manage Platforms
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setActiveTab('new-ticket')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'new-ticket'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    Submit Ticket
                                </button>
                                <button
                                    onClick={() => setActiveTab('my-tickets')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'my-tickets'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    My Tickets ({tickets.length})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={pageTitle} />

            {resolvedIsItHod ? (
                <ITDashboardView
                    tickets={tickets}
                    platforms={platforms}
                    canReply={canReply}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isItHod={isItHod}
                />
            ) : (
                <UserDashboardView
                    tickets={tickets}
                    platforms={platforms}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
        </AuthenticatedLayout>
    );
}
