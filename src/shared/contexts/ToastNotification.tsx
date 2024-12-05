import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

type State = {
    status: 'success' | 'warning' | 'danger'
    message: string
} | undefined

const ToastNotificationCtx = createContext<{ info: State; setInfo: React.Dispatch<React.SetStateAction<State>> }>({
    info: undefined,
    setInfo: () => null
})

export const useToastNotificationCtx = () => useContext(ToastNotificationCtx)

export default function ToastNotificationProvider({ children }: { children: ReactNode }) {
    const [info, setInfo] = useState<State>(undefined)

    useEffect(() => {
        const timeout = setTimeout(() => setInfo(undefined), 5000)
        return () => clearTimeout(timeout)
    }, [info])

    return <ToastNotificationCtx.Provider value={{ info, setInfo }}>{children}</ToastNotificationCtx.Provider>
}