import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import styles from './HomePage.module.css'

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
  setLoading(true)
  setError('')

  try {
    const response = await axios.get('/api/tasks/')
    setTasks(response.data)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    setError(
      'Failed to load tasks. Please check your connection and try again.'
    )
  } finally {
    setLoading(false)
  }
}, [])

useEffect(() => {
  fetchTasks()
}, [fetchTasks])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !task.completed) ||
      (filterStatus === 'completed' && task.completed)

    return matchesSearch && matchesStatus
  })

  // Show the form page
  if (showForm) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <button
            className={styles.backButton}
            onClick={() => {
              setShowForm(false)
              setTaskToEdit(null)
            }}
          >
            ← Back to Tasks
          </button>

          <h1 className={styles.heading}>Create New Task</h1>

          <TaskForm
            taskToEdit={taskToEdit}
            onCancel={() => {
              setShowForm(false)
              setTaskToEdit(null)
            }}
            onTaskCreated={(newTask) => {
              setTasks((previousTasks) => [newTask, ...previousTasks])
              setShowForm(false)
            }}
            onTaskUpdated={(updatedTask) => {
              setTasks((previousTasks) =>
                previousTasks.map((item) =>
                  item.id === updatedTask.id ? updatedTask : item
                )
              )
              setShowForm(false)
              setTaskToEdit(null)
            }}
            onEdit={(task) => {
              setTaskToEdit(task)
              setShowForm(true)
            }}
          />
        </div>
      </div>
    )
  }

  // Show the main task page
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>TaskFlow</h1>
            <p className={styles.subtitle}>
              Organize your day, one task at a time.
            </p>
          </div>

          <div className={styles.taskCount}>
            {tasks.length} Tasks
          </div>
        </header>

        
      <div className={styles.taskControls}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className={styles.searchInput}
        />

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <h2 className={styles.sectionTitle}>My Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <div>
          <p className={styles.error}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={fetchTasks}
          >
            Retry
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
          <p>
            {tasks.length === 0
              ? "You haven't created any tasks yet."
              : searchTerm
              ? 'No tasks match your search.'
              : 'No tasks found in this category.'}
          </p>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => {
              setTaskToEdit(task)
              setShowForm(true)
            }}
            onTaskUpdated={(updatedTask) => {
              setTasks((previousTasks) =>
                previousTasks.map((item) =>
                  item.id === updatedTask.id ? updatedTask : item
                )
              )
            }}
            onTaskDeleted={(deletedId) => {
              setTasks((previousTasks) =>
                previousTasks.filter((item) => item.id !== deletedId)
              )
            }}
          />
        ))
      )}
      
        <button
          className={styles.addTaskButton}
          onClick={() => {
            setTaskToEdit(null)
            setShowForm(true)
          }}
        >
          + Add New Task
        </button>
      </div>
    </div>
  )
}

export default HomePage
