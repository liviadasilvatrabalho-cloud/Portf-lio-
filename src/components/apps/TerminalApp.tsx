import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, EXPERIENCES } from '../../data/portfolioData';
import { soundManager } from '../../utils/audio';

interface TerminalHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  isNew?: boolean;
}

const LOCAL_STORAGE_CMD_KEY = 'terminal_command_history';
const LOCAL_STORAGE_OUTPUT_KEY = 'terminal_output_history';

function getTotalCharCount(node: React.ReactNode): number {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return 0;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).length;
  }
  if (Array.isArray(node)) {
    return node.reduce((acc, child) => acc + getTotalCharCount(child), 0);
  }
  if (React.isValidElement(node)) {
    return getTotalCharCount((node.props as { children?: React.ReactNode }).children);
  }
  return 0;
}

function truncateReactNode(
  node: React.ReactNode,
  state: { remaining: number }
): React.ReactNode {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return null;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    const str = String(node);
    if (state.remaining <= 0) {
      return '';
    }
    if (state.remaining >= str.length) {
      state.remaining -= str.length;
      return str;
    }
    const sliced = str.slice(0, state.remaining);
    state.remaining = 0;
    return sliced;
  }
  if (Array.isArray(node)) {
    const result: React.ReactNode[] = [];
    for (let i = 0; i < node.length; i++) {
      if (state.remaining <= 0) break;
      const child = node[i];
      result.push(truncateReactNode(child, state));
    }
    return result;
  }
  if (React.isValidElement(node)) {
    if (state.remaining <= 0) {
      return null;
    }
    const children = (node.props as { children?: React.ReactNode }).children;
    const truncatedChildren = truncateReactNode(children, state);
    return React.cloneElement(node, { ...node.props, key: node.key }, truncatedChildren);
  }
  return null;
}

interface TypewriterOutputProps {
  children: React.ReactNode;
  animate?: boolean;
  onTick?: () => void;
}

const TypewriterOutput: React.FC<TypewriterOutputProps> = ({
  children,
  animate = true,
  onTick
}) => {
  const totalChars = useMemo(() => getTotalCharCount(children), [children]);
  const [visibleChars, setVisibleChars] = useState(animate ? 0 : totalChars);

  useEffect(() => {
    if (!animate) {
      setVisibleChars(totalChars);
      return;
    }

    setVisibleChars(0);
    const charsPerTick = Math.max(1, Math.ceil(totalChars / 45));
    const intervalTime = 12;

    const timer = setInterval(() => {
      setVisibleChars((prev) => {
        const next = prev + charsPerTick;
        if (next >= totalChars) {
          clearInterval(timer);
          return totalChars;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [children, animate, totalChars]);

  useEffect(() => {
    if (animate && visibleChars <= totalChars) {
      onTick?.();
    }
  }, [visibleChars, animate, totalChars, onTick]);

  if (!animate || visibleChars >= totalChars) {
    return <>{children}</>;
  }

  const truncated = truncateReactNode(children, { remaining: visibleChars });

  return (
    <div className="inline-block relative">
      {truncated}
      <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse align-middle shrink-0" />
    </div>
  );
};

const getCommandOutput = (rawCmd: string): React.ReactNode => {
  const cmd = rawCmd.trim().toLowerCase();

  switch (cmd) {
    case 'neofetch':
      return (
        <div className="text-xs font-mono space-y-1 text-cyan-300">
          <div>Apex Studio v15.4 (x86_64-apex-darwin23)</div>
          <div>---------------------------------------------</div>
          <div>OS: Apex Portfolio Edition</div>
          <div>Kernel: Darwin 23.4.0</div>
          <div>Developer: {PERSONAL_INFO.name}</div>
          <div>Role: {PERSONAL_INFO.role}</div>
          <div>Type &apos;help&apos; to view available commands.</div>
        </div>
      );

    case 'help':
      return (
        <div className="space-y-1 font-mono text-xs text-zinc-300">
          <div className="text-cyan-400 font-bold">Comandos disponíveis:</div>
          <div>• <span className="text-amber-300 font-bold">about</span> - Exibe informações e biografia do desenvolvedor</div>
          <div>• <span className="text-amber-300 font-bold">projects</span> - Lista os principais projetos entregues</div>
          <div>• <span className="text-amber-300 font-bold">skills</span> - Lista competências técnicas</div>
          <div>• <span className="text-amber-300 font-bold">experience</span> - Exibe histórico profissional</div>
          <div>• <span className="text-amber-300 font-bold">contact</span> - Mostra dados de e-mail e redes</div>
          <div>• <span className="text-amber-300 font-bold">whoami</span> - Exibe usuário ativo na sessão</div>
          <div>• <span className="text-amber-300 font-bold">date</span> - Exibe data e hora do sistema</div>
          <div>• <span className="text-amber-300 font-bold">ls</span> - Lista arquivos e diretórios virtuais</div>
          <div>• <span className="text-amber-300 font-bold">cat resume.txt</span> - Exibe currículo em texto puro</div>
          <div>• <span className="text-amber-300 font-bold">clear</span> - Limpa a tela do terminal</div>
        </div>
      );

    case 'about':
      return (
        <div className="text-xs font-mono space-y-1 text-zinc-300">
          <div className="font-bold text-cyan-300">{PERSONAL_INFO.name} — {PERSONAL_INFO.role}</div>
          <div>{PERSONAL_INFO.bio}</div>
          <div className="text-emerald-400">Localização: {PERSONAL_INFO.location}</div>
        </div>
      );

    case 'projects':
      return PROJECTS.length > 0 ? (
        <div className="text-xs font-mono space-y-2">
          <div className="font-bold text-purple-300">Projetos em Destaque ({PROJECTS.length}):</div>
          {PROJECTS.map((p) => (
            <div key={p.id} className="border-l-2 border-purple-500 pl-2 text-zinc-300">
              <span className="font-bold text-white">{p.title}</span> ({p.category}, {p.year})
              <div className="text-zinc-400 text-[11px]">{p.shortDescription}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-mono space-y-1.5 text-zinc-300">
          <div className="font-bold text-purple-300">Projetos:</div>
          <div className="text-amber-300">Nenhum projeto publicado no momento.</div>
          <div className="text-zinc-400 text-[11px]">Projetos práticos em desenvolvimento — serão adicionados em breve!</div>
        </div>
      );

    case 'skills':
      return (
        <div className="text-xs font-mono space-y-2">
          <div className="font-bold text-amber-300">Habilidades e Competências Técnicas:</div>
          {SKILL_CATEGORIES.map((cat, i) => (
            <div key={i}>
              <span className="font-bold text-cyan-300">[{cat.name}]:</span>{' '}
              <span className="text-zinc-300">
                {cat.skills
                  .map((s) => (s.proficiency ? `${s.name} (${s.proficiency})` : s.name))
                  .join(' • ')}
              </span>
            </div>
          ))}
        </div>
      );

    case 'experience':
      return (
        <div className="text-xs font-mono space-y-2">
          <div className="font-bold text-emerald-300">Trajetória Profissional:</div>
          {EXPERIENCES.map((e) => (
            <div key={e.id} className="border-l-2 border-emerald-500 pl-2 text-zinc-300">
              <span className="font-bold text-white">{e.role}</span> @ {e.company} ({e.period})
              <div className="text-zinc-400">{e.description}</div>
            </div>
          ))}
        </div>
      );

    case 'contact':
      return (
        <div className="text-xs font-mono space-y-1 text-zinc-300">
          <div><span className="text-cyan-300 font-bold">E-mail:</span> {PERSONAL_INFO.email}</div>
          <div><span className="text-cyan-300 font-bold">GitHub:</span> {PERSONAL_INFO.github}</div>
          <div><span className="text-cyan-300 font-bold">LinkedIn:</span> {PERSONAL_INFO.linkedin}</div>
          <div><span className="text-cyan-300 font-bold">WhatsApp:</span> {PERSONAL_INFO.phone}</div>
        </div>
      );

    case 'whoami':
      return <div className="text-xs font-mono text-emerald-400">guest@macbook-pro (Acesso Autorizado)</div>;

    case 'date':
      return <div className="text-xs font-mono text-cyan-300">{new Date().toString()}</div>;

    case 'ls':
      return (
        <div className="text-xs font-mono text-zinc-300 grid grid-cols-2 gap-2 max-w-xs">
          <span className="text-blue-400">drwxr-xr-x about/</span>
          <span className="text-blue-400">drwxr-xr-x projects/</span>
          <span className="text-blue-400">drwxr-xr-x skills/</span>
          <span className="text-zinc-300">-rw-r--r-- resume.txt</span>
        </div>
      );

    case 'cat resume.txt':
    case 'cat resume':
      return (
        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
{`CURRÍCULO - ${PERSONAL_INFO.name.toUpperCase()}
Role: ${PERSONAL_INFO.role}
Email: ${PERSONAL_INFO.email}
Location: ${PERSONAL_INFO.location}

${PERSONAL_INFO.bio}`}
        </pre>
      );

    default:
      return (
        <div className="text-xs font-mono text-rose-400">
          zsh: comando não encontrado: {rawCmd}. Digite <span className="font-bold text-white">&apos;help&apos;</span> para listar comandos.
        </div>
      );
  }
};

export const TerminalApp: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CMD_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao carregar histórico de comandos:', e);
    }
    return ['neofetch'];
  });

  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [draftInput, setDraftInput] = useState('');

  const [history, setHistory] = useState<TerminalHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_OUTPUT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((cmdStr: string, index: number) => ({
            id: `restored-${index}`,
            command: cmdStr,
            output: getCommandOutput(cmdStr),
            isNew: false
          }));
        }
      }
    } catch (e) {
      console.error('Erro ao carregar tela do terminal:', e);
    }
    return [
      {
        id: 'init-neofetch',
        command: 'neofetch',
        output: getCommandOutput('neofetch'),
        isNew: false
      }
    ];
  });

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    soundManager.playBeep();

    // Update command history for arrow navigation
    setCommandHistory((prev) => {
      const next = [...prev, rawCmd].slice(-100);
      try {
        localStorage.setItem(LOCAL_STORAGE_CMD_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    setHistoryIndex(-1);
    setDraftInput('');

    if (cmd === 'clear') {
      setHistory([]);
      try {
        localStorage.setItem(LOCAL_STORAGE_OUTPUT_KEY, JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
      return;
    }

    const outputNode = getCommandOutput(rawCmd);
    setHistory((prev) => {
      const newItem: TerminalHistoryItem = {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: rawCmd,
        output: outputNode,
        isNew: true
      };
      const next = [...prev, newItem];
      try {
        const commandsList = next.map((item) => item.command);
        localStorage.setItem(LOCAL_STORAGE_OUTPUT_KEY, JSON.stringify(commandsList));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      if (historyIndex === -1) {
        setDraftInput(inputVal);
        const nextIndex = commandHistory.length - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex === commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInputVal(draftInput);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full flex flex-col justify-between font-mono bg-slate-950 p-4 rounded-xl border border-white/10 text-white select-text cursor-text"
    >
      {/* Terminal Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400 mb-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span>livia@macbook-pro ~ % zsh</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
          Use ↑ / ↓ para navegar no histórico
        </span>
      </div>

      {/* Terminal Output History */}
      <div className="flex-1 overflow-y-auto space-y-4 max-h-96 pr-2">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <span><span className="hidden sm:inline">livia@macbook-pro </span>~ %</span>
              <span className="text-white break-all">{item.command}</span>
            </div>
            <div className="pl-2 sm:pl-4 overflow-x-auto">
              <TypewriterOutput
                animate={item.isNew}
                onTick={() => {
                  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.output}
              </TypewriterOutput>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-3 border-t border-white/10">
        <span className="text-xs font-bold text-emerald-400 shrink-0">
          <span className="hidden sm:inline">livia@macbook-pro </span>~ %
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (historyIndex !== -1) {
              setHistoryIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Digite um comando (ex: help, projects, skills)..."
          className="flex-1 min-w-0 bg-transparent text-xs text-white font-mono outline-none placeholder-zinc-600"
          autoFocus
        />
      </form>
    </div>
  );
};
