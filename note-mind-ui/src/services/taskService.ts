import API_BASE_URL from '../config/api';
import type { Task } from '../components/TaskList/TaskList';

export const getTasks = async (status: number | null): Promise<Task[]> => {
    const url = status !== null ? `${API_BASE_URL}?status=${status}` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return await response.json() as Task[];
};

export const createTask = async (title: string): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    if (!response.ok) {
        throw new Error('Failed to add task');
    }
    return await response.json() as Task;
};

export const updateTask = async (id: number, payload: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    return await response.json() as Task;
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
};