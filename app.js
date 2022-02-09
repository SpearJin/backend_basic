const { json } = require('express');
const argon2 = require('argon2');
const express = require('express');
const app = express();

const database = [{ id: 1, username: 'abc', password: 'abcdd' }];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 유저 정보 가져오기
app.get('/users', function (req, res) {
  res.send(database);
});

// 회원가입
app.post('/signup', async (req, res) => {
  // abc -> fwelfkjwlef
  const { username, password, age, birthday } = req.body;
  // argon2라이브러리를 통해 password 암호화 시킨다
  const hash = await argon2.hash(password);
  database.push({
    username,
    password: hash,
    age,
    birthday,
  });
  res.send('success');
});

// 로그인
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = database.filter((user) => user.username === username);
  if (user.length === 0) {
    res.status(403).send('해당 하는 id가 없습니다');
    return;
  }
  // password는 암호화가 되었기 때문에 해독을 하고 비교를 한다
  if (!(await argon2.verify(user[0].password, password))) {
    res.status(403).send('패스워드가 틀립니다'); // 앞이 4이면 클라이언트 잘못, 5는 서버 문제
    return;
  }
  res.send('로그인 성공');
});

app.listen(3000, () => {
  console.log('server success conection!!');
});
