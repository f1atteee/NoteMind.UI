import { useState, useEffect, useCallback } from 'react';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    mapStatusToBackend,
    type TaskRequest,
} from '../services/taskService';
import type { Task } from '../components/TaskBoard/TaskBoard';

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    filter: 'all' | 'todo' | 'inprogress' | 'done';
    setFilter: (filter: 'all' | 'todo' | 'inprogress' | 'done') => void;
    handleAddTask: (task: {
        title: string;
        description: string;
        deadline?: string | null;
        priority: number;
    }) => Promise<void>;
    handleUpdateTask: (id: number, payload: Partial<Task>) => Promise<void>;
    handleDeleteTask: (id: number) => Promise<void>;
    loadMore: () => Promise<void>;
}

export const useTasks = (
    initialFilter: 'all' | 'todo' | 'inprogress' | 'done' = 'all'
): UseTasksReturn => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'all' | 'todo' | 'inprogress' | 'done'>(initialFilter);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [skip, setSkip] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const take = 10;

    const fetchTasks = useCallback(async (reset: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const currentSkip = reset ? 0 : skip;
            const statusToFetch = filter === 'all' ? undefined : mapStatusToBackend(filter);

            const fetchedTasks = await getTasks(currentSkip, take, statusToFetch);
            setTasks(prev => (reset ? fetchedTasks : [...prev, ...fetchedTasks]));
            setSkip(currentSkip + take);
            setHasMore(fetchedTasks.length === take);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [filter, skip, take]); // Додано залежності для useCallback

    useEffect(() => {
        fetchTasks(true);
    }, [fetchTasks, filter]); // Тепер залежить від fetchTasks

    const loadMore = async () => {
        if (hasMore && !loading) {
            await fetchTasks();
        }
    };

    const handleAddTask = async ({
        title,
        description,
        deadline,
        priority,
    }: {
        title: string;
        description: string;
        deadline?: string | null;
        priority: number;
    }) => {
        try {
            const newTaskPayload = {
                title,
                description,
                deadline,
                priority,
                status: 0,
            };
            const createdTask = await createTask(newTaskPayload);

            if (filter === 'all' || mapStatusToBackend(filter) === 0) {
                setTasks(prev => [...prev, createdTask]);
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleUpdateTask = async (id: number, payload: Partial<Task>) => {
        try {
            const updatePayload: Partial<TaskRequest> = {};

            if (payload.title !== undefined) updatePayload.title = payload.title;
            if (payload.description !== undefined) updatePayload.description = payload.description;
            if (payload.deadline !== undefined) updatePayload.deadline = payload.deadline;
            if (payload.priority !== undefined) updatePayload.priority = payload.priority;

            if (payload.status !== undefined) {
                const newStatus = mapStatusToBackend(payload.status);
                if (newStatus !== undefined) {
                    updatePayload.status = newStatus;
                }
            }
            
            const updatedTask = await updateTask(id, updatePayload);

            setTasks(prev => {
                const updatedTasks = prev.map(task => (task.id === id ? updatedTask : task));
                const currentFilterStatus = mapStatusToBackend(filter);
                const updatedTaskStatus = mapStatusToBackend(updatedTask.status as 'all' | 'todo' | 'inprogress' | 'done');

                if (currentFilterStatus !== undefined && updatedTaskStatus !== undefined && currentFilterStatus !== updatedTaskStatus) {
                    return updatedTasks.filter(task => task.id !== id);
                }
                return updatedTasks;
            });
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return {
        tasks,
        loading,
        error,
        filter,
        setFilter,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        loadMore,
    };
};