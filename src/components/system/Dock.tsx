import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { AppId, WindowState } from '../../types';
import { APPS_CONFIG } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

interface DockProps {
  windows: WindowState[];
  activeAppId: AppId | null;
  onOpenApp: (appId: AppId) => void;
  magnificationEnabled: boolean;
  autoHideEnabled?: boolean;
}

const MOBILE_PINNED_APPS: AppId[] = ['about', 'projects', 'resume', 'skills', 'contact'];
const TABLET_PINNED_APPS: AppId[] = ['about', 'projects', 'resume', 'skills', 'contact'];

export const Dock: React.FC<DockProps> = ({
  windows,
  activeAppId,
  onOpenApp,
  magnificationEnabled,
  autoHideEnabled = false
}) => {
  const [hoveredId, setHoveredId] = useState<AppId | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isRevealed, setIsRevealed] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDockEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsRevealed(true);
  };

  const handleDockLeave = () => {
    setHoveredId(null);
    setMouseX(null);
    if (autoHideEnabled) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsRevealed(false);
      }, 350);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDockEnter();
    if (!dockRef.current || !magnificationEnabled || deviceType !== 'desktop') return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleAppClick = (appId: AppId) => {
    soundManager.playClick();
    onOpenApp(appId);
  };

  const displayedApps = APPS_CONFIG.filter((app) => {
    if (deviceType === 'mobile') {
      return MOBILE_PINNED_APPS.includes(app.id);
    }
    if (deviceType === 'tablet') {
      return TABLET_PINNED_APPS.includes(app.id);
    }
    return true; // Desktop shows all
  });

  const isVisible = !autoHideEnabled || isRevealed;

  return (
    <>
      {/* Auto-hide Bottom Edge Hotspot Trigger Zone */}
      {autoHideEnabled && (
        <div
          onMouseEnter={handleDockEnter}
          onTouchStart={handleDockEnter}
          className="fixed bottom-0 left-0 right-0 h-4 z-40 cursor-pointer pointer-events-auto"
          title="Aproxime o cursor para exibir o Dock"
        >
          {/* Subtle glowing indicator line when Dock is auto-hidden */}
          {!isRevealed && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 rounded-full bg-cyan-400/50 hover:bg-cyan-300 hover:h-1.5 transition-all shadow-[0_0_10px_rgba(56,189,248,0.6)] animate-pulse" />
          )}
        </div>
      )}

      <nav
        onMouseEnter={handleDockEnter}
        onMouseLeave={handleDockLeave}
        className={`fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 max-w-full select-none px-2 transition-all duration-300 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-[calc(100%+24px)] opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleDockLeave}
          className={`flex items-center relative group transition-all duration-300 ${
            deviceType === 'mobile'
              ? 'space-x-3 px-3.5 py-2 rounded-[28px] bg-black/70 backdrop-blur-2xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
              : deviceType === 'tablet'
              ? 'space-x-4 px-5 py-2.5 rounded-[30px] bg-black/65 backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
              : 'space-x-3 px-3 py-3 rounded-[28px] backdrop-blur-3xl bg-white/10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Subtle glass reflection sheen */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {displayedApps.map((app, index) => {
            const isOpen = windows.some((w) => w.id === app.id && w.isOpen);
            const isActive = activeAppId === app.id;

            // Calculate distance-based scale factor if magnification enabled (Desktop only)
            let scale = 1;
            if (magnificationEnabled && mouseX !== null && dockRef.current && deviceType === 'desktop') {
              const itemWidth = 50;
              const itemCenterX = index * itemWidth + itemWidth / 2;
              const distance = Math.abs(mouseX - itemCenterX);
              if (distance < 150) {
                scale = 1 + (1 - distance / 150) * 0.45;
              }
            }

            // Dynamic icon component resolution from Lucide
            const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[
              app.icon
            ] || LucideIcons.AppWindow;

            return (
              <div key={app.id} className="relative flex flex-col items-center shrink-0">
                {/* Tooltip Label (Desktop only) */}
                {deviceType === 'desktop' && hoveredId === app.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-11 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-xl text-white border border-white/20 text-[11px] font-semibold whitespace-nowrap shadow-2xl pointer-events-none z-50 font-sans tracking-wide"
                  >
                    {app.title}
                  </motion.div>
                )}

                {/* Dock Icon Button */}
                <button
                  onClick={() => handleAppClick(app.id)}
                  onMouseEnter={() => setHoveredId(app.id)}
                  style={{
                    transform: deviceType === 'desktop' ? `scale(${scale})` : undefined,
                    transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                  className={`relative group p-0.5 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'ring-2 ring-cyan-400/80 shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                      : ''
                  }`}
                >
                  <div
                    className={`rounded-2xl flex items-center justify-center bg-gradient-to-tr ${
                      app.color
                    } text-white shadow-lg border border-white/20 transition-transform ${
                      deviceType === 'mobile'
                        ? 'w-11 h-11'
                        : deviceType === 'tablet'
                        ? 'w-12 h-12'
                        : 'w-14 h-14 group-hover:-translate-y-1.5'
                    }`}
                  >
                    <IconComponent
                      className={
                        deviceType === 'mobile'
                          ? 'w-5.5 h-5.5 drop-shadow'
                          : deviceType === 'tablet'
                          ? 'w-6 h-6 drop-shadow'
                          : 'w-7 h-7 drop-shadow'
                      }
                    />
                  </div>
                </button>

                {/* Running App Indicator Dot */}
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${
                    isOpen
                      ? isActive
                        ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] scale-125'
                        : 'bg-white/80'
                      : 'bg-transparent'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* iOS / iPadOS Home Indicator Bar for Mobile and Tablet */}
        {deviceType !== 'desktop' ? (
          <div className="mt-1.5 flex justify-center">
            <div className="w-28 sm:w-36 h-1 bg-white/50 rounded-full shadow-sm" />
          </div>
        ) : (
          /* macOS Dock reflection blur line */
          <div className="mt-2 w-full flex justify-center">
            <div className="w-12 h-1 bg-white/20 rounded-full blur-sm" />
          </div>
        )}
      </nav>
    </>
  );
};

