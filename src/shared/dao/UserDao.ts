import { BASE_URL } from "../config";
import { transformBeToFe } from "../utils/transformer";
import { urlParams } from "../utils/url-params";

export const userDao = () => {
    const loginUser = async (user: { email: string; password: string }): Promise<{ token: string }> => {
        return await fetch<{ token: string }>(urlParams(`/users/login`), { method: 'POST', body: JSON.stringify(user) })
    }

    const getUsers = async ({ signal, ...restparams }: ApiParams): Promise<DaoFE<User[]>> => {
        const res = await fetch<DaoBE<User[]>>(urlParams(`/users`, { ...restparams }), { signal })
        return transformBeToFe<User[]>(res)
    }
    // TODO
    const getMe = async (id: number, signal: AbortSignal): Promise<User> => fetch(`${BASE_URL}/user/${id}`, { signal })

    const postUser = async (payload: User) => {
        const { data } = await fetch<UserDao>(urlParams(`/users/`), { method: 'POST', body: JSON.stringify(payload) })
        return data
    }

    const putUser = async ({ id, ...restPayload }: User) => {
        const { data } = await fetch<UserDao>(urlParams(`/users/` + id), { method: 'PUT', body: JSON.stringify(restPayload) })
        return data
    }

    const deleteUser = async (id: string) => {
        const { data } = await fetch<UserDao>(urlParams(`/users/` + id), { method: 'DELETE' })
        return data
    }

    return {
        loginUser,
        getUsers,
        getMe,
        postUser,
        putUser,
        deleteUser,
    }
}