import { BASE_URL } from "../../config";

export const statusDao = () => {
    const getStatuses = ({ signal }: ApiParams) => fetch(`${BASE_URL}/statuses`, { signal })

    const getStatus = (id: string) => fetch(`${BASE_URL}/statuses/${id}`)

    const postStatus = (payload: { name: string; description: string }) => {

        console.log('poststatus')
        return fetch(`${BASE_URL}/statuses`, { method: 'POST', body: JSON.stringify(payload) })
    }

    const putStatus = ({ id, ...restPayload }: { id: string; name: string; description: string }) => fetch(`${BASE_URL}/statuses/${id}`, { method: 'PUT', body: JSON.stringify(restPayload) })

    const deleteStatus = (id: string) => fetch(`${BASE_URL}/statuses/` + id, { method: 'DELETE' })

    return {
        getStatuses,
        getStatus,
        postStatus,
        putStatus,
        deleteStatus
    }
}