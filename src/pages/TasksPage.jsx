// TasksPage.jsx
// A dedicated full-page view of all tasks — more space than the widget allows
// Shows tasks grouped by priority (High → Medium → Low)
// Includes the same CRUD actions as the widget: toggle, delete, set priority
// State is shared from TaskContext so changes here reflect in the dashboard widget

import { useTaskContext } from '../context/TaskContext'
import PriorityBadge     from '../components/PriorityBadge'
import { FiTrash2, FiCheck } from 'react-icons/fi'

const PRIORITY_ORDER = ['high', 'medium', 'low']

function groupByPriority(tasks) {
  return PRIORITY_ORDER.reduce((groups, priority) => {
    const group = tasks.filter(t => t.priority === priority)
    if (group.length > 0) groups[priority] = group
    return groups
  }, {})
}

function TaskRow({ task, dispatch }) {
  function handlePriorityChange(newPriority) {
    dispatch({ type: 'SET_PRIORITY', payload: { id: task.id, priority: newPriority } })
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <button
        onClick={() => dispatch({ type: 'TOGGLE', payload: task.id })}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {task.completed && <FiCheck className="w-4 h-4 text-white" />}
      </button>

      <span className={`flex-1 font-medium ${
        task.completed ? 'line-through text-gray-400' : 'text-gray-900'
      }`}>
        {task.title}
      </span>

      <PriorityBadge level={task.priority} onChange={handlePriorityChange} />

      <button
        onClick={() => dispatch({ type: 'DELETE', payload: task.id })}
        aria-label={`Delete: ${task.title}`}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  )
}

export default function TasksPage() {
  const { tasks, dispatch, completedCount, totalCount, progressPct } = useTaskContext()
  const grouped = groupByPriority(tasks)

  return (
    <main role="main" aria-label="Tasks" className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl">

        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {completedCount} of {totalCount} completed
          </p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </header>

        <div className="space-y-6 md:space-y-8">
          {PRIORITY_ORDER.map(priority => {
            const group = grouped[priority]
            if (!group) return null
            return (
              <section key={priority} aria-label={`${priority} priority tasks`}>
                <h2 className="flex items-center gap-2 md:gap-3 text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                  <PriorityBadge level={priority} />
                  <span>Priority — {group.length} task{group.length !== 1 ? 's' : ''}</span>
                </h2>
                <div className="space-y-2">
                  {group.map(task => (
                    <TaskRow key={task.id} task={task} dispatch={dispatch} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 text-sm md:text-base">
              No tasks yet — add one from the dashboard!
            </p>
          </div>
        )}

      </div>
    </main>
  )
}
