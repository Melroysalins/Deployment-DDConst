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
import { I18nextProvider } from 'react-i18next'
import i18n from './utils/locales/i18n'

// This disables the ResizeObserver error from appearing in the red React error overlay
const originalResizeObserver = window.ResizeObserver
window.ResizeObserver = class extends originalResizeObserver {
	constructor(callback) {
		super((entries, observer) => {
			try {
				callback(entries, observer)
			} catch (e) {
				// Just silently ignore the error
				if (
					e.message.includes('ResizeObserver loop completed') ||
					e.message.includes('ResizeObserver loop limit exceeded')
				) {
					// Do nothing
				} else {
					throw e
				}
			}
		})
	}
}

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
			<I18nextProvider i18n={i18n}>
				<ScrollToTop />
				<BaseOptionChartStyle />
				<QueryClientProvider client={queryClient}>
					<MainProvider>
						<Router />
						<ReactQueryDevtools initialIsOpen={false} toggleButtonProps={{ style: { opacity: 0.2 } }} />
					</MainProvider>
				</QueryClientProvider>
			</I18nextProvider>
		</ThemeProvider>
	)
}
