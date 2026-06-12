import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// ============================================================
// HELPERS
// ============================================================

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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
            );
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getPlatformColor = (name) => {
    const map = {
        'ERP System': { icon: 'bg-blue-100 text-blue-600', border: 'hover:border-blue-400/40', ring: 'rgba(59,130,246,' },
        'Customer Portal': { icon: 'bg-violet-100 text-violet-600', border: 'hover:border-violet-400/40', ring: 'rgba(139,92,246,' },
        'Office WiFi & Network': { icon: 'bg-emerald-100 text-emerald-600', border: 'hover:border-emerald-400/40', ring: 'rgba(16,185,129,' },
        'Email & Office Suite': { icon: 'bg-cyan-100 text-cyan-600', border: 'hover:border-cyan-400/40', ring: 'rgba(6,182,212,' },
        'Hardware & Peripherals': { icon: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-400/40', ring: 'rgba(245,158,11,' },
    };
    return map[name] || { icon: 'bg-slate-100 text-slate-600', border: 'hover:border-slate-400/40', ring: 'rgba(100,116,139,' };
};

// ============================================================
// IT STAT CARD
// ============================================================
const StatCard = ({ label, value, icon, styleClass, pulse }) => (
    <div className={`rounded-2xl p-6 flex items-center justify-between group cursor-default transition-all duration-300 card-shine ${styleClass}`}>
        <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-55">{label}</span>
            <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-4xl font-black leading-none tracking-tight" style={{ letterSpacing: '-0.03em' }}>{value}</span>
                {pulse && value > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-current notification-dot opacity-80" />
                )}
            </div>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.5)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {icon}
        </div>
    </div>
);

// ============================================================
// 1. IT DASHBOARD VIEW
// ============================================================
function ITDashboardView({ tickets = [], platforms = [], canReply = false, activeTab, setActiveTab, isItHod = false }) {
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [selectedCommonIssue, setSelectedCommonIssue] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [readFilter, setReadFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyMessage, setReplyMessage] = useState('');

    const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

    useEffect(() => { setSelectedTicketId(null); }, [activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        platform_id: '',
        common_issue_id: '',
        title: '',
        description: '',
    });

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setSelectedCommonIssue(null);
        setData(prev => ({ ...prev, platform_id: platform.id, common_issue_id: '', title: '' }));
    };

    const handleIssueSelect = (issue) => {
        setSelectedCommonIssue(issue);
        setData(prev => ({
            ...prev,
            common_issue_id: issue ? issue.id : '',
            title: issue ? issue.title : '',
            description: issue ? issue.description : '',
        }));
    };

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            onSuccess: () => { reset(); setSelectedPlatform(null); setSelectedCommonIssue(null); setActiveTab('queue'); }
        });
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesRead = readFilter === 'all'
            || (readFilter === 'unread' ? !ticket.is_read : readFilter === 'read' ? ticket.is_read : (!ticket.replies || ticket.replies.length === 0));
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = ticket.title.toLowerCase().includes(searchLower)
            || ticket.description.toLowerCase().includes(searchLower)
            || ticket.user?.name.toLowerCase().includes(searchLower)
            || ticket.platform?.name.toLowerCase().includes(searchLower);
        return matchesRead && matchesSearch;
    });

    const handleSelectTicket = (ticket) => {
        setSelectedTicketId(ticket.id);
        if (!ticket.is_read) {
            router.patch(route('tickets.read', ticket.id), {}, { preserveScroll: true });
        }
    };

    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedTicket) return;
        router.post(route('tickets.replies.store', selectedTicket.id), {
            message: replyMessage,
            update_status: null
        }, { onSuccess: () => setReplyMessage('') });
    };

    const unreadCount = tickets.filter(t => !t.is_read).length;
    const openCount = tickets.filter(t => t.status === 'open').length;
    const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

    return (
        <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                {/* ─── QUEUE TAB ─── */}
                {activeTab === 'queue' && (
                    <>
                        {/* STAT CARDS */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="animate-slideUp stagger-1">
                                <StatCard
                                    label="Total Tickets"
                                    value={tickets.length}
                                    styleClass="stat-card-indigo text-indigo-700"
                                    icon={
                                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    }
                                />
                            </div>
                            <div className="animate-slideUp stagger-2">
                                <StatCard
                                    label="Unread / New"
                                    value={unreadCount}
                                    pulse={true}
                                    styleClass="stat-card-rose text-rose-700"
                                    icon={
                                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    }
                                />
                            </div>
                            <div className="animate-slideUp stagger-3">
                                <StatCard
                                    label="Open"
                                    value={openCount}
                                    styleClass="stat-card-amber text-amber-700"
                                    icon={
                                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                            </div>
                            <div className="animate-slideUp stagger-4">
                                <StatCard
                                    label="Resolved"
                                    value={resolvedCount}
                                    styleClass="stat-card-emerald text-emerald-700"
                                    icon={
                                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>

                        {/* MAIN PANEL */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* LEFT: List */}
                            <div className={`${selectedTicket ? 'hidden lg:flex lg:col-span-1 flex-col' : 'lg:col-span-3'} space-y-4`}>
                                {/* Search & Filter */}
                                <div className="glass-panel rounded-2xl p-5 space-y-4 animate-slideUp">
                                    {/* Search input */}
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search tickets..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200/80 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    {/* Filter pills */}
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'all', label: 'All', count: tickets.length },
                                            { id: 'unread', label: 'Unread', count: unreadCount, accent: true },
                                            { id: 'read', label: 'Read', count: tickets.filter(t => t.is_read).length },
                                            { id: 'no_replies', label: 'No Replies', count: tickets.filter(t => !t.replies || t.replies.length === 0).length },
                                        ].map((f) => {
                                            const isActive = readFilter === f.id;
                                            return (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setReadFilter(f.id)}
                                                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200"
                                                    style={isActive ? {
                                                        background: f.accent && f.count > 0
                                                            ? 'linear-gradient(135deg, #e11d48, #f43f5e)'
                                                            : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                                        border: '1px solid transparent',
                                                        color: 'white',
                                                        boxShadow: `0 2px 12px rgba(${f.accent && f.count > 0 ? '244,63,94' : '79,70,229'},0.3)`,
                                                    } : {
                                                        background: 'rgba(248,250,252,0.8)',
                                                        border: '1px solid rgba(226,232,240,0.9)',
                                                        color: '#64748b',
                                                    }}
                                                >
                                                    <span>{f.label}</span>
                                                    <span
                                                        className="rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold leading-none"
                                                        style={isActive
                                                            ? { background: 'rgba(255,255,255,0.2)', color: 'white' }
                                                            : { background: 'rgba(226,232,240,0.8)', color: '#64748b' }
                                                        }
                                                    >
                                                        {f.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Ticket list */}
                                <div className="space-y-2.5 max-h-[62vh] overflow-y-auto pr-1">
                                    {filteredTickets.length === 0 ? (
                                        <div className="glass-panel rounded-2xl p-10 text-center">
                                            <svg className="h-12 w-12 mx-auto text-slate-300 animate-float mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-slate-400 font-semibold text-sm">No tickets found.</p>
                                        </div>
                                    ) : filteredTickets.map((ticket) => {
                                        const isSelected = selectedTicket?.id === ticket.id;
                                        return (
                                            <div
                                                key={ticket.id}
                                                onClick={() => handleSelectTicket(ticket)}
                                                className={`ticket-card p-4 text-left ${isSelected ? 'selected' : ''}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {!ticket.is_read ? (
                                                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-rose-600"
                                                                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                                                                New
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-slate-400"
                                                                style={{ background: 'rgba(226,232,240,0.6)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                                                Read
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">{formatDate(ticket.created_at)}</span>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-1">{ticket.title}</h4>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span className="font-semibold text-indigo-600">{ticket.platform?.name}</span>
                                                    <span className="font-medium">👤 {ticket.user?.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* RIGHT: Ticket detail */}
                            {selectedTicket && (
                                <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                    {/* Header */}
                                    <div className="glass-panel rounded-2xl p-6 text-left">
                                        <button onClick={() => setSelectedTicketId(null)}
                                            className="lg:hidden flex items-center text-xs font-bold text-indigo-600 mb-4 hover:underline">
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" /></svg>
                                            Back to list
                                        </button>

                                        <div className="flex flex-wrap justify-between items-center gap-4 pb-5 mb-5 border-b border-slate-100/85">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-sm"
                                                    style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                                                    {selectedTicket.user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.1em] block mb-0.5">Submitted By</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-slate-800 text-base leading-none">{selectedTicket.user?.name}</span>
                                                    </div>
                                                    {selectedTicket.user?.department?.name && (
                                                        <span className="text-[11px] text-slate-500 font-bold block mt-1">
                                                            🏢 {selectedTicket.user.department.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.1em] block mb-1">Date Submitted</span>
                                                <div className="flex items-center gap-1.5 justify-end text-slate-700 font-bold text-sm">
                                                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formatDate(selectedTicket.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{selectedTicket.title}</h3>
                                        <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-indigo-600">
                                            <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                            <span>{selectedTicket.platform?.name}</span>
                                            {selectedTicket.common_issue && (
                                                <>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-slate-500 font-semibold">{selectedTicket.common_issue?.title}</span>
                                                </>
                                            )}
                                        </div>

                                        {selectedTicket.description && (
                                            <div className="mt-4 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"
                                                style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                                {selectedTicket.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chat */}
                                    <div className="glass-panel rounded-2xl p-5 flex flex-col h-[380px] shadow-sm relative overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.65)' }}>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
                                            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                                                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Conversation Thread
                                            </h4>
                                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                                {selectedTicket.replies?.length || 0} Messages
                                            </span>
                                        </div>
                                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 text-left premium-scrollbar">
                                            {selectedTicket.replies?.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                        <svg className="h-8 w-8 text-slate-300 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-500">No messages yet</p>
                                                </div>
                                            ) : selectedTicket.replies.map((reply) => {
                                                const isITReply = reply.user?.role === 'it' || reply.user?.role === 'admin';
                                                return (
                                                    <div key={reply.id}
                                                        className={`flex flex-col max-w-[85%] animate-slideUp ${isITReply ? 'ml-auto' : 'mr-auto'}`}>
                                                        <div className={`p-4 ${isITReply ? 'bubble-user text-white' : 'bubble-it text-slate-800'}`}>
                                                            <div className={`flex justify-between items-center gap-5 mb-2 pb-1.5 text-[10px] border-b ${isITReply ? 'border-white/20 text-indigo-50' : 'border-slate-200/80 text-slate-400'}`}>
                                                                <span className="font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                                                    {isITReply ? (
                                                                        <><span className="text-indigo-200">●</span> IT Support</>
                                                                    ) : (
                                                                        <><span className="text-slate-300">●</span> {reply.user?.department_name || 'User'}</>
                                                                    )}
                                                                </span>
                                                                <span className="font-semibold opacity-90">{formatDate(reply.created_at)}</span>
                                                            </div>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Reply Box */}
                                    {canReply && (
                                        <form onSubmit={handlePostReply} className="glass-panel p-1 rounded-2xl relative shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
                                            <div className="relative">
                                                <textarea
                                                    rows={3}
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    placeholder="Type your support response here..."
                                                    className="w-full rounded-xl border-0 bg-transparent text-slate-800 text-sm focus:ring-0 transition-all outline-none py-4 px-5 resize-none"
                                                />
                                                <div className="absolute bottom-3 right-3">
                                                    <button type="submit"
                                                        disabled={!replyMessage.trim()}
                                                        className="h-10 px-5 gradient-btn text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        <span>Send</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ─── SUBMIT TICKET TAB ─── */}
                {activeTab === 'new-ticket' && (
                    <SubmitTicketView
                        platforms={platforms}
                        selectedPlatform={selectedPlatform}
                        setSelectedPlatform={setSelectedPlatform}
                        selectedCommonIssue={selectedCommonIssue}
                        handleIssueSelect={handleIssueSelect}
                        handlePlatformSelect={handlePlatformSelect}
                        handleSubmitTicket={handleSubmitTicket}
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                    />
                )}

                {/* ─── MANAGE PLATFORMS TAB ─── */}
                {activeTab === 'manage-platforms' && isItHod && (
                    <ManagePlatformsView platforms={platforms} />
                )}
            </div>
        </div>
    );
}

// ============================================================
// SUBMIT TICKET VIEW (shared by IT + User)
// ============================================================
function SubmitTicketView({
    platforms,
    selectedPlatform, setSelectedPlatform,
    selectedCommonIssue, handleIssueSelect, handlePlatformSelect,
    handleSubmitTicket, data, setData, processing, errors
}) {
    return (
        <div className="space-y-6 animate-fadeIn">
            {!selectedPlatform ? (
                <div className="space-y-4">
                    <div className="text-left pb-2">
                        <h3 className="text-xl font-black text-slate-800">
                            🖥 Select the platform with the issue
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Choose from the options below to get started</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {platforms.map((platform) => {
                            const { icon, border } = getPlatformColor(platform.name);
                            return (
                                <div
                                    key={platform.id}
                                    onClick={() => handlePlatformSelect(platform)}
                                    className={`platform-card p-6 flex flex-col justify-between h-48 text-left ${border}`}
                                    style={{ animationDelay: `${platforms.indexOf(platform) * 0.05}s` }}
                                >
                                    <div>
                                        <div className={`p-3 rounded-xl w-fit ${icon} group-hover:scale-110 transition-transform duration-300`}>
                                            <PlatformIcon name={platform.name} className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-lg font-bold mt-4 text-slate-800 leading-tight">{platform.name}</h4>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 font-medium">{platform.description}</p>
                                    </div>
                                    <div className="flex items-center text-sm font-bold text-indigo-600 mt-3 group">
                                        Report an issue
                                        <svg className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left: Platform + issue select */}
                    <div className="lg:col-span-1 space-y-4 animate-slideUp">
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                            <button onClick={() => setSelectedPlatform(null)}
                                className="flex items-center text-sm font-bold text-indigo-600 hover:underline">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" /></svg>
                                Back to platforms
                            </button>
                            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100 text-left">
                                <div className={`p-2.5 rounded-xl ${getPlatformColor(selectedPlatform.name).icon}`}>
                                    <PlatformIcon name={selectedPlatform.name} className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800">{selectedPlatform.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">{selectedPlatform.description}</p>
                                </div>
                            </div>
                        </div>

                        {selectedPlatform.name !== 'Other' && (
                            <div className="glass-panel p-5 rounded-2xl space-y-3">
                                <h4 className="font-bold text-slate-700 text-sm text-left">Select issue type</h4>
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-left">
                                    <div
                                        onClick={() => handleIssueSelect(null)}
                                        className="p-3.5 rounded-xl border cursor-pointer text-sm transition-all duration-200 font-semibold"
                                        style={selectedCommonIssue === null ? {
                                            background: 'rgba(99,102,241,0.08)',
                                            border: '1.5px solid rgba(99,102,241,0.3)',
                                            color: '#4f46e5',
                                        } : {
                                            background: 'rgba(248,250,252,0.8)',
                                            border: '1px solid rgba(226,232,240,0.8)',
                                            color: '#64748b',
                                        }}
                                    >
                                        ✏️ Write a custom issue...
                                    </div>
                                    {selectedPlatform.common_issues?.map((issue) => (
                                        <div
                                            key={issue.id}
                                            onClick={() => handleIssueSelect(issue)}
                                            className="p-3.5 rounded-xl border cursor-pointer text-sm transition-all duration-200"
                                            style={selectedCommonIssue?.id === issue.id ? {
                                                background: 'rgba(99,102,241,0.08)',
                                                border: '1.5px solid rgba(99,102,241,0.3)',
                                                color: '#4f46e5',
                                            } : {
                                                background: 'rgba(248,250,252,0.8)',
                                                border: '1px solid rgba(226,232,240,0.8)',
                                                color: '#475569',
                                            }}
                                        >
                                            <div className="font-bold">{issue.title}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-2 font-normal">{issue.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-panel p-7 rounded-2xl animate-slideUp">
                            <h3 className="text-lg font-black text-slate-800 mb-6">📋 Submit Issue Details</h3>
                            <form onSubmit={handleSubmitTicket} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Issue Summary / Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        disabled={selectedCommonIssue !== null}
                                        placeholder="Provide a clear, brief summary of the problem"
                                        className="input-premium disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                    {errors.title && <span className="text-rose-500 text-xs mt-1.5 block font-semibold">{errors.title}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Detailed Description{' '}
                                        <span className="text-slate-400 font-normal text-xs">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe exactly what happened, any error messages seen, and steps you took..."
                                        className="input-premium resize-none"
                                    />
                                    {errors.description && <span className="text-rose-500 text-xs mt-1.5 block font-semibold">{errors.description}</span>}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 gradient-btn text-white font-bold rounded-2xl disabled:opacity-50 flex items-center gap-2 text-sm"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>🚀 Submit Support Ticket</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// MANAGE PLATFORMS VIEW
// ============================================================
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
        router.post(route('platforms.store'), { name: newPlatformName, description: newPlatformDesc }, {
            onSuccess: () => { setShowAddPlatform(false); setNewPlatformName(''); setNewPlatformDesc(''); }
        });
    };
    const handleUpdatePlatform = (e, platformId) => {
        e.preventDefault();
        router.patch(route('platforms.update', platformId), { name: editPlatformName, description: editPlatformDesc }, {
            onSuccess: () => setEditingPlatformId(null)
        });
    };
    const handleDestroyPlatform = (platform) => {
        if (confirm(`Delete "${platform.name}"? This will also delete all associated tickets!`)) {
            router.delete(route('platforms.destroy', platform.id));
        }
    };
    const handleCreateIssue = (e, platformId) => {
        e.preventDefault();
        router.post(route('platforms.issues.store', platformId), { title: newIssueTitle, description: newIssueDesc }, {
            onSuccess: () => { setAddingIssuePlatformId(null); setNewIssueTitle(''); setNewIssueDesc(''); }
        });
    };
    const handleUpdateIssue = (e, issueId) => {
        e.preventDefault();
        router.patch(route('issues.update', issueId), { title: editIssueTitle, description: editIssueDesc }, {
            onSuccess: () => setEditingIssueId(null)
        });
    };
    const handleDestroyIssue = (issue) => {
        if (confirm(`Delete issue category "${issue.title}"?`)) {
            router.delete(route('issues.destroy', issue.id));
        }
    };

    return (
        <div className="py-2 animate-fadeIn text-left">
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">⚙️ Manage Platforms</h3>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Configure standard support desk platforms and issue templates</p>
                    </div>
                    {!showAddPlatform && (
                        <button onClick={() => setShowAddPlatform(true)}
                            className="px-4 py-2.5 gradient-btn text-white font-bold rounded-xl text-sm flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Platform
                        </button>
                    )}
                </div>

                {showAddPlatform && (
                    <div className="glass-panel p-6 rounded-2xl animate-slideUp">
                        <h4 className="font-bold text-slate-800 text-base mb-4">Create New Platform</h4>
                        <form onSubmit={handleCreatePlatform} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Platform Name <span className="text-rose-500">*</span></label>
                                    <input type="text" value={newPlatformName}
                                        onChange={(e) => setNewPlatformName(e.target.value)}
                                        placeholder="e.g. Finance Hub"
                                        className="input-premium text-sm py-2.5" required />
                                    {errors?.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                                    <input type="text" value={newPlatformDesc}
                                        onChange={(e) => setNewPlatformDesc(e.target.value)}
                                        placeholder="Brief description..."
                                        className="input-premium text-sm py-2.5" />
                                    {errors?.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description}</span>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => { setShowAddPlatform(false); setNewPlatformName(''); setNewPlatformDesc(''); }}
                                    className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 gradient-btn text-white font-bold rounded-xl text-sm">
                                    Save Platform
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {platforms.map((platform) => (
                        <div key={platform.id} className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
                            {editingPlatformId === platform.id ? (
                                <form onSubmit={(e) => handleUpdatePlatform(e, platform.id)} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                                            <input type="text" value={editPlatformName} onChange={(e) => setEditPlatformName(e.target.value)}
                                                className="input-premium text-sm py-2" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                                            <input type="text" value={editPlatformDesc} onChange={(e) => setEditPlatformDesc(e.target.value)}
                                                className="input-premium text-sm py-2" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setEditingPlatformId(null)}
                                            className="px-3.5 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all">Cancel</button>
                                        <button type="submit"
                                            className="px-4 py-2 gradient-btn text-white font-bold rounded-xl text-xs">Save</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${getPlatformColor(platform.name).icon}`}>
                                            <PlatformIcon name={platform.name} className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{platform.name}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-1 font-medium">{platform.description || 'No description.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setEditingPlatformId(platform.id); setEditPlatformName(platform.name); setEditPlatformDesc(platform.description || ''); }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDestroyPlatform(platform)}
                                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Issue categories */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Issue Categories</h5>
                                    {addingIssuePlatformId !== platform.id && (
                                        <button onClick={() => { setAddingIssuePlatformId(platform.id); setNewIssueTitle(''); setNewIssueDesc(''); }}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            Add Category
                                        </button>
                                    )}
                                </div>

                                {addingIssuePlatformId === platform.id && (
                                    <form onSubmit={(e) => handleCreateIssue(e, platform.id)} className="p-4 rounded-xl space-y-3 animate-slideUp"
                                        style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Category Title <span className="text-rose-500">*</span></label>
                                            <input type="text" value={newIssueTitle} onChange={(e) => setNewIssueTitle(e.target.value)}
                                                placeholder="e.g. Password Reset"
                                                className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none py-2 px-3 transition-all" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Template Text (Optional)</label>
                                            <textarea value={newIssueDesc} onChange={(e) => setNewIssueDesc(e.target.value)}
                                                placeholder="Pre-fill description for users..."
                                                className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none py-2 px-3 transition-all" rows={2} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setAddingIssuePlatformId(null)}
                                                className="px-3 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-all">Cancel</button>
                                            <button type="submit" className="px-3.5 py-1.5 gradient-btn text-white font-bold rounded-xl text-xs">Save</button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                    {platform.common_issues?.length > 0 ? (
                                        platform.common_issues.map((issue) => (
                                            <div key={issue.id} className="p-3 rounded-xl transition-all"
                                                style={{ background: 'rgba(248,250,252,0.7)', border: '1px solid rgba(226,232,240,0.7)' }}>
                                                {editingIssueId === issue.id ? (
                                                    <form onSubmit={(e) => handleUpdateIssue(e, issue.id)} className="space-y-2">
                                                        <input type="text" value={editIssueTitle} onChange={(e) => setEditIssueTitle(e.target.value)}
                                                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none py-1.5 px-2.5 transition-all" required />
                                                        <textarea value={editIssueDesc} onChange={(e) => setEditIssueDesc(e.target.value)}
                                                            className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none py-1.5 px-2.5 transition-all" rows={2} />
                                                        <div className="flex justify-end gap-1">
                                                            <button type="button" onClick={() => setEditingIssueId(null)}
                                                                className="px-2 py-1 border border-slate-200 text-slate-500 rounded-lg text-[10px] hover:bg-slate-100 transition-all">Cancel</button>
                                                            <button type="submit"
                                                                className="px-2.5 py-1 gradient-btn text-white font-bold rounded-lg text-[10px]">Save</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 min-w-0 pr-2">
                                                            <span className="block font-bold text-slate-800 text-xs truncate">{issue.title}</span>
                                                            {issue.description && (
                                                                <span className="block text-[11px] text-slate-400 line-clamp-2 mt-0.5">{issue.description}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            <button onClick={() => { setEditingIssueId(issue.id); setEditIssueTitle(issue.title); setEditIssueDesc(issue.description || ''); }}
                                                                className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors">
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            </button>
                                                            <button onClick={() => handleDestroyIssue(issue)}
                                                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors">
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 py-3 text-center rounded-xl border border-dashed border-slate-200/70">
                                            No issue categories yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 2. USER DASHBOARD VIEW
// ============================================================
function UserDashboardView({ tickets = [], platforms = [], activeTab, setActiveTab }) {
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [selectedCommonIssue, setSelectedCommonIssue] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    const isITUser = (usr) => usr && (usr.role === 'it' || usr.role === 'admin' || usr.department_name === 'IT');
    const markAsRead = (t) => t?.replies?.length && localStorage.setItem(`seen_replies_${t.id}`, t.replies.length.toString());

    useEffect(() => { setSelectedTicket(null); }, [activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        platform_id: '',
        common_issue_id: '',
        title: '',
        description: '',
    });

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setSelectedCommonIssue(null);
        setData(prev => ({ ...prev, platform_id: platform.id, common_issue_id: '', title: '' }));
    };

    const handleIssueSelect = (issue) => {
        setSelectedCommonIssue(issue);
        setData(prev => ({
            ...prev,
            common_issue_id: issue ? issue.id : '',
            title: issue ? issue.title : '',
            description: issue ? issue.description : '',
        }));
    };

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            onSuccess: () => { reset(); setSelectedPlatform(null); setSelectedCommonIssue(null); setActiveTab('my-tickets'); }
        });
    };

    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        router.post(route('tickets.replies.store', selectedTicket.id), { message: replyMessage }, {
            onSuccess: () => {
                setReplyMessage('');
                const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
                if (updatedTicket) setSelectedTicket(updatedTicket);
            }
        });
    };

    useEffect(() => {
        if (selectedTicket) {
            const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
            if (updatedTicket) { setSelectedTicket(updatedTicket); markAsRead(updatedTicket); }
        }
    }, [tickets]);

    const handleViewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        markAsRead(ticket);
    };

    return (
        <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* SUBMIT TICKET TAB */}
                {activeTab === 'new-ticket' && (
                    <SubmitTicketView
                        platforms={platforms}
                        selectedPlatform={selectedPlatform}
                        setSelectedPlatform={setSelectedPlatform}
                        selectedCommonIssue={selectedCommonIssue}
                        handleIssueSelect={handleIssueSelect}
                        handlePlatformSelect={handlePlatformSelect}
                        handleSubmitTicket={handleSubmitTicket}
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                    />
                )}

                {/* MY TICKETS TAB */}
                {activeTab === 'my-tickets' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
                        {/* Left: Ticket list */}
                        <div className={`${selectedTicket ? 'hidden lg:flex lg:col-span-1 flex-col' : 'lg:col-span-3'} space-y-4`}>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-left">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">🎫 Your Tickets</h3>
                                    <p className="text-sm text-slate-500 font-medium">Track all your submitted support requests</p>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full"
                                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#4f46e5' }}>
                                    {tickets.length} tickets
                                </span>
                            </div>

                            {tickets.length === 0 ? (
                                <div className="glass-panel p-10 text-center rounded-2xl space-y-4">
                                    <svg className="h-14 w-14 mx-auto text-slate-300 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="font-bold text-slate-600">No tickets yet.</p>
                                    <button onClick={() => setActiveTab('new-ticket')}
                                        className="text-sm font-bold text-indigo-600 hover:underline">
                                        Submit your first ticket →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
                                    {tickets.map((ticket) => {
                                        const isSelected = selectedTicket?.id === ticket.id;
                                        const lastReply = ticket.replies?.length > 0 ? ticket.replies[ticket.replies.length - 1] : null;
                                        const isLastReplyIT = lastReply && isITUser(lastReply.user);
                                        const seenCount = parseInt(localStorage.getItem(`seen_replies_${ticket.id}`) || '0', 10);
                                        const hasNewITReply = isLastReplyIT && ticket.replies.length > seenCount;
                                        return (
                                            <div
                                                key={ticket.id}
                                                onClick={() => handleViewTicketDetails(ticket)}
                                                className={`ticket-card p-4 text-left ${isSelected ? 'selected' : ''}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    {hasNewITReply ? (
                                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-indigo-600"
                                                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                            💬 New Reply
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider text-slate-400"
                                                            style={{ background: 'rgba(226,232,240,0.6)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                                            Active
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400 font-medium">{formatDate(ticket.created_at)}</span>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-1.5">{ticket.title}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mb-1">
                                                    <PlatformIcon name={ticket.platform?.name} className="h-3.5 w-3.5" />
                                                    <span>{ticket.platform?.name}</span>
                                                </div>
                                                {ticket.replies?.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-slate-100/70 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                        <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        <span>{ticket.replies.length} replies • Last {formatDate(ticket.replies[ticket.replies.length - 1].created_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right: Ticket details */}
                        {selectedTicket && (
                            <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                {/* Header card */}
                                <div className="glass-panel p-6 rounded-2xl text-left">
                                    <button onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden flex items-center text-xs font-bold text-indigo-600 mb-4 hover:underline">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" /></svg>
                                        Back to list
                                    </button>
                                    <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-100 flex-wrap gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Submitted At</span>
                                        <span className="text-xs font-bold text-slate-600">{formatDate(selectedTicket.created_at)}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 leading-tight">{selectedTicket.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold text-indigo-600">
                                        <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                        <span>{selectedTicket.platform?.name}</span>
                                        {selectedTicket.common_issue && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-500 font-semibold">{selectedTicket.common_issue?.title}</span>
                                            </>
                                        )}
                                    </div>
                                    {selectedTicket.description && (
                                        <div className="mt-4 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"
                                            style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                            {selectedTicket.description}
                                        </div>
                                    )}
                                </div>

                                {/* Chat thread */}
                                <div className="glass-panel p-5 rounded-2xl flex flex-col h-[380px]">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 pb-3 border-b border-slate-100 text-left">
                                        Conversation Thread
                                    </h4>
                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-left">
                                        {selectedTicket.replies?.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
                                                <svg className="h-10 w-10 text-slate-300 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <p className="text-sm font-semibold text-center">No replies yet. The IT team will respond shortly.</p>
                                            </div>
                                        ) : selectedTicket.replies.map((reply) => {
                                            const isITReply = isITUser(reply.user);
                                            return (
                                                <div key={reply.id}
                                                    className={`flex flex-col max-w-[82%] p-3.5 ${isITReply ? 'mr-auto bubble-it text-slate-800' : 'ml-auto bubble-user text-white'}`}>
                                                    <div className={`flex justify-between items-center gap-4 mb-1.5 pb-1 text-[10px] border-b ${isITReply ? 'border-slate-200/60 text-slate-400' : 'border-white/15 text-indigo-100'}`}>
                                                        <span className="font-extrabold uppercase tracking-wide">
                                                            {isITReply ? '🛠 IT Department' : (reply.user?.department_name || 'You')}
                                                        </span>
                                                        <span className="font-medium">{formatDate(reply.created_at)}</span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Reply panel */}
                                <form onSubmit={handlePostReply} className="glass-panel p-5 rounded-2xl space-y-3">
                                    <textarea
                                        rows={3}
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Write a message to IT..."
                                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all outline-none py-2.5 px-3.5"
                                    />
                                    <div className="flex justify-end">
                                        <button type="submit"
                                            className="px-6 py-2.5 gradient-btn text-white font-bold rounded-xl text-sm flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
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

// ============================================================
// 3. MAIN WRAPPER
// ============================================================
export default function Dashboard({ tickets = [], platforms = [], canReply = false, isItHod = false }) {
    const user = usePage().props.auth.user;
    const resolvedIsItHod = isItHod || user.role === 'admin' || user.role === 'it' || (
        user.role?.toLowerCase() === 'hod' && user.department_id === 24
    );

    const [activeTab, setActiveTab] = useState(resolvedIsItHod ? 'queue' : 'new-ticket');

    const unreadCount = tickets.filter(t => !t.is_read).length;
    const pageTitle = resolvedIsItHod
        ? (unreadCount > 0 ? `(${unreadCount}) IT Service Desk` : 'IT Service Desk')
        : 'My Dashboard';

    const itTabs = [
        { id: 'queue', label: 'Ticket Queue', count: tickets.length, badge: unreadCount > 0 ? unreadCount : null },
        { id: 'new-ticket', label: 'Submit Ticket', count: null },
        ...(isItHod ? [{ id: 'manage-platforms', label: 'Manage Platforms', count: null }] : []),
    ];

    const userTabs = [
        { id: 'new-ticket', label: '+ New Ticket', count: null },
        { id: 'my-tickets', label: 'My Tickets', count: tickets.length },
    ];

    const tabs = resolvedIsItHod ? itTabs : userTabs;

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black leading-tight" style={{ letterSpacing: '-0.03em' }}>
                                {resolvedIsItHod ? (
                                    <span>🖥 <span className="text-slate-800">IT </span><span className="gradient-text-brand">Service Desk</span></span>
                                ) : (
                                    <span>👋 <span className="text-slate-800">Support </span><span className="gradient-text-brand">Portal</span></span>
                                )}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                {resolvedIsItHod
                                    ? `${tickets.length} total tickets${unreadCount > 0 ? ` • ${unreadCount} awaiting attention` : ''}`
                                    : 'Submit and track your IT support requests'
                                }
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-1 p-1 rounded-2xl"
                            style={{
                                background: 'rgba(255,255,255,0.7)',
                                border: '1px solid rgba(226,232,240,0.8)',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
                            }}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`nav-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count !== null && (
                                        <span className="ml-2 count-badge"
                                            style={activeTab === tab.id
                                                ? { background: 'rgba(99,102,241,0.15)', color: '#4f46e5' }
                                                : { background: 'rgba(226,232,240,0.8)', color: '#64748b' }
                                            }>
                                            {tab.count}
                                        </span>
                                    )}
                                    {tab.badge && (
                                        <span className="ml-2 count-badge text-white pulse-ring"
                                            style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)', boxShadow: '0 2px 8px rgba(225,29,72,0.35)' }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subtle gradient divider */}
                    <div className="section-divider" />
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
