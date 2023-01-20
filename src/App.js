// routes
import Router from './routes'
// theme
import ThemeProvider from './theme'
// components
import ScrollToTop from './components/ScrollToTop'
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './scss/mui.scss'
import { MainProvider } from 'pages/context/context'
// ----------------------------------------------------------------------
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: true,
		},
	},
})

export default function App() {
	return (
		<ThemeProvider>
			<ScrollToTop />
			<BaseOptionChartStyle />
			<QueryClientProvider client={queryClient}>
				<MainProvider>
					<Router />
					<ReactQueryDevtools initialIsOpen={false} toggleButtonProps={{ style: { opacity: 0.2 } }} />
				</MainProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
