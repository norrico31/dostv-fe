import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { MultiValue } from 'react-select'
import { ButtonAction, DatePicker, DeleteModal, Loading, MultiSelect, Table } from '../../shared/components'
import { projectsDao, projectTypesDao, userDao } from '../../shared/dao'
import { firstLetterCapitalize } from '../../shared/utils/firstLetterCapitalize'
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification'
import { useProjectOutletCtx } from './ProjectModules'
import { BASE_URL } from '../../shared/config'
import { MdAdd } from 'react-icons/md'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { FaAngleLeft } from 'react-icons/fa'
import { DateType } from 'react-tailwindcss-datepicker'
import { formatDate } from '../../shared/utils/dateFormat'

const { getProject, postProject, editProject, createTask, updateTask, deleteTask } = projectsDao()
const { getProjectTypes } = projectTypesDao()
const { getUsers, } = userDao()

export default function ProjectForm() {
    // const { data, getProjectById } = useProjectOutletCtx() ?? {}
    const { projectId } = useParams()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { setInfo } = useToastNotificationCtx()
    const [project, setProject] = useState<Project | undefined>(undefined)

    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined)
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

    const [openModalProject, setOpenModalProject] = useState(false)
    const [openModalProjectDelete, setOpenModalProjectDelete] = useState(false)
    const [openModalTask, setOpenModalTask] = useState(false)
    const [openModalTaskDelete, setOpenModalTaskDelete] = useState(false)



    useEffect(() => {
        getData()
    }, [projectId])
    console.log(project)

    async function getData() {
        setLoading(true)
        try {
            const res = await getProject(Number(projectId))
            const data = await res.json()
            setProject(data)
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        // setLoading(true)
        try {
            const payload = {
            }
            const res = !projectId ? postProject(payload) : putProject({ ...payload, id: projectId });
            await res
            setInfo({
                status: projectId ? 'warning' : 'success',
                message: `${projectId ? 'Update' : 'Create'} Project Successfully`
            })

            if (projectId) return
            setTimeout(() => navigate('/projects'), 300)
        } catch (error: unknown) {
            const { message } = error as ApiError
            return error
        } finally {
            // getProjectById(projectId!)
            // setLoading(false)
        }
    }

    // async function removeSegment(id: number) {
    //     await deleteSegment(id).finally(getData).finally(closeModal)
    // }

    async function deleteTaskInProject(id: number) {
        await deleteTask(id)
    }
    const closeModal = () => {
        setSelectedProject(undefined)
        setSelectedTask(undefined)
        setOpenModalTask(false)
        setOpenModalTaskDelete(false)
        setOpenModalProjectDelete(false)
        setOpenModalProject(false)
    }

    return (
        <div className={projectId ? '' : 'md:container mx-auto'}>
            <Link to='/projects' className='inline-flex border-2 p-2 rounded-md border-gray-200 gap-1 items-center'><FaAngleLeft size={18} className='text-gray-500' /> Back to projects</Link>
            <hr className='my-5' />
            <div className="mt-p-3 sm:mt-0 text-left">
                <div className="flex justify-between items-center align-middle">
                    <h2 className="text-xl font-bold">Project - {project?.name}</h2>
                    <button className="btn create inline-flex items-center" onClick={() => setOpenModalTask(true)}>
                        Create Task
                        <MdAdd size={24} />
                    </button>
                </div>
                <hr className='my-5' />
                <Table>
                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                        <tr className='text-center'>
                            <th scope="col" className="px-6 py-3">
                                Progress
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date Started
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Deadline
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Segment
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Users
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : ![project]?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : [project].map((d) => <tr className="dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900" key={d.id}>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.progress}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {formatDate(d?.dateStarted as unknown as Date) ?? 'NA'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {formatDate(d?.dateDeadline as unknown as Date) ?? 'NA'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.segment?.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.status.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.users?.map((u: User) => <div key={u.id}>{`${u.firstName} ${u.lastName}`}</div>)}
                            </td>
                            <td className={`px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white `}>
                                <p className={`p-3 text-center uppercase font-semibold rounded-lg`}>
                                    {d?.description ?? 'NA'}
                                </p>
                            </td>

                            <ButtonAction
                                editData={() => {
                                    setSelectedProject(d)
                                    setOpenModalProject(true)
                                }}
                                deleteData={() => {
                                    setSelectedProject(d)
                                    setOpenModalProjectDelete(true)
                                }}
                            />
                        </tr>)}

                    </tbody>
                </Table>
                <hr className='my-5' />
                <Table>
                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                        <tr className='text-center'>
                            <th scope="col" className="px-6 py-3">
                                Task
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Priority
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !project?.tasks?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : project.tasks?.map((d) => <tr className="dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900" key={d.id}>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.priority.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.user.firstName ?? 'NA'}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.description ?? 'NA'}
                            </td>
                            <ButtonAction
                                editData={() => {
                                    setSelectedTask(d)
                                    setOpenModalTask(true)
                                }}
                                deleteData={() => {
                                    setSelectedTask(d)
                                    setOpenModalTaskDelete(true)
                                }}
                            />
                        </tr>)}

                    </tbody>
                </Table>
            </div>
            <ModalCreateTask
                getData={getData}
                onClose={closeModal}
                open={openModalTask}
                selectedData={selectedTask}
                projectId={Number(project?.id)}
            />
            <ModalEditProject
                getData={getData}
                onClose={closeModal}
                open={openModalProject}
                selectedData={selectedProject}
            />
            <DeleteModal<Task>
                isOpen={openModalTaskDelete}
                onClose={closeModal}
                selectedItem={selectedTask}
                deleteItem={deleteTaskInProject!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this task?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedTask?.name})</p>
            </DeleteModal>
        </div >
    )
}

type TaskModalProps = {
    open: boolean;
    onClose: () => void;
    selectedData?: Task;
    projectId: number
    getData(args?: ApiParams): Promise<unknown>
}

type ProjectModalProps = {
    open: boolean;
    onClose: () => void;
    selectedData?: Project;
    getData(args?: ApiParams): Promise<unknown>
}

const initFieldState = {
    name: '',
    description: '',
    projectId: null,
    userId: null,
    priorityId: null
}

function SelectUsers({ value, onChange }: { value: MultiValue<OptionType>; onChange: (v: MultiValue<OptionType>) => void; }) {
    const [users, setUsers] = useState<Project[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/users`, { signal: controller.signal })
                const data = await res.json()
                setUsers(data.data ?? [])
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    const filteredList = (users ?? [])?.map((itm) => ({ label: itm?.name, value: itm.id })) as MultiValue<OptionType>
    return <>
        <div className='relative'>
            <label htmlFor="userIds" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
                Users:
            </label>
            <MultiSelect
                id="userIds"
                options={[...filteredList]}
                selected={value}
                setSelected={onChange}
                placeholder='Select developers'
            />
        </div>
    </>
}

function SelectUser({ value, onChange }: any) {
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/users`)
                const { data } = await res.json()
                setUsers(data)
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    return <div className='relative'>
        <label htmlFor="user_id" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
            User:
        </label>
        <select
            id="userId"
            name='userId'
            value={value ?? ''}
            onChange={onChange}
            className="disabled:cursor-not-allowed shadow-md bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light"
        >
            {!value && <option value="" disabled hidden>Select user</option>}
            {users.map((d) => {
                const firstLetterCap = firstLetterCapitalize(d.firstName)
                return <option value={d.id} key={d.id}>{firstLetterCap}</option>
            })}
        </select>
    </div>
}

function SelectPriority({ value, onChange }: any) {
    const [priorities, setPriorities] = useState<Priority[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/priorities`)
                const { data } = await res.json()
                setPriorities(data)
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    return <div className='relative'>
        <label htmlFor="priorityId" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
            Priority:
        </label>
        <select
            id="priorityId"
            name='priorityId'
            value={value ?? ''}
            onChange={onChange}
            className="disabled:cursor-not-allowed shadow-md bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light"
        >
            {!value && <option value="" disabled hidden>Select priority</option>}
            {priorities.map((d) => {
                const firstLetterCap = firstLetterCapitalize(d.name)
                return <option value={d.id} key={d.id}>{firstLetterCap}</option>
            })}
        </select>
    </div>
}

function SelectStatuses({ value, onChange }: any) {
    const [statuses, setStatuses] = useState<Status[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/statuses`)
                const { data } = await res.json()
                setStatuses(data)
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    return <div className='relative'>
        <label htmlFor="priorityId" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
            Status:
        </label>
        <select
            id="priorityId"
            name='priorityId'
            value={value ?? ''}
            onChange={onChange}
            className="disabled:cursor-not-allowed shadow-md bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light"
        >
            {!value && <option value="" disabled hidden>Select status</option>}
            {statuses.map((d) => {
                const firstLetterCap = firstLetterCapitalize(d.name)
                return <option value={d.id} key={d.id}>{firstLetterCap}</option>
            })}
        </select>
    </div>
}

function SelectSegments({ value, onChange }: any) {
    const [segments, setSegments] = useState<Segment[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/segments`)
                const { data } = await res.json()
                setSegments(data)
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    return <div className='relative'>
        <label htmlFor="priorityId" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
            Segment:
        </label>
        <select
            id="priorityId"
            name='priorityId'
            value={value ?? ''}
            onChange={onChange}
            className="disabled:cursor-not-allowed shadow-md bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light"
        >
            {!value && <option value="" disabled hidden>Select segment</option>}
            {segments.map((d) => {
                const firstLetterCap = firstLetterCapitalize(d.name)
                return <option value={d.id} key={d.id}>{firstLetterCap}</option>
            })}
        </select>
    </div>
}

function ModalCreateTask({ open, onClose, selectedData, getData, projectId }: TaskModalProps) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<typeof initFieldState>(initFieldState)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields({ ...selectedData });
            console.log(selectedData.projects)
        }
        return () => selectedData && setFields(initFieldState)
    }, [open, selectedData])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const taskId = selectedData?.id ? selectedData.id : ''

        try {
            const payload = { ...fields, priorityId: Number(fields?.priorityId), userId: Number(fields?.userId), projectId: Number(projectId) }
            const res = taskId === '' ? createTask(payload) : updateTask({ ...payload, id: Number(selectedData?.id) })
            await res
            setInfo({
                status: taskId ? 'warning' : 'success',
                message: `${taskId ? 'Update' : 'Create'} Task Successfully`
            })
            setTimeout(() => {
                onClose()
                setFields(initFieldState)
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
                            Task - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className='p-3 mt-3 border-2 border-solid border-gray-200 rounded-md relative'>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">Task:</label>
                                        <input type="text" id="name" name='name' value={fields?.name ?? ''} onChange={e => setFields({ ...fields, name: e.target.value })} required className={`shadow-md h-[40px] bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light`} placeholder="Enter task name" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 mb-2">
                                    <SelectUser value={fields?.userId} onChange={e => setFields({ ...fields, userId: e.target.value })} />
                                    <SelectPriority value={fields?.priorityId} onChange={e => setFields({ ...fields, priorityId: e.target.value })} />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Description:</label>
                                    <textarea
                                        id="description"
                                        name='description'
                                        value={fields?.description ?? ''}
                                        onChange={e => setFields({ ...fields, description: e.target.value })}
                                        className="bg-gray-50 border h-[150px] border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter description" />
                                </div>
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

function ModalEditProject({ open, onClose, selectedData, getData }: ProjectModalProps) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<typeof initFieldState>(initFieldState)
    const [loading, setLoading] = useState(false)
    const [selectedUserIds, setSelectedUserIds] = useState<{ value: number; label: string }[]>([])
    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields({
                id: selectedData?.id,
                name: selectedData?.name,
                description: selectedData?.description,
                progress: selectedData?.progress,
                url: selectedData?.url,
                statusId: selectedData?.statusId,
                segmentId: selectedData?.segmentId,
                dateStarted: new Date(selectedData?.dateStarted),
                dateDeadline: new Date(selectedData?.dateDeadline),
                userIds: selectedUserIds?.map(p => p.value),
            });
            setSelectedUserIds(selectedData.users?.map((p) => ({ value: p.id, label: p.firstName })) ?? [])
            console.log(selectedData.projects)
        }
        return () => selectedData && setFields(initFieldState)
    }, [open, selectedData])
    console.log('fields: ', fields)
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                id: selectedData?.id,
                name: fields?.name,
                description: fields?.description,
                progress: parseFloat(fields?.progress),
                url: fields?.url,
                statusId: Number(fields?.statusId),
                segmentId: Number(fields?.segmentId),
                dateStarted: formatDate(fields?.dateStarted),
                dateDeadline: formatDate(fields?.dateDeadline),
                userIds: selectedUserIds?.map(p => p.value),
            }
            const res = editProject(payload)
            await res
            setInfo({
                status: 'success',
                message: ' Update Project Successfully'
            })
            setTimeout(() => {
                onClose()
                setFields(initFieldState)
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
                            Project - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className='p-3 mt-3 border-2 border-solid border-gray-200 rounded-md relative'>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">Project Name:</label>
                                        <input type="text" id="name" name='name' value={fields?.name ?? ''} onChange={e => setFields({ ...fields, name: e.target.value })} required className={`shadow-md h-[40px] bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light`} placeholder="Enter project name" />
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <label htmlFor="progress" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">Progress:</label>
                                        <input type="text" id="progress" name='progress' value={fields?.progress ?? ''} onChange={e => setFields({ ...fields, progress: e.target.value })} required className={`shadow-md h-[40px] bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light`} placeholder="Enter progress" />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <SelectStatuses value={fields.statusId} onChange={e => setFields({ ...fields, statusId: e.target.value })} />
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <SelectSegments value={fields.segmentId} onChange={e => setFields({ ...fields, segmentId: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="relativew-full mb-5 group">
                                        <div>
                                            <label htmlFor="date_fixed" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Date Started:</label>
                                            <DatePicker
                                                value={new Date(fields?.dateStarted) as DateType}
                                                onChange={v => setFields({ ...fields, dateStarted: v })}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative w-full mb-5 group">
                                        <div>
                                            <label htmlFor="date_fixed" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Date Deadline:</label>
                                            <DatePicker
                                                value={new Date(fields?.dateDeadline) as DateType}
                                                onChange={v => setFields({ ...fields, dateDeadline: v })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 mb-2">
                                    <SelectUsers value={selectedUserIds as unknown as MultiValue<OptionType>} onChange={v => setSelectedUserIds(v as { value: number; label: string }[])} />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="url" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">URL:</label>
                                    <input type="text" id="url" name='url' value={fields?.url ?? ''} onChange={e => setFields({ ...fields, url: e.target.value })} className={`shadow-md h-[40px] bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light`} placeholder="Enter progress" />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Description:</label>
                                    <textarea
                                        id="description"
                                        name='description'
                                        value={fields?.description ?? ''}
                                        onChange={e => setFields({ ...fields, description: e.target.value })}
                                        className="bg-gray-50 border h-[150px] border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter description" />
                                </div>
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
