import { BASE_URL } from "../config";
import { urlParams } from "../utils/url-params";

type TaskPayload = {
    name: string
    description: string
    projectId: number
    userId: number
    priorityId: number
}

type ProjectPayload = {
    dateDeadline: string | null
    dateStarted: string | null
    description: string | null
    id: number
    name: string | null
    progress: number
    segmentId: number
    statusId: number
    url: string | null
    userIds: number[]
}

export const projectsDao = () => {

    const getProjects = ({ signal, ...restParams }: ApiParams) => fetch(`${BASE_URL}/projects`, { ...restParams, signal })

    const getProject = (id: number) => fetch(`${BASE_URL}/projects/${id}`)

    const postProject = (payload: Project) => {
        console.log('ayaw pumasok dito')
        return fetch(`${BASE_URL}/projects`, { body: JSON.stringify(payload), method: 'POST' })
    }

    const editProject = (payload: ProjectPayload) => fetch(`${BASE_URL}/projects/${payload.id}`, { method: "PUT", body: JSON.stringify(payload) })

    const createTask = (payload: TaskPayload) => fetch(`${BASE_URL}/tasks`, { method: "POST", body: JSON.stringify(payload) })
    const updateTask = (payload: TaskPayload & { id: number }) => fetch(`${BASE_URL}/tasks/${payload.id}`, { method: "PUT", body: JSON.stringify(payload) })
    const deleteTask = (id: number) => fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" })

    return {
        getProjects,
        getProject,
        postProject,
        editProject,
        createTask,
        updateTask,
        deleteTask
    }
}