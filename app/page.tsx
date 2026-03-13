import Link from 'next/link'
import {
  FileText,
  Upload,
  Layout,
  Map,
  Users,
  Briefcase,
  Layers,
  ClipboardCheck,
  ArrowRight
} from 'lucide-react'

import Navbar from '@/components/ui/Navbar'

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#1B2431] selection:bg-[#D4A853] selection:text-[#1B2431]">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-[999] h-14 bg-[#FAFAF8] border-b border-[#E8E0D0] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B2431] flex items-center justify-center">
            <span className="text-[#D4A853] font-black text-lg">F</span>
          </div>
          <span className="text-xl font-serif font-bold tracking-tighter text-[#1B2431]">Formwork</span>
        </div>
        <Link
          href="/generate"
          className="px-4 py-1.5 bg-[#D4A853] text-[#1B2431] font-bold text-xs uppercase tracking-wider"
        >
          Get Started
        </Link>
      </div>

      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section
          className="relative pt-24 pb-40 md:pt-40 md:pb-60 lg:px-[120px] px-[40px] max-w-[1600px] mx-auto min-h-[90vh] flex items-center bg-[#FAFAF8]"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Animated Background Elements */}
          {/* Grid Lines */}
          <div className="absolute inset-0 z-0 pointer-events-none flex" style={{ animation: 'grid-fade-in 2s forwards' }}>
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="h-full w-px bg-[#1B2431]/[0.06] mx-auto" />
            ))}
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none flex flex-col" style={{ animation: 'grid-fade-in 2s forwards' }}>
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="w-full h-px bg-[#1B2431]/[0.06] my-auto" />
            ))}
          </div>

          {/* Drawing Path (Sketch) */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 opacity-[0.15] z-0 pointer-events-none" viewBox="0 0 500 300">
            <path
              d="M50 50 H450 V200 H250 V250 H50 Z"
              fill="none"
              stroke="#D4A853"
              strokeWidth="2"
              strokeDasharray="1000"
              style={{ animation: 'path-draw 4s ease-in-out infinite' }}
            />
          </svg>

          {/* Geometric Shapes */}
          <div className="absolute top-[15%] left-[10%] opacity-[0.12] w-12 h-12 border-2 border-[#D4A853] z-0 pointer-events-none" style={{ animation: 'geo-float 5s ease-in-out infinite' }} />
          <div className="absolute bottom-[20%] right-[15%] opacity-[0.12] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-[#D4A853] z-0 pointer-events-none" style={{ animation: 'geo-float 7s ease-in-out infinite reverse' }} />
          <div className="absolute top-[40%] right-[20%] opacity-[0.12] w-10 h-10 rounded-full border-2 border-[#D4A853] z-0 pointer-events-none" style={{ animation: 'geo-float 6s ease-in-out infinite' }} />

          {/* Dimension Lines */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-40 opacity-[0.1] z-0 pointer-events-none" style={{ animation: 'dimension-extend 2s forwards' }}>
            <div className="h-px bg-[#D4A853] w-full relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-px bg-[#D4A853] rotate-45" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-px bg-[#D4A853] -rotate-45" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-px bg-[#D4A853] rotate-45" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-px bg-[#D4A853] -rotate-45" />
            </div>
          </div>
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 h-40 opacity-[0.1] z-0 pointer-events-none" style={{ animation: 'dimension-extend 2s forwards' }}>
            <div className="w-px bg-[#D4A853] h-full relative">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px bg-[#D4A853] w-2 rotate-45" />
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px bg-[#D4A853] w-2 -rotate-45" />
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-px bg-[#D4A853] w-2 rotate-45" />
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-px bg-[#D4A853] w-2 -rotate-45" />
            </div>
          </div>

          {/* Compass / North Arrow */}
          <div className="absolute bottom-12 left-12 w-[30px] h-[30px] opacity-[0.2] z-0 pointer-events-none" style={{ animation: 'compass-rotate 8s linear infinite' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#1B2431]">
              <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
              <text x="50" y="20" textAnchor="middle" fontSize="12" fontWeight="bold">N</text>
            </svg>
          </div>

          {/* Drawing Pencil */}
          <div className="absolute top-12 right-12 w-10 h-10 text-[#D4A853] z-0 pointer-events-none" style={{ animation: 'pencil-draw 3s ease-in-out infinite' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3 8 8-9 9-4 1 1-4 9-9z" />
              <path d="m19 11-8-8" />
            </svg>
          </div>

          {/* Architecture Details */}
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A853] z-20" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 items-center w-full">
            {/* Left Column: Text Content */}
            <div className="text-left z-10">
              <div className="inline-block px-4 py-1.5 border border-[#D4A853] text-[#D4A853] text-[10px] font-black tracking-[0.4em] uppercase mb-10 bg-transparent">
                Architectural Productivity
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[110px] font-serif font-bold tracking-tight mb-12 leading-[0.9] md:leading-[0.85] text-left text-[#1B2431]">
                Your preliminaries.<br />
                <span className="text-[#D4A853] block mt-4 md:mt-6">Done in minutes.</span>
              </h1>

              <p className="text-lg md:text-2xl text-[#4A5568] mb-12 max-w-2xl text-left leading-relaxed font-medium">
                Upload your project brief and get your complete architectural preliminary writings instantly.
                Built specifically for Nigerian architecture students.
              </p>

              <div className="flex flex-col items-start gap-4">
                <Link
                  href="/generate"
                  className="group relative inline-flex items-center gap-4 px-10 py-4 border-2 border-[#1B2431] text-[#1B2431] font-black text-lg uppercase tracking-widest hover:bg-[#1B2431] hover:text-white transition-all duration-300"
                >
                  Generate My Preliminaries
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <span className="text-xs text-[#9CA3AF] uppercase tracking-widest font-bold ml-1">No account needed</span>
              </div>
            </div>

            {/* Right Column: Document Preview */}
            <div className="hidden lg:block relative group">
              {/* Mock Card */}
              <div className="bg-white border border-[#E8E0D0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)] relative transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-10 border-b border-[#E8E0D0] pb-4">
                  <span className="text-[10px] font-black tracking-[0.3em] text-[#D4A853] uppercase">INTRODUCTION</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8E0D0]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8E0D0]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8E0D0]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2.5 bg-[#E8E0D0] w-[90%] rounded-full" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[100%] rounded-full" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[85%] rounded-full" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[95%] rounded-full" />
                  <div className="h-4 w-0.5 bg-[#D4A853]/30 my-6" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[60%] rounded-full" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[80%] rounded-full" />
                  <div className="h-2.5 bg-[#E8E0D0] w-[40%] rounded-full" />
                </div>

                {/* Aesthetic Accents */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[#1B2431]/10" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="px-6 py-32 bg-[#F2EFEC] border-y border-[#E8E0D0] relative"
          style={{ textAlign: 'center', alignItems: 'center', width: '100%', padding: '40px 24px' }}
        >
          <div className="max-w-6xl mx-auto" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="flex flex-col md:flex-row items-center justify-center mb-20 gap-4 w-full">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1B2431] text-center">How it works</h2>
              <div className="h-px bg-[#D4A853]/30 flex-1 mx-8 hidden md:block mb-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative w-full" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="absolute top-[60px] left-[20%] right-[20%] h-0.5 border-t border-dashed border-[#D4A853]/30 hidden md:block" />

              {[
                { step: '01', title: 'Upload your brief', desc: 'PDF or Word format. Simple and fast.', icon: Upload },
                { step: '02', title: 'Formwork generates', desc: 'Accurate, structured, ready to submit documents.', icon: FileText },
                { step: '03', title: 'Download & submit', desc: 'High-quality export ready for review.', icon: ClipboardCheck },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center px-10 py-12 border border-[#E8E0D0]/30 hover:bg-white/50 transition-all duration-500 relative group"
                  style={{ width: '100%', maxWidth: '100%', alignItems: 'center', textAlign: 'center', margin: '0 auto' }}
                >
                  <span className="text-6xl md:text-8xl font-serif font-black text-[#D4A853]/10 absolute top-4 left-6 group-hover:text-[#D4A853]/20 transition-colors italic">
                    {item.step}
                  </span>
                  <div className="w-20 h-20 border-2 border-[#1B2431] flex items-center justify-center mb-10 bg-white relative z-10 group-hover:border-[#D4A853] transition-all duration-300 transform group-hover:scale-110">
                    <item.icon className="w-8 h-8 text-[#1B2431] group-hover:text-[#D4A853] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase group-hover:text-[#D4A853] transition-colors text-[#1B2431]">{item.title}</h3>
                  <p className="text-[#4A5568] leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Formwork is built for */}
        <section className="bg-[#FAFAF8] md:py-20 py-12 px-6 md:px-12 border-b border-[#E8E0D0]">
          <div className="max-w-[720px] mx-auto flex flex-col items-center">
            <span className="text-[#D4A853] text-[11px] font-black tracking-[0.1em] uppercase mb-8">
              BUILT FOR YOU
            </span>
            <div className="space-y-5 text-center">
              <p className="text-[#4A5568] text-base leading-[1.8] font-sans">
                Formwork is built for architecture students in Nigerian universities — the ones spending hours writing the same preliminary documents every semester before they can even start designing. The writing is necessary. But it shouldn't be the hardest part of the process.
              </p>
              <p className="text-[#4A5568] text-base leading-[1.8] font-sans">
                Every feature in Formwork was shaped by the way Nigerian architecture students actually work — the briefs, the formats, the language lecturers expect. This is not a generic AI tool. It was built from the inside, by someone who has sat through the same studio deadlines.
              </p>
            </div>
          </div>
        </section>

        {/* What It Generates Section */}
        <section className="px-6 py-32 max-w-7xl mx-auto border-x border-[#E8E0D0]">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20">
            <div className="max-w-xl text-left">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#1B2431]">Everything you need</h2>
              <p className="text-[#4A5568] text-lg font-medium leading-relaxed">
                Comprehensive preliminary documents for your studio project, following the standard architectural research methodology.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#D4A853]/30 flex items-center justify-center text-[#D4A853] font-bold">8</div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF]">Modules included</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-[#E8E0D0]">
            {[
              { title: 'Introduction', icon: FileText },
              { title: 'Design Brief', icon: Briefcase },
              { title: 'Brief Development', icon: Layers },
              { title: 'Site Analysis', icon: Map },
              { title: 'Site Planning', icon: Layout },
              { title: 'Case Studies', icon: Users },
              { title: 'Spatial Analysis', icon: Layers },
              { title: 'Schedule of Accommodation', icon: ClipboardCheck },
            ].map((doc, i) => (
              <div
                key={i}
                className="p-10 border-r border-b border-[#E8E0D0] border-l-4 border-l-transparent hover:border-l-[#D4A853] hover:bg-white transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <doc.icon className="w-10 h-10 text-[#1B2431] mb-8 opacity-20 group-hover:opacity-100 group-hover:text-[#D4A853] transition-all duration-300 transform group-hover:scale-110" />
                <h3 className="font-serif font-bold text-xl leading-tight text-[#1B2431] group-hover:text-[#D4A853] transition-colors">{doc.title}</h3>
                <div className="w-8 h-px bg-[#E8E0D0] mt-6 group-hover:w-16 group-hover:bg-[#D4A853] transition-all duration-300" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 pt-20 pb-12 border-t border-[#D4A853]/30 bg-[#FAFAF8] relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20 text-center md:text-left">
            {/* Branding Column */}
            <div className="md:col-span-1">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="w-8 h-8 bg-[#1B2431] flex items-center justify-center">
                  <span className="text-[#D4A853] font-black text-lg">F</span>
                </div>
                <span className="text-2xl font-serif font-bold tracking-tighter text-[#1B2431]">Formwork</span>
              </div>
              <p className="text-[#4A5568] text-sm leading-relaxed mb-6">
                Redefining architectural research productivity for the next generation of architects.
              </p>
              <div className="flex justify-center md:justify-start">
                <p className="text-[#D4A853] font-black tracking-[0.3em] uppercase text-[10px]">BY ARCHITECTS, FOR ARCHITECTS</p>
              </div>
            </div>

            {/* Platform links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1B2431] font-serif font-bold text-lg mb-2 uppercase tracking-tight">Platform</h4>
              <Link href="/generate" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">Generate</Link>
              <Link href="/dashboard" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">Dashboard</Link>
              <Link href="/pricing" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">Pricing</Link>
            </div>

            {/* Resources links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1B2431] font-serif font-bold text-lg mb-2 uppercase tracking-tight">Resources</h4>
              <Link href="/#how-it-works" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">How it works</Link>
              <Link href="/faq" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">FAQs</Link>
            </div>

            {/* Legal links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1B2431] font-serif font-bold text-lg mb-2 uppercase tracking-tight">Legal</h4>
              <Link href="/privacy" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[#4A5568] text-sm font-bold uppercase tracking-widest hover:text-[#D4A853] transition-colors">Terms of Use</Link>
            </div>
          </div>

          <div className="h-px bg-[#E8E0D0] w-full mb-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
              &copy; {currentYear} Formwork. Built by <span className="text-[#1B2431] hover:text-[#D4A853] cursor-pointer transition-colors">nante.dev</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
              <span className="text-[#9CA3AF] font-bold uppercase tracking-[0.2em] text-[9px]">Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
