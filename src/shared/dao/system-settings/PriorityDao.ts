import { BASE_URL } from "../../config";

export const priorityDao = () => {
    const getPriorities = ({ signal, ...restParams }: ApiParams) => fetch(`${BASE_URL}/priorities`, { ...restParams, signal })

    const getPriority = (id: string) => fetch(`${BASE_URL}/priorities/${id}`)

    const postPriority = (payload: { name: string; description: string }) => fetch(`${BASE_URL}/priorities`, { method: "POST", body: JSON.stringify(payload) })

    const putPriority = ({ id, ...restPayload }: { id: string; name: string; description: string }) => fetch(`${BASE_URL}/priorities/${id}`, { method: "PUT", body: JSON.stringify(restPayload) })

    const deletePriority = (id: string) => fetch(`${BASE_URL}/priorities/${id}`, { method: "DELETE" })
    return {
        getPriorities,
        getPriority,
        postPriority,
        putPriority,
        deletePriority
    }
}