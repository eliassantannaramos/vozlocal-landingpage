export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VozLocal",
    "description": "Plataforma de gestão de reviews e reputação online para pequenos e médios negócios em Portugal e Espanha",
    "url": "https://vozlocal.io",
    "logo": "https://vozlocal.io/images/vozlocal-icon.png",
    "sameAs": [
      // Adicione aqui links para redes sociais quando disponíveis
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": ["PT", "ES"],
      "availableLanguage": ["Portuguese", "Spanish"]
    },
    "areaServed": {
      "@type": "Country",
      "name": ["Portugal", "Spain"]
    }
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VozLocal",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/PreOrder"
    },
    "description": "Plataforma SaaS para gestão centralizada de reviews do Google e Facebook, com alertas automáticos e respostas assistidas por IA",
    "featureList": [
      "Centralização de reviews do Google e Facebook",
      "Alertas automáticos de novos reviews",
      "Respostas assistidas por IA",
      "Análise de sentimento automática",
      "KPIs e métricas de reputação",
      "Suporte para Portugal e Espanha"
    ],
    "screenshot": "https://vozlocal.io/landing/pagina_review.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "3"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VozLocal",
    "url": "https://vozlocal.io",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vozlocal.io/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

