export function generateUniqueId({ name, email_address, project, phone_number }) {
	const base = `${name}-${email_address}-${project}-${phone_number}`
	const hash = hashString(base)
	return `member-${hash}` // You can prefix for clarity
}

export function hashString(str) {
	const utf8 = new TextEncoder().encode(str)
	let hash = 0
	for (let i = 0; i < utf8.length; i += 1) {
		hash = (hash + utf8[i] * (i + 1)) % 1000000007
	}
	return `id-${hash.toString(36)}` // Base36 for compactness
}

export function transFormFilteredResourcesData(
	dataEmp,
	mappedProjects,
	thevalue,
	message,
	isTierFilter = false,
	setMyResources,
	setPreviousResources
) {
	const groupedEmployees = {}

	let resourceArray = null

	try {
		dataEmp.data.forEach((employee) => {
			const projectId = employee?.branch || 'No Project'

			const newProjectId = `${employee?.branch}-filteredout`

			if (employee?.SatisfyCondition) {
				if (!groupedEmployees[projectId]) {
					groupedEmployees[projectId] = {
						id: projectId,
						name: mappedProjects.find((project) => project.value === projectId)?.text || 'Unknown Project',
						collapsed: false,
						eventCreation: false,
						children: [],
						expanded: true,
						SatisfyCondition: true,
					}
				}

				const uniqueId = generateUniqueId(employee)

				groupedEmployees[projectId].children.push({
					newid: uniqueId,
					id: employee.id,
					name: employee.name,
					team: employee.team,
					team_lead: employee.team_lead,
					certificate: employee.certificate,
					SatisfyCondition: employee?.SatisfyCondition || false,
				})
			} else {
				if (!groupedEmployees[newProjectId]) {
					groupedEmployees[newProjectId] = {
						id: newProjectId,
						name: mappedProjects.find((project) => project.value === projectId)?.text || 'Unknown Project',
						collapsed: false,
						eventCreation: false,
						children: [],
						expanded: true,
						SatisfyCondition: false,
					}
				}

				const uniqueId = generateUniqueId(employee)

				groupedEmployees[newProjectId].children.push({
					newid: uniqueId,
					id: employee.id,
					name: employee.name,
					team: employee.team,
					team_lead: employee.team_lead,
					certificate: employee.certificate,
					SatisfyCondition: false,
				})
			}
		})

		resourceArray = Object.values(groupedEmployees)
	} catch (err) {
		console.log('Filtered Employee', err)
	}

	console.log('Filtered Employee', resourceArray)

	setMyResources(resourceArray)

	// Only update previous resources if not in the middle of a tier filter operation
	if (!isTierFilter) {
		setPreviousResources(resourceArray)
	}
}
