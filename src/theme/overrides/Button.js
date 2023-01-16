// ----------------------------------------------------------------------

export default function Button(theme) {
	return {
		MuiButton: {
			variants: [
				{
					props: { variant: 'dashed', color: 'primary' },
					style: {
						textTransform: 'none',
						border: `2px dashed ${theme.palette.grey[100]}`,
						boxShadow: theme.customShadows.z8,
						color: theme.palette.grey[500],
						'&:hover': {
							backgroundColor: theme.palette.action.hover,
						},
					},
				},
				{
					props: { variant: 'dashed', color: 'secondary' },
					style: {
						textTransform: 'none',
						border: `1px dashed ${theme.palette.grey[500]}`,
						boxShadow: theme.customShadows.z8,
						color: theme.palette.grey[500],
						'&:hover': {
							backgroundColor: theme.palette.action.hover,
						},
					},
				},
			],
			styleOverrides: {
				root: {
					'&:hover': {
						boxShadow: 'none',
					},
				},
				sizeLarge: {
					height: 48,
				},
				containedInherit: {
					color: theme.palette.grey[800],
					backgroundColor: theme.palette.background.paper,
					boxShadow: theme.customShadows.z8,
					'&:hover': {
						backgroundColor: theme.palette.grey[400],
					},
				},
				containedPrimary: {
					boxShadow: theme.customShadows.primary,
				},
				containedSecondary: {
					boxShadow: theme.customShadows.secondary,
					backgroundColor: theme.palette.text.default,
					color: theme.palette.grey[0],
					border: '1px solid rgba(0, 0, 0, 0.1)',
				},
				outlinedInherit: {
					border: `1px solid ${theme.palette.primary.main}`,
					boxShadow: theme.customShadows.z8,
					color: theme.palette.secondary.main,
					'&:hover': {
						backgroundColor: theme.palette.action.hover,
					},
				},
				textInherit: {
					'&:hover': {
						backgroundColor: theme.palette.action.hover,
					},
				},
				textSecondary: {
					color: theme.palette.grey[800],
					'&:hover': {
						backgroundColor: theme.palette.action.hover,
					},
				},
			},
		},
	}
}
