import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// Platform Icons helper component (matches UserDashboard)
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
        default:
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
    }
};

export default function ITDashboard({ tickets = [] }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [updateStatusVal, setUpdateStatusVal] = useState('');

    // Metrics calculations
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const progressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchLower) ||
            ticket.description.toLowerCase().includes(searchLower) ||
            ticket.user?.name.toLowerCase().includes(searchLower) ||
            ticket.platform?.name.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    // Handle posting a reply from IT
    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        router.post(route('tickets.replies.store', selectedTicket.id), {
            message: replyMessage,
            update_status: updateStatusVal || null
        }, {
            onSuccess: () => {
                setReplyMessage('');
                setUpdateStatusVal('');
                // Sync the local selection with the newly fetched tickets
                const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
                if (updatedTicket) {
                    setSelectedTicket(updatedTicket);
                }
            }
        });
    };

    // Update status directly from header controls
    const handleUpdateStatusDirectly = (status) => {
        router.patch(route('tickets.status.update', selectedTicket.id), {
            status: status
        }, {
            onSuccess: () => {
                const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
                if (updatedTicket) {
                    setSelectedTicket(updatedTicket);
                }
            }
        });
    };

    // Date formatter
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get Status Badge classes
    const getStatusBadge = (status) => {
        switch (status) {
            case 'open':
                return 'bg-amber-500/10 text-amber-500 border border-amber-500/30 glow-open';
            case 'in_progress':
                return 'bg-blue-500/10 text-blue-400 border border-blue-500/30 glow-progress';
            case 'resolved':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-resolved';
            case 'closed':
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                    IT Service Desk Dashboard
                </h2>
            }
        >
            <Head title="IT Service Desk" />

            <div className="py-6 text-slate-900 dark:text-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* STATS BANNER */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Queue</span>
                            <span className="text-3xl font-extrabold mt-2 text-slate-800 dark:text-slate-100">{totalTickets}</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-l-4 border-l-amber-500/50">
                            <span className="text-sm font-semibold text-amber-500">Unassigned / Open</span>
                            <span className="text-3xl font-extrabold mt-2 text-amber-600 dark:text-amber-550">{openTickets}</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-l-4 border-l-blue-500/50">
                            <span className="text-sm font-semibold text-blue-450 dark:text-blue-400">In Progress</span>
                            <span className="text-3xl font-extrabold mt-2 text-blue-500">{progressTickets}</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-l-4 border-l-emerald-500/50">
                            <span className="text-sm font-semibold text-emerald-500">Resolved</span>
                            <span className="text-3xl font-extrabold mt-2 text-emerald-600 dark:text-emerald-500">{resolvedTickets}</span>
                        </div>
                    </div>

                    {/* MAIN SPLIT-VIEW CONTROLLER */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* LEFT: Ticket Queue List & Filters */}
                        <div className={`${selectedTicket ? 'hidden lg:block lg:col-span-1' : 'lg:col-span-3'} space-y-4`}>
                            {/* SEARCH AND FILTERS */}
                            <div className="glass-panel p-5 rounded-2xl space-y-4">
                                <div className="text-left">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                        Search tickets
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search title, desc, user, platform..."
                                        className="w-full text-sm rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                        Filter by Status
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                                                    statusFilter === status
                                                        ? 'bg-indigo-600 border-indigo-750 text-white shadow-sm'
                                                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                                }`}
                                            >
                                                {status === 'all' ? 'All' : status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* TICKET ITEMS */}
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                                {filteredTickets.length === 0 ? (
                                    <div className="glass-panel p-8 text-center rounded-2xl text-slate-500">
                                        No tickets found in queue.
                                    </div>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => setSelectedTicket(ticket)}
                                            className={`p-5 rounded-2xl text-left border cursor-pointer transition-all duration-300 relative ${
                                                selectedTicket?.id === ticket.id
                                                    ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/40'
                                                    : 'glass-card border-slate-200 dark:border-slate-700/40'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2.5">
                                                <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full leading-none tracking-wider ${getStatusBadge(ticket.status)}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {formatDate(ticket.created_at)}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-1 mb-1.5">
                                                {ticket.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                                                <span className="text-indigo-500 dark:text-indigo-400">{ticket.platform?.name}</span>
                                                <span className="text-slate-750 dark:text-slate-355 font-bold">By: {ticket.user?.name}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {ticket.description}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Ticket Conversation & Solutions */}
                        {selectedTicket && (
                            <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                {/* Details Header */}
                                <div className="glass-panel p-6 rounded-2xl text-left">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden text-xs font-semibold text-indigo-500 dark:text-indigo-400 flex items-center mb-4 hover:underline"
                                    >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                                        </svg>
                                        Back to list
                                    </button>

                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
                                        <div>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
                                                SUBMITTED BY
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                                                    {selectedTicket.user?.name}
                                                </span>
                                                {selectedTicket.user?.employee?.employee_code && (
                                                    <span className="text-xs bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60 font-mono font-bold">
                                                        {selectedTicket.user.employee.employee_code}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-405 dark:text-slate-450 mt-1 space-y-0.5">
                                                <div>Email: {selectedTicket.user?.email}</div>
                                                {selectedTicket.user?.department?.name && (
                                                    <div>Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTicket.user.department.name}</span></div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
                                                CREATED ON
                                            </span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-350 text-sm">
                                                {formatDate(selectedTicket.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Bar for status changes */}
                                    <div className="mb-6 flex flex-wrap items-center gap-3">
                                        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-550 mr-2">
                                            Quick Actions:
                                        </span>
                                        <button
                                            onClick={() => handleUpdateStatusDirectly('in_progress')}
                                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            In Progress
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatusDirectly('resolved')}
                                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Mark Resolved
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatusDirectly('closed')}
                                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 border border-slate-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Close Ticket
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                        {selectedTicket.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm text-indigo-500 dark:text-indigo-400 font-semibold mt-1">
                                        <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                        <span>Platform: {selectedTicket.platform?.name}</span>
                                        {selectedTicket.common_issue && (
                                            <>
                                                <span className="text-slate-350 dark:text-slate-750">•</span>
                                                <span>Issue Template: {selectedTicket.common_issue?.title}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {/* Chat logs */}
                                <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4 h-[350px] overflow-y-auto">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-200 dark:border-slate-850 pb-2 text-left">
                                        Conversation Activity Thread
                                    </h4>
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                        {selectedTicket.replies?.length === 0 ? (
                                            <div className="h-full flex flex-col justify-center items-center text-slate-500 space-y-2">
                                                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                        className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-left border ${
                                                            isITReply
                                                                ? 'ml-auto bg-indigo-650 text-white border-indigo-750 rounded-tr-none'
                                                                : 'mr-auto bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-center gap-4 mb-1 border-b border-white/10 pb-0.5">
                                                            <span className="text-xs font-extrabold uppercase tracking-wide">
                                                                {reply.user?.name} {isITReply && <span className="ml-1 bg-indigo-550 text-[10px] text-white px-1.5 py-0.5 rounded">IT Agent (You)</span>}
                                                            </span>
                                                            <span className={`text-[10px] ${isITReply ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-400'}`}>
                                                                {formatDate(reply.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap mt-1">
                                                            {reply.message}
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Reply panel with optional status transition */}
                                {selectedTicket.status !== 'closed' && (
                                    <form onSubmit={handlePostReply} className="glass-panel p-5 rounded-2xl space-y-4">
                                        <div className="text-left">
                                            <textarea
                                                rows={3}
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                placeholder="Write support solution or ask clarifying details..."
                                                className="w-full rounded-xl border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 py-2.5 px-3.5"
                                            />
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center gap-4 text-left">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    Update Status:
                                                </span>
                                                <select
                                                    value={updateStatusVal}
                                                    onChange={(e) => setUpdateStatusVal(e.target.value)}
                                                    className="text-xs rounded-lg border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">Keep current state</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </div>
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                            >
                                                Publish Reply
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
