import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In — TicketFlow" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
                    Welcome back
                </h2>
                <p className="text-slate-400 text-sm font-medium">Sign in to access your IT support portal</p>
            </div>

            {status && (
                <div className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-300"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: 'rgba(148,163,184,0.9)' }}>
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(148,163,184,0.7)' }}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="you@company.com"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.07)',
                                border: errors.email ? '1.5px solid rgba(244,63,94,0.6)' : '1.5px solid rgba(255,255,255,0.12)',
                                borderRadius: '0.875rem',
                                padding: '0.75rem 1rem 0.75rem 2.75rem',
                                color: 'white',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            className="focus:!border-indigo-400 focus:!shadow-[0_0_0_3px_rgba(99,102,241,0.2)] placeholder-slate-500"
                        />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: 'rgba(148,163,184,0.9)' }}>
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(148,163,184,0.7)' }}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.07)',
                                border: errors.password ? '1.5px solid rgba(244,63,94,0.6)' : '1.5px solid rgba(255,255,255,0.12)',
                                borderRadius: '0.875rem',
                                padding: '0.75rem 2.75rem 0.75rem 2.75rem',
                                color: 'white',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            className="focus:!border-indigo-400 focus:!shadow-[0_0_0_3px_rgba(99,102,241,0.2)] placeholder-slate-600"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: 'rgba(148,163,184,0.7)' }}
                        >
                            {showPassword ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2.5 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="sr-only"
                            />
                            <div
                                className="w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all duration-200"
                                style={{
                                    width: '18px', height: '18px',
                                    background: data.remember ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.08)',
                                    border: data.remember ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.15)',
                                    boxShadow: data.remember ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                                }}
                                onClick={() => setData('remember', !data.remember)}
                            >
                                {data.remember && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold transition-colors"
                            style={{ color: '#a78bfa' }}
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 text-white font-bold text-sm rounded-2xl mt-2 transition-all duration-200 relative overflow-hidden"
                    style={{
                        background: processing ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: processing ? 'none' : '0 4px 20px rgba(79,70,229,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
                        cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                >
                    {processing ? (
                        <span className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Signing in...</span>
                        </span>
                    ) : 'Sign In →'}
                </button>
            </form>
        </GuestLayout>
    );
}
