import { urlParams } from "../../utils/url-params";
import { transformBeToFe } from "../../utils/transformer";

export const sprintsDao = () => {
    const getSprintsByProject = async ({ projectId, signal, ...restParams }: { projectId: string } & ApiParams): Promise<SprintDao> => {
        const res = await fetch<DaoBE<Sprint[]>>(urlParams(`/sprints/${projectId}`, { ...restParams }), { signal })
        return transformBeToFe<Sprint[]>(res)
    }

    const getSprint = async (id: string): Promise<{ data: Sprint }> => {
        return await fetch<{ data: Sprint }>(urlParams(`/sprints/${id}`))
    }

    const postSprint = async (payload: SprintPayload) => {
        const { data } = await fetch<SprintDao>(urlParams(`/sprints`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putSprint = async (payload: { name: string; id: string; developments: Development[] }) => {
        const { data } = await fetch<SprintDao>(urlParams(`/sprints/${payload.id}/development`), { method: 'PUT', body: JSON.stringify(payload) })
        return data
    }

    const deleteDevelopment = async (id: string) => {
        const { data } = await fetch<SprintDao>(urlParams(`/sprints/development/${id}`), { method: 'DELETE' })
        return data
    }

    const deleteSprint = async (id: string) => {
        const { data } = await fetch<SprintDao>(urlParams(`/sprints/${id}`), { method: 'DELETE' })
        return data
    }

    return {
        getSprintsByProject,
        getSprint,
        postSprint,
        putSprint,
        deleteDevelopment,
        deleteSprint
    }
}