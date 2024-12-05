import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ThemeProvider from './shared/contexts/DarkMode.tsx';
import ToastNotificationProvider from './shared/contexts/ToastNotification.tsx';
import UserProvider from './shared/contexts/UserContext.tsx';
import './style.scss'

const { fetch: originalFetch } = window;

window.fetch = async (...[resource, config]: Parameters<typeof originalFetch>): Promise<Response> => {
	try {
		const dataFromStorage = localStorage.getItem('data')
		const parsedData = dataFromStorage ? JSON.parse(dataFromStorage) : null
		const token = parsedData?.token

		const headers = {
			...(config?.headers || {
				'Accept': 'application/json',
				'Content-Type': 'application/json',

			}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};

		const response = await originalFetch(resource, {
			...config,
			headers,
		});

		const data = await response.clone().json()

		if (!response.ok) {
			throw data
		}

		response.json = () => Promise.resolve(data)
		return response
	} catch (error) {
		return Promise.reject(error)
	}
}


createRoot(document.getElementById('root')!).render(
	<ThemeProvider>
		<UserProvider>
			<ToastNotificationProvider>
				<App />
			</ToastNotificationProvider>
		</UserProvider>
	</ThemeProvider>
)
