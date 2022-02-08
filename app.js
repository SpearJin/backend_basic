const { json } = require('express');
const express = require('express');
const app = express();

const database = [
  { id: 1, title: '글1' },
  { id: 2, title: '글2' },
  { id: 3, title: '글3' },
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 정보 불러오기
app.get('/database', function (req, res) {
  res.send(database);
});

// 특정 정보만 불러오기
app.get('/database/:id', function (req, res) {
  const id = req.params.id;
  const data = database.find((item) => item.id === Number(id));
  res.send(data);
});

// 정보 추가
app.post('/database', function (req, res) {
  const id = database.length + 1;
  const title = req.body.title;
  database.push({ id, title });
  res.send('추가!!!');
});

// 정보 수정
app.put('/database', function (req, res) {
  const id = req.body.id;
  const title = req.body.title;
  database[id - 1].title = title;
  res.send('수정!!!');
});

// 정보 삭제
app.delete('/database', function (req, res) {
  const id = req.body.id;
  database.splice(id - 1, 1);
  res.send('삭제!!!');
});

app.listen(3000, () => {
  console.log('server success conection!!');
});
