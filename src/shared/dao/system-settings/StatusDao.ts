import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const statusDao = () => {
    const getStatuses = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<Status[]>> => {
        const res = await fetch<DaoBE<Status[]>>(urlParams(`/statuses`, { ...restParams }), { signal })
        return transformBeToFe<Status[]>(res)
    }

    const getStatus = async (id: string) => {
        const { data } = await fetch<StatusDao>(urlParams(`/statuses/${id}`))
        return data
    }

    const postStatus = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<StatusDao>(urlParams(`/statuses/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putStatus = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<StatusDao>(urlParams(`/statuses/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteStatus = async (id: string) => {
        const { data } = await fetch<StatusDao>(urlParams(`/statuses/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getStatuses,
        getStatus,
        postStatus,
        putStatus,
        deleteStatus
    }
}