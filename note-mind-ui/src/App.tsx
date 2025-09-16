import { Container, Box, Typography, ButtonGroup, Button } from '@mui/material';
import { useTasks } from './hooks/useTasks.js';
import TaskForm from './components/TaskForm/TaskForm';
import TaskListComponent from './components/TaskList/TaskList';
import styles from './App.module.scss';

const App = () => {
  const { 
    tasks, 
    loading, 
    error, 
    filter, 
    setFilter, 
    handleAddTask, 
    handleUpdateTask, 
    handleDeleteTask,
  } = useTasks();

  return (
    <Container maxWidth="sm" className={styles.appContainer}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Менеджер завдань
        </Typography>
        <TaskForm onAddTask={handleAddTask} />
        <Box className={styles.filterButtons}>
          <ButtonGroup variant="contained" aria-label="task filter buttons">
            <Button onClick={() => setFilter('all')} disabled={filter === 'all'}>Всі</Button>
            <Button onClick={() => setFilter('active')} disabled={filter === 'active'}>Активні</Button>
            <Button onClick={() => setFilter('completed')} disabled={filter === 'completed'}>Завершені</Button>
          </ButtonGroup>
        </Box>
        {loading && <Typography className={styles.statusMessage}>Завантаження...</Typography>}
        {error && <Typography className={`${styles.statusMessage} ${styles.errorMessage}`}>Помилка: {error}</Typography>}
        {!loading && !error && (
          <TaskListComponent
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </Box>
    </Container>
  );
};

export default App;