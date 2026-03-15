'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { Plus, MoreVertical, LayoutGrid, Folders } from 'lucide-react'

// Mock Data
const PROJECTS = [
    {
        id: 1,
        title: 'Center for African Arts',
        type: 'Cultural Center',
        university: 'UNILAG',
        date: 'Oct 24, 2026',
    },
    {
        id: 2,
        title: 'High-Density Housing',
        type: 'Residential',
        university: 'FUTA',
        date: 'Oct 15, 2026',
    },
    {
        id: 3,
        title: 'Eco-Resort Complex',
        type: 'Hospitality',
        university: 'OAU',
        date: 'Sep 02, 2026',
    }
]

export default function DashboardPage() {
    const { user, profile, loading } = useAuth()
    const router = useRouter()
    const [greeting, setGreeting] = useState('')

    const GREETINGS = [
        'Welcome back,',
        'Good to see you,',
        'Hello again,',
        'Ready to design,',
        'Back at it,',
        'Great to have you,',
    ]

    useEffect(() => {
        const random = GREETINGS[
            Math.floor(Math.random() * GREETINGS.length)
        ]
        setGreeting(random)
    }, [])

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin')
        }
    }, [user, loading, router])

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAFAF8'
        }}>
            <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
                fontWeight: '500'
            }}>Loading dashboard...</p>
        </div>
    )

    if (!user) return null

    const rawName = profile?.full_name || user?.email?.split('@')[0] || 'Architect'
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1)

    const projectsCount = PROJECTS.length;
    const hasProjects = projectsCount > 0;

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1B2431]">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-12">
                    <div className="text-center sm:text-left">
                        <p className="text-[#6B7280] text-base mb-1 font-medium">{greeting}</p>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2431] leading-tight mb-2">
                            {name}, Architect.
                        </h1>
                        <p className="text-[#9CA3AF] text-sm font-bold uppercase tracking-[0.1em]">
                            {projectsCount} {projectsCount === 1 ? 'project' : 'projects'} saved
                        </p>
                    </div>
                    <Link
                        href="/generate"
                        className="flex items-center gap-2 px-8 py-4 bg-[#D4A853] text-[#1B2431] font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.05)] hover:bg-[#1B2431] hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </Link>
                </div>

                {hasProjects ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PROJECTS.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border border-[#E8E0D0] p-6 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-[240px]"
                            >
                                <div className="absolute top-0 left-0 w-1 h-0 bg-[#D4A853] group-hover:h-full transition-all duration-300" />

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-[#D4A853]/10 text-[#D4A853] text-[10px] font-bold uppercase tracking-widest border border-[#D4A853]/20">
                                            {project.type}
                                        </span>
                                        <span className="px-2 py-1 bg-[#FAFAF8] text-[#6B7280] text-[10px] font-bold uppercase tracking-widest border border-[#E8E0D0]">
                                            {project.university}
                                        </span>
                                    </div>
                                    <button className="text-[#9CA3AF] hover:text-[#1B2431] p-1 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-serif font-bold text-[#1B2431] line-clamp-2 mb-auto leading-tight pr-4">
                                    {project.title}
                                </h3>

                                <div className="border-t border-[#E8E0D0] mt-6 pt-4 flex items-center justify-between">
                                    <span className="text-xs text-[#9CA3AF] font-bold tracking-widest uppercase">
                                        {project.date}
                                    </span>
                                    <Link
                                        href="/output"
                                        className="text-xs font-bold uppercase tracking-widest text-[#1B2431] hover:text-[#D4A853] transition-colors flex items-center gap-1"
                                    >
                                        Open
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32 px-4 text-center border-2 border-dashed border-[#E8E0D0] bg-white mt-8 max-w-3xl mx-auto min-h-[400px]">
                        <div className="w-20 h-20 bg-[#FAFAF8] rounded-full flex items-center justify-center mb-6">
                            <Folders className="w-10 h-10 text-[#D4A853] opacity-50" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#1B2431] mb-2">No projects yet</h2>
                        <p className="text-[#6B7280] mb-8 font-medium">Generate your first set of preliminaries to get started.</p>
                        <Link
                            href="/generate"
                            className="flex items-center gap-2 px-8 py-4 border-2 border-[#1B2431] text-[#1B2431] font-black uppercase tracking-widest hover:bg-[#1B2431] hover:text-white transition-all shadow-[4px_4px_0px_rgba(232,224,208,1)]"
                        >
                            Start a Project
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
