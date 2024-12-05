import { Outlet } from 'react-router-dom'
import Header from './Header';

export default function Layout() {
    return (
        <section className="bg-white/5 dark:bg-gray-900 dark:text-white min-h-screen">
            <main>
                <Header />
                <div className='rounded-md p-5'>
                    <Outlet />
                </div>
            </main>
        </section>
    )
}
