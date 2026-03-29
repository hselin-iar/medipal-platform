import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Navbar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-slate-50/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <span className="font-headline font-extrabold text-2xl text-cyan-900">MediPal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-medium hover:text-cyan-600 transition-colors font-headline text-base tracking-tight cursor-pointer hidden sm:inline">
            हिन्दी
          </span>
          <span className="text-cyan-700 font-bold font-headline text-base tracking-tight cursor-pointer hidden sm:inline">
            English
          </span>
          <Link
            href="/login"
            className="text-cyan-900 font-semibold text-sm hover:text-cyan-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <div>
              <span className="inline-block bg-primary-fixed text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                AI-Powered Health Clarity
              </span>
              <h1 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl text-primary tracking-tight leading-[1.08]">
                Your health,{' '}
                <span className="text-secondary">clearly understood.</span>
              </h1>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              MediPal transforms complex medical records into a clear narrative. No more deciphering
              medical jargon — just clinical clarity at your fingertips.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="vitality-gradient text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-cyan-900/10 hover:opacity-90 transition-all active:scale-95 duration-150 inline-flex items-center gap-2"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-full font-bold text-sm hover:bg-surface-variant transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">play_circle</span>
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                Trusted by <span className="font-bold text-on-surface">10,000+</span> healthcare
                users
              </p>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl vitality-gradient flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">upload_file</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary mb-1">Upload</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Securely upload your lab reports. Our system accepts PDFs with selectable text.
                </p>
              </div>
            </div>

            {/* Summarize Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white">summarize</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary mb-1">Summarize</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Our Clinical AI parses every parameter into simple, actionable insights.
                </p>
              </div>
            </div>

            {/* Clinical Insight Card */}
            <div className="vitality-gradient rounded-2xl p-6 shadow-xl text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed-dim mb-2">
                Clinical Insight
              </p>
              <h3 className="font-headline font-bold text-xl mb-1">
                &ldquo;Bilateral Perityllar Opacities&rdquo;
              </h3>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-4">
                <p className="text-xs text-primary-fixed font-medium uppercase tracking-wider mb-1">
                  MediPal Translation
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  &ldquo;Signs of mild inflammation in the center of both lungs.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* No more medical Greek section */}
        <section id="how-it-works" className="mt-32 text-center max-w-3xl mx-auto">
          <h2 className="font-headline font-extrabold text-4xl text-primary mb-4">
            No more medical &ldquo;Greek&rdquo;
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-12">
            Doctors often use terminology that feels like a foreign language. We translate
            &lsquo;Hypothyroidism&rsquo; to &lsquo;Low Thyroid Function&rsquo; and explain exactly
            how it affects your energy, mood, and metabolism.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-white text-lg">translate</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary mb-1">
                  Plain-Language Reports
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Every lab result explained in 6th-grade-level English and Hindi.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-white text-lg">checklist</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-primary mb-1">
                  Actionable To-Dos
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Know exactly what questions to ask your doctor next.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full py-12 px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <span className="font-headline font-semibold text-slate-400 text-xl tracking-tight">
            MediPal
          </span>
          <div className="flex flex-wrap justify-center gap-8">
            <span className="text-slate-400 font-body text-xs uppercase tracking-widest">Privacy Policy</span>
            <span className="text-slate-400 font-body text-xs uppercase tracking-widest">Terms of Service</span>
            <span className="text-slate-400 font-body text-xs uppercase tracking-widest">Contact Support</span>
          </div>
          <p className="text-slate-500 font-body text-xs leading-relaxed max-w-2xl">
            © 2024 MediPal. Medical Disclaimer: Information provided is for educational purposes and
            not a substitute for professional medical advice. Always consult with a qualified
            healthcare provider for clinical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}
