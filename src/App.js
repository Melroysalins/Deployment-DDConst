// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

import { Provider } from 'react-redux';
import configureStore from './redux/store';
import './scss/mui.scss';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Provider store={configureStore()}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}
