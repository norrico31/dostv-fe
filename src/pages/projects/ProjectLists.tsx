import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { MdAdd } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { projectsDao } from '../../shared/dao/ProjectDao';
import { DatePicker, Loading, MultiSelect } from '../../shared/components';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { MultiValue } from 'react-select';
import { BASE_URL } from '../../shared/config';
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification';
import { firstLetterCapitalize } from '../../shared/utils/firstLetterCapitalize';
import { formatDate } from '../../shared/utils/dateFormat';

const { getProjects: getProjectsDao, postProject } = projectsDao()

function ProjectItem({ id, name, description }: Project) {
    return (
        <Link
            to={`/projects/${id}/details`}
            className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 max-w-full"
        >
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-700 dark:text-gray-100">{name}</h5>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{description}</p>
            <div className='flex justify-between bottom-0'>
                <p className="inline-flex font-medium items-center text-blue-600 hover:underline gap-2">
                    View
                    <IoMdEye size={18} aria-hidden="true" />
                </p>
            </div>
        </Link>
    )
}

function ButtonCreate() {
    const navigate = useNavigate()
    return <button className="btn create inline-flex items-center" onClick={() => navigate('/create')}>
        Create
        <MdAdd size={24} />
    </button>
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
    const filteredList = (users ?? [])?.map((itm) => ({ label: itm?.firstName, value: itm.id })) as MultiValue<OptionType>
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
type ProjectModalProps = {
    open: boolean;
    onClose: () => void;
    getData(args?: ApiParams): Promise<unknown>
}
const initFieldState = {
    name: '',
    description: '',
    projectId: null,
    userId: null,
    priorityId: null
}

function ModalEditProject({ open, onClose, getData }: ProjectModalProps) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<typeof initFieldState>(initFieldState)
    const [loading, setLoading] = useState(false)
    const [selectedUserIds, setSelectedUserIds] = useState<{ value: number; label: string }[]>([])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {

            const payload = {
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
            console.log("ahahahahsd")
            await postProject(payload)
            setInfo({
                status: 'success',
                message: 'Create Project Successfully'
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
                            Project - Create
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
                                <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                            </div>
                        </form>

                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
}


export default function Projects() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Project[]>([])
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        const controller = new AbortController();
        getProjects({ signal: controller.signal })
        return function () {
            controller.abort()
        }
    }, [])

    async function getProjects(args: ApiParams) {
        setLoading(true)
        try {
            const res = await getProjectsDao({ signal: args?.signal })
            const { data } = await res.json()
            setData(data)
        } catch (error: unknown) {
            const { message } = error as ApiError
            return message
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="md:container mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="heading-1 my-3">Projects</h1>
                <button className="btn create inline-flex items-center" onClick={() => setOpenModal(true)}>
                    Create
                    <MdAdd size={24} />
                </button>
            </div>
            <hr className='my-5' />
            <div className='grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pr-2'>
                {data.map(proj => <ProjectItem {...proj} key={proj.id} />)}
            </div>
            <ModalEditProject open={openModal} onClose={() => setOpenModal(false)} getData={getProjects} />
        </div>
    )
}