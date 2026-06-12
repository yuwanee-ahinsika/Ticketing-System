import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex login-bg relative">
            {/* Floating orbs for depth */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full orb-1 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full orb-2 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />

            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative z-10">
                <div className="max-w-lg">
                    {/* Logo */}
                    <div className="flex items-center space-x-4 mb-12">
                        <div className="p-3 rounded-2xl" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <ApplicationLogo className="h-8 w-8 text-white" style={{ fill: 'white' }} />
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">TicketFlow</span>
                    </div>

                    <h1 className="text-5xl font-black text-white leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
                        IT Support,<br />
                        <span style={{ background: 'linear-gradient(120deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Reimagined.
                        </span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-10" style={{ fontWeight: 400 }}>
                        Streamline your IT helpdesk with a modern ticketing system.
                        Submit, track, and resolve issues faster than ever.
                    </p>

                    {/* Feature pills */}
                    <div className="space-y-3">
                        {[
                            { icon: '⚡', text: 'Instant ticket submission & tracking' },
                            { icon: '💬', text: 'Real-time conversation with IT team' },
                            { icon: '📊', text: 'Smart queue management for IT staff' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-3"
                                style={{ animation: `slideUp 0.5s ${0.1 + i * 0.1}s both cubic-bezier(0.16,1,0.3,1)` }}>
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                    {f.icon}
                                </span>
                                <span className="text-slate-300 font-medium">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Login Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 relative z-10">
                <div className="w-full max-w-md animate-slideUp">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
                        <div className="p-2.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <ApplicationLogo className="h-7 w-7" style={{ fill: 'white' }} />
                        </div>
                        <span className="text-white text-xl font-bold">TicketFlow</span>
                    </div>

                    {/* Card */}
                    <div className="login-card rounded-3xl px-8 py-10">
                        {children}
                    </div>

                    <p className="text-center text-slate-500 text-xs mt-6">
                        © {new Date().getFullYear()} TicketFlow IT System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
