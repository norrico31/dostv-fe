import { CiEdit, CiTrash } from 'react-icons/ci'

type Props = {
    editData?: () => void
    deleteData?: () => void
}

export default function ButtonAction({ editData, deleteData }: Props) {
    return (
        <td className="px-6 py-4 border border-slate-300 dark:border-slate-700 p-4 text-slate-500 text-center dark:text-white" >
            {editData && (
                <button className="btn primary inline-flex items-center gap-1 mr-2" onClick={editData}>
                    Edit
                    <CiEdit size={24} />
                </button>
            )}
            {deleteData && (
                <button className="btn danger inline-flex items-center gap-1" onClick={deleteData}>
                    Delete
                    <CiTrash size={24} />
                </button>
            )}
        </td>
    )
}