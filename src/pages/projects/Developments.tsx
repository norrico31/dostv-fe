
import { useState, useEffect, Fragment, memo, useCallback } from 'react'
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ButtonAction, DatePicker, Loading, MultiSelect, Table, DeleteModal } from '../../shared/components'
import { MdAdd } from 'react-icons/md'
import { useSearchDebounce } from '../../shared/hooks/useSearchDebounce'
import { useProjectOutletCtx } from './ProjectModules'
import { sprintsDao, statusDao, userDao } from '../../shared/dao'
import { formatDate } from '../../shared/utils/dateFormat'
import { useUserServices } from '../../shared/services/UserServices'
import { firstLetterCapitalize } from '../../shared/utils/firstLetterCapitalize';
import { MultiValue } from 'react-select';
import { DateType } from 'react-tailwindcss-datepicker';
import { CiTrash } from 'react-icons/ci';

const { getSprintsByProject, postSprint, putSprint, deleteDevelopment, deleteSprint } = sprintsDao()
const { getUsers, } = userDao()
const { getStatuses } = statusDao()

type Props = {
    projectId: string
    open: boolean;
    onClose: () => void;
    selectedData?: Sprint & { development_id: string };
    getData(args?: ApiParams): Promise<unknown>
}

const initTaskRow: Development[] = [
    {
        id: new Date().getTime().toString(), // bug is in id of this
        name: '',
        user_id: [] as MultiValue<SelectMultiValues>,
        start_date: '',
        finish_date: '',
        deadline: '',
        duration: 0,
        status_id: '',
        sprint_id: '',
    }
]

const initFieldState = {
    name: '',
    developments: initTaskRow,
}

function SelectStatus({ list, value, onChange }: { list: Status[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    return <>
        <label htmlFor="status_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Status:</label>
        <select id="status_id" name='status_id' value={value ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
            {!value && <option value="" disabled hidden>Select status</option>}
            {(list || []).map((d) => (
                <option value={d.id} key={d.id}>{d.name}</option>
            ))}
        </select>
    </>
}

const Task = memo(function ({ users, list, task, handleChange, removeTaskRow, firstItemHide }: { firstItemHide: boolean; users: User[]; list: Status[]; task: typeof initTaskRow[0]; handleChange: (task: (typeof initTaskRow)[0]) => void; removeTaskRow: (id: string) => void }) {
    function handleTaskChange(updatedTask: Partial<typeof initTaskRow[0]>) {
        handleChange({ ...task, ...updatedTask })
    }
    return <div>
        <div className="grid gap-4 md:grid-cols-2 mb-2">
            <div>
                <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Task name:</label>
                <input id="name" name='name' type='text' value={task.name as string} onChange={e => handleTaskChange({ name: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter task name" required />
            </div>
            <div className='flex justify-end align-bottom items-end'>
                {!firstItemHide && (
                    <button className="btn danger inline-flex items-end gap-1" onClick={() => removeTaskRow(task.id!)}>
                        Remove task
                        <CiTrash size={24} />
                    </button>
                )}
            </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative">
            <SelectUsers
                key={task.id}
                value={task.user_id}
                users={users}
                onChange={(v: MultiValue<OptionType>) => handleTaskChange({ user_id: v })}
            />
            <div>
                <label htmlFor="start_date" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Start Date:</label>
                <DatePicker
                    value={task.start_date as DateType}
                    onChange={v => handleTaskChange({ start_date: v })}
                    isDisabledPreviousDates={true}
                />
            </div>
            <div>
                <label htmlFor="finish_date" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Finish Date:</label>
                <DatePicker
                    value={task.finish_date as DateType}
                    onChange={v => handleTaskChange({ finish_date: v })}
                    isDisabledPreviousDates={true}
                />
            </div>
            <div className="mb-2">
                <label htmlFor="deadline" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Deadline:</label>
                <DatePicker
                    value={task.deadline as DateType}
                    onChange={v => handleTaskChange({ deadline: v })}
                    isDisabledPreviousDates={true}
                />
            </div>
            <div className="mb-2">
                <label htmlFor="duration" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Duration:</label>
                <input id="duration" name='duration' type='number' value={task.duration}
                    onChange={e => handleTaskChange({ duration: Number(e.target.value) })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter duration" />
            </div>
            <div>
                <SelectStatus
                    list={list}
                    value={task.status_id as string}
                    onChange={e => handleTaskChange({ status_id: e.target.value })}
                />
            </div>
        </div>
        <hr className='my-3' />
    </div>
})

function Modal({ open, onClose, projectId, selectedData, getData }: Props) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<Sprint>(initFieldState)
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<Status[]>([])
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields({ name: selectedData.name, developments: selectedData.developments });
        }
        return () => selectedData && setFields(initFieldState)
    }, [open, selectedData])

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data: status } = await getStatuses({ signal: controller.signal, all: true })
            const { data: users } = await getUsers({ signal: controller.signal, all: true })
            setUsers(users ?? [])
            setList(status ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])

    const addTaskRow = useCallback(() => {
        setFields(prevFields => ({ ...prevFields, developments: [...prevFields.developments, { ...initTaskRow[0], id: new Date().getTime().toString(), }] }))
    }, [])

    const handleDevelopmentChange = useCallback((development: typeof initTaskRow[0]) => {
        if (!development) return;
        setFields(prevFields => ({ ...prevFields, developments: prevFields.developments?.map((prev) => prev.id === development.id ? development : prev) }))
    }, [])

    const removeTaskRow = useCallback((taskId: string) => {
        setFields(prevFields => ({ ...prevFields, developments: prevFields.developments?.filter((prev) => prev.id !== taskId) }))
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const sprintId = selectedData?.id ? selectedData.id : ''
        const payload: SprintPayload = {
            project_id: projectId,
            sprints: [{
                ...fields!,
            }]
        }
        try {
            const res = sprintId === '' ? postSprint(payload) : putSprint({ id: sprintId, name: payload.sprints[0].name, developments: payload.sprints[0].developments })
            await res
            setInfo({
                status: sprintId ? 'warning' : 'success',
                message: `${sprintId ? 'Update' : 'Create'} Backlog Successfully`
            })
            setTimeout(() => {
                onClose()
                setFields({ ...initFieldState })
            }, 300)
        } catch (error) {
            return error
        } finally {
            await getData()
            setLoading(false)
        }
    }

    return <Dialog className="relative z-5" open={open} onClose={onClose}>
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
        <div className="fixed inset-0 z-10 w-screen">
            <div className="flex min-h-full items-center justify-center text-center sm:items-center px-2">
                <DialogPanel
                    transition
                    className="relative p-5 max-h-[90vh] overflow-y-auto transform overflow-x-auto rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full md:max-w-6xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="mt-3 p-3 sm:mt-0 text-left">
                        <DialogTitle as="h2" className="text-2xl font-bold leading-6 text-gray-700 dark:text-white">
                            Sprint - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className="mb-2">
                                <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Sprint Name:</label>
                                <input required id="name" name='name' type='text' value={fields.name as string} onChange={e => setFields({ ...fields, [e.target.name]: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter sprint name" />
                            </div>
                            <div className='p-3 mt-3 border-2 border-solid border-gray-200 rounded-md relative'>
                                {fields.developments?.map((task) => <Task key={task.id} task={task} handleChange={handleDevelopmentChange} list={list} users={users} removeTaskRow={removeTaskRow} firstItemHide={fields.developments.length <= 1} />)}
                                <button
                                    type='button'
                                    className="text-gray-800 border-2 border-gray-200 bg-transparent hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900" onClick={addTaskRow}>Add Task</button>
                            </div>
                            <hr className='my-4' />
                            <div className='text-right'>
                                <button
                                    disabled={loading}
                                    type="button"
                                    className="btn cancel mr-2"
                                    onClick={onClose}
                                    data-autofocus
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{selectedData?.id ? 'Update' : 'Submit'}</button>
                            </div>
                        </form>

                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
}

function SelectUsers({ users, value, onChange }: { users: User[]; value: MultiValue<OptionType>; onChange: (v: MultiValue<OptionType>) => void; }) {
    const filteredList = users.map((itm) => ({ label: firstLetterCapitalize(itm.first_name)!, value: itm.id })) as MultiValue<OptionType>
    return <>
        <div className='relative'>
            <label htmlFor="user_id" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
                Task Owner:
            </label>
            <MultiSelect
                id="user_id"
                options={[...filteredList]}
                selected={value}
                setSelected={onChange}
                placeholder='Select developers'
            />
        </div>
    </>
}

const initState: SprintDao = {
    data: [],
    page: 1,
    lastPage: 1,
    totalItems: 0,
}

export default function Developments() {
    const { data: project } = useProjectOutletCtx()
    const [{ data, ...pageProps }, setData] = useState<SprintDao>(initState)
    const [loading, setLoading] = useState(true)
    const [search, inputValue, onChange] = useSearchDebounce()
    const [selectedData, setSelectedData] = useState<Sprint & { development_id: string } | undefined>(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openDeleteSprint, setOpenDeleteSprint] = useState(false)
    const [selectedDevelopment, setSelectedDevelopment] = useState<Development | undefined>(undefined)
    const [selectedSprint, setSelectedSprint] = useState<Sprint | undefined>(undefined)

    useEffect(() => {
        const controller = new AbortController();
        project !== undefined && getData({ signal: controller.signal, ...(search ? { search } : {}), })
        return () => {
            controller.abort()
        }
    }, [project, search])

    async function getData(args?: ApiParams) {
        setLoading(true)
        try {
            const res = await getSprintsByProject({ projectId: project.id!, signal: args?.signal, search: args?.search, page: args?.page })
            setData(res ?? initState)
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    async function removeDevelopment(id: string) {
        await deleteDevelopment(id).finally(getData).finally(closeModal)
    }

    async function removeSprint(id: string) {
        await deleteSprint(id).finally(getData).finally(closeModal)
    }

    function renderRows(users: Record<string, User>) {
        return data.map((d) => {
            const developments = d.developments
            return <Fragment key={d.id}>
                <tr className="white dark:bg-gray-900 bg-gray-100/50 hover:bg-gray-100/50 dark:hover:bg-gray-900/50">
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">
                        {d?.name ?? '-'}
                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold underline">

                    </td>
                    {/* TODO */}
                    <ButtonAction
                        editData={() => {
                            setSelectedData(d)
                            setOpenModal(true)
                        }}
                        deleteData={() => {
                            setSelectedSprint(d)
                            setOpenDeleteSprint(true)
                        }}
                    />
                </tr>
                {developments.map((dev) => {
                    const userIds = dev.user_id as unknown as { label: string; value: string }[]
                    const names: string[] = []
                    if (userIds.length > 0) {
                        userIds.forEach((user) => {
                            names.push(users[user.value]?.first_name ?? userIds)
                        })
                    }
                    return (
                        <tr key={dev.id} className="white dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900">
                            <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white text-center">
                                {dev?.name ?? '-'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {names.length > 0 ? names.join(' / ') : ''}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {formatDate(dev?.start_date as unknown as Date) ?? '-'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {formatDate(dev?.finish_date as unknown as Date) ?? '-'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {dev?.deadline ?? '-'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {dev?.duration ?? '-'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {dev.status?.name ?? '-'}
                            </td>
                            <ButtonAction
                                // editData={() => {
                                //     setSelectedData({ ...d, development_id: dev.id! })
                                //     setOpenModal(true)
                                // }}
                                deleteData={() => {
                                    setSelectedDevelopment(dev)
                                    setOpenDeleteModal(true)
                                }}
                            />
                        </tr>
                    )
                })}
            </Fragment>
        })

    }
    function closeModal() {
        setOpenModal(false)
        setOpenDeleteModal(false)
        setSelectedData(undefined)
        setSelectedDevelopment(undefined)
        setOpenDeleteSprint(false)
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-2 flex-wrap'>
                <div className='flex items-center gap-3'>
                    <h2 className="heading-2 pb-2 sm:pb-0">Developments</h2>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    {/* <InputSearch value={inputValue} onChange={onChange} /> */}
                    <div>
                        <button className="btn create inline-flex items-center" onClick={() => setOpenModal(true)}>
                            Create
                            <MdAdd size={24} />
                        </button>
                    </div>
                </div>
            </div>
            <hr className='mb-5' />
            <Table>
                <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Sprints
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Task Owner
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Start Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Finish Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Deadline
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Duration
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Task Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <TableBody loading={loading} data={data} renderRows={renderRows} />
            </Table>
            <Modal
                getData={getData}
                onClose={closeModal}
                open={openModal}
                projectId={project?.id as unknown as string}
                selectedData={selectedData}
            />
            <DeleteModal<Development>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedDevelopment!}
                deleteItem={removeDevelopment!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this task?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedDevelopment?.name})</p>
            </DeleteModal>
            <DeleteModal<Sprint>
                isOpen={openDeleteSprint}
                onClose={closeModal}
                selectedItem={selectedSprint!}
                deleteItem={removeSprint!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this task?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedSprint?.name})</p>
            </DeleteModal>
        </div>
    )
}

function TableBody({ loading, data, renderRows }: { loading: boolean; data: Sprint[]; renderRows(users: Record<string, User>): JSX.Element[] }) {
    const [users] = useUserServices()
    return <tbody>
        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !data?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : renderRows(users)}
    </tbody>
}