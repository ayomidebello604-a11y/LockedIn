// TaskContext.jsx
// Manages the full task list for the Task Manager widget
// Supports: add, toggle done, delete, set priority, drag-reorder
// All tasks are saved to localStorage so they survive page refresh

import { createContext, useContext, useReducer, useEffect } from 'react'

const TaskContext = createContext(null)

const LOCAL_STORAGE_KEY = 'productivity_tasks'

const seedTasks = [
  { id: 'task-1', title: 'Set up Vite and React project', completed: true,  priority: 'low'    },
  { id: 'task-2', title: 'Build the dashboard grid layout', completed: true,  priority: 'low'    },
  { id: 'task-3', title: 'Port the quote app as a widget',  completed: true,  priority: 'medium' },
  { id: 'task-4', title: 'Build the weather widget',        completed: false, priority: 'medium' },
  { id: 'task-5', title: 'Connect the NewsAPI feed',        completed: false, priority: 'high'   },
]

function readFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedTasks
  } catch {
    return seedTasks
  }
}

function taskReducer(tasks, action) {
  switch (action.type) {

    case 'ADD':
      const newTask = {
        id: `task-${Date.now()}`,
        title: action.payload,
        completed: false,
        priority: 'medium',
      }
      return [...tasks, newTask]

    case 'TOGGLE':
      return tasks.map(t =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      )

    case 'DELETE':
      return tasks.filter(t => t.id !== action.payload)

    case 'SET_PRIORITY':
      return tasks.map(t =>
        t.id === action.payload.id ? { ...t, priority: action.payload.priority } : t
      )

    case 'REORDER':
      return action.payload

    default:
      return tasks
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], readFromStorage)

  // Sync to localStorage every time the task list changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount     = tasks.length
  const progressPct    = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <TaskContext.Provider value={{ tasks, dispatch, completedCount, totalCount, progressPct }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be called inside <TaskProvider>')
  }
  return context
}
