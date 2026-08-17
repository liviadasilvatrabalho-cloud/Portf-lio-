import React, { useState, useEffect } from 'react';
import { Sliders, Wifi, Battery, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { AppId, SystemSettings, WindowState } from '../../types';
import { soundManager } from '../../utils/audio';

interface TopBarProps {
  activeAppId: AppId | null;
  openWindows?: WindowState[];
  onOpenApp: (appId: AppId) => void;
  onCloseApp?: (appId: AppId) => void;
  onCloseAllApps?: () => void;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  onLockScreen: () => void;
  settings: SystemSettings;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeAppId,
  openWindows = [],
  onOpenApp,
  onCloseApp,
  onCloseAllApps,
  onOpenSpotlight,
  onToggleControlCenter,
  onLockScreen,
  settings
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [activeMenu, setActiveMenu] = useState<'file' | 'window' | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const dayName = weekdays[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];

      setDateStr(`${dayName}, ${day} de ${monthName}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const visibleWindows = openWindows.filter((w) => w.isOpen && !w.isMinimized);

  return (
    <header className="fixed top-0 left-0 right-0 h-8 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between text-[13px] text-white/90 select-none font-sans">
      {/* Left Menu Section */}
      <div className="flex items-center space-x-3 sm:space-x-5 font-semibold relative">

        {/* Arquivo / File Dropdown Menu */}
        <div className="relative hidden lg:inline-block">
          <button
            onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
            className="hover:opacity-100 opacity-80 cursor-pointer font-normal text-white hover:text-cyan-300 transition"
          >
            Arquivo
          </button>

          {activeMenu === 'file' && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setActiveMenu(null)}
            >
              <div
                className="absolute top-8 left-24 w-56 rounded-xl bg-black/85 backdrop-blur-2xl border border-white/15 p-1.5 shadow-2xl text-xs text-white z-50 space-y-0.5 animate-in fade-in duration-150 font-normal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    onOpenSpotlight();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition flex items-center justify-between"
                >
                  <span>Nova Aba / App</span>
                  <span className="font-mono text-[10px] opacity-70">⌘K</span>
                </button>

                <div className="my-1 border-t border-white/10" />

                <button
                  onClick={() => {
                    setActiveMenu(null);
                    if (activeAppId && onCloseApp) {
                      soundManager.playCloseWindow();
                      onCloseApp(activeAppId);
                    }
                  }}
                  disabled={!activeAppId}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white transition flex items-center justify-between disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <span>Fechar Aba Ativa</span>
                  <span className="font-mono text-[10px] opacity-70">⌘W</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMenu(null);
                    if (onCloseAllApps) {
                      soundManager.playCloseWindow();
                      onCloseAllApps();
                    }
                  }}
                  disabled={visibleWindows.length === 0}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white text-rose-300 transition font-medium disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  Fechar Todas as Abas ({visibleWindows.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Janela / Window Dropdown Menu */}
        <div className="relative hidden lg:inline-block">
          <button
            onClick={() => setActiveMenu(activeMenu === 'window' ? null : 'window')}
            className="hover:opacity-100 opacity-80 cursor-pointer font-normal text-white hover:text-cyan-300 transition"
          >
            Janela ({visibleWindows.length})
          </button>

          {activeMenu === 'window' && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setActiveMenu(null)}
            >
              <div
                className="absolute top-8 left-48 w-64 rounded-xl bg-black/85 backdrop-blur-2xl border border-white/15 p-1.5 shadow-2xl text-xs text-white z-50 space-y-0.5 animate-in fade-in duration-150 font-normal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Abas / Janelas Abertas
                </div>

                {visibleWindows.length === 0 ? (
                  <div className="px-3 py-2 text-zinc-500 italic text-center">Nenhuma aba aberta</div>
                ) : (
                  visibleWindows.map((win) => (
                    <div
                      key={win.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/10 transition group"
                    >
                      <button
                        onClick={() => {
                          setActiveMenu(null);
                          onOpenApp(win.id as AppId);
                        }}
                        className="flex-1 text-left truncate font-medium hover:text-cyan-300"
                      >
                        {win.title}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onCloseApp) {
                            soundManager.playCloseWindow();
                            onCloseApp(win.id as AppId);
                          }
                        }}
                        className="p-1 rounded hover:bg-rose-500/30 text-zinc-400 hover:text-rose-300 opacity-70 group-hover:opacity-100 transition"
                        title={`Fechar ${win.title}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}

                <div className="my-1 border-t border-white/10" />

                <button
                  onClick={() => {
                    setActiveMenu(null);
                    if (onCloseAllApps) {
                      soundManager.playCloseWindow();
                      onCloseAllApps();
                    }
                  }}
                  disabled={visibleWindows.length === 0}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white text-rose-300 transition font-medium disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  Fechar Todas as Janelas
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right Status Bar Section */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 select-none">
        {/* Status Indicators */}
        <div className="flex items-center gap-2 text-zinc-400">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" title="Wi-Fi Conectado (1000Mbps)" />
          <Battery className="w-3.5 h-3.5 text-cyan-400" title="Bateria 100% (Carregando)" />
          {settings.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-blue-400" title="Áudio Ativo" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500" title="Áudio Mutado" />
          )}
        </div>

        {/* Control Center Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleControlCenter();
          }}
          className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition active:scale-95 flex items-center justify-center"
          title="Central de Controle"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Clock & Date Display */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/10 transition cursor-default text-white/90 whitespace-nowrap leading-none select-none text-[12px] font-medium"
          title={`${dateStr} às ${timeStr}`}
        >
          <span className="hidden sm:inline text-zinc-300/90">{dateStr}</span>
          <span className="font-mono text-[12px] font-semibold tracking-wide tabular-nums text-white">
            {timeStr || '12:00'}
          </span>
        </div>
      </div>
    </header>
  );
};
