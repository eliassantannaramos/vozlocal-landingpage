import { NextRequest, NextResponse } from 'next/server';

// Rate limiting simples em memória (best-effort para serverless)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos

function getRateLimitKey(request: NextRequest): string {
  // Tenta obter IP do cliente
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    // Criar nova entrada ou resetar
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, businessType, hp, utm } = body;

    // Honeypot anti-bot: se hp vier preenchido, retornar sucesso sem processar
    if (hp && hp.trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    // Validar email
    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Ler variáveis de ambiente
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_LIST_ID;

    if (!brevoApiKey || !brevoListId) {
      console.error('[Waitlist API] BREVO_API_KEY ou BREVO_LIST_ID não configuradas');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Preparar atributos para Brevo
    const attributes: Record<string, string> = {
      SOURCE: 'landing',
    };

    if (businessType && businessType.trim() !== '') {
      attributes.BUSINESS_TYPE = businessType.trim();
    }

    if (utm) {
      if (utm.source) attributes.UTM_SOURCE = utm.source;
      if (utm.campaign) attributes.UTM_CAMPAIGN = utm.campaign;
      if (utm.medium) attributes.UTM_MEDIUM = utm.medium;
      if (utm.term) attributes.UTM_TERM = utm.term;
      if (utm.content) attributes.UTM_CONTENT = utm.content;
    }

    // Chamar Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        attributes,
        listIds: [Number(brevoListId)],
        updateEnabled: true,
      }),
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error('[Waitlist API] Erro ao chamar Brevo:', {
        status: brevoResponse.status,
        statusText: brevoResponse.statusText,
        error: errorText,
      });
      return NextResponse.json(
        { error: 'Brevo error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Waitlist API] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

