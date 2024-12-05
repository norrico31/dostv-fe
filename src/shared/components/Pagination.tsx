type Props = {
    totalItems: number;
    page: number;
    lastPage: number;
    onPrevClick: () => void
    onNextClick: () => void
}

export default function Pagination({ totalItems, page, lastPage, onPrevClick, onNextClick }: Props) {
    return (
        <>
            <div className='flex justify-center items-center mt-5'>
                {/* <button className="btn danger inline-flex items-center gap-1">
                    Delete Selected
                    <CiTrash size={24} />
                </button> */}
                <nav className="flex items-center flex-col md:flex-row text-center flex-wrap gap-2" aria-label="Table navigation">
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 md:mb-0 block w-full md:inline md:w-auto">Total items: <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span></span>
                    {totalItems >= 10 ? (
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-lg h-8">
                            <li>
                                <button onClick={onPrevClick} disabled={page <= 1} className="flex items-center disabled:hover:cursor-not-allowed disabled:bg-gray-200 justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</button>
                            </li>
                            <li>
                                <p aria-current="page" className="flex font-bold items-center justify-center px-3 h-8 leading-tight border border-gray-300 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">{page}</p>
                            </li>
                            <li>
                                <button onClick={onNextClick} disabled={page >= lastPage} className="flex items-center disabled:hover:cursor-not-allowed disabled:bg-gray-200 justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</button>
                            </li>
                        </ul>
                    ) : null}
                </nav>
            </div>
        </>
    )
}
