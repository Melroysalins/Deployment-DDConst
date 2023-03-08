import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
const REACT_APP_SUPABASE_URL:string = process.env.REACT_APP_SUPABASE_URL;
const REACT_APP_SUPABASE_KEY:string = process.env.REACT_APP_SUPABASE_ANON_KEY;
console.log(process.env.REACT_APP_SUPABASE_URL)
const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY);
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
  ) {
  const res = await supabase.from('projects').select('*')
  response.status(200).json({
    data:"no",
    body: request.body,
    query: request.query,
    cookies: request.cookies,
    result:res
  });
}

// export  async function afterCrudEventsTable(
//   request: VercelRequest,
//   response: VercelResponse,
//   ) {
//     // get all data from the webhook
//     // write to logs table

//   response.status(200).json({
//     data:"no",
//     body: request.body,
//     query: request.query,
//     cookies: request.cookies,
//     result:res
//   });
// }

