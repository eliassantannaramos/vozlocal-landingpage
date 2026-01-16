"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
// Ícones SVG inline (temporário até lucide-react ser instalado)
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CheckCircle2Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

import { BrowserFrame } from "@/components/BrowserFrame";
import { ProductShot } from "@/components/ProductShot";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToForm = () => {
    const formElement = document.getElementById("waitlist-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  // Função para extrair UTM parameters da URL
  const getUtmParams = () => {
    if (typeof window === 'undefined') return undefined;
    
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    
    if (params.get('utm_source')) utm.source = params.get('utm_source')!;
    if (params.get('utm_campaign')) utm.campaign = params.get('utm_campaign')!;
    if (params.get('utm_medium')) utm.medium = params.get('utm_medium')!;
    if (params.get('utm_term')) utm.term = params.get('utm_term')!;
    if (params.get('utm_content')) utm.content = params.get('utm_content')!;
    
    return Object.keys(utm).length > 0 ? utm : undefined;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      const utm = getUtmParams();
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          businessType: businessType || undefined,
          hp: '', // Honeypot field (sempre vazio para usuários legítimos)
          utm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Muitas tentativas. Por favor, aguarde alguns minutos.');
        } else if (response.status === 400) {
          setError('Por favor, verifique o email inserido.');
        } else {
          setError('Não foi possível registar agora. Tente novamente.');
        }
        setIsSubmitting(false);
        return;
      }

      // Sucesso
      setIsSuccess(true);
      setEmail("");
      setBusinessType("");
      setIsSubmitting(false);
      
      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Erro ao submeter formulário:', err);
      setError('Não foi possível registar agora. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StructuredData />
      <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink">
              <Image
                src="/images/vozlocal-icon.png"
                alt="VozLocal"
                width={576}
                height={433}
                className="h-5 sm:h-8 w-auto flex-shrink-0"
                style={{ objectFit: 'contain' }}
                priority
              />
              <span className="text-base sm:text-2xl font-bold text-purple-600 tracking-tight truncate">VozLocal</span>
            </div>
            <button
              onClick={scrollToForm}
              className="px-2.5 py-1.5 sm:px-6 sm:py-2 bg-purple-600 text-white rounded-md sm:rounded-lg hover:bg-purple-700 transition-colors font-medium text-[11px] sm:text-sm shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0 leading-tight"
            >
              Acesso antecipado
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - 2 colunas */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight">
                Pare de adivinhar. Saiba onde agir.
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed">
                Direcionamento claro baseado no que os clientes realmente dizem. Saiba onde agir primeiro e melhore a sua reputação com ações concretas.
              </p>
              
              {/* Waitlist Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden) */}
                <input
                  type="text"
                  name="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="O seu email"
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-zinc-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    disabled={isSubmitting}
                    className="px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Tipo de negócio (opcional)</option>
                    <option value="restaurante">Restaurante</option>
                    <option value="clinica">Clínica</option>
                    <option value="loja">Loja</option>
                    <option value="hotel">Hotel</option>
                    <option value="servico">Serviço</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? "A processar..." : "Acesso antecipado"}
                  </button>
                  {/* Mensagem de Early Access */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg w-fit">
                      <span className="text-purple-700 font-semibold text-sm">Acesso antecipado</span>
                    </div>
                    <p className="text-sm text-zinc-600">
                      Acesso antecipado e condições especiais para o seu negócio.
                    </p>
                  </div>
                </div>
                {isSuccess && (
                  <p className="text-green-600 font-medium">
                    Obrigado! Avisaremos quando o acesso estiver disponível.
                  </p>
                )}
                {error && (
                  <p className="text-red-600 font-medium">
                    {error}
                  </p>
                )}
              </form>
            </div>

            {/* Video with Browser Frame */}
            <div className="order-last lg:order-last">
              <BrowserFrame>
                <div className="relative w-full bg-zinc-50">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/landing/pagina_review.png"
                    className="w-full h-auto"
                    aria-label="Demonstração da plataforma VozLocal mostrando gestão de Google Reviews"
                  >
                    <source src="/landing/ReviewsDetailsDemo.mov" type="video/quicktime" />
                  </video>
                </div>
              </BrowserFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Secção O Problema */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center tracking-tight">
            O problema real
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-base sm:text-lg text-zinc-700 leading-relaxed">
            <p>
              Ter uma nota de 4.2 ou 4.8 no Google diz-lhe como está a sua reputação, mas não lhe diz o que fazer a seguir.
            </p>
            <p>
              As reclamações começam pequenas. Quando dá por isso, já são várias pessoas a dizer a mesma coisa — e a sua nota começa a cair.
            </p>
            <p>
              Um cliente queixa-se do tempo de espera, outro do ruído, outro da limpeza. Onde é que deve mexer primeiro? Sem organização, é fácil perder o que realmente importa.
            </p>
          </div>
        </div>
      </section>

      {/* Secção O Produto - Módulos Funcionais */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              Direcionamento claro, baseado no que os clientes realmente dizem
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Transforme feedback solto em direcionamento claro. Identifique o que mais afasta clientes e resolva antes que vire hábito.
            </p>
            <ul className="mt-8 space-y-4 max-w-2xl mx-auto text-left">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">•</span>
                </div>
                <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                  Corrija antes que vire hábito. Quando várias pessoas reclamam da mesma coisa, deixa de ser azar e passa a afetar a sua reputação.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">•</span>
                </div>
                <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                  Ataque o que mais afasta clientes agora, não o que faz mais barulho.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">•</span>
                </div>
                <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                  Resolva o que realmente impacta a reputação e a sua nota melhora naturalmente.
                </p>
              </li>
            </ul>
          </div>

          {/* Módulo 1: Recolher Google Reviews */}
          <div className="mb-16 sm:mb-24 lg:mb-32">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Todos os seus Google Reviews num só lugar
                </h3>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                  Evite perder tempo a ler review por review. Identifique o que mais incomoda os clientes e decida onde agir.
                </p>
              </div>
              <div>
                <ProductShot
                  src="/landing/pagina_review.png"
                  alt="Lista de Google Reviews"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Módulo 2: Análise de Sentimento */}
          <div className="mb-16 sm:mb-24 lg:mb-32">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="order-last lg:order-first">
                <ProductShot
                  src="/landing/AnaliseSentimentos.png"
                  alt="Análise de sentimento e temas"
                />
              </div>
              <div className="order-first lg:order-last">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Identifique o que está a piorar ou a melhorar
                </h3>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                  Quando os clientes reclamam dos mesmos pontos, já não é pontual. Descubra o que está a melhorar e o que precisa da sua atenção agora.
                </p>
              </div>
            </div>
          </div>

          {/* Módulo 3: Respostas com IA */}
          <div className="mb-16 sm:mb-24 lg:mb-32">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Responda com clareza, sem ter de pensar do zero
                </h3>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                  Respostas que têm em conta o que o cliente disse. Mantém o tom do seu negócio. Adapte e publique diretamente no Google.
                </p>
              </div>
              <div>
                <ProductShot
                  src="/landing/DetalhesReview.png"
                  alt="Responder Google Reviews com IA"
                />
              </div>
            </div>
          </div>

          {/* Módulo 4: Impacto e Métricas */}
          <div>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="order-last lg:order-first">
                <ProductShot
                  src="/landing/ReviewsQnt.png"
                  alt="KPIs e métricas de reputação"
                />
              </div>
              <div className="order-first lg:order-last">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Corrija antes que um problema ganhe impacto
                </h3>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                  Receba avisos quando os clientes começam a reclamar dos mesmos pontos. Resolva antes que se torne um problema maior — a sua reputação melhora quando resolve o que realmente incomoda os clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção de Credibilidade / Prova Visual */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              O que dizem os primeiros utilizadores
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600">
              Quem usa o VozLocal deixa de adivinhar e passa a saber onde agir para melhorar a reputação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-700 mb-4 leading-relaxed">
                "Finalmente algo que me diz exatamente onde melhorar, em vez de me mostrar mais dados. Poupa-me horas e ajuda-me a focar no que realmente importa."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">JM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">João Martins</p>
                  <p className="text-zinc-500 text-xs">Restaurante, Lisboa</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-700 mb-4 leading-relaxed">
                "Deixa de ser adivinhar. Agora sei exatamente onde estão os principais problemas e onde devo focar para melhorar a experiência dos clientes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">MS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Maria Silva</p>
                  <p className="text-zinc-500 text-xs">Clínica, Porto</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-700 mb-4 leading-relaxed">
                "Entendo os principais motivos de reclamação e decido onde agir primeiro. Melhorei a reputação porque resolvi o que realmente incomodava os clientes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">PC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Pedro Costa</p>
                  <p className="text-zinc-500 text-xs">Hotel, Algarve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção de Valor - Respostas com IA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                Direcionamento claro para melhorar a sua reputação
              </h2>
              <p className="text-lg sm:text-xl text-zinc-600 mb-4 sm:mb-6">
                Identifique o que mais afasta clientes e resolva antes que vire hábito. A reputação melhora quando resolve o que realmente importa.
              </p>
              {/* Mensagem neutra sobre planos */}
              <p className="text-base text-zinc-600">
                Pensado para o seu negócio. Planos simples e acessíveis para quem quer melhorar a reputação sem complicações técnicas.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <ZapIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Responda com clareza, sem ter de pensar do zero
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Respostas que têm em conta o que o cliente disse, mantendo o tom do seu negócio. Poupe tempo e mantenha uma comunicação profissional.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Respostas com contexto do que o cliente disse
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Veja o que o cliente destacou em cada Google Review para responder com precisão.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileTextIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Os seus Google Reviews organizados
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Todos os seus Google Reviews organizados num só lugar. Identifique o que precisa da sua atenção e decida onde melhorar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="waitlist-form" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                Pare de adivinhar. Saiba onde agir.
              </h2>
              <p className="text-lg sm:text-xl text-zinc-600 mb-2">
                Identifique o que mais afasta clientes e resolva antes que vire hábito. A reputação melhora quando resolve o que realmente importa.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="hp"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O seu email"
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-zinc-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  disabled={isSubmitting}
                  className="px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tipo de negócio (opcional)</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="clinica">Clínica</option>
                  <option value="loja">Loja</option>
                  <option value="hotel">Hotel</option>
                  <option value="servico">Serviço</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? "A processar..." : "Pedir acesso antecipado"}
                </button>
                {/* Mensagem de Early Adopters */}
                <div className="space-y-2 text-center">
                  <p className="text-sm text-zinc-600">
                    Condições especiais para early adopters no lançamento.
                  </p>
                </div>
              </div>
              {isSuccess && (
                <p className="text-green-600 font-medium text-center">
                  Obrigado! Avisaremos quando o acesso estiver disponível.
                </p>
              )}
              {error && (
                <p className="text-red-600 font-medium text-center">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-200">
        <div className="container mx-auto max-w-7xl text-center text-zinc-600 text-sm">
          <p>© {new Date().getFullYear()} VozLocal. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
    </>
  );
}
