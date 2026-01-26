import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import TodoItem from "../components/TodoItem";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
const { user, logout } = useContext(AuthContext);
const navigate = useNavigate()

const handleLogout = () => {
    logout();
    navigate("/");  // redirect to login page
  };

  // 🔹 Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/todos");
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 🔹 Add todo
  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await API.post("/todos", {
        todoTitle: text,
        priority,
        status: "pending",
      });

      setTodos([data, ...todos]);
      setText("");
      setPriority("medium");
    } catch (error) {
      console.error("Failed to add todo");
    }
  };

  // 🔹 Delete todo
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Failed to delete todo");
    }
  };

  // 🔹 Toggle complete / pending
  const toggleComplete = async (todo) => {
    try {
      const newStatus =
        todo.status === "completed" ? "pending" : "completed";

      const { data } = await API.put(`/todos/${todo._id}`, {
        status: newStatus,
      });

      setTodos(todos.map((t) => (t._id === todo._id ? data : t)));
    } catch (error) {
      console.error("Failed to update todo");
    }
  };

  // 🔹 Edit todo
  const editTodo = async (id, newText) => {
    try {
      const { data } = await API.put(`/todos/${id}`, {
        todoTitle: newText,
      });

      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch (error) {
      console.error("Failed to edit todo");
    }
  };

  // 🔹 Logout
 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Todos</h1>

          <button
            onClick={handleLogout}
            className="text-sm px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Input Section */}
        <div className="flex gap-2 mb-5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border rounded"
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
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-400">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-400">No todos yet 👀</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
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
  );
};

export default TodoPage;
