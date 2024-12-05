import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const scheduleDao = () => {
    const getSchedules = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<Schedule[]>> => {
        const res = await fetch<DaoBE<Schedule[]>>(urlParams(`/schedules`, { ...restParams }), { signal })
        return transformBeToFe<Schedule[]>(res)
    }

    const getSchedule = async (id: string) => {
        const { data } = await fetch<ScheduleDao>(urlParams(`/schedules/${id}`))
        return data
    }

    const postSchedule = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<ScheduleDao>(urlParams(`/schedules/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putSchedule = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<ScheduleDao>(urlParams(`/schedules/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteSchedule = async (id: string) => {
        const { data } = await fetch<ScheduleDao>(urlParams(`/schedules/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getSchedules,
        getSchedule,
        postSchedule,
        putSchedule,
        deleteSchedule
    }
}