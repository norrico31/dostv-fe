import { lazy, ReactNode, Suspense } from "react";
import {
	createBrowserRouter,
} from "react-router-dom";

import Layout from './components/Layout/Layout';

const Login = lazy(() => import('../pages/Login'))
const Segments = lazy(() => import('../pages/projects/Segments'))
const Profile = lazy(() => import('../pages/Profile'))

const ProjectModules = lazy(() => import('../pages/projects/ProjectModules'))
const ProjectLists = lazy(() => import('../pages/projects/ProjectLists'))
const ProjectForm = lazy(() => import('../pages/projects/ProjectForm'))

const SystemSettings = lazy(() => import('../pages/system-settings/SystemSettings'))
const Statuses = lazy(() => import('../pages/system-settings/Statuses'))
const Roles = lazy(() => import('../pages/system-settings/Roles'))
const Users = lazy(() => import('../pages/system-settings/Users'))
const Priority = lazy(() => import('../pages/system-settings/Priority'))

function PromiseComponent({ element }: { element: ReactNode }) {
	return <Suspense fallback={null}>{element}</Suspense>
}

export const routes = createBrowserRouter([
	{
		path: "/",
		// loader: rootLoader,
		element: <Layout />,
		children: [
			{
				path: "",
				element: <PromiseComponent element={<Segments />} />,
				// element: <Navigate to='/projects' />
			},
			{
				path: "/projects",
				element: <PromiseComponent element={<ProjectLists />} />,
			},
			{
				path: "/projects/:projectId",
				element: <PromiseComponent element={<ProjectModules />} />,
				children: [
					{
						path: "details",
						element: <ProjectForm />,
					},
				]
			},
			{
				path: "create",
				element: <PromiseComponent element={<ProjectForm />} />,
			},
			{
				path: "me",
				element: <PromiseComponent element={<Profile />} />,
			},
			{
				path: "settings",
				element: <PromiseComponent element={<SystemSettings />} />,
				children: [
					{
						path: "status",
						element: <PromiseComponent element={<Statuses />} />,
					},
					{
						path: "priorities",
						element: <PromiseComponent element={<Priority />} />,
					},
					{
						path: "roles",
						element: <PromiseComponent element={<Roles />} />,
					},
					{
						path: "users",
						element: <PromiseComponent element={<Users />} />,
					},
				]
			},
		],
	},
	{
		path: '/login',
		element: <PromiseComponent element={<Login />} />,
	},
]);