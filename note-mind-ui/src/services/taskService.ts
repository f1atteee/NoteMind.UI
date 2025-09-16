import API_BASE_URL from '../config/api';
import type { Task } from '../components/TaskBoard/TaskBoard';

// Інтерфейс для відповіді API, який відповідає TaskDto
// Він містить усі поля, що повертаються з бекенду.
interface TaskApiResponse {
    id: number;
    title: string;
    description: string;
    deadline?: string | null;
    status: number; // TaskStatus як число
    priority: number; // TaskPriority як число
    createdAt: string; // DateTime з бекенду повертається як ISO string
}

// Інтерфейс для запиту на створення/оновлення, який відповідає TaskRequestModel
// Використовуємо його для відправки даних на бекенд.
export interface TaskRequest {
    title: string;
    description: string;
    deadline?: string | null;
    status: number;
    priority: number;
}

// Перетворення числового статусу з бекенду в строковий для фронтенду
export const mapStatusToFrontend = (status: number): Task['status'] => {
    switch (status) {
        case 0:
            return 'todo';
        case 1:
            return 'inprogress';
        case 2:
            return 'done';
        default:
            throw new Error(`Unknown status: ${status}`);
    }
};

// Перетворення строкового статусу фронтенду в числовий для бекенду
export const mapStatusToBackend = (status: 'all' | 'todo' | 'inprogress' | 'done'): number | undefined => {
    switch (status) {
        case 'todo':
            return 0; // Активний
        case 'inprogress':
            return 1; // У процесі
        case 'done':
            return 2; // Завершений
        default:
            return undefined;
    }
};

// Перетворення повного об'єкта TaskApiResponse на інтерфейс Task для фронтенду
const mapTaskApiResponseToTask = (task: TaskApiResponse): Task => {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: mapStatusToFrontend(task.status),
        priority: task.priority,
        createdAt: task.createdAt,
    };
};

export const getTasks = async (
    skip: number = 0,
    take: number = 10,
    status: number | undefined = undefined
): Promise<Task[]> => {
    const params = new URLSearchParams({
        skip: skip.toString(),
        take: take.toString(),
    });

    if (status !== undefined) {
        params.append('status', status.toString());
    }

    const url = `${API_BASE_URL}/Task?${params.toString()}`;
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error('Tasks not found');
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }

    const tasks: TaskApiResponse[] = await response.json();
    return tasks.map(mapTaskApiResponseToTask);
};

export const createTask = async (task: TaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/Task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        if (response.status === 400) throw new Error('Invalid task data');
        throw new Error(`Failed to create task: ${response.statusText}`);
    }

    const createdTask: TaskApiResponse = await response.json();
    return mapTaskApiResponseToTask(createdTask);
};

export const updateTask = async (id: number, payload: Partial<TaskRequest>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/Task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error('Task not found');
        if (response.status === 400) throw new Error('Invalid task data');
        throw new Error(`Failed to update task: ${response.statusText}`);
    }

    const updatedTask: TaskApiResponse = await response.json();
    return mapTaskApiResponseToTask(updatedTask);
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/Task/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error('Task not found');
        throw new Error(`Failed to delete task: ${response.statusText}`);
    }
};