import { useState } from "react"
import TodoItem from "../components/TodoItem"

const TodoPage = () => {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState("")
  const [priority, setPriority] = useState("medium")

  const addTodo = () => {
    if (!text) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
      },
    ])

    setText("")
    setPriority("medium")
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      {/* MAIN CARD */}
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-4 text-center">
          My Todos
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What needs to be done?"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400">
              No todos yet 👀
            </p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggle={toggleComplete}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoPage
