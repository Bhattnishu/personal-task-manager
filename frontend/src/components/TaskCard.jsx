
import axios from 'axios'
import styles from './TaskCard.module.css'

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted, onEdit }) => {
  const handleToggleComplete = async () => {
    try {
      const response = await axios.patch(`/api/tasks/${task.id}/`, {
        completed: !task.completed,
      })

      onTaskUpdated(response.data)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    try {
      await axios.delete(`/api/tasks/${task.id}/`)
      onTaskDeleted(task.id)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  
  return (
    <div className={styles.taskCard}>
      <h3 className={styles.title}>{task.title}</h3>

      <p className={styles.description}>{task.description}</p>

      {task.due_date && (
        <p className={styles.dueDate}>
          Due Date: {task.due_date}
        </p>
      )}

      <div className={styles.cardFooter}>
        <span
          className={`${styles.status} ${
            task.completed ? styles.completed : styles.pending
          }`}
        >
          {task.completed ? 'Completed' : 'Pending'}
        </span>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.completeButton}`}
            onClick={handleToggleComplete}
          >
            {task.completed ? 'Mark as Pending' : 'Mark as Complete'}
          </button>

          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )

}

export default TaskCard
