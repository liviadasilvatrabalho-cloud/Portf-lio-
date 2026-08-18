import React, { useState, useEffect, useCallback } from 'react';
import { AppId, SystemSettings, WindowState } from './types';
import { APPS_CONFIG } from './data/portfolioData';
import { loadSettings, saveSettings } from './utils/storage';
import { soundManager } from './utils/audio';

import { RainyHighwayCanvas } from './components/background/RainyHighwayCanvas';
import { BootScreen } from './components/system/BootScreen';
import { LockScreen } from './components/system/LockScreen';
import { TopBar } from './components/system/TopBar';
import { ControlCenter } from './components/system/ControlCenter';
import { Dock } from './components/system/Dock';
import { Desktop } from './components/system/Desktop';
import { MacWindow } from './components/system/Window';
import { SpotlightSearch } from './components/system/SpotlightSearch';

// App Views
import { AboutApp } from './components/apps/AboutApp';
import { ProjectsApp } from './components/apps/ProjectsApp';
import { SkillsApp } from './components/apps/SkillsApp';
import { ResumeApp } from './components/apps/ResumeApp';
import { ContactApp } from './components/apps/ContactApp';
import { PlaygroundApp } from './components/apps/PlaygroundApp';
import { ArcadeApp } from './components/apps/ArcadeApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { SettingsApp } from './components/apps/SettingsApp';

// Mobile Controller (for ?controle=true route)
import { MobileControllerView } from '../pac-man-arcade/src/components/MobileControllerView';

export default function App() {
  // Detect controller mode inside component so it works on fresh page loads
  const [isControllerMode] = useState(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('controle') === 'true'
  );  const [bootState, setBootState] = useState<'locked' | 'unlocked'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return 'unlocked';
    return 'unlocked';
  });
  const [settings, setSettings] = useState<SystemSettings>(loadSettings);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [screenMode, setScreenMode] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 640) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  });

  // Initialize window states for all 12 apps
  const [windows, setWindows] = useState<WindowState[]>(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isTouchMode = screenW < 640; // mobile only (<640); tablet uses windowed mode like a PC

    return APPS_CONFIG.map((config, index) => {
      if (isTouchMode) {
        return {
          id: config.id,
          title: config.title,
          isOpen: false,
          isMinimized: false,
          isMaximized: true,
          position: { x: 0, y: 0 },
          size: { width: screenW, height: screenH },
          zIndex: 1
        };
      }

      const width = Math.min(config.defaultWidth, screenW - 40);
      const height = Math.min(config.defaultHeight, screenH - 120);

      const posX = Math.max(20, Math.floor((screenW - width) / 2) + (index % 3) * 20);
      const posY = Math.max(50, Math.floor((screenH - height) / 2) + (index % 3) * 15);

      return {
        id: config.id,
        title: config.title,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: { x: posX, y: posY },
        size: { width, height },
        zIndex: 1
      };
    });
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newMode = w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
      setScreenMode(newMode);

      if (newMode === 'mobile') {
        // Enforce 100% width and height and (0,0) position in mobile mode only
        setWindows((winList) =>
          winList.map((win) => ({
            ...win,
            position: { x: 0, y: 0 },
            size: { width: w, height: h },
            isMaximized: true
          }))
        );
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Spotlight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateSettings = useCallback((newPartial: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const handleFocusWindow = useCallback((appId: AppId) => {
    setActiveAppId(appId);
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((winList) =>
        winList.map((w) => (w.id === appId ? { ...w, zIndex: nextZ, isMinimized: false } : w))
      );
      return nextZ;
    });
  }, []);

  const handleOpenApp = useCallback(
    (appId: AppId) => {
      setWindows((winList) => {
        const target = winList.find((w) => w.id === appId);
        if (!target) return winList;

        if (!target.isOpen) {
          soundManager.playOpenWindow();
        }

        const isTouchScreen = screenMode === 'mobile';
        const curW = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const curH = typeof window !== 'undefined' ? window.innerHeight : 800;

        return winList.map((w) => {
          if (w.id === appId) {
            return {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: maxZIndex + 1,
              ...(isTouchScreen
                ? {
                    position: { x: 0, y: 0 },
                    size: { width: curW, height: curH },
                    isMaximized: true
                  }
                : {})
            };
          }
          return w;
        });
      });

      setMaxZIndex((prev) => prev + 1);
      setActiveAppId(appId);

      // Synchronize with browser history for mobile hardware back button support
      try {
        if (window.location.hash !== `#${appId}`) {
          window.history.pushState({ appId, view: 'app' }, '', `#${appId}`);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [maxZIndex, screenMode]
  );

  const handleCloseWindow = useCallback((appId: AppId) => {
    setWindows((winList) =>
      winList.map((w) => (w.id === appId ? { ...w, isOpen: false } : w))
    );
    setActiveAppId((current) => (current === appId ? null : current));

    // Clear hash if closed window matches
    try {
      if (window.location.hash === `#${appId}`) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCloseActiveWindow = useCallback(() => {
    if (activeAppId) {
      soundManager.playCloseWindow();
      handleCloseWindow(activeAppId);
    }
  }, [activeAppId, handleCloseWindow]);

  const handleCloseAllWindows = useCallback(() => {
    setWindows((winList) => winList.map((w) => ({ ...w, isOpen: false })));
    setActiveAppId(null);
    try {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen for mobile phone hardware back button & browser back gesture (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as AppId;
      if (hash && APPS_CONFIG.some((a) => a.id === hash)) {
        handleOpenApp(hash);
      } else {
        // User pressed the back button on mobile / tablet: close the active window and return to home screen
        if (activeAppId) {
          soundManager.playCloseWindow();
          setWindows((winList) =>
            winList.map((w) => (w.id === activeAppId ? { ...w, isOpen: false } : w))
          );
          setActiveAppId(null);
        } else {
          setWindows((winList) => {
            const hasOpen = winList.some((w) => w.isOpen);
            if (hasOpen) {
              soundManager.playCloseWindow();
              return winList.map((w) => ({ ...w, isOpen: false }));
            }
            return winList;
          });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeAppId, handleOpenApp]);

  const handleCloseOtherWindows = useCallback((keepAppId: AppId) => {
    setWindows((winList) =>
      winList.map((w) => (w.id === keepAppId ? w : { ...w, isOpen: false }))
    );
    setActiveAppId(keepAppId);
  }, []);

  const handleMinimizeWindow = useCallback((appId: AppId) => {
    setWindows((winList) =>
      winList.map((w) => (w.id === appId ? { ...w, isMinimized: true } : w))
    );
    setActiveAppId(null);
  }, []);

  // Clicking on the desktop background (outside any window) minimizes the
  // active window, just like a desktop PC.
  const handleBackgroundClick = useCallback(() => {
    const active = windows.find((w) => w.id === activeAppId && w.isOpen && !w.isMinimized);
    if (active) {
      soundManager.playCloseWindow();
      handleMinimizeWindow(active.id);
    }
  }, [activeAppId, windows, handleMinimizeWindow]);

  const handleMaximizeWindow = useCallback((appId: AppId) => {
    // In mobile mode windows are always 100% full screen
    if (screenMode === 'mobile') return;
    setWindows((winList) =>
      winList.map((w) =>
        w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, [screenMode]);

  const handleUpdatePosition = useCallback((appId: AppId, pos: { x: number; y: number }) => {
    // Disable manual position drag changes in mobile mode only
    if (screenMode === 'mobile') return;
    setWindows((winList) =>
      winList.map((w) => (w.id === appId ? { ...w, position: pos } : w))
    );
  }, [screenMode]);

  const handleUpdateSize = useCallback((appId: AppId, size: { width: number; height: number }) => {
    // Disable manual resize changes in mobile mode only
    if (screenMode === 'mobile') return;
    setWindows((winList) =>
      winList.map((w) => (w.id === appId ? { ...w, size } : w))
    );
  }, [screenMode]);

  // Render App Contents
  const renderAppContent = (appId: AppId) => {
    switch (appId) {
      case 'about':
        return <AboutApp onNavigateApp={handleOpenApp} />;
      case 'projects':
        return <ProjectsApp />;
      case 'skills':
        return <SkillsApp />;
      case 'resume':
        return <ResumeApp />;
      case 'contact':
        return <ContactApp />;
      case 'playground':
        return <PlaygroundApp />;
      case 'arcade':
        return <ArcadeApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetSettings={() => {
              const def = loadSettings();
              setSettings(def);
              saveSettings(def);
            }}
          />
        );
      default:
        return null;
    }
  };

  const hasOpenActiveWindow = windows.some((w) => w.isOpen && !w.isMinimized);
  const isAnyWindowMaximized = windows.some((w) => w.isOpen && !w.isMinimized && w.isMaximized);
  // Hide system bars (TopBar and Dock) when:
  // - On desktop or tablet: when a window is maximized in full screen
  // - On mobile: whenever an app window is open
  const showSystemBars =
    screenMode === 'mobile'
      ? !hasOpenActiveWindow
      : !isAnyWindowMaximized;

  // If URL has ?controle=true, render the mobile controller page instead of the desktop
  if (isControllerMode) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#06070d] overflow-hidden">
        <MobileControllerView />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-black text-white font-sans select-none">
      {/* 1. Live Animated Background Canvas (Rainy Night Porsche Highway & Parallax) */}
      <RainyHighwayCanvas
        wallpaperMode={settings.wallpaper}
        graphicQuality={settings.graphicQuality}
        rainDensity={settings.rainDensity}
      />

      {/* 3. System Lock Screen (desktop/tablet only) */}
      {bootState === 'locked' && screenMode !== 'mobile' && (
        <LockScreen onUnlock={() => setBootState('unlocked')} />
      )}

      {/* 4. Desktop Operating System View */}
      {bootState === 'unlocked' && (
        <>
          {/* Top Menu Bar (Hidden when full screen / maximized or on Mobile within an app) */}
          {showSystemBars && (
            <TopBar
              activeAppId={activeAppId}
              openWindows={windows}
              onOpenApp={handleOpenApp}
              onCloseApp={handleCloseWindow}
              onCloseAllApps={handleCloseAllWindows}
              onOpenSpotlight={() => setIsSpotlightOpen(true)}
              onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
              onLockScreen={() => setBootState('locked')}
              settings={settings}
            />
          )}

          {/* Control Center Panel */}
          <ControlCenter
            isOpen={isControlCenterOpen}
            onClose={() => setIsControlCenterOpen(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onLockScreen={() => {
              setIsControlCenterOpen(false);
              setBootState('locked');
            }}
          />

          {/* Spotlight Search Overlay */}
          <SpotlightSearch
            isOpen={isSpotlightOpen}
            onClose={() => setIsSpotlightOpen(false)}
            onOpenApp={handleOpenApp}
          />

          {/* Desktop Shortcuts & Window Area */}
          <Desktop
            onOpenApp={handleOpenApp}
            onBackgroundClick={handleBackgroundClick}
            dockAutoHide={settings.dockAutoHide}
          >
            {windows.map((win) => (
              <MacWindow
                key={win.id}
                windowState={win}
                openWindows={windows}
                onClose={() => handleCloseWindow(win.id)}
                onCloseApp={handleCloseWindow}
                onCloseAll={handleCloseAllWindows}
                onCloseOthers={handleCloseOtherWindows}
                onMinimize={() => handleMinimizeWindow(win.id)}
                onMaximize={() => handleMaximizeWindow(win.id)}
                onFocus={() => handleFocusWindow(win.id)}
                onFocusApp={handleOpenApp}
                onUpdatePosition={(pos) => handleUpdatePosition(win.id, pos)}
                onUpdateSize={(size) => handleUpdateSize(win.id, size)}
              >
                {renderAppContent(win.id)}
              </MacWindow>
            ))}
          </Desktop>

          {/* Bottom Interactive Magnifying Dock (Hidden in full screen / maximized mode) */}
          {showSystemBars && (
            <Dock
              windows={windows}
              activeAppId={activeAppId}
              onOpenApp={handleOpenApp}
              magnificationEnabled={settings.dockMagnification}
              autoHideEnabled={settings.dockAutoHide}
            />
          )}
        </>
      )}
    </div>
  );
}
