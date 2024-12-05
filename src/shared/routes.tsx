import { lazy, ReactNode, Suspense } from "react";
import {
	createBrowserRouter,
	Navigate,
	Outlet,
} from "react-router-dom";

import Layout from './components/Layout/Layout';
import { Loading } from "./components";

const Login = lazy(() => import('../pages/Login'))
const Segments = lazy(() => import('../pages/projects/Segments'))
const Profile = lazy(() => import('../pages/Profile'))

const ProjectModules = lazy(() => import('../pages/projects/ProjectModules'))
const ProjectLists = lazy(() => import('../pages/projects/ProjectLists'))
const ProjectForm = lazy(() => import('../pages/projects/ProjectForm'))
const Backlogs = lazy(() => import('../pages/projects/Backlogs'))
const Developments = lazy(() => import('../pages/projects/Developments'))
const Reports = lazy(() => import('../pages/projects/Reports'))

const SystemSettings = lazy(() => import('../pages/system-settings/SystemSettings'))
const Statuses = lazy(() => import('../pages/system-settings/Statuses'))
const Devices = lazy(() => import('../pages/system-settings/Devices'))
const IssueTypes = lazy(() => import('../pages/system-settings/IssueTypes'))
const Schedules = lazy(() => import('../pages/system-settings/Schedules'))
const SeverityTypes = lazy(() => import('../pages/system-settings/SeverityTypes'))
const ProjectTypes = lazy(() => import('../pages/system-settings/ProjectTypes'))
const Roles = lazy(() => import('../pages/system-settings/Roles'))
const Users = lazy(() => import('../pages/system-settings/Users'))

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
						path: "devices",
						element: <PromiseComponent element={<Devices />} />,
					},
					{
						path: "issue-types",
						element: <PromiseComponent element={<IssueTypes />} />,
					},
					{
						path: "project-types",
						element: <PromiseComponent element={<ProjectTypes />} />,
					},
					{
						path: "schedules",
						element: <PromiseComponent element={<Schedules />} />,
					},
					{
						path: "severity-types",
						element: <PromiseComponent element={<SeverityTypes />} />,
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
			// {
			// 	path: "backlogs",
			// 	element: <PromiseComponent element={<Backlogs />} />,
			// },
			// {
			// 	path: "admin-settings",
			// 	element: <PromiseComponent element={<AdminSettings />} />,
			// 	children: [
			// 		{
			// 			path: "statuses",
			// 			element: <PromiseComponent element={<Statuses />} />,
			// 		},
			// 		{
			// 			path: "devices",
			// 			element: <PromiseComponent element={<Devices />} />,
			// 		},
			// 		{
			// 			path: "issue-types",
			// 			element: <PromiseComponent element={<IssueTypes />} />,
			// 		},
			// 		{
			// 			path: "schedules",
			// 			element: <PromiseComponent element={<Schedules />} />,
			// 		},
			// 		{
			// 			path: "severity-types",
			// 			element: <PromiseComponent element={<SeverityTypes />} />,
			// 		},
			// 	]
			// },
		],
	},
	{
		path: '/login',
		element: <PromiseComponent element={<Login />} />,
	},
]);