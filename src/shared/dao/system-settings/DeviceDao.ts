import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const deviceDao = () => {
    const getDevices = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<Device[]>> => {
        const res = await fetch<DaoBE<Device[]>>(urlParams(`/devices`, { ...restParams }), { signal })
        return transformBeToFe<Device[]>(res)
    }

    const getDevice = async (id: string) => {
        const { data } = await fetch<DeviceDao>(urlParams(`/devices/${id}`))
        return data
    }

    const postDevice = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<DeviceDao>(urlParams(`/devices/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putDevice = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<DeviceDao>(urlParams(`/devices/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteDevice = async (id: string) => {
        const { data } = await fetch<DeviceDao>(urlParams(`/devices/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getDevices,
        getDevice,
        postDevice,
        putDevice,
        deleteDevice
    }
}