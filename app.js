const express = require('express');

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

// 2. ค้นหาด้วย Id
// METHOD: GET, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Todo Object OR NULL

// 3. เพิ่มข้อมูล
// METHOD: POST, ENDPOINT URL: /todos
// INPUT: BODY (title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
// OUTPUT: NEW Todo Object OR Error Message

// 4. แก้ไขข้อมูล
// METHOD: PUT, ENDPOINT URL: /todos/:id
// INPUT: BODY (title: REQUIRED, completed: DEFAULT(FALSE) , dueDate: -)
//        PARAMS (id)
// OUTPUT: UPDATED Todo Object OR Error Message

// 5. ลบข้อมูล
// METHOD: DELETE, ENDPOINT URL: /todos/:id
// INPUT: PARAMS (id)
// OUTPUT: Success Message OR Error Message

app.listen(8000, () => console.log('server running on port: 8000'));
