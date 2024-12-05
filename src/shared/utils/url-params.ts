
const APP_URL = import.meta.env.VITE_APP_URL
const APP_VERSION = import.meta.env.VITE_APP_VERSION

export function urlParams(path: string, params?: Record<string, string | number | boolean>) {
    const ENDPOINT = APP_URL + APP_VERSION + path
    const baseUrl = new URL(ENDPOINT)
    params && Object.entries(params).forEach(([k, v]) => {
        k != undefined && v != undefined && baseUrl.searchParams.append(k, v + '')
    })
    return baseUrl.toString()
}
