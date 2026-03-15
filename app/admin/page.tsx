'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import {
    Users,
    Zap,
    UserPlus,
    TrendingUp,
    LogOut,
    Lock,
    LayoutDashboard,
    PieChart,
    Calendar,
    ArrowUpRight,
    Search
} from 'lucide-react'

export default function AdminAnalyticsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<any>({})
    const [charts, setCharts] = useState<any>({})
    const [recentUsers, setRecentUsers] = useState<any[]>([])
    const [recentProjects, setRecentProjects] = useState<any[]>([])

    useEffect(() => {
        const auth = sessionStorage.getItem('formwork_admin_auth')
        if (auth === 'true') {
            setIsAuthenticated(true)
            fetchData()
        }
        setIsLoading(false)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            sessionStorage.setItem('formwork_admin_auth', 'true')
            setIsAuthenticated(true)
            fetchData()
        } else {
            setAuthError(true)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('formwork_admin_auth')
        setIsAuthenticated(false)
    }

    const fetchData = async () => {
        setIsLoading(true)
        const today = new Date().toISOString().split('T')[0]

        // 1. Stat Cards
        const [
            { count: totalUsers },
            { count: totalGenerations },
            { count: todaySignups },
            { count: todayGenerations }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today),
            supabase.from('projects').select('*', { count: 'exact', head: true }).gte('created_at', today)
        ])

        setStats({ totalUsers, totalGenerations, todaySignups, todayGenerations })

        // 2. Charts
        const [
            { data: dailySignups },
            { data: dailyGenerations },
            { data: buildingStats },
            { data: documentStats }
        ] = await Promise.all([
            // @ts-ignore
            supabase.from('daily_signups').select('*').limit(14),
            // @ts-ignore
            supabase.from('daily_generations').select('*').limit(14),
            // @ts-ignore
            supabase.from('building_type_stats').select('*').limit(8),
            // @ts-ignore
            supabase.from('document_type_stats').select('*').limit(8)
        ])

        // Reverse for chronological order if needed
        const formattedSignups = dailySignups?.map((d: any) => ({
            day: new Date(d.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            count: d.signups
        })).reverse()

        const formattedGenerations = dailyGenerations?.map((d: any) => ({
            day: new Date(d.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            count: d.generations
        })).reverse()

        setCharts({
            signups: formattedSignups,
            generations: formattedGenerations,
            buildings: buildingStats,
            documents: documentStats
        })

        // 3. Tables
        const [
            { data: users },
            { data: projects }
        ] = await Promise.all([
            supabase.from('profiles').select('full_name, email, university, total_generations, created_at').order('created_at', { ascending: false }).limit(10),
            supabase.from('projects').select('details, university, created_at').order('created_at', { ascending: false }).limit(10)
        ])

        setRecentUsers(users || [])
        setRecentProjects(projects || [])
        setIsLoading(false)
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F1117] p-4 font-sans">
                <div className="w-full max-w-md bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-[#D4A853] text-[#1B2431] rounded-xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                        F
                    </div>
                    <h1 className="text-2xl font-bold text-[#FAFAF8] mb-2">Admin Access</h1>
                    <p className="text-[#9CA3AF] text-sm mb-8">Please enter the security password to view analytics.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Security Password"
                                className="w-full bg-[#0F1117] border border-[#2A2D3A] text-[#FAFAF8] pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-[#D4A853] transition-all placeholder:text-[#4A4D5A]"
                            />
                        </div>
                        {authError && <p className="text-red-400 text-xs font-bold">Incorrect password</p>}
                        <button
                            type="submit"
                            className="w-full bg-[#D4A853] text-[#1B2431] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all shadow-lg active:scale-[0.98]"
                        >
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const COLORS = ['#D4A853', '#60A5FA', '#34D399', '#F87171', '#A78BFA', '#FBBF24', '#2DD4BF', '#E879F9']

    return (
        <div className="min-h-screen bg-[#0F1117] text-[#FAFAF8] font-sans pb-20">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#2A2D3A]">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4A853] text-[#1B2431] rounded-lg flex items-center justify-center font-black text-sm">F</div>
                        <span className="font-black uppercase tracking-[0.2em] text-[#D4A853] text-sm">Formwork Admin</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-[#6B7280] font-bold uppercase tracking-widest hidden md:block">
                            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#F87171] hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 pt-10">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'amber' },
                        { label: 'Total Projects', value: stats.totalGenerations || 0, icon: Zap, color: 'blue' },
                        { label: "Today's Signups", value: stats.todaySignups || 0, icon: UserPlus, color: 'emerald' },
                        { label: "Today's Gens", value: stats.todayGenerations || 0, icon: TrendingUp, color: 'rose' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#1A1D27] border border-[#2A2D3A] p-7 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <stat.icon className="w-20 h-20" />
                            </div>
                            <span className="text-xs text-[#9CA3AF] font-black uppercase tracking-widest mb-4 block">{stat.label}</span>
                            <span className="text-4xl font-bold text-[#D4A853]">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Daily Signups */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest">Daily Signups</h3>
                            <div className="w-2 h-2 rounded-full bg-[#D4A853] animate-pulse" />
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={charts.signups}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        stroke="#4A4D5A"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#4A4D5A"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#1A1D27', border: '1px solid #2A2D3A', borderRadius: '8px' }}
                                        labelStyle={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#D4A853"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#D4A853', strokeWidth: 2, stroke: '#1A1D27' }}
                                        activeDot={{ r: 6, fill: '#FAFAF8' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Generations */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest">Daily Generations</h3>
                            <div className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={charts.generations}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
                                    <XAxis dataKey="day" stroke="#4A4D5A" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#4A4D5A" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid #2A2D3A', borderRadius: '8px' }} labelStyle={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 'bold' }} />
                                    <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, fill: '#60A5FA', strokeWidth: 2, stroke: '#1A1D27' }} activeDot={{ r: 6, fill: '#FAFAF8' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Building Types */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest">Top Building Types</h3>
                            <PieChart className="w-4 h-4 text-[#D4A853]" />
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.buildings} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" horizontal={false} />
                                    <XAxis type="number" stroke="#4A4D5A" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="building_type" type="category" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} width={120} />
                                    <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid #2A2D3A', borderRadius: '8px' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {charts.buildings?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Document Stats */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest">Most Generated Docs</h3>
                            <TrendingUp className="w-4 h-4 text-[#34D399]" />
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.documents}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
                                    <XAxis dataKey="document_type" stroke="#4A4D5A" fontSize={9} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                                    <YAxis stroke="#4A4D5A" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid #2A2D3A', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="#34D399" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-[#2A2D3A] flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest">Recent Users</h3>
                            <Link href="/admin/users" className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:text-[#D4A853]">View All</Link>
                        </div>
                        <div className="overflow-x-auto scroller-hide">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#2A2D3A]/30">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A]">Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A]">School</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A] text-center">Gens</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A] text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2A2D3A]">
                                    {recentUsers.map((u, i) => (
                                        <tr key={i} className="hover:bg-[#FAFAF8]/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#FAFAF8]">{u.full_name || 'Anonymous'}</span>
                                                    <span className="text-xs text-[#6B7280]">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#9CA3AF] text-xs font-medium">{u.university || '—'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-[#D4A853]/10 text-[#D4A853] text-[10px] font-black rounded border border-[#D4A853]/20">
                                                    {u.total_generations}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs text-[#6B7280] font-bold">
                                                {new Date(u.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Generations */}
                    <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-[#2A2D3A] flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest">Recent Generations</h3>
                        </div>
                        <div className="overflow-x-auto scroller-hide">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#2A2D3A]/30">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A]">Project</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A]">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] border-b border-[#2A2D3A] text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2A2D3A]">
                                    {recentProjects.map((p, i) => (
                                        <tr key={i} className="hover:bg-[#FAFAF8]/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#FAFAF8] line-clamp-1">{p.details?.projectTitle}</span>
                                                    <span className="text-xs text-[#6B7280]">{p.university}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#60A5FA]">
                                                    {p.details?.buildingType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs text-[#6B7280] font-bold">
                                                {new Date(p.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
