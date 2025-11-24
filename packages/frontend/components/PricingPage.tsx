import React, { useState } from 'react';
import { Check, Zap, Award, BarChart3, ArrowLeft, Loader2 } from 'lucide-react';
import { useNitorStore } from '../store/useNitorStore';

interface PricingPageProps {
    onBack: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
  const { addToast } = useNitorStore();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Integrate with actual payment processor (Stripe, etc.)
      // For now, show success message
      addToast('Nitor Plus upgrade successful! Welcome to premium features.', 'success');

      // Navigate back after successful upgrade
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      addToast('Upgrade failed. Please try again or contact support.', 'error');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
        </button>

        <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">
                Upgrade your Impact
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
                Join 10,000+ researchers using Nitor Plus to amplify their reach and accelerate discovery.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Researcher</h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">$0</span>
                    <span className="text-slate-500 dark:text-slate-400">/month</span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">Everything you need to publish and connect.</p>
                
                <div className="space-y-4 mb-8">
                    {['Unlimited Public Posts', 'Basic Analytics', 'Markdown & LaTeX Editor', '3GB Storage'].map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Check className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                    ))}
                </div>

                <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Current Plan
                </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    POPULAR
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    Nitor Plus <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">$12</span>
                    <span className="text-slate-400">/month</span>
                </div>

                <p className="text-indigo-200 mb-8 text-sm">Power tools for serious academics.</p>

                <div className="space-y-4 mb-8">
                    {[
                        { text: 'Verified Academic Badge', icon: Award },
                        { text: 'Advanced Impact Analytics', icon: BarChart3 },
                        { text: 'Unlimited PDF Exports', icon: Zap },
                        { text: 'Priority DOI Assignment', icon: Check },
                        { text: 'Early Access Features', icon: Check },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                {item.icon ? <item.icon className="w-3 h-3 text-white" /> : <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-slate-100">{item.text}</span>
                        </div>
                    ))}
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Upgrade Now'
                    )}
                </button>
            </div>
        </div>

        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
            <p>Universities and Labs: <span className="underline cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">Contact us for enterprise pricing</span>.</p>
        </div>

      </div>
    </div>
  );
};