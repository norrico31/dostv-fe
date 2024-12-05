import { BASE_URL } from "../../config";

type Payload = {
    name: string
    description: string
    projectIds: number[]
} & Partial<{ id: number }>

export const segmentDao = () => {
    const getSegments = async ({ signal, ...restParams }: ApiParams) => fetch(`${BASE_URL}/segments`, { ...restParams, signal })

    const getSegment = async (id: number) => fetch(`${BASE_URL}/segments/${id}`)

    const postSegment = async (payload: Payload) => fetch(`${BASE_URL}/segments`, { body: JSON.stringify(payload) })

    const putSegment = async (payload: Payload) => fetch(`${BASE_URL}/segments/${payload.id}`, { body: JSON.stringify(payload), method: 'PUT' })

    const deleteSegment = async (id: number) => fetch(`${BASE_URL}/segments/${id}`, { method: 'DELETE' })

    return {
        getSegments,
        getSegment,
        postSegment,
        putSegment,
        deleteSegment
    }
}