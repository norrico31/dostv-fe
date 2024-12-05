import { useState, useEffect } from 'react'
import { MdAdd } from 'react-icons/md';
import { ButtonAction, DeleteModal, InputSearch, Loading, Pagination, Table } from '../../shared/components';
import { severityTypesDao } from '../../shared/dao/system-settings/SeverityTypeDao';
import { useSearchDebounce } from '../../shared/hooks/useSearchDebounce';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification';

const { getSeverityTypes, postSeverityType, putSeverityType, deleteSeverityType } = severityTypesDao()

const initInputState = { name: '', description: '' }

type Props = {
    open: boolean;
    onClose: () => void;
    selectedData?: SeverityType;
    getData(args?: ApiParams): Promise<unknown>
}

function Modal({ open, onClose, selectedData, getData }: Props) {
    const [inputs, setInputs] = useState(initInputState)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setInputs({ name: selectedData.name, description: selectedData.description, })
        }
        return () => selectedData && setInputs(initInputState)
    }, [open, selectedData])

    const { setInfo } = useToastNotificationCtx()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const id = selectedData ? selectedData.id : ''
        try {
            const res = id ? putSeverityType({ id, ...inputs }) : postSeverityType(inputs)
            await res
            setInfo({
                status: id ? 'warning' : 'success',
                message: `${id ? 'Update' : 'Create'} SeverityType Successfully`
            })
            setTimeout(onClose, 300)
        } catch (error) {
            return error
        } finally {
            getData()
            setLoading(false)
        }
    }

    return <Dialog className="relative z-10" open={open} onClose={onClose}>
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
        <div className="fixed inset-0 z-10 w-screen">
            <div className="flex min-h-full items-center justify-center text-center sm:items-center px-2">
                <DialogPanel
                    transition
                    className="relative p-5 overflow-y-auto transform overflow-x-auto rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="mt-3 p-3 sm:mt-0 text-left">
                        <DialogTitle as="h2" className="text-2xl font-bold leading-6 text-gray-700 dark:text-white">
                            Severity type - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form className="max-w-md mx-auto" onSubmit={onSubmit}>
                            <div className="relative z-0 w-full mb-5 group">
                                <input autoFocus value={inputs.name} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="name" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input value={inputs.description} onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })} type="text" name="description" id="description" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="description" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                            </div>
                            <div className="sm:flex sm:flex-row-reverse gap-2 sm:text-right text-center">
                                <button
                                    type="submit"
                                    className={`btn ${selectedData ? 'primary' : 'create'}`}
                                    disabled={loading}
                                >
                                    {selectedData ? 'Update' : 'Submit'}
                                </button>
                                <button
                                    disabled={loading}
                                    type="button"
                                    className="btn cancel"
                                    onClick={onClose}
                                    data-autofocus
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
}

const initState: DaoFE<SeverityType[]> = {
    data: [],
    page: 1,
    lastPage: 1,
    totalItems: 0
}

export default function SeverityTypes() {
    const [loading, setLoading] = useState(true)
    const [{ data, ...pageProps }, setData] = useState<DaoFE<SeverityType[]>>(initState)
    const [search, inputValue, onChange] = useSearchDebounce()
    const [openModal, setOpenModal] = useState(false)
    const [selectedData, setSelectedData] = useState<SeverityType | undefined>(undefined)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    useEffect(() => {
        const controller = new AbortController();
        let flag = false;
        !flag && getData({ signal: controller.signal, search })
        return function () {
            controller.abort()
            flag = true
        }
    }, [search])

    async function getData(args?: ApiParams) {
        setLoading(true)
        try {
            const res = await getSeverityTypes({ signal: args?.signal, search: args?.search, page: args?.page });
            setData(res)
        } catch (error) {
            console.log('error: ', error)
            return error
        } finally {
            setLoading(false)
        }
    }

    function onEditHandler(selectedData: SeverityType) {
        setSelectedData(selectedData)
        setOpenModal(true)
    }

    function onDeleteHandler(selectedData: SeverityType) {
        setSelectedData(selectedData)
        setOpenDeleteModal(true)
    }

    async function deleteData(id: string) {
        await deleteSeverityType(id).finally(getData).finally(closeModal)
    }

    function closeModal() {
        setTimeout(() => setSelectedData(undefined), 300)
        setOpenModal(false)
        setOpenDeleteModal(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2 flex-wrap">
                <h2 className="heading-2 mb-1">Severity Types</h2>
                <div className="flex gap-2 flex-wrap">
                    <InputSearch value={inputValue} onChange={onChange} />
                    <button className="btn create inline-flex items-center" onClick={() => setOpenModal(true)}>
                        Create
                        <MdAdd size={24} />
                    </button>
                </div>
            </div>
            <div>
                <Table>
                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !data.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : (data ?? []).map((d) => (
                            <tr className="white dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900" key={d.id}>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.name}
                                </td>
                                <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.description}
                                </td>
                                <ButtonAction key={d.id} editData={() => onEditHandler(d)} deleteData={() => onDeleteHandler(d)} />
                            </tr>
                        ))
                        }
                    </tbody>
                </Table>
                <Pagination
                    {...pageProps}
                    onNextClick={() => getData({ page: +pageProps?.page + 1, search })}
                    onPrevClick={() => getData({ page: +pageProps?.page - 1, search })}
                />
            </div>
            <Modal
                open={openModal}
                selectedData={selectedData}
                onClose={closeModal}
                getData={getData}
            />

            <DeleteModal<SeverityType>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedData!}
                deleteItem={deleteData!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this item?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedData?.name})</p>
            </DeleteModal>
        </div>
    )
}