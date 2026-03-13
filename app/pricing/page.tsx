import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#1B2431] font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-20 md:py-32">
                <div className="text-center mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Simple pricing</h1>
                    <p className="text-[#4A5568] text-lg md:text-xl font-medium">Start free. Pay only when you need more.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free Card */}
                    <div className="bg-white border border-[#E8E0D0] p-8 md:p-10 flex flex-col h-full relative transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="mb-8">
                            <h3 className="text-xl font-serif font-bold mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">₦0</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                '3 document generations',
                                'All 9 document types',
                                'PDF and Word export',
                                'No account required'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#4A5568] text-sm leading-tight">
                                    <div className="mt-1 w-4 h-4 rounded-full bg-[#FAFAF8] border border-[#E8E0D0] flex items-center justify-center flex-shrink-0">
                                        <div className="w-1.5 h-1.5 bg-[#D4A853]" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/generate"
                            className="w-full py-4 border-2 border-[#1B2431] text-[#1B2431] text-center font-black text-sm uppercase tracking-widest hover:bg-[#1B2431] hover:text-white transition-all"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pay As You Go Card */}
                    <div className="bg-white border-2 border-[#D4A853] p-8 md:p-10 flex flex-col h-full relative shadow-[0_12px_40px_rgba(212,168,83,0.08)] transition-all hover:shadow-[0_12px_40px_rgba(212,168,83,0.12)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A853] text-[#1B2431] px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                            Most Popular
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-serif font-bold mb-2">Pay As You Go</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">₦300</span>
                                <span className="text-[#6B7280] text-sm">per generation</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                'Full document set each time',
                                'All 9 document types',
                                'PDF and Word export',
                                'Save to dashboard',
                                'Priority generation'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#4A5568] text-sm leading-tight">
                                    <div className="mt-1 w-4 h-4 rounded-full bg-[#FAFAF8] border border-[#D4A853]/30 flex items-center justify-center flex-shrink-0">
                                        <div className="w-1.5 h-1.5 bg-[#D4A853]" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/generate"
                            className="w-full py-4 bg-[#D4A853] text-[#1B2431] text-center font-black text-sm uppercase tracking-widest hover:bg-[#c29845] transition-all"
                        >
                            Generate Now
                        </Link>
                    </div>

                    {/* Semester Plan Card */}
                    <div className="bg-white border border-[#E8E0D0] p-8 md:p-10 flex flex-col h-full relative opacity-80 h-full relative transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6B7280] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                            Coming Soon
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-serif font-bold mb-2">Semester Plan</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">₦2,500</span>
                                <span className="text-[#6B7280] text-sm">per semester</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                'Unlimited generations',
                                'All document types',
                                'Save unlimited projects',
                                'Email support'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-[#4A5568] text-sm leading-tight">
                                    <div className="mt-1 w-4 h-4 rounded-full bg-[#FAFAF8] border border-[#E8E0D0] flex items-center justify-center flex-shrink-0">
                                        <div className="w-1.5 h-1.5 bg-[#D4A853]" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled
                            className="w-full py-4 bg-[#E5E7EB] text-[#9CA3AF] text-center font-black text-sm uppercase tracking-widest cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
