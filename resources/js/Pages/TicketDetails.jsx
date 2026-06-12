import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Platform icon
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

const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'open': return { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#b45309', label: '🔵 Open' };
        case 'in_progress': return { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', color: '#1d4ed8', label: '⚙️ In Progress' };
        case 'resolved': return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#047857', label: '✅ Resolved' };
        case 'closed': return { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)', color: '#475569', label: '⛔ Closed' };
        default: return { bg: 'rgba(226,232,240,0.8)', border: 'rgba(226,232,240,0.9)', color: '#64748b', label: status };
    }
};

export default function TicketDetails({ ticket, canReply = false }) {
    const [replyMessage, setReplyMessage] = useState('');
    const user = usePage().props.auth.user;
    const isIT = (usr) => usr && (usr.role === 'it' || usr.role === 'admin' || usr.department_name === 'IT');
    const isITUser = isIT(user);
    const seenCount = parseInt(localStorage.getItem(`seen_replies_${ticket.id}`) || '0', 10);

    useEffect(() => {
        if (ticket?.replies?.length) {
            localStorage.setItem(`seen_replies_${ticket.id}`, ticket.replies.length.toString());
        }
    }, [ticket]);

    const lastReply = ticket.replies?.length > 0 ? ticket.replies[ticket.replies.length - 1] : null;
    const hasNewITReply = lastReply && isIT(lastReply.user) && (ticket.replies.length > seenCount);
    const statusStyle = getStatusStyle(ticket.status);

    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        router.post(route('tickets.replies.store', ticket.id), {
            message: replyMessage,
            update_status: null
        }, { onSuccess: () => setReplyMessage('') });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('dashboard')}
                                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 hover:-translate-x-0.5 group"
                                style={{
                                    background: 'rgba(255,255,255,0.85)',
                                    border: '1px solid rgba(226,232,240,0.9)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                    color: '#64748b',
                                }}
                            >
                                <svg className="h-4 w-4 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-black leading-tight" style={{ letterSpacing: '-0.03em' }}>
                                    <span className="text-slate-800">Ticket </span>
                                    <span className="gradient-text-brand">#{ticket.id}</span>
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <PlatformIcon name={ticket.platform?.name} className="h-3.5 w-3.5 text-indigo-500" />
                                    <span className="text-xs text-slate-500 font-semibold">{ticket.platform?.name}</span>
                                </div>
                            </div>
                        </div>

                        <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full card-shine"
                            style={{
                                background: statusStyle.bg,
                                border: `1px solid ${statusStyle.border}`,
                                color: statusStyle.color,
                                boxShadow: `0 4px 12px ${statusStyle.border}`,
                            }}>
                        {statusStyle.label}
                    </span>
                    </div>
                    {/* Subtle gradient divider */}
                    <div className="section-divider" />
                </div>
            }
        >
            <Head title={`Ticket #${ticket.id} — Details`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ─── Ticket Info Card ─── */}
                    <div className="glass-panel p-7 rounded-2xl text-left animate-slideUp">
                        {/* Creator + date header */}
                        <div className="flex flex-wrap justify-between items-center gap-4 pb-5 mb-5 border-b border-slate-100/85">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-sm"
                                    style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                                    {ticket.user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.1em] block mb-0.5">Submitted By</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-800 text-base leading-none">{ticket.user?.name}</span>
                                    </div>
                                    {ticket.user?.department?.name && (
                                        <span className="text-[11px] text-slate-500 font-bold block mt-1">
                                            🏢 {ticket.user.department.name}
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
                                    <span>{formatDate(ticket.created_at)}</span>
                                </div>

                                {hasNewITReply && !isITUser && (
                                    <div className="mt-2 flex justify-end">
                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-indigo-600 notification-dot"
                                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                            💬 New IT Reply
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-slate-800 leading-tight mb-3">
                            {ticket.title}
                        </h3>

                        {/* Platform badges */}
                        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-indigo-600 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                <PlatformIcon name={ticket.platform?.name} className="h-4 w-4" />
                                <span>{ticket.platform?.name}</span>
                            </div>
                            {ticket.common_issue && (
                                <span className="px-3 py-1.5 rounded-xl text-slate-600 font-semibold text-xs"
                                    style={{ background: 'rgba(241,245,249,0.9)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                    📂 {ticket.common_issue?.title}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {ticket.description && (
                            <div className="p-5 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"
                                style={{ background: 'rgba(248,250,252,0.8)', border: '1px solid rgba(226,232,240,0.8)' }}>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</div>
                                {ticket.description}
                            </div>
                        )}
                    </div>

                    {/* ─── Conversation Thread ─── */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden animate-slideUp" style={{ animationDelay: '0.05s', background: 'rgba(255, 255, 255, 0.65)' }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/60">
                            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Activity Thread
                            </h4>
                            {ticket.replies?.length > 0 && (
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                    {ticket.replies.length} Message{ticket.replies.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 min-h-[140px] premium-scrollbar">
                            {ticket.replies?.length === 0 ? (
                                <div className="py-10 flex flex-col items-center justify-center space-y-3 text-slate-400">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                        <svg className="h-8 w-8 text-slate-300 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">No messages yet</p>
                                </div>
                            ) : ticket.replies.map((reply) => {
                                const isITReply = isIT(reply.user);
                                return (
                                    <div
                                        key={reply.id}
                                        className={`flex flex-col max-w-[85%] animate-slideUp ${isITReply ? 'mr-auto' : 'ml-auto'}`}
                                    >
                                        <div className={`p-4 ${isITReply ? 'bubble-it text-slate-800' : 'bubble-user text-white'}`}>
                                            <div className={`flex justify-between items-center gap-5 mb-2 pb-1.5 text-[10px] border-b ${isITReply ? 'border-slate-200/80 text-slate-400' : 'border-white/20 text-indigo-50'}`}>
                                                <span className="font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                                    {isITReply ? (
                                                        <><span className="text-slate-300">●</span> IT Department</>
                                                    ) : (
                                                        <><span className="text-indigo-200">●</span> {reply.user?.department_name || 'You'}</>
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

                    {/* ─── Reply Form ─── */}
                    {ticket.status !== 'closed' && canReply && (
                        <form onSubmit={handlePostReply} className="glass-panel p-1 rounded-2xl relative shadow-sm animate-slideUp" style={{ animationDelay: '0.1s', background: 'rgba(255, 255, 255, 0.8)' }}>
                            <div className="relative">
                                <textarea
                                    rows={4}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your message or solution here..."
                                    className="w-full rounded-xl border-0 bg-transparent text-slate-800 text-sm focus:ring-0 transition-all outline-none py-4 px-5 resize-none"
                                />
                                <div className="absolute bottom-3 right-3">
                                    <button
                                        type="submit"
                                        disabled={!replyMessage.trim()}
                                        className="h-10 px-5 gradient-btn text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Send Reply</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
