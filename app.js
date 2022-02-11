const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { validUser } = require('./middleware/auth');
const database = require('./database');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// 유저 정보 가져오기
app.get('/users', (req, res) => {
  res.send(database);
});

app.get('/secure_data', validUser, (req, res) => {
  res.send('인증된 사용자만 쓸 수 있는 API');
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
  const access_token = jwt.sign({ username }, 'secure');
  console.log(access_token);
  res.cookie('access_token', access_token, {
    httpOnly: true, // 클라이언트에서 토큰을 읽을수 없게 함
  });
  res.send('로그인 성공12');
});

app.listen(3000, () => {
  console.log('Sucess Connect');
});
