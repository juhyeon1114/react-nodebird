// const http = require('http');
// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method);
//     res.end('hello node');
// });

// server.listen(3065, ()=> {
//     console.log('서버 실행 중')
// });
///////////////// 위 === 노드 서버 예시

/**
 * 라이브러리
 */
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const db = require('./models/index');
const passportConfig = require('./passport');
passportConfig();
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const hpp = require('hpp');

/**
 * router 선언
 */
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');

/**
 * db 연결, 실행
 */
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch((error) => {
        console.error(error);
    });
    
/**
 * middleware
 */
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
} else {
    app.use(morgan('dev')); // 프론트에서 날아온 요청들이 콘솔에 찍힘
}
app.use(cors({
    origin: ['http://localhost:3000', 'nodebird.com'],
    // origin: true, // Access-Control-Allow-Origin : true -> cors 항상 허용
    credentials: true, // Access-Control-Allow-Credentials : true -> 쿠키를 같이 전달하고 싶으면 true
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // 프론트에서 넘어온 json형식의 데이터를 req.body에 넣어줌
app.use(express.urlencoded({ extended: true })); // 프론트에서 폼을 제출했을 때 넘어오는 데이터를 받음
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // 로그인 토큰만들 때, 사용하는 키
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * router 실행
 */
app.get('/', (req, res) => {
    res.send('hello express');
});
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
    console.log('서버 실행 중');
});