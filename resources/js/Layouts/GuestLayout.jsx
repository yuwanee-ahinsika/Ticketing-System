import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-slate-50 px-4">
            <div className="w-full sm:max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-sm shadow-indigo-100/20 hover:scale-105 transition-all duration-300">
                        <ApplicationLogo className="h-10 w-10" />
                    </div>
                    <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-800 font-sans text-center">
                        Tecketing System
                    </h1>
                </div>

                <div className="w-full overflow-hidden bg-white border border-slate-200/60 px-8 py-8 shadow-xl shadow-slate-200/40 rounded-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
