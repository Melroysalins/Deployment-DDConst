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

// This disables the ResizeObserver error from appearing in the red React error overlay
// Monkey-patch ResizeObserver to suppress the "loop limit exceeded" error
const resizeObserver = new ResizeObserver((entries) => {
	window.requestAnimationFrame(() => {})
})

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
