import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import TodoPage from "./pages/TodoPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
