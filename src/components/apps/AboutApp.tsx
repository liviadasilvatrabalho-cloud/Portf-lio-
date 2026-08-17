import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, Mail, FolderKanban, Award, MapPin, Sparkles, CheckCircle2, DownloadCloud, Github, Code2, Globe } from 'lucide-react';
import { PERSONAL_INFO, CERTIFICATES, PROJECTS, LANGUAGES } from '../../data/portfolioData';
import { AppId } from '../../types';
import { downloadResumeDocument } from '../../utils/resumeDownload';
import { soundManager } from '../../utils/audio';

interface AboutAppProps {
  onNavigateApp: (appId: AppId) => void;
}

export const AboutApp: React.FC<AboutAppProps> = ({ onNavigateApp }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadResume = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundManager.playClick();
    
    // Trigger direct file download
    const success = downloadResumeDocument();
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
    
    // Open the full interactive resume app
    setTimeout(() => {
      onNavigateApp('resume');
    }, 400);
  };

  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundManager.playClick();
    onNavigateApp('contact');
  };

  const handleExploreProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundManager.playClick();
    onNavigateApp('projects');
  };

  return (
    <div className="space-y-8 pb-4 select-text">
      {/* Toast Notification when Resume is downloaded */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Currículo baixado com sucesso! Abrindo o visualizador de currículo...</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80">PDF/TXT</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-blue-950/40 to-slate-900/90 border border-white/10 shadow-2xl">
        {/* Tech Icon Emblem (No Photo) */}
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="relative group mb-3">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 blur-md opacity-80 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center text-cyan-300 shadow-2xl">
              <Code2 className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Disponível para projetos
          </span>
        </div>

        {/* Bio Text */}
        <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Profissional</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {PERSONAL_INFO.name}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-cyan-300/90">
            {PERSONAL_INFO.role}
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {PERSONAL_INFO.bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-zinc-400 font-mono pt-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={handleDownloadResume}
          className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer text-center"
        >
          <FileDown className="w-4 h-4 shrink-0" />
          <span className="truncate">Currículo</span>
        </button>

        <button
          type="button"
          onClick={handleSendMessage}
          className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition active:scale-95 cursor-pointer text-center"
        >
          <Mail className="w-4 h-4 text-cyan-300 shrink-0" />
          <span className="truncate">Contato</span>
        </button>

        <button
          type="button"
          onClick={handleExploreProjects}
          className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition active:scale-95 cursor-pointer text-center"
        >
          <FolderKanban className="w-4 h-4 text-purple-300 shrink-0" />
          <span className="truncate">Projetos</span>
        </button>

        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 font-semibold text-xs transition active:scale-95 cursor-pointer text-center"
        >
          <Github className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="truncate">GitHub</span>
        </a>
      </div>

      {/* Specialties, Mission & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialties Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Especialidades Técnicas</span>
          </h3>
          <ul className="space-y-2">
            {PERSONAL_INFO.specialties.map((spec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Mission & Languages */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Mission Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Visão & Missão</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed italic border-l-2 border-purple-500 pl-3 my-2">
              &quot;{PERSONAL_INFO.mission}&quot;
            </p>
          </div>

          {/* Languages Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Idiomas</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {LANGUAGES.map((lang, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-white">{lang.name}</span>
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md self-start">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
