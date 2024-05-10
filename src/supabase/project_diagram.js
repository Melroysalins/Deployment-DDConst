import { supabase } from 'lib/api'

export const createNewProjectDiagram = async (data) => {
	const res = await supabase.from('project_diagrams').insert(data).select()
	return res
}

export const updateProjectDiagram = async (data, project) => {
	const res = await supabase.from('project_diagrams').update(data).eq('project', project).select('*')
	return res
}
export const getProjectDiagram = async (id) => {
	const res = await supabase.from('project_diagrams').select('*').eq('id', id).single()
	return res
}

export const getDiagramByProject = async (project) => {
	const res = await supabase.from('project_diagrams').select(`*`).eq('project', project).single()
	return res
}
