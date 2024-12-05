import { useState, useContext, createContext, ReactNode } from 'react'

const ThemeCtx = createContext<{
    theme: boolean;
    toggleTheme: () => void

}>({
    theme: false,
    toggleTheme: () => null,
})

export const useThemeCtx = () => useContext(ThemeCtx)

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState(() => {
        const darkModeFromStorage = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!) : false
        if (darkModeFromStorage) document.body.classList.add("dark");
        else document.body.classList.remove("dark");
        return darkModeFromStorage
    })
    function toggleTheme() {
        document.body.classList.toggle("dark");
        const toggleTheme = !theme
        setTheme(toggleTheme)
        localStorage.setItem('theme', JSON.stringify(toggleTheme))
    }
    return <ThemeCtx.Provider value={{ theme, toggleTheme }}>{children}</ThemeCtx.Provider>
}