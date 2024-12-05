import { transformBeToFe } from "../../utils/transformer";
import { urlParams } from "../../utils/url-params";

export const roleDao = () => {
    const getRoles = async ({ signal, ...restParams }: ApiParams): Promise<DaoFE<Role[]>> => {
        const res = await fetch<DaoBE<Role[]>>(urlParams(`/roles`, { ...restParams }), { signal })
        return transformBeToFe<Role[]>(res)
    }

    const getRole = async (id: string) => {
        const { data } = await fetch<RoleDao>(urlParams(`/roles/${id}`))
        return data
    }

    const postRole = async (payload: { name: string; description: string }) => {
        const { data } = await fetch<RoleDao>(urlParams(`/roles/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putRole = async ({ id, ...restPayload }: { id: string; name: string; description: string }) => {
        const { data } = await fetch<RoleDao>(urlParams(`/roles/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteRole = async (id: string) => {
        const { data } = await fetch<RoleDao>(urlParams(`/roles/` + id), { method: 'DELETE' })
        return data
    }

    return {
        getRoles,
        getRole,
        postRole,
        putRole,
        deleteRole
    }
}