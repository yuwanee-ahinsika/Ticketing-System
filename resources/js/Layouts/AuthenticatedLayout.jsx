import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '??';

    const isIT = user.role === 'it' || user.role === 'admin';

    return (
        <div className="min-h-screen app-bg relative overflow-hidden">
            {/* Decorative floating orbs behind content */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full orb-1"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full orb-2"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
                <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)' }} />
            </div>

            {/* Animated gradient top accent strip */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] header-gradient-strip" />

            {/* Premium Navbar */}
            <nav className="sticky top-[3px] z-50 premium-navbar">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Brand */}
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                                        boxShadow: '0 4px 16px rgba(79,70,229,0.4), 0 0 0 2px rgba(255,255,255,0.8)',
                                    }}>
                                    <ApplicationLogo className="h-5 w-5" style={{ fill: 'white' }} />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-black text-slate-800 text-lg tracking-tight leading-none"
                                        style={{ letterSpacing: '-0.03em' }}>
                                        Ticket<span className="gradient-text-brand">Flow</span>
                                    </span>
                                    {isIT && (
                                        <span className="block text-[9px] font-extrabold uppercase tracking-[0.15em] mt-0.5"
                                            style={{
                                                background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                            }}>
                                            IT Service Desk
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden sm:flex items-center space-x-1">
                                <Link
                                    href={route('dashboard')}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${route().current('dashboard')
                                        ? 'text-indigo-700 shadow-sm'
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50/80'
                                        }`}
                                    style={route().current('dashboard') ? {
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
                                        border: '1px solid rgba(99,102,241,0.15)',
                                    } : {}}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Dashboard</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right: User area */}
                        <div className="hidden sm:flex items-center space-x-3">
                            {/* Role Badge */}
                            {isIT && (
                                <span className="text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider card-shine"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.1))',
                                        border: '1px solid rgba(99,102,241,0.22)',
                                        color: '#4f46e5',
                                        boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
                                    }}>
                                    {user.role === 'admin' ? '⚡ Admin' : '🛠 IT Staff'}
                                </span>
                            )}

                            {/* User Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-2.5 px-2 py-1.5 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 group"
                                        style={{ border: '1px solid rgba(226,232,240,0.7)' }}>
                                        {/* Avatar with gradient ring */}
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a78bfa 100%)',
                                                    boxShadow: '0 2px 10px rgba(79,70,229,0.35), 0 0 0 2px rgba(255,255,255,0.85)',
                                                }}>
                                                {initials}
                                            </div>
                                            {/* Online status dot */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                                                style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                                        </div>
                                        <div className="text-left hidden md:block ml-1">
                                            <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">{user.email}</div>
                                        </div>
                                        <svg className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-all ml-0.5 group-hover:translate-y-0.5"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-3 border-b border-slate-100/80">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{user.name}</div>
                                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile Settings
                                        </span>
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        <span className="flex items-center gap-2 text-rose-600">
                                            <svg className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 transition duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-100/80'}>
                    <div className="space-y-1 pb-3 pt-2 px-4">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                    <div className="border-t border-slate-100 pb-3 pt-4 px-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
                                {initials}
                            </div>
                            <div>
                                <div className="text-base font-bold text-slate-800">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-2 sm:px-6 lg:px-8">
                    {header}
                </header>
            )}

            <main className="relative z-10 page-enter">{children}</main>
        </div>
    );
}
