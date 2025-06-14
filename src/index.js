// scroll bar
import 'simplebar/src/simplebar.css'

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Suspense } from 'react'
//
import App from './App'
import * as serviceWorker from './serviceWorker'
import reportWebVitals from './reportWebVitals'

// ----------------------------------------------------------------------

if (process.env.NODE_ENV === 'development') {
	const suppressedErrors = ['ResizeObserver loop completed']
	const originalError = console.error
	console.error = (...args) => {
		if (!suppressedErrors.some((entry) => args[0]?.includes(entry))) {
			originalError(...args)
		}
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<HelmetProvider>
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<App />
			</Suspense>
		</BrowserRouter>
	</HelmetProvider>
)

// If you want to enable client cache, register instead.
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
