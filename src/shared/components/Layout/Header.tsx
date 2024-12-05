import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MdOutlineLightMode, MdOutlineDarkMode, MdKeyboardArrowDown } from "react-icons/md";
import { useThemeCtx } from '../../contexts/DarkMode'
import { Link, useNavigate, NavLink, Navigate, useLocation } from 'react-router-dom';
import { userDao } from '../../dao/UserDao';
import { useUserContext } from '../../contexts/UserContext';

const navigation = [
	{ name: 'Projects', to: '/projects' },
	{ name: 'Settings', to: '/settings/status' },
]

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

function ButtonDarkmode() {
	const { theme, toggleTheme } = useThemeCtx()
	return (
		<button onClick={toggleTheme} className="hidden sm:inline-flex transition items-center p-2 text-md text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
			<span className="sr-only">Toggle dark mode</span>
			{theme ?
				<MdOutlineLightMode className="h-6 w-6 text-white-500" aria-hidden="true" />
				:
				<MdOutlineDarkMode className="h-6 w-6 text-white-500" aria-hidden="true" />
			}
		</button>
	)
}

function HeaderBrand() {
	return <div className="flex items-center">
		<div className="flex-shrink-0">
			Brand Logo
		</div>
	</div>
}

function HeaderNav() {
	const { pathname } = useLocation()
	return <div className="ml-10 flex items-baseline space-x-4">
		<NavLink
			to='/'
			className={({ isActive }) => classNames(isActive ? 'bg-gray-700 text-white dark:bg-gray-600'
				: 'text-gray-700 hover:bg-gray-700 hover:text-white dark:text-gray-200',
				'rounded-md px-3 py-2 text-md font-medium',
			)}
		>
			Segments
		</NavLink>
		<NavLink
			to='/projects'
			className={({ isActive }) => classNames(isActive ? 'bg-gray-700 text-white dark:bg-gray-600'
				: 'text-gray-700 hover:bg-gray-700 hover:text-white dark:text-gray-200',
				'rounded-md px-3 py-2 text-md font-medium',
			)}
		>
			Projects
		</NavLink>
		<NavLink
			to='/settings/status'
			className={classNames(pathname.includes('settings')
				? 'bg-gray-700 text-white dark:bg-gray-600'
				: 'text-gray-700 hover:bg-gray-700 hover:text-white dark:text-gray-200',
				'rounded-md px-3 py-2 text-md font-medium',
			)}
		>
			Settings
		</NavLink>
	</div >
}

export default function Header() {
	return <div className='bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm px-5 lg:px-0'>
		<Disclosure as="nav" className="md:container mx-auto">
			{() => (
				<>
					<div>
						<div className="flex h-16 items-center justify-between">
							<HeaderBrand />
							<div>
								<div className="ml-4 flex items-center md:ml-6">
									<div className='md:mr-5'>
										<HeaderNav />
									</div>
									<ButtonDarkmode />
									<Menu as="div" className="relative ml-3">
										<UserProfile />
										<MenuItems
											transition
											className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
										>
											<MenuItem>
												{({ focus }) => (
													<Link
														to='/me'
														className={classNames(
															focus ? 'bg-gray-100' : '',
															'block px-4 py-2 text-md text-gray-700',
														)}
														onClick={() => null}
													>
														Profile
													</Link>
												)}
											</MenuItem>
											<LogoutDisclosure />
										</MenuItems>
									</Menu>
								</div>
							</div>
						</div>
					</div>
					<DisclosurePanel>
						<div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
							{navigation.map((item) => (
								<DisclosureButton
									key={item.name}
									as="a"
									href={item.to}
									className={classNames(
										item.to ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block rounded-md px-3 py-2 text-base font-medium',
									)}
									aria-current={item.to ? 'page' : undefined}
								>
									{item.name}
								</DisclosureButton>
							))}
						</div>
						<div className="border-t border-gray-700 pb-3 pt-4">
							<div className="flex items-center px-5">
								<button
									type="button"
									className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
								</button>
							</div>
						</div>
					</DisclosurePanel>
				</>
			)}
		</Disclosure>
	</div>
}

const { getMe } = userDao()

function UserProfile() {
	const { user } = useUserContext()
	if (!user?.token) return <Navigate to='/login' />;
	return <div>
		<MenuButton className="relative flex max-w-xs items-center rounded-full text-md focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
			<span className="absolute -inset-1.5" />
			<span className="sr-only">User profile only</span>
			{/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
			<p className='font-bold text-gray-700 dark:text-gray-200 hidden md:block'>{user.user.firstName}</p>
			<MdKeyboardArrowDown size={28} className='text-gray-700 dark:text-gray-200' />
		</MenuButton>
	</div>
}

function LogoutDisclosure() {
	const navigate = useNavigate()
	const { setUser } = useUserContext()
	return <MenuItem>
		{({ focus }) => (
			<Link
				to='/login'
				className={classNames(
					focus ? 'bg-gray-100' : '',
					'block px-4 py-2 text-md text-gray-700',
				)}
				onClick={() => {
					localStorage.clear()
					setUser(undefined)
					navigate('/login')
				}}
			>
				Logout
			</Link>
		)}
	</MenuItem>
}