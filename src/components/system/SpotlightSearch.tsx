import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FolderKanban, Cpu, Terminal, ArrowRight, User, Briefcase, Award, Sparkles } from 'lucide-react';
import { AppId } from '../../types';
import { APPS_CONFIG, PROJECTS, SKILL_CATEGORIES } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'App' | 'Projeto' | 'Habilidade' | 'Comando';
  appId: AppId;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onOpenApp
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable items
  const allResults: SearchResult[] = [];

  // Add Apps
  APPS_CONFIG.forEach((app) => {
    allResults.push({
      id: `app_${app.id}`,
      title: app.title,
      subtitle: `Aplicativo do sistema (${app.category})`,
      category: 'App',
      appId: app.id
    });
  });

  // Add Projects
  PROJECTS.forEach((proj) => {
    allResults.push({
      id: `proj_${proj.id}`,
      title: proj.title,
      subtitle: proj.shortDescription,
      category: 'Projeto',
      appId: 'projects'
    });
  });

  // Add Skills
  SKILL_CATEGORIES.forEach((cat) => {
    cat.skills.forEach((sk) => {
      allResults.push({
        id: `sk_${sk.name}`,
        title: sk.name,
        subtitle: sk.proficiency
          ? `Habilidade em ${cat.name} • ${sk.proficiency}`
          : `Habilidade em ${cat.name}`,
        category: 'Habilidade',
        appId: 'skills'
      });
    });
  });

  // Filter items based on query
  const filteredResults = query.trim() === ''
    ? allResults.slice(0, 6)
    : allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  const handleSelect = (result: SearchResult) => {
    soundManager.playClick();
    onOpenApp(result.appId);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 bg-slate-950/60 backdrop-blur-md px-3 sm:px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden text-white"
        >
          {/* Spotlight Input Box */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-black/20">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar projetos, habilidades, apps..."
              className="w-full bg-transparent text-base text-white placeholder-white/40 outline-none font-sans"
            />
            <kbd className="px-2 py-1 rounded-md text-xs text-white/40 border border-white/10 font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Search Results List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-sm">
                Nenhum resultado encontrado para &quot;{query}&quot;.
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'hover:bg-white/5 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-cyan-400'}`}>
                        {item.category === 'App' && <User className="w-4 h-4" />}
                        {item.category === 'Projeto' && <FolderKanban className="w-4 h-4" />}
                        {item.category === 'Habilidade' && <Cpu className="w-4 h-4" />}
                        {item.category === 'Comando' && <Terminal className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-tight">
                          {item.title}
                        </div>
                        <div className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-400 border border-white/10'
                      }`}>
                        {item.category}
                      </span>
                      <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Spotlight Footer Keyboard Hints */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <span>↑↓ para navegar</span>
              <span>↵ para abrir</span>
            </div>
            <span>Spotlight Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
