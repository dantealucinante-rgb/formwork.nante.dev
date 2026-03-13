import Navbar from '@/components/ui/Navbar'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#1B2431] font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-20 md:py-32">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12">Privacy Policy</h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">1. Introduction</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Formwork is an AI-powered platform designed to help architecture students generate preliminary documents. It is operated by <strong>Nante.dev</strong>. We believe in being honest and direct about how we handle your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">2. Information we collect</h2>
                        <p className="text-[#4A5568] leading-relaxed mb-4">
                            We collect minimal information to provide our service:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[#4A5568] ml-2">
                            <li><strong>Brief Content:</strong> The text or files you upload as your project brief.</li>
                            <li><strong>Account Data:</strong> Your email address if you choose to sign up for an account.</li>
                            <li><strong>Usage Data:</strong> Basic information about how you use the platform to help us improve.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">3. How we use your information</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            We use your data solely to generate your documents, manage your account, and improve Formwork. We do not use your project briefs for any other purpose than providing you with the output you requested.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">4. Data storage</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            Your data is stored securely using <strong>Supabase</strong>. We do not sell your personal information or your project data to third parties. Period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">5. Third party services</h2>
                        <p className="text-[#4A5568] leading-relaxed mb-4">
                            To make Formwork work, we use a few trusted partners:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[#4A5568] ml-2">
                            <li><strong>Groq AI:</strong> To process your brief and generate document content.</li>
                            <li><strong>Supabase:</strong> For our database and user authentication.</li>
                            <li><strong>Paystack:</strong> To securely process payments.</li>
                            <li><strong>Vercel:</strong> For hosting the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">6. Cookies</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            We use minimal cookies only to keep you signed in and maintain your session. We don't use tracking or advertising cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">7. Your rights</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            You have the right to access your data, correct it, or ask us to delete it entirely. You can do this through your dashboard or by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">8. Contact</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            If you have any questions about this policy, reach out to us through <strong>nante.dev</strong> or email us at hello@nante.dev.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4A853] mb-4">9. Changes to this policy</h2>
                        <p className="text-[#4A5568] leading-relaxed">
                            We may update this policy occasionally as we add new features. We'll post any changes here.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
