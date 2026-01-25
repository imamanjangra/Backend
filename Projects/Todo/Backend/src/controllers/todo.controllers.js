import Todo from "../models/todo.model.js"

export const createTodo = async (req , res) => {
    try {
        const {todoTitle , status , priority} = req.body;
        if (!todoTitle) {
            return res.status(400).json({ message: 'user is already exists' });
        }

        const todo = await Todo.create({
            todoTitle,
            status,
            priority,
            user: req.user._id
        })

        res.status(201).json(todo);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to create todo !!!' });
    }
}

export const getTodo = async(res , req) => {
    try {
        const todo = await Todo.find({user: req.user._id})
        res.json(todo)
    } catch (error) {
        return res.status(400).json({ message: 'Failed to fetch todo !!!' });
    }
}

export const updatedTodo = async(res , req) => {
    try {
        const todo = await Todo.findById(req.params.id);

        
        if(!todo){
            return res.status(404).json({ message: 'todo not found !!!' });
        }

        if(todo.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: 'not authorized !!!' });

        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.json(updatedTodo)
    } catch (error) {
         return res.status(400).json({ message: 'Failed to update todo !!!' });
    }
}

export const deleteTodo = async(res , req) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if(!todo){
            return res.status(404).json({ message: 'todo not found !!!' });
        }

         if(todo.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: 'not authorized !!!' });

        }

        const deleteTodo = await Todo.deleteOne();
        res.json({message : "Todo removed "})
    } catch (error) {
        return res.status(400).json({ message: 'Failed to delete todo !!!' });
    }
}