import { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
    if (supabaseClient) {
        return supabaseClient
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
    return supabaseClient
}