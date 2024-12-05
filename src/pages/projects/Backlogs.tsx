import { useEffect, useState } from 'react'
import { useProjectOutletCtx } from './ProjectModules'
import { DateType } from 'react-tailwindcss-datepicker'
import { MdAdd } from 'react-icons/md'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useSearchDebounce } from '../../shared/hooks/useSearchDebounce'
import { ButtonAction, InputSearch, Loading, Pagination, Table, DatePicker, DeleteModal, Popover } from '../../shared/components'
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification'
import { formatDate } from '../../shared/utils/dateFormat'
import { deviceDao, issueTypesDao, projectsDao, severityTypesDao, statusDao, userDao, backlogsDao } from '../../shared/dao'

const { getBacklogsByProject, postBacklog, putBacklog, deleteBacklog } = backlogsDao()
const { getProjects } = projectsDao()
const { getStatuses, } = statusDao()
const { getSeverityTypes, } = severityTypesDao()
const { getIssueTypes, } = issueTypesDao()
const { getUsers, } = userDao()
const { getDevices, } = deviceDao()

type Props = {
    projectId: string
    open: boolean;
    onClose: () => void;
    selectedData?: Backlog;
    getData(args?: ApiParams): Promise<unknown>
}

const initFormState: BacklogPayload = {
    completed_by_id: '',
    date_fixed: '',
    device_id: '',
    expected_outcome: '',
    fixed_by_id: '',
    issue_type_id: '',
    issues: '',
    notes: '',
    project_id: '',
    qa_reference_id: '',
    screenshots: '',
    severity_type_id: '',
    status_id: '',
    url: '',
    id: undefined,
}

function Modal({ open, onClose, projectId, selectedData, getData }: Props) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState({ ...initFormState, project_id: projectId })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        if (selectedData) setFields({ ...selectedData, project_id: projectId })
        return () => selectedData && setFields({ ...initFormState, project_id: projectId })
    }, [open, selectedData, projectId])
    console.log(fields)
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const value = e.target.value
        const name = e.target.name
        setFields({
            ...fields,
            [name]: value
        })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const backlogId = selectedData?.id ? selectedData.id : ''
        try {
            const res = backlogId === '' ? postBacklog({ ...fields, projectId }) : putBacklog({ ...fields, id: backlogId, projectId })
            await res
            setInfo({
                status: backlogId ? 'warning' : 'success',
                message: `${backlogId ? 'Update' : 'Create'} Backlog Successfully`
            })
            setTimeout(onClose, 300)
            setFields({ ...initFormState, project_id: projectId })
        } catch (error) {
            return error
        } finally {
            await getData()
            setLoading(false)
        }
    }

    return <Dialog className="relative z-10" open={open} onClose={onClose}>
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
        <div className="fixed inset-0 z-10 w-screen">
            <div className="flex min-h-full items-center justify-center text-center sm:items-center px-2">
                <DialogPanel
                    transition
                    className="relative p-5 max-h-[90vh] overflow-y-auto transform overflow-x-auto rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full md:max-w-6xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div className="mt-3 p-3 sm:mt-0 text-left">
                        <DialogTitle as="h2" className="text-2xl font-bold leading-6 text-gray-700 dark:text-white">
                            Backlog - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <SelectProject value={projectId as string} onChange={handleChange} />
                                </div>
                                <div>
                                    <SelectSeverityType value={fields.severity_type_id as string} onChange={handleChange} />
                                </div>
                                <div>
                                    <SelectStatus value={fields.status_id as string} onChange={handleChange} />
                                </div>
                                <div>
                                    <SelectIssueType value={fields.issue_type_id as string} onChange={handleChange} />
                                </div>
                                <SelectQaFixedBy qaVal={fields.qa_reference_id as string} fixedVal={fields.fixed_by_id as string} completedVal={fields.completed_by_id as string} onChange={handleChange} />
                                <div>
                                    <label htmlFor="date_fixed" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Date Fixed:</label>
                                    <DatePicker
                                        value={fields.date_fixed as DateType}
                                        onChange={v => setFields({ ...fields, date_fixed: v })}
                                    />
                                </div>
                                <div>
                                    <SelectBrowserDevice value={fields.device_id as string} onChange={handleChange} />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="url" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">URL:</label>
                                    <input id="url" name='url' type='text' value={fields.url as string} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter url" required />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="screenshots" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Screenshots:</label>
                                    <input id="screenshots" name='screenshots' type='text' value={fields.screenshots as string} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter screenshots" />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="expected_outcome" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Expected Outcome:</label>
                                    <input id="expected_outcome" name='expected_outcome' type='text' value={fields.expected_outcome as string} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter expected outcome" />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="issues" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Bugs / Issues</label>
                                <textarea id="issues" name='issues' value={fields.issues as string} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter bugs / issues" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="notes" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Notes</label>
                                <textarea id="notes" name='notes' value={fields.notes as string} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter notes" />
                            </div>
                            <hr className='my-4' />
                            <div className='text-right'>
                                <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{selectedData?.id ? 'Update' : 'Submit'}</button>
                            </div>
                        </form>

                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
}


const initState: BacklogDao = {
    data: [],
    page: 1,
    lastPage: 1,
    totalItems: 0,
    severity_status: {},
    status_counts: {}
}

export default function Backlogs() {
    const { data: project } = useProjectOutletCtx()
    const [loading, setLoading] = useState(true)
    const [{ data, severity_status, status_counts, ...pageProps }, setData] = useState<BacklogDao>(initState)
    const [search, inputValue, onChange] = useSearchDebounce()
    const [selectedData, setSelectedData] = useState<Backlog | undefined>(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    useEffect(() => {
        const controller = new AbortController();
        project && getData({ signal: controller.signal, ...(search ? { search } : {}), })
        return () => {
            controller.abort()
        }
    }, [project, search])

    async function getData(args?: ApiParams) {
        setLoading(true)
        try {
            const res = await getBacklogsByProject({ projectId: project.id!, signal: args?.signal, search: args?.search, page: args?.page })
            setData(res ?? initState)
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    async function deleteData(id: string) {
        await deleteBacklog(id).finally(getData).finally(closeModal)
    }

    function closeModal() {
        setOpenModal(false)
        setOpenDeleteModal(false)
        setSelectedData(undefined)
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-2 flex-wrap'>
                <div className='flex items-center gap-3'>
                    <h2 className="heading-2 pb-2 sm:pb-0">Backlogs</h2>
                    <div className="flex items-center justify-center">
                        <Popover content={
                            <div className={`flex shadow-md gap-2 dark:`}>
                                <Table>
                                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100 ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Severity
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {Object.entries(severity_status ?? {}).map(([k, v], idx) => (
                                            <tr key={idx} className='hover:bg-gray-50 dark:hover:bg-gray-800 '>
                                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold">
                                                    {k}
                                                </td>
                                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                                    {v}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Table>
                                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-center">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 ">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {Object.entries(status_counts ?? {}).map(([k, v], idx) => {
                                            if (!v || v === 0) return
                                            return (
                                                <tr key={idx} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                                                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white font-bold">
                                                        {k}
                                                    </td>
                                                    <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                                        {v}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        }>
                            Statuses
                        </Popover>
                    </div>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <InputSearch value={inputValue} onChange={onChange} />
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
                            Type of Issue
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Severity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            QA / Reference
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date Added
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Fixed By
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Completed By
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date Fixed
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Browser / Device
                        </th>
                        <th scope="col" className="px-6 py-3">
                            URL
                        </th>
                        <th scope="col" className="px-6 py-3" colSpan={2}>
                            Bugs/ Issues
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Expected Outcome
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Screenshots
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Notes
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !data.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : data.map((d) => <tr className="dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900" key={d.id}>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.issue_type ?? 'NA'}
                        </td>
                        <td className={`px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white `}>
                            <p className={`p-3 text-center uppercase font-semibold ${severityBgColor(d?.severity_type?.toLowerCase())} rounded-lg`}>
                                {d?.severity_type ?? 'NA'}
                            </p>
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.status ?? 'NA'}
                        </td>
                        <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.QAReference ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {formatDate(d?.date_added as unknown as Date)}
                        </td>
                        <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.FixedBy ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.CompletedBy ?? 'NA'}
                        </td>
                        <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {formatDate(d?.date_fixed as Date) ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.device ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.url ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white" colSpan={2}>
                            {d?.issues ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.expected_outcome ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                            {d?.screenshots ?? 'NA'}
                        </td>
                        <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white white whitespace-break-spaces">
                            {d?.notes ?? 'NA'}
                        </td>
                        <ButtonAction
                            editData={() => {
                                setSelectedData(d)
                                setOpenModal(true)
                            }}
                            deleteData={() => {
                                setSelectedData(d)
                                setOpenDeleteModal(true)
                            }}
                        />
                    </tr>)}
                </tbody>
            </Table>
            <Pagination
                {...pageProps}
                onNextClick={() => getData({ page: +pageProps?.page + 1, search })}
                onPrevClick={() => getData({ page: +pageProps?.page - 1, search })}
            />
            <Modal projectId={project?.id ?? ''} open={openModal} selectedData={selectedData} onClose={closeModal} getData={getData} />
            <DeleteModal<Backlog>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedData!}
                deleteItem={deleteData!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this item?</p>
                {/* <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedData?.name})</p> */}
            </DeleteModal>
        </div>
    )
}

function severityBgColor(status?: string) {
    if (!status) return ''
    const colors: Record<string, string> = {
        low: 'bg-yellow-300 text-gray-900 dark:bg-yellow-200 dark:text-gray-900',
        medium: 'bg-orange-800 text-white dark:bg-orange-600',
        high: 'bg-red-500 text-white dark:bg-red-500',
        critical: 'bg-red-700 text-white dark:bg-red-700',
    }
    return colors[status]
}

function SelectProject({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<Project[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getProjects({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
    return <>
        <label htmlFor="project_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Project:</label>
        <select disabled id="project_id" name='project_id' value={value} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
            {!value && <option value="" disabled hidden>Select project</option>}
            {(list || []).map((d) => (
                <option value={d.id} key={d.id}>{d.account_name}</option>
            ))}
        </select>
    </>
}

export function SelectStatus({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<Status[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getStatuses({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
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

function SelectSeverityType({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<SeverityType[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getSeverityTypes({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
    return <>
        <label htmlFor="severity_type_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Severity type:</label>
        <select id="severity_type_id" name='severity_type_id' value={value ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
            {!value && <option value="" disabled hidden>Select severity type</option>}
            {(list || []).map((d) => (
                <option value={d.id} key={d.id}>{d.name}</option>
            ))}
        </select>
    </>
}

function SelectIssueType({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<IssueType[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getIssueTypes({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
    return <>
        <label htmlFor="issue_type_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Issue type:</label>
        <select id="issue_type_id" name='issue_type_id' value={value ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
            {!value && <option value="" disabled hidden>Select Issue type</option>}
            {(list || []).map((d) => (
                <option value={d.id} key={d.id}>{d.name}</option>
            ))}
        </select>
    </>
}

function SelectQaFixedBy({ qaVal, fixedVal, completedVal, onChange }: { qaVal: string; fixedVal: string; completedVal: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<User[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getUsers({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
    return <>
        <div>
            <label htmlFor="qa_reference_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Quality Assurance:</label>
            <select id="qa_reference_id" name='qa_reference_id' value={qaVal ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
                {!qaVal && <option value="" disabled hidden>Select quality assurance</option>}
                {(list || []).map((d) => (
                    <option value={d.id} key={d.id}>{`${d.first_name} ${d?.last_name}`}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="fixed_by_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Fixed By:</label>
            <select id="fixed_by_id" name='fixed_by_id' value={fixedVal ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
                {!fixedVal && <option value="" disabled hidden>Select fixed by</option>}
                {(list || []).map((d) => (
                    <option value={d.id} key={d.id}>{`${d.first_name} ${d?.last_name}`}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="completed_by_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Completed By:</label>
            <select id="completed_by_id" name='completed_by_id' value={completedVal ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
                {!completedVal && <option value="" disabled hidden>Select completed by</option>}
                {(list || []).map((d) => (
                    <option value={d.id} key={d.id}>{`${d.first_name} ${d?.last_name}`}</option>
                ))}
            </select>
        </div>
    </>
}

function SelectBrowserDevice({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    const [list, setList] = useState<Device[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data } = await getDevices({ signal: controller.signal, all: true })
            setList(data ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])
    return <>
        <label htmlFor="device_id" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Browser / Device:</label>
        <select id="device_id" name='device_id' value={value ?? ''} onChange={onChange} className="shadow-md disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light">
            {!value && <option value="" disabled hidden>Select browser / device</option>}
            {(list || []).map((d) => (
                <option value={d.id} key={d.id}>{d.name}</option>
            ))}
        </select>
    </>
}