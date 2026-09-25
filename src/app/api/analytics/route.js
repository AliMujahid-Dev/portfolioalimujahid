import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const ANALYTICS_PATH = path.join(process.cwd(), 'readers24-data/analytics.json');

const DEFAULT_ANALYTICS = {
  totalVisits: 0,
  todayVisits: 0,
  activeSessions: {}, // { sessionId: timestamp }
  articleViews: {},
  dailyStats: [
    { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), views: 0 }
  ]
};

async function readAnalytics() {
  // Try Supabase first
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('analytics')
        .select('data')
        .eq('id', 'main')
        .single();
      if (data && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    // fallback to local file
  }

  try {
    const dir = path.dirname(ANALYTICS_PATH);
    try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
    
    try {
      await fs.access(ANALYTICS_PATH);
      const content = await fs.readFile(ANALYTICS_PATH, 'utf8');
      return JSON.parse(content);
    } catch {
      await fs.writeFile(ANALYTICS_PATH, JSON.stringify(DEFAULT_ANALYTICS, null, 2));
      return DEFAULT_ANALYTICS;
    }
  } catch (err) {
    console.error("Analytics read error:", err);
    return DEFAULT_ANALYTICS;
  }
}

async function writeAnalytics(data) {
  // 1. Local write
  try {
    await fs.writeFile(ANALYTICS_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    // Ignore in read-only serverless environments
  }

  // 2. Supabase sync
  try {
    if (supabase) {
      await supabase
        .from('analytics')
        .upsert({ id: 'main', data: data, updated_at: new Date().toISOString() });
    }
  } catch (err) {
    // Supabase optional sync
  }
}

export async function GET() {
  const data = await readAnalytics();
  const now = Date.now();
  
  // Clean up active sessions (older than 5 minutes)
  const activeSessions = data.activeSessions || {};
  const activeCount = Object.keys(activeSessions).filter(id => {
    if (now - activeSessions[id] < 300000) return true;
    delete activeSessions[id];
    return false;
  }).length;
  
  data.activeSessions = activeSessions;
  await writeAnalytics(data);

  return NextResponse.json({
    ...data,
    activeUsers: activeCount || 1, // Fallback to 1
    totalVisits: data.totalVisits || 0,
    todayVisits: data.todayVisits || 0
  });
}

export async function POST(request) {
  try {
    const { type, pageId, sessionId } = await request.json();
    const data = await readAnalytics();
    const now = Date.now();
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (type === 'pageview') {
      data.totalVisits = (data.totalVisits || 0) + 1;
      data.todayVisits = (data.todayVisits || 0) + 1;
      
      // Update dailyStats
      if (!data.dailyStats) data.dailyStats = [];
      let todayStat = data.dailyStats.find(s => s.date === today);
      if (!todayStat) {
        todayStat = { date: today, views: 0 };
        data.dailyStats.push(todayStat);
        if (data.dailyStats.length > 7) data.dailyStats.shift();
      }
      todayStat.views += 1;
      
      if (pageId) {
        if (!data.articleViews) data.articleViews = {};
        data.articleViews[pageId] = (data.articleViews[pageId] || 0) + 1;
      }
    }
    
    // Update active sessions
    if (sessionId) {
      if (!data.activeSessions) data.activeSessions = {};
      data.activeSessions[sessionId] = now;
    }
    
    await writeAnalytics(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
