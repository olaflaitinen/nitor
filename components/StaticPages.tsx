
import React, { useState } from 'react';
import { ArrowLeft, Scale, FileText, ShieldAlert, BookOpen, Download, AlertTriangle, CheckCircle2, Gavel, Globe, Cpu, Hash } from 'lucide-react';
import { useNitorStore } from '../store/useNitorStore';
import { jsPDF } from 'jspdf';

interface StaticPageProps {
  title: string;
  content: React.ReactNode;
  onBack: () => void;
}

const PageLayout: React.FC<StaticPageProps> = ({ title, content, onBack }) => (
  <div className="min-h-screen bg-white p-6 md:p-12 animate-in fade-in duration-300">
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Nitor
      </button>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">
        {title}
      </h1>
      <div className="h-1 w-20 bg-indigo-600 mb-8 rounded-full"></div>
      <div className="prose prose-slate prose-lg prose-headings:font-serif prose-a:text-indigo-600 hover:prose-a:text-indigo-800 text-slate-700 max-w-none">
        {content}
      </div>
    </div>
  </div>
);

export const AboutPage: React.FC<{onBack: () => void}> = ({onBack}) => (
  <PageLayout
    title="About Nitor"
    onBack={onBack}
    content={
      <>
        <p className="lead text-xl text-slate-600 mb-8">
          Nitor is the world's first <span className="font-bold text-indigo-900">Impact Network</span>—designed to democratize academic publishing by fusing the velocity of social media with the rigor of peer-reviewed journals.
        </p>
        
        <h3>The Problem</h3>
        <p>
          Scientific progress is currently bottlenecked by an archaic publishing model. Knowledge is locked behind paywalls, peer review takes months (or years), and negative results—crucial for saving time—are rarely published.
        </p>

        <h3>The Nitor Solution</h3>
        <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-600"/> Universal Open Access</h4>
                <p className="text-sm text-slate-600">Every character typed on Nitor is free to read, cite, and build upon. We enforce CC-BY 4.0 defaults.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Scale className="w-4 h-4 text-indigo-600"/> Meritocratic Metrics</h4>
                <p className="text-sm text-slate-600">Our "Nitor Score" replaces the flawed Impact Factor, calculating influence based on replicability and cross-disciplinary citation.</p>
            </div>
        </div>

        <h3>Our Philosophy</h3>
        <p>
          We believe that <span className="italic">science is a conversation, not a catalogue</span>. By lowering the barrier to entry for publishing micro-findings, datasets, and failed experiments, we accelerate the global rate of discovery.
        </p>
      </>
    }
  />
);

export const PrivacyPage: React.FC<{onBack: () => void}> = ({onBack}) => (
  <PageLayout
    title="Privacy Policy"
    onBack={onBack}
    content={
      <>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 mb-6 not-prose flex gap-3 items-start">
            <Globe className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
                <strong>Effective Date:</strong> January 1, 2024 &bull; <strong>Version:</strong> 2.1 (GDPR & CCPA Compliant)<br/>
                <span className="opacity-80">We prioritize data minimization and researcher autonomy.</span>
            </div>
        </div>

        <h3>1. Introduction</h3>
        <p>
          Nitor ("we", "us", "Platform") values your research and your privacy. Unlike ad-driven social networks, our business model is based on premium academic tools (Nitor Plus), not selling your behavioral data.
        </p>

        <h3>2. Data We Collect</h3>
        <ul>
            <li><strong>Identity Data:</strong> Name, OrcID, Institutional Affiliation, Academic History.</li>
            <li><strong>Content Data:</strong> Articles, Posts, LaTeX source code, images, and datasets uploaded to the platform.</li>
            <li><strong>Interaction Data:</strong> Citations, endorsements, comments, and reading history (used solely for Nitor Score calculation).</li>
            <li><strong>Device Data:</strong> IP address and browser user agent for security and rate-limiting.</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your data exclusively to:</p>
        <ul>
            <li>Provide and maintain the Service (rendering LaTeX, hosting images).</li>
            <li>Calculate academic impact metrics (Nitor Score).</li>
            <li>Detect scientific misconduct (plagiarism detection, image manipulation analysis).</li>
            <li>Comply with legal obligations.</li>
        </ul>

        <h3>4. Data Portability & Right to be Forgotten</h3>
        <p>
           Under GDPR (Article 17) and CCPA, you retain full ownership of your personal data.
        </p>
        <ul>
            <li><strong>Export:</strong> You may download a JSON archive of all your content via Settings at any time.</li>
            <li><strong>Deletion:</strong> You may request permanent account deletion. Note that <strong>public scientific contributions (Articles)</strong> may be retained but anonymized ("Ghost User") to preserve the integrity of the citation graph, as is standard in academic publishing.</li>
        </ul>
      </>
    }
  />
);

export const TermsPage: React.FC<{onBack: () => void}> = ({onBack}) => {
  const { addToast } = useNitorStore();
  const [activeSection, setActiveSection] = useState<'tos' | 'integrity'>('tos');

  const handleDownload = () => {
      try {
          const doc = new jsPDF();
          
          // Header
          doc.setFontSize(22);
          doc.setFont("times", "bold");
          doc.text("NITOR", 20, 20);
          
          doc.setFontSize(16);
          doc.text("Terms of Service & Scientific Integrity Code", 20, 30);
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
          
          // Content
          doc.setFontSize(12);
          const lines = [
              "1. PREFACE",
              "Nitor is a platform for professional scientific discourse.",
              "By using Nitor, you agree to adhere to the highest standards.",
              "",
              "2. CONTENT OWNERSHIP",
              "You retain full ownership of your work (CC-BY 4.0).",
              "You grant Nitor a license to display and distribute your content.",
              "",
              "3. SCIENTIFIC INTEGRITY CODE",
              "- PLAGIARISM: Strictly prohibited. Includes direct, mosaic, and self-plagiarism.",
              "- DATA INTEGRITY: P-Hacking and HARKing are violations of this code.",
              "- AI DISCLOSURE: Use of AI tools must be disclosed.",
              "",
              "4. ENFORCEMENT",
              "Violations may result in immediate suspension or permanent ban.",
              "",
              "5. DISCLAIMER",
              "The service is provided 'as is' without warranty of any kind."
          ];
          
          let y = 55;
          lines.forEach(line => {
              doc.text(line, 20, y);
              y += 7;
          });
          
          doc.save("Nitor_Terms_and_Code.pdf");
          addToast('Legal document downloaded successfully.', 'success');
      } catch (error) {
          console.error(error);
          addToast('Failed to generate PDF.', 'error');
      }
  };

  const scrollToId = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                    Legal & Ethics
                </h1>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveSection('tos')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'tos' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    Terms of Service
                  </button>
                  <button 
                    onClick={() => setActiveSection('integrity')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'integrity' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    Integrity Code
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
                    {activeSection === 'tos' ? 'Table of Contents' : 'Code Sections'}
                </p>
                {activeSection === 'tos' ? (
                    <>
                        <button onClick={() => scrollToId('tos-1')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">1. Eligibility & Security</button>
                        <button onClick={() => scrollToId('tos-2')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">2. IP & Licensing</button>
                        <button onClick={() => scrollToId('tos-3')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">3. Acceptable Use</button>
                        <button onClick={() => scrollToId('tos-4')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">4. API & Scrapping</button>
                        <button onClick={() => scrollToId('tos-5')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">5. Liability</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => scrollToId('code-1')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">1. The Oath</button>
                        <button onClick={() => scrollToId('code-2')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">2. Plagiarism</button>
                        <button onClick={() => scrollToId('code-3')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">3. Data Integrity</button>
                        <button onClick={() => scrollToId('code-4')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">4. AI Disclosure</button>
                        <button onClick={() => scrollToId('code-5')} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">5. Enforcement</button>
                    </>
                )}
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={handleDownload} className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
            <div className="prose prose-slate dark:prose-invert prose-lg prose-headings:font-serif prose-a:text-indigo-600 max-w-none">
                
                {activeSection === 'tos' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-serif italic">
                                Effective Date: October 24, 2023 • Last Revised: January 15, 2024
                            </p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border-l-4 border-slate-900 dark:border-slate-100 mb-10 not-prose">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5"/> Executive Summary
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                These Terms constitute a binding legal agreement between you ("User") and Nitor Labs Inc. By creating an account, you confirm you are an academic professional, student, or independent researcher engaged in legitimate scientific inquiry. Nitor is a platform for Open Access dissemination; <strong>you retain copyright of your work</strong>, but grant us the right to display it.
                            </p>
                        </div>

                        <section id="tos-1" className="scroll-mt-32">
                            <h3>1. Account Eligibility & Security</h3>
                            <p>1.1 <strong>Academic Standing:</strong> Nitor is intended for use by the scientific community. While we do not strictly require an .edu email, we reserve the right to verify credentials (e.g., via ORCID, LinkedIn, or publication history) for "Verified" status.</p>
                            <p>1.2 <strong>Identity:</strong> You may not impersonate another researcher. "Parody" accounts must be clearly labeled in the bio. Pseudonyms are permitted for personal safety but may limit eligibility for Nitor Scores and certain visibility features.</p>
                            <p>1.3 <strong>Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. Nitor is not liable for loss or damage arising from your failure to protect your account.</p>
                        </section>

                        <section id="tos-2" className="scroll-mt-32">
                            <h3>2. Content Ownership & Licensing</h3>
                            <p>This is the core of our Open Access philosophy.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>You Own Your Work:</strong> You retain full copyright ownership of all Articles, Posts, Images, and Data you upload to Nitor. We claim no ownership.</li>
                                <li><strong>License to Nitor:</strong> By posting, you grant Nitor a worldwide, non-exclusive, royalty-free license to host, display, distribute, and reproduce your content for the purpose of operating the Service.</li>
                                <li><strong>Public License (CC-BY 4.0):</strong> Unless explicitly marked otherwise in your Settings (e.g., Private Mode), you agree that your public content is distributed under the <strong>Creative Commons Attribution 4.0 International License</strong>. This means others may share and adapt your work, provided they give you appropriate credit.</li>
                            </ul>
                        </section>

                        <section id="tos-3" className="scroll-mt-32">
                            <h3>3. Acceptable Use</h3>
                            <p>You agree NOT to use Nitor to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Publish content that constitutes "Pseudoscience" (claims lacking empirical evidence or falsifiable methodology) with the intent to mislead.</li>
                                <li>Harass, bully, or doxx other researchers. Vigorous academic debate is encouraged; ad hominem attacks are not.</li>
                                <li>Engage in "Citation Farming" or automated bot activity to inflate metrics.</li>
                                <li>Upload Protected Health Information (PHI) or unanonymized patient data in violation of HIPAA or GDPR.</li>
                            </ul>
                        </section>

                        <section id="tos-4" className="scroll-mt-32">
                            <h3>4. API Access & Data Scraping</h3>
                            <p>
                                4.1 <strong>No Unauthorized Scraping:</strong> Scraping Nitor data for the purpose of training commercial Large Language Models (LLMs) without an enterprise license is strictly prohibited.
                            </p>
                            <p>
                                4.2 <strong>Academic Research Exception:</strong> We permit scraping for meta-science research purposes (e.g., studying citation networks) provided the request rate does not exceed 1 request per second. Researchers are encouraged to use our official API.
                            </p>
                        </section>

                        <section id="tos-5" className="scroll-mt-32">
                            <h3>5. Disclaimers & Limitation of Liability</h3>
                            <p className="text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800">
                                THE SERVICE IS PROVIDED "AS IS". NITOR DOES NOT GUARANTEE THE ACCURACY OF SCIENTIFIC CONTENT POSTED BY USERS. WE ARE NOT LIABLE FOR EXPERIMENTAL FAILURES, DATA LOSS, OR REPUTATIONAL DAMAGE ARISING FROM USE OF THE PLATFORM.
                            </p>
                        </section>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-indigo-400 mb-4">Scientific Integrity Code</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-serif italic">
                                The Constitution of the Nitor Community
                            </p>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border-l-4 border-indigo-600 mb-10 not-prose">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5"/> The Nitor Oath
                            </h4>
                            <p className="text-indigo-800 dark:text-indigo-200 font-serif italic text-lg">
                                "I affirm that the research I present on Nitor is my own work, that the data is authentic, and that I have declared all conflicts of interest. I engage in this community to seek truth, not merely status."
                            </p>
                        </div>

                        <section id="code-1" className="scroll-mt-32">
                            <h3>1. Preface</h3>
                            <p>
                                Nitor is not just a social network; it is a persistent record of scientific discourse. Therefore, we hold our users to a higher standard than generic platforms. Violations of this code are grounds for immediate ban and a permanent "Retracted" mark on your profile.
                            </p>
                        </section>

                        <section id="code-2" className="scroll-mt-32">
                            <h3>2. Plagiarism</h3>
                            <p>We define plagiarism strictly as:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Direct Plagiarism:</strong> Copying text, LaTeX equations, or code from another source without attribution.</li>
                                <li><strong>Mosaic Plagiarism:</strong> Borrowing phrases from a source without using quotation marks or finding synonyms for the author's language while keeping the same structure.</li>
                                <li><strong>Self-Plagiarism:</strong> Republishing your own previously published work as "New" without citing the original publication venue.</li>
                            </ul>
                        </section>

                        <section id="code-3" className="scroll-mt-32">
                            <h3>3. Data Integrity & Manipulation</h3>
                            <p>We strictly prohibit the following practices:</p>
                            <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                    <h5 className="font-bold text-red-600 flex items-center gap-2"><Hash className="w-4 h-4"/> P-Hacking</h5>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Selectively reporting data or statistical analyses until nonsignificant results become significant.</p>
                                </div>
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                    <h5 className="font-bold text-red-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> HARKing</h5>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hypothesizing After Results are Known. Presenting a post-hoc hypothesis as if it were a priori.</p>
                                </div>
                            </div>
                            <p><strong>Image Manipulation:</strong> Enhancing, obscuring, moving, removing, or introducing a specific feature within an image (e.g., Western Blot bands, microscopy visuals) is prohibited. Linear adjustments to contrast/brightness are permitted if applied to the entire image.</p>
                        </section>

                        <section id="code-4" className="scroll-mt-32">
                            <h3>4. AI Usage Disclosure</h3>
                            <p>
                                While Nitor provides AI tools (Gemini) for *refining* text, the core hypothesis and intellectual contribution must be human.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Authorship:</strong> AI (LLMs) cannot be listed as an Author.</li>
                                <li><strong>Disclosure:</strong> You must disclose if a significant portion of an article's text was generated by AI.</li>
                                <li><strong>Peer Review:</strong> Using AI to write peer reviews without disclosing it is considered a breach of trust. Reviewers must personally validate the logic of the paper.</li>
                                <li><strong>Responsibility:</strong> You accept full responsibility for the accuracy of AI-assisted content, including hallucinations or citation errors.</li>
                            </ul>
                        </section>

                        <section id="code-5" className="scroll-mt-32">
                            <h3>5. Enforcement & The "Nitor Court"</h3>
                            <p>
                                Allegations of misconduct are reviewed by the Nitor Integrity Board (composed of verified senior academics).
                            </p>
                            <div className="not-prose space-y-4 mt-4">
                                <div className="flex gap-4 items-start bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                                    <div className="shrink-0 mt-1"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>
                                    <div>
                                        <h5 className="font-bold text-yellow-800 dark:text-yellow-200">Level 1 (Minor)</h5>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Unintentional citation error or minor text overlap. Remedy: Correction notice appended to content.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                                    <div className="shrink-0 mt-1"><Gavel className="w-5 h-5 text-orange-600" /></div>
                                    <div>
                                        <h5 className="font-bold text-orange-800 dark:text-orange-200">Level 2 (Moderate)</h5>
                                        <p className="text-sm text-orange-700 dark:text-orange-300">Self-plagiarism, undisclosed conflicts of interest, or negligent data handling. Remedy: 30-day suspension + Flag on content.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                                    <div className="shrink-0 mt-1"><ShieldAlert className="w-5 h-5 text-red-600" /></div>
                                    <div>
                                        <h5 className="font-bold text-red-800 dark:text-red-200">Level 3 (Severe)</h5>
                                        <p className="text-sm text-red-700 dark:text-red-300">Data fabrication, deliberate plagiarism, or image manipulation. Remedy: Permanent ban, "Retracted" watermark on all content, and notification of user's institution.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
