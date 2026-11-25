import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  BarChart3,
  Check,
  Coins,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import {
  BrandMark,
  isAnimatedCosmeticKey,
  ShopItemPreview,
  UserAvatar,
  UserBadgeIcon,
  UserBannerBackdrop,
} from '../components/BrandMark';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  CelebrationBurst,
  MotionModal,
  useIsMobileViewport,
} from '../components/motion/MotionPrimitives';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import {
  MOTION_SPRING,
  accordionVariants,
  createStaggerContainerVariants,
  createStaggerItemVariants,
  pulseTransition,
  useMotionPreference,
} from '../lib/motion';
import type { AchievementItem, InterfaceLang, ShopItem, ThemeMode } from '../types/domain';

type CustomizeCategory = 'avatars' | 'frames' | 'banners' | 'badges' | 'themes';

export const ProfileSettingsView: React.FC = () => {
  const { user, lang, setLangLocal, theme, setThemeLocal, refreshUser, setUser, signOut, pushToast, setScreen } = useApp();
  const reducedMotion = useMotionPreference();
  const isMobile = useIsMobileViewport(768);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [selectedLang, setSelectedLang] = useState<InterfaceLang>(lang);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme);
  const [leaderboardVisible, setLeaderboardVisible] = useState(user?.leaderboardVisible ?? true);
  const [reducedMotionPref, setReducedMotionPref] = useState(user?.reducedMotion ?? false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [inventory, setInventory] = useState<ShopItem[]>([]);

  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<CustomizeCategory>('avatars');
  const [equippingId, setEquippingId] = useState<string | null>(null);
  const [claimedAchId, setClaimedAchId] = useState<string | null>(null);
  const claimBurstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Security forms
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadExtras = async () => {
    const [achRes, shopRes] = await Promise.allSettled([
      apiRequest<{ achievements: AchievementItem[] }>('/api/achievements'),
      apiRequest<{ items: ShopItem[] }>('/api/shop'),
    ]);
    if (achRes.status === 'fulfilled') setAchievements(achRes.value.achievements);
    if (shopRes.status === 'fulfilled') {
      setInventory(shopRes.value.items.filter((it) => it.ownedQuantity > 0));
    }
  };

  useEffect(() => {
    loadExtras();
    return () => {
      if (claimBurstTimerRef.current) clearTimeout(claimBurstTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setSelectedLang(lang);
  }, [lang]);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  if (!user) return null;

  const isUnlimitedCoins = user.role === 'admin' || Boolean(user.unlimitedCoins);
  const activeBanner = user.equipped?.banner?.value;
  const hasBanner = Boolean(activeBanner);
  const unlockedCosmetics = inventory.filter((it) => !it.isConsumable && it.ownedQuantity > 0);
  const claimableAchievementsCount =
    achievements.length > 0
      ? achievements.filter((ach) => ach.unlocked && !ach.claimed).length
      : user.claimableAchievements || 0;
  const sortedAchievements = [...achievements].sort((a, b) => {
    const rank = (item: AchievementItem) => (item.unlocked && !item.claimed ? 0 : item.unlocked ? 1 : 2);
    return rank(a) - rank(b);
  });

  const filterByCustomizeCategory = (cat: CustomizeCategory): ShopItem[] => {
    switch (cat) {
      case 'avatars':
        return unlockedCosmetics.filter((it) => it.effectType === 'avatar');
      case 'frames':
        return unlockedCosmetics.filter((it) => it.effectType === 'frame');
      case 'banners':
        return unlockedCosmetics.filter((it) => it.effectType === 'banner');
      case 'badges':
        return unlockedCosmetics.filter((it) => it.effectType === 'badge');
      case 'themes':
        return unlockedCosmetics.filter(
          (it) => it.effectType === 'theme_accent' || it.effectType === 'celebration',
        );
    }
  };

  const handleSavePrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      const res = await apiRequest<{ user: typeof user }>('/api/user/profile', {
        method: 'PATCH',
        body: {
          displayName: displayName.trim(),
          interfaceLang: selectedLang,
          theme: selectedTheme,
          leaderboardVisible,
          reducedMotion: reducedMotionPref,
        },
      });
      setUser(res.user);
      setLangLocal(res.user.interfaceLang);
      setThemeLocal(res.user.theme);
      pushToast(t(selectedLang, 'preferencesSavedToast'), 'success');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Failed to save preferences.', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleClaimAchievement = async (ach: AchievementItem) => {
    try {
      const res = await apiRequest<{ coinDelta: number }>(`/api/achievements/${ach.id}/claim`, {
        method: 'POST',
      });
      setClaimedAchId(ach.id);
      if (claimBurstTimerRef.current) clearTimeout(claimBurstTimerRef.current);
      claimBurstTimerRef.current = setTimeout(() => {
        setClaimedAchId((cur) => (cur === ach.id ? null : cur));
      }, 950);
      await Promise.all([loadExtras(), refreshUser()]);
      const achTitle = ach.name_i18n[lang] || ach.name_i18n.en;
      pushToast(achTitle, 'reward', {
        title: t(lang, 'achievementUnlockedTitle'),
        deltaLabel: `+${res.coinDelta} ${t(lang, 'coinBalance')}`,
      });
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Could not claim achievement.', 'error');
    }
  };

  const handleEquipToggle = async (item: ShopItem) => {
    setEquippingId(item.id);
    try {
      await apiRequest('/api/inventory/equip', {
        method: 'POST',
        body: { itemId: item.id, equip: !item.equipped },
      });
      await Promise.all([loadExtras(), refreshUser()]);
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Failed to update equipment.', 'error');
    } finally {
      setEquippingId(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/api/user/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword, confirmPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await loadExtras();
      pushToast(t(lang, 'passwordUpdatedToast'), 'success');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Password change failed.', 'error');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/api/user/account', {
        method: 'DELETE',
        body: { password: deletePassword },
      });
      setUser(null);
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Account deletion failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Identity Header */}
      <section
        className={`relative rounded-2xl border p-5 sm:p-6 overflow-hidden ${
          hasBanner
            ? 'border-neutral-800 bg-neutral-950'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A]'
        }`}
      >
        <UserBannerBackdrop bannerKey={activeBanner} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            <UserAvatar
              displayName={user.displayName}
              avatarKey={user.equipped?.avatar?.value}
              frameKey={user.equipped?.frame?.value}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h2
                  className={`text-lg sm:text-xl font-display font-bold break-words [overflow-wrap:anywhere] ${
                    hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {user.displayName}
                </h2>
                <UserBadgeIcon badgeKey={user.equipped?.badge?.value} />
              </div>
              <div
                className={`text-xs font-mono-tabular mt-0.5 break-words [overflow-wrap:anywhere] ${
                  hasBanner ? 'text-neutral-200' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                @{user.username} · {user.email} · {user.role}
              </div>
              <div
                className={`text-xs font-mono-tabular mt-1 ${
                  hasBanner ? 'text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {t(lang, 'levelShort')} {user.level.level} · {user.xpTotal} XP ·{' '}
                {isUnlimitedCoins
                  ? `∞ ${t(lang, 'coinBalance')}`
                  : `${user.coinsBalance} ${t(lang, 'coinBalance')}`}{' '}
                · {t(lang, 'streakFreezeShort')}: {user.streakFreezesAvailable}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCustomizeModal(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer min-h-[44px] transition-colors ${
                hasBanner
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xs'
                  : 'border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-[#DD0000] text-neutral-900 dark:text-white'
              }`}
            >
              <Pencil size={14} />
              <span>{t(lang, 'customizeProfileBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-expanded={showSettings}
              aria-label={t(lang, 'settingsToggleBtn')}
              title={t(lang, 'settingsToggleBtn')}
              className={`inline-flex items-center justify-center p-2.5 rounded-xl text-xs font-semibold cursor-pointer min-h-[44px] min-w-[44px] transition-colors ${
                showSettings
                  ? 'bg-[#DD0000] border border-[#DD0000] text-white'
                  : hasBanner
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xs'
                  : 'border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-[#DD0000] text-neutral-900 dark:text-white'
              }`}
            >
              <Settings size={16} />
            </button>
            <PWAInstallButton compact />
          </div>
        </div>
      </section>

      {/* Quick Navigation Shortcuts (Leaderboard, Statistics, Achievements, Admin) */}
      <section
        className={`grid gap-2.5 ${
          user.role === 'admin' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        <button
          type="button"
          onClick={() => setScreen('leaderboard')}
          className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-xs font-semibold text-neutral-900 dark:text-white text-left cursor-pointer min-h-[44px] flex items-center gap-2.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <Trophy size={16} className="text-[#D99B00] dark:text-[#FFCE00] shrink-0" />
          <span className="truncate">{t(lang, 'navLeaderboard')}</span>
        </button>
        <button
          type="button"
          onClick={() => setScreen('statistics')}
          className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-xs font-semibold text-neutral-900 dark:text-white text-left cursor-pointer min-h-[44px] flex items-center gap-2.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <BarChart3 size={16} className="text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span className="truncate">{t(lang, 'navStatistics')}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowAchievementsModal(true)}
          className="relative p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] text-xs font-semibold text-neutral-900 dark:text-white text-left cursor-pointer min-h-[44px] flex items-center gap-2.5 hover:border-[#DD0000] dark:hover:border-[#FFCE00]/70 transition-colors"
        >
          <Award size={16} className="text-[#D99B00] dark:text-[#FFCE00] shrink-0" />
          <span className="truncate">{t(lang, 'achievementsTitle')}</span>
          {claimableAchievementsCount > 0 && (
            <span
              aria-label={`${claimableAchievementsCount} ${t(lang, 'claimableAchievementsHint')}`}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#DD0000] text-white text-[11px] font-mono-tabular font-bold leading-none inline-flex items-center justify-center shadow-xs ring-2 ring-[#F8F9FA] dark:ring-[#0A0B0E]"
            >
              {claimableAchievementsCount}
            </span>
          )}
        </button>
        {user.role === 'admin' && (
          <button
            type="button"
            onClick={() => setScreen('admin')}
            className="p-3 rounded-xl border border-[#DD0000]/40 bg-[#DD0000]/5 text-xs font-semibold text-[#DD0000] dark:text-[#FFCE00] text-left cursor-pointer min-h-[44px] flex items-center gap-2.5 hover:border-[#DD0000] transition-colors"
          >
            <ShieldCheck size={16} className="shrink-0" />
            <span className="truncate">{t(lang, 'navAdmin')}</span>
          </button>
        )}
      </section>

      {/* Owned Inventory */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
              {t(lang, 'inventoryTitle')}
            </h3>
            <button
              type="button"
              onClick={() => setShowCustomizeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-[#DD0000] text-xs font-semibold text-neutral-900 dark:text-white cursor-pointer min-h-[36px]"
            >
              <Plus size={14} />
              <span>{t(lang, 'customizeProfileBtn')}</span>
            </button>
          </div>
          {inventory.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t(lang, 'emptyInventory')}
            </p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[420px] overflow-y-auto pr-1">
              {inventory.map((item) => {
                const animated =
                  isAnimatedCosmeticKey(item.imageKey) || isAnimatedCosmeticKey(item.effectValue);
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                        <ShopItemPreview imageKey={item.imageKey} size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {item.name_i18n[lang] || item.name_i18n.en}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.isConsumable
                            ? `${t(lang, 'quantityLabel')}: ${item.ownedQuantity}`
                            : item.effectType === 'avatar'
                            ? t(lang, 'effectAvatar')
                            : item.effectType === 'frame'
                            ? t(lang, 'effectFrame')
                            : item.effectType === 'banner'
                            ? t(lang, 'effectBanner')
                            : item.effectType === 'badge'
                            ? t(lang, 'effectBadge')
                            : item.effectType === 'theme_accent'
                            ? t(lang, 'effectThemeAccent')
                            : item.effectType === 'celebration'
                            ? t(lang, 'effectCelebration')
                            : item.effectType.replace('_', ' ')}
                          {animated ? ` · ${t(lang, 'animatedTierLabel')}` : ''}
                        </div>
                      </div>
                    </div>
                    {!item.isConsumable && (
                      <button
                        type="button"
                        disabled={equippingId === item.id}
                        onClick={() => handleEquipToggle(item)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 min-h-[36px] ${
                          item.equipped
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {item.equipped && <Check size={13} />}
                        <span>{item.equipped ? t(lang, 'unequipBtn') : t(lang, 'equipBtn')}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </section>

      {/* About Webapp Footer Info */}
      <footer className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3.5">
          <BrandMark size="lg" />
          <div className="min-w-0">
            <span className="font-display font-extrabold tracking-tight text-base text-neutral-900 dark:text-white block">
              {t(lang, 'brandName')}
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t(lang, 'brandSubtitle')}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {t(lang, 'heroAuthDesc')}
        </p>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          <div className="py-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'createdByLabel')}</span>
            <span className="font-semibold text-neutral-900 dark:text-white text-right">
              {t(lang, 'createdByAuthor')}
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'heroScopeLabel')}</span>
            <span className="font-mono-tabular text-neutral-800 dark:text-neutral-200 text-right">
              {t(lang, 'heroScopeValue')}
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'heroModesLabel')}</span>
            <span className="font-mono-tabular text-neutral-800 dark:text-neutral-200 text-right">
              {t(lang, 'heroModesValue')}
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'heroLangsLabel')}</span>
            <span className="font-mono-tabular text-neutral-800 dark:text-neutral-200 text-right">
              {t(lang, 'heroLangsValue')}
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'aboutOfflineLabel')}</span>
            <span className="font-mono-tabular text-neutral-800 dark:text-neutral-200 text-right">
              {t(lang, 'aboutOfflineValue')}
            </span>
          </div>
          <div className="pt-2 flex items-center justify-between gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'aboutPlatformLabel')}</span>
            <span className="text-neutral-800 dark:text-neutral-200 text-right">
              {t(lang, 'aboutPlatformValue')}
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Log Out Button */}
      <div className="lg:hidden flex justify-center pt-1">
        <button
          type="button"
          onClick={signOut}
          aria-label={t(lang, 'signOut')}
          title={t(lang, 'signOut')}
          className="inline-flex items-center justify-center p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-[#DD0000] hover:bg-[#DD0000]/10 cursor-pointer min-h-[44px] min-w-[44px] transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Profile Customization Modal */}
      <MotionModal
        open={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        maxWidthClass="sm:max-w-2xl"
        mobileBottomSheet
        panelClassName="flex flex-col overflow-hidden"
        ariaLabel={t(lang, 'customizeModalTitle')}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3
              id="customize-modal-title"
              className="text-base sm:text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2"
            >
              <Sparkles size={18} className="text-[#D99B00] dark:text-[#FFCE00] shrink-0" />
              <span>{t(lang, 'customizeModalTitle')}</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              {t(lang, 'customizeModalDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomizeModal(false)}
            aria-label={t(lang, 'close')}
            className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Strip */}
        <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t(lang, 'livePreviewLabel')}
          </div>
          <motion.div
            key={`${user.equipped?.avatar?.value || 'none'}-${user.equipped?.frame?.value || 'none'}-${activeBanner || 'none'}-${user.equipped?.badge?.value || 'none'}`}
            initial={reducedMotion ? false : { opacity: 0.72, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={MOTION_SPRING.snappy}
            className={`relative rounded-xl border p-4 overflow-hidden ${
              hasBanner
                ? 'border-neutral-800 bg-neutral-950'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
            }`}
          >
            <UserBannerBackdrop bannerKey={activeBanner} compact />
            <div className="relative z-10 flex items-center gap-3.5 min-w-0">
              <UserAvatar
                displayName={user.displayName}
                avatarKey={user.equipped?.avatar?.value}
                frameKey={user.equipped?.frame?.value}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-base font-display font-bold truncate ${
                      hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {user.displayName}
                  </span>
                  <UserBadgeIcon badgeKey={user.equipped?.badge?.value} />
                </div>
                <div
                  className={`text-xs font-mono-tabular mt-0.5 ${
                    hasBanner ? 'text-neutral-200' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  @{user.username} · {t(lang, 'levelShort')} {user.level.level} · {user.xpTotal} XP
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
            {(
              [
                { id: 'avatars', label: t(lang, 'customizeCatAvatars') },
                { id: 'frames', label: t(lang, 'customizeCatFrames') },
                { id: 'banners', label: t(lang, 'customizeCatBanners') },
                { id: 'badges', label: t(lang, 'customizeCatBadges') },
                { id: 'themes', label: t(lang, 'customizeCatThemes') },
              ] as Array<{ id: CustomizeCategory; label: string }>
            ).map((tab) => {
              const count = filterByCustomizeCategory(tab.id).length;
              const active = customizeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCustomizeTab(tab.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer min-h-[40px] transition-colors ${
                    active
                      ? 'text-white dark:text-black'
                      : 'border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="customize-cat-pill"
                      transition={MOTION_SPRING.snappy}
                      className="absolute inset-0 rounded-xl bg-black dark:bg-white"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {tab.label} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Inventory Items */}
        <div className="p-5 overflow-y-auto flex-1">
          {(() => {
            const items = filterByCustomizeCategory(customizeTab);
            if (items.length === 0) {
              return (
                <div className="py-10 text-center space-y-3">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t(lang, 'emptyCategoryMsg')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomizeModal(false);
                      setScreen('shop');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-xs font-semibold cursor-pointer min-h-[44px]"
                  >
                    <ShoppingBag size={15} />
                    <span>{t(lang, 'browseShopBtn')}</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item) => {
                  const animated =
                    isAnimatedCosmeticKey(item.imageKey) ||
                    isAnimatedCosmeticKey(item.effectValue);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                        item.equipped
                          ? 'border-[#DD0000] bg-[#DD0000]/[0.03] dark:bg-[#FFCE00]/[0.04] dark:border-[#FFCE00]/60'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                          <ShopItemPreview imageKey={item.imageKey} size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                            {item.name_i18n[lang] || item.name_i18n.en}
                          </div>
                          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {item.effectType === 'avatar'
                              ? t(lang, 'effectAvatar')
                              : item.effectType === 'frame'
                              ? t(lang, 'effectFrame')
                              : item.effectType === 'banner'
                              ? t(lang, 'effectBanner')
                              : item.effectType === 'badge'
                              ? t(lang, 'effectBadge')
                              : item.effectType === 'theme_accent'
                              ? t(lang, 'effectThemeAccent')
                              : t(lang, 'effectCelebration')}
                            {animated ? ` · ${t(lang, 'animatedTierLabel')}` : ''}
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                            {item.description_i18n[lang] || item.description_i18n.en}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                        disabled={equippingId === item.id}
                        onClick={() => handleEquipToggle(item)}
                        className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer min-h-[44px] transition-colors ${
                          item.equipped
                            ? 'bg-black dark:bg-white text-white dark:text-black'
                            : 'border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-white'
                        }`}
                      >
                        {item.equipped && <Check size={14} />}
                        <span>{item.equipped ? t(lang, 'unequipBtn') : t(lang, 'equipBtn')}</span>
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </MotionModal>

      {/* Achievements Modal / Bottom Sheet */}
      <MotionModal
        open={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        maxWidthClass="sm:max-w-3xl"
        mobileBottomSheet
        panelClassName="flex flex-col overflow-hidden"
        ariaLabel={t(lang, 'achievementsTitle')}
      >
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-[#D99B00] dark:text-[#FFCE00] shrink-0" />
              <span>{t(lang, 'achievementsTitle')}</span>
              {claimableAchievementsCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#DD0000] text-white text-[11px] font-mono-tabular font-bold">
                  {claimableAchievementsCount}
                </span>
              )}
            </h3>
            {claimableAchievementsCount > 0 && (
              <p className="text-xs text-[#DD0000] dark:text-[#FFCE00] font-medium mt-0.5">
                {claimableAchievementsCount} {t(lang, 'claimableAchievementsHint')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAchievementsModal(false)}
            aria-label={t(lang, 'close')}
            className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <motion.div
            variants={createStaggerContainerVariants(isMobile ? 0.025 : 0.035, 0.01)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {sortedAchievements.map((ach) => {
              const claimable = ach.unlocked && !ach.claimed;
              const justClaimed = claimedAchId === ach.id;
              return (
                <motion.div
                  key={ach.id}
                  variants={createStaggerItemVariants(reducedMotion, isMobile ? 6 : 10)}
                >
                  <motion.div
                    animate={
                      justClaimed && !reducedMotion
                        ? { scale: [1, 1.03, 1] }
                        : { scale: 1 }
                    }
                    transition={pulseTransition}
                    className={`relative h-full rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                      claimable
                        ? 'border-[#FFCE00] bg-[#FFCE00]/8 sw-soft-glow'
                        : ach.unlocked
                        ? 'border-[#FFCE00]/60 bg-[#FFCE00]/5'
                        : 'border-neutral-200 dark:border-neutral-800 opacity-75'
                    }`}
                  >
                    <CelebrationBurst active={justClaimed} />
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {ach.name_i18n[lang] || ach.name_i18n.en}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {ach.description_i18n[lang] || ach.description_i18n.en}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="inline-flex items-center gap-1 text-xs font-mono-tabular font-semibold text-neutral-800 dark:text-[#FFCE00]">
                        <Coins size={13} /> +{ach.coinReward}
                      </span>
                      {ach.claimed ? (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {t(lang, 'claimedLabel')}
                        </span>
                      ) : ach.unlocked ? (
                        <motion.button
                          type="button"
                          whileHover={reducedMotion || isMobile ? undefined : { scale: 1.03 }}
                          whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                          transition={MOTION_SPRING.snappy}
                          onClick={() => handleClaimAchievement(ach)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFCE00] text-black text-xs font-bold cursor-pointer"
                        >
                          {t(lang, 'claimReward')}
                        </motion.button>
                      ) : (
                        <span className="text-[11px] text-neutral-400">{t(lang, 'lockedLabel')}</span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </MotionModal>

      {/* Settings & Security Modal / Bottom Sheet */}
      <MotionModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidthClass="sm:max-w-3xl"
        mobileBottomSheet
        panelClassName="flex flex-col overflow-hidden"
        ariaLabel={t(lang, 'settingsSectionTitle')}
      >
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <h3 className="text-base sm:text-lg font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Settings size={18} className="text-[#DD0000] dark:text-[#FFCE00] shrink-0" />
            <span>{t(lang, 'settingsSectionTitle')}</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            aria-label={t(lang, 'close')}
            className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Preferences Form */}
          <form
            onSubmit={handleSavePrefs}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 sm:p-5 space-y-4"
          >
            <h4 className="text-sm font-display font-bold text-neutral-900 dark:text-white">
              {t(lang, 'profileTitle')}
            </h4>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t(lang, 'displayNameLabel')}
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={32}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] text-sm text-neutral-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t(lang, 'languageLabel')}
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as InterfaceLang)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white"
                >
                  <option value="fr">Français (fr)</option>
                  <option value="en">English (en)</option>
                  <option value="de">Deutsch (de)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t(lang, 'themeLabel')}
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value as ThemeMode)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white"
                >
                  <option value="light">{t(lang, 'themeLight')}</option>
                  <option value="dark">{t(lang, 'themeDark')}</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={leaderboardVisible}
                onChange={(e) => setLeaderboardVisible(e.target.checked)}
                className="accent-[#DD0000]"
              />
              <span>{t(lang, 'leaderboardVisibilityLabel')}</span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotionPref}
                onChange={(e) => setReducedMotionPref(e.target.checked)}
                className="accent-[#DD0000]"
              />
              <span>{t(lang, 'reducedMotionLabel')}</span>
            </label>

            <button
              type="submit"
              disabled={savingPrefs}
              className="px-5 py-2.5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
            >
              {savingPrefs ? t(lang, 'savingText') : t(lang, 'saveSettings')}
            </button>
          </form>

          {/* Change Password (Full Width) */}
          <form
            onSubmit={handleChangePassword}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 sm:p-5 space-y-3"
          >
            <h4 className="text-sm font-display font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <KeyRound size={15} />
              <span>{t(lang, 'changePasswordTitle')}</span>
            </h4>
            <input
              type="password"
              required
              placeholder={t(lang, 'currentPasswordPlaceholder')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] text-sm"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder={t(lang, 'newPasswordMinPlaceholder')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] text-sm"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder={t(lang, 'confirmNewPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A] text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-semibold cursor-pointer min-h-[44px]"
            >
              {t(lang, 'updatePasswordBtn')}
            </button>
          </form>

          {/* Delete Account */}
          <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DD0000] cursor-pointer min-h-[44px]"
              >
                <Trash2 size={14} />
                <span>{t(lang, 'deleteAccountBtn')}</span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showDeleteConfirm && (
                <motion.form
                  key="delete-account-confirm"
                  variants={accordionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleDeleteAccount}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-[#DD0000]/8 border border-[#DD0000]/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#DD0000]">
                      <ShieldAlert size={15} className="shrink-0" />
                      <span>{t(lang, 'deleteAccountConfirmPrompt')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="password"
                        required
                        placeholder={t(lang, 'deletePasswordPlaceholder')}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#DD0000] text-white text-xs font-semibold cursor-pointer min-h-[40px]"
                      >
                        {t(lang, 'confirmDeleteBtn')}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionModal>
    </div>
  );
};
