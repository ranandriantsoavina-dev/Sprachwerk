import React from 'react';
import {
  Award,
  Bird,
  BookMarked,
  Compass,
  Crown,
  Feather,
  Flame,
  Palette,
  Shield,
  Snowflake,
  Sparkles,
  Star,
  User,
} from 'lucide-react';

export const BrandMark: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onDark?: boolean;
}> = ({ size = 'md', className = '', onDark = false }) => {
  const boxSize =
    size === 'sm' ? 'w-[18px] h-[18px]' : size === 'lg' ? 'w-9 h-9' : 'w-[22px] h-[22px]';

  const bar1Class = onDark
    ? 'fill-transparent stroke-[#F4F4F5]'
    : 'fill-black stroke-none dark:fill-transparent dark:stroke-[#F4F4F5]';
  const bar2Class = onDark
    ? 'fill-transparent stroke-[#DD0000]'
    : 'fill-[#DD0000] stroke-none dark:fill-transparent dark:stroke-[#DD0000]';
  const bar3Class = onDark
    ? 'fill-transparent stroke-[#FFCE00]'
    : 'fill-[#FFCE00] stroke-none dark:fill-transparent dark:stroke-[#FFCE00]';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${boxSize} shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="4.5"
        rx="1.5"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className={bar1Class}
      />
      <rect
        x="2"
        y="9.75"
        width="20"
        height="4.5"
        rx="1.5"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className={bar2Class}
      />
      <rect
        x="2"
        y="16.5"
        width="20"
        height="4.5"
        rx="1.5"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className={bar3Class}
      />
    </svg>
  );
};

export const ANIMATED_COSMETIC_KEYS = new Set([
  'anim_phoenix',
  'anim_aurora',
  'anim_gold_pulse',
  'anim_imperial_star',
  'anim_imperial_wave',
  'frame_anim_aurora',
  'frame_anim_gold',
  'badge_anim_star',
  'banner_anim_wave',
]);

export function isAnimatedCosmeticKey(key?: string): boolean {
  return Boolean(key && ANIMATED_COSMETIC_KEYS.has(key));
}

export const UserAvatar: React.FC<{
  displayName: string;
  avatarKey?: string;
  frameKey?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ displayName, avatarKey, frameKey, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  }[size];

  const radiusClasses = {
    sm: 'rounded-[6px]',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  }[size];

  const innerRadiusClasses = {
    sm: 'rounded-[4px]',
    md: 'rounded-[6px]',
    lg: 'rounded-[9px]',
  }[size];

  const haloRadiusClasses = {
    sm: 'rounded-[8px]',
    md: 'rounded-[10px]',
    lg: 'rounded-[14px]',
  }[size];

  const iconSize = size === 'sm' ? 15 : size === 'md' ? 18 : 28;

  const isPhoenix = avatarKey === 'anim_phoenix';

  const renderGlyph = () => {
    switch (avatarKey) {
      case 'owl':
        return <Bird size={iconSize} />;
      case 'compass':
        return <Compass size={iconSize} />;
      case 'nib':
        return <Feather size={iconSize} />;
      case 'crown':
        return <Crown size={iconSize} className="text-[#FFCE00]" />;
      case 'anim_phoenix':
        return <Flame size={iconSize} className="text-[#FFCE00] sw-anim-phoenix" />;
      default:
        return (
          <span className="font-display font-bold uppercase tracking-tight">
            {displayName?.slice(0, 2) || <User size={iconSize} />}
          </span>
        );
    }
  };

  const innerSurface = isPhoenix
    ? 'bg-gradient-to-br from-black via-[#990000] to-[#3B2600] text-white'
    : 'bg-neutral-900 dark:bg-neutral-800 text-white';

  if (frameKey === 'anim_aurora') {
    return (
      <div className={`relative ${sizeClasses} ${radiusClasses} shrink-0 select-none overflow-hidden p-[2.5px]`}>
        <span
          aria-hidden="true"
          className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,#000000,#DD0000,#FFCE00,#111111,#DD0000,#FFCE00)] sw-anim-aurora"
        />
        <div className={`relative z-10 w-full h-full ${innerRadiusClasses} ${innerSurface} flex items-center justify-center`}>
          {renderGlyph()}
        </div>
      </div>
    );
  }

  if (frameKey === 'anim_gold_pulse') {
    return (
      <div className={`relative ${sizeClasses} ${radiusClasses} shrink-0 select-none`}>
        <span
          aria-hidden="true"
          className={`absolute -inset-[3px] ${haloRadiusClasses} border-2 border-[#FFCE00] sw-anim-halo pointer-events-none`}
        />
        <div
          className={`relative w-full h-full ${radiusClasses} ring-2 ring-[#FFCE00] ${innerSurface} flex items-center justify-center`}
        >
          {renderGlyph()}
        </div>
      </div>
    );
  }

  if (frameKey === 'triad') {
    return (
      <div
        className={`${sizeClasses} p-[2.5px] ${radiusClasses} bg-gradient-to-tr from-black via-[#DD0000] to-[#FFCE00] dark:from-neutral-700 dark:via-[#DD0000] dark:to-[#FFCE00] shrink-0 select-none`}
      >
        <div className={`w-full h-full ${innerRadiusClasses} ${innerSurface} flex items-center justify-center`}>
          {renderGlyph()}
        </div>
      </div>
    );
  }

  const frameRing =
    frameKey === 'gold'
      ? 'ring-2 ring-[#FFCE00] ring-offset-2 ring-offset-white dark:ring-offset-[#12141A]'
      : 'border border-neutral-200 dark:border-neutral-800';

  return (
    <div
      className={`${sizeClasses} ${frameRing} ${radiusClasses} ${innerSurface} flex items-center justify-center shrink-0 select-none`}
    >
      {renderGlyph()}
    </div>
  );
};

export const UserBadgeIcon: React.FC<{ badgeKey?: string }> = ({ badgeKey }) => {
  if (!badgeKey) return null;
  if (badgeKey === 'anim_imperial_star') {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-[#FFCE00] shrink-0"
        title="Imperial Star Crest"
      >
        <Star size={14} className="fill-[#FFCE00] text-[#FFCE00] sw-anim-gleam" />
      </span>
    );
  }
  if (badgeKey === 'winter_lantern') {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-[#FFCE00] shrink-0"
        title="Wintermarkt Crest"
      >
        <Flame size={14} />
      </span>
    );
  }
  if (badgeKey === 'wortmeister') {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-[#FFCE00] shrink-0"
        title="Wortmeister"
      >
        <BookMarked size={14} />
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium text-[#DD0000] dark:text-[#FFCE00] shrink-0"
      title="Kasus-Kenner"
    >
      <Shield size={14} />
    </span>
  );
};

export const UserBannerBackdrop: React.FC<{
  bannerKey?: string;
  compact?: boolean;
}> = ({ bannerKey, compact = false }) => {
  if (!bannerKey) return null;

  switch (bannerKey) {
    case 'brandenburg_horizon':
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-r from-[#111520] via-[#261421] to-[#68121B]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div
            className={`absolute right-6 inset-y-0 flex gap-2 opacity-20 ${compact ? 'scale-90' : ''}`}
          >
            <span className="w-2 h-full bg-[#FFCE00]" />
            <span className="w-2 h-full bg-white/70" />
            <span className="w-2 h-full bg-[#DD0000]" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFCE00]/70 to-[#DD0000]" />
        </div>
      );

    case 'bauhaus_grid':
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden bg-[#121318]"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex opacity-85">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-[#DD0000]" />
            <div className="flex-1 bg-[#FFCE00]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#121318] via-[#121318]/90 to-black/35" />
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFCE00]/60" />
        </div>
      );

    case 'rhine_amber':
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-r from-[#16120B] via-[#3A2B11] to-[#6E4D14]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-[#FFCE00]/30" />
          <div className="absolute -right-2 -bottom-10 w-32 h-32 rounded-full border border-[#FFCE00]/20" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#FFCE00]/75" />
        </div>
      );

    case 'anim_imperial_wave':
      return (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-r from-[#0C0D12] via-[#4A060B] to-[#6B4E00]"
        >
          <div className="absolute inset-y-0 -left-1/3 w-2/3 bg-gradient-to-r from-transparent via-[#FFCE00]/25 to-transparent -skew-x-12 sw-anim-sweep" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-black via-[#DD0000] to-[#FFCE00]" />
        </div>
      );

    default:
      return null;
  }
};

export const ShopItemPreview: React.FC<{ imageKey: string; size?: number }> = ({
  imageKey,
  size = 20,
}) => {
  switch (imageKey) {
    case 'owl':
      return <Bird size={size} />;
    case 'compass':
      return <Compass size={size} />;
    case 'nib':
      return <Feather size={size} />;
    case 'crown':
      return <Crown size={size} className="text-[#D99B00] dark:text-[#FFCE00]" />;
    case 'anim_phoenix':
      return (
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-black via-[#990000] to-[#3B2600] text-[#FFCE00] inline-flex items-center justify-center">
          <Flame size={17} className="sw-anim-phoenix" />
        </span>
      );
    case 'frame_triad':
      return (
        <span
          className="w-7 h-7 rounded-lg p-[2.5px] bg-gradient-to-tr from-black via-[#DD0000] to-[#FFCE00] inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="w-full h-full rounded-[5px] bg-white dark:bg-neutral-900 block" />
        </span>
      );
    case 'frame_gold':
      return (
        <span
          className="w-7 h-7 rounded-lg border-[2.5px] border-[#FFCE00] bg-neutral-900 inline-block"
          aria-hidden="true"
        />
      );
    case 'frame_anim_gold':
      return (
        <span className="relative w-7 h-7 rounded-lg inline-flex items-center justify-center" aria-hidden="true">
          <span className="absolute -inset-0.5 rounded-lg border-2 border-[#FFCE00] sw-anim-halo" />
          <span className="w-full h-full rounded-lg border border-[#FFCE00] bg-neutral-900 block" />
        </span>
      );
    case 'frame_anim_aurora':
      return (
        <span className="relative w-7 h-7 rounded-lg p-[2.5px] overflow-hidden inline-flex items-center justify-center" aria-hidden="true">
          <span className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,#000000,#DD0000,#FFCE00,#111111,#DD0000,#FFCE00)] sw-anim-aurora" />
          <span className="relative z-10 w-full h-full rounded-[5px] bg-white dark:bg-neutral-900 block" />
        </span>
      );
    case 'badge_shield':
      return <Shield size={size} className="text-[#DD0000] dark:text-[#FFCE00]" />;
    case 'badge_book':
      return <BookMarked size={size} className="text-[#D99B00] dark:text-[#FFCE00]" />;
    case 'seasonal_lantern':
      return <Flame size={size} className="text-amber-600 dark:text-[#FFCE00]" />;
    case 'badge_anim_star':
      return <Star size={size} className="fill-[#FFCE00] text-[#FFCE00] sw-anim-gleam" />;
    case 'banner_brandenburg':
      return (
        <span
          className="w-8 h-6 rounded-md bg-gradient-to-r from-[#111520] via-[#261421] to-[#68121B] border border-[#FFCE00]/50 inline-block"
          aria-hidden="true"
        />
      );
    case 'banner_bauhaus':
      return (
        <span
          className="w-8 h-6 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 inline-flex"
          aria-hidden="true"
        >
          <span className="flex-1 bg-black" />
          <span className="flex-1 bg-[#DD0000]" />
          <span className="flex-1 bg-[#FFCE00]" />
        </span>
      );
    case 'banner_rhine':
      return (
        <span
          className="w-8 h-6 rounded-md bg-gradient-to-r from-[#16120B] via-[#3A2B11] to-[#6E4D14] border border-[#FFCE00]/60 inline-block"
          aria-hidden="true"
        />
      );
    case 'banner_anim_wave':
      return (
        <span
          className="relative w-8 h-6 rounded-md overflow-hidden bg-gradient-to-r from-[#0C0D12] via-[#4A060B] to-[#6B4E00] border border-[#FFCE00]/70 inline-block"
          aria-hidden="true"
        >
          <span className="absolute inset-y-0 -left-1/2 w-2/3 bg-gradient-to-r from-transparent via-[#FFCE00]/50 to-transparent -skew-x-12 sw-anim-sweep" />
        </span>
      );
    case 'theme_porcelain':
      return (
        <span
          className="w-7 h-7 rounded-lg border border-neutral-300 bg-[#FAF6EE] inline-flex items-center justify-center text-neutral-800"
          aria-hidden="true"
        >
          <Palette size={14} />
        </span>
      );
    case 'theme_gold':
      return (
        <span
          className="w-7 h-7 rounded-lg border border-[#FFCE00] bg-neutral-950 text-[#FFCE00] inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <Palette size={14} />
        </span>
      );
    case 'celebration_ribbon':
      return <Sparkles size={size} className="text-[#DD0000] dark:text-[#FFCE00]" />;
    case 'streak_freeze':
      return <Snowflake size={size} className="text-sky-600 dark:text-sky-400" />;
    default:
      return <Award size={size} />;
  }
};
