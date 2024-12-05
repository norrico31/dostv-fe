import { useState, useContext, createContext, ReactNode } from 'react';



const UserContext = createContext<{ user?: UserLogin, setUser: React.Dispatch<React.SetStateAction<UserLogin | undefined>> }>({ user: undefined, setUser: () => null })

export const useUserContext = () => useContext(UserContext)

export default function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserLogin | undefined>(() => {
        const data = localStorage.getItem("data")
        return data != null ? JSON.parse(data) : undefined
    })

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}