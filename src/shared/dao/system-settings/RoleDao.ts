import { BASE_URL } from "../../config";

export const roleDao = () => {
    const getRoles = ({ signal, ...restParams }: ApiParams) => fetch(`${BASE_URL}/roles`, { ...restParams, signal })

    const getRole = (id: string) => fetch(`${BASE_URL}/roles/${id}`)

    const postRole = (payload: { name: string; description: string }) => fetch(`${BASE_URL}/roles`, { method: "POST", body: JSON.stringify(payload) })

    const putRole = ({ id, ...restPayload }: { id: string; name: string; description: string }) => fetch(`${BASE_URL}/roles/${id}`, { method: "PUT", body: JSON.stringify(restPayload) })

    const deleteRole = (id: string) => fetch(`${BASE_URL}/roles/${id}`, { method: "DELETE" })
    return {
        getRoles,
        getRole,
        postRole,
        putRole,
        deleteRole
    }
}