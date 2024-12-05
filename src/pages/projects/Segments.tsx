/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { MdAdd } from 'react-icons/md'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useToastNotificationCtx } from '../../shared/contexts/ToastNotification';
import { ButtonAction, Loading, Table, DeleteModal, MultiSelect } from '../../shared/components'
import { segmentDao } from '../../shared/dao'
import { MultiValue } from 'react-select';
import { BASE_URL } from '../../shared/config';

const { getSegments, postSegment, putSegment, deleteSegment } = segmentDao()

export default function Segments() {
    const [loading, setLoading] = useState(true)
    const [segments, setData] = useState<Segment[]>([])
    // const [selectedDate, setSelectedDate] = useState('')
    const [selectedData, setSelectedData] = useState<Segment | undefined>(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    useEffect(() => {
        const controller = new AbortController();
        getData({ signal: controller.signal, })
        return () => {
            controller.abort()
        }
    }, [])

    async function getData(args?: ApiParams) {
        setLoading(true)
        try {
            const res = await getSegments({ signal: args?.signal, search: args?.search, page: args?.page })
            const data = await res.json()
            setData(data.data ?? [])
            // setData(res)
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    async function removeSegment(id: number) {
        await deleteSegment(id).finally(getData).finally(closeModal)
    }

    const closeModal = () => {
        setSelectedData(undefined)
        setOpenModal(false)
        setOpenDeleteModal(false)
    }

    return (
        <div className="md:container mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="heading-1 my-3">Segments</h1>
                <button className="btn create inline-flex items-center" onClick={() => setOpenModal(true)}>
                    Create
                    <MdAdd size={24} />
                </button>
            </div>
            <hr className='my-5' />
            <div>
                <Table>
                    <thead className="text-md text-gray-800 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                        <tr className='text-center'>
                            <th scope="col" className="px-6 py-3">
                                Segment
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Projects
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
                        {loading ? <tr><td className='w-full h-full'><Loading /></td></tr> : !segments?.length ? <tr className='text-center'><td className='w-full h-full'>No data record </td></tr> : segments.map((d) => <tr className="dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900" key={d.id}>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {/* {formatDate(d?.date as unknown as Date) ?? 'NA'} */}
                                {d.name}
                            </td>
                            <td scope="row" className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white">
                                {d?.projects?.map((p) => <div key={Math.floor(Math.random() * 9123123123123) + ''}> {p.name}</div>)}
                            </td>
                            <td className={`px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-white `}>
                                <p className={`p-3 text-center uppercase font-semibold rounded-lg`}>
                                    {d?.description ?? 'NA'}
                                </p>
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
                {/* <Pagination
                    {...pageProps}
                    onNextClick={() => getData({ page: +pageProps?.page + 1 })}
                    onPrevClick={() => getData({ page: +pageProps?.page - 1 })}
                /> */}
            </div>
            <Modal
                getData={getData}
                onClose={closeModal}
                open={openModal}
                selectedData={selectedData}
            />
            <DeleteModal<Segment>
                isOpen={openDeleteModal}
                onClose={closeModal}
                selectedItem={selectedData!}
                deleteItem={removeSegment!}
            >
                <p className="text-gray-500 dark:text-gray-300 text-lg">Are you sure you want to delete this segment?</p>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-lg">({selectedData?.name})</p>
            </DeleteModal>
        </div>
    )
}


type Props = {
    open: boolean;
    onClose: () => void;
    selectedData?: Segment;
    getData(args?: ApiParams): Promise<unknown>
}

const initFieldState: Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'projects'> = {
    name: '',
    description: '',
}


function SelectProjects({ value, onChange }: { value: MultiValue<OptionType>; onChange: (v: MultiValue<OptionType>) => void; }) {
    const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/projects`, { signal: controller.signal })
                const data = await res.json()
                setProjects(data.data ?? [])
            } catch (error) {
                return error
            }
        })()
        return () => controller.abort()
    }, [])
    const filteredList = (projects ?? [])?.map((itm) => ({ label: itm?.name, value: itm.id })) as MultiValue<OptionType>
    return <>
        <div className='relative'>
            <label htmlFor="projectIds" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">
                Projects:
            </label>
            <MultiSelect
                id="projectIds"
                options={[...filteredList]}
                selected={value}
                setSelected={onChange}
                placeholder='Select developers'
            />
        </div>
    </>
}
function Modal({ open, onClose, selectedData, getData }: Props) {
    const { setInfo } = useToastNotificationCtx()
    const [fields, setFields] = useState<typeof initFieldState>(initFieldState)
    const [loading, setLoading] = useState(false)
    const [selectedProjectIds, setSelectedProjectIds] = useState<{ value: number; label: string }[]>([])

    useEffect(() => {
        if (!open) return
        if (selectedData) {
            setFields({ name: selectedData.name, description: selectedData.description });
            setSelectedProjectIds(selectedData.projects?.map((p) => ({ value: p.id, label: p.name })) ?? [])
            console.log(selectedData.projects)
        }
        return () => selectedData && setFields(initFieldState)
    }, [open, selectedData])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const SegmentId = selectedData?.id ? selectedData.id : ''
        const payload = {
            ...fields,
            projectIds: selectedProjectIds?.map(p => p.value)
        }
        try {
            const res = SegmentId === '' ? postSegment(payload) : putSegment({ ...payload, id: SegmentId })
            await res
            setInfo({
                status: SegmentId ? 'warning' : 'success',
                message: `${SegmentId ? 'Update' : 'Create'} Segment Successfully`
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
                            Segment - {selectedData ? 'Edit' : 'Create'}
                        </DialogTitle>
                        <hr className='my-5' />
                        <form onSubmit={onSubmit}>
                            <div className='p-3 mt-3 border-2 border-solid border-gray-200 rounded-md relative'>
                                <div className="grid gap-4 md:grid-cols-2 mb-2">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-200">Segment Name:</label>
                                        <input type="text" id="name" name='name' value={fields?.name ?? ''} onChange={e => setFields({ ...fields, name: e.target.value })} required className={`shadow-md h-[40px] bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-md-light`} placeholder="Enter segment name" />
                                    </div>
                                    <SelectProjects value={selectedProjectIds as unknown as MultiValue<OptionType>} onChange={v => setSelectedProjectIds(v as { value: number; label: string }[])} />
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
