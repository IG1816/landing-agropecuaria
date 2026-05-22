import { useEffect, useRef, useState } from 'react';
import {
  Sprout, Wheat, Beef, Pill, Wrench, Tractor, Bird, Fish,
  PawPrint, Leaf, ShieldCheck, Truck, Clock, MapPin, Phone,
  ArrowRight, Menu, X, Star, CheckCircle2, MessageCircle,
  Sparkles, ChevronDown,
} from 'lucide-react';
import NavAuthLink from './components/NavAuthLink';
import FavoriteButton from './components/FavoriteButton';

/* ─────────────────────────────────────────────
   CONFIGURAÇÃO — ajuste aqui depois de vender
   ───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '5500000000000'; // formato internacional sem +
const WHATSAPP_MESSAGE = 'Olá! Vim pelo site e gostaria de saber mais sobre os produtos da agropecuária.';
const BUSINESS_NAME = 'Agropecuária';
const BUSINESS_TAGLINE = 'do Campo';
const CITY_REGION = 'Sua região';

const waLink = (msg: string = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ─── Reveal animation hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children, delay = 0, className = '', from = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: 'up' | 'left' | 'right' | 'scale';
}) {
  const { ref, visible } = useReveal();
  const hidden = {
    up: 'opacity-0 translate-y-8',
    left: 'opacity-0 -translate-x-8',
    right: 'opacity-0 translate-x-8',
    scale: 'opacity-0 scale-95',
  }[from];
  const shown = 'opacity-100 translate-y-0 translate-x-0 scale-100';
  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-out ${visible ? shown : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Floating WhatsApp button ─── */
function FloatingWhats() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-emerald-500/40 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
      <MessageCircle className="w-5 h-5 relative z-10" />
      <span className="relative z-10 text-sm hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items: [string, string][] = [
    ['produtos', 'Produtos'],
    ['categorias', 'Categorias'],
    ['sobre', 'Sobre'],
    ['contato', 'Contato'],
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0a0f0a]/95 backdrop-blur-lg shadow-lg shadow-black/40 border-b border-emerald-900/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <div className="text-white font-black text-base tracking-tight">{BUSINESS_NAME}</div>
            <div className="text-emerald-400/80 text-[10px] uppercase tracking-widest font-semibold">{BUSINESS_TAGLINE}</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {items.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-slate-300 hover:text-emerald-400 text-sm font-medium transition-colors relative group">
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <NavAuthLink />
          </div>
          <a href={waLink()} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0a0f0a]/98 border-t border-emerald-900/40 px-5 py-4 space-y-3">
          {items.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left text-slate-200 hover:text-emerald-400 text-sm py-1.5 transition-colors">
              {label}
            </button>
          ))}
          <NavAuthLink mobile onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const base = 'transition-all ease-out duration-700';
  const show = 'opacity-100 translate-y-0';
  const hide = 'opacity-0 translate-y-8';

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center pt-20 pb-12">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0a0f0a] to-[#1a2a10]" />
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(#5b8c3e 1px,transparent 1px),linear-gradient(90deg,#5b8c3e 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Floating leaves */}
      <Leaf className="absolute top-32 right-1/4 w-8 h-8 text-emerald-500/20 animate-float" />
      <Leaf className="absolute bottom-40 left-20 w-6 h-6 text-lime-400/20 animate-float" style={{ animationDelay: '2s' }} />
      <Sprout className="absolute top-1/2 left-10 w-7 h-7 text-emerald-400/15 animate-float" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto px-5 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className={`${base} ${mounted ? show : hide} inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-wide uppercase backdrop-blur-sm`}>
              <Sparkles className="w-3.5 h-3.5" /> Tudo para o campo em um só lugar
            </div>

            <h1 className={`${base} ${mounted ? show : hide} text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tight mb-6`}
              style={{ transitionDelay: '100ms' }}>
              Do plantio<br />à colheita.<br />
              <span className="shine-text">Do nascimento</span><br />
              <span className="shine-text">ao rebanho.</span>
            </h1>

            <p className={`${base} ${mounted ? show : hide} text-slate-300 text-lg leading-relaxed mb-8 max-w-lg`}
              style={{ transitionDelay: '200ms' }}>
              Rações, sementes, defensivos, medicamentos veterinários, ferramentas e tudo o que sua propriedade precisa.
              <span className="text-emerald-400 font-semibold"> Atendimento direto e personalizado pelo WhatsApp.</span>
            </p>

            <div className={`${base} ${mounted ? show : hide} flex gap-3 flex-wrap`}
              style={{ transitionDelay: '300ms' }}>
              <a href={waLink()} target="_blank" rel="noopener noreferrer"
                className="group bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-4 rounded-xl text-base transition-all flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-emerald-800 hover:border-emerald-500 text-slate-200 hover:text-white font-semibold px-7 py-4 rounded-xl text-base transition-all hover:bg-emerald-900/20">
                Ver categorias
              </button>
            </div>

            <div className={`${base} ${mounted ? show : hide} flex gap-8 mt-10 pt-8 border-t border-emerald-900/50`}
              style={{ transitionDelay: '420ms' }}>
              {[
                ['+500', 'Produtos disponíveis'],
                ['100%', 'Atendimento personalizado'],
                ['24h', 'Resposta no WhatsApp'],
              ].map(([val, label]) => (
                <div key={val}>
                  <div className="text-3xl font-black text-emerald-400">{val}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight max-w-[120px]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated product showcase card */}
          <div className={`hidden lg:block transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDelay: '250ms' }}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 via-lime-400/10 to-transparent rounded-3xl blur-2xl" />

              <div className="relative bg-gradient-to-br from-[#0e1a0e]/90 to-[#101810]/90 backdrop-blur-md border border-emerald-900/60 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Em destaque</div>
                    <div className="text-white font-bold text-lg mt-1">Categorias mais procuradas</div>
                  </div>
                  <div className="w-11 h-11 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Wheat, name: 'Ração & Nutrição', tag: 'Aves, gado, suínos', color: 'from-amber-500 to-orange-600' },
                    { icon: Sprout, name: 'Sementes', tag: 'Lavoura e pastagem', color: 'from-emerald-500 to-green-700' },
                    { icon: Pill, name: 'Veterinária', tag: 'Medicamentos e vacinas', color: 'from-rose-500 to-red-600' },
                    { icon: Wrench, name: 'Ferramentas', tag: 'Manual e elétrica', color: 'from-slate-400 to-slate-600' },
                  ].map((item, i) => (
                    <div key={item.name}
                      className="group bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-900/50 rounded-2xl p-3.5 transition-all hover:-translate-y-0.5 cursor-pointer"
                      style={{ animation: `fade-up 0.6s ease-out ${i * 100 + 600}ms backwards` }}>
                      <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-2.5 shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-white text-sm font-bold leading-tight">{item.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{item.tag}</div>
                    </div>
                  ))}
                </div>

                <a href={waLink('Olá! Vi as categorias no site e gostaria de mais informações.')}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-3 rounded-xl text-sm transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Consultar disponibilidade
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-emerald-500/50">
          <span className="text-xs uppercase tracking-widest">Role para ver mais</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ─── BENEFITS BAR ─── */
function Benefits() {
  const items = [
    { icon: Truck, title: 'Entrega na sua propriedade', desc: 'Logística para zona rural' },
    { icon: ShieldCheck, title: 'Produtos certificados', desc: 'Marcas reconhecidas no mercado' },
    { icon: MessageCircle, title: 'Atendimento direto', desc: 'Sem call center, fale com o dono' },
    { icon: Clock, title: 'Resposta rápida', desc: 'Dúvidas respondidas no WhatsApp' },
  ];
  return (
    <section className="py-14 bg-gradient-to-b from-[#0a0f0a] to-[#0d150d] border-y border-emerald-900/40">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80} from="up">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-emerald-950/30 transition-colors">
                <div className="w-11 h-11 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <it.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{it.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{it.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CATEGORIES ─── */
const categories = [
  {
    icon: Wheat, color: 'from-amber-500 to-orange-600',
    title: 'Ração e Nutrição Animal',
    desc: 'Linha completa de rações e suplementos para todas as fases.',
    items: ['Bovinos de corte e leite', 'Aves de postura e corte', 'Suínos', 'Cavalos e equinos', 'Cães e gatos', 'Sal mineral e suplementos'],
  },
  {
    icon: Sprout, color: 'from-emerald-500 to-green-700',
    title: 'Sementes e Mudas',
    desc: 'Sementes selecionadas para lavoura, pastagem, horta e jardim.',
    items: ['Milho e soja', 'Sementes de pastagem', 'Hortaliças e verduras', 'Frutíferas e mudas', 'Adubos e fertilizantes', 'Corretivos de solo'],
  },
  {
    icon: Pill, color: 'from-rose-500 to-red-600',
    title: 'Medicamentos Veterinários',
    desc: 'Vacinas, vermífugos, antibióticos e produtos para todos os rebanhos.',
    items: ['Vacinas obrigatórias', 'Vermífugos e carrapaticidas', 'Antibióticos e anti-inflamatórios', 'Suplementos vitamínicos', 'Cuidados com bezerros', 'Higiene e desinfecção'],
  },
  {
    icon: Leaf, color: 'from-lime-500 to-emerald-600',
    title: 'Defensivos Agrícolas',
    desc: 'Herbicidas, fungicidas e inseticidas das principais marcas.',
    items: ['Herbicidas seletivos', 'Fungicidas', 'Inseticidas e formicidas', 'Adjuvantes', 'Reguladores de crescimento', 'Receituário agronômico'],
  },
  {
    icon: Wrench, color: 'from-slate-400 to-slate-600',
    title: 'Ferramentas e Equipamentos',
    desc: 'Tudo para o dia a dia da propriedade rural.',
    items: ['Ferramentas manuais', 'Bombas e mangueiras', 'Roçadeiras e motosserras', 'EPIs e botinas', 'Cercas e arames', 'Pulverizadores'],
  },
  {
    icon: Bird, color: 'from-yellow-500 to-amber-600',
    title: 'Avicultura',
    desc: 'Produtos para criação de aves de pequeno e grande porte.',
    items: ['Pintos e galinhas', 'Comedouros e bebedouros', 'Ninhos e gaiolas', 'Aquecedores e lâmpadas', 'Vacinas e medicamentos', 'Ração específica'],
  },
  {
    icon: Beef, color: 'from-red-600 to-rose-700',
    title: 'Bovinocultura',
    desc: 'Produtos especializados para criação de gado de corte e leite.',
    items: ['Sal mineral', 'Cordas e cabrestos', 'Vacinas de rebanho', 'Tratamento de casco', 'Brincos e identificação', 'Suplementação proteica'],
  },
  {
    icon: Fish, color: 'from-cyan-500 to-blue-600',
    title: 'Piscicultura',
    desc: 'Produtos para criação de peixes em tanques e açudes.',
    items: ['Ração para peixes', 'Alevinos', 'Aeradores', 'Redes e tarrafas', 'Testes de água', 'Suplementos para tanque'],
  },
  {
    icon: PawPrint, color: 'from-violet-500 to-purple-600',
    title: 'Pet e Companhia',
    desc: 'Linha completa para cães, gatos e pets de pequeno porte.',
    items: ['Rações premium', 'Brinquedos e acessórios', 'Coleiras e guias', 'Antipulgas e vermífugos', 'Areia sanitária', 'Petiscos naturais'],
  },
];

function Categories() {
  return (
    <section id="categorias" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d150d] via-[#0a0f0a] to-[#0d150d]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-5 relative">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Sprout className="w-3.5 h-3.5" /> Nossas Categorias
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
              Tudo o que o campo precisa,<br />
              <span className="text-emerald-400">na palma da sua mão.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Uma curadoria completa de produtos para o produtor rural, criador, fazendeiro e morador da zona rural.
              Confira nossas categorias e fale conosco para saber preços e disponibilidade.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={(i % 3) * 80} from="scale">
              <div className="group relative h-full bg-gradient-to-br from-[#0e1a0e] to-[#0a0f0a] border border-emerald-900/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
                {/* Hover glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton productName={cat.title} category={cat.title.split(' ')[0]} />
                </div>

                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-black text-lg mb-2 tracking-tight">{cat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{cat.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {cat.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href={waLink(`Olá! Tenho interesse em produtos da categoria "${cat.title}". Pode me passar mais informações?`)}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors">
                    Consultar no WhatsApp
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRODUCT SHOWCASE ─── */
function ProductShowcase() {
  const products = [
    { icon: Wheat, label: 'Ração',         tone: 'from-amber-400 to-orange-500' },
    { icon: Sprout, label: 'Sementes',      tone: 'from-emerald-400 to-green-600' },
    { icon: Pill, label: 'Vacinas',         tone: 'from-rose-400 to-red-500' },
    { icon: Wrench, label: 'Ferramentas',   tone: 'from-slate-300 to-slate-500' },
    { icon: Leaf, label: 'Defensivos',      tone: 'from-lime-400 to-emerald-500' },
    { icon: Bird, label: 'Avicultura',      tone: 'from-yellow-400 to-amber-500' },
    { icon: Beef, label: 'Gado',            tone: 'from-red-500 to-rose-600' },
    { icon: Fish, label: 'Piscicultura',    tone: 'from-cyan-400 to-blue-500' },
    { icon: PawPrint, label: 'Pet',         tone: 'from-violet-400 to-purple-500' },
    { icon: Tractor, label: 'Equipamentos', tone: 'from-orange-400 to-amber-600' },
  ];

  return (
    <section id="produtos" className="py-24 bg-gradient-to-b from-[#0d150d] to-[#0a0f0a]">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">Variedade</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Variedade que <span className="text-emerald-400">não para</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Trabalhamos com as principais marcas do mercado para garantir qualidade do começo ao fim.
            </p>
          </div>
        </Reveal>

        <Reveal from="scale">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {products.map((p, i) => (
              <div key={p.label}
                className="group relative bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-5 hover:border-emerald-500/50 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                style={{ animation: `fade-up 0.6s ease-out ${i * 60}ms backwards` }}>
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton productName={p.label} category="Destaque" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${p.tone} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className={`relative w-12 h-12 mx-auto bg-gradient-to-br ${p.tone} rounded-2xl flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <div className="relative text-white text-sm font-bold text-center">{p.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <a href={waLink('Olá! Gostaria de ver a lista completa de produtos disponíveis.')}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-0.5">
              <MessageCircle className="w-5 h-5" />
              Ver lista completa no WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section id="sobre" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a] via-[#0d150d] to-[#0a0f0a]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal from="left">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 to-lime-400/10 blur-3xl rounded-3xl" />
              <div className="relative bg-gradient-to-br from-[#0e1a0e] to-[#0a0f0a] border border-emerald-900/60 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Sprout, label: 'Produtores atendidos', value: '+1.000', color: 'text-emerald-400' },
                    { icon: Star, label: 'Avaliações positivas', value: '4.9/5', color: 'text-amber-400' },
                    { icon: Truck, label: 'Pedidos entregues', value: '+5.000', color: 'text-sky-400' },
                    { icon: ShieldCheck, label: 'Marcas parceiras', value: '+30', color: 'text-rose-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-5">
                      <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                      <div className="text-3xl font-black text-white">{s.value}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-emerald-900/50 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-9 h-9 rounded-full border-2 border-[#0e1a0e] bg-gradient-to-br ${
                        i === 1 ? 'from-amber-400 to-orange-600' :
                        i === 2 ? 'from-emerald-400 to-green-700' :
                        'from-rose-400 to-red-600'
                      } flex items-center justify-center text-white text-xs font-bold`}>
                        {['JS','MC','RA'][i-1]}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 leading-tight">
                    <span className="text-white font-semibold">Produtores reais</span><br />
                    confiam no nosso atendimento
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            <div>
              <div className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">Sobre Nós</div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
                Mais do que uma loja.<br />
                <span className="text-emerald-400">Um parceiro do produtor.</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-5">
                Entendemos as necessidades de quem vive do campo. Por isso, oferecemos atendimento próximo,
                produtos de qualidade e a melhor relação para que sua propriedade prospere.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-7">
                Trabalhamos com produtores rurais, pequenos criadores, fazendeiros e quem cuida do dia a dia
                no sítio ou na chácara. O atendimento é direto: sem intermediários, sem call center, sem complicação.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Indicação técnica para cada cultura, rebanho ou criação',
                  'Receituário agronômico quando necessário',
                  'Entrega facilitada em propriedades rurais',
                  'Negociação direta e personalizada',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <a href={waLink()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" /> Falar com o dono
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    name: 'João Silva',
    role: 'Produtor de leite',
    text: 'Atendimento excelente. Sempre que preciso de ração ou medicamento, é só chamar no WhatsApp e em pouco tempo está aqui na propriedade.',
    initials: 'JS',
    color: 'from-amber-400 to-orange-600',
  },
  {
    name: 'Maria Cardoso',
    role: 'Criadora de aves',
    text: 'Encontro tudo o que preciso para minhas galinhas: ração, vacinas, bebedouros. E o preço é justo. Recomendo de olhos fechados.',
    initials: 'MC',
    color: 'from-emerald-400 to-green-700',
  },
  {
    name: 'Roberto Almeida',
    role: 'Pecuarista',
    text: 'Trabalho com gado há 20 anos e nunca tive uma agropecuária tão atenciosa. Eles entendem o que o produtor precisa.',
    initials: 'RA',
    color: 'from-rose-400 to-red-600',
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0f0a] to-[#0d150d]">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">Depoimentos</div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Quem usa, <span className="text-emerald-400">recomenda</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} from="up">
              <div className="bg-gradient-to-br from-[#0e1a0e] to-[#0a0f0a] border border-emerald-900/50 rounded-2xl p-7 h-full hover:border-emerald-500/40 transition-colors relative">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-emerald-900/50">
                  <div className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA / CONTACT ─── */
function FinalCTA() {
  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-[#0a1a0a] to-green-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
      <Leaf className="absolute top-20 left-10 w-12 h-12 text-emerald-500/10 animate-float" />
      <Sprout className="absolute bottom-20 right-10 w-14 h-14 text-emerald-500/10 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-5 relative">
        <Reveal from="scale">
          <div className="relative bg-gradient-to-br from-[#0e1a0e]/80 to-[#0a0f0a]/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-10 lg:p-14 shadow-2xl shadow-emerald-500/20 text-center">
            <div className="inline-flex w-16 h-16 bg-emerald-500/20 rounded-2xl items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-[1.1]">
              Pronto para abastecer<br />
              <span className="text-emerald-400">sua propriedade?</span>
            </h2>
            <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Chame no WhatsApp agora e fale direto com o dono. Tire suas dúvidas, peça orçamento,
              combine a entrega — tudo de forma rápida e sem burocracia.
            </p>

            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-5 rounded-2xl text-lg transition-all shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:-translate-y-1">
              <MessageCircle className="w-6 h-6" />
              Chamar no WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="mt-10 pt-8 border-t border-emerald-900/50 grid sm:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">WhatsApp</div>
                  <div className="text-white text-sm font-bold">Resposta rápida</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Horário</div>
                  <div className="text-white text-sm font-bold">Seg a Sáb · 7h às 18h</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-0.5">Atendemos</div>
                  <div className="text-white text-sm font-bold">{CITY_REGION}</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="bg-[#070b07] border-t border-emerald-900/40 py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-700 rounded-lg flex items-center justify-center">
            <Sprout className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">{BUSINESS_NAME} {BUSINESS_TAGLINE}</div>
            <div className="text-slate-500 text-[11px]">Sempre por perto do produtor.</div>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center">
          &copy; {new Date().getFullYear()} {BUSINESS_NAME}. Todos os direitos reservados.
        </p>

        <a href={waLink()} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-xs transition-colors">
          <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
        </a>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Landing() {
  return (
    <div className="bg-[#0a0f0a] grain min-h-screen text-white">
      <Nav />
      <Hero />
      <Benefits />
      <Categories />
      <ProductShowcase />
      <About />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <FloatingWhats />
    </div>
  );
}
