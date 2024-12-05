import { useState } from "react"
import { userDao } from "../shared/dao/UserDao"
import { useUserCtx } from "../shared/contexts/UserData"
import { Navigate } from "react-router-dom"
import { Loading } from "../shared/components"

const { loginUser } = userDao()

const initUserState = { email: '', password: '', error: '' }

export default function Login() {
    const { token, setToken } = useUserCtx()
    const [user, setUser] = useState(initUserState)
    const [loading, setLoading] = useState(false)

    // if (token) return <Navigate to='/' />

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!user.email || !user.password) return alert('invalid credentials')
            const { token } = await loginUser(user)
            localStorage.setItem('token', JSON.stringify(token))
            setToken(token)
            setUser(initUserState)
        } catch (error) {
            const { message, } = error as ApiError
            setUser({ ...user, error: message! })
            return message
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex h-[80svh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    {/* <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    /> */}
                    <h1 className="heading-1">Brand Logo</h1>
                    <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-800">
                        Sign In
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {loading ? <Loading /> : user.error && <p className="text-danger-400 text-center">{user.error}</p>}
                    <form className="space-y-6" action="#" method="POST" onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-md font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-md font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })}
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                        <div className="text-md text-right">
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
