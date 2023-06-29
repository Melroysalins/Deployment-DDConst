import { createClient } from '@supabase/supabase-js'
const REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ?? ''
const REACT_APP_SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY ?? ''
console.log(process.env.REACT_APP_SUPABASE_URL)
console.log(process.env.REACT_APP_SUPABASE_KEY)
const supabase = createClient('https://jobpkosfpjjzhcwhdofe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYnBrb3NmcGpqemhjd2hkb2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM5MTA2MTcsImV4cCI6MTk3OTQ4NjYxN30.z3RPWSzsc5cDltFQlyfjeSiXCmJHAC7xKDTMwYnZnnU')
export default async function testrls(request, response) {
    const { data, error } = await supabase.from('testrls').select('*');
    console.log(data);
}

// testrls();