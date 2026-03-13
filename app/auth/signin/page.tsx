'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleEmailSignIn = async () => {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#FAFAF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#1B2431',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px'
                    }}>
                        <span style={{
                            color: '#D4A853',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            fontFamily: 'Playfair Display, serif'
                        }}>F</span>
                    </div>
                    <h1 style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#1B2431',
                        fontFamily: 'Playfair Display, serif',
                        margin: '0 0 4px'
                    }}>Welcome back</h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        fontFamily: 'DM Sans, sans-serif',
                        margin: 0
                    }}>Sign in to your Formwork account</p>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleSignIn}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E8E0D0',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#1B2431',
                        marginBottom: '20px'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <div style={{ flex: 1, height: '1px', background: '#E8E0D0' }} />
                    <span style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: '#E8E0D0' }} />
                </div>

                {/* Email + Password */}
                {error && (
                    <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#DC2626',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>{error}</div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#1B2431',
                        marginBottom: '6px',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{
                            width: '100%',
                            padding: '11px 14px',
                            border: '1px solid #E8E0D0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'DM Sans, sans-serif',
                            background: '#FFFFFF',
                            color: '#1B2431',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#1B2431',
                        marginBottom: '6px',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                            width: '100%',
                            padding: '11px 14px',
                            border: '1px solid #E8E0D0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'DM Sans, sans-serif',
                            background: '#FFFFFF',
                            color: '#1B2431',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    onClick={handleEmailSignIn}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '13px',
                        background: loading ? '#9CA3AF' : '#1B2431',
                        color: '#FAFAF8',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '20px',
                        letterSpacing: '0.02em'
                    }}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#6B7280',
                    fontFamily: 'DM Sans, sans-serif',
                    margin: 0
                }}>
                    Don't have an account?{' '}
                    <Link href="/auth/signup" style={{
                        color: '#D4A853',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    )
}
