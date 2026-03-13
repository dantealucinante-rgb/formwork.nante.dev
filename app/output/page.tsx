'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DOC_LABELS: Record<string, string> = {
    introduction: 'Introduction',
    designBrief: 'Design Brief',
    briefDevelopment: 'Brief Dev',
    siteAnalysis: 'Site Analysis',
    sitePlanning: 'Site Planning',
    caseStudies: 'Case Studies',
    spatialAnalysis: 'Spatial Analysis',
    scheduleOfAccommodation: 'Schedule of Accommodation'
}

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
                    width: isMobile ? '100%' : 'auto'
                }}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
