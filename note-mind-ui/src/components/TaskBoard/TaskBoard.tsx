import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskBoard.module.scss';

export interface Task {
    id: number;
    title: string;
    description: string;
    deadline?: string | null;
    status: 'todo' | 'inprogress' | 'done';
    priority: number;
    createdAt: string;
}

interface TaskBoardProps {
    tasks: Task[];
    onUpdateTask: (id: number, payload: Partial<Task>) => void;
    onDeleteTask: (id: number) => void;
    onReorderTasks: (updatedTasks: Task[]) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onUpdateTask, onDeleteTask, onReorderTasks }) => {
    const columns = {
        todo: tasks.filter(task => task.status === 'todo'),
        inprogress: tasks.filter(task => task.status === 'inprogress'),
        done: tasks.filter(task => task.status === 'done'),
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same column
            const column = columns[source.droppableId as keyof typeof columns];
            const newColumn = Array.from(column);
            const [removed] = newColumn.splice(source.index, 1);
            newColumn.splice(destination.index, 0, removed);

            // Update tasks
            const updatedTasks = tasks.map(task => {
                const indexInNew = newColumn.findIndex(t => t.id === task.id);
                return indexInNew !== -1 ? newColumn[indexInNew] : task;
            });
            onReorderTasks(updatedTasks);
        } else {
            // Move between columns and update status
            const sourceColumn = columns[source.droppableId as keyof typeof columns];
            const destColumn = columns[destination.droppableId as keyof typeof columns];
            const newSource = Array.from(sourceColumn);
            const newDest = Array.from(destColumn);
            const [removed] = newSource.splice(source.index, 1);
            removed.status = destination.droppableId as Task['status'];
            newDest.splice(destination.index, 0, removed);

            // Update tasks
            const updatedTasks = tasks.map(task => {
                if (task.id === removed.id) return removed;
                return task;
            });
            onReorderTasks(updatedTasks);
            onUpdateTask(removed.id, { status: removed.status });
        }
    };

    const renderColumn = (columnId: keyof typeof columns) => {
        const columnTasks = columns[columnId];
        if (columnTasks.length === 0) {
            return <p className={styles.emptyList}>Немає завдань</p>;
        }

        return (
            <Droppable droppableId={columnId}>
                {(provided: DroppableProvided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.droppableArea}
                    >
                        {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided: DraggableProvided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <TaskItem
                                            task={task}
                                            onUpdateTask={onUpdateTask}
                                            onDeleteTask={onDeleteTask}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.taskBoard}>
                <div className={styles.column}>
                    <h3>To Do</h3>
                    {renderColumn('todo')}
                </div>
                <div className={styles.column}>
                    <h3>In Progress</h3>
                    {renderColumn('inprogress')}
                </div>
                <div className={styles.column}>
                    <h3>Done</h3>
                    {renderColumn('done')}
                </div>
            </div>
        </DragDropContext>
    );
};

export default TaskBoard;