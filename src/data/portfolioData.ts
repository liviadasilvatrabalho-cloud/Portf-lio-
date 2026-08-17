import {
  AppConfig,
  CertificateItem,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  TechItem,
  Achievement,
  LanguageItem
} from '../types';

export const LANGUAGES: LanguageItem[] = [
  {
    name: 'Português',
    level: 'Nativo / Fluente'
  },
  {
    name: 'Inglês',
    level: 'Intermediário'
  },
  {
    name: 'Espanhol',
    level: 'Intermediário'
  }
];

export const PERSONAL_INFO = {
  name: 'Lívia Maria da Silva',
  role: 'Desenvolvimento de Software | Desenvolvimento Web | Inteligência Artificial',
  tagline: 'Desenvolvimento de Software | Desenvolvimento Web | Inteligência Artificial',
  location: 'Jacareí - São Paulo, Brasil / Remoto',
  email: 'liviadasilvatrabalho@gmail.com',
  phone: '+55 (12) 99653-1676',
  github: 'https://github.com/liviadasilvatrabalho-cloud',
  linkedin: 'https://linkedin.com',
  instagram: 'https://instagram.com',
  whatsapp: 'https://wa.me/5512996531676',
  avatarUrl: '',
  bio: 'Estudante de Ciência da Computação com formação técnica em Informática e foco em desenvolvimento de software. Possuo conhecimentos em desenvolvimento web, programação orientada a objetos, bancos de dados relacionais, APIs REST e versionamento de código com Git.\n\nAtualmente também estudo Inteligência Artificial e automação, buscando aplicar essas tecnologias na criação de soluções modernas e eficientes. Estou em constante evolução por meio de projetos pessoais e acadêmicos, sempre buscando aprender novas tecnologias e boas práticas de desenvolvimento.',
  mission: 'Transformar ideias em soluções inteligentes através do desenvolvimento de software e da Inteligência Artificial.',
  specialties: [
    'Desenvolvimento de Software & Aplicações Web',
    'Desenvolvimento Front-end & Mobile',
    'Inteligência Artificial & Automação',
    'APIs & Integração de Sistemas',
    'Banco de Dados & SQL Relacional',
    'Git, GitHub & Versionamento',
    'Programação Orientada a Objetos (POO) & Boas Práticas'
  ],
  stats: {
    yearsExperience: 1,
    projectsCompleted: 0
  }
};

export const APPS_CONFIG: AppConfig[] = [
  {
    id: 'about',
    title: 'Sobre Mim',
    icon: 'User',
    color: 'from-blue-600 to-cyan-500',
    category: 'core',
    defaultWidth: 840,
    defaultHeight: 620
  },
  {
    id: 'projects',
    title: 'Projetos',
    icon: 'FolderKanban',
    color: 'from-purple-600 to-indigo-500',
    category: 'core',
    defaultWidth: 920,
    defaultHeight: 680
  },
  {
    id: 'resume',
    title: 'Currículo',
    icon: 'FileText',
    color: 'from-emerald-600 to-teal-500',
    category: 'core',
    defaultWidth: 880,
    defaultHeight: 660
  },
  {
    id: 'skills',
    title: 'Competências',
    icon: 'Cpu',
    color: 'from-amber-500 to-orange-600',
    category: 'core',
    defaultWidth: 880,
    defaultHeight: 650
  },
  {
    id: 'playground',
    title: 'Playground',
    icon: 'Sparkles',
    color: 'from-fuchsia-500 to-purple-600',
    category: 'tools',
    defaultWidth: 900,
    defaultHeight: 660
  },
  {
    id: 'arcade',
    title: 'Arcade',
    icon: 'Gamepad2',
    color: 'from-red-500 to-orange-500',
    category: 'entertainment',
    defaultWidth: 880,
    defaultHeight: 640
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'Terminal',
    color: 'from-gray-800 to-black',
    category: 'tools',
    defaultWidth: 760,
    defaultHeight: 520
  },
  {
    id: 'contact',
    title: 'Contato',
    icon: 'Mail',
    color: 'from-teal-500 to-blue-600',
    category: 'core',
    defaultWidth: 780,
    defaultHeight: 580
  }
];

// Lista de projetos (atualmente vazia para inclusão futura de projetos reais pelo desenvolvedor)
export const PROJECTS: ProjectItem[] = [];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp1',
    company: 'Logística & Operações',
    role: 'Jovem Aprendiz – Logística',
    period: '2 meses',
    location: 'Jacareí - São Paulo, Brasil',
    description: 'Atuação como Jovem Aprendiz na área de logística, apoiando em rotinas operacionais, conferência e movimentação de mercadorias, organização de estoque e utilização de sistemas informatizados.',
    responsibilities: [
      'Apoio na separação e conferência de mercadorias;',
      'Organização e armazenagem de produtos;',
      'Auxílio no controle de estoque;',
      'Organização do ambiente de trabalho;',
      'Apoio às atividades operacionais da logística;',
      'Utilização de sistemas e ferramentas de informática.'
    ],
    results: [
      'Desenvolvimento de disciplina operacional, atenção a detalhes e trabalho em equipe.',
      'Aplicação prática de sistemas informatizados e rotinas de controle de estoque.'
    ],
    technologies: [
      'Sistemas de Informática',
      'Controle de Estoque',
      'Conferência de Mercadorias',
      'Rotinas Operacionais',
      'Armazenagem e Organização',
      'Microsoft Excel / Office'
    ],
    logoText: 'LOG',
    color: 'from-emerald-500 to-teal-600'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Linguagens de Programação',
    color: '#3b82f6',
    skills: [
      { name: 'JavaScript', proficiency: 'Avançado' },
      { name: 'TypeScript', proficiency: 'Intermediário/Avançado' },
      { name: 'Python', proficiency: 'Intermediário' }
    ]
  },
  {
    name: 'Desenvolvimento Web',
    color: '#06b6d4',
    skills: [
      { name: 'React', proficiency: 'Avançado' },
      { name: 'Next.js', proficiency: 'Avançado' },
      { name: 'Node.js', proficiency: 'Avançado' },
      { name: 'HTML5', proficiency: 'Especialista' },
      { name: 'CSS3', proficiency: 'Especialista' },
      { name: 'Tailwind CSS', proficiency: 'Especialista' }
    ]
  },
  {
    name: 'Desenvolvimento de Software',
    color: '#8b5cf6',
    skills: [
      { name: 'Desenvolvimento Front-end', proficiency: 'Avançado' },
      { name: 'Aplicações Web', proficiency: 'Avançado' },
      { name: 'Aplicações Mobile', proficiency: 'Intermediário' },
      { name: 'Integração de Sistemas', proficiency: 'Avançado' },
      { name: 'Desenvolvimento de Soluções com IA', proficiency: 'Avançado' }
    ]
  },
  {
    name: 'Inteligência Artificial & Automação',
    color: '#ec4899',
    skills: [
      { name: 'Integração com LLMs (Gemini e APIs de IA)', proficiency: 'Avançado' },
      { name: 'Engenharia de Prompt', proficiency: 'Avançado' },
      { name: 'Automação com IA', proficiency: 'Avançado' },
      { name: 'TensorFlow (em aprendizado)', proficiency: 'Em aprendizado' },
      { name: 'NumPy', proficiency: 'Intermediário' },
      { name: 'Pandas', proficiency: 'Intermediário' }
    ]
  },
  {
    name: 'APIs & Integrações',
    color: '#f59e0b',
    skills: [
      { name: 'APIs REST', proficiency: 'Avançado' },
      { name: 'Consumo e Integração de APIs', proficiency: 'Avançado' },
      { name: 'JSON', proficiency: 'Especialista' }
    ]
  },
  {
    name: 'Banco de Dados',
    color: '#10b981',
    skills: [
      { name: 'SQL', proficiency: 'Avançado' },
      { name: 'PostgreSQL', proficiency: 'Avançado' },
      { name: 'MySQL', proficiency: 'Avançado' },
      { name: 'Firebase', proficiency: 'Avançado' },
      { name: 'Supabase', proficiency: 'Avançado' },
      { name: 'Modelagem de Banco de Dados Relacional', proficiency: 'Avançado' }
    ]
  },
  {
    name: 'Ferramentas de Desenvolvimento',
    color: '#ef4444',
    skills: [
      { name: 'Git', proficiency: 'Avançado' },
      { name: 'GitHub', proficiency: 'Avançado' },
      { name: 'Visual Studio Code', proficiency: 'Especialista' },
      { name: 'Postman', proficiency: 'Avançado' },
      { name: 'Figma', proficiency: 'Intermediário' }
    ]
  },
  {
    name: 'Fundamentos de Computação',
    color: '#6366f1',
    skills: [
      { name: 'Programação Orientada a Objetos (POO)', proficiency: 'Avançado' },
      { name: 'Estruturas de Dados', proficiency: 'Avançado' },
      { name: 'Algoritmos', proficiency: 'Avançado' },
      { name: 'Lógica de Programação', proficiency: 'Especialista' },
      { name: 'Desenvolvimento de Sistemas', proficiency: 'Avançado' },
      { name: 'Versionamento de Código', proficiency: 'Avançado' },
      { name: 'Boas Práticas de Programação (Clean Code)', proficiency: 'Avançado' }
    ]
  },
  {
    name: 'Ferramentas de Escritório',
    color: '#14b8a6',
    skills: [
      { name: 'Microsoft Excel', proficiency: 'Avançado' },
      { name: 'Microsoft Word', proficiency: 'Avançado' },
      { name: 'Microsoft PowerPoint', proficiency: 'Avançado' }
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  // Linguagens de Programação
  { name: 'JavaScript', category: 'Linguagens de Programação', iconName: 'FileCode', level: 'Avançado', description: 'Linguagem base para desenvolvimento web reativo e interativo moderno.', glowColor: '#f7df1e' },
  { name: 'TypeScript', category: 'Linguagens de Programação', iconName: 'FileCode2', level: 'Intermediário/Avançado', description: 'Tipagem estática robusta garantindo escalabilidade e confiabilidade no código.', glowColor: '#3178c6' },
  { name: 'Python', category: 'Linguagens de Programação', iconName: 'Terminal', level: 'Intermediário', description: 'Linguagem versátil aplicada em IA, processamento de dados e scripts.', glowColor: '#3776ab' },

  // Desenvolvimento Web
  { name: 'React', category: 'Desenvolvimento Web', iconName: 'Code2', level: 'Avançado', description: 'Criação de componentes dinâmicos, hooks e interfaces web reativas.', glowColor: '#61dafb' },
  { name: 'Next.js', category: 'Desenvolvimento Web', iconName: 'Globe', level: 'Avançado', description: 'Framework React com Server-Side Rendering (SSR), rotas dinâmicas e otimização.', glowColor: '#ffffff' },
  { name: 'Node.js', category: 'Desenvolvimento Web', iconName: 'Server', level: 'Avançado', description: 'Ambiente de execução assíncrono para serviços e APIs web.', glowColor: '#339933' },
  { name: 'HTML5', category: 'Desenvolvimento Web', iconName: 'Layout', level: 'Especialista', description: 'Estruturação semântica de páginas, acessibilidade e padrões modernos.', glowColor: '#e34f26' },
  { name: 'CSS3', category: 'Desenvolvimento Web', iconName: 'Palette', level: 'Especialista', description: 'Estilização responsiva com Flexbox, CSS Grid e animações fluidas.', glowColor: '#1572b6' },
  { name: 'Tailwind CSS', category: 'Desenvolvimento Web', iconName: 'Zap', level: 'Especialista', description: 'Framework utility-first para design ágil, moderno e padronizado.', glowColor: '#38bdf8' },

  // Desenvolvimento de Software
  { name: 'Desenvolvimento Front-end', category: 'Desenvolvimento de Software', iconName: 'Layout', level: 'Avançado', description: 'Criação de interfaces responsivas, ricas e acessíveis para o usuário final.', glowColor: '#8b5cf6' },
  { name: 'Aplicações Web', category: 'Desenvolvimento de Software', iconName: 'Globe', level: 'Avançado', description: 'Engenharia completa de sistemas e plataformas baseadas em navegadores.', glowColor: '#a78bfa' },
  { name: 'Aplicações Mobile', category: 'Desenvolvimento de Software', iconName: 'Smartphone', level: 'Intermediário', description: 'Desenvolvimento de layouts e experiências adaptadas para smartphones e tablets.', glowColor: '#c084fc' },
  { name: 'Integração de Sistemas', category: 'Desenvolvimento de Software', iconName: 'Workflow', level: 'Avançado', description: 'Conexão entre serviços, plataformas e fluxos de dados unificados.', glowColor: '#7c3aed' },
  { name: 'Soluções com IA', category: 'Desenvolvimento de Software', iconName: 'Sparkles', level: 'Avançado', description: 'Incorporação de inteligência generativa e automações em produtos digitais.', glowColor: '#6d28d9' },

  // Inteligência Artificial & Automação
  { name: 'Integração com LLMs', category: 'Inteligência Artificial & Automação', iconName: 'Sparkles', level: 'Avançado', description: 'Integração com Gemini e APIs de modelos de IA de última geração.', glowColor: '#ec4899' },
  { name: 'Engenharia de Prompt', category: 'Inteligência Artificial & Automação', iconName: 'Cpu', level: 'Avançado', description: 'Formulação técnica de contextos, instruções e diretrizes para LLMs.', glowColor: '#f43f5e' },
  { name: 'Automação com IA', category: 'Inteligência Artificial & Automação', iconName: 'Bot', level: 'Avançado', description: 'Criação de fluxos e tarefas automatizadas potencializadas por modelos inteligentes.', glowColor: '#fb7185' },
  { name: 'TensorFlow', category: 'Inteligência Artificial & Automação', iconName: 'Activity', level: 'Em aprendizado', description: 'Estudos contínuos em redes neurais e machine learning.', glowColor: '#ff6f00' },
  { name: 'NumPy', category: 'Inteligência Artificial & Automação', iconName: 'Database', level: 'Intermediário', description: 'Manipulação e processamento eficiente de matrizes numéricas.', glowColor: '#4d77cf' },
  { name: 'Pandas', category: 'Inteligência Artificial & Automação', iconName: 'Layers', level: 'Intermediário', description: 'Estruturação, filtragem e análise de dados em DataFrames.', glowColor: '#130754' },

  // APIs & Integrações
  { name: 'APIs REST', category: 'APIs & Integrações', iconName: 'Share2', level: 'Avançado', description: 'Arquitetura e comunicação padronizada via HTTP/HTTPS.', glowColor: '#f59e0b' },
  { name: 'Consumo e Integração de APIs', category: 'APIs & Integrações', iconName: 'Workflow', level: 'Avançado', description: 'Requisições assíncronas, tratamento de erros e integração contínua.', glowColor: '#fbbf24' },
  { name: 'JSON', category: 'APIs & Integrações', iconName: 'FileText', level: 'Especialista', description: 'Formato universal para serialização e intercâmbio de dados.', glowColor: '#fde047' },

  // Banco de Dados
  { name: 'SQL', category: 'Banco de Dados', iconName: 'Database', level: 'Avançado', description: 'Linguagem estruturada para consultas, criação de tabelas e filtros complexos.', glowColor: '#10b981' },
  { name: 'PostgreSQL', category: 'Banco de Dados', iconName: 'Database', level: 'Avançado', description: 'SGBD relacional avançado, confiável e de alta performance.', glowColor: '#34d399' },
  { name: 'MySQL', category: 'Banco de Dados', iconName: 'Server', level: 'Avançado', description: 'Banco de dados relacional amplamente utilizado em sistemas corporativos.', glowColor: '#059669' },
  { name: 'Firebase', category: 'Banco de Dados', iconName: 'Flame', level: 'Avançado', description: 'Armazenamento em tempo real Firestore, autenticação e hosting.', glowColor: '#ffca28' },
  { name: 'Supabase', category: 'Banco de Dados', iconName: 'Zap', level: 'Avançado', description: 'Plataforma open-source com PostgreSQL e APIs REST instantâneas.', glowColor: '#3ecf8e' },
  { name: 'Modelagem de BD Relacional', category: 'Banco de Dados', iconName: 'Layers', level: 'Avançado', description: 'Diagramas Entidade-Relacionamento (ER) e normalização estruturada.', glowColor: '#047857' },

  // Ferramentas de Desenvolvimento
  { name: 'Git', category: 'Ferramentas de Desenvolvimento', iconName: 'GitBranch', level: 'Avançado', description: 'Controle de versão distribuído, branching, merges e histórico.', glowColor: '#f05032' },
  { name: 'GitHub', category: 'Ferramentas de Desenvolvimento', iconName: 'GitPullRequest', level: 'Avançado', description: 'Hospedagem de repositórios, Pull Requests e colaboração em equipe.', glowColor: '#ffffff' },
  { name: 'Visual Studio Code', category: 'Ferramentas de Desenvolvimento', iconName: 'Code', level: 'Especialista', description: 'Ambiente de desenvolvimento configurado para alta produtividade.', glowColor: '#007acc' },
  { name: 'Postman', category: 'Ferramentas de Desenvolvimento', iconName: 'Send', level: 'Avançado', description: 'Criação de coleções de teste e homologação de rotas de APIs.', glowColor: '#ff6c37' },
  { name: 'Figma', category: 'Ferramentas de Desenvolvimento', iconName: 'Figma', level: 'Intermediário', description: 'Inspeção e prototipagem de interfaces de usuário.', glowColor: '#f24e1e' },

  // Fundamentos de Computação
  { name: 'POO (Prog. Orientada a Objetos)', category: 'Fundamentos de Computação', iconName: 'BookOpen', level: 'Avançado', description: 'Classes, herança, polimorfismo, encapsulamento e abstração.', glowColor: '#6366f1' },
  { name: 'Estruturas de Dados', category: 'Fundamentos de Computação', iconName: 'Cpu', level: 'Avançado', description: 'Arrays, pilhas, filas, listas e árvores para eficiência computacional.', glowColor: '#818cf8' },
  { name: 'Algoritmos & Lógica', category: 'Fundamentos de Computação', iconName: 'CheckCircle', level: 'Especialista', description: 'Raciocínio lógico estruturado e resolução metódica de problemas.', glowColor: '#a5b4fc' },
  { name: 'Desenvolvimento de Sistemas', category: 'Fundamentos de Computação', iconName: 'Layers', level: 'Avançado', description: 'Arquitetura limpa, ciclos de vida de software e modularidade.', glowColor: '#4f46e5' },
  { name: 'Boas Práticas (Clean Code)', category: 'Fundamentos de Computação', iconName: 'CheckCircle2', level: 'Avançado', description: 'Código legível, manutenível, padronizado e documentado.', glowColor: '#4338ca' },

  // Ferramentas de Escritório
  { name: 'Microsoft Excel', category: 'Ferramentas de Escritório', iconName: 'FileSpreadsheet', level: 'Avançado', description: 'Planilhas, fórmulas analíticas e organização estruturada de dados.', glowColor: '#107c41' },
  { name: 'Microsoft Word', category: 'Ferramentas de Escritório', iconName: 'FileText', level: 'Avançado', description: 'Elaboração e formatação técnica de documentos e relatórios.', glowColor: '#185abd' },
  { name: 'Microsoft PowerPoint', category: 'Ferramentas de Escritório', iconName: 'Presentation', level: 'Avançado', description: 'Apresentações visuais claras, impactantes e estruturadas.', glowColor: '#d83b01' }
];

export const CERTIFICATES: CertificateItem[] = [];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_welcome',
    title: 'Bem-vindo ao Sistema',
    description: 'Iniciou o sistema e desbloqueou a área de trabalho.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: 'Hoje'
  },
  {
    id: 'ach_terminal',
    title: 'Hacker de Terminal',
    description: 'Executou comandos no aplicativo Terminal.',
    icon: 'Terminal',
    unlocked: false
  },
  {
    id: 'ach_gamer',
    title: 'Player número Um',
    description: 'Jogou e pontuou em um dos jogos do Arcade.',
    icon: 'Gamepad2',
    unlocked: false
  },
  {
    id: 'ach_spotlight',
    title: 'Pesquisador Veloz',
    description: 'Utilizou a busca Spotlight (Cmd+K).',
    icon: 'Search',
    unlocked: false
  },
  {
    id: 'ach_customizer',
    title: 'Designer de Interiores',
    description: 'Alterou o tema ou o papel de parede do sistema.',
    icon: 'Palette',
    unlocked: false
  }
];
