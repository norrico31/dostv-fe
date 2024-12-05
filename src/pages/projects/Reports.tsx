
import { useState, useEffect, memo, useCallback } from 'react'
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ButtonAction, DatePicker, Loading, MultiSelect, Table, DeleteModal } from '../../shared/components'
import { MdAdd } from 'react-icons/md'
import { useSearchDebounce } from '../../shared/hooks/useSearchDebounce'
import { useProjectOutletCtx } from './ProjectModules'
import { reportsDao, statusDao, userDao } from '../../shared/dao'
import { formatDate } from '../../shared/utils/dateFormat'
import { useUserServices } from '../../shared/services/UserServices'
import { firstLetterCapitalize } from '../../shared/utils/firstLetterCapitalize';
import { MultiValue } from 'react-select';
import { DateType } from 'react-tailwindcss-datepicker';
import { CiTrash } from 'react-icons/ci';

const { getReports, postReport, putReport, deleteReport } = reportsDao()
const { getUsers, } = userDao()

type Props = {
    projectId: string
    open: boolean;
    onClose: () => void;
    selectedData?: Reports;
    getData(args?: ApiParams): Promise<unknown>
}

const initFieldState: Reports = {
    project_id: '',
    user_id: '',
    date: '',
    description: null,
    actual_time_spent: null,
    user: null,
    project: null,
}

const initTaskRow: Reports[] = [
    {
        id: new Date().getTime().toString(), // bug is in id of this
        ...initFieldState,
    }
]

const Task = memo(function ({ users, report, handleChange, removeReportRow, firstItemHide }: { firstItemHide: boolean; users: User[]; report: typeof initTaskRow[0]; handleChange: (report: (typeof initTaskRow)[0]) => void; removeReportRow: (id: string) => void }) {
    function handleReportChange(updatedTask: Partial<typeof initTaskRow[0]>) {
        handleChange({ ...report, ...updatedTask })
    }
    return <div>
        <div className="grid gap-4 md:grid-cols-2 mb-2">
            <div>
                <label htmlFor="date" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Date:</label>
                <DatePicker
                    value={report.date as DateType}
                    onChange={v => handleReportChange({ date: v })}
                    isDisabledPreviousDates={true}
                />
            </div>
            <div>
                <SelectUsers
                    key={report.id}
                    value={report.user_id}
                    users={users}
                    onChange={(v) => handleReportChange({ user_id: v.target.value })}
                />
            </div>
        </div>
        <div className="mb-2">
            <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Description</label>
            <textarea
                id="description"
                name='description'
                value={report.description as string}
                onChange={e => handleReportChange({ description: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter description" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-2">
            <div className="mb-2">
                <label htmlFor="actual_time_spent" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Actual Time Spent:</label>
                <input id="actual_time_spent" name='actual_time_spent' type='text'
                    value={report.actual_time_spent as string}
                    onChange={e => handleReportChange({ actual_time_spent: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter expected outcome" />
            </div>
            <div className='flex justify-end align-bottom items-center'>
                {!firstItemHide && (
                    <button className="btn danger inline-flex items-end gap-1" onClick={() => removeReportRow(report.id!)}>
                        Remove row
                        <CiTrash size={24} />
                    </button>
                )}
            </div>
        </div>
        <hr className='my-3' />
    </div>
})

function Modal({ open, onClose, projectId, selectedData, getData }: Props) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<Reports[]>([initFieldState])
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields([{ ...selectedData }]);
        }
        return () => selectedData && setFields([initFieldState])
    }, [open, selectedData])

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const { data: users } = await getUsers({ signal: controller.signal, all: true })
            setUsers(users ?? [])
        })();
        return function () {
            controller.abort()
        }
    }, [])

    const addTaskRow = useCallback(() => {
        setFields(prevFields => [...prevFields, { ...initTaskRow[0], id: new Date().getTime().toString(), }])
    }, [])

    const handleDevelopmentChange = useCallback((report: typeof initTaskRow[0]) => {
        if (!report) return;
        setFields(prevFields => prevFields.map((prev) => prev.id === report.id ? report : prev))
    }, [])

    const removeReportRow = useCallback((reportId: string) => {
        setFields(prevFields => prevFields?.filter((prev) => prev.id !== reportId))
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const reportId = selectedData?.id ? selectedData.id : ''
        const payload = {
            projectId,
            reports: [...fields!,]
        }
        try {
            const res = reportId === '' ? postReport(payload) : putReport({ report_id: reportId, report: { ...fields[0] } })
            await res
            setInfo({
                status: reportId ? 'warning' : 'success',
                message: `${reportId ? 'Update' : 'Create'} Backlog Successfully`
            })
            setTimeout(() => {
                onClose()
                setFields([{ ...initFieldState }])
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
                            Report - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className='p-3 mt-3 border-2 border-solid border-gray-200 rounded-md relative'>
                                {fields.map((report) => <Task key={report.id} report={report} handleChange={handleDevelopmentChange} users={users} removeReportRow={removeReportRow} firstItemHide={fields.length <= 1} />)}
                                {!selectedData && (
                                    <button
                                        type='button'
                                        className="text-gray-800 border-2 border-gray-200 bg-transparent hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900" onClick={addTaskRow}>
                                        Add Row
                                    </button>
                                )}
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

export function SelectUsers({ users, value, onChange }: { users: User[]; value: string; onChange: (v: React.ChangeEvent<HTMLSelectElement>) => void; }) {
    return <>
        <div className='relative'>
            <label htmlFor="user_id" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
                Dev / QA:
            </label>
            <select
                id="lead_dev_id"
                name='lead_dev_id'
                value={value ?? ''}
                onChange={onChange}
                className="disabled:cursor-not-allowed shadow-md bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light"
            >
                {!value && <option value="" disabled hidden>Select lead developer</option>}
                {users.map((d) => {
                    const firstLetterCap = firstLetterCapitalize(d.first_name)
                    return <option value={d.id} key={d.id}>{firstLetterCap}</option>
                })}
            </select>
        </div>
    </>
}

const initState: ReportsDao = {
    data: [],
    page: 1,
    lastPage: 1,
    totalItems: 0,
}

export default function Reports() {
    const { data: project } = useProjectOutletCtx()
    const [{ data, ...pageProps }, setData] = useState<ReportsDao>(initState)
    const [loading, setLoading] = useState(true)
    const [search, inputValue, onChange] = useSearchDebounce()
    const [selectedData, setSelectedData] = useState<Reports | undefined>(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

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
            const res = await getReports({ projectId: project.id!, signal: args?.signal, search: args?.search, page: args?.page })
            console.log('report res: ', res)
            setData(res ?? initState)
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    async function removeReport(id: string) {
        await deleteReport(id).finally(getData).finally(closeModal)
    }

    function closeModal() {
        setOpenModal(false)
        setSelectedData(undefined)
        setOpenDeleteModal(false)
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-2 flex-wrap'>
                <div className='flex items-center gap-3'>
                    <h2 className="heading-2 pb-2 sm:pb-0">Reports</h2>
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
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Actual time spent
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !data?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : data.map((d) => {
                        return (
                            <tr key={d.id} className="white dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900">
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {formatDate(d.date as unknown as Date)}
                                </td>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.description}
                                </td>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                    {d.user?.first_name}
                                </td>
                                <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white text-center">
                                    {d.actual_time_spent}
                                </td>
                                <ButtonAction editData={() => {
                                    setSelectedData(d)
                                    setOpenModal(true)
                                }} deleteData={() => {
                                    setSelectedData(d)
                                    setOpenDeleteModal(true)
                                }} />
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Modal
                getData={getData}
                onClose={closeModal}
                open={openModal}
                projectId={project?.id as unknown as string}
                selectedData={selectedData}
            />
            <DeleteModal<Reports>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedData!}
                deleteItem={removeReport!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this report?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedData?.description})</p>
            </DeleteModal>
        </div>
    )
}