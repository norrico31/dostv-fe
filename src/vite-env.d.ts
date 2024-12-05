/// <reference types="vite/client" />

type DarkMode = 'light' | 'dark'

type ApiError = {
    message: string
}

type FetchType = <T>(url: string, config?: RequestInit) => Promise<T>;

type ApiParams = { signal?: AbortSignal; search?: string, page?: number, limit?: number; all?: boolean }

type TimeStamp = {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

type DaoBE<T> = {
    data: T
} & PaginationBE

type DaoFE<T> = {
    data: T
} & PaginationFE

type OptionType = {
    value: string | number;
    label: string;
}
type UserDao = {
    data: User[]
} & PaginationBE

type PaginationBE = {
    total_items: number;
    current_page: number;
    last_page: number;
}

type PaginationFE = {
    totalItems: number;
    page: number;
    lastPage: number;
}

type DAOReturnedType<T> = { data: T } & PaginationFE

// SYSTEM SETTINGS
type Status = {
    name: string;
    description: string;
} & Partial<{ id: string }>


type StatusCount = Record<string, number>

type StatusDao = {
    data: Status[]
} & PaginationBE

type Schedule = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type ScheduleDao = {
    data: Schedule[]
} & PaginationBE

type Device = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type DeviceDao = {
    data: Device[]
} & PaginationBE

type ProjectType = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type ProjectTypeDao = {
    data: ProjectType[]
} & PaginationBE

type SeverityType = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type SeverityStatusCount = Record<string, number>

type SeverityTypeDao = {
    data: SeverityType[]
} & PaginationBE

type IssueType = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type IssueTypeDao = {
    data: IssueType[]
} & PaginationBE

type Role = {
    name: string;
    description: string;
} & Partial<{ id: string }>

type RoleDao = {
    data: Role[]
} & PaginationBE

//* MAIN MODULE



type ProjectDao = {
    data: Project[]
} & PaginationBE


type SelectMultiValues = {
    label: string;
    value: string
}










type UserLogin = {
    token: string
    user: User
}

type User = {
    age: number
    createdAt: string
    deletedAt: null | string
    email: string
    firstName: string
    id: number
    roleId: number
    role: Role
    lastActiveAt: string | null
    lastName: string
    updatedAt: string
}


type Segment = {
    name: string
    description: string
    createdAt: string
    projects: Project[]
    updatedAt: string
    deletedAt: string | null
} & Partial<{ id: number }>

type Project = {
    id: number;
    name: string;
    description: string;
    progress: number;
    dateStarted: string;
    dateDeadline: string;
    statusId: number;
    status: Status;
    url: string
    users: User[]
    segment: Segment
    tasks: Task[]
}

type Task = {
    createdAt: string
    deletedAt: null | string
    deletedBy: null | string
    description: string
    id: number
    name: string
    priority: Priority
    priorityId: number
    project: Project
    projectId: number
    updatedAt: string | null
    user: User
    userId: number
}

type Priority = {
    id: number
    name: string
    description: string
    createdAt: string
    deletedAt: null | string
    deletedBy: null | string
    updatedAt: string | null

}
type Role = {
    id: number
    name: string
    description: string
    createdAt: string
    deletedAt: null | string
    deletedBy: null | string
    updatedAt: string | null

}