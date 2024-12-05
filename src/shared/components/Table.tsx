import { PropsWithChildren } from 'react'

export default function Table({ children }: PropsWithChildren<unknown>) {
    return (
        <div className="overflow-x-auto rounded-md ">
            <table className="text-md w-full text-left text-gray-700 dark:text-gray-100 table-auto border border-gray-200 dark:border-gray-700">
                {children}
            </table>
        </div>
    )
}
