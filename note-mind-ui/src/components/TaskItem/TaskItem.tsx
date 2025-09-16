import React from 'react';
import { Card, CardContent, Typography, Checkbox, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from './TaskItem.module.scss';
import type { Task } from '../TaskBoard/TaskBoard'; // Оновлений імпорт з TaskBoard

interface TaskItemProps {
    task: Task;
    onUpdateTask: (id: number, payload: Partial<Task>) => void;
    onDeleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask, onDeleteTask }) => {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = e.target.checked ? 'done' : 'todo';
        onUpdateTask(task.id, { status: newStatus });
    };

    const isCompleted = task.status === 'done';

    return (
        <Card className={`${styles.taskItem} ${styles[task.status]}`}>
        <CardContent style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
            <Checkbox
            className={styles.checkbox}
            checked={isCompleted}
            onChange={handleCheckboxChange}
            />
            <Typography
            className={isCompleted ? `${styles.taskTitle} ${styles.completed}` : styles.taskTitle}
            >
            {task.title}
            </Typography>
            <Box className={styles.actions}>
            <IconButton className={styles.editBtn}>
                <EditIcon />
            </IconButton>
            <IconButton className={styles.deleteBtn} onClick={() => onDeleteTask(task.id)}>
                <DeleteIcon />
            </IconButton>
            </Box>
        </CardContent>
        </Card>
    );
};

export default TaskItem;