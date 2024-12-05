import { RouterProvider } from 'react-router-dom'
import { routes } from './shared/routes'
import { ToastNotification } from './shared/components'

export default function App() {
	return (
		<>
			{/* ADD CONTEXTS HERE */}
			<RouterProvider router={routes} />
			<ToastNotification />
		</>
	)
}
