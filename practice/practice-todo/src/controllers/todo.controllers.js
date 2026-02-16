import Todo from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTodo = async (req, res) => {
  const { todoTitle, status } = req.body;

  if (!todoTitle) {
    throw new ApiError(400, "Todo title is required");
  }

  const todo = await Todo.create({
    todoTitle,
    status,
    user: req.user._id,
  });

  res.status(201).json(todo);
};

export const getTodo = async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Not authorized");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTodo);
};

export const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Not authorized");
  }

  await todo.deleteOne();
  res.json({ message: "Todo removed" });
};
