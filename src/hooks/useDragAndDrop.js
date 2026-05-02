// useDragAndDrop.js
// Custom hook that powers native HTML5 drag-and-drop reordering
// Used inside TaskWidget to let the user drag tasks up and down the list
// Calls onReorder(newArray) whenever a drop is completed successfully

import { useState, useRef } from 'react'

export function useDragAndDrop(items, onReorder) {
  const [draggingId, setDraggingId] = useState(null)  // id of the item being dragged
  const [hoverTargetId, setHoverTargetId] = useState(null)  // id of the item being hovered over
  const draggingElement = useRef(null)

  function onDragStart(event, itemId) {
    setDraggingId(itemId)
    draggingElement.current = event.currentTarget
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', itemId)

    // Slight visual delay so the browser snapshot looks right
    requestAnimationFrame(() => {
      if (draggingElement.current) {
        draggingElement.current.style.opacity = '0.45'
      }
    })
  }

  function onDragEnterTarget(itemId) {
    if (itemId !== draggingId) {
      setHoverTargetId(itemId)
    }
  }

  function onDragOverTarget(event) {
    // Must call preventDefault to allow dropping
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function onDropOnTarget(event, targetId) {
    event.preventDefault()

    if (draggingId === targetId) return

    const fromIndex = items.findIndex(item => item.id === draggingId)
    const toIndex   = items.findIndex(item => item.id === targetId)

    if (fromIndex < 0 || toIndex < 0) return

    const reordered   = [...items]
    const [draggedItem] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, draggedItem)

    onReorder(reordered)
    cleanup()
  }

  function onDragEnd() {
    cleanup()
  }

  function cleanup() {
    if (draggingElement.current) {
      draggingElement.current.style.opacity = '1'
    }
    draggingElement.current = null
    setDraggingId(null)
    setHoverTargetId(null)
  }

  // Returns props to spread onto each draggable item element
  function getDragProps(itemId) {
    return {
      draggable:      true,
      onDragStart:    (e) => onDragStart(e, itemId),
      onDragEnter:    ()  => onDragEnterTarget(itemId),
      onDragOver:     onDragOverTarget,
      onDrop:         (e) => onDropOnTarget(e, itemId),
      onDragEnd:      onDragEnd,
    }
  }

  return {
    draggingId,
    hoverTargetId,
    getDragProps,
  }
}
