// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js'
const REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ?? ''
const REACT_APP_SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY ?? ''
console.log(process.env.REACT_APP_SUPABASE_URL)
console.log(process.env.REACT_APP_SUPABASE_KEY)
const supabase = createClient(
	'https://jobpkosfpjjzhcwhdofe.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYnBrb3NmcGpqemhjd2hkb2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM5MTA2MTcsImV4cCI6MTk3OTQ4NjYxN30.z3RPWSzsc5cDltFQlyfjeSiXCmJHAC7xKDTMwYnZnnU'
)

export default async function handleSignUp(request, response) {
	console.log('invoked')
	let record
	if (request.body.type != 'DELETE') {
		record = request.body.record
	} else {
		record = request.body.old_record
	}
	const { id, created_at, ...valuesToInsert } = record

	// let {data:employees,error1} = await supabase.from('employees').select('*').eq('user',record.id)
	let { data, error } = await supabase
		.from('employees')
		.upsert([{ email_address: record.email, user: record.id }], { onConflict: 'email_address' })
		.select()
	// const { data, error } = await supabase.from('employees').insert([{email_address:record.email,user:record.id}])

	console.log(error)
	console.log(data)
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
