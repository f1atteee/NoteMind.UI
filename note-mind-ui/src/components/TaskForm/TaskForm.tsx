import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './TaskForm.module.scss';

interface TaskFormProps {
    onAddTask: (title: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
        onAddTask(title);
        setTitle('');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className={styles.taskForm}>
        <TextField
            fullWidth
            variant="outlined"
            label="Нове завдання..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <Button
            type="submit"
            variant="contained"
            endIcon={<AddCircleOutlineIcon />}
            disabled={!title.trim()}
        >
            Додати
        </Button>
        </Box>
    );
};

export default TaskForm;