import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, Github, Linkedin, MessageSquare, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

export const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      soundManager.playSuccess();
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    soundManager.playClick();
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="space-y-6 pb-6 select-text max-w-5xl mx-auto">
      {/* Mail Window Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950/90 via-blue-950/30 to-slate-950/90 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Novo E-mail para {PERSONAL_INFO.name}</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Resposta garantida em menos de 24 horas • Disponível para novas oportunidades
            </p>
          </div>
        </div>

        {copiedText && (
          <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-in fade-in shrink-0">
            ✓ Copiado: {copiedText}
          </span>
        )}
      </div>

      {/* Direct Communication Channels Grid - Responsive 2-column / 1-column card system with ample breathing room */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Canais Diretos & Redes Sociais</span>
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Clique para copiar ou abrir
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Email Direct */}
          <div
            onClick={() => handleCopy(PERSONAL_INFO.email, 'E-mail')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group shadow-md"
            title={`Copiar e-mail: ${PERSONAL_INFO.email}`}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition">
                  E-mail Direto
                </div>
                <div className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                  {PERSONAL_INFO.email}
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 text-zinc-400 group-hover:text-cyan-300 transition shrink-0">
              <Copy className="w-4 h-4" />
            </div>
          </div>

          {/* WhatsApp Direct */}
          <a
            href={PERSONAL_INFO.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-400/50 hover:bg-slate-900 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group shadow-md"
            title="Abrir conversa no WhatsApp"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition">
                  WhatsApp Direct
                </div>
                <div className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                  {PERSONAL_INFO.phone}
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 text-zinc-400 group-hover:text-emerald-300 transition shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          {/* GitHub */}
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-400/50 hover:bg-slate-900 transition-all duration-200 flex items-center justify-between gap-3 group shadow-md"
            title="Acessar perfil no GitHub"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <Github className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition">
                  GitHub Profile
                </div>
                <div className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                  {PERSONAL_INFO.github.replace('https://github.com/', '@')}
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/20 text-zinc-400 group-hover:text-purple-300 transition shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-blue-400/50 hover:bg-slate-900 transition-all duration-200 flex items-center justify-between gap-3 group shadow-md"
            title="Acessar perfil no LinkedIn"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition">
                  LinkedIn Network
                </div>
                <div className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                  {PERSONAL_INFO.name}
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 text-zinc-400 group-hover:text-blue-300 transition shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

      {/* Main Email Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl"
      >
        <div className="border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Formulário de Mensagem Direta
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">* Campos obrigatórios</span>
        </div>

        {sentSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mensagem enviada com sucesso! Entrarei em contato com você em breve.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Seu Nome *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Ana Silva"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Seu E-mail *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ana@empresa.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Assunto
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Oportunidade de Projeto / Contratação"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Sua Mensagem *
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Descreva a oportunidade, requisitos ou projeto..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSending ? (
            <span>Enviando...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar Mensagem</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

