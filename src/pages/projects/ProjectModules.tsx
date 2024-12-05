import { useEffect, useState } from 'react'
import { useParams, Outlet, useOutletContext, NavLink } from 'react-router-dom'
import { projectsDao } from '../../shared/dao'
import { firstLetterCapitalize } from '../../shared/utils/firstLetterCapitalize'
import { Loading } from '../../shared/components'

const { getProject } = projectsDao()

export default function ProjectModules() {
    const { projectId } = useParams()
    const [data, setData] = useState<Project>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // projectId && getProjectById(projectId)
    }, [projectId])

    async function getProjectById(id: string) {
        // setLoading(true)
        const { data } = await getProject(id)
        setData(data)
        setLoading(false)
    }

    return (
        <div className='md:container mx-auto'>
            {/* <div>
                <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                    <ol className="inline-flex flex-wrap items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <NavLink to="/projects" className="inline-flex gap-1 items-center text-md font-medium text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                                Projects
                            </NavLink>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <NavLink to={`/projects/${projectId}/details`} className={({ isActive }) => `${isActive ? 'underline text-gray-700 dark:text-gray-100' : 'dark:text-gray-300'} inline-flex gap-1 ms-1 text-md font-medium text-gray-500 hover:text-gray-800 md:ms-2  dark:hover:text-white`}>
                                    Details
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <NavLink to={`/projects/${projectId}/backlogs`} className={({ isActive }) => `${isActive ? 'underline text-gray-700 dark:text-gray-100' : 'dark:text-gray-300'} inline-flex gap-1 ms-1 text-md font-medium text-gray-500 hover:text-gray-800 md:ms-2  dark:hover:text-white`}>
                                    Backlogs
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <NavLink to={`/projects/${projectId}/developments`} className={({ isActive }) => `${isActive ? 'underline text-gray-700 dark:text-gray-100' : 'dark:text-gray-300'} inline-flex gap-1 ms-1 text-md font-medium text-gray-500 hover:text-gray-800 md:ms-2  dark:hover:text-white`}>
                                    Developments
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <NavLink to={`/projects/${projectId}/reports`} className={({ isActive }) => `${isActive ? 'underline text-gray-700 dark:text-gray-100' : 'dark:text-gray-300'} inline-flex gap-1 ms-1 text-md font-medium text-gray-500 hover:text-gray-800 md:ms-2  dark:hover:text-white`}>
                                    Reports
                                </NavLink>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div> */}
            <div className='md:container mx-auto mt-3 rounded-md bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-5'>
                <Outlet context={{ data: data as Project, loading, getProjectById }} />
            </div>
        </div>
    )
}

export const useProjectOutletCtx = () => useOutletContext<{ data: Project, loading: boolean; getProjectById: (id: string) => Promise<void> }>()