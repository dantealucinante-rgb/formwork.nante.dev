'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import {
    Plus,
    MoreVertical,
    LayoutGrid,
    Folders,
    User,
    Settings,
    BarChart3,
    Trash2,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Clock,
    FileText,
    Zap
} from 'lucide-react'

const GREETINGS = [
    'Welcome back,',
    'Good to see you,',
    'Hello again,',
    'Ready to design,',
    'Back at it,',
]

const UNIVERSITIES = ['FUTA', 'UNILAG', 'OAU', 'UNIBEN', 'ABU', 'UNN', 'LASU', 'Other']
const YEARS = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level']
const DOC_TYPES = [
    'Introduction',
    'Design Brief',
    'Brief Development',
    'Site Analysis',
    'Site Planning',
    'Case Studies',
    'Spatial Analysis',
    'Schedule of Accommodation',
    'Technical Specification'
]

export default function DashboardPage() {
    const { user, profile, loading, signOut } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('projects')
    const [greeting, setGreeting] = useState('')
    const [projects, setProjects] = useState<any[]>([])
    const [loadingProjects, setLoadingProjects] = useState(true)

    // Profile form state
    const [fullName, setFullName] = useState('')
    const [university, setUniversity] = useState('')
    const [yearOfStudy, setYearOfStudy] = useState('')
    const [matricNumber, setMatricNumber] = useState('')
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })

    // Settings state
    const [defaultUniversity, setDefaultUniversity] = useState('')
    const [defaultDocs, setDefaultDocs] = useState<string[]>(DOC_TYPES)
    const [preferredFormat, setPreferredFormat] = useState('pdf')
    const [savingSettings, setSavingSettings] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin')
        }
    }, [user, loading, router])

    useEffect(() => {
        setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
    }, [])

    useEffect(() => {
        if (user) {
            fetchProjects()
            if (profile) {
                setFullName(profile.full_name || '')
                setUniversity(profile.university || '')
                setYearOfStudy(profile.year_of_study || '')
                setMatricNumber(profile.matric_number || '')
                setDefaultUniversity(profile.default_university || '')
                if (profile.default_documents) setDefaultDocs(profile.default_documents)
                if (profile.preferred_format) setPreferredFormat(profile.preferred_format)
            }
        }
    }, [user, profile])

    const fetchProjects = async () => {
        if (!user) return
        setLoadingProjects(true)
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setProjects(data)
        setLoadingProjects(false)
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)

        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== projectId))
        }
    }

    const handleViewProject = (project: any) => {
        sessionStorage.setItem('formwork_output', JSON.stringify({
            documents: project.documents,
            details: project.details,
            selectedDocuments: Object.keys(project.documents)
        }))
        router.push('/output')
    }

    const handleSaveProfile = async () => {
        if (!user) return
        setUpdatingProfile(true)
        setMessage({ text: '', type: '' })

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                university,
                year_of_study: yearOfStudy,
                matric_number: matricNumber
            })
            .eq('id', user.id)

        if (error) {
            setMessage({ text: 'Failed to update profile', type: 'error' })
        } else {
            setMessage({ text: 'Profile updated successfully', type: 'success' })
        }
        setUpdatingProfile(false)
    }

    const handleSaveSettings = async () => {
        if (!user) return
        setSavingSettings(true)
        const { error } = await supabase
            .from('profiles')
            .update({
                default_university: defaultUniversity,
                default_documents: defaultDocs,
                preferred_format: preferredFormat
            })
            .eq('id', user.id)

        if (!error) {
            setMessage({ text: 'Settings saved', type: 'success' })
        }
        setSavingSettings(false)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#D4A853] border-t-transparent animate-spin" />
                <p className="font-sans text-sm text-[#6B7280]">Initializing workspace...</p>
            </div>
        </div>
    )

    if (!user) return null

    const rawName = profile?.full_name || user?.email?.split('@')[0] || 'Architect'
    const name = rawName.split(' ')[0].charAt(0).toUpperCase() + rawName.split(' ')[0].slice(1)
    const initials = fullName
        ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : name.slice(0, 1).toUpperCase()

    const navItems = [
        { id: 'projects', label: 'Projects', icon: LayoutGrid },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'stats', label: 'Stats', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1B2431]">
            <Navbar />

            <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 py-8 md:px-6 md:py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <p className="text-[#6B7280] text-sm md:text-base mb-1 font-medium">{greeting}</p>
                        <h1 className="text-3xl md:text-4xl lg:text-[40px] font-serif font-bold text-[#1B2431] leading-tight">
                            {name}, Architect.
                        </h1>
                    </div>
                    <Link
                        href="/generate"
                        className="flex items-center gap-2 px-8 py-4 bg-[#D4A853] text-[#1B2431] font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.05)] hover:bg-[#1B2431] hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 w-full md:w-auto justify-center"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </Link>
                </div>

                {/* Tabs Bar */}
                <div className="flex border-b border-[#E8E0D0] mb-8 overflow-x-auto scroller-hide">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === item.id
                                    ? 'border-[#D4A853] text-[#1B2431] font-bold'
                                    : 'border-transparent text-[#6B7280]'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#D4A853]' : ''}`} />
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'projects' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {loadingProjects ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-[200px] bg-white border border-[#E8E0D0] rounded-[10px] animate-pulse" />
                                    ))}
                                </div>
                            ) : projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="bg-white border border-[#E8E0D0] p-6 rounded-[10px] shadow-sm hover:shadow-md transition-shadow relative group flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[#D4A853] text-[10px] font-black uppercase tracking-widest border border-[#D4A853]/20 px-2 py-1 bg-[#D4A853]/5">
                                                    {project.details.university}
                                                </span>
                                                <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">
                                                    {new Date(project.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-[#1B2431] line-clamp-2 mb-2 leading-tight">
                                                {project.details.projectTitle}
                                            </h3>
                                            <p className="text-xs text-[#6B7280] mb-4">
                                                {project.details.buildingType} • {project.details.location}
                                            </p>

                                            <div className="flex items-center gap-2 mb-6">
                                                <FileText className="w-3 h-3 text-[#9CA3AF]" />
                                                <span className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider">
                                                    {Object.keys(project.documents).length} documents
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#FAFAF8]">
                                                <button
                                                    onClick={() => handleViewProject(project)}
                                                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-[#E8E0D0]/30 text-[#1B2431] py-2.5 rounded-md hover:bg-[#D4A853] transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#6B7280] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#E8E0D0] bg-white rounded-[12px]">
                                    <Folders className="w-12 h-12 text-[#D4A853] mb-6 opacity-30" />
                                    <h3 className="text-lg font-serif font-bold text-[#1B2431] mb-2">No projects yet</h3>
                                    <p className="text-[#6B7280] text-sm mb-8 max-w-xs">Generate your first set of preliminaries to see them here.</p>
                                    <Link href="/generate" className="bg-[#D4A853] text-[#1B2431] px-8 py-3 font-black text-xs uppercase tracking-widest">
                                        Generate Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl mx-auto">
                            <div className="bg-white border border-[#E8E0D0] rounded-[12px] p-8 md:p-10">
                                <div className="flex flex-col items-center mb-10 pb-10 border-b border-[#FAFAF8]">
                                    <div className="w-[72px] h-[72px] bg-[#1B2431] rounded-full flex items-center justify-center text-[#D4A853] text-2xl font-black mb-4">
                                        {initials}
                                    </div>
                                    <h2 className="text-xl font-serif font-bold text-[#1B2431]">{fullName || name}</h2>
                                    <p className="text-[#6B7280] text-sm">{user.email}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm outline-none focus:border-[#D4A853] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Email Address</label>
                                            <input
                                                type="text"
                                                disabled
                                                value={user.email}
                                                className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm opacity-60 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">University</label>
                                            <select
                                                value={university}
                                                onChange={(e) => setUniversity(e.target.value)}
                                                className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm outline-none focus:border-[#D4A853] transition-colors"
                                            >
                                                <option value="">Select University</option>
                                                {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Year of Study</label>
                                            <select
                                                value={yearOfStudy}
                                                onChange={(e) => setYearOfStudy(e.target.value)}
                                                className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm outline-none focus:border-[#D4A853] transition-colors"
                                            >
                                                <option value="">Select Year</option>
                                                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Matric Number</label>
                                        <input
                                            type="text"
                                            value={matricNumber}
                                            onChange={(e) => setMatricNumber(e.target.value)}
                                            placeholder="e.g. ARC/2026/001"
                                            className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm outline-none focus:border-[#D4A853] transition-colors"
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={updatingProfile}
                                            className="w-full bg-[#D4A853] text-[#1B2431] py-4 rounded-md font-black text-xs uppercase tracking-widest hover:bg-[#1B2431] hover:text-white transition-all disabled:opacity-50"
                                        >
                                            {updatingProfile ? 'Saving...' : 'Save Profile'}
                                        </button>
                                        {message.text && (
                                            <p className={`text-center text-xs mt-4 font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                                {message.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                {[
                                    { label: 'Generations this semester', value: profile?.total_generations || 0, icon: Zap },
                                    { label: 'Documents generated', value: profile?.total_documents || 0, icon: FileText },
                                    { label: 'Projects saved', value: projects.length, icon: Folders },
                                    { label: 'Last active', value: profile?.last_active ? new Date(profile.last_active).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Never', icon: Clock },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white border border-[#E8E0D0] p-6 rounded-[10px] flex flex-col">
                                        <stat.icon className="w-5 h-5 text-[#D4A853] mb-4" />
                                        <span className="text-2xl md:text-3xl font-bold text-[#1B2431] mb-1">{stat.value}</span>
                                        <span className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wider leading-tight">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white border border-[#E8E0D0] rounded-[12px] overflow-hidden">
                                <div className="px-8 py-6 border-b border-[#E8E0D0]">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1B2431]">Recent Activity</h3>
                                </div>
                                <div className="divide-y divide-[#FAFAF8]">
                                    {projects.slice(0, 10).map((p, i) => (
                                        <div key={p.id} className="px-8 py-6 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-[#D4A853]" />
                                                <div>
                                                    <p className="text-sm font-bold text-[#1B2431]">{p.details.projectTitle}</p>
                                                    <p className="text-xs text-[#6B7280]">{p.details.buildingType} • {Object.keys(p.documents).length} documents</p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] text-[#9CA3AF] font-bold">
                                                {new Date(p.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    ))}
                                    {projects.length === 0 && (
                                        <div className="px-8 py-12 text-center text-[#6B7280] text-sm italic">
                                            No activity recorded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl mx-auto space-y-8">
                            {/* Generation Defaults */}
                            <div className="bg-white border border-[#E8E0D0] rounded-[12px] p-8">
                                <div className="mb-8">
                                    <h3 className="text-lg font-serif font-bold text-[#1B2431] mb-1">Generation Defaults</h3>
                                    <p className="text-xs text-[#6B7280]">These will be pre-selected every time you start a new project.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Default University</label>
                                        <select
                                            value={defaultUniversity}
                                            onChange={(e) => setDefaultUniversity(e.target.value)}
                                            className="w-full bg-[#FAFAF8] border border-[#E8E0D0] px-4 py-3 rounded-md text-sm outline-none focus:border-[#D4A853] transition-colors"
                                        >
                                            <option value="">Select University</option>
                                            {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Preferred Download Format</label>
                                        <div className="flex gap-4">
                                            {['pdf', 'word'].map(format => (
                                                <button
                                                    key={format}
                                                    onClick={() => setPreferredFormat(format)}
                                                    className={`px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-widest border transition-all ${preferredFormat === format
                                                            ? 'bg-[#1B2431] text-white border-[#1B2431]'
                                                            : 'bg-white text-[#6B7280] border-[#E8E0D0]'
                                                        }`}
                                                >
                                                    {format}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={savingSettings}
                                        className="bg-[#D4A853] text-[#1B2431] px-8 py-3 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-[#1B2431] hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {savingSettings ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </div>

                            {/* Account Section */}
                            <div className="bg-white border border-[#E8E0D0] rounded-[12px] p-8">
                                <h3 className="text-lg font-serif font-bold text-[#1B2431] mb-6">Account</h3>
                                <button
                                    onClick={() => {
                                        signOut()
                                        router.push('/')
                                    }}
                                    className="px-6 py-3 border-2 border-red-100 text-[#DC2626] font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all rounded-md"
                                >
                                    Sign Out
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white border-2 border-red-50 rounded-[12px] p-8 opacity-60">
                                <h3 className="text-lg font-serif font-bold text-red-700 mb-2">Danger Zone</h3>
                                <p className="text-xs text-[#6B7280] mb-6">Permanently delete your account and all projects.</p>
                                <button
                                    onClick={() => alert('Account deletion will be implemented soon.')}
                                    className="px-6 py-3 border-2 border-red-600 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all rounded-md"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
