import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { ITask } from '../../types/task';
import { TASK_PRIORITY } from '../../types/task';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: ITask;
  index: number;
  onClick: () => void;
}

const priorityLabels = {
  [TASK_PRIORITY.Low]: 'Низький',
  [TASK_PRIORITY.Medium]: 'Середній',
  [TASK_PRIORITY.High]: 'Високий',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  const getPriorityClass = () => {
    switch (task.priority) {
      case TASK_PRIORITY.Low:
        return styles.low;
      case TASK_PRIORITY.Medium:
        return styles.medium;
      case TASK_PRIORITY.High:
        return styles.high;
      default:
        return '';
    }
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.taskCard}
          onClick={onClick}
        >
          <div className={styles.header}>
            <h4 className={styles.title}>{task.title}</h4>
            <span className={`${styles.priority} ${getPriorityClass()}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>
          <p className={styles.description}>{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;