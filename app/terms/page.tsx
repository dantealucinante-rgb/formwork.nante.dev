import Navbar from '@/components/ui/Navbar'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#1B2431] font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-20 md:py-32">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12">Terms of Use</h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">1. Acceptance of terms</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            By using Formwork, you agree to these terms. They are designed to be simple and easy to understand for students.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">2. What Formwork provides</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Formwork provides AI-generated preliminary document drafts (Introduction, Site Analysis, Case Studies, etc.) for architecture students. These are intended to be a professional starting point for your studio research.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">3. Acceptable use</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Formwork is an academic reference tool. It is <strong>not</strong> intended to be submitted exactly as generated. You must review, verify, and edit the content to ensure it accurately reflects your project and meets your university's standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">4. User responsibility</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            You are responsible for the final documents you submit to your lecturers. Formwork helps you write, but you are the architect. Always fact-check site data and case study details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">5. Payments</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Payments are processed per generation through Paystack. Due to the immediate nature of AI content generation, all successful generations are non-refundable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">6. Intellectual property</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            The content generated from your unique project brief belongs to you. Formwork retains all rights to its platform, logo, brand, and the underlying AI prompts and technology.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">7. Limitation of liability</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Formwork is a tool to assist your workflow. We are not responsible for any academic outcomes, grades, or lecturer feedback resulting from the use of our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">8. Termination</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            We reserve the right to suspend accounts that misuse the platform or engage in behavior that harms the service or other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">9. Governing law</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            These terms are governed by the laws of the Federal Republic of Nigeria.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">10. Contact</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            For any legal or usage inquiries, contact us through <strong>nante.dev</strong>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
