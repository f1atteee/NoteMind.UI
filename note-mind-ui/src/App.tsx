import { useState } from 'react';
import TaskBoard from './components/TaskBoard/TaskBoard';
import CreateTaskButton from './components/CreateTaskButton/CreateTaskButton';
import styles from './App.module.scss';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshTasks = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1>To-Do List 📝</h1>
      </header>
      <main className={styles.appMain}>
        <TaskBoard key={refreshKey} onTasksChanged={handleRefreshTasks} />
      </main>
      <CreateTaskButton onTaskCreated={handleRefreshTasks} />
    </div>
  );
}

export default App;