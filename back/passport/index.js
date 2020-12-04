const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id, null); // user정보 중, 쿠키와 연결해줄 user.id만 저장
    });

    // 로그인이 성공한 후의 요청들은 아래의 함수가 실행되서 사용자 정보를 가져온다.
    passport.deserializeUser( async (id, done) => {
        try {
            const user = await User.findOne({ where : {id} });
            done(null, user, null); // req.user에 user를 넣어줌
        } catch (error) {
            console.error(error);
            done(error, null, null);
        }
    });

    local();
};