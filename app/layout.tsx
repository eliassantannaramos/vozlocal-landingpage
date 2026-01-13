import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vozlocal.io'),
  title: {
    default: "VozLocal - Gestão de Reviews e Reputação Online para PMEs",
    template: "%s | VozLocal"
  },
  description: "Plataforma de gestão de reviews para restaurantes, clínicas e pequenos negócios em Portugal e Espanha. Centralize reviews do Google e Facebook, receba alertas automáticos e responda com IA em segundos.",
  keywords: [
    "gestão de reviews",
    "reputação online",
    "reviews Google",
    "reviews Facebook",
    "gestão de reputação",
    "respostas automáticas reviews",
    "IA para reviews",
    "monitorização reviews",
    "alertas reviews",
    "software reviews",
    "Portugal",
    "Espanha",
    "PME",
    "pequenos negócios",
    "restaurantes",
    "clínicas",
    "hotéis"
  ],
  authors: [{ name: "VozLocal" }],
  creator: "VozLocal",
  publisher: "VozLocal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/vozlocal-icon.png", type: "image/png", sizes: "576x433" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/images/vozlocal-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://vozlocal.io",
    siteName: "VozLocal",
    title: "VozLocal - Gestão de Reviews e Reputação Online para PMEs",
    description: "Centralize reviews do Google e Facebook, receba alertas automáticos e responda com IA. Plataforma adaptada para negócios locais em Portugal e Espanha.",
    images: [
      {
        url: "/images/vozlocal-icon.png",
        width: 576,
        height: 433,
        alt: "VozLocal - Gestão de Reviews e Reputação",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VozLocal - Gestão de Reviews e Reputação Online",
    description: "Centralize reviews do Google e Facebook, receba alertas automáticos e responda com IA. Para PMEs em Portugal e Espanha.",
    images: ["/images/vozlocal-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Adicione aqui quando tiver Google Search Console e Bing Webmaster
    // google: "seu-codigo-google",
    // yandex: "seu-codigo-yandex",
  },
  alternates: {
    canonical: "https://vozlocal.io",
    languages: {
      "pt-PT": "https://vozlocal.io",
      "es-ES": "https://vozlocal.io/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

