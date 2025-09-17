import API_BASE_URL from '../config/api';
// Using type-only imports for interfaces and regular imports for const objects
import type { ITask, ICreateTaskRequest, IUpdateTaskRequest } from '../types/task';

// Getting tasks
export const getTasks = async (): Promise<ITask[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Task`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const tasks: ITask[] = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

// Creating a task
export const createTask = async (task: ICreateTaskRequest): Promise<ITask> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            // It's a good practice to handle potential JSON parsing errors
            let errorMessage = 'Failed to create task';
            try {
                const errorData = await response.json();
                errorMessage = errorData.title || errorMessage;
            } catch {
                // If parsing fails, use a generic message
            }
            throw new Error(errorMessage);
        }

        const createdTask: ITask = await response.json();
        return createdTask;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

// Updating a task
export const updateTask = async (id: number, payload: IUpdateTaskRequest): Promise<ITask> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Task/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Task not found');
            throw new Error(`Failed to update task: ${response.statusText}`);
        }

        const updatedTask: ITask = await response.json();
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

// Deleting a task
export const deleteTask = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Task/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            if (response.status === 404) throw new Error('Task not found');
            throw new Error(`Failed to delete task: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};