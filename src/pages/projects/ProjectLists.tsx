import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { MdAdd } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { projectsDao } from '../../shared/dao/ProjectDao';
import { Loading } from '../../shared/components';

const { getProjects: getProjectsDao } = projectsDao()

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

export default function Projects() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Project[]>([])

    useEffect(() => {
        const controller = new AbortController();
        getProjects({ signal: controller.signal })
        return function () {
            controller.abort()
        }
    }, [])

    async function getProjects({ signal }: ApiParams) {
        setLoading(true)
        try {
            const res = await getProjectsDao({ signal })
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
        </div>
    )
}