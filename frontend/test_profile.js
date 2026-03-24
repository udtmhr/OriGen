import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function testUpdate() {
  const { data: profiles, error: selectError } = await supabase.from('profiles').select('*').limit(1)
  console.log("Select Profile:", profiles, selectError)
  
  if (profiles && profiles.length > 0) {
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ bio: 'test update' })
      .eq('id', profiles[0].id)
      .select()
    console.log("Update Error:", updateError)
  }
}

testUpdate()
