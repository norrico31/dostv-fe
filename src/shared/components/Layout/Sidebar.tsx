import { NavLink } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md"
import { TbSettingsCog } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { GrTask } from "react-icons/gr";

export default function Sidebar({ open, onClick }: { open: boolean; onClick: () => void }) {
    return (
        <>
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform  ${open ? 'translate-x-0' : '-translate-x-full'}`}
                aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <div className="flex justify-between items-center font-medium border-b py-3 px-2 border-slate-300">
                            {/* <img
                        src="https://img.icons8.com/color/512/firebase.png"
                        width={45}
                        alt=""
                    /> */}
                            <span className="text-xl whitespace-pre text-gray-800 dark:text-white">Brand Logo</span>
                            <button
                                onClick={onClick}
                                data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center text-md text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                        </div>
                        <li>
                            <NavLink to="/" className={({ isActive }) => `${isActive ? 'active' : ''} flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                                <MdOutlineDashboard size={24} className='text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white' />
                                <span className="ms-3">Projects</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/backlogs" className={({ isActive }) => `${isActive ? 'active' : ''} flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                                <GrTask size={24} className='text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white' />
                                <span className="ms-3">Backlogs</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/system-settings" className={({ isActive }) => `${isActive ? 'active' : ''} flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                                <MdOutlineSettings size={24} className='text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white' />
                                <span className="ms-3">System Settings</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin-settings" className={({ isActive }) => `${isActive ? 'active' : ''} flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                                <TbSettingsCog size={24} className='text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white' />
                                <span className="ms-3">Admin Settings</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/me" className={({ isActive }) => `${isActive ? 'active' : ''} flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                                <FaRegUser size={24} className='text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white' />
                                <span className="ms-3">Profile</span>
                            </NavLink>
                        </li>
                        {/* <li>
                            <button type="button" className="flex items-center w-full p-2 text-base text-gray-800 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">E-commerce</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-gray-800 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Products</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-gray-800 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Billing</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-gray-800 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Invoice</a>
                                </li>
                            </ul>
                        </li> */}
                        {/* <li>
                            <a href="#" className="flex items-center p-2 text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-md font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                            </a>
                        </li> */}

                    </ul>
                </div>
            </aside>
        </>
    )
}