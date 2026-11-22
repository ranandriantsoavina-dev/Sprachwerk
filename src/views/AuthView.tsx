import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { ApiError, apiRequest } from '../lib/api';
import type { InterfaceLang, UserProfile } from '../types/domain';

interface BootstrapStatus {
  needsAdminBootstrap: boolean;
  adminPasscodeRequired: boolean;
  emailVerificationMandatory: boolean;
  mailtrap: {
    configured: boolean;
    mode: 'production' | 'sandbox' | 'unconfigured';
  };
}

export const AuthView: React.FC = () => {
  const { lang, setLangLocal, setUser, pushToast } = useApp();
  const [status, setStatus] = useState<BootstrapStatus | null>(null);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'bootstrap'>('login');

  // URL query tokens for email verification and password reset
  const [urlToken, setUrlToken] = useState('');

  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usageCode, setUsageCode] = useState('');
  const [passcode, setPasscode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoBanner, setInfoBanner] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyTok = params.get('verifyToken');
    const resetTok = params.get('resetToken');

    if (verifyTok) {
      setUrlToken(verifyTok);
      setMode('verify');
      apiRequest<{ verified: boolean; user: UserProfile }>('/api/auth/verify-email', {
        method: 'POST',
        body: { token: verifyTok },
      })
        .then((res) => {
          window.history.replaceState({}, '', '/');
          setUser(res.user);
          pushToast('Email verified. Welcome to SPRACHWERK!', 'success');
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Verification failed.');
        });
    } else if (resetTok) {
      setUrlToken(resetTok);
      setMode('reset');
    }

    apiRequest<BootstrapStatus>('/api/auth/bootstrap-status')
      .then((res) => {
        setStatus(res);
        if (res.needsAdminBootstrap && !verifyTok && !resetTok) {
          setMode('bootstrap');
        }
      })
      .catch(() => {});
  }, [setUser, pushToast]);

  const usernameHasSpaces = /\s/.test(username);
  const usernameInvalidChars = username.length > 0 && !/^[A-Za-z0-9_-]{3,24}$/.test(username);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoBanner(null);

    if (!identifier.includes('@') && /\s/.test(identifier)) {
      setError('Usernames cannot contain spaces.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<{ user: UserProfile }>('/api/auth/login', {
        method: 'POST',
        body: { identifier: identifier.trim(), password },
      });
      setUser(res.user);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Sign-in failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoBanner(null);

    if (usernameHasSpaces) {
      setError('Username cannot contain spaces.');
      return;
    }
    if (!/^[A-Za-z0-9_-]{3,24}$/.test(username)) {
      setError(t(lang, 'usernameHint'));
      return;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms and privacy notice.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<{
        needsVerification: boolean;
        mailResult?: { delivered: boolean; mode: string; error?: string };
        user: UserProfile | null;
      }>('/api/auth/register', {
        method: 'POST',
        body: {
          username: username.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          usageCode: usageCode.trim(),
          acceptTerms,
          interfaceLang: lang,
        },
      });

      if (!res.needsVerification && res.user) {
        setUser(res.user);
        pushToast('Account created and single-use code redeemed.', 'success');
      } else {
        setInfoBanner(
          res.mailResult?.delivered
            ? 'Account created! Check your inbox for the verification link before signing in.'
            : 'Account created in pending state. Configure MAILTRAP_API_TOKEN on the server to deliver verification emails.'
        );
        setMode('login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBootstrapAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (usernameHasSpaces || !/^[A-Za-z0-9_-]{3,24}$/.test(username)) {
      setError(t(lang, 'usernameHint'));
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<{ user: UserProfile }>('/api/auth/bootstrap-admin', {
        method: 'POST',
        body: {
          username: username.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          passcode,
          interfaceLang: lang,
        },
      });
      setUser(res.user);
      pushToast('Administrator account initialized.', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin initialization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoBanner(null);
    setSubmitting(true);
    try {
      const res = await apiRequest<{ ok: boolean; mailtrapConfigured: boolean }>('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim() },
      });
      setInfoBanner(
        res.mailtrapConfigured
          ? 'If an account matches that email, a single-use password reset link has been sent via Mailtrap.'
          : 'Reset request processed. Note: MAILTRAP_API_TOKEN is not yet configured in server environment variables, so external email delivery is inactive.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: { token: urlToken, newPassword: password, confirmPassword },
      });
      window.history.replaceState({}, '', '/');
      setInfoBanner('Your password has been updated. You may now sign in.');
      setPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-neutral-900">
      {/* Top German-flag inspired hairline accent */}
      <div className="h-1 w-full flex shrink-0">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-[#DD0000]" />
        <div className="flex-1 bg-[#FFCE00]" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left / Top Brand Panel (Deep Dark Slate-Blue Accent) */}
        <div className="lg:col-span-5 bg-[#0A0B0E] text-white min-h-[260px] sm:min-h-[300px] lg:min-h-0 px-6 py-10 sm:px-10 sm:py-12 lg:p-12 flex flex-col justify-center items-center lg:justify-between gap-8">
          <div className="lg:flex-1 flex flex-col items-start justify-center text-left space-y-5 max-w-md mx-auto w-full">
            <div className="flex items-center gap-3">
              <BrandMark onDark />
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                SPRACHWERK
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight leading-tight text-white text-balance">
                {t(lang, 'brandSubtitle')}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {t(lang, 'heroAuthDesc')}
              </p>
            </div>
          </div>

          {/* PC / Desktop Curriculum Scope inside Dark Brand Panel */}
          <div className="hidden lg:block max-w-md mx-auto w-full pt-6 border-t border-neutral-800 space-y-4 text-left">
            <div className="space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-neutral-400">{t(lang, 'heroScopeLabel')}</span>
                <span className="font-mono-tabular font-medium text-white text-right">
                  {t(lang, 'heroScopeValue')}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-neutral-400">{t(lang, 'heroModesLabel')}</span>
                <span className="font-mono-tabular font-medium text-white text-right">
                  {t(lang, 'heroModesValue')}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-neutral-400">{t(lang, 'heroLangsLabel')}</span>
                <span className="font-mono-tabular font-medium text-white text-right">
                  {t(lang, 'heroLangsValue')}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-neutral-500">
              {t(lang, 'heroFooterInvite')}
            </div>
          </div>
        </div>

        {/* Right / Main Authentication Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            {/* Top language switcher */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-neutral-500">
                {t(lang, 'brandSubtitle')}
              </div>
              <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-white">
                {(['fr', 'en', 'de'] as InterfaceLang[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLangLocal(code)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase cursor-pointer ${
                      lang === code
                        ? 'bg-black text-white'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6">
              {mode !== 'bootstrap' && mode !== 'reset' && mode !== 'verify' && (
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100">
                  {(
                    [
                      ['login', t(lang, 'tabSignIn')],
                      ['register', t(lang, 'tabRegister')],
                      ['forgot', t(lang, 'tabForgot')],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setError(null);
                        setInfoBanner(null);
                        setMode(id);
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                        mode === id
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#DD0000]/10 border border-[#DD0000]/30 text-sm text-[#DD0000]">
                  <AlertCircle size={17} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {infoBanner && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-800">
                  <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
                  <span>{infoBanner}</span>
                </div>
              )}

              {/* First-Run Admin Bootstrap */}
              {mode === 'bootstrap' && (
                <form onSubmit={handleBootstrapAdmin} className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#DD0000]">
                    <ShieldCheck size={18} />
                    <span>{t(lang, 'bootstrapTitle')}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {t(lang, 'bootstrapDesc')}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'username')}
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="academy_admin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                    {(usernameHasSpaces || usernameInvalidChars) && (
                      <p className="text-xs text-[#DD0000] mt-1">{t(lang, 'usernameHint')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t(lang, 'password')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t(lang, 'confirmPassword')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                  </div>

                  {status?.adminPasscodeRequired && (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t(lang, 'adminPasscode')}
                      </label>
                      <input
                        type="password"
                        required
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
                  >
                    {submitting ? '...' : t(lang, 'createAdminButton')}
                  </button>
                </form>
              )}

              {/* Sign In */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h2 className="text-xl font-display font-bold text-neutral-900">
                    {t(lang, 'signInTitle')}
                  </h2>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'usernameOrEmail')}
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="username or name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'password')}
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
                  >
                    {submitting ? '...' : t(lang, 'signInButton')}
                  </button>
                </form>
              )}

              {/* Registration with Single-Use Usage Code */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-[#DD0000]" />
                    <h2 className="text-xl font-display font-bold text-neutral-900">
                      {t(lang, 'registerTitle')}
                    </h2>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'username')}
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="lukas_berlin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                    <p
                      className={`text-[11px] mt-1 ${
                        usernameHasSpaces || usernameInvalidChars
                          ? 'text-[#DD0000]'
                          : 'text-neutral-500'
                      }`}
                    >
                      {t(lang, 'usernameHint')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="learner@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t(lang, 'password')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t(lang, 'confirmPassword')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'usageCode')}
                    </label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3.5 top-3 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={usageCode}
                        onChange={(e) => setUsageCode(e.target.value.toUpperCase())}
                        placeholder="SW-XXXX-XXXX-XXXX"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm font-mono-tabular uppercase text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {t(lang, 'usageCodeHint')}
                    </p>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 accent-[#DD0000]"
                    />
                    <span>{t(lang, 'acceptTerms')}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
                  >
                    {submitting ? '...' : t(lang, 'createAccountButton')}
                  </button>
                </form>
              )}

              {/* Forgot Password */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#DD0000]" />
                    <h2 className="text-xl font-display font-bold text-neutral-900">
                      {t(lang, 'forgotTitle')}
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {t(lang, 'forgotDesc')}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-black text-white text-sm font-semibold cursor-pointer min-h-[44px]"
                  >
                    {submitting ? '...' : t(lang, 'sendResetButton')}
                  </button>
                </form>
              )}

              {/* Password Reset Completion */}
              {mode === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <h2 className="text-xl font-display font-bold text-neutral-900">
                    {t(lang, 'setNewPasswordTitle')}
                  </h2>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'newPasswordLabel')}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t(lang, 'confirmPassword')}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-transparent text-sm text-neutral-900 focus:outline-none focus:border-[#DD0000]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#DD0000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
                  >
                    {t(lang, 'updatePasswordBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    {t(lang, 'backToSignIn')}
                  </button>
                </form>
              )}

              {/* Email Verification Pending View */}
              {mode === 'verify' && (
                <div className="space-y-4 text-center py-4">
                  <p className="text-sm text-neutral-600">
                    {t(lang, 'verifyingEmailText')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs font-semibold text-[#DD0000] cursor-pointer"
                  >
                    {t(lang, 'backToSignIn')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Only Bottom Info Footer */}
      <footer className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 sm:px-10">
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-neutral-500">{t(lang, 'heroScopeLabel')}</span>
              <span className="font-mono-tabular font-medium text-neutral-900 text-right">
                {t(lang, 'heroScopeValue')}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-neutral-500">{t(lang, 'heroModesLabel')}</span>
              <span className="font-mono-tabular font-medium text-neutral-900 text-right">
                {t(lang, 'heroModesValue')}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-neutral-500">{t(lang, 'heroLangsLabel')}</span>
              <span className="font-mono-tabular font-medium text-neutral-900 text-right">
                {t(lang, 'heroLangsValue')}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
            {t(lang, 'heroFooterInvite')}
          </div>
        </div>
      </footer>
    </div>
  );
};
