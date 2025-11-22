
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNitorStore } from '../store/useNitorStore';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { addToast, setViewMode, setNeedsOnboarding, login } = useNitorStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering && !agreedToTerms) {
        addToast('You must agree to the Terms of Service and Scientific Integrity Code.', 'error');
        return;
    }

    setLoading(true);

    try {
        // Demo Mode Check
        if (!isSupabaseConfigured()) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // basic validation simulation
            if (!email.includes('@')) throw new Error('Please enter a valid email address.');
            if (password.length < 6) throw new Error('Password must be at least 6 characters.');
            
            if (isRegistering) {
                addToast('Demo Account Created Successfully', 'success');
                login(true); // True flag for isNewUser
                // onLogin prop is redundant as store updates, but kept for interface
            } else {
                addToast('Demo Mode: Authentication successful', 'success');
                login(false);
            }
            setLoading(false);
            return;
        }

        if (isRegistering) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });
            if (error) throw error;
            
            // Check if session is missing, implying email confirmation is required
            if (data.user && !data.session) {
                addToast('Account created! Please check your email to confirm your account before logging in.', 'success');
                setIsRegistering(false); // Switch back to login
            } else {
                addToast('Account created successfully! Welcome to Nitor.', 'success');
                // Trigger global store login with new user flag
                login(true); 
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Incorrect email or password. If you just signed up, please verify your email.');
                }
                if (error.message.includes('Email not confirmed')) {
                     throw new Error('Please verify your email address. Check your inbox (and spam folder) for the confirmation link.');
                }
                throw error;
            }

            addToast('Welcome back to your research.', 'success');
            login(false);
        }
    } catch (error: any) {
        console.error('Auth error:', error);
        let msg = error.message || 'Authentication failed';
        addToast(msg, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Brand & Aesthetics */}
      <div className="md:w-1/2 bg-slate-900 relative overflow-hidden flex items-center justify-center p-12">
        {/* Abstract Geometric Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{
                 backgroundImage: 'radial-gradient(circle at 50% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 30%)',
                 backgroundSize: '100% 100%'
             }} 
        />
        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(0deg, #0f172a 0%, transparent 100%)'}}></div>
        
        <div className="relative z-10 text-white max-w-lg">
            <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">NITOR</h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8 font-light">
                The intersection of rapid scientific dissemination and deep academic discourse. 
                Join the global network of researchers striving for brilliance.
            </p>
            
            <div className="space-y-4 text-sm text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span>Real-time LaTeX Rendering</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <span>Open Access Publishing</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <span>Unified Scientific Profile</span>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900">
                    {isRegistering ? 'Join the Community' : 'Welcome Back'}
                </h2>
                <p className="mt-2 text-slate-500">
                    {isRegistering ? 'Create your academic profile.' : 'Sign in to continue your research.'}
                </p>
                {!isSupabaseConfigured() && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Demo Mode (No Backend)
                    </div>
                )}
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                {isRegistering && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input 
                            type="text" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                            placeholder="e.g. Dr. Jane Doe" 
                        />
                    </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Academic Email</label>
                    <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                        placeholder="name@university.edu" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                        placeholder="••••••••" 
                    />
                </div>

                {isRegistering && (
                    <div className="flex items-start gap-3 pt-2">
                        <div className="flex items-center h-5">
                            <input 
                                id="terms" 
                                type="checkbox" 
                                required 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5" 
                            />
                        </div>
                        <label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                            I agree to the <a href="#" onClick={(e) => {e.preventDefault(); setViewMode('terms')}} className="text-indigo-600 hover:underline">Terms of Service</a> and Nitor's <a href="#" onClick={(e) => {e.preventDefault(); setViewMode('terms')}} className="text-indigo-600 hover:underline">Scientific Integrity Code</a>, affirming that my contributions will be original and cited correctly.
                        </label>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                          {isRegistering ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center text-sm">
                <span className="text-slate-500">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="ml-2 font-bold text-indigo-600 hover:underline focus:outline-none"
                >
                    {isRegistering ? 'Sign In' : 'Apply for Access'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};