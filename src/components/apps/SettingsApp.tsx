import React from 'react';
import { Sliders, Volume2, VolumeX, CloudRain, Sparkles, Image, RefreshCw, Eye } from 'lucide-react';
import { SystemSettings } from '../../types';
import { soundManager } from '../../utils/audio';

interface SettingsAppProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings
}) => {
  const wallpapers = [
    { id: 'jake-night', name: 'Jake no Moinho (Adventure Time Night Lo-Fi)', preview: 'bg-gradient-to-br from-cyan-900 via-indigo-950 to-slate-950' },
    { id: 'porsche-rain', name: 'Porsche Night Rain (Cinematográfico)', preview: 'bg-gradient-to-br from-blue-900 to-slate-950' },
    { id: 'cyber-rain', name: 'Cyberpunk Neon Rain', preview: 'bg-gradient-to-br from-purple-900 to-slate-950' },
    { id: 'cupertino-nebula', name: 'Cupertino Fluid Nebula', preview: 'bg-gradient-to-br from-indigo-900 to-purple-950' },
    { id: 'abstract-glass', name: 'Abstract Glass Geometry', preview: 'bg-gradient-to-br from-slate-800 to-slate-950' },
    { id: 'dark-studio', name: 'Dark Studio Grid (Minimalista)', preview: 'bg-gradient-to-br from-zinc-900 to-black' }
  ];

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    onUpdateSettings({ soundVolume: vol });
    soundManager.setSettings(!settings.soundEnabled, vol);
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Configurações do Sistema</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Preferências visuais, renderização do wallpaper e áudio do sistema
          </p>
        </div>

        <button
          onClick={onResetSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-zinc-300 font-semibold transition"
          title="Restaurar Padrões"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Wallpaper Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Image className="w-4 h-4 text-cyan-400" />
            <span>Papel de Parede Interativo</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wallpapers.map((wp) => (
              <div
                key={wp.id}
                onClick={() => onUpdateSettings({ wallpaper: wp.id as SystemSettings['wallpaper'] })}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  settings.wallpaper === wp.id
                    ? 'bg-blue-600/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${wp.preview} border border-white/20 shrink-0`} />
                <span className="text-xs font-semibold text-white">{wp.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Graphics & Performance Quality */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Desempenho & Renderização Canvas</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {(['high', 'medium', 'low'] as const).map((q) => (
              <button
                key={q}
                onClick={() => onUpdateSettings({ graphicQuality: q })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition capitalize ${
                  settings.graphicQuality === q
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                {q === 'high' ? 'Alta (120 FPS)' : q === 'medium' ? 'Média' : 'Baixa (Economia)'}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Densidade de Chuva</span>
              </span>
              <span className="font-mono text-cyan-300">Nível {settings.rainDensity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.rainDensity}
              onChange={(e) => onUpdateSettings({ rainDensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 h-1 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Audio & Dock Interactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
              <span>Efeitos Sonoros</span>
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300">Sons do Sistema</span>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  settings.soundEnabled ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-400'
                }`}
              >
                {settings.soundEnabled ? 'Ativado' : 'Muted'}
              </button>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={handleVolume}
              disabled={!settings.soundEnabled}
              className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Configurações do Dock</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-medium text-zinc-200">Efeito Lupa (Magnification)</div>
                  <div className="text-[11px] text-zinc-500">Amplia os ícones ao passar o cursor</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ dockMagnification: !settings.dockMagnification })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                    settings.dockMagnification ? 'bg-emerald-600 text-white shadow-md' : 'bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {settings.dockMagnification ? 'Ligado' : 'Desligado'}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-medium text-zinc-200">Ocultação Automática do Dock</div>
                  <div className="text-[11px] text-zinc-500">Expande a área de trabalho ocultando o Dock</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ dockAutoHide: !settings.dockAutoHide })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                    settings.dockAutoHide ? 'bg-emerald-600 text-white shadow-md' : 'bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {settings.dockAutoHide ? 'Ligado' : 'Desligado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
