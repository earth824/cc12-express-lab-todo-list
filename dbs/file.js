const { readFile, writeFile } = require('fs/promises');

exports.readTodo = () =>
  readFile('dbs/todolist.json', 'utf-8').then(res => JSON.parse(res));

exports.writeTodo = data =>
  writeFile('dbs/todolist.json', JSON.stringify(data), 'utf-8');
