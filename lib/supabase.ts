import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Profile = {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    generations_used: number
    created_at: string
}

export type Project = {
    id: string
    user_id: string
    title: string
    building_type: string | null
    location: string | null
    university: string | null
    details: Record<string, any>
    documents: Record<string, string>
    selected_documents: string[]
    created_at: string
    updated_at: string
}
