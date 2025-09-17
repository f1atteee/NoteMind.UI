import React, { useState, useEffect } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import type { ITask, IUpdateTaskRequest, TaskStatus } from '../../types/task';
import { TASK_STATUS } from '../../types/task';
import { getTasks, updateTask, deleteTask } from '../../services/taskService';
import TaskColumn from '../TaskColumn/TaskColumn';
import TaskModal from '../TaskModal/TaskModal';
import styles from './TaskBoard.module.scss';

interface TaskBoardProps {
    onTasksChanged: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ onTasksChanged }) => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, [onTasksChanged]);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const allTasks = await getTasks();
            setTasks(allTasks);
        } catch (err) {
            setError('Не вдалося завантажити завдання. Спробуйте пізніше.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (task: ITask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
        fetchTasks(); // Оновлюємо список після закриття модалки, якщо зміни були
    };

    const handleTaskUpdate = async (id: number, updatedTask: IUpdateTaskRequest) => {
        try {
            await updateTask(id, updatedTask);
            fetchTasks();
        } catch (err) {
            console.error('Помилка при оновленні завдання:', err);
        }
    };

    const handleTaskDelete = async (id: number) => {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            console.error('Помилка при видаленні завдання:', err);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const taskToMove = tasks.find(t => t.id === Number(draggableId));
        if (!taskToMove) return;

        const newStatus = Number(destination.droppableId) as TaskStatus;
        const updatedTaskData: IUpdateTaskRequest = {
        ...taskToMove,
        status: newStatus,
        };
        
        // Оновлюємо локальний стан для миттєвого відображення
        const updatedTasks = tasks.map(task =>
            task.id === taskToMove.id ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        // Відправляємо зміни на сервер
        try {
            await updateTask(taskToMove.id, updatedTaskData);
            onTasksChanged(); // Оновлюємо дошку після успішного запиту
        } catch (err) {
            console.error('Помилка при оновленні завдання на сервері:', err);
            // Можна відновити старий стан, якщо запит не пройшов
            fetchTasks();
        }
    };

    if (loading) return <div className={styles.loading}>Завантаження завдань...</div>;

    if (error) return <div className={styles.error}>{error}</div>;

    const activeTasks = tasks.filter(t => t.status === TASK_STATUS.Active);
    const inProgressTasks = tasks.filter(t => t.status === TASK_STATUS.InProgress);
    const completedTasks = tasks.filter(t => t.status === TASK_STATUS.Completed);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.taskBoard}>
            <TaskColumn
                title="Активні"
                tasks={activeTasks}
                status={TASK_STATUS.Active}
                onTaskClick={handleTaskClick}
            />
            <TaskColumn
                title="У роботі"
                tasks={inProgressTasks}
                status={TASK_STATUS.InProgress}
                onTaskClick={handleTaskClick}
            />
            <TaskColumn
                title="Виконані"
                tasks={completedTasks}
                status={TASK_STATUS.Completed}
                onTaskClick={handleTaskClick}
            />
            {isModalOpen && selectedTask && (
            <TaskModal
                task={selectedTask}
                onClose={handleModalClose}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
            />
            )}
        </div>
        </DragDropContext>
    );
};

export default TaskBoard;