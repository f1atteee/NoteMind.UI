import React from 'react';
import { List } from '@mui/material';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskList.module.scss';

export interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

interface TaskListProps {
    tasks: Task[];
    onUpdateTask: (id: number, payload: Partial<Task>) => void;
    onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
    if (tasks.length === 0) {
        return (
        <p className={styles.emptyList}>
            Немає завдань для відображення.
        </p>
        );
    }

    return (
        <List className={styles.taskList}>
        {tasks.map((task) => (
            <TaskItem
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            />
        ))}
        </List>
    );
};

export default TaskList;