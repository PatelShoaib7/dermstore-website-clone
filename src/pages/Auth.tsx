import React, { useEffect, useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleAccountsOAuth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
  }) => { requestAccessToken: () => void };
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: GoogleAccountsOAuth2;
      };
    };
  }
}

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();

export const Auth: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogleProfile } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Local OAuth quick-connect dialog state when VITE_GOOGLE_CLIENT_ID is not set in .env
  const [localGoogleModalOpen, setLocalGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  // Load official Google Identity Services script if VITE_GOOGLE_CLIENT_ID is configured
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (document.getElementById('google-gsi-script')) return;

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setError('');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-check your password.');
        return;
      }
      const result = signUpWithEmail(name, email, password);
      if (!result.ok && result.error) {
        setError(result.error);
      }
    } else {
      const result = signInWithEmail(email, password);
      if (!result.ok && result.error) {
        setError(result.error);
      }
    }
  };

  const handleGoogleOAuthClick = () => {
    setError('');

    // Live Google Cloud OAuth 2.0 flow when VITE_GOOGLE_CLIENT_ID is configured
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.oauth2) {
      setGoogleLoading(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse.error || !tokenResponse.access_token) {
            setGoogleLoading(false);
            setError('Google authentication was cancelled or failed.');
            return;
          }
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch Google user profile');
            const data = (await res.json()) as {
              name?: string;
              email?: string;
              picture?: string;
            };
            if (!data.email) throw new Error('No email returned from Google');

            const authResult = signInWithGoogleProfile({
              name: data.name || data.email.split('@')[0],
              email: data.email,
              avatar: data.picture,
            });
            if (!authResult.ok && authResult.error) {
              setError(authResult.error);
            }
          } catch {
            setError('Unable to verify Google profile. Please try again.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });
      tokenClient.requestAccessToken();
      return;
    }

    // Local Storage OAuth mode when no Google Cloud Client ID is set yet
    setLocalGoogleModalOpen(true);
  };

  const handleLocalGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signInWithGoogleProfile({
      name: googleName,
      email: googleEmail,
    });
    if (!result.ok && result.error) {
      setError(result.error);
      return;
    }
    setLocalGoogleModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Minimal Top Announcement */}
      <div className="bg-neutral-900 text-neutral-100 text-[11px] tracking-[0.16em] uppercase py-2.5 px-4 text-center">
        Members-Only Clinical Access • Sign In to Unlock Code DERM15 (15% Off)
      </div>

      {/* Split Luxury Auth Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Brand Showcase */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#F3EFEA] border-r border-neutral-200 p-12 xl:p-20 flex-col justify-between">
          <div>
            <span className="block text-2xl font-bold tracking-[0.28em] text-neutral-950">
              DERMSTORE
            </span>
            <span className="block text-[10px] tracking-[0.24em] uppercase text-neutral-500 mt-0.5">
              Est. 1999 • Authorized Clinical Partner
            </span>
          </div>

          <div className="max-w-md space-y-6 my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-neutral-300 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-800">
              <Sparkles className="w-3 h-3 text-amber-800" />
              Private Client Access
            </div>

            <h1 className="font-serif text-4xl xl:text-5xl font-semibold text-neutral-950 leading-[1.1]">
              Medical-Grade Skincare, Curated for Your Skin.
            </h1>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Sign in or create your complimentary Dermstore account to access SkinCeuticals, EltaMD, Obagi Medical, persistent shopping bags, and exclusive member rewards.
            </p>

            <div className="space-y-3 pt-4 border-t border-neutral-300/70 text-xs text-neutral-700">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>100% Authentic Physician-Dispensed Formulas</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>Free US Standard Shipping on Orders Over $50</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>Persistent Shopping Bag &amp; Instant Checkout</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Dermstore • Encrypted Session &amp; Local Credential Storage
          </p>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md bg-white border border-neutral-200 p-7 sm:p-9 shadow-sm">
            {/* Mobile Brand Wordmark */}
            <div className="lg:hidden text-center mb-6 pb-5 border-b border-neutral-100">
              <span className="block text-xl font-bold tracking-[0.28em] text-neutral-950">
                DERMSTORE
              </span>
              <span className="block text-[9px] tracking-[0.22em] uppercase text-neutral-500 mt-0.5">
                Clinical Skin &amp; Luxury Care
              </span>
            </div>

            {/* Sign In / Create Account Tabs */}
            <div className="grid grid-cols-2 border-b border-neutral-200 mb-6">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.18em] border-b-2 transition-colors ${
                  mode === 'signin'
                    ? 'border-neutral-950 text-neutral-950'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.18em] border-b-2 transition-colors ${
                  mode === 'signup'
                    ? 'border-neutral-950 text-neutral-950'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-950">
                {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {mode === 'signin'
                  ? 'Sign in with Google OAuth or your registered email and password.'
                  : 'Register with email & password (saved in localStorage) or Google OAuth.'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleOAuthClick}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-900 py-3 px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:opacity-60"
            >
              {/* Official Multicolor Google G Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.6H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.4l3.99-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.6l3.99 3.09c.95-2.85 3.6-4.94 6.72-4.94z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 shrink-0">
                Or With Email
              </span>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Shoaib Patel"
                      className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
                    className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-neutral-900 text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>{mode === 'signin' ? 'Sign In to Dermstore' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Mode Switch */}
            <p className="text-xs text-neutral-500 text-center mt-6 pt-5 border-t border-neutral-100">
              {mode === 'signin' ? (
                <>
                  New to Dermstore?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-semibold text-neutral-900 underline underline-offset-4"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="font-semibold text-neutral-900 underline underline-offset-4"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Google OAuth Dialog (Local Dev Mode when VITE_GOOGLE_CLIENT_ID is not yet in .env) */}
      {localGoogleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-oauth-dialog-title"
        >
          <div
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-[2px]"
            onClick={() => setLocalGoogleModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white border border-neutral-200 shadow-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.6H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.4l3.99-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.6l3.99 3.09c.95-2.85 3.6-4.94 6.72-4.94z"
                  />
                </svg>
                <h3
                  id="google-oauth-dialog-title"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900"
                >
                  Google Sign-In (Local OAuth Mode)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLocalGoogleModalOpen(false)}
                aria-label="Close Google sign-in modal"
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mt-4 leading-relaxed">
              Enter your Google profile details below to sign in and persist your OAuth session in{' '}
              <code className="bg-neutral-100 px-1 py-0.5 text-[11px]">localStorage</code>.
            </p>

            <form onSubmit={handleLocalGoogleSubmit} className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="google-name"
                  className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 mb-1"
                >
                  Google Display Name
                </label>
                <input
                  id="google-name"
                  type="text"
                  required
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Shoaib Patel"
                  className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="google-email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 mb-1"
                >
                  Google Email (Gmail)
                </label>
                <input
                  id="google-email"
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-[#F6F5F2] border border-neutral-300 focus:border-neutral-900 focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 text-white py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-neutral-800 transition-colors"
              >
                Authorize &amp; Continue
              </button>
            </form>

            <p className="text-[11px] text-neutral-400 mt-4 pt-3 border-t border-neutral-100 leading-relaxed">
              <strong>Live Google Cloud OAuth:</strong> Set{' '}
              <code className="text-neutral-600">VITE_GOOGLE_CLIENT_ID</code> in a{' '}
              <code className="text-neutral-600">.env</code> file to automatically launch Google&apos;s live OAuth 2.0 popup.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
