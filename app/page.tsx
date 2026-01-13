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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/vozlocal-icon.png"
                alt="VozLocal"
                width={576}
                height={433}
                className="h-8 w-auto"
                style={{ objectFit: 'contain' }}
                priority
              />
              <span className="text-2xl font-bold text-purple-600 tracking-tight">VozLocal</span>
            </div>
            <button
              onClick={scrollToForm}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
            >
              Entrar na lista de espera
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - 2 colunas */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 max-w-xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight">
                Melhore a sua avaliação no Google com IA
              </h1>
              <p className="text-xl text-zinc-600 leading-relaxed">
                Respostas inteligentes e análise automática dos seus Google Reviews para ajudar o seu negócio a subir a classificação no Google. 
                Sem complicações técnicas, pensado para negócios locais em Portugal e Espanha.
              </p>
              
              {/* Diferenciação Local PT/ES */}
              <div className="flex items-center gap-3 text-sm text-zinc-600 bg-purple-50 rounded-lg px-4 py-2.5 w-fit border border-purple-100">
                <ShieldIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-medium">Plataforma 100% adaptada ao mercado de Portugal e Espanha</span>
              </div>
              
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
                    {isSubmitting ? "A processar..." : "Entrar na lista de espera"}
                  </button>
                  {/* Mensagem de Early Access */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg w-fit">
                      <span className="text-purple-700 font-semibold text-sm">Acesso antecipado</span>
                    </div>
                    <p className="text-sm text-zinc-600">
                      Os primeiros inscritos terão vantagens exclusivas no lançamento.
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
            <div className="order-first lg:order-last">
              <BrowserFrame>
                <div className="relative w-full bg-zinc-50">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/landing/pagina_review.png"
                    className="w-full h-auto"
                    aria-label="Demonstração da plataforma VozLocal mostrando gestão de reviews"
                  >
                    <source src="/landing/ReviewsDetailsDemo.mov" type="video/quicktime" />
                  </video>
                </div>
              </BrowserFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Secção de Framing - Contexto do Problema */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed">
            Recolha os seus Google Reviews, compreenda o que os clientes pensam e aja com respostas inteligentes que melhoram a sua reputação.
          </p>
        </div>
      </section>

      {/* Secção O Produto - Módulos Funcionais */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              O Produto
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Recolha os seus Google Reviews, compreenda o que os clientes pensam e aja com respostas inteligentes que melhoram a sua reputação.
            </p>
          </div>

          {/* Módulo 1: Recolher Google Reviews */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Todos os seus Google Reviews num só lugar
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  Veja todos os seus Google Reviews organizados num único painel. 
                  Filtre por data, avaliação ou localização e encontre rapidamente o que procura, sem ter de navegar entre várias aplicações.
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
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <ProductShot
                  src="/landing/AnaliseSentimentos.png"
                  alt="Análise de sentimento e temas"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Compreenda o que os clientes pensam ao longo do tempo
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  A nossa IA analisa automaticamente o sentimento e identifica temas recorrentes nos seus Google Reviews. 
                  Veja a evolução de temas como "comida", "serviço" ou "ambiente" ao longo do tempo e saiba <strong className="text-gray-900">exatamente onde investir para subir o seu rating no Google</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Módulo 3: Respostas com IA */}
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Respostas com IA em segundos
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  Responda aos seus Google Reviews em segundos com respostas personalizadas geradas por IA. 
                  A nossa IA usa o contexto e o sentimento de cada review para criar respostas que respeitam o tom de voz do seu negócio e ajudam a melhorar a sua avaliação no Google.
                </p>
              </div>
              <div>
                <ProductShot
                  src="/landing/DetalhesReview.png"
                  alt="Responder reviews com IA"
                />
              </div>
            </div>
          </div>

          {/* Módulo 4: Impacto e Métricas */}
          <div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <ProductShot
                  src="/landing/ReviewsQnt.png"
                  alt="KPIs e métricas de reputação"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Melhore a sua avaliação no Google
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  Acompanhe métricas essenciais como classificação média, taxa de resposta e tempo médio de resposta nos seus Google Reviews. 
                  Detete precocemente padrões negativos e tome decisões informadas que melhoram a experiência dos clientes e aumentam a sua classificação no Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção de Credibilidade / Prova Visual */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              O que dizem os primeiros utilizadores
            </h2>
            <p className="text-xl text-zinc-600">
              Negócios que já estão a usar o VozLocal estão a ver melhorias na gestão da sua reputação
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
                "Finalmente consigo ver todos os meus reviews num só lugar. A resposta com IA poupa-me horas todos os dias."
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
                "Os alertas automáticos são incríveis. Agora não perco nenhum review negativo e consigo responder rapidamente."
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
                "A análise de sentimentos ajuda-me a perceber o que os clientes realmente pensam. Muito útil para melhorar o serviço."
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Tudo o que precisa para melhorar a sua avaliação no Google
              </h2>
              <p className="text-xl text-zinc-600 mb-6">
                Respostas inteligentes e análise automática para ajudar negócios locais em Portugal e Espanha a subir a classificação no Google.
              </p>
              {/* Mensagem neutra sobre planos */}
              <p className="text-base text-zinc-600">
                Planos simples e acessíveis para negócios locais. Preço final no lançamento.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <ZapIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Respostas com IA em segundos
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Responda aos seus Google Reviews rapidamente com respostas personalizadas geradas por IA. 
                  Pronto em segundos, não em horas.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Compreenda o que os clientes pensam
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Veja a evolução do sentimento e temas recorrentes nos seus Google Reviews ao longo do tempo. 
                  Saiba exatamente onde investir para melhorar.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileTextIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Métricas e decisões estratégicas
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Acompanhe classificação média, taxa de resposta e outras métricas essenciais. 
                  Detete padrões e tome decisões que melhoram a sua avaliação no Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="waitlist-form" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Estamos a abrir acesso antecipado
              </h2>
              <p className="text-xl text-zinc-600 mb-2">
                Para negócios locais em Portugal e Espanha
              </p>
              {/* Diferenciação Local */}
              <p className="text-sm text-zinc-500 flex items-center justify-center gap-2 mt-4">
                <ShieldIcon className="w-4 h-4 text-purple-600" />
                <span>Suporte prioritário na sua língua</span>
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
                  {isSubmitting ? "A processar..." : "Entrar na lista de espera"}
                </button>
                {/* Mensagem de Early Adopters */}
                <div className="space-y-2 text-center">
                  <p className="text-sm text-zinc-600">
                    Vantagens exclusivas para early adopters no lançamento.
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
          <p>© 2024 VozLocal. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
    </>
  );
}
