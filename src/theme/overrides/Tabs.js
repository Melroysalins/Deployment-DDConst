// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.indicatorColor === 'inherit' && {
            '& .MuiTab-textColorPrimary.Mui-selected': {
              color: theme.palette.colors[4],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.colors[4],
            },
          }),
          ...(ownerState.indicatorColor === 'primary' && {
            '& .MuiTab-textColorPrimary.Mui-selected': {
              color: theme.palette.colors[8],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.colors[8],
            },
          }),
          ...(ownerState.indicatorColor === 'secondary' && {
            '& .MuiTab-textColorPrimary.Mui-selected': {
              color: theme.palette.colors[6],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.colors[6],
            },
          }),
        }),
      },
    },
  };
}
