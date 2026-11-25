import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, KeyRound, Mail, Plus, ShieldCheck, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { ApiError, apiRequest } from '../lib/api';
import {
  MOTION_SPRING,
  createSlideUpVariants,
  createStaggerContainerVariants,
  createStaggerItemVariants,
  useMotionPreference,
} from '../lib/motion';
import type { GamificationConfig, RegistrationCodeAudit } from '../types/domain';
import {
  ResponsiveTable,
  ResponsiveTableBody,
  ResponsiveTableCell,
  ResponsiveTableHead,
  ResponsiveTableHeader,
  ResponsiveTableRow,
} from '../components/ResponsiveTable';

interface GeneratedCode {
  id: string;
  code: string;
  codeHint: string;
  expiresAt: string | null;
}

interface AdminSettingsResponse {
  gamification: GamificationConfig;
  auth: { requireEmailVerification: boolean };
  mailtrap: {
    configured: boolean;
    mode: 'production' | 'sandbox' | 'unconfigured';
    hasSenderEmail: boolean;
    hasSandboxInbox: boolean;
  };
  usersCount: number;
}

export const AdminView: React.FC = () => {
  const { lang, pushToast, refreshUser } = useApp();
  const reducedMotion = useMotionPreference();
  const [codes, setCodes] = useState<RegistrationCodeAudit[]>([]);
  const [newlyGenerated, setNewlyGenerated] = useState<GeneratedCode[]>([]);
  const [count, setCount] = useState(1);
  const [label, setLabel] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [settings, setSettings] = useState<AdminSettingsResponse | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const loadAdminData = async () => {
    const [cRes, sRes] = await Promise.allSettled([
      apiRequest<{ codes: RegistrationCodeAudit[] }>('/api/admin/codes'),
      apiRequest<AdminSettingsResponse>('/api/admin/settings'),
    ]);
    if (cRes.status === 'fulfilled') setCodes(cRes.value.codes);
    if (sRes.status === 'fulfilled') setSettings(sRes.value);
    const failed401 =
      (cRes.status === 'rejected' && cRes.reason instanceof ApiError && cRes.reason.status === 401) ||
      (sRes.status === 'rejected' && sRes.reason instanceof ApiError && sRes.reason.status === 401);
    if (failed401) {
      pushToast(t(lang, 'sessionExpiredToast'), 'error');
      await refreshUser();
    }
  };

  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<{ generated: GeneratedCode[] }>('/api/admin/codes', {
        method: 'POST',
        body: { count, label, expiresInDays },
      });
      setNewlyGenerated(res.generated);
      setLabel('');
      await loadAdminData();
      pushToast(`+${res.generated.length}`, 'success');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Code generation failed.', 'error');
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await apiRequest(`/api/admin/codes/${id}/revoke`, { method: 'POST' });
      await loadAdminData();
      pushToast(t(lang, 'revokeBtn'), 'info');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Revoke failed.', 'error');
    }
  };

  const handleCopy = async (code: string, rowId?: string) => {
    try {
      await navigator.clipboard.writeText(code);
      if (rowId) {
        setCopiedCodeId(rowId);
        setTimeout(() => {
          setCopiedCodeId((prev) => (prev === rowId ? null : prev));
        }, 1600);
      }
      pushToast('✓', 'success');
    } catch {
      pushToast('Copy failed — select and copy manually.', 'error');
    }
  };

  const toggleEmailVerification = async () => {
    if (!settings) return;
    try {
      const nextVal = !settings.auth.requireEmailVerification;
      const res = await apiRequest<{ auth: { requireEmailVerification: boolean } }>('/api/admin/settings', {
        method: 'PATCH',
        body: { auth: { requireEmailVerification: nextVal } },
      });
      setSettings({ ...settings, auth: res.auth });
      pushToast(
        `${t(lang, 'emailVerificationToggle')}: ${nextVal ? t(lang, 'mandatoryLabel') : t(lang, 'optionalLabel')}`,
        'info'
      );
    } catch {
      pushToast('Failed to update setting.', 'error');
    }
  };

  const toggleStreakProtection = async () => {
    if (!settings) return;
    try {
      const nextVal = !settings.gamification.streakProtectionEnabled;
      const res = await apiRequest<{ gamification: GamificationConfig }>('/api/admin/settings', {
        method: 'PATCH',
        body: { gamification: { streakProtectionEnabled: nextVal } },
      });
      setSettings({ ...settings, gamification: res.gamification });
      pushToast(
        `${t(lang, 'streakFreezeShopToggle')}: ${nextVal ? t(lang, 'enabledLabel') : t(lang, 'disabledLabel')}`,
        'info'
      );
    } catch {
      pushToast('Failed to update setting.', 'error');
    }
  };

  const containerVariants = createStaggerContainerVariants(0.045, 0.01);
  const sectionVariants = createStaggerItemVariants(reducedMotion, 8);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 min-w-0"
    >
      <motion.div variants={sectionVariants}>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <ShieldCheck size={22} className="text-[#DD0000] shrink-0" />
          <span>{t(lang, 'adminTitle')}</span>
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          {t(lang, 'adminDesc')}
        </p>
      </motion.div>

      {/* Mailtrap & Auth Status */}
      {settings && (
        <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Mail size={16} />
                <span>{t(lang, 'mailtrapTitle')}</span>
              </span>
              <span className="text-xs font-mono-tabular font-semibold text-neutral-600 dark:text-neutral-300 uppercase">
                {settings.mailtrap.mode}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {settings.mailtrap.configured
                ? `${t(lang, 'mailtrapActiveNote')} ${settings.mailtrap.mode}`
                : t(lang, 'mailtrapUnconfiguredNote')}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                {t(lang, 'policyTogglesTitle')} ({settings.usersCount} {t(lang, 'registeredUsersSuffix')})
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                type="button"
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={MOTION_SPRING.snappy}
                onClick={toggleEmailVerification}
                className="px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {t(lang, 'emailVerificationToggle')}:{' '}
                {settings.auth.requireEmailVerification ? t(lang, 'mandatoryLabel') : t(lang, 'optionalLabel')}
              </motion.button>
              <motion.button
                type="button"
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={MOTION_SPRING.snappy}
                onClick={toggleStreakProtection}
                className="px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {t(lang, 'streakFreezeShopToggle')}:{' '}
                {settings.gamification.streakProtectionEnabled ? t(lang, 'enabledLabel') : t(lang, 'disabledLabel')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Generate Single-Use Registration Codes */}
      <motion.form
        variants={sectionVariants}
        onSubmit={handleGenerate}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6 space-y-4"
      >
        <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <KeyRound size={16} />
          <span>{t(lang, 'generateCodesTitle')}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
              {t(lang, 'quantityRangeLabel')}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm font-mono-tabular"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
              {t(lang, 'batchLabelInput')}
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t(lang, 'batchLabelPlaceholder')}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
              {t(lang, 'expiryDaysLabel')}
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm font-mono-tabular"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          transition={MOTION_SPRING.snappy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold cursor-pointer min-h-[44px] transition-colors"
        >
          <Plus size={16} />
          <span>{t(lang, 'generateCodesBtn')}</span>
        </motion.button>

        <AnimatePresence>
          {newlyGenerated.length > 0 && (
            <motion.div
              key="generated-codes-banner"
              variants={createSlideUpVariants(reducedMotion, 8)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 p-4 rounded-xl border border-[#FFCE00] bg-[#FFCE00]/10 space-y-2"
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-[#FFCE00]">
                {t(lang, 'copyCodesWarning')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {newlyGenerated.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  >
                    <code className="font-mono-tabular text-sm font-bold text-neutral-900 dark:text-white break-all">
                      {g.code}
                    </code>
                    <motion.button
                      type="button"
                      whileTap={reducedMotion ? undefined : { scale: 0.85 }}
                      onClick={() => handleCopy(g.code)}
                      className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer shrink-0"
                      title="Copy code"
                    >
                      <Copy size={14} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Code Audit Table */}
      <motion.div
        variants={sectionVariants}
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] overflow-hidden min-w-0"
      >
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-sm font-display font-bold text-neutral-900 dark:text-white">
          {t(lang, 'codeAuditTitle')}
        </div>
        {codes.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500">{t(lang, 'noCodesYet')}</div>
        ) : (
          <ResponsiveTable
            columnCount={6}
            wrapperClassName="overflow-x-auto"
            className="w-full text-left text-xs"
          >
            <ResponsiveTableHead className="bg-neutral-50 dark:bg-neutral-900/70 text-neutral-500">
              <tr>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold">
                  {t(lang, 'colCodeHint')}
                </ResponsiveTableHeader>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold">
                  {t(lang, 'colLabel')}
                </ResponsiveTableHeader>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold">
                  {t(lang, 'colStatus')}
                </ResponsiveTableHeader>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold">
                  {t(lang, 'colRedeemedBy')}
                </ResponsiveTableHeader>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold">
                  {t(lang, 'colExpires')}
                </ResponsiveTableHeader>
                <ResponsiveTableHeader scope="col" className="px-4 py-3 font-semibold text-right">
                  {t(lang, 'colAction')}
                </ResponsiveTableHeader>
              </tr>
            </ResponsiveTableHead>
            <ResponsiveTableBody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {codes.map((c) => (
                <ResponsiveTableRow key={c.id} className="">
                  <ResponsiveTableCell
                    label={t(lang, 'colCodeHint')}
                    className="px-4 py-3 font-mono-tabular font-semibold text-neutral-900 dark:text-white whitespace-nowrap"
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <span>{c.code_hint}</span>
                      {c.status === 'active' && c.full_code && (
                        <button
                          type="button"
                          onClick={() => handleCopy(c.full_code!, c.id)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                          title="Copy full code"
                          aria-label="Copy full code"
                        >
                          {copiedCodeId === c.id ? (
                            <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell
                    label={t(lang, 'colLabel')}
                    className="px-4 py-3 text-neutral-600 dark:text-neutral-300"
                  >
                    {c.label || '—'}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell
                    label={t(lang, 'colStatus')}
                    className="px-4 py-3 uppercase font-semibold"
                  >
                    <span
                      className={
                        c.status === 'active'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : c.status === 'redeemed'
                          ? 'text-neutral-500'
                          : 'text-[#DD0000]'
                      }
                    >
                      {c.status}
                    </span>
                  </ResponsiveTableCell>
                  <ResponsiveTableCell
                    label={t(lang, 'colRedeemedBy')}
                    className="px-4 py-3 text-neutral-600 dark:text-neutral-300"
                  >
                    {c.redeemed_by_username || '—'}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell
                    label={t(lang, 'colExpires')}
                    className="px-4 py-3 font-mono-tabular text-neutral-500 whitespace-nowrap"
                  >
                    {c.expires_at
                      ? new Date(c.expires_at).toLocaleDateString(
                          lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
                        )
                      : t(lang, 'neverExpires')}
                  </ResponsiveTableCell>
                  <ResponsiveTableCell
                    label={t(lang, 'colAction')}
                    className="px-4 py-3 text-right whitespace-nowrap"
                  >
                    {c.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(c.id)}
                        className="inline-flex items-center gap-1 text-[#DD0000] hover:underline font-semibold cursor-pointer"
                      >
                        <XCircle size={13} />
                        <span>{t(lang, 'revokeBtn')}</span>
                      </button>
                    )}
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              ))}
            </ResponsiveTableBody>
          </ResponsiveTable>
        )}
      </motion.div>
    </motion.div>
  );
};
