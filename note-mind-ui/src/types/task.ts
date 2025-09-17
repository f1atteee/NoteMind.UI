export type TaskStatus = 0 | 1 | 2;
export type TaskPriority = 0 | 1 | 2;

export const TASK_STATUS = {
    Active: 0 as TaskStatus,
    InProgress: 1 as TaskStatus,
    Completed: 2 as TaskStatus,
};

export const TASK_PRIORITY = {
    Low: 0 as TaskPriority,
    Medium: 1 as TaskPriority,
    High: 2 as TaskPriority,
};

export interface ITask {
    id: number;
    title: string;
    description: string;
    deadline?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: string;
}

export interface ICreateTaskRequest {
    title: string;
    description: string;
    deadline?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
}

export interface IUpdateTaskRequest {
    title: string;
    description: string;
    deadline?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
}