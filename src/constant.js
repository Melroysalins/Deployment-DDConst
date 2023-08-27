// theme constant
export const gridSpacing = 3
export const DRAWER_WIDTH = 260
export const DRAWER_WIDTH_COLLAPSED = 75
export const appDrawerWidth = 320
// export const APP_BAR_MOBILE = 64;
// export const APP_BAR_DESKTOP = 70;
export const APP_BAR_MOBILE = 0
export const APP_BAR_DESKTOP = 0

export const certificateColors = {
	A: '#FF6B00',
	B: '#FE9F00',
	C: '#8CCC67',
	S: '#8D99FF',
}

export const approvalStatus = [
	{ id: 'weekly_plan', name: 'Weekly Process Planning' },
	{ id: 'travel_expenses', name: 'Travel Expenses' },
	{ id: 'project', name: 'Project' },
]

export const getNameApprovalStatus = {
	weekly_plan: 'Weekly Process Planning',
	travel_expenses: 'Travel Expenses',
	project: 'Project',
}

export const ApprovalStatus = {
	Approved: 'Approved',
	Planned: 'Planned',
	Rejected: 'Rejected',
}

export const WeekName = {
	Current: 'Current',
	Next: 'Next',
	Previous: 'Previous',
}

export const BucketName = {
	Profile_Images: 'profile_images',
	Avatars: 'avatars',
	Files: 'files',
}
