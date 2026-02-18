import { useNavigate } from 'react-router-dom';
import { CATEGORY_INFO, CategoryLetter } from '@/types/game';
import { ArrowLeft, Target, Users, RefreshCw, Drama, Star, Dice5, Trophy, Settings, Zap, Brain, Gamepad2, Shuffle, Package, PawPrint } from 'lucide-react';

const CATEGORY_ICONS: Record<CategoryLetter, React.ReactNode> = {
  A: <Zap size={18} />,
  D: <Brain size={18} />,
  L: <Gamepad2 size={18} />,
  M: <Shuffle size={18} />,
  O: <Package size={18} />,
  P: <PawPrint size={18} />,
};

const HowToPlay = () => {
  const navigate = useNavigate();
  const categories: CategoryLetter[] = ['A', 'D', 'L', 'M', 'O', 'P'];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-lg mx-auto animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-bold text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        <h1 className="text-3xl font-black text-game-title mb-6">Como Jogar</h1>

        <div className="space-y-6">
          <Section title="Objetivo" icon={<Target size={20} />}>
            Ser a primeira equipe a chegar ao final do tabuleiro! Avance fazendo mímicas e acertando as palavras.
          </Section>

          <Section title="Equipes" icon={<Users size={20} />}>
            O jogo precisa de no mínimo <strong>2 equipes</strong> (máximo 4). Cada equipe pode ter 1 ou mais jogadores.
            Os turnos são cruzados: primeiro jogador de cada equipe joga, depois o segundo, e assim por diante.
          </Section>

          <Section title="Como funciona uma rodada" icon={<RefreshCw size={20} />}>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li>O jogador da vez pega o celular <strong>sozinho</strong> para ver a carta</li>
              <li>A carta tem 6 palavras, uma por categoria</li>
              <li>O jogador pode <strong>trocar de carta</strong> quantas vezes quiser</li>
              <li>Role os <strong>dois dados</strong> clicando neles</li>
              <li>Um dado define <strong>quantas casas</strong> andar (1-6)</li>
              <li>O outro dado define a <strong>categoria</strong> da palavra</li>
              <li>O tempo de <strong>1 minuto</strong> começa após rolar os dois dados</li>
              <li>O jogador pode dizer em voz alta apenas a <strong>categoria</strong>, nunca a palavra!</li>
              <li>Faça a mímica! Seus companheiros devem adivinhar</li>
              <li>Se acertarem, pressione <strong>"ACERTOU"</strong> e a equipe avança</li>
              <li>Se o tempo acabar, ninguém avança</li>
            </ol>
          </Section>

          <Section title="Mímica" icon={<Drama size={20} />}>
            Este jogo é <strong>exclusivamente de mímica</strong>! Nada de falar, desenhar ou escrever.
            A mímica acontece presencialmente — o celular serve apenas para mostrar as cartas, dados e tabuleiro.
          </Section>

          <Section title="Casas Especiais - TODAS AS EQUIPES" icon={<Star size={20} />}>
            Algumas casas do tabuleiro são marcadas como especiais. Nessas casas, <strong>todas as equipes</strong> podem
            tentar adivinhar a mímica! A equipe que acertar primeiro é a que avança no tabuleiro.
          </Section>

          <Section title="Categorias das Cartas" icon={<Dice5 size={20} />}>
            <div className="space-y-2 mt-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
                  <span className="text-muted-foreground">{CATEGORY_ICONS[cat]}</span>
                  <span className="font-black text-primary w-6">{cat}</span>
                  <div>
                    <span className="font-bold">{CATEGORY_INFO[cat].name}</span>
                    <span className="text-sm text-muted-foreground ml-1">— {CATEGORY_INFO[cat].description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Vitória" icon={<Trophy size={20} />}>
            A equipe que chegar à <strong>última casa</strong> do tabuleiro vence imediatamente!
          </Section>

          <Section title="Tabuleiro" icon={<Settings size={20} />}>
            O tamanho padrão é <strong>30 casas</strong>, mas pode ser configurado para 40 ou 50 casas na tela de configuração.
          </Section>
        </div>
      </div>
    </div>
  );
};

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-md border border-border">
      <h2 className="text-xl font-black mb-2 flex items-center gap-2">{icon} {title}</h2>
      <div className="text-muted-foreground font-medium leading-relaxed">{children}</div>
    </div>
  );
}

export default HowToPlay;
