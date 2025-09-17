import React, { useState } from 'react';
import type { ICreateTaskRequest, TaskPriority } from '../../types/task';
import { TASK_STATUS, TASK_PRIORITY } from '../../types/task';
import { createTask } from '../../services/taskService';
import PlusButton from '../PlusButton/PlusButton';
import styles from './CreateTaskButton.module.scss';

interface CreateTaskButtonProps {
    onTaskCreated: () => void;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ onTaskCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(TASK_PRIORITY.Low);

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) {
            alert('Будь ласка, заповніть усі поля!');
        return;
        }

        const newTask: ICreateTaskRequest = {
            title,
            description,
            status: TASK_STATUS.Active, // Нові завдання завжди активні
            priority,
        };

        try {
            await createTask(newTask);
            onTaskCreated(); // Повідомляємо батьківський компонент про створення нового завдання
            setIsModalOpen(false); // Закриваємо модальне вікно
            // Очищаємо форму
            setTitle('');
            setDescription('');
            setPriority(TASK_PRIORITY.Low);
        } catch (error) {
            alert('Не вдалося створити завдання.');
            console.error(error);
        }
    };

    return (
        <>
        <PlusButton onClick={() => setIsModalOpen(true)} />

        {isModalOpen && (
            <div className={styles.createTaskModalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                <h2>Створити завдання</h2>
                <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                <label>
                    Заголовок:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label>
                    Опис:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                <button className={styles.saveButton} onClick={handleCreate}>
                    Зберегти
                </button>
                <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                    Скасувати
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
};

export default CreateTaskButton;