'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    generateSheet,
    getSessionFontIndex,
    DOC_LABELS,
    SHEET_NUMBERS,
    downloadSheet
} from '@/lib/generate-sheet'
import {
    generateSiteAnalysisSheet,
    downloadSiteAnalysisSVG
} from '@/lib/sheets/site-analysis-sheet'
import { fetchIllustrationAsBase64 } from '@/lib/sheets/illustration'
import { useAuth } from '@/lib/auth-context'

export default function OutputPage() {
    const router = useRouter()
    const [documents, setDocuments] = useState<Record<string, string>>({})
    const [details, setDetails] = useState<Record<string, string>>({})
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [editedContent, setEditedContent] = useState('')
    const [dismissed, setDismissed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [fontIndex, setFontIndex] = useState(0)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [illustrations, setIllustrations] = useState<Record<string, string>>({})
    const [fetchingIllustration, setFetchingIllustration] = useState(false)
    const [illustrationWarning, setIllustrationWarning] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const sessionId =
            sessionStorage.getItem('formwork_session_id') ||
            Math.random().toString(36).substring(2)
        sessionStorage.setItem(
            'formwork_session_id', sessionId
        )
        setFontIndex(getSessionFontIndex(sessionId))
    }, [])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const stored = sessionStorage.getItem('formwork_output')
        if (!stored) {
            router.push('/generate')
            return
        }

        const parsed = JSON.parse(stored)
        setDocuments(parsed.documents || {})
        setDetails(parsed.details || {})
        setSelectedDocuments(parsed.selectedDocuments || [])

        const firstDoc = Object.keys(parsed.documents || {})[0]
        if (firstDoc) {
            setActiveTab(firstDoc)
            setEditedContent(parsed.documents[firstDoc])
        }
    }, [])

    const handleTabChange = (docType: string) => {
        if (editMode) {
            setDocuments(prev => ({ ...prev, [activeTab]: editedContent }))
            setEditMode(false)
        }
        setActiveTab(docType)
        setEditedContent(documents[docType] || '')
    }

    const handleEdit = () => {
        setEditMode(true)
        setEditedContent(documents[activeTab] || '')
    }

    const handleSaveEdit = () => {
        setDocuments(prev => ({ ...prev, [activeTab]: editedContent }))
        setEditMode(false)
    }

    const handleRegenerate = async () => {
        const stored = sessionStorage.getItem('formwork_output')
        if (!stored) return

        const parsed = JSON.parse(stored)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    details: parsed.details,
                    selectedDocuments: [activeTab]
                })
            })

            const data = await response.json()
            if (data.success && data.documents[activeTab]) {
                setDocuments(prev => ({
                    ...prev,
                    [activeTab]: data.documents[activeTab]
                }))
                setEditedContent(data.documents[activeTab])
            }
        } catch (error) {
            console.error('Regeneration failed:', error)
        }
    }

    const handleDownload = async (format: 'pdf' | 'word') => {
        if (!user) {
            setShowAuthModal(true)
            return
        }
        try {
            const stored = sessionStorage.getItem('formwork_output')
            if (!stored) return

            const parsed = JSON.parse(stored)

            const response = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documents: parsed.documents,
                    details: parsed.details,
                    selectedDocuments: parsed.selectedDocuments,
                    format
                })
            })

            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = format === 'pdf'
                ? 'formwork-preliminaries.pdf'
                : 'formwork-preliminaries.docx'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    const handlePrintSheet = async (docType: string) => {
        if (!user) {
            setShowAuthModal(true)
            return
        }
        const stored = sessionStorage.getItem('formwork_output')
        if (!stored) return
        const parsed = JSON.parse(stored)

        const illustrationDocs = [
            'introduction',
            'designBrief',
            'briefDevelopment'
        ]

        let illustrationBase64 = ''

        if (illustrationDocs.includes(docType)) {
            // Check if already fetched
            if (illustrations[docType]) {
                illustrationBase64 = illustrations[docType]
            } else {
                setFetchingIllustration(true)
                setIllustrationWarning('')

                // 35s timeout fallback
                const timeoutPromise = new Promise<string>((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), 35000)
                )

                try {
                    illustrationBase64 = await Promise.race([
                        fetchIllustrationAsBase64(docType, parsed.details),
                        timeoutPromise
                    ])
                } catch (err) {
                    console.error('Illustration handle error:', err)
                    if (err instanceof Error && err.message === 'timeout') {
                        setIllustrationWarning('Illustration timed out — downloading sheet without illustration')
                    } else {
                        setIllustrationWarning('Illustration unavailable — downloading sheet without image')
                    }
                    setTimeout(() => setIllustrationWarning(''), 5000)
                    illustrationBase64 = ''
                }

                setIllustrations(prev => ({
                    ...prev,
                    [docType]: illustrationBase64
                }))
                setFetchingIllustration(false)
            }
        }

        console.log('illustrationBase64 length before generateSheet:', illustrationBase64.length)

        const pdf = generateSheet({
            docType,
            docLabel: DOC_LABELS[docType],
            content: documents[docType] || '',
            details: parsed.details,
            sheetNumber: SHEET_NUMBERS[docType],
            fontIndex,
            illustrationBase64
        })

        downloadSheet(pdf, DOC_LABELS[docType])
    }

    const currentContent = editMode
        ? editedContent
        : (documents[activeTab] || '')

    const wordCount = currentContent
        .split(/\s+/)
        .filter(Boolean).length

    return (
        <div style={{
            background: '#FAFAF8',
            minHeight: '100vh',
            fontFamily: 'DM Sans, sans-serif'
        }}>

            {/* Save Banner */}
            {!dismissed && (
                <div style={{
                    background: '#D4A853',
                    color: '#1B2431',
                    padding: isMobile ? '8px 16px' : '10px 24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: isMobile ? '12px' : '14px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <span style={{ flex: 1, lineHeight: isMobile ? '1.4' : 'normal' }}>
                        Want to save this project?
                        <a href="/auth/signup" style={{
                            fontWeight: 600,
                            marginLeft: '6px',
                            textDecoration: 'underline'
                        }}>
                            Create a free account →
                        </a>
                    </span>
                    <button
                        onClick={() => setDismissed(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: isMobile ? '8px' : '16px',
                            fontSize: '18px',
                            color: '#1B2431',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Top Bar */}
            <div style={{
                background: '#FAFAF8',
                borderBottom: '1px solid #E8E0D0',
                padding: isMobile ? '12px 16px' : '16px 40px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? '12px' : '0'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '8px' : '24px'
                }}>
                    <button
                        onClick={() => router.push('/generate')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6B7280',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: 0
                        }}
                    >
                        ← New Brief
                    </button>
                    <h1 style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: 600,
                        color: '#1B2431',
                        fontFamily: 'Playfair Display, serif',
                        margin: 0,
                        maxWidth: isMobile ? '100%' : 'none',
                        overflow: isMobile ? 'hidden' : 'visible',
                        textOverflow: isMobile ? 'ellipsis' : 'clip',
                        whiteSpace: isMobile ? 'nowrap' : 'normal'
                    }}>
                        {details.projectTitle || 'Your Project'}
                    </h1>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    width: isMobile ? '100%' : 'auto',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={async () => {
                            if (!user) {
                                setShowAuthModal(true)
                                return
                            }
                            const stored = sessionStorage.getItem('formwork_output')
                            if (!stored) return
                            const parsed = JSON.parse(stored)

                            for (let i = 0; i < parsed.selectedDocuments.length; i++) {
                                const docType = parsed.selectedDocuments[i]
                                await handlePrintSheet(docType)
                            }
                        }}
                        disabled={fetchingIllustration}
                        style={{
                            background: fetchingIllustration ? '#9CA3AF' : '#D4A853',
                            color: '#1B2431',
                            fontWeight: 600,
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: fetchingIllustration ? 'not-allowed' : 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '14px'
                        }}
                    >
                        {fetchingIllustration ? 'Generating illustration...' : 'Print All Sheets'}
                    </button>
                    <button
                        onClick={() => handleDownload('pdf')}
                        style={{
                            flex: isMobile ? 1 : 'none',
                            padding: isMobile ? '10px 8px' : '10px 20px',
                            background: '#1B2431',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: isMobile ? '13px' : '14px'
                        }}>
                        {isMobile ? 'PDF' : 'Download PDF'}
                    </button>
                    <button
                        onClick={() => handleDownload('word')}
                        style={{
                            flex: isMobile ? 1 : 'none',
                            padding: isMobile ? '10px 8px' : '10px 20px',
                            background: 'white',
                            color: '#1B2431',
                            border: '1px solid #1B2431',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: isMobile ? '13px' : '14px'
                        }}>
                        {isMobile ? 'Word' : 'Download Word'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                borderBottom: '1px solid #E8E0D0',
                padding: isMobile ? '0 16px' : '0 40px',
                display: 'flex',
                gap: '0',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                background: '#FAFAF8',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}>
                {selectedDocuments.map(docType => (
                    <button
                        key={docType}
                        onClick={() => handleTabChange(docType)}
                        style={{
                            padding: isMobile ? '12px 10px' : '16px 20px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === docType
                                ? '2px solid #D4A853'
                                : '2px solid transparent',
                            cursor: 'pointer',
                            fontSize: isMobile ? '11px' : '13px',
                            fontWeight: activeTab === docType ? 600 : 400,
                            color: activeTab === docType ? '#1B2431' : '#6B7280',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                    >
                        {DOC_LABELS[docType] || docType}
                    </button>
                ))}
            </div>

            {/* Document Content */}
            <div style={{
                maxWidth: '860px',
                margin: isMobile ? '20px auto' : '40px auto',
                padding: isMobile ? '0 16px' : '0 24px'
            }}>
                <div style={{
                    background: 'white',
                    border: '1px solid #E8E0D0',
                    borderRadius: isMobile ? '8px' : '12px',
                    padding: isMobile ? '24px 16px' : '48px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
                }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: isMobile ? '22px' : '28px',
                        fontWeight: 400,
                        color: '#1B2431',
                        marginBottom: isMobile ? '20px' : '32px'
                    }}>
                        {DOC_LABELS[activeTab]}
                    </h2>

                    {editMode ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: isMobile ? '300px' : '400px',
                                border: '1px solid #D4A853',
                                borderRadius: '6px',
                                padding: '16px',
                                fontSize: isMobile ? '14px' : '15px',
                                lineHeight: '1.8',
                                fontFamily: 'DM Sans, sans-serif',
                                color: '#1B2431',
                                resize: 'vertical',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    ) : (
                        <div style={{
                            fontSize: isMobile ? '14px' : '15px',
                            lineHeight: isMobile ? '1.8' : '1.9',
                            color: '#2D3748',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {currentContent}
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '32px',
                        paddingTop: '20px',
                        borderTop: '1px solid #E8E0D0'
                    }}>
                        <span style={{
                            fontSize: '13px',
                            color: '#9CA3AF'
                        }}>
                            {wordCount} words
                        </span>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {editMode ? (
                                <button
                                    onClick={handleSaveEdit}
                                    style={{
                                        padding: '8px 20px',
                                        background: '#1B2431',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px'
                                    }}
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    style={{
                                        padding: '8px 20px',
                                        background: 'white',
                                        color: '#1B2431',
                                        border: '1px solid #E8E0D0',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px'
                                    }}
                                >
                                    Edit
                                </button>
                            )}

                            <button
                                onClick={handleRegenerate}
                                style={{
                                    padding: '8px 20px',
                                    background: 'white',
                                    color: '#1B2431',
                                    border: '1px solid #E8E0D0',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                ↻ Regenerate
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <button
                                    onClick={() => handlePrintSheet(activeTab)}
                                    disabled={fetchingIllustration}
                                    style={{
                                        padding: '8px 16px',
                                        background: fetchingIllustration
                                            ? '#9CA3AF'
                                            : '#1B2431',
                                        color: '#FAFAF8',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        cursor: fetchingIllustration
                                            ? 'not-allowed'
                                            : 'pointer',
                                        fontFamily: 'DM Sans, sans-serif',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {fetchingIllustration
                                        ? 'Generating illustration...'
                                        : '🖨 Print Sheet'}
                                </button>
                                {fetchingIllustration && (
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#6B7280',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span>Generating illustration — this may take up to 30 seconds...</span>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        </div>
                                    </div>
                                )}
                                {illustrationWarning && (
                                    <span style={{
                                        fontSize: '10px',
                                        color: '#D97706',
                                        textAlign: 'center',
                                        fontWeight: 500
                                    }}>
                                        {illustrationWarning}
                                    </span>
                                )}
                            </div>

                            {activeTab === 'siteAnalysis' && (
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            setShowAuthModal(true)
                                            return
                                        }
                                        const stored = sessionStorage.getItem(
                                            'formwork_output'
                                        )
                                        if (!stored) return
                                        const parsed = JSON.parse(stored)
                                        const svg = generateSiteAnalysisSheet(
                                            parsed.documents.siteAnalysis || '',
                                            parsed.details
                                        )
                                        downloadSiteAnalysisSVG(
                                            svg,
                                            parsed.details.projectTitle || 'project'
                                        )
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#D4A853',
                                        color: '#1B2431',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif'
                                    }}
                                >
                                    📐 Download Graphic Sheet
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Authentication Modal */}
            {showAuthModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    background: 'rgba(27, 36, 49, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    <div style={{
                        background: '#1B2431',
                        color: '#FAFAF8',
                        width: '100%',
                        maxWidth: '400px',
                        padding: '32px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowAuthModal(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'none',
                                border: 'none',
                                color: '#FAFAF8',
                                fontSize: '24px',
                                cursor: 'pointer',
                                opacity: 0.6
                            }}
                        >
                            ×
                        </button>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            marginBottom: '12px',
                            color: '#FAFAF8'
                        }}>
                            Sign in to download your documents
                        </h2>
                        <p style={{
                            fontSize: '15px',
                            color: '#e2e8f0',
                            marginBottom: '32px',
                            lineHeight: '1.6'
                        }}>
                            Create a free account to export your work as PDF or Word.
                        </p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <button
                                onClick={() => router.push('/auth/signup')}
                                style={{
                                    padding: '12px',
                                    background: '#D4A853',
                                    color: '#1B2431',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Create Account
                            </button>
                            <button
                                onClick={() => router.push('/auth/signin')}
                                style={{
                                    padding: '12px',
                                    background: 'transparent',
                                    color: '#D4A853',
                                    border: '2px solid #D4A853',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
