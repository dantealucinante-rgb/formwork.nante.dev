import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-[#FAFAF8]/90 border-b border-[#E8E0D0] desktop-nav">
            <div className="flex items-center gap-4 group">
                <Link href="/" className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1B2431] flex items-center justify-center overflow-hidden relative">
                        <span className="text-[#D4A853] font-black text-2xl z-10">F</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-serif font-bold tracking-tight text-[#1B2431]">Formwork</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">BY ARCHITECTS, FOR ARCHITECTS</span>
                    </div>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link href="/auth/signin" className="text-sm font-bold hover:text-[#D4A853] transition-colors tracking-wide uppercase text-[#1B2431]">
                    Sign In
                </Link>
                <Link
                    href="/generate"
                    className="px-6 py-2.5 bg-[#1B2431] text-white font-black text-sm uppercase tracking-wider rounded-none hover:bg-[#D4A853] hover:text-[#1B2431] transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.05)] active:translate-x-0.5 active:translate-y-0.5"
                >
                    Get Started Free
                </Link>
            </div>
        </nav>
    )
}
