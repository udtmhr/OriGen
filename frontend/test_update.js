import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // Replace with a real test email if needed
    password: 'password123'
  })

  // We can't easily sign in without credentials, let's just create a test user or see if we can update without RLS via service role key
  console.log("We need a logged-in session to update profiles via Anon key because of RLS.")
}

test()
