import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const severityTypesDao = () => {
    const getSeverityTypes = async ({ signal, ...resParams }: ApiParams): Promise<DaoFE<SeverityType[]>> => {
        const res = await fetch<DaoBE<SeverityType[]>>(urlParams(`/severity-types`, { ...resParams }), { signal })
        return transformBeToFe<SeverityType[]>(res)
    }

    const getSeverityType = async (id: string) => {
        const { data } = await fetch<SeverityTypeDao>(urlParams(`/severity-types/${id}`))
        return data
    }

    const postSeverityType = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<SeverityTypeDao>(urlParams(`/severity-types/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putSeverityType = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<SeverityTypeDao>(urlParams(`/severity-types/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteSeverityType = async (id: string) => {
        const { data } = await fetch<SeverityTypeDao>(urlParams(`/severity-types/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getSeverityTypes,
        getSeverityType,
        postSeverityType,
        putSeverityType,
        deleteSeverityType
    }
}