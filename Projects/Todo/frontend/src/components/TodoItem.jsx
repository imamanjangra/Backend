import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Save,
} from "lucide-react"

const priorityColors = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
}

const TodoItem = ({ todo, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(todo.text)

  const saveEdit = () => {
    onEdit(todo.id, newText)
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center gap-3">
        {todo.completed ? (
          <CheckCircle
            className="text-green-500 cursor-pointer"
            onClick={() => onToggle(todo.id)}
          />
        ) : (
          <XCircle
            className="text-gray-400 cursor-pointer"
            onClick={() => onToggle(todo.id)}
          />
        )}

        {isEditing ? (
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="border p-1 rounded"
          />
        ) : (
          <span
            className={`${
              todo.completed
                ? "line-through text-gray-400"
                : ""
            } font-medium`}
          >
            {todo.text}
          </span>
        )}

        <span
          className={`text-xs px-2 py-1 rounded ${priorityColors[todo.priority]}`}
        >
          {todo.priority.toUpperCase()}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <Save
            className="text-blue-500 cursor-pointer"
            onClick={saveEdit}
          />
        ) : (
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        )}

        <Trash2
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(todo.id)}
        />
      </div>
    </div>
  )
}

export default TodoItem
