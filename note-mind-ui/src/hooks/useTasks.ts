import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import type { Task } from '../components/TaskList/TaskList';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  handleAddTask: (title: string) => Promise<void>;
  handleUpdateTask: (id: number, payload: Partial<Task>) => Promise<void>;
  handleDeleteTask: (id: number) => Promise<void>;
}

export const useTasks = (initialFilter: 'all' | 'active' | 'completed' = 'all'): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>(initialFilter);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (status: number | null = null) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks: Task[] = await getTasks(status);
      setTasks(fetchedTasks);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let status: number | null;
    if (filter === 'active') status = 0;
    else if (filter === 'completed') status = 1;
    else status = null;
    
    fetchTasks(status);
  }, [filter]);

  const handleAddTask = async (title: string) => {
    try {
      await createTask(title);
      let status: number | null;
      if (filter === 'active') status = 0;
      else if (filter === 'completed') status = 1;
      else status = null;
      await fetchTasks(status);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateTask = async (id: number, payload: Partial<Task>) => {
    try {
      await updateTask(id, payload);
      setTasks(prevTasks =>
        prevTasks.map(task => 
          task.id === id ? { ...task, ...payload } : task
        )
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
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
  };
};