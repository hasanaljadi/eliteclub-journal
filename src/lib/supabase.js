import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── AUTH ────────────────────────────────────────────────────
export const signUp = (email, password, name) =>
  supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ─── TRADES ─────────────────────────────────────────────────
export const getTrades = async (userId) => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  return { data, error }
}

export const addTrade = async (trade) => {
  const { data, error } = await supabase
    .from('trades')
    .insert([trade])
    .select()
  return { data, error }
}

export const updateTrade = async (id, updates) => {
  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteTrade = async (id) => {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
  return { error }
}

// ─── PROFILES ────────────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  return { data, error }
}
