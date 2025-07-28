// Supabase - Free PostgreSQL Database (500MB free)
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// User data operations
export const saveUserData = async (userData: any) => {
  const { data, error } = await supabase.from("users").insert([userData]).select()

  if (error) throw error
  return data
}

export const getUserData = async (email: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) throw error
  return data
}

export const saveUserActivity = async (activity: any) => {
  const { data, error } = await supabase.from("user_activities").insert([activity]).select()

  if (error) throw error
  return data
}
