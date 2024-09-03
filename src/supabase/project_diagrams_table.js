import { supabase } from 'lib/api'

export const createNewProjectDiagramTable = async (data) => {
	const res = await supabase.from('project_diagrams_table').insert(data).select() 
	return res
}

export const updateProjectDiagramTable = async (data, project_diagram, isDemolition) => {
	const res = await supabase.from('project_diagrams_table').update(data).eq('project_diagram', project_diagram).eq('isDemolition', isDemolition).select('*')
	return res
}

export const getTableByProjectDiagram = async (project, isDemolition) => {
	const res = await supabase.from('project_diagrams_table').select('*').eq('project_diagram', project).eq('isDemolition', isDemolition).single()
	return res
}
