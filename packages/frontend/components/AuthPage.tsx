import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [handle, setHandle] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { login, register } = useNitorStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && !agreedToTerms) {
      return; // Error will be shown in UI
    }

    // Validation
    if (!email.includes('@') || !email.includes('.')) {
      return;
    }
    if (password.length < 8) {
      return;
    }
    if (isRegistering && fullName.length < 2) {
      return;
    }
    if (isRegistering && handle.length < 3) {
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await register({
          email,
          password,
          fullName,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
        });
        onLogin(); // Trigger parent component update
      } else {
        await login(email, password);
        onLogin(); // Trigger parent component update
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Error toast is handled in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              NITOR
            </h1>
            <p className="text-2xl text-slate-700 dark:text-slate-300 font-light">
              Academic Social Network
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Rigorous. Academic. Connected.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Share Your Research
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Publish papers, preprints, and research updates with LaTeX support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  AI-Powered Tools
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  51 AI features powered by Gemini 2.5 Pro for writing enhancement
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Professional Network
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Connect with researchers worldwide in your field
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth Form */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {isRegistering
                  ? 'Join the academic community'
                  : 'Sign in to your account'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Dr. Jane Smith"
                      required
                      minLength={2}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Handle (Username)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                        @
                      </span>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.replace('@', ''))}
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="janesmith"
                        required
                        minLength={3}
                        pattern="[a-zA-Z0-9_]+"
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Letters, numbers, and underscores only
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="jane@university.edu"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={loading}
                />
                {isRegistering && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Minimum 8 characters
                  </p>
                )}
              </div>

              {isRegistering && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                  <label className="text-sm text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <span
                      onClick={() => window.location.hash = '/terms'}
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span
                      onClick={() => window.location.hash = '/integrity'}
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Scientific Integrity Code
                    </span>
                  </label>
                </div>
              )}

              {isRegistering && !agreedToTerms && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You must agree to the Terms of Service and Scientific Integrity Code to create an account.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (isRegistering && !agreedToTerms)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isRegistering ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAgreedToTerms(false);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                disabled={loading}
              >
                {isRegistering
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>

            {!isRegistering && (
              <div className="mt-4 text-center">
                <a
                  href="#/forgot-password"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Protected by enterprise-grade security with JWT and 2FA support
          </p>
        </div>
      </div>
    </div>
  );
};
