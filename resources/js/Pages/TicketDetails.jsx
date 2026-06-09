import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

// Platform Icons helper component (matches dashboards)
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

export default function TicketDetails({ ticket }) {
    const [replyMessage, setReplyMessage] = useState('');
    const [updateStatusVal, setUpdateStatusVal] = useState('');

    const handlePostReply = (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        router.post(route('tickets.replies.store', ticket.id), {
            message: replyMessage,
            update_status: updateStatusVal || null
        }, {
            onSuccess: () => {
                setReplyMessage('');
                setUpdateStatusVal('');
            }
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('dashboard')}
                            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/60 rounded-xl text-slate-650 dark:text-slate-350 transition-all duration-200"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                            Ticket #{ticket.id}
                        </h2>
                    </div>
                    <span className={`text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
            }
        >
            <Head title={`Ticket #${ticket.id} Details`} />

            <div className="py-8 text-slate-900 dark:text-slate-100">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Ticket details summary */}
                    <div className="glass-panel p-6 sm:p-8 rounded-2xl text-left space-y-4">
                        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                            <div>
                                <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
                                    CREATOR
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                                        {ticket.user?.name}
                                    </span>
                                    {ticket.user?.employee?.employee_code && (
                                        <span className="text-xs bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60 font-mono font-bold">
                                            {ticket.user.employee.employee_code}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-405 dark:text-slate-450 mt-1 space-y-0.5">
                                    <div>Email: {ticket.user?.email}</div>
                                    {ticket.user?.department?.name && (
                                        <div>Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.user.department.name}</span></div>
                                    )}
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">
                                    SUBMITTED AT
                                </span>
                                <span className="font-semibold text-slate-700 dark:text-slate-350 text-sm">
                                    {formatDate(ticket.created_at)}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                            {ticket.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-indigo-500 dark:text-indigo-400 font-semibold">
                            <PlatformIcon name={ticket.platform?.name} className="h-4 w-4" />
                            <span>Platform: {ticket.platform?.name}</span>
                            {ticket.common_issue && (
                                <>
                                    <span className="text-slate-350 dark:text-slate-750">•</span>
                                    <span>Template: {ticket.common_issue?.title}</span>
                                </>
                            )}
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40 text-sm text-slate-755 dark:text-slate-300 whitespace-pre-wrap">
                            {ticket.description}
                        </div>
                    </div>

                    {/* Chat log / Activity thread */}
                    <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4 min-h-[300px]">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-250 dark:border-slate-850 pb-2 text-left">
                            Activity Thread
                        </h4>
                        <div className="space-y-4">
                            {ticket.replies?.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    No messages or replies have been posted to this ticket yet.
                                </div>
                            ) : (
                                ticket.replies.map((reply) => {
                                    const isITReply = reply.user?.role === 'it' || reply.user?.role === 'admin';
                                    return (
                                        <div
                                            key={reply.id}
                                            className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-left border ${
                                                isITReply
                                                    ? 'mr-auto bg-slate-150 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 rounded-tl-none text-slate-900 dark:text-slate-100'
                                                    : 'ml-auto bg-indigo-600 text-white border-indigo-700 rounded-tr-none'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center gap-4 mb-1 border-b border-white/10 pb-0.5">
                                                <span className="text-xs font-extrabold uppercase tracking-wide">
                                                    {reply.user?.name} {isITReply && <span className="ml-1 bg-indigo-550 text-[10px] text-white px-1.5 py-0.5 rounded">IT Support</span>}
                                                </span>
                                                <span className={`text-[10px] ${isITReply ? 'text-slate-400 dark:text-slate-400' : 'text-indigo-200'}`}>
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

                    {/* Reply interface */}
                    {ticket.status !== 'closed' && (router.page.props.auth.user.role === 'it' || router.page.props.auth.user.role === 'admin') && (
                        <form onSubmit={handlePostReply} className="glass-panel p-6 rounded-2xl space-y-4 text-left">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                Post message response
                            </h4>
                            <textarea
                                rows={4}
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type details or response message here..."
                                className="w-full rounded-xl border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 py-2.5 px-3.5"
                            />
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                {router.page.props.auth.user.role === 'it' || router.page.props.auth.user.role === 'admin' ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-bold text-slate-500">Update Status:</span>
                                        <select
                                            value={updateStatusVal}
                                            onChange={(e) => setUpdateStatusVal(e.target.value)}
                                            className="text-xs rounded-lg border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">No change</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div />
                                )}
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                >
                                    Send Reply
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
