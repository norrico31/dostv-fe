import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from "react-router-dom";

export const useSearchDebounce = () => {
    const [searchParams, setSearchParams] = useSearchParams({ search: '' })
    const search = searchParams.get('search')
    const [query, setQuery] = useState(search);
    const flag = useRef(false)

    useEffect(() => {
        if (search === query && !flag.current) return
        flag.current = true;
        const timeout = setTimeout(() => {
            setQuery(searchParams.get('search'))
        }, 500)
        return () => clearTimeout(timeout)
    }, [searchParams])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchParams(prev => {
            if (query === prev.get('search')) prev
            prev.set('search', query)
            return prev
        })
    }
    return [query!, searchParams.get('search') as string, onChange] as const
}
