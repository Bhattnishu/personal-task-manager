import { useState } from 'react'
import axios from 'axios'
import styles from './TaskForm.module.css'

const TaskForm = ({ onTaskCreated, onCancel, taskToEdit, onTaskUpdated }) => {
    const [title, setTitle] = useState(taskToEdit?.title || '')
    const [description, setDescription] = useState(taskToEdit?.description || '')
    const [dueDate, setDueDate] = useState(taskToEdit?.due_date || '')
    const [error, setError] = useState('');
    
  const handleSubmit = async (event) => {
  event.preventDefault()
  setError('');

  try {
    let response;

    if (taskToEdit) {
      response = await axios.patch(
        `/api/tasks/${taskToEdit.id}/`,
        { title, description, due_date: dueDate || null }
      );
      onTaskUpdated(response.data);
    } else {
      response = await axios.post('/api/tasks/', {
        title,
        description,
        due_date: dueDate || null,
        completed: false,
      });
      onTaskCreated(response.data);
    }
  } catch (err) {
    setError('Failed to save task. Please try again.');
  }
}


  return (
  <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.field}>
      <label className={styles.label} htmlFor="title">
        Task Title
      </label>

      <input
        className={styles.input}
        id="title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter task title"
        required
      />
    </div>

    <div className={styles.field}>
      <label className={styles.label} htmlFor="description">
        Description
      </label>

      <textarea
        className={styles.textarea}
        id="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Enter task description"
      />
    </div>
    <div className={styles.field}>
        <label htmlFor="dueDate" className={styles.label}>
            Due Date
        </label>

        <input
            id="dueDate"
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
        />
    </div>

    {error && <p className={styles.error}>{error}</p>}
    <div className={styles.buttonGroup}>
      <button
        type="submit"
        className={`${styles.button} ${styles.submitButton}`}
      >
        {taskToEdit ? 'Save Changes' : 'Add Task'}
      </button>

      <button
        type="button"
        className={`${styles.button} ${styles.cancelButton}`}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>

  </form>
)
}

export default TaskForm