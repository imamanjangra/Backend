import express from "express"
import {createTodo , getTodo , updatedTodo , deleteTodo} from "../controllers/todo.controllers.js"
import {protect} from "../middleware/auth.middleware.js"
const router = express.Router()

router.route('/')
.get(protect , getTodo)
.post(protect , createTodo)

router.route('/:id')
.put(protect , updatedTodo)
.delete(protect , deleteTodo)





export default router