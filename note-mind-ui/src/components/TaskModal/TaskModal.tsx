import React, { useState } from 'react';
import type { ITask, IUpdateTaskRequest } from '../../types/task';
import { TASK_STATUS, TASK_PRIORITY } from '../../types/task';
import type { TaskStatus, TaskPriority } from '../../types/task';
import styles from './TaskModal.module.scss';

interface TaskModalProps {
    task: ITask;
    onClose: () => void;
    onUpdate: (id: number, updatedTask: IUpdateTaskRequest) => void;
    onDelete: (id: number) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onUpdate, onDelete }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);

    const handleSave = () => {
        onUpdate(task.id, {
            title,
            description,
            status,
            priority,
        });
        onClose();
    };

    const handleComplete = () => {
        onUpdate(task.id, {
            title,
            description,
            status: TASK_STATUS.Completed, // Позначаємо як виконане
            priority,
        });
        onClose();
    };

    const handleDelete = () => {
        onDelete(task.id);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
            <h2>Редагувати завдання</h2>
            <button className={styles.closeButton} onClick={onClose}>&times;</button>
            </div>
            <div className={styles.modalBody}>
            <label>
                Заголовок:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Опис:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Статус:
                <select value={status} onChange={(e) => setStatus(Number(e.target.value) as TaskStatus)}>
                <option value={TASK_STATUS.Active}>Активне</option>
                <option value={TASK_STATUS.InProgress}>У роботі</option>
                <option value={TASK_STATUS.Completed}>Виконане</option>
                </select>
            </label>
            <label>
                Пріоритет:
                <select value={priority} onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}>
                <option value={TASK_PRIORITY.Low}>Низький</option>
                <option value={TASK_PRIORITY.Medium}>Середній</option>
                <option value={TASK_PRIORITY.High}>Високий</option>
                </select>
            </label>
            </div>
            <div className={styles.modalFooter}>
            {status !== TASK_STATUS.Completed && (
                <button className={styles.completeButton} onClick={handleComplete}>
                Виконати
                </button>
            )}
            <button className={styles.saveButton} onClick={handleSave}>
                Зберегти
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
                Видалити
            </button>
            </div>
        </div>
        </div>
    );
};

export default TaskModal;