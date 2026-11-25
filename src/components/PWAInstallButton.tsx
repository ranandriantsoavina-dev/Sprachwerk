import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { MOTION_SPRING, useMotionPreference } from '../lib/motion';
import { MotionModal } from './motion/MotionPrimitives';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const reduced = useMotionPreference();

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <motion.button
        type="button"
        onClick={install}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={MOTION_SPRING.snappy}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs font-medium min-h-[40px]' : 'w-full px-4 py-2.5 text-sm font-medium min-h-[44px]'
        }`}
      >
        <Download size={15} />
        <span>{t(lang, 'installApp')}</span>
      </motion.button>
    );
  }

  if (isIOS) {
    return (
      <>
        <motion.button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={MOTION_SPRING.snappy}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            compact ? 'px-3 py-1.5 text-xs font-medium min-h-[40px]' : 'w-full px-4 py-2.5 text-sm font-medium min-h-[44px]'
          }`}
        >
          <Download size={15} />
          <span>{t(lang, 'installIOS')}</span>
        </motion.button>

        <MotionModal
          open={showIOSGuide}
          onClose={() => setShowIOSGuide(false)}
          maxWidthClass="max-w-sm"
          mobileBottomSheet
          ariaLabel={t(lang, 'installIOS')}
          panelClassName="p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              {t(lang, 'installIOS')}
            </h3>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              aria-label={t(lang, 'close')}
            >
              <X size={18} />
            </button>
          </div>
          <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300 list-decimal pl-5">
            <li>{t(lang, 'iosStep1')}</li>
            <li>{t(lang, 'iosStep2')}</li>
            <li>{t(lang, 'iosStep3')}</li>
          </ol>
        </MotionModal>
      </>
    );
  }

  return null;
};
