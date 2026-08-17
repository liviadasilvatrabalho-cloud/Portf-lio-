import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { AppConfig, AppId } from '../../types';
import { APPS_CONFIG } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

interface DesktopProps {
  onOpenApp: (appId: AppId) => void;
  dockAutoHide?: boolean;
  onBackgroundClick?: () => void;
  children?: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({
  onOpenApp,
  dockAutoHide = false,
  onBackgroundClick,
  children
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [appList, setAppList] = useState<AppConfig[]>(() => {
    try {
      const saved = localStorage.getItem('apex_os_app_order');
      if (saved) {
        const parsedIds: AppId[] = JSON.parse(saved);
        const ordered = parsedIds
          .map((id) => APPS_CONFIG.find((a) => a.id === id))
          .filter((a): a is AppConfig => Boolean(a));
        APPS_CONFIG.forEach((a) => {
          if (!ordered.some((item) => item.id === a.id)) {
            ordered.push(a);
          }
        });
        return ordered;
      }
    } catch (e) {
      console.error(e);
    }
    return APPS_CONFIG;
  });

  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isSelecting: boolean;
  } | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDeviceType('mobile');
      } else if (w < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // If user clicked directly on window frame, dock, topbar, or controls, do not trigger selection
    if ((e.target as HTMLElement).closest('.window-frame, .dock-container, header, nav, button, input, textarea, select, label')) {
      return;
    }
    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isSelecting: true
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionBox && selectionBox.isSelecting) {
      setSelectionBox((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY
            }
          : null
      );
    }
  };

  const handleMouseUp = () => {
    if (selectionBox) {
      const dx = Math.abs(selectionBox.currentX - selectionBox.startX);
      const dy = Math.abs(selectionBox.currentY - selectionBox.startY);
      // Simple click on desktop background (no real drag) dismisses the selection
      // and triggers outside-click behavior (e.g. minimize active window)
      if (dx < 6 && dy < 6 && onBackgroundClick) {
        onBackgroundClick();
      }
      setSelectionBox(null);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`fixed inset-0 pt-9 ${
        dockAutoHide ? 'pb-4 sm:pb-6' : 'pb-20'
      } px-3 sm:px-6 z-10 overflow-hidden select-none transition-all duration-300`}
    >
      {/* Smartphone & Tablet App Launcher Grid */}
      {deviceType !== 'desktop' && (
        <div
          className={`pt-3 sm:pt-8 pb-28 px-2 sm:px-8 max-w-4xl mx-auto grid ${
            deviceType === 'mobile' ? 'grid-cols-4 gap-y-5 gap-x-2' : 'grid-cols-5 md:grid-cols-6 gap-y-8 gap-x-6'
          } overflow-y-auto max-h-[calc(100dvh-100px)] no-scrollbar`}
        >
          {appList.map((app) => {
            const IconComponent =
              (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[app.icon] ||
              LucideIcons.AppWindow;

            return (
              <div
                key={app.id}
                className="flex flex-col items-center justify-center p-1 rounded-2xl cursor-pointer group active:scale-95 transition-transform select-none relative"
                onClick={() => {
                  soundManager.playClick();
                  onOpenApp(app.id);
                }}
              >
                <div
                  className={`${
                    deviceType === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'
                  } rounded-2xl flex items-center justify-center bg-gradient-to-tr ${
                    app.color
                  } text-white shadow-xl border border-white/20 group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className={deviceType === 'mobile' ? 'w-6 h-6 drop-shadow' : 'w-8 h-8 drop-shadow'} />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-semibold text-white text-center leading-tight tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-1 px-0.5 pointer-events-none">
                  {app.title}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Marquee Selection Box Overlay (Desktop PC) */}
      {deviceType === 'desktop' && selectionBox && selectionBox.isSelecting && (
        <div
          className="absolute bg-blue-500/20 border border-blue-400/60 rounded backdrop-blur-[1px] pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY)
          }}
        />
      )}

      {/* Windows Container Area */}
      {children}
    </div>
  );
};

