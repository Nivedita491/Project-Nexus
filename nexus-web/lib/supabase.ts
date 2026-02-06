import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: Test connection helper
export const checkConnection = async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) console.error('Supabase connection error:', error);
    else console.log('Supabase connected, users found:', data?.length);
    return { data, error };
};
