import { promises as fs } from 'fs';
import path from 'path';
import { supabase } from './supabase';

const DATA_PATH = path.join(process.cwd(), 'readers24-data/site-data.json');

const DEFAULT_DATA = {
  settings: {
    siteName: "Readers 24",
    userName: "James Doe",
    userRole: "Editor-in-Chief",
    notifications: true,
    darkMode: false
  },
  heroArticle: null,
  secondaryArticles: [],
  editorsPicks: [],
  opinionPieces: [],
  mostRead: [],
  multimediaArticles: []
};

// Automatic sanitizer to guarantee clean titles, authors, content, and realistic timestamps
function sanitizeData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (typeof obj.title === 'string') {
    obj.title = obj.title
      .replace(/^SEO Optimized:\s*/i, '')
      .replace(/^SEO-Optimized:\s*/i, '')
      .replace(/SEO Optimized:\s*/gi, '')
      .replace(/NewsLad/g, 'Readers 24')
      .replace(/newslad/g, 'readers24')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[⚡📌🚀💡🤖🔥✨💥🎯]/g, '')
      .trim();
  }

  if (typeof obj.author === 'string' && (obj.author.toLowerCase() === 'newslad' || obj.author.toLowerCase() === 'news lad')) {
    obj.author = 'Readers 24';
  }

  if (typeof obj.siteName === 'string' && (obj.siteName.toLowerCase() === 'newslad' || obj.siteName.toLowerCase() === 'news lad')) {
    obj.siteName = 'Readers 24';
  }

  if (typeof obj.content === 'string') {
    obj.content = obj.content
      .replace(/NewsLad/g, 'Readers 24')
      .replace(/newslad/g, 'readers24')
      .replace(/News Lad/g, 'Readers 24')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[⚡📌🚀💡🤖🔥✨💥🎯]/g, '');
  }

  if (typeof obj.excerpt === 'string') {
    obj.excerpt = obj.excerpt
      .replace(/NewsLad/g, 'Readers 24')
      .replace(/newslad/g, 'readers24')
      .replace(/News Lad/g, 'Readers 24')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[⚡📌🚀💡🤖🔥✨💥🎯]/g, '');
  }

  if (typeof obj.time === 'string' && (obj.time === 'Just now' || obj.time.toLowerCase().includes('just now'))) {
    obj.time = '15 mins ago';
  }
  
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item => sanitizeData(item));
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = sanitizeData(obj[key]);
    }
  }
  return obj;
}

export async function readData() {
  let result = null;

  // Try Supabase first if available
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_data')
        .select('content')
        .eq('id', 'main')
        .single();
      
      if (data && data.content) {
        result = data.content;
      }
    }
  } catch (supabaseErr) {
    // Silently fall back to local file
  }

  // Fallback to local JSON file
  if (!result) {
    try {
      const dir = path.dirname(DATA_PATH);
      const backupPath = path.join(dir, 'site-data.backup.json');
      let fileFound = false;

      try {
        await fs.access(DATA_PATH);
        fileFound = true;
      } catch {
        fileFound = false;
      }

      if (fileFound) {
        const fileContents = await fs.readFile(DATA_PATH, 'utf8');
        result = JSON.parse(fileContents);
      } else {
        // Fallback to backup if primary file is missing
        try {
          const backupContents = await fs.readFile(backupPath, 'utf8');
          result = JSON.parse(backupContents);
        } catch {
          return DEFAULT_DATA;
        }
      }
    } catch (error) {
      console.error('Error reading data:', error);
      return DEFAULT_DATA;
    }
  }

  return sanitizeData(result);
}

export async function writeData(data) {
  const cleanData = sanitizeData(data);
  let fileSuccess = false;
  let supabaseSuccess = false;

  // 1. Write to local filesystem
  try {
    const dir = path.dirname(DATA_PATH);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
    const jsonStr = JSON.stringify(cleanData, null, 2);
    await fs.writeFile(DATA_PATH, jsonStr, 'utf8');
    fileSuccess = true;

    // Maintain a rolling backup whenever there are articles to prevent data loss
    if (Array.isArray(cleanData.editorsPicks) && cleanData.editorsPicks.length > 0) {
      const backupPath = path.join(dir, 'site-data.backup.json');
      await fs.writeFile(backupPath, jsonStr, 'utf8').catch(() => {});
    }
  } catch (error) {
    console.error('Error writing local file data:', error);
  }

  // 2. Sync to Supabase if connected
  try {
    if (supabase) {
      const { error } = await supabase
        .from('site_data')
        .upsert({ id: 'main', content: cleanData, updated_at: new Date().toISOString() });
      if (!error) {
        supabaseSuccess = true;
      } else {
        console.error('Supabase upsert error:', error);
        return { success: false, error: error.message || 'Supabase save failed' };
      }
    }
  } catch (err) {
    console.error('Error writing Supabase data:', err);
    return { success: false, error: err.message || 'Supabase connection error' };
  }

  return { success: fileSuccess || supabaseSuccess };
}
