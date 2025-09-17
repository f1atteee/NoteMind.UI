import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { ITask, TaskStatus } from '../../types/task';
import TaskCard from '../TaskCard/TaskCard';
import styles from './TaskColumn.module.scss';

interface TaskColumnProps {
    title: string;
    tasks: ITask[];
    status: TaskStatus;
    onTaskClick: (task: ITask) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, status, onTaskClick }) => {
    return (
        <div className={styles.taskColumn}>
        <h3 className={styles.title}>{title} ({tasks.length})</h3>
        <Droppable droppableId={String(status)}>
            {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.list}
            >
                {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onClick={() => onTaskClick(task)} />
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </div>
    );
};

export default TaskColumn;