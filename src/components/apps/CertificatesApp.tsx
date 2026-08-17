import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { CERTIFICATES } from '../../data/portfolioData';
import { CertificateItem } from '../../types';

export const CertificatesApp: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <div className="space-y-6 pb-4">
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-pink-400" />
            <span>Certificações de Excelência</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Credenciais oficiais emitidas por AWS, Google Cloud, Meta e CNCF
          </p>
        </div>
      </div>

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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.imageBg} flex items-center justify-center text-pink-400 border border-pink-500/30 shadow-md`}>
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
              <span className="font-mono text-[10px] text-zinc-400">ID: {cert.credentialId}</span>
              <span className="font-semibold text-pink-400 group-hover:underline flex items-center gap-1">
                <span>Ampliar Certificado</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificate High-Res Zoom Modal */}
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

              {/* Certificate HD Display Box */}
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
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
  );
};
