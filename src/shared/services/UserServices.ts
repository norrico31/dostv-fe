import { useState, useEffect } from 'react'
import { userDao } from '../dao'

const { getUsers } = userDao()

export const useUserServices = () => {
    const [data, setData] = useState<User[]>([])

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const res = await getUsers({ signal: controller.signal })
            setData(res.data ?? [])
        })()

        return () => {
            controller.abort()
        }
    }, [])

    const users: Record<string, User> = data.reduce((users: Record<string, User>, user) => {
        users[user.id! as unknown as string] = user
        return users
    }, {})
    return [users] as const
}