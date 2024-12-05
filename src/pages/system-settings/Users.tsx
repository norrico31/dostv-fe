import { useState, useEffect } from 'react'
import { MdAdd, MdClear } from 'react-icons/md';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ButtonAction, DeleteModal, InputSearch, Loading, Pagination, Table } from '../../shared/components';
import { userDao, roleDao } from '../../shared/dao';
import { useSearchDebounce } from '../../shared/hooks/useSearchDebounce';
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification';

const { getUsers, postUser, putUser, deleteUser } = userDao()
const { getRoles } = roleDao()

const initInputState: User = { firstName: '', lastName: '', role: '', roleId: '', middle_name: '', age: '', email: '', password: '' }

type Props = {
    open: boolean;
    onClose: () => void;
    selectedData?: User;
    getData(args?: ApiParams): Promise<User[]>
}

function SelectRole({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Role[]>([])

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        (async () => {
            const res = await getRoles({ signal: controller.signal, all: true }).finally(() => setLoading(false))
            const data = await res.json()
            setData(data?.data ?? [])
        })();
        return () => {
            controller.abort()
        }
    }, []);

    return <>
        <select
            name="floating_role"
            id='floating_role'
            value={value}
            disabled={loading}
            required
            onChange={(e) => onChange(e.target.value)}
            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200 dark:text-gray-200"
        >
            {!value && <option value="" disabled hidden></option>}
            {(data || []).map((d) => (
                <option value={d.id} key={d.id}>{d.name}</option>
            ))}
        </select>
        <label
            htmlFor="floating_role"
            className={`absolute text-lg text-gray-500 focus:text-text-md dark:text-gray-400 duration-300 transform scale-75 top-3 -z-10 origin-[0] ${value ? '-translate-y-6' : 'translate-y-0 scale-100'
                }`}
        >
            Select role
        </label>
        {value != '' && (
            <MdClear
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => onChange('')}
            />
        )}
    </>
}

function SelectStatus({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return <>
        <select
            name="floating_role"
            id='floating_role'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200 dark:text-gray-200"
        >
            {value == '' && <option value="" disabled hidden></option>}
            <option value={'ACTIVE'}>Active</option>
            <option value={'INACTIVE'} >Inactive</option>
        </select>
        <label
            htmlFor="floating_role"
            className={`absolute text-lg text-gray-500 focus:text-text-md dark:text-gray-400 duration-300 transform scale-75 top-3 -z-10 origin-[0] ${value !== '' ? '-translate-y-6' : 'translate-y-0 scale-100'
                }`}
        >
            Select status
        </label>
        {value != '' && (
            <MdClear
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => onChange('')}
            />
        )}
    </>
}

function Modal({ open, onClose, selectedData, getData }: Props) {
    const [fields, setFields] = useState(initInputState)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields({ ...selectedData, password: '' })
        }
        return () => selectedData && setFields(initInputState)
    }, [open, selectedData])

    const { setInfo } = useToastNotificationCtx()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const id = selectedData ? selectedData.id : ''
        try {
            const res = id ? putUser({ ...fields, age: Number(fields?.age) }) : postUser({ ...fields, age: Number(fields?.age) })
            await res
            setInfo({
                status: id ? 'warning' : 'success',
                message: `${id ? 'Update' : 'Create'} User Successfully`
            })
            setTimeout(() => {
                onClose()
                setFields(initInputState)
            }, 300)
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
                    className="relative p-5 overflow-y-auto transform overflow-x-auto rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full sm:w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="mt-3 p-3 sm:mt-0 text-left">
                        <DialogTitle as="h2" className="text-2xl font-bold leading-6 text-gray-700 dark:text-white">
                            User - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form className="max-w-full mx-auto" onSubmit={onSubmit}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative  w-full mb-5 group">
                                    <input value={fields.email} onChange={(e) => setFields({ ...fields, [e.target.name]: e.target.value })} type="email" name="email" id="email" className="bg-transparent block py-2.5 px-0 w-full text-md text-gray-900 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label htmlFor="email" className="peer-focus:font-medium absolute text-md  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                                </div>
                                <div className="relative  w-full mb-5 group">
                                    <SelectRole value={fields.roleId} onChange={(v) => setFields({ ...fields, roleId: v })} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative  w-full mb-5 group">
                                    <input type="text" value={fields.firstName} onChange={e => setFields({ ...fields, firstName: e.target.value })} name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                                </div>
                                <div className="relative  w-full mb-5 group">
                                    <input type="text" name="floating_last_name" value={fields.lastName} onChange={e => setFields({ ...fields, lastName: e.target.value })} id="floating_last_name" className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="age"
                                        id="age"
                                        value={fields.age}
                                        onChange={(e) => setFields({ ...fields, [e.target.name]: e.target.value })}
                                        className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                                    />
                                    <label htmlFor="age" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Age</label>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                {/* <div className="relative z-0 w-full mb-5 group">
                                    <SelectStatus value={fields.statusId} onChange={(v) => setFields({ ...fields, status: v })} />
                                </div> */}
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="password"
                                    name="password"
                                    value={fields.password}
                                    disabled={!!selectedData}
                                    onChange={(e) => setFields({ ...fields, [e.target.name]: e.target.value })}
                                    id="password"
                                    className={`${selectedData ? 'cursor-not-allowed' : ''} block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`} placeholder=" " required={!selectedData} />
                                <label htmlFor="password" className="peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
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

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<User[]>([])
    const [search, inputValue, onChange] = useSearchDebounce()
    const [openModal, setOpenModal] = useState(false)
    const [selectedData, setSelectedData] = useState<User | undefined>(undefined)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    useEffect(() => {
        const controller = new AbortController();
        let flag = false;
        if (!flag) getData({ signal: controller.signal, search })
        return function () {
            controller.abort()
            flag = true
        }
    }, [search])

    async function getData(args?: ApiParams) {
        setLoading(true)
        try {
            const res = await getUsers({ signal: args?.signal, search: args?.search, page: args?.page });
            const data = await res.json()
            setData(data.data ?? [])
        } catch (error) {
            console.log('error: ', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    function onEditHandler(selectedData: User) {
        setSelectedData(selectedData)
        setOpenModal(true)
    }

    function onDeleteHandler(selectedData: User) {
        setSelectedData(selectedData)
        setOpenDeleteModal(true)
    }

    async function deleteData(id: string) {
        await deleteUser(id).finally(getData).finally(closeModal)
    }

    function closeModal() {
        setTimeout(() => setSelectedData(undefined), 300)
        setOpenModal(false)
        setOpenDeleteModal(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2 flex-wrap">
                <h2 className="heading-2 mb-1">Users</h2>
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
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !data?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : (data ?? []).map((d) => (
                            <tr className="white dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900" key={d.id}>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.firstName + ' ' + d.lastName}
                                </td>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.email}
                                </td>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d?.role?.name}
                                </td>
                                <ButtonAction key={d.id} editData={() => onEditHandler(d)} deleteData={() => onDeleteHandler(d)} />
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* <Pagination
                    {...pageProps}
                    onNextClick={() => getData({ page: +pageProps?.page + 1, search })}
                    onPrevClick={() => getData({ page: +pageProps?.page - 1, search })}
                /> */}
            </div>
            <Modal
                open={openModal}
                selectedData={selectedData}
                onClose={closeModal}
                getData={getData}
            />

            <DeleteModal<User>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedData!}
                deleteItem={deleteData!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this item?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedData?.firstName + ' ' + selectedData?.lastName})</p>
            </DeleteModal>
        </div>
    )
}