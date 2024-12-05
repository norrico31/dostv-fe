import { ReactNode } from 'react'
import { useToastNotificationCtx } from '../contexts/ToastNotification'
import { FaRegTrashAlt } from "react-icons/fa";

type Props = {
    status?: 'success' | 'danger' | 'warning'
    message: string
    onClose: () => void
}
const obj: Record<string, ({ message, onClose }: { message: string; onClose: () => void }) => ReactNode> = {
    'success': ({ message, onClose }: { message: string; onClose: () => void }) => <div id="toast-success" className="flex items-center w-full shadow-xl max-w-xs p-4 text-green-700 bg-green-100 rounded-lg dark:text-white dark:bg-green-800" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
        </div>
        {/* <div className="mx-3 text-md font-normal">Create status successfully</div> */}
        <div className="mx-3 text-md font-normal">{message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-1.5 -my-1.5 bg-green-200 text-green-700 hover:text-green-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-green-300 inline-flex items-center justify-center h-8 w-8 dark:text-gray-100 dark:hover:text-white dark:bg-green-700 dark:hover:bg-green-600" data-dismiss-target="#toast-success" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>,
    'danger': ({ message, onClose }: { message: string; onClose: () => void }) => <div id="toast-danger" className="flex items-center w-full shadow-xl max-w-xs p-4 text-red-700 bg-red-100 rounded-lg dark:text-white dark:bg-red-800" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            {/* <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg> */}
            <FaRegTrashAlt size={24} />
            <span className="sr-only">Close icon</span>
        </div>
        {/* <div className="mx-3 text-md font-normal">Delete status successfully</div> */}
        <div className="mx-3 text-md font-normal">{message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-1.5 -my-1.5 bg-red-200 text-red-500 hover:text-red-900 rounded-lg focus:ring-2 focus:ring-red-300 p-1.5 hover:bg-red-300 inline-flex items-center justify-center h-8 w-8 dark:text-red-500 dark:hover:text-white dark:bg-red-900 dark:hover:bg-red-600" data-dismiss-target="#toast-success" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>,
    'warning': ({ message, onClose }: { message: string; onClose: () => void }) => <div id="toast-warning" className="flex items-center w-full shadow-xl max-w-xs p-4 text-orange-900 bg-orange-100 rounded-lg" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-10 h-8 text-orange-900 bg-orange-100 rounded-lg ">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <span className="sr-only">Warning icon</span>
        </div>
        {/* <div className="mx-3 text-md font-normal">Update status successfully</div> */}
        <div className="mx-3 text-md font-normal">{message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-1.5 -my-1.5 bg-orange-200 text-orange-900 hover:text-orange-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-orange-300 inline-flex items-center justify-center h-8 w-8  dark:hover:text-white dark:hover:bg-orange-700" data-dismiss-target="#toast-success" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>,
}

const Toast = ({ status, message, onClose }: Props) => obj[status!]?.({ message, onClose })

export default function ToastNotification() {
    const { info, setInfo } = useToastNotificationCtx() ?? {}

    return (
        <div className={`${info?.status ? 'absolute' : 'hidden'} top-20 right-10 z-50`}>
            <Toast status={info?.status} message={info?.message ?? ''} onClose={() => setInfo(undefined)} />
        </div>
    )
}