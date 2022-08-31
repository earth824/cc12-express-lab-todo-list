const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFile, writeFile } = require('fs/promises');
const { readTodo, writeTodo } = require('./dbs/file');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// todo object {
//   id: STRING, UNIQUE, REQUIRED
//   title: STRING, REQUIRED
//   completed: BOOLEAN, REQUIRED, DEFAULT:FALSE
//   dueDate: STRING
// }

// Design โดยใช้ REST API
// 1. ค้นหาทั้งหมด
// METHOD: GET, ENDPOINT URL: /todos
// INPUT: QUERY ( title, completed, dueDate, offset, limit, sort )
// OUTPUT: ARRAY Todo Object, TOTAL
app.get('/todos', async (req, res) => {
  try {
    const oldTodos = await readTodo();
    res.status(200).json({ todos: oldTodos, total: oldTodos.length });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// 2. ค้นหาด้วย Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Todo Object OR NULL
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodo();
    const todo = oldTodos.find(item => item.id === id) ?? null;
    res.json({ todo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// 3. เพิ่มข้อมูล
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY (title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
// OUTPUT: NEW Todo Object OR Error Message
app.post('/todos', (req, res) => {
  const { title, completed = false, dueDate } = req.body;
  // !!!BAD
  // if (
  //   title &&
  //   typeof completed === 'boolean' &&
  //   (dueDate === undefined || !isNaN(new Date(dueDate).getTime()))
  // ) {
  //   ///Create Todo
  // } else {
  //   // Error
  //   res.status(400).json({ message: 'invalid due date' });
  // }

  if (!title || !title.trim()) {
    res.status(400).json({ message: 'title is required' });
  } else if (typeof completed !== 'boolean') {
    res.status(400).json({ message: 'completed must be a boolean' });
  } else if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
    res.status(400).json({ message: 'invalid due date' });
  } else {
    const newTodo = { title, completed, dueDate, id: uuidv4() };
    readFile('dbs/todolist.json', 'utf-8')
      .then(data => {
        const oldTodos = JSON.parse(data);
        oldTodos.unshift(newTodo);
        return writeFile(
          'dbs/todolist.json',
          JSON.stringify(oldTodos),
          'utf-8'
        );
      })
      .then(() => {
        res.status(201).json({ todo: newTodo });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  }
});

// 4. แก้ไขข้อมูล
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY (title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
//        PARAMS (id)
// OUTPUT: UPDATED Todo Object OR Error Message
app.put('/todos/:id', async (req, res) => {
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
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// 5. ลบข้อมูล
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR Error Message
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oldTodos = await readTodo();
    const newTodos = oldTodos.filter(item => item.id !== id);
    await writeTodo(newTodos);
    res.status(200).json({ message: 'success delete' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(8000, () => console.log('server running on port: 8000'));
