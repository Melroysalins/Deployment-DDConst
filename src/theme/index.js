import PropTypes from 'prop-types';
import { useMemo } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { SET_FONT_FAMILY } from 'store/actions';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows,
      overrides: {
        MuiCssBaseline: {
          "@global": {
            body: {
              scrollbarColor: "#6b6b6b #2b2b2b",
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#2b2b2b",
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: "#6b6b6b",
                minHeight: 24,
                border: "3px solid #2b2b2b",
              },
              "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                backgroundColor: "#959595",
              },
              "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                backgroundColor: "#959595",
              },
              "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#959595",
              },
              "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                backgroundColor: "#2b2b2b",
              },
            },
          },
        },
      },
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);


  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
