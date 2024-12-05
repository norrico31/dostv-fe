import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
    {
        path: 'status',
        children: 'Statuses'
    },
    {
        path: 'schedules',
        children: 'Schedules'
    },
    {
        path: 'project-types',
        children: 'Project types'
    },
    {
        path: 'severity-types',
        children: 'Severity types'
    },
    {
        path: 'issue-types',
        children: 'Issue types'
    },
    {
        path: 'devices',
        children: 'Devices'
    },
    {
        path: 'roles',
        children: 'Roles'
    },
    {
        path: 'users',
        children: 'Users'
    },
]

export default function SystemSettings() {
    const { pathname } = useLocation()

    if (pathname === '/settings' || pathname === '/settings/') return <Navigate to='/settings/status' />

    return (
        <div className="md:container mx-auto">
            <div className="heading-1 mb-4">System Settings</div>
            <div>
                <ul className="flex flex-wrap -mb-px text-md font-medium text-center text-gray-500 dark:text-gray-400 gap-1">
                    {navLinks.map(l => (
                        <li key={l.path}>
                            <NavLink to={l.path} className={({ isActive }) => `${isActive ? 'active' : ''} nav-tab-link`}>
                                {l.children}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='dark:bg-gray-800 bg-gray-50 rounded-b-lg p-8 border border-gray-200 dark:border-gray-700'>
                <Outlet />
            </div>
        </div>
    )
}
