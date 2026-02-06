import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function insertLostItem(payload: { title: string; description?: string; image_url?: string; status?: string }) {
  return supabase.from('lost_items').insert(payload)
}

export function subscribeLostItems(onInsert: (payload: any) => void) {
  return supabase
    .channel('lost_items_inserts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lost_items' }, onInsert)
    .subscribe()
}

export async function uploadPublicImage(path: string, file: File) {
  const res = await supabase.storage.from('public-images').upload(path, file, { upsert: false })
  if (res.error) return res
  const publicUrl = supabase.storage.from('public-images').getPublicUrl(path).data.publicUrl
  return { data: { path, publicUrl }, error: null }
}*** End Patch  icyo```  ?>>
