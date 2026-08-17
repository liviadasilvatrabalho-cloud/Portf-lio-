import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Code2,
  Sliders,
  Play,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Clock,
  Zap,
  Layers,
  Terminal,
  Globe,
  FileType,
  FileCode,
  Layout,
  Eye,
  RefreshCw,
  Cpu,
  Bot
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

// ==========================================
// 1. JAVASCRIPT SNIPPETS
// ==========================================
const JS_SNIPPETS = [
  {
    title: 'Arrays & Métodos',
    code: `// Manipulação de Arrays e Métodos Modernos
const linguagens = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'];

console.log("Linguagens originais:", linguagens);

const filtradas = linguagens.filter(lang => lang.length > 4);
console.log("Linguagens com +4 letras:", filtradas);

const formatadas = linguagens.map((lang, index) => \`\${index + 1}. \${lang.toUpperCase()}\`);
console.log("Formatadas:\\n" + formatadas.join('\\n'));

return { total: linguagens.length, filtradas: filtradas.length };`
  },
  {
    title: 'Objetos & Desestruturação',
    code: `// Estrutura de dados de usuário e desestruturação
const dev = {
  nome: "Lívia Maria",
  cargo: "Desenvolvedora de Software",
  habilidades: ["React", "TypeScript", "Python", "IA"],
  anosExp: 5,
  local: "Jacareí - SP"
};

console.log("Desenvolvedora:", dev.nome);
console.warn("Anos de experiência:", dev.anosExp);

const { habilidades } = dev;
console.log("Tech Stack principal:", habilidades.join(" • "));

return Object.entries(dev);`
  },
  {
    title: 'Promessas & Async',
    code: `// Simulação de requisição assíncrona com Promise
function buscarDadosAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, mensagem: "Dados recebidos com sucesso!" });
    }, 500);
  });
}

console.log("Iniciando busca na API...");
const resultado = await buscarDadosAPI();
console.log("Resposta:", resultado.mensagem);

return resultado;`
  },
  {
    title: 'Formatador de IA / Prompt',
    code: `// Gerador simples de Prompt Estruturado para LLM
function criarPromptIA(tarefa, contexto) {
  return \`
[SISTEMA]: Você é um assistente especialista em Desenvolvimento de Software.
[CONTEXTO]: \${contexto}
[INSTRUÇÃO]: \${tarefa}
\`.trim();
}

const prompt = criarPromptIA(
  "Refatore a função de busca para utilizar async/await.",
  "Projeto em React + TypeScript com rotas REST."
);

console.log("Prompt Gerado:\\n" + prompt);
return "Prompt estruturado pronto para envio!";`
  }
];

// ==========================================
// 2. HTML & CSS SNIPPETS
// ==========================================
const HTML_CSS_SNIPPETS = [
  {
    title: 'Perfil Cyberpunk',
    html: `<div class="card">
  <div class="avatar-glow"></div>
  <h2>Lívia Maria</h2>
  <p class="role">Desenvolvimento de Software & IA</p>
  <div class="tags">
    <span class="tag">React</span>
    <span class="tag">TypeScript</span>
    <span class="tag">Python</span>
  </div>
  <button class="btn">Conectar</button>
</div>`,
    css: `body {
  margin: 0;
  padding: 24px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #090d16;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
}

.card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  max-width: 280px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.avatar-glow {
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
}

h2 {
  margin: 0 0 4px;
  font-size: 18px;
  letter-spacing: 0.5px;
}

.role {
  color: #94a3b8;
  font-size: 12px;
  margin: 0 0 16px;
}

.tags {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}

.tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.btn {
  background: linear-gradient(90deg, #0284c7, #7e22ce);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(126, 34, 206, 0.4);
}`
  },
  {
    title: 'Botão Glow Neon',
    html: `<div class="container">
  <button class="neon-btn">
    <span class="icon">✨</span>
    <span>EXPLORAR SISTEMA</span>
  </button>
</div>`,
    css: `body {
  margin: 0;
  padding: 40px;
  background: #030712;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
}

.neon-btn {
  background: #090d16;
  color: #06b6d4;
  border: 2px solid #06b6d4;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 2px;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
}

.neon-btn:hover {
  background: #06b6d4;
  color: #000;
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.8);
  transform: scale(1.05);
}`
  },
  {
    title: 'Card Glassmorphic Minimal',
    html: `<div class="glass-box">
  <div class="badge">NOVO</div>
  <h3>Sistemas Inteligentes com IA</h3>
  <p>Desenvolvimento de soluções reativas e conectadas com LLMs.</p>
</div>`,
    css: `body {
  margin: 0;
  padding: 30px;
  background: linear-gradient(135deg, #0f172a, #3b0764);
  font-family: system-ui, sans-serif;
  color: white;
  display: flex;
  justify-content: center;
}

.glass-box {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  max-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.badge {
  display: inline-block;
  background: #ec4899;
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

h3 { margin: 0 0 8px; font-size: 16px; }
p { margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.4; }`
  }
];

// ==========================================
// 3. PYTHON SNIPPETS
// ==========================================
const PYTHON_SNIPPETS = [
  {
    title: 'Análise de Dados com Listas',
    code: `# Análise de Dados com Listas e Métricas
vendas = [1500, 2300, 3100, 1800, 4200, 2900, 5000]

print("Total de vendas registradas:", len(vendas))
print("Soma total das vendas:", sum(vendas))
print("Maior venda:", max(vendas))
print("Menor venda:", min(vendas))

media = sum(vendas) / len(vendas)
print(f"Média de vendas: R$ {round(media, 2)}")

vendas_altas = [v for v in vendas if v > 2500]
print("Vendas acima de R$ 2.500:", vendas_altas)`
  },
  {
    title: 'Manipulação de Dicionários',
    code: `# Estruturas de Dados e Dicionários em Python
desenvolvedora = {
    "nome": "Lívia Maria",
    "curso": "Ciência da Computação",
    "linguagens": ["Python", "JavaScript", "TypeScript"],
    "experiencia_anos": 5,
    "foco": "Desenvolvimento de Software & IA"
}

print("Desenvolvedora:", desenvolvedora["nome"])
print("Curso:", desenvolvedora["curso"])
print("Tech Stack:", ", ".join(desenvolvedora["linguagens"]))

if desenvolvedora["experiencia_anos"] >= 3:
    print("Classificação: Nível Avançado / Experiente")
else:
    print("Classificação: Em desenvolvimento")`
  },
  {
    title: 'Funções & Algoritmo de Busca',
    code: `# Definição de Função e Filtragem de Dados
def buscar_tecnologia(termo, lista):
    resultados = []
    for item in lista:
        if termo.lower() in item.lower():
            resultados.append(item)
    return resultados

techs = ["Python", "TypeScript", "React", "Next.js", "TensorFlow", "Pandas", "PostgreSQL", "Redis"]

print("Busca por 'py':", buscar_tecnologia("py", techs))
print("Busca por 'sql':", buscar_tecnologia("sql", techs))
print("Busca por 'flow':", buscar_tecnologia("flow", techs))`
  },
  {
    title: 'Automação & Strings',
    code: `# Automação de Texto e Formatação Estruturada
def formatar_relatorio(usuario, status, tarefas):
    cabecalho = f"=== RELATÓRIO DE SISTEMA DE {usuario.upper()} ==="
    print(cabecalho)
    print(f"Status Atual: {status}")
    print(f"Total de Tarefas Pendentes: {len(tarefas)}")
    print("Lista de Atividades:")
    for i, t in enumerate(tarefas, 1):
        print(f"  {i}. [ ] {t}")

formatar_relatorio(
    "Lívia Maria",
    "Em Andamento",
    ["Ajustar API REST", "Treinar modelo de IA", "Publicar versão 2.0"]
)`
  }
];

// Presets para Glassmorphism
const GLASS_PRESETS = [
  { name: 'Elegante Transparente', blur: 16, opacity: 15, borderOpacity: 20, shadow: 25, radius: 20, tint: 'white' },
  { name: 'Efeito Gelo Foco', blur: 28, opacity: 30, borderOpacity: 40, shadow: 35, radius: 16, tint: 'cyan' },
  { name: 'Dark Cyber Glass', blur: 20, opacity: 40, borderOpacity: 15, shadow: 50, radius: 24, tint: 'dark' },
  { name: 'Sutil Neon Purple', blur: 12, opacity: 20, borderOpacity: 30, shadow: 40, radius: 18, tint: 'purple' },
  { name: 'Vidro Fosco Intenso', blur: 36, opacity: 50, borderOpacity: 50, shadow: 30, radius: 12, tint: 'white' }
];

// Helper para transcompilar Python básico em JS de forma segura para o executor
function runPythonSimulator(pyCode: string): { logs: { type: 'log' | 'warn' | 'error'; text: string }[]; time: number; error: string | null } {
  const startTime = performance.now();
  const logs: { type: 'log' | 'warn' | 'error'; text: string }[] = [];

  const pyPrint = (...args: any[]) => {
    logs.push({
      type: 'log',
      text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
    });
  };

  try {
    // Parser e interpretador em JS para subconjunto limpo de Python
    let jsCode = pyCode;

    // 1. Substituir f-strings básicos f"..." -> `...`
    jsCode = jsCode.replace(/f(["'])(.*?)\1/g, (match, quote, content) => {
      const interpolated = content.replace(/\{([^}]+)\}/g, '${$1}');
      return '`' + interpolated + '`';
    });

    // 2. Transpilar list comprehensions simples [v for v in lista if ...]
    jsCode = jsCode.replace(/\[\s*([a-zA-Z0-9_]+)\s+for\s+([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)(?:\s+if\s+(.*?))?\s*\]/g,
      (match, target, loopVar, sourceList, condition) => {
        if (condition) {
          return `${sourceList}.filter(${loopVar} => ${condition})`;
        }
        return `${sourceList}.map(${loopVar} => ${target})`;
      }
    );

    // 3. Modificações de sintaxe Python
    jsCode = jsCode
      .replace(/#.*/g, match => `//${match.slice(1)}`) // comentários
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\bprint\s*\(/g, 'pyPrint(')
      .replace(/\.append\s*\(/g, '.push(')
      .replace(/\.lower\(\)/g, '.toLowerCase()')
      .replace(/\.upper\(\)/g, '.toUpperCase()')
      .replace(/\b len\s*\((.*?)\)/g, ' $1.length')
      .replace(/\b sum\s*\((.*?)\)/g, ' ($1.reduce((a, b) => a + b, 0))')
      .replace(/\b max\s*\((.*?)\)/g, ' Math.max(...$1)')
      .replace(/\b min\s*\((.*?)\)/g, ' Math.min(...$1)')
      .replace(/\b round\s*\((.*?), (.*?)\)/g, ' Number(($1).toFixed($2))')
      .replace(/"\s*\.join\s*\((.*?)\)/g, '$1.join(", ")')
      .replace(/\b elif \b/g, ' else if ');

    // 4. Tratar blocos indentados ':' convertendo para escopo JS
    const lines = jsCode.split('\n');
    const processedLines: string[] = [];
    const indentStack: number[] = [0];

    for (let line of lines) {
      if (!line.trim() || line.trim().startsWith('//')) {
        processedLines.push(line);
        continue;
      }

      const indent = line.search(/\S/);
      const trimmed = line.trim();

      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        processedLines.push(' '.repeat(indentStack[indentStack.length - 1] || 0) + '}');
      }

      let convertedLine = line;

      if (trimmed.endsWith(':')) {
        const lineWithoutColon = trimmed.slice(0, -1);
        indentStack.push(indent + 4);

        if (lineWithoutColon.startsWith('def ')) {
          const fnMatch = lineWithoutColon.slice(4);
          convertedLine = ' '.repeat(indent) + `function ${fnMatch} {`;
        } else if (lineWithoutColon.startsWith('if ')) {
          const cond = lineWithoutColon.slice(3);
          convertedLine = ' '.repeat(indent) + `if (${cond}) {`;
        } else if (lineWithoutColon.startsWith('else if ')) {
          const cond = lineWithoutColon.slice(8);
          convertedLine = ' '.repeat(indent) + `else if (${cond}) {`;
        } else if (lineWithoutColon === 'else') {
          convertedLine = ' '.repeat(indent) + `else {`;
        } else if (lineWithoutColon.startsWith('for ')) {
          // for i, t in enumerate(tarefas, 1)
          if (lineWithoutColon.includes('enumerate(')) {
            const enumMatch = lineWithoutColon.match(/for\s+([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\s+in\s+enumerate\(([^,]+)(?:,\s*(\d+))?\)/);
            if (enumMatch) {
              const [, idxVar, valVar, listVar, startIdx = '0'] = enumMatch;
              convertedLine = ' '.repeat(indent) + `${listVar}.forEach((${valVar}, __i) => { let ${idxVar} = __i + ${startIdx};`;
            }
          } else {
            const forMatch = lineWithoutColon.match(/for\s+([a-zA-Z0-9_]+)\s+in\s+(.+)/);
            if (forMatch) {
              const [, varName, listName] = forMatch;
              convertedLine = ' '.repeat(indent) + `for (let ${varName} of ${listName}) {`;
            }
          }
        }
      }

      processedLines.push(convertedLine);
    }

    while (indentStack.length > 1) {
      indentStack.pop();
      processedLines.push(' '.repeat(indentStack[indentStack.length - 1] || 0) + '}');
    }

    const finalJS = processedLines.join('\n');
    // eslint-disable-next-line no-new-func
    const fn = new Function('pyPrint', finalJS);
    fn(pyPrint);

    const endTime = performance.now();
    return { logs, time: Number((endTime - startTime).toFixed(2)), error: null };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      logs,
      time: Number((endTime - startTime).toFixed(2)),
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

export const PlaygroundApp: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'js' | 'htmlcss' | 'python' | 'glass'>('js');

  // --- 1. JS SANDBOX STATES ---
  const [jsCode, setJsCode] = useState(JS_SNIPPETS[0].code);
  const [jsLogs, setJsLogs] = useState<{ type: 'log' | 'warn' | 'error'; text: string }[]>([]);
  const [jsReturn, setJsReturn] = useState<string | null>(null);
  const [jsTime, setJsTime] = useState<number | null>(null);
  const [jsError, setJsError] = useState<string | null>(null);
  const [copiedJs, setCopiedJs] = useState(false);

  // --- 2. HTML & CSS STATES ---
  const [htmlCode, setHtmlCode] = useState(HTML_CSS_SNIPPETS[0].html);
  const [cssCode, setCssCode] = useState(HTML_CSS_SNIPPETS[0].css);
  const [htmlTab, setHtmlTab] = useState<'html' | 'css'>('html');
  const [copiedHtmlCss, setCopiedHtmlCss] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- 3. PYTHON STATES ---
  const [pyCode, setPyCode] = useState(PYTHON_SNIPPETS[0].code);
  const [pyLogs, setPyLogs] = useState<{ type: 'log' | 'warn' | 'error'; text: string }[]>([]);
  const [pyTime, setPyTime] = useState<number | null>(null);
  const [pyError, setPyError] = useState<string | null>(null);
  const [copiedPy, setCopiedPy] = useState(false);

  // --- 4. GLASSMORPHISM STATES ---
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(20);
  const [borderOpacity, setBorderOpacity] = useState(25);
  const [shadow, setShadow] = useState(30);
  const [radius, setRadius] = useState(16);
  const [glassTint, setGlassTint] = useState<'white' | 'dark' | 'cyan' | 'purple'>('white');
  const [glassBgMode, setGlassBgMode] = useState<'vibrant' | 'mesh' | 'dark' | 'grid'>('vibrant');
  const [copiedCssGlass, setCopiedCssGlass] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);

  // --- JS EXECUTION ---
  const runJsCode = async () => {
    soundManager.playClick();
    const startTime = performance.now();
    const logs: { type: 'log' | 'warn' | 'error'; text: string }[] = [];

    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push({
          type: 'log',
          text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
        });
      },
      warn: (...args: unknown[]) => {
        logs.push({
          type: 'warn',
          text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
        });
      },
      error: (...args: unknown[]) => {
        logs.push({
          type: 'error',
          text: args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
        });
      }
    };

    try {
      setJsError(null);
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fn = new AsyncFunction('console', jsCode);
      const result = await fn(customConsole);

      const endTime = performance.now();
      setJsTime(Number((endTime - startTime).toFixed(2)));
      setJsLogs(logs);

      if (result !== undefined) {
        setJsReturn(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      } else {
        setJsReturn(null);
      }
    } catch (err: unknown) {
      const endTime = performance.now();
      setJsTime(Number((endTime - startTime).toFixed(2)));
      setJsLogs(logs);
      setJsReturn(null);
      setJsError(err instanceof Error ? err.message : String(err));
    }
  };

  // --- HTML/CSS PREVIEW UPDATE ---
  useEffect(() => {
    if (activeTool === 'htmlcss' && iframeRef.current) {
      const document = iframeRef.current.contentDocument;
      if (document) {
        document.open();
        document.write(`
          <!Root html>
          <html>
            <head>
              <style>${cssCode}</style>
            </head>
            <body>
              ${htmlCode}
            </body>
          </html>
        `);
        document.close();
      }
    }
  }, [htmlCode, cssCode, activeTool]);

  // --- PYTHON EXECUTION ---
  const runPyCode = () => {
    soundManager.playClick();
    const res = runPythonSimulator(pyCode);
    setPyLogs(res.logs);
    setPyTime(res.time);
    setPyError(res.error);
  };

  // --- GLASSMORPHISM LOGIC ---
  const getTintRgb = () => {
    switch (glassTint) {
      case 'dark': return '15, 23, 42';
      case 'cyan': return '6, 182, 212';
      case 'purple': return '168, 85, 247';
      default: return '255, 255, 255';
    }
  };

  const cssGlassCode = `/* CSS Glassmorphism */
background: rgba(${getTintRgb()}, ${opacity / 100});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(${getTintRgb()}, ${borderOpacity / 100});
border-radius: ${radius}px;
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, ${shadow / 100});`;

  const tailwindGlassCode = `bg-[rgba(${getTintRgb().replace(/ /g, '')},${(opacity / 100).toFixed(2)})] backdrop-blur-[${blur}px] border border-[rgba(${getTintRgb().replace(/ /g, '')},${(borderOpacity / 100).toFixed(2)})] rounded-[${radius}px] shadow-[0_8px_32px_rgba(0,0,0,${(shadow / 100).toFixed(2)})]`;

  return (
    <div className="space-y-6 pb-4 select-text">
      {/* Top Header & Main Tools Selection */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Laboratório & Code Sandbox Multi-Linguagem</h2>
            <p className="text-xs text-zinc-400">Ambientes de teste interativos em tempo real para JS, HTML/CSS, Python e UI</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {/* JS Button */}
          <button
            onClick={() => { setActiveTool('js'); soundManager.playClick(); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'js'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-300" />
            <span>JavaScript</span>
          </button>

          {/* HTML & CSS Button */}
          <button
            onClick={() => { setActiveTool('htmlcss'); soundManager.playClick(); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'htmlcss'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-300" />
            <span>HTML & CSS</span>
          </button>

          {/* Python Button */}
          <button
            onClick={() => { setActiveTool('python'); soundManager.playClick(); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'python'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-300" />
            <span>Python</span>
          </button>

          {/* Glassmorphism Button */}
          <button
            onClick={() => { setActiveTool('glass'); soundManager.playClick(); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'glass'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4 text-pink-300" />
            <span>Glassmorphism</span>
          </button>
        </div>
      </div>

      {/* ==================== 1. JAVASCRIPT SANDBOX ==================== */}
      {activeTool === 'js' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 px-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Exemplos Prontos JS:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {JS_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.title}
                  onClick={() => {
                    soundManager.playClick();
                    setJsCode(snippet.code);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-zinc-300 transition border border-white/5"
                >
                  {snippet.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* JS Editor */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-bold text-purple-300 truncate">JS Playground (ES6 / Async)</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => { setJsCode(''); soundManager.playClick(); }}
                    title="Limpar Código"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(jsCode);
                      soundManager.playClick();
                      setCopiedJs(true);
                      setTimeout(() => setCopiedJs(false), 2000);
                    }}
                    title="Copiar Código"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {copiedJs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={runJsCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Executar JS</span>
                  </button>
                </div>
              </div>

              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                rows={12}
                className="w-full flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-purple-100 outline-none focus:border-purple-500/50 resize-none select-text touch-auto leading-relaxed"
                placeholder="// Digite seu código JavaScript..."
                spellCheck={false}
              />
            </div>

            {/* JS Output */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col justify-between min-w-0">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-cyan-300 truncate">Console & Saída</span>
                    {jsTime !== null && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {jsTime} ms
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { setJsLogs([]); setJsReturn(null); setJsError(null); soundManager.playClick(); }}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar Console</span>
                  </button>
                </div>

                <div className="space-y-2 h-64 overflow-y-auto pr-1 font-mono text-xs">
                  {jsLogs.length === 0 && !jsReturn && !jsError && (
                    <div className="h-full flex items-center justify-center text-zinc-500 italic text-center p-6">
                      Clique em "Executar JS" para rodar o código e visualizar as saídas no console.
                    </div>
                  )}

                  {jsLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border leading-relaxed whitespace-pre-wrap ${
                        log.type === 'warn'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                          : log.type === 'error'
                          ? 'bg-red-500/10 border-red-500/20 text-red-300'
                          : 'bg-slate-900 border-white/5 text-emerald-300'
                      }`}
                    >
                      <span className="text-[10px] opacity-60 uppercase mr-2 font-bold font-sans">
                        [{log.type}]
                      </span>
                      {log.text}
                    </div>
                  ))}

                  {jsError && (
                    <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 whitespace-pre-wrap">
                      <div className="font-bold text-red-400 mb-1">❌ Erro de Execução</div>
                      {jsError}
                    </div>
                  )}

                  {jsReturn !== null && (
                    <div className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                        ➜ Retorno (Return):
                      </div>
                      <pre className="whitespace-pre-wrap overflow-x-auto text-xs text-indigo-100 font-mono">
                        {jsReturn}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. HTML & CSS STUDIO ==================== */}
      {activeTool === 'htmlcss' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 px-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modelos HTML & CSS:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HTML_CSS_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.title}
                  onClick={() => {
                    soundManager.playClick();
                    setHtmlCode(snippet.html);
                    setCssCode(snippet.css);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-zinc-300 transition border border-white/5"
                >
                  {snippet.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Editor Area (HTML / CSS tabs) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => { setHtmlTab('html'); soundManager.playClick(); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      htmlTab === 'html'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <FileType className="w-3.5 h-3.5" />
                    <span>HTML Editor</span>
                  </button>
                  <button
                    onClick={() => { setHtmlTab('css'); soundManager.playClick(); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      htmlTab === 'css'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>CSS Editor</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}`);
                    soundManager.playClick();
                    setCopiedHtmlCss(true);
                    setTimeout(() => setCopiedHtmlCss(false), 2000);
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0"
                >
                  {copiedHtmlCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtmlCss ? 'Copiado!' : 'Copiar Ambos'}</span>
                </button>
              </div>

              {htmlTab === 'html' ? (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  rows={13}
                  className="w-full flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/50 resize-none select-text leading-relaxed"
                  placeholder="<!-- Digite seu HTML aqui... -->"
                  spellCheck={false}
                />
              ) : (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  rows={13}
                  className="w-full flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-purple-200 outline-none focus:border-purple-500/50 resize-none select-text leading-relaxed"
                  placeholder="/* Digite seu CSS aqui... */"
                  spellCheck={false}
                />
              )}
            </div>

            {/* Live Render Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col justify-between min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 min-w-0 truncate">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Resultado Visual em Tempo Real</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">Renderização Reativa</span>
              </div>

              <div className="w-full h-72 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shadow-inner relative">
                <iframe
                  ref={iframeRef}
                  title="HTML/CSS Live Preview"
                  className="w-full h-full border-0 bg-transparent"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. PYTHON PLAYGROUND ==================== */}
      {activeTool === 'python' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 px-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exemplos em Python:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PYTHON_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.title}
                  onClick={() => {
                    soundManager.playClick();
                    setPyCode(snippet.code);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-zinc-300 transition border border-white/5"
                >
                  {snippet.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Python Editor */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-bold text-emerald-300 truncate">Python 3 Interpreter</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => { setPyCode(''); soundManager.playClick(); }}
                    title="Limpar Código"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pyCode);
                      soundManager.playClick();
                      setCopiedPy(true);
                      setTimeout(() => setCopiedPy(false), 2000);
                    }}
                    title="Copiar Código"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {copiedPy ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={runPyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Executar Python</span>
                  </button>
                </div>
              </div>

              <textarea
                value={pyCode}
                onChange={(e) => setPyCode(e.target.value)}
                rows={12}
                className="w-full flex-1 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-100 outline-none focus:border-emerald-500/50 resize-none select-text leading-relaxed"
                placeholder="# Digite seu código Python aqui..."
                spellCheck={false}
              />
            </div>

            {/* Python Console */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 shadow-xl flex flex-col justify-between min-w-0">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 truncate">Terminal Output (stdout)</span>
                    {pyTime !== null && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {pyTime} ms
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { setPyLogs([]); setPyError(null); soundManager.playClick(); }}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar Terminal</span>
                  </button>
                </div>

                <div className="space-y-2 h-64 overflow-y-auto pr-1 font-mono text-xs">
                  {pyLogs.length === 0 && !pyError && (
                    <div className="h-full flex items-center justify-center text-zinc-500 italic text-center p-6">
                      Clique em "Executar Python" para interpretar e ver as saídas do print().
                    </div>
                  )}

                  {pyLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-900 border border-white/5 text-emerald-300 leading-relaxed whitespace-pre-wrap font-mono"
                    >
                      {log.text}
                    </div>
                  ))}

                  {pyError && (
                    <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 whitespace-pre-wrap">
                      <div className="font-bold text-red-400 mb-1">❌ Python Syntax Error / Runtime Error</div>
                      {pyError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. GERADOR GLASSMORPHISM ==================== */}
      {activeTool === 'glass' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Presets de Vidro:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {GLASS_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    soundManager.playClick();
                    setBlur(preset.blur);
                    setOpacity(preset.opacity);
                    setBorderOpacity(preset.borderOpacity);
                    setShadow(preset.shadow);
                    setRadius(preset.radius);
                    setGlassTint(preset.tint as any);
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium text-zinc-200 transition border border-white/10"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Controls */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4 shadow-xl min-w-0">
              <h3 className="text-sm font-bold text-white flex flex-wrap items-center justify-between gap-2">
                <span>Controles de Estilização</span>
                <span className="text-xs font-mono text-pink-400 font-normal">Backdrop Filter / CSS</span>
              </h3>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Tonalidade do Vidro</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'white', label: 'Claro' },
                    { id: 'dark', label: 'Escuro' },
                    { id: 'cyan', label: 'Ciano' },
                    { id: 'purple', label: 'Roxo' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setGlassTint(t.id as any); soundManager.playClick(); }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        glassTint === t.id
                          ? 'bg-pink-600 text-white border-pink-400 shadow-md'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1 font-mono">
                  <span>Blur (Desfoque):</span>
                  <span className="text-pink-400 font-bold">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1 font-mono">
                  <span>Opacidade Fundo:</span>
                  <span className="text-pink-400 font-bold">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1 font-mono">
                  <span>Opacidade Borda:</span>
                  <span className="text-pink-400 font-bold">{borderOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1 font-mono">
                  <span>Arredondamento (Radius):</span>
                  <span className="text-pink-400 font-bold">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cssGlassCode);
                    soundManager.playClick();
                    setCopiedCssGlass(true);
                    setTimeout(() => setCopiedCssGlass(false), 2000);
                  }}
                  className="py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  {copiedCssGlass ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCssGlass ? 'CSS Copiado!' : 'Copiar CSS'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tailwindGlassCode);
                    soundManager.playClick();
                    setCopiedTailwind(true);
                    setTimeout(() => setCopiedTailwind(false), 2000);
                  }}
                  className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  {copiedTailwind ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTailwind ? 'Tailwind Copiado!' : 'Copiar Tailwind'}</span>
                </button>
              </div>
            </div>

            {/* Preview Stage */}
            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-zinc-300">
                <span className="font-bold text-zinc-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <span>Fundo de Teste:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'vibrant', label: 'Gradiente' },
                    { id: 'mesh', label: 'Formas' },
                    { id: 'grid', label: 'Grid' },
                    { id: 'dark', label: 'Escuro' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setGlassBgMode(m.id as any); soundManager.playClick(); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        glassBgMode === m.id
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`p-8 rounded-2xl flex items-center justify-center min-h-[280px] relative overflow-hidden shadow-2xl transition-all duration-300 ${
                  glassBgMode === 'vibrant'
                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
                    : glassBgMode === 'mesh'
                    ? 'bg-slate-950'
                    : glassBgMode === 'grid'
                    ? 'bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]'
                    : 'bg-slate-950'
                }`}
              >
                {glassBgMode === 'mesh' && (
                  <>
                    <div className="absolute top-4 left-6 w-32 h-32 bg-purple-500/40 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-4 right-6 w-36 h-36 bg-pink-500/40 rounded-full blur-2xl animate-pulse" />
                  </>
                )}

                <div
                  style={{
                    backgroundColor: `rgba(${getTintRgb()}, ${opacity / 100})`,
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    border: `1px solid rgba(${getTintRgb()}, ${borderOpacity / 100})`,
                    borderRadius: `${radius}px`,
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${shadow / 100})`
                  }}
                  className="p-6 text-white max-w-sm w-full text-center space-y-3 relative z-10 transition-all duration-150"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto border border-white/30 shadow-inner">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Cartão Glassmorphic</h4>
                    <p className="text-xs text-white/80 mt-1">
                      Renderização real usando propriedades CSS modernas e transparência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
