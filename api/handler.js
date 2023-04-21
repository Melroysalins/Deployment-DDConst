// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js'
const REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ?? ''
const REACT_APP_SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY ?? ''
console.log(process.env.REACT_APP_SUPABASE_URL)
console.log(process.env.REACT_APP_SUPABASE_KEY)
const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)
console.log(supabase)
export default async function handler(request, response) {
	console.log(request.body)
	let record = request.body.record
	const { id, created_at, ...valuesToInsert } = record
	console.log(valuesToInsert)

	const { data, error } = await supabase.from('logs').insert([{...valuesToInsert,action:request.body.type}])

	// let { data: logs, error2 } = await supabase.from('logs').select('id')

	console.log(error)
	response.status(200).json({
		result: data,
		error: error,
	})
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
