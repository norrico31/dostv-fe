import { urlParams } from "../../utils/url-params";
import { transformBeToFe } from "../../utils/transformer";

export const reportsDao = () => {
    const getReports = async ({ signal, projectId, ...restParams }: ApiParams & { projectId: string }): Promise<ReportsDao> => {
        const res = await fetch<DaoBE<Reports[]>>(urlParams(`/reports/${projectId}`, { ...restParams }), { signal, method: 'GET' })
        return transformBeToFe<Reports[]>(res)
    }

    const getReport = async (id: string): Promise<{ data: Report }> => {
        return await fetch<{ data: Report }>(urlParams(`/reports/${id}`))
    }

    const postReport = async (payload: { reports: Reports[] }) => {
        const { data } = await fetch<ReportsDao>(urlParams(`/reports`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putReport = async (payload: { report: Reports; report_id: string }) => {
        const { data } = await fetch<ReportsDao>(urlParams(`/reports/${payload.report_id}`), { method: 'PUT', body: JSON.stringify(payload) })
        return data
    }

    const deleteReport = async (id: string) => {
        const { data } = await fetch<ReportsDao>(urlParams(`/reports/${id}`), { method: 'DELETE' })
        return data
    }

    return {
        getReports,
        getReport,
        postReport,
        putReport,
        deleteReport
    }
}