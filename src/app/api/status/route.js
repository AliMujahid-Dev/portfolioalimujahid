import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';

export async function GET() {
  const data = await readData().catch(() => ({}));
  const aiKey = (data?.settings?.aiApiKey || process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '').trim();
  const isValid = !!aiKey && !aiKey.startsWith('AQ.') && (aiKey.startsWith('AIzaSy') || aiKey.startsWith('sk-') || aiKey.length > 25);

  return NextResponse.json({
    gnews: true,
    gemini: isValid,
    deepseek: isValid,
    needsKey: !isValid,
    provider: "Google Gemini"
  });
}
