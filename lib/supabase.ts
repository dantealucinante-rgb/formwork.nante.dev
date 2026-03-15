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
    university: string | null
    year_of_study: string | null
    matric_number: string | null
    total_generations: number
    total_documents: number
    last_active: string | null
    default_university: string | null
    default_documents: string[] | null
    preferred_format: string | null
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
