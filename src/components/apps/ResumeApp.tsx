import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Briefcase,
  Award,
  FileDown,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Github,
  Globe,
  X
} from 'lucide-react';
import {
  PERSONAL_INFO,
  EXPERIENCES,
  CERTIFICATES,
  SKILL_CATEGORIES,
  LANGUAGES
} from '../../data/portfolioData';
import { CertificateItem } from '../../types';
import { downloadResumeDocument } from '../../utils/resumeDownload';

export const ResumeApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'certificates' | 'document'>('experience');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadResumeDocument();
  };

  return (
    <div className="space-y-6 pb-4 select-text">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'experience'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-300" />
          <span>Experiência</span>
        </button>

        {CERTIFICATES.length > 0 && (
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-pink-500/20'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4 text-pink-300" />
            <span>Certificados</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('document')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'document'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-300" />
          <span>Baixar CV / Documento</span>
        </button>
      </div>

      {/* TAB 1: EXPERIÊNCIA PROFISSIONAL */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Trajetória Profissional</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Histórico e vivência no ambiente corporativo
              </p>
            </div>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-emerald-500 before:to-purple-600">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.08 }}
                className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_10px_#10b981]" />

                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exp.color} text-white font-black text-xs flex items-center justify-center shadow-lg tracking-wider`}
                    >
                      {exp.logoText}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{exp.role}</h3>
                      <div className="text-xs font-semibold text-emerald-300">
                        {exp.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1 text-cyan-300 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-zinc-300 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                <div className="space-y-2 mb-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <h4 className="text-xs font-bold text-zinc-200 tracking-wider font-mono">
                    Atribuições e Projetos Principais
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Resultados e Métricas Alcançadas</span>
                  </h4>
                  {exp.results.map((res, i) => (
                    <p key={i} className="text-xs text-emerald-200 font-medium pl-5">
                      • {res}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Languages Section */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Idiomas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LANGUAGES.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{lang.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICADOS */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-400" />
                <span>Certificações & Cursos</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {CERTIFICATES.length > 0
                  ? 'Credenciais e certificações técnicas obtidas'
                  : 'Nenhum certificado cadastrado no momento.'}
              </p>
            </div>
          </div>

          {CERTIFICATES.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CERTIFICATES.map((cert) => (
                <motion.div
                  key={cert.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedCert(cert)}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-pink-500/40 shadow-xl cursor-pointer transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.imageBg} flex items-center justify-center text-pink-400 border border-pink-500/30 shadow-md`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition line-clamp-1">
                          {cert.title}
                        </h3>
                        <div className="text-xs text-zinc-400 font-medium">{cert.issuer}</div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                      {cert.date}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-zinc-400">
                      ID: {cert.credentialId}
                    </span>
                    <span className="font-semibold text-pink-400 group-hover:underline flex items-center gap-1">
                      <span>Ampliar Certificado</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 text-center space-y-3">
              <Award className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-300 font-semibold">Nenhum certificado incluído até o momento.</p>
              <p className="text-xs text-zinc-500">Novas certificações e cursos concluídos serão exibidos nesta área em breve.</p>
            </div>
          )}

          {/* Certificate Zoom Modal */}
          <AnimatePresence>
            {selectedCert && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                onClick={() => setSelectedCert(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-xl rounded-2xl bg-slate-900 border border-pink-500/40 p-6 text-white shadow-2xl space-y-6"
                >
                  <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-pink-400" />
                      <h3 className="text-base font-bold text-white">Certificado Autenticado</h3>
                    </div>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-8 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-pink-500/30 text-center space-y-4 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

                    <Award className="w-16 h-16 text-pink-400 mx-auto drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />

                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-pink-300">
                        CERTIFICADO OFICIAL
                      </div>
                      <h2 className="text-xl font-black text-white mt-1">
                        {selectedCert.title}
                      </h2>
                      <div className="text-sm font-semibold text-zinc-300 mt-1">
                        Emitido por {selectedCert.issuer}
                      </div>
                    </div>

                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-zinc-300">
                      Credential ID: {selectedCert.credentialId}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-zinc-400">
                      Ano de Homologação: {selectedCert.date}
                    </span>

                    <a
                      href={selectedCert.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs shadow-lg transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Validar na Emissora</span>
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 3: DOCUMENTO DO CURRÍCULO */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-zinc-300">
              Visualizador de Documentos • CV_Livia_Maria_da_Silva.pdf
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-300" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-semibold text-white shadow-lg transition cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Baixar CV</span>
              </button>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-950/90 border border-white/15 text-zinc-100 shadow-2xl space-y-6 font-sans max-w-3xl mx-auto">
            <div className="border-b border-white/15 pb-6 flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {PERSONAL_INFO.name}
                </h1>
                <p className="text-sm font-semibold text-cyan-400 mt-0.5">
                  {PERSONAL_INFO.role}
                </p>
              </div>

              <div className="text-xs space-y-1 font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-cyan-400" />
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:underline"
                  >
                    github.com/liviadasilvatrabalho-cloud
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase font-mono border-b border-cyan-500/30 pb-1">
                Resumo Profissional
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {PERSONAL_INFO.bio}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase font-mono border-b border-cyan-500/30 pb-1">
                Competências & Habilidades Técnicas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                    <span className="font-bold text-white block text-[11px] text-cyan-300">{cat.name}</span>
                    <p className="text-[11px] text-zinc-300">
                      {cat.skills.map((s) => (s.proficiency ? `${s.name} (${s.proficiency})` : s.name)).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase font-mono border-b border-cyan-500/30 pb-1">
                Experiências Principais
              </h2>
              <div className="space-y-4">
                {EXPERIENCES.map((exp) => (
                  <div key={exp.id} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>
                        {exp.role} — <span className="text-cyan-400">{exp.company}</span>
                      </span>
                      <span className="font-mono text-zinc-400">{exp.period}</span>
                    </div>
                    <p className="text-zinc-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase font-mono border-b border-cyan-500/30 pb-1">
                Idiomas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {LANGUAGES.map((lang, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="font-semibold text-white">{lang.name}</span>
                    <span className="font-mono text-cyan-300 text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {CERTIFICATES.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-extrabold text-cyan-300 tracking-wider uppercase font-mono border-b border-cyan-500/30 pb-1">
                  Certificações Oficiais
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {CERTIFICATES.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                      <span className="font-semibold text-white">{cert.title}</span>
                      <span className="font-mono text-zinc-400 text-[10px]">{cert.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
