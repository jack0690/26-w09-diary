import { supabase } from '../lib/supabase'
export async function fetchDiaries(filter = 'all') {
  let query = supabase
    .from('diaries')
    .select('*')
    .order('created_at', { ascending: false })
  if (filter && filter !== 'all') {
    query = query.eq('emotion', filter)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}
export async function createDiary({ content, emotion }) {
  const { data, error } = await supabase
    .from('diaries')
    .insert([{ content, emotion }])
    .select()
  if (error) throw error
  return data
}
export async function deleteDiary(id) {
  const { error } = await supabase
    .from('diaries')
    .delete()
    .eq('id', id)
  if (error) throw error
}
