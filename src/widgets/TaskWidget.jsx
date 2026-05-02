// TaskWidget.jsx
// The task manager widget — the most interactive widget on the dashboard
// Features:
//   - Add new tasks via the input at the bottom
//   - Check/uncheck tasks as done
//   - Change priority per task (low / medium / high)
//   - Delete individual tasks
//   - Drag and drop to reorder the list
//   - Progress bar showing % of tasks completed
//   - All state persists to localStorage via TaskContext

import { useState }         from 'react'
import { useTaskContext }   from '../context/TaskContext'
import { useDragAndDrop }  from '../hooks/useDragAndDrop'
import WidgetCard           from '../components/WidgetCard'
import PriorityBadge        from '../components/PriorityBadge'
import AnimatedCounter      from '../components/AnimatedCounter'
import { FiTrash2, FiPlus, FiCheckCircle, FiCheck } from 'react-icons/fi'
import { GrDrag } from 'react-icons/gr'
import { motion } from 'framer-motion'

// ── Single task row ───────────────────────────────────────────────────────────

function TaskRow({ task, dragProps, isBeingDragged, isDropTarget, dispatch }) {

  function handleToggle() {
    dispatch({ type: 'TOGGLE', payload: task.id })
  }

  function handleDelete() {
    dispatch({ type: 'DELETE', payload: task.id })
  }

  function handlePriorityChange(value) {
    dispatch({ type: 'SET_PRIORITY', payload: { id: task.id, priority: value } })
  }

  return (
    <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    transition={{ duration:1.5 }}
    >
        <li
      {...dragProps}
      className={`flex items-center gap-2 md:gap-3 py-2 md:py-3 px-2 md:px-3 rounded-lg transition-colors text-xs md:text-sm ${
        isBeingDragged ? 'opacity-50 bg-gray-100' : ''
      } ${isDropTarget ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      {/* Drag handle */}
      <span aria-hidden="true" className="text-gray-300 cursor-grab flex-shrink-0">
        <GrDrag size={14} />
      </span>

      {/* Checkbox */}
      <button
        onClick={handleToggle}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={`flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {task.completed && <FiCheck className="w-3 h-3 text-white" />}
      </button>

      {/* Title */}
      <span className={`flex-1 font-medium ${
        task.completed ? 'line-through text-gray-400' : 'text-gray-900'
      }`}>
        {task.title}
      </span>

      {/* Priority badge */}
      <PriorityBadge level={task.priority} onChange={handlePriorityChange} />

      {/* Delete */}
      <button
        onClick={handleDelete}
        aria-label={`Delete task: ${task.title}`}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
      >
        <FiTrash2 size={14} />
      </button>
      </li>
  </motion.div>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────────

export default function TaskWidget() {
  const { tasks, dispatch, completedCount, totalCount, progressPct } = useTaskContext()
  const [inputValue, setInputValue] = useState('')

  const { draggingId, hoverTargetId, getDragProps } = useDragAndDrop(
    tasks,
    (reordered) => dispatch({ type: 'REORDER', payload: reordered })
  )

  function handleAddTask(e) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD', payload: trimmed })
    setInputValue('')
  }

  const headerActions = (
    <span className="text-xs md:text-sm font-medium text-gray-600">
      <AnimatedCounter to={completedCount} duration={0.8} />/<AnimatedCounter to={totalCount} duration={0.8} />
    </span>
  )

  return (
    <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 1 }}
      delay={0.5}
     >
        <WidgetCard title="Today's Tasks" icon={<FiCheckCircle className="w-5 h-5" />} actions={headerActions}>

      {/* Progress bar */}
      <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span className="text-xs md:text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-xs md:text-sm font-bold text-blue-600"><AnimatedCounter to={progressPct} duration={0.8} suffix="%" /></span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <ul className="space-y-1 mb-3 md:mb-4">
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            dispatch={dispatch}
            dragProps={getDragProps(task.id)}
            isBeingDragged={draggingId    === task.id}
            isDropTarget={hoverTargetId === task.id}
          />
        ))}
      </ul>

      {/* Add task form */}
      <form onSubmit={handleAddTask} className="flex gap-2 pt-3 md:pt-4 border-t border-gray-200">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          aria-label="New task title"
          className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={18} />
        </button>
      </form>

    </WidgetCard>
      </motion.div>
  )
}
