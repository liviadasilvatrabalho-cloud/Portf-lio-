import { PERSONAL_INFO, EXPERIENCES, CERTIFICATES, SKILL_CATEGORIES, LANGUAGES } from '../data/portfolioData';

/**
 * Generates and triggers the immediate download of the complete, formatted curriculum document.
 */
export const downloadResumeDocument = (): boolean => {
  try {
    const languagesFormatted = LANGUAGES.map(
      (lang) => `• ${lang.name}: ${lang.level}`
    ).join('\n');

    const skillsFormatted = SKILL_CATEGORIES.map(
      (cat) =>
        `• ${cat.name}:\n  ${cat.skills.map((s) => (s.proficiency ? `${s.name} (${s.proficiency})` : s.name)).join(', ')}`
    ).join('\n\n');

    const experiencesFormatted = EXPERIENCES.map(
      (exp) =>
        `================================================================================
${exp.role.toUpperCase()} | ${exp.company.toUpperCase()}
Período: ${exp.period} | Localidade: ${exp.location}
--------------------------------------------------------------------------------
${exp.description}

Principais Atividades e Responsabilidades:
${exp.responsibilities.map((r) => `  - ${r}`).join('\n')}

Resultados e Impacto:
${exp.results.map((res) => `  - ${res}`).join('\n')}

Tecnologias Utilizadas: ${exp.technologies.join(', ')}`
    ).join('\n\n');

    const certificatesSection = CERTIFICATES.length > 0
      ? `\n--------------------------------------------------------------------------------\nCERTIFICAÇÕES & FORMAÇÃO COMPLEMENTAR\n--------------------------------------------------------------------------------\n${CERTIFICATES.map((cert) => `• ${cert.title} — ${cert.issuer} (${cert.date}) [ID: ${cert.credentialId}]`).join('\n')}\n`
      : '';

    const content = `================================================================================
${PERSONAL_INFO.name.toUpperCase()}
${PERSONAL_INFO.role}
================================================================================
E-mail: ${PERSONAL_INFO.email}
Telefone / WhatsApp: ${PERSONAL_INFO.phone}
Localização: ${PERSONAL_INFO.location}
GitHub: ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}

--------------------------------------------------------------------------------
RESUMO PROFISSIONAL
--------------------------------------------------------------------------------
${PERSONAL_INFO.bio}

Missão Profissional:
"${PERSONAL_INFO.mission}"

--------------------------------------------------------------------------------
IDIOMAS
--------------------------------------------------------------------------------
${languagesFormatted}

--------------------------------------------------------------------------------
HABILIDADES TÉCNICAS & COMPETÊNCIAS
--------------------------------------------------------------------------------
${skillsFormatted}

--------------------------------------------------------------------------------
EXPERIÊNCIA PROFISSIONAL
--------------------------------------------------------------------------------
${experiencesFormatted}
${certificatesSection}
================================================================================
Documento gerado e exportado via Portfólio Interativo de ${PERSONAL_INFO.name}
================================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = PERSONAL_INFO.name.replace(/\s+/g, '_');
    link.download = `Curriculo_${sanitizedName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Falha ao baixar currículo:', error);
    return false;
  }
};
