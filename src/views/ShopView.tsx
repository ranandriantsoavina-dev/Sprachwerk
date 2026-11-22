import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Coins,
  Flame,
  ShieldCheck,
  Snowflake,
  Sparkles,
  X,
} from 'lucide-react';
import {
  isAnimatedCosmeticKey,
  ShopItemPreview,
  UserAvatar,
  UserBadgeIcon,
  UserBannerBackdrop,
} from '../components/BrandMark';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { apiRequest } from '../lib/api';
import type { InterfaceLang, ShopItem, WalletTransaction } from '../types/domain';

interface ShopPayload {
  coinsBalance: number;
  unlimitedCoins?: boolean;
  streakProtectionEnabled: boolean;
  maxStreakFreezesHeld: number;
  streakFreezesAvailable: number;
  items: ShopItem[];
  transactions: WalletTransaction[];
}

function formatEffectType(lang: InterfaceLang, effectType: string): string {
  switch (effectType) {
    case 'avatar':
      return t(lang, 'effectAvatar');
    case 'frame':
      return t(lang, 'effectFrame');
    case 'badge':
      return t(lang, 'effectBadge');
    case 'banner':
      return t(lang, 'effectBanner');
    case 'theme_accent':
      return t(lang, 'effectThemeAccent');
    case 'celebration':
      return t(lang, 'effectCelebration');
    case 'streak_freeze':
      return t(lang, 'effectStreakFreeze');
    default:
      return effectType.replace(/_/g, ' ');
  }
}

export const ShopView: React.FC = () => {
  const { user, lang, isOnline, pushToast, refreshUser } = useApp();
  const [data, setData] = useState<ShopPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isUnlimitedCoins = Boolean(
    user?.role === 'admin' || user?.unlimitedCoins || data?.unlimitedCoins
  );

  const coinsBalance = data?.coinsBalance ?? user?.coinsBalance ?? 0;

  const loadShop = async () => {
    try {
      const res = await apiRequest<ShopPayload>('/api/shop');
      setData(res);
    } catch {
      pushToast(t(lang, 'shopLoadErrorToast'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedItemId) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setSelectedItemId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItemId]);

  const selectedItem =
    (data?.items || []).find((it) => it.id === selectedItemId) ?? null;

  const handlePurchase = async (item: ShopItem) => {
    if (!isOnline) {
      pushToast(t(lang, 'shopOfflineToast'), 'error');
      return;
    }
    const maxFreezeReached =
      item.effectType === 'streak_freeze' &&
      (data?.streakFreezesAvailable ?? 0) >= (data?.maxStreakFreezesHeld ?? 2);
    const hasEnoughCoins = isUnlimitedCoins || coinsBalance >= item.priceCoins;
    if (maxFreezeReached || !hasEnoughCoins) return;

    setBusyId(item.id);
    try {
      await apiRequest('/api/shop/purchase', {
        method: 'POST',
        body: { itemId: item.id },
      });
      setSelectedItemId(null);
      await Promise.all([loadShop(), refreshUser()]);
      pushToast(`${t(lang, 'shopUnlockedToast')}: ${item.name_i18n[lang] || item.name_i18n.en}`, 'reward');
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Purchase failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    setBusyId(item.id);
    try {
      await apiRequest('/api/inventory/equip', {
        method: 'POST',
        body: { itemId: item.id, equip: !item.equipped },
      });
      await Promise.all([loadShop(), refreshUser()]);
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const categories = [
    { id: 'all', label: t(lang, 'catAll') },
    { id: 'profile_cosmetics', label: t(lang, 'catCosmetics') },
    { id: 'interface_themes', label: t(lang, 'catThemes') },
    { id: 'study_customization', label: t(lang, 'catStudy') },
    { id: 'streak_protection', label: t(lang, 'catStreak') },
    { id: 'limited_seasonal', label: t(lang, 'catSeasonal') },
  ];

  const filteredItems = (data?.items || []).filter((it) =>
    category === 'all' ? true : it.category === category
  );

  const renderLivePreview = (item: ShopItem) => {
    const displayName = user?.displayName || 'Sprachwerk';
    const username = user?.username || 'learner';
    const level = user?.level?.level ?? 1;
    const xpTotal = user?.xpTotal ?? 0;

    if (
      item.effectType === 'avatar' ||
      item.effectType === 'frame' ||
      item.effectType === 'badge' ||
      item.effectType === 'banner'
    ) {
      const previewBanner =
        item.effectType === 'banner' ? item.effectValue : user?.equipped?.banner?.value;
      const previewAvatar =
        item.effectType === 'avatar' ? item.effectValue : user?.equipped?.avatar?.value;
      const previewFrame =
        item.effectType === 'frame' ? item.effectValue : user?.equipped?.frame?.value;
      const previewBadge =
        item.effectType === 'badge' ? item.effectValue : user?.equipped?.badge?.value;
      const hasBanner = Boolean(previewBanner);

      return (
        <div
          className={`relative rounded-xl border p-4 overflow-hidden ${
            hasBanner
              ? 'border-neutral-800 bg-neutral-950'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
          }`}
        >
          <UserBannerBackdrop bannerKey={previewBanner} compact />
          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
            <UserAvatar
              displayName={displayName}
              avatarKey={previewAvatar}
              frameKey={previewFrame}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-base font-display font-bold truncate ${
                    hasBanner ? 'text-white' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {displayName}
                </span>
                <UserBadgeIcon badgeKey={previewBadge} />
              </div>
              <div
                className={`text-xs font-mono-tabular mt-0.5 truncate ${
                  hasBanner ? 'text-neutral-200' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                @{username} · {t(lang, 'levelShort')} {level} · {xpTotal} XP
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.effectType === 'theme_accent') {
      const isPorcelain = item.effectValue === 'porcelain';
      const isGoldArchive = item.effectValue === 'gold_archive';
      return (
        <div
          className={`rounded-xl border p-4 space-y-3 ${
            isPorcelain
              ? 'border-[#E6DEC8] dark:border-neutral-700 bg-[#FAF6EE] dark:bg-[#171512]'
              : isGoldArchive
              ? 'border-[#FFCE00]/65 bg-white dark:bg-[#12141A]'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-display font-bold text-neutral-900 dark:text-white">
                {t(lang, 'themePreviewSampleTitle')}
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                {t(lang, 'themePreviewSampleSubtitle')}
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono-tabular font-bold ${
                isGoldArchive
                  ? 'bg-[#FFCE00] text-black'
                  : 'bg-neutral-900 dark:bg-white text-white dark:text-black'
              }`}
            >
              {t(lang, 'levelShort')} {level}
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full w-2/3 rounded-full ${
                isGoldArchive ? 'bg-[#FFCE00]' : 'bg-[#DD0000]'
              }`}
            />
          </div>
        </div>
      );
    }

    if (item.effectType === 'celebration') {
      return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-black via-[#DD0000] to-black text-white border-b-2 border-[#FFCE00] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={15} className="text-[#FFCE00] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-display font-bold tracking-wide text-[#FFCE00] truncate">
                  {t(lang, 'crimsonRibbonBannerTitle')}
                </div>
                <div className="text-[11px] text-neutral-100 truncate">
                  {t(lang, 'crimsonRibbonBannerDesc')}
                </div>
              </div>
            </div>
            <span className="font-mono-tabular text-xs font-bold text-[#FFCE00] shrink-0">
              100%
            </span>
          </div>
          <div className="px-4 py-2.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            {t(lang, 'sessionCompleteTitle')}
          </div>
        </div>
      );
    }

    if (item.effectType === 'streak_freeze') {
      return (
        <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/20 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-sky-200 dark:border-sky-800 flex items-center justify-center shrink-0">
              <Snowflake size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-display font-bold text-neutral-900 dark:text-white">
                <Flame size={13} className="text-[#DD0000] shrink-0" />
                <span>
                  {user?.currentStreak ?? 0} {t(lang, 'daysUnit')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">
                {t(lang, 'streakFreezePreviewNote')}
              </p>
            </div>
          </div>
          <div className="text-xs font-mono-tabular font-bold text-sky-700 dark:text-sky-300 shrink-0">
            {data?.streakFreezesAvailable ?? 0}/{data?.maxStreakFreezesHeld ?? 2}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 flex items-center justify-center">
        <ShopItemPreview imageKey={item.imageKey} size={32} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
            {t(lang, 'shopTitle')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            {t(lang, 'shopDesc')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] shrink-0 self-start sm:self-auto">
          <Coins size={18} className="text-[#D99B00] dark:text-[#FFCE00]" />
          <span className="font-mono-tabular font-bold text-base text-neutral-900 dark:text-white">
            {isUnlimitedCoins ? '∞' : coinsBalance}
          </span>
          <span className="text-xs text-neutral-500">
            {isUnlimitedCoins ? t(lang, 'unlimitedCoinsLabel') : t(lang, 'coinBalance')}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 w-fit max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              category === cat.id
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <>
          {/* Mobile Compact Square Skeletons */}
          <div className="grid grid-cols-2 min-[340px]:grid-cols-3 gap-2.5 md:hidden">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-square rounded-2xl bg-white dark:bg-[#12141A] border border-neutral-200 dark:border-neutral-800 animate-pulse"
              />
            ))}
          </div>
          {/* Desktop Skeletons */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl bg-white dark:bg-[#12141A] border border-neutral-200 dark:border-neutral-800 animate-pulse"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Mobile Compact Square Tile Grid */}
          <div className="grid grid-cols-2 min-[340px]:grid-cols-3 gap-2.5 md:hidden">
            {filteredItems.map((item) => {
              const name = item.name_i18n[lang] || item.name_i18n.en;
              const owned = item.ownedQuantity > 0;
              const canAfford = isUnlimitedCoins || coinsBalance >= item.priceCoins;
              const animated =
                isAnimatedCosmeticKey(item.imageKey) || isAnimatedCosmeticKey(item.effectValue);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  aria-label={`${name} — ${isUnlimitedCoins ? `0 (${item.priceCoins})` : item.priceCoins} ${t(lang, 'coinBalance')}`}
                  className={`relative aspect-square w-full rounded-2xl border p-2.5 flex flex-col items-center justify-between text-center transition-colors cursor-pointer active:scale-[0.98] overflow-hidden ${
                    item.equipped
                      ? 'border-[#DD0000] dark:border-[#FFCE00] bg-[#DD0000]/[0.03] dark:bg-[#FFCE00]/[0.05]'
                      : owned
                      ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12141A]'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Subtle Corner Indicator */}
                  {item.equipped ? (
                    <span
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  ) : !item.isConsumable && owned ? (
                    <span
                      className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    >
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  ) : animated ? (
                    <span
                      className="absolute top-2 right-2 text-[#DD0000] dark:text-[#FFCE00]"
                      aria-hidden="true"
                    >
                      <Sparkles size={11} />
                    </span>
                  ) : null}

                  {/* Icon / Thumbnail */}
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#FFCE00] flex items-center justify-center shrink-0 mt-1">
                    <ShopItemPreview imageKey={item.imageKey} size={20} />
                  </div>

                  {/* Item Name */}
                  <span className="text-[11px] font-display font-bold text-neutral-900 dark:text-white leading-[1.2] line-clamp-2 w-full px-0.5">
                    {name}
                  </span>

                  {/* Coin Price */}
                  <span
                    className={`inline-flex items-center justify-center gap-1 text-[11px] font-mono-tabular font-bold leading-none ${
                      !owned && !canAfford
                        ? 'text-neutral-400 dark:text-neutral-500'
                        : 'text-neutral-900 dark:text-[#FFCE00]'
                    }`}
                  >
                    <Coins
                      size={11}
                      className={
                        !owned && !canAfford
                          ? 'text-neutral-400 dark:text-neutral-500 shrink-0'
                          : 'text-[#D99B00] dark:text-[#FFCE00] shrink-0'
                      }
                    />
                    <span>{isUnlimitedCoins ? `0 (${item.priceCoins})` : item.priceCoins}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Card Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const name = item.name_i18n[lang] || item.name_i18n.en;
              const desc = item.description_i18n[lang] || item.description_i18n.en;
              const owned = item.ownedQuantity > 0;
              const maxFreezeReached =
                item.effectType === 'streak_freeze' &&
                (data?.streakFreezesAvailable ?? 0) >= (data?.maxStreakFreezesHeld ?? 2);
              const canAfford =
                !maxFreezeReached &&
                (isUnlimitedCoins || coinsBalance >= item.priceCoins);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedItemId(item.id);
                    }
                  }}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-[#12141A] p-5 flex flex-col justify-between gap-4 cursor-pointer transition-colors text-left"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                        <ShopItemPreview imageKey={item.imageKey} size={22} />
                      </div>
                      <div className="text-xs font-mono-tabular text-neutral-500 text-right">
                        {item.availability === 'seasonal'
                          ? t(lang, 'catSeasonal')
                          : formatEffectType(lang, item.effectType)}
                        {isAnimatedCosmeticKey(item.effectValue) && (
                          <span className="text-[#DD0000] dark:text-[#FFCE00]">
                            {' '}· {t(lang, 'animatedTierLabel')}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white">
                      {name}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 text-sm font-mono-tabular font-bold text-neutral-900 dark:text-[#FFCE00]">
                      <Coins size={15} className="text-[#D99B00] dark:text-[#FFCE00]" />
                      <span>{isUnlimitedCoins ? `0 (${item.priceCoins})` : item.priceCoins}</span>
                    </div>

                    {!item.isConsumable && owned ? (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEquip(item);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] ${
                          item.equipped
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                            : 'border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {item.equipped && <Check size={14} />}
                        <span>{item.equipped ? t(lang, 'unequipBtn') : t(lang, 'equipBtn')}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!isOnline || !canAfford || busyId === item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItemId(item.id);
                        }}
                        className="px-4 py-2 rounded-lg bg-[#DD0000] hover:bg-[#b80000] disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer min-h-[38px]"
                      >
                        {maxFreezeReached
                          ? `${t(lang, 'maxHeldLabel')} (${data?.streakFreezesAvailable}/${data?.maxStreakFreezesHeld})`
                          : item.isConsumable && owned
                          ? `${t(lang, 'buyMoreBtn')} · ${t(lang, 'heldLabel')}: ${item.ownedQuantity})`
                          : t(lang, 'buyBtn')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Wallet Ledger */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] p-5 sm:p-6">
        <h3 className="text-base font-display font-bold text-neutral-900 dark:text-white mb-4">
          {t(lang, 'walletHistory')}
        </h3>
        {!data || data.transactions.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t(lang, 'noCoinTransactions')}</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {data.transactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {tx.reason.replace(/_/g, ' ')}
                  </span>
                  <span className="text-neutral-500 ml-2 font-mono-tabular">
                    {new Date(tx.created_at).toLocaleString(
                      lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
                    )}
                  </span>
                </div>
                <span
                  className={`font-mono-tabular font-semibold ${
                    tx.amount >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#DD0000]'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail & Live Preview Modal / Bottom Sheet */}
      {selectedItem && (() => {
        const name = selectedItem.name_i18n[lang] || selectedItem.name_i18n.en;
        const desc = selectedItem.description_i18n[lang] || selectedItem.description_i18n.en;
        const owned = selectedItem.ownedQuantity > 0;
        const isPermanentOwned = !selectedItem.isConsumable && owned;
        const maxFreezeReached =
          selectedItem.effectType === 'streak_freeze' &&
          (data?.streakFreezesAvailable ?? 0) >= (data?.maxStreakFreezesHeld ?? 2);
        const hasEnoughCoins = isUnlimitedCoins || coinsBalance >= selectedItem.priceCoins;
        const coinsMissing = Math.max(0, selectedItem.priceCoins - coinsBalance);
        const canPurchase = isOnline && hasEnoughCoins && !maxFreezeReached;
        const animated =
          isAnimatedCosmeticKey(selectedItem.imageKey) ||
          isAnimatedCosmeticKey(selectedItem.effectValue);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedItemId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-detail-modal-title"
          >
            <div
              className="w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12141A] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Sheet Handle */}
              <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0" aria-hidden="true">
                <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>

              {/* Header */}
              <div className="px-5 py-3.5 sm:py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-[#FFCE00] flex items-center justify-center shrink-0">
                    <ShopItemPreview imageKey={selectedItem.imageKey} size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono-tabular font-medium text-neutral-500 dark:text-neutral-400">
                      {formatEffectType(lang, selectedItem.effectType)}
                      {selectedItem.availability === 'seasonal' && ` · ${t(lang, 'catSeasonal')}`}
                      {animated && (
                        <span className="text-[#DD0000] dark:text-[#FFCE00]">
                          {' '}· {t(lang, 'animatedTierLabel')}
                        </span>
                      )}
                    </div>
                    <h3
                      id="shop-detail-modal-title"
                      className="text-base sm:text-lg font-display font-bold text-neutral-900 dark:text-white leading-snug break-words"
                    >
                      {name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItemId(null)}
                  aria-label={t(lang, 'close')}
                  className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shrink-0 cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body: Live Preview + Details */}
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {t(lang, 'livePreviewLabel')}
                  </div>
                  {renderLivePreview(selectedItem)}
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {desc}
                </p>

                {/* Price & Coin Validation Bar */}
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 text-sm font-mono-tabular font-bold text-neutral-900 dark:text-[#FFCE00]">
                      <Coins size={16} className="text-[#D99B00] dark:text-[#FFCE00]" />
                      <span>
                        {isUnlimitedCoins
                          ? `0 (${selectedItem.priceCoins}) ${t(lang, 'coinBalance')}`
                          : `${selectedItem.priceCoins} ${t(lang, 'coinBalance')}`}
                      </span>
                    </div>

                    <div className="text-xs font-mono-tabular text-neutral-500 dark:text-neutral-400">
                      {t(lang, 'yourBalanceLabel')}:{' '}
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {isUnlimitedCoins ? '∞' : coinsBalance}
                      </span>
                    </div>
                  </div>

                  {isUnlimitedCoins && !isPermanentOwned && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#D99B00] dark:text-[#FFCE00]">
                      <Sparkles size={13} className="shrink-0" />
                      <span>{t(lang, 'adminFreeUnlockNote')}</span>
                    </div>
                  )}

                  {!isPermanentOwned && !maxFreezeReached && !hasEnoughCoins && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#DD0000] dark:text-red-400">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>
                        {t(lang, 'insufficientCoinsLabel')} · {coinsMissing}{' '}
                        {t(lang, 'coinsNeededSuffix')}
                      </span>
                    </div>
                  )}

                  {isPermanentOwned && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck size={14} className="shrink-0" />
                      <span>
                        {selectedItem.equipped ? t(lang, 'equippedLabel') : t(lang, 'ownedLabel')}
                      </span>
                    </div>
                  )}

                  {!isOnline && !isPermanentOwned && (
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {t(lang, 'shopOfflineToast')}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2.5 shrink-0 bg-white dark:bg-[#12141A]">
                <button
                  type="button"
                  onClick={() => setSelectedItemId(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 cursor-pointer min-h-[42px]"
                >
                  {t(lang, 'close')}
                </button>

                {isPermanentOwned ? (
                  <button
                    type="button"
                    disabled={busyId === selectedItem.id}
                    onClick={() => handleEquip(selectedItem)}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer min-h-[42px] transition-colors ${
                      selectedItem.equipped
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                        : 'bg-[#DD0000] hover:bg-[#b80000] text-white'
                    }`}
                  >
                    {selectedItem.equipped && <Check size={14} />}
                    <span>
                      {busyId === selectedItem.id
                        ? t(lang, 'processingText')
                        : selectedItem.equipped
                        ? t(lang, 'unequipBtn')
                        : t(lang, 'equipBtn')}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canPurchase || busyId === selectedItem.id}
                    onClick={() => handlePurchase(selectedItem)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#DD0000] hover:bg-[#b80000] disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer min-h-[42px]"
                  >
                    {busyId === selectedItem.id
                      ? t(lang, 'processingText')
                      : maxFreezeReached
                      ? `${t(lang, 'maxHeldLabel')} (${data?.streakFreezesAvailable}/${data?.maxStreakFreezesHeld})`
                      : !hasEnoughCoins
                      ? t(lang, 'insufficientCoinsLabel')
                      : selectedItem.isConsumable && owned
                      ? `${t(lang, 'buyMoreBtn')} · ${t(lang, 'heldLabel')}: ${selectedItem.ownedQuantity})`
                      : t(lang, 'buyBtn')}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
