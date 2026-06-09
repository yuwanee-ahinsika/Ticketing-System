import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// Platform Icons helper component
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

export default function UserDashboard({ platforms = [], tickets = [] }) {
    const [activeTab, setActiveTab] = useState('new-ticket'); // 'new-ticket' or 'my-tickets'
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [selectedCommonIssue, setSelectedCommonIssue] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

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

    // Select a ticket to view conversation details
    const handleViewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
    };

    // Format Date helper
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get Status classes
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Helpdesk Ticketing System
                    </h2>
                    <div className="flex space-x-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50">
                        <button
                            onClick={() => { setActiveTab('new-ticket'); setSelectedTicket(null); }}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                activeTab === 'new-ticket'
                                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            Submit Ticket
                        </button>
                        <button
                            onClick={() => setActiveTab('my-tickets')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                activeTab === 'my-tickets'
                                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            My Tickets ({tickets.length})
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="User Dashboard" />

            <div className="py-8 text-slate-900 dark:text-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* SUBMIT TICKET TAB */}
                    {activeTab === 'new-ticket' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Step 1: Select Platform */}
                            {!selectedPlatform ? (
                                <div className="space-y-4">
                                    <div className="border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                            Step 1: Select the platform having the issue
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Choose the application, department service, or device where the problem is occurring.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {platforms.map((platform) => (
                                            <div
                                                key={platform.id}
                                                onClick={() => handlePlatformSelect(platform)}
                                                className="glass-card cursor-pointer p-6 rounded-2xl flex flex-col justify-between h-48 group text-left"
                                            >
                                                <div>
                                                    <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl w-fit group-hover:bg-indigo-500/20 transition-all duration-300">
                                                        <PlatformIcon name={platform.name} className="h-6 w-6" />
                                                    </div>
                                                    <h4 className="text-lg font-bold mt-4 text-slate-800 dark:text-slate-100">
                                                        {platform.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                        {platform.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-2">
                                                    Report an issue
                                                    <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Platform selected flow */
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    {/* Left pane: Selected Platform & Common Issues list */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                                            <button
                                                onClick={() => setSelectedPlatform(null)}
                                                className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 flex items-center hover:underline"
                                            >
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                                                </svg>
                                                Back to platforms
                                            </button>
                                            <div className="flex items-center space-x-3 border-t border-slate-200 dark:border-slate-700/50 pt-4">
                                                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg">
                                                    <PlatformIcon name={selectedPlatform.name} className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 dark:text-slate-250 text-base">{selectedPlatform.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{selectedPlatform.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                                            <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm">
                                                Select standard issue type
                                            </h4>
                                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                                <div
                                                    onClick={() => handleIssueSelect(null)}
                                                    className={`p-3.5 rounded-xl border text-sm cursor-pointer transition-all duration-200 ${
                                                        selectedCommonIssue === null
                                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400 font-semibold'
                                                            : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    Write a custom issue...
                                                </div>
                                                {selectedPlatform.common_issues?.map((issue) => (
                                                    <div
                                                        key={issue.id}
                                                        onClick={() => handleIssueSelect(issue)}
                                                        className={`p-3.5 rounded-xl border text-sm cursor-pointer text-left transition-all duration-200 ${
                                                            selectedCommonIssue?.id === issue.id
                                                                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400 font-semibold'
                                                                                            : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        <div className="font-bold">{issue.title}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-normal">
                                                            {issue.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right pane: Submission Form */}
                                    <div className="lg:col-span-2">
                                        <div className="glass-panel p-8 rounded-2xl">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">
                                                Submit Issue Details
                                            </h3>

                                            <form onSubmit={handleSubmitTicket} className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                        Issue Summary / Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        disabled={selectedCommonIssue !== null}
                                                        placeholder="Provide a clear, brief summary of the problem"
                                                        className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800/80 transition-all duration-200"
                                                    />
                                                    {errors.title && <span className="text-rose-500 text-xs mt-1 block">{errors.title}</span>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                        Detailed Description
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                        placeholder="Describe exactly what happened, step by step. Mention any error messages seen, and what actions you were trying to do."
                                                        className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
                                <div className="border-b border-slate-200 dark:border-slate-700/50 pb-2 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                        Your Open & Historical Tickets
                                    </h3>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/40">
                                        Total: {tickets.length}
                                    </span>
                                </div>

                                {tickets.length === 0 ? (
                                    <div className="glass-panel p-8 text-center rounded-2xl text-slate-500 dark:text-slate-400 space-y-3">
                                        <svg className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-medium">You haven't submitted any tickets yet.</p>
                                        <button
                                            onClick={() => setActiveTab('new-ticket')}
                                            className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:underline"
                                        >
                                            Submit your first ticket now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                                        {tickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                onClick={() => handleViewTicketDetails(ticket)}
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
                                                <div className="flex items-center space-x-2 text-xs text-indigo-500 dark:text-indigo-400 font-semibold mb-2">
                                                    <PlatformIcon name={ticket.platform?.name} className="h-3.5 w-3.5" />
                                                    <span>{ticket.platform?.name}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                    {ticket.description}
                                                </p>
                                                {ticket.replies?.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
                                                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        <span>{ticket.replies.length} replies • Last: {formatDate(ticket.replies[ticket.replies.length - 1].created_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Panel: Conversation details */}
                            {selectedTicket && (
                                <div className="lg:col-span-2 space-y-4 animate-slideIn">
                                    {/* Ticket Detail Header Card */}
                                    <div className="glass-panel p-6 rounded-2xl relative text-left">
                                        <button
                                            onClick={() => setSelectedTicket(null)}
                                            className="lg:hidden text-xs font-semibold text-indigo-500 dark:text-indigo-400 flex items-center mb-4 hover:underline"
                                        >
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                                            </svg>
                                            Back to queue
                                        </button>
                                        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                                            <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                                                {selectedTicket.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                Created: {formatDate(selectedTicket.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                            {selectedTicket.title}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-indigo-550 dark:text-indigo-450 font-semibold mt-1">
                                            <PlatformIcon name={selectedTicket.platform?.name} className="h-4 w-4" />
                                            <span>Platform: {selectedTicket.platform?.name}</span>
                                            {selectedTicket.common_issue && (
                                                <>
                                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                                    <span>Category: {selectedTicket.common_issue?.title}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                            {selectedTicket.description}
                                        </div>
                                    </div>

                                    {/* Chat Log / Ticket Replies */}
                                    <div className="glass-panel p-6 rounded-2xl flex flex-col space-y-4 h-[400px] overflow-y-auto">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-200 dark:border-slate-850 pb-2 text-left">
                                            Conversation Activity
                                        </h4>
                                        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                            {selectedTicket.replies?.length === 0 ? (
                                                <div className="h-full flex flex-col justify-center items-center text-slate-500 dark:text-slate-400 space-y-2">
                                                    <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <p className="text-sm">No replies yet. The IT department will view your issue soon.</p>
                                                </div>
                                            ) : (
                                                selectedTicket.replies.map((reply) => {
                                                    const isITReply = reply.user?.role === 'it' || reply.user?.role === 'admin';
                                                    return (
                                                        <div
                                                            key={reply.id}
                                                            className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-left border ${
                                                                isITReply
                                                                    ? 'mr-auto bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                                                                    : 'ml-auto bg-indigo-600 text-white border-indigo-700 rounded-tr-none'
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-center gap-4 mb-1 border-b border-white/10 pb-0.5">
                                                                <span className="text-xs font-extrabold uppercase tracking-wide">
                                                                    {reply.user?.name} {isITReply && <span className="ml-1 bg-indigo-500 text-[10px] text-white px-1.5 py-0.5 rounded">IT Staff</span>}
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
