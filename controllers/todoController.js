const { v4: uuidv4 } = require('uuid');
const { readTodo, writeTodo } = require('../dbs/file');

exports.getAllTodos = async (req, res, next) => {
  try {
    const oldTodos = await readTodo();
    res.status(200).json({ todos: oldTodos, total: oldTodos.length });
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodo();
    const todo = oldTodos.find(item => item.id === id) ?? null;
    res.json({ todo });
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed = false, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'title is required' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'completed must be a boolean' });
    }

    if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ message: 'invalid due date' });
    }

    const newTodo = { title, completed, dueDate, id: uuidv4() };
    const oldTodos = await readTodo();
    oldTodos.unshift(newTodo);
    await writeTodo(oldTodos);
    res.status(201).json({ todo: newTodo });
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;
    const { id } = req.params;

    // validate
    // insert validation here ...
    // end validate

    const oldTodos = await readTodo();
    const newTodo = { title, completed, dueDate, id };
    const mewTodos = oldTodos.map(item => (item.id === id ? newTodo : item));
    await writeTodo(mewTodos);
    res.status(200).json({ todo: newTodo });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodo();
    const newTodos = oldTodos.filter(item => item.id !== id);
    await writeTodo(newTodos);
    res.status(200).json({ message: 'success delete' });
  } catch (err) {
    next(err);
  }
};
