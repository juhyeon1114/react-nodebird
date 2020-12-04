const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => {
        // done()은 콜백함수
        try {
            const user = await User.findOne({
                where: { email }
            });
    
            if (!user) {
                return done(null, false, { reason: '존재하지 않는 사용자입니다.' }); // 서버에러, 성공, 클라이언트에러
            }
    
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user, null); // 성공
            }
            return done(null, false, { reason: '비밀번호 틀림' });
        } catch (error) {
            console.error(error);
            return done(error, false, null);
        }
    }));
};