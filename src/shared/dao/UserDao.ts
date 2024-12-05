import { BASE_URL } from "../config";

export const userDao = () => {
    const loginUser = (user: { email: string; password: string }) => fetch(`${BASE_URL}/login`, { method: 'POST', body: JSON.stringify(user) })

    const getUsers = ({ signal, ...restparams }: ApiParams) => fetch(`${BASE_URL}/users`, { ...restparams, signal })

    const getMe = (id: number, signal: AbortSignal) => fetch(`${BASE_URL}/users/` + id, { signal })

    const postUser = (payload: User) => fetch(`${BASE_URL}/users`, { body: JSON.stringify(payload), method: 'POST' })

    const putUser = ({ id, ...restPayload }: User) => fetch(`${BASE_URL}/users/` + id, { body: JSON.stringify(restPayload), method: "PUT" })

    const deleteUser = (id: string) => fetch(`${BASE_URL}/users/` + id, { method: "DELETE" })

    return {
        loginUser,
        getUsers,
        getMe,
        postUser,
        putUser,
        deleteUser,
    }
}