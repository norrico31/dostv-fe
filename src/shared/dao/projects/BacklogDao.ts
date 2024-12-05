import { urlParams } from "../../utils/url-params";
import { transformBeToFe } from "../../utils/transformer";

export const backlogsDao = () => {
    const getBacklogsByProject = async ({ projectId, signal, ...restParams }: { projectId: string } & ApiParams): Promise<BacklogDao> => {
        const { status_counts, severity_status, ...res } = await fetch<DaoBE<Backlog[]> & { severity_status: SeverityStatusCount; status_counts: StatusCount }>(urlParams(`/backlogs/${projectId}/project`, { ...restParams }), { signal })
        return { ...transformBeToFe<Backlog[]>(res), severity_status, status_counts }
    }

    const getBacklog = async (id: string): Promise<{ data: Backlog }> => {
        return await fetch<{ data: Backlog }>(urlParams(`/backlogs/${id}`))
    }

    const postBacklog = async (payload: BacklogPayload & { projectId: string }) => {
        const backlogs = {
            backlogs: [payload]
        }
        const { data } = await fetch<BacklogDao>(urlParams(`/backlogs/${payload.projectId}`), { method: 'POST', body: JSON.stringify(backlogs) })
        return data
    }

    const putBacklog = async (payload: BacklogPayload & { projectId: string }) => {
        const { data } = await fetch<BacklogDao>(urlParams(`/backlogs/${payload.projectId}/project/${payload.id}`), { method: 'PUT', body: JSON.stringify(payload) })
        return data
    }

    const deleteBacklog = async (id: string) => {
        const { data } = await fetch<BacklogDao>(urlParams(`/backlogs/${id}`), { method: 'DELETE' })
        return data
    }

    return {
        getBacklogsByProject,
        getBacklog,
        postBacklog,
        putBacklog,
        deleteBacklog
    }
}