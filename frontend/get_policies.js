import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getPolicies() {
    // Only works if we have service key or can query pg_policies via RPC or similar
    // Let's try to fetch a profile and update it without auth to see if RLS blocks it
    const { data: profiles, error: selectError } = await supabase.from('profiles').select('*').limit(1)
    console.log("Select result:", profiles, selectError)

    if (profiles && profiles.length > 0) {
        const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ bio: 'test update' })
            .eq('id', profiles[0].id)
            .select()
        console.log("Update result:", updateData, updateError)
    }
}
getPolicies()
