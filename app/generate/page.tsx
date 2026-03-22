'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { Upload, ArrowRight, CheckCircle2, Loader2, FileText, Type } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'


const DOCUMENT_OPTIONS = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'designBrief', label: 'Design Brief Write-up' },
    { id: 'briefDevelopment', label: 'Brief Development' },
    { id: 'siteAnalysis', label: 'Site Analysis' },
    { id: 'sitePlanning', label: 'Site Planning' },
    { id: 'caseStudies', label: 'Case Studies' },
    { id: 'spatialAnalysis', label: 'Spatial Analysis' },
    { id: 'scheduleOfAccommodation', label: 'Schedule of Accommodation' }
];

export default function GeneratePage() {
    const router = useRouter()

    // UI State
    const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf')
    const [file, setFile] = useState<File | null>(null)
    const [briefText, setBriefText] = useState('')

    // Initialize input mode based on screen width
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setInputMode('text')
        }
    }, [])

    // Process State
    const [isExtracting, setIsExtracting] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Reading your brief...')

    const isInputDisabled = isExtracting || isGenerating;

    // Data State
    const [error, setError] = useState<string | null>(null)
    const [details, setDetails] = useState({
        projectTitle: '',
        buildingType: '',
        location: '',
        capacity: '',
        users: '',
        specialRequirements: '',
        academicLevel: '200 Level',
        university: 'FUTA',
        studentName: '',
        matricNumber: '',
        extraContext: '',
        rawText: ''
    })

    const { profile } = useAuth()

    // Pre-fill student details from profile
    useEffect(() => {
        if (profile) {
            setDetails(prev => ({
                ...prev,
                studentName: prev.studentName || profile.full_name || '',
                matricNumber: prev.matricNumber || profile.matric_number || ''
            }))
        }
    }, [profile])


    const [selectedDocuments, setSelectedDocuments] = useState(DOCUMENT_OPTIONS.map(d => d.id))

    // Handlers
    const handleFileUpload = async (uploadedFile: File) => {
        setFile(uploadedFile)
        setIsExtracting(true)

        try {
            const formData = new FormData()
            formData.append('file', uploadedFile)

            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setDetails(prev => ({
                    ...prev,
                    ...data.extracted,
                    rawText: data.rawText
                }))
            }
        } catch (error) {
            console.error('Extraction failed:', error)
        } finally {
            setIsExtracting(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === 'application/pdf') {
            handleFileUpload(droppedFile)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleBriefTextChange = (text: string) => {
        setBriefText(text)
        setDetails(prev => ({ ...prev, rawText: text }))
    }

    const toggleDocument = (docType: string) => {
        setSelectedDocuments(prev =>
            prev.includes(docType)
                ? prev.filter(d => d !== docType)
                : [...prev, docType]
        )
    }

    useEffect(() => {
        if (!isGenerating) return;

        const messages = [
            "Reading your brief...",
            "Generating Introduction...",
            "Writing Site Analysis...",
            "Researching Case Studies...",
            "Building your documents..."
        ];
        let i = 0;

        const interval = setInterval(() => {
            i = (i + 1) % messages.length;
            setLoadingMessage(messages[i]);
        }, 3000);

        return () => clearInterval(interval);
    }, [isGenerating]);

    const handleGenerate = async () => {
        if (selectedDocuments.length === 0) return
        if (inputMode === 'pdf' && !file && !details.rawText) return
        if (inputMode === 'text' && !briefText) return

        setIsGenerating(true)
        setError(null)

        try {
            // If in text mode, ensure rawText is set from briefText
            const finalDetails = { ...details }
            if (inputMode === 'text') {
                finalDetails.rawText = briefText
                // For direct text input, we also use it as extra context to guide the prompt better
                finalDetails.extraContext = briefText
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    details: finalDetails,
                    selectedDocuments,
                    mode: inputMode
                })
            })

            if (response.status === 400) {
                const errorData = await response.json()
                if (errorData.error === 'invalid_project') {
                    setError("This doesn't look like an architectural project brief. Formwork is built for architecture students — upload a design brief for a building like a clinic, library, school, market, or any other structure.")
                    setIsGenerating(false)
                    return
                }
            }

            const data = await response.json()

            if (data.success) {
                sessionStorage.setItem(
                    'formwork_output',
                    JSON.stringify({
                        documents: data.documents,
                        details: details,
                        selectedDocuments: selectedDocuments
                    })
                )
                router.push('/output')
            }
        } catch (error) {
            console.error('Generation failed:', error)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1B2431]">
            <Navbar />

            <main className="flex-1 max-w-[1200px] w-full mx-auto px-[24px] lg:px-[80px] pt-[80px] pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-[60px] items-start">

                    {/* Left Column - Input Form */}
                    <div className="space-y-[40px]">
                        {/* Page Header */}
                        <div>
                            <h1 className="text-[40px] font-serif font-bold text-[#1B2431] mb-2 leading-tight">Start with your brief</h1>
                            <p className="text-[16px] font-sans text-[#4A5568]">
                                Upload your project brief or paste it below. Formwork will handle the rest.
                            </p>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="bg-[#FEF2F2] border border-[#FECACA] p-[16px] rounded-[8px] transition-all animate-in fade-in slide-in-from-top-4 font-sans">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 text-[#DC2626] mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[14px] text-[#DC2626] leading-relaxed font-medium">
                                            {error}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="ml-auto text-[#DC2626]/50 hover:text-[#DC2626] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Mode Toggle */}
                        <div className="flex w-full rounded-[10px] bg-white border border-[#E8E0D0] p-1 gap-1">
                            <button
                                onClick={() => setInputMode('pdf')}
                                disabled={isInputDisabled}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[8px] font-sans font-bold text-[14px] transition-all ${inputMode === 'pdf'
                                    ? 'bg-[#1B2431] text-white border-b-2 border-[#D4A853] shadow-md'
                                    : 'text-[#6B7280] hover:bg-slate-50'
                                    }`}
                            >
                                <FileText className={`w-4 h-4 ${inputMode === 'pdf' ? 'text-[#D4A853]' : ''}`} />
                                Upload PDF
                            </button>
                            <button
                                onClick={() => setInputMode('text')}
                                disabled={isInputDisabled}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[8px] font-sans font-bold text-[14px] transition-all ${inputMode === 'text'
                                    ? 'bg-[#1B2431] text-white border-b-2 border-[#D4A853] shadow-md'
                                    : 'text-[#6B7280] hover:bg-slate-50'
                                    }`}
                            >
                                <Type className={`w-4 h-4 ${inputMode === 'text' ? 'text-[#D4A853]' : ''}`} />
                                Paste Text
                            </button>
                        </div>

                        {/* Section 1: Input Area */}
                        <section className="space-y-4">
                            {inputMode === 'pdf' ? (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className={`border-2 border-dashed ${file ? 'border-green-500' : 'border-[#D4A853]'} rounded-[12px] bg-white px-[40px] py-[60px] flex flex-col items-center justify-center text-center ${isInputDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    {isExtracting ? (
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="w-10 h-10 text-[#D4A853] mb-4 animate-spin" />
                                            <h3 className="font-bold text-lg mb-2 text-[#1B2431]">Reading your brief...</h3>
                                        </div>
                                    ) : file ? (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
                                            <h3 className="font-bold text-lg mb-2 text-[#1B2431]">{file.name}</h3>
                                            <p className="text-green-600 font-medium text-sm mb-6">Brief read successfully</p>
                                            <button
                                                onClick={() => {
                                                    setFile(null);
                                                    setDetails(prev => ({ ...prev, rawText: '' }));
                                                }}
                                                className="text-[#D4A853] text-[14px] font-medium hover:underline"
                                            >
                                                Change file
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-[#D4A853] mb-4" />
                                            <h3 className="font-bold text-lg mb-2 text-[#1B2431]">Drop your PDF brief here</h3>
                                            <p className="text-[#6B7280] text-sm mb-6">PDF or Word documents up to 10MB</p>
                                            <label className="px-6 py-3 bg-[#1B2431] text-white text-sm font-bold rounded hover:bg-[#D4A853] hover:text-[#1B2431] transition-colors cursor-pointer">
                                                Browse Files
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="application/pdf"
                                                    onChange={(e) => {
                                                        const selected = e.target.files?.[0];
                                                        if (selected) handleFileUpload(selected);
                                                    }}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3 font-sans">
                                    <div className={`border border-[#E8E0D0] bg-white rounded-[8px] overflow-hidden focus-within:border-[#D4A853] shadow-sm transition-all ${isInputDisabled ? 'opacity-50 pointer-events-none text-slate-400 select-none cursor-not-allowed' : ''}`}>
                                        <textarea
                                            className="w-full min-h-[280px] p-[16px] focus:outline-none resize-y bg-transparent text-[14px] leading-relaxed"
                                            placeholder="Paste your project brief here — copy it from your assignment sheet, WhatsApp, Google Docs, or anywhere else."
                                            value={briefText}
                                            onChange={(e) => handleBriefTextChange(e.target.value)}
                                            disabled={isInputDisabled}
                                        />
                                    </div>
                                    <p className="text-[12px] text-[#9CA3AF] font-medium leading-tight px-1">
                                        Tip: Include as much detail as possible — building type, location, users, capacity and any special requirements.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Section 2: Project Details */}
                        <section className={isInputDisabled ? 'opacity-50 pointer-events-none' : ''}>
                            <h2 className="text-[24px] font-serif font-bold mb-6 text-[#1B2431]">Project Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Building Type</label>
                                    <input
                                        type="text"
                                        value={details.buildingType}
                                        onChange={(e) => setDetails(prev => ({ ...prev, buildingType: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors"
                                        placeholder="e.g. Cultural Center"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Project Title</label>
                                    <input
                                        type="text"
                                        value={details.projectTitle}
                                        onChange={(e) => setDetails(prev => ({ ...prev, projectTitle: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors"
                                        placeholder="e.g. Center for African Arts"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Location</label>
                                    <input
                                        type="text"
                                        value={details.location}
                                        onChange={(e) => setDetails(prev => ({ ...prev, location: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors"
                                        placeholder="e.g. Lagos, Nigeria"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Number of Users / Capacity</label>
                                    <input
                                        type="text"
                                        value={details.capacity}
                                        onChange={(e) => setDetails(prev => ({ ...prev, capacity: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors"
                                        placeholder="e.g. 500 Visitors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">University</label>
                                    <select
                                        value={details.university}
                                        onChange={(e) => setDetails(prev => ({ ...prev, university: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors appearance-none text-[#1B2431]"
                                    >
                                        <option>FUTA</option>
                                        <option>UNILAG</option>
                                        <option>OAU</option>
                                        <option>ABU</option>
                                        <option>Covenant</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Academic Level</label>
                                    <select
                                        value={details.academicLevel}
                                        onChange={(e) => setDetails(prev => ({ ...prev, academicLevel: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors appearance-none text-[#1B2431]"
                                    >
                                        <option>200 Level</option>
                                        <option>300 Level</option>
                                        <option>400 Level</option>
                                        <option>500 Level</option>
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Special Requirements</label>
                                    <textarea
                                        value={details.specialRequirements}
                                        onChange={(e) => setDetails(prev => ({ ...prev, specialRequirements: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors resize-none h-[100px]"
                                        placeholder="Any specific requirements mentioned in the brief?"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Extra Context</label>
                                    <textarea
                                        value={details.extraContext}
                                        onChange={(e) => setDetails(prev => ({ ...prev, extraContext: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[6px] px-[16px] py-[12px] focus:outline-none focus:border-[#D4A853] transition-colors resize-none h-[100px]"
                                        placeholder="Anything your brief didn't cover? Add it here — site orientation, preferred case study references, lecturer preferences etc."
                                    />
                                </div>

                                {/* Student Details */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Your Full Name</label>
                                    <input
                                        type="text"
                                        value={details.studentName}
                                        onChange={(e) => setDetails(prev => ({ ...prev, studentName: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[8px] px-[14px] py-[11px] focus:outline-none focus:border-[#D4A853] transition-colors text-[14px] font-sans"
                                        placeholder="e.g. Ekpe Jacob Praise"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-[#6B7280]">Matric Number</label>
                                    <input
                                        type="text"
                                        value={details.matricNumber}
                                        onChange={(e) => setDetails(prev => ({ ...prev, matricNumber: e.target.value }))}
                                        disabled={isInputDisabled}
                                        className="w-full bg-white border border-[#E8E0D0] rounded-[8px] px-[14px] py-[11px] focus:outline-none focus:border-[#D4A853] transition-colors text-[14px] font-sans"
                                        placeholder="e.g. ARC/22/1234"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Select Documents */}
                        <section className={isInputDisabled ? 'opacity-50 pointer-events-none' : ''}>
                            <h2 className="text-[24px] font-serif font-bold mb-6 text-[#1B2431]">What do you need?</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {DOCUMENT_OPTIONS.map((doc) => (
                                    <label key={doc.id} className={`flex items-center gap-3 p-[12px_16px] bg-white border ${selectedDocuments.includes(doc.id) ? 'border-[#D4A853]' : 'border-[#E8E0D0]'} rounded-[6px] hover:border-[#D4A853] cursor-pointer transition-colors`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDocuments.includes(doc.id)}
                                            onChange={() => toggleDocument(doc.id)}
                                            disabled={isInputDisabled}
                                            className="w-5 h-5 accent-[#D4A853] cursor-pointer rounded"
                                        />
                                        <span className="font-medium text-[14px] text-[#1B2431]">{doc.label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || selectedDocuments.length === 0 || (inputMode === 'pdf' && !file && !details.rawText) || (inputMode === 'text' && !briefText)}
                                className="w-full py-[16px] bg-[#1B2431] text-white rounded-[6px] font-bold text-[16px] tracking-[0.05em] flex items-center justify-center gap-3 hover:bg-[#D4A853] hover:text-[#1B2431] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {loadingMessage}
                                    </>
                                ) : (
                                    <>
                                        Generate My Preliminaries
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[#9CA3AF] text-[13px] mt-4 font-medium">
                                This usually takes 30–60 seconds
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="bg-white border border-[#E8E0D0] rounded-[12px] p-[32px] sticky top-32">
                        <h3 className="text-[20px] font-serif font-bold mb-8 text-[#1B2431]">What happens next</h3>

                        <div className="space-y-6">
                            {[
                                { num: '01', title: 'We read your brief', desc: 'Formwork analyzes your brief for constraints, rules, and context.' },
                                { num: '02', title: 'We generate all selected documents', desc: 'Writing comprehensive architectural texts based on standard methodologies.' },
                                { num: '03', title: 'You edit, download and submit', desc: 'Review the output, make final tweaks, and export to Word or PDF.' }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-[32px] font-serif font-bold text-[#D4A853] leading-none shrink-0 mt-1">
                                        {step.num}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1B2431] mb-1">{step.title}</h4>
                                        <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-[16px] bg-[#FFF8EC] border-l-[3px] border-[#D4A853] rounded-[6px]">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-[#D4A853] mb-1">Tip</h5>
                            <p className="text-[13px] text-[#6B7280] font-medium leading-relaxed">
                                The more detail you add in Extra Context, the better your output will be.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
