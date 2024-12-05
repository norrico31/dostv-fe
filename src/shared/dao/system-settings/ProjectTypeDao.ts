import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const projectTypesDao = () => {
    const getProjectTypes = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<ProjectType[]>> => {
        const res = await fetch<DaoBE<ProjectType[]>>(urlParams(`/project-types`, { ...restParams }), { signal })
        return transformBeToFe<ProjectType[]>(res)
    }

    const getProjectType = async (id: string) => {
        const { data } = await fetch<ProjectTypeDao>(urlParams(`/project-types/${id}`))
        return data
    }

    const postProjectType = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<ProjectTypeDao>(urlParams(`/project-types/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putProjectType = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<ProjectTypeDao>(urlParams(`/project-types/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteProjectType = async (id: string) => {
        const { data } = await fetch<ProjectTypeDao>(urlParams(`/project-types/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getProjectTypes,
        getProjectType,
        postProjectType,
        putProjectType,
        deleteProjectType
    }
}