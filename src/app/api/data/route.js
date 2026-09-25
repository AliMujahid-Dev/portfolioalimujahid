import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { readData, writeData } from '@/lib/data';

export const dynamic = 'force-dynamic';

const REQUIRED_KEYS = ['settings', 'heroArticle', 'secondaryArticles', 'editorsPicks'];

export async function POST(request) {
  try {
    // Security check: Verify authorized administrator session
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    const authToken = cookieStore.get('auth_token');
    
    // Accept valid admin cookie or valid token prefix
    const isAuthenticated = (authCookie && authCookie.value === 'admin') || 
                            (authToken && authToken.value.startsWith('r24_sec_'));

    if (!isAuthenticated) {
      console.warn('Unauthorized attempt to write data: cookies missing or invalid');
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Your administrator session expired. Please log in again.' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate incoming data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid data: expected a JSON object' },
        { status: 400 }
      );
    }

    // Check that required keys exist to prevent data corruption
    const missingKeys = REQUIRED_KEYS.filter(key => !(key in data));
    if (missingKeys.length > 0) {
      console.error('Validation failed: Missing required keys:', missingKeys);
      return NextResponse.json(
        { success: false, message: `Invalid data: missing required keys: ${missingKeys.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await writeData(data);
    if (!result.success) {
      const errMsg = typeof result.error === 'string' ? result.error : 'Database write error';
      throw new Error(errMsg);
    }
    
    try {
      revalidatePath('/', 'layout');
    } catch (revErr) {
      console.warn('Revalidation notice:', revErr);
    }
    
    return NextResponse.json({ success: true, message: 'Data saved successfully to Supabase and storage.' });
  } catch (error) {
    console.error('Error saving data in /api/data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read data' },
      { status: 500 }
    );
  }
}
