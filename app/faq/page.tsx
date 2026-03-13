"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'

export default function FAQPage() {
    const faqs = [
        {
            q: "What is Formwork?",
            a: "Formwork is an AI-powered platform that generates complete architectural preliminary writings from your project brief. Upload your brief, and get all nine preliminary documents ready to review and download."
        },
        {
            q: "Is Formwork only for FUTA students?",
            a: "Formwork was built with FUTA students in mind first, but it works for architecture students across all Nigerian universities. The documents follow formats and language that Nigerian architecture lecturers expect."
        },
        {
            q: "How many free generations do I get?",
            a: "Every user gets 3 free generations with no account required. After that, you can pay per generation or wait for our semester plan launching soon."
        },
        {
            q: "Will my lecturer know I used Formwork?",
            a: "Formwork generates a starting point — well-structured, human-sounding preliminary writings tailored to your brief. You are expected to review, edit, and make it your own before submission, just like any tool."
        },
        {
            q: "What document types does Formwork generate?",
            a: "Introduction, Design Brief, Brief Development, Site Analysis, Site Planning, Case Studies, Spatial Analysis, Schedule of Accommodation, and Relationship Table."
        },
        {
            q: "Can I edit the generated documents?",
            a: "Yes. Every document is fully editable directly on the output page. You can also regenerate any single document if you want a different result."
        },
        {
            q: "What formats can I download in?",
            a: "PDF and Microsoft Word (.docx)."
        }
    ]

    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#1B2431] font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-20 md:py-32">
                <div className="text-center mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Frequently Asked Questions</h1>
                    <p className="text-[#4A5568] text-lg font-medium">Everything you need to know about Formwork.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-[#E8E0D0] bg-white overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className="font-bold text-lg md:text-xl text-[#1B2431] group-hover:text-[#D4A853] transition-colors pr-8">
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#D4A853] transition-transform duration-300 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-8 pb-8 text-[#4A5568] leading-relaxed text-base">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-10 bg-[#1B2431] text-center">
                    <h3 className="text-white font-serif font-bold text-2xl mb-4">Still have questions?</h3>
                    <p className="text-[#9CA3AF] mb-8">We're here to help you through your studio deadlines.</p>
                    <Link
                        href="mailto:hello@nante.dev"
                        className="inline-block px-8 py-3 border-2 border-[#D4A853] text-[#D4A853] font-black text-sm uppercase tracking-widest hover:bg-[#D4A853] hover:text-[#1B2431] transition-all"
                    >
                        Contact Support
                    </Link>
                </div>
            </main>
        </div>
    )
}
