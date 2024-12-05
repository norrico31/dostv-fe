import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const issueTypesDao = () => {
    const getIssueTypes = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<IssueType[]>> => {
        const res = await fetch<DaoBE<IssueType[]>>(urlParams(`/issue-types`, { ...restParams }), { signal })
        return transformBeToFe<IssueType[]>(res)
    }

    const getIssueType = async (id: string) => {
        const { data } = await fetch<IssueTypeDao>(urlParams(`/issue-types/${id}`))
        return data
    }

    const postIssueType = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<IssueTypeDao>(urlParams(`/issue-types/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putIssueType = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<IssueTypeDao>(urlParams(`/issue-types/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteIssueType = async (id: string) => {
        const { data } = await fetch<IssueTypeDao>(urlParams(`/issue-types/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getIssueTypes,
        getIssueType,
        postIssueType,
        putIssueType,
        deleteIssueType
    }
}