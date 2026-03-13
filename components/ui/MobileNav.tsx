'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function MobileNav() {
    const pathname = usePathname()
    const router = useRouter()

    const tabs = [
        {
            label: 'Home',
            path: '/',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24"
                    fill={active ? '#D4A853' : 'none'}
                    stroke={active ? '#D4A853' : '#6B7280'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            label: 'Generate',
            path: '/generate',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? '#D4A853' : '#6B7280'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            )
        },
        {
            label: 'Projects',
            path: '/dashboard',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? '#D4A853' : '#6B7280'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            )
        },
        {
            label: 'Account',
            path: '/auth/signin',
            icon: (active: boolean) => (
                <svg width="24" height="24" viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? '#D4A853' : '#6B7280'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        }
    ]

    return (
        <nav style={{
            display: 'none',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#FAFAF8',
            borderTop: '1px solid #E8E0D0',
            zIndex: 1000,
            paddingTop: '8px',
            paddingBottom: 'env(safe-area-inset-bottom, 16px)'
        }}
            className="mobile-nav"
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                {tabs.map(tab => {
                    const active = pathname === tab.path
                    return (
                        <button
                            key={tab.path}
                            onClick={() => router.push(tab.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px 16px',
                                minWidth: '60px'
                            }}
                        >
                            {tab.icon(active)}
                            <span style={{
                                fontSize: '11px',
                                color: active ? '#D4A853' : '#6B7280',
                                fontFamily: 'var(--font-sans)',
                                fontWeight: active ? 600 : 400,
                                letterSpacing: '0.02em'
                            }}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
