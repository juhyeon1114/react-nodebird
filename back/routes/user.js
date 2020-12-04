const express = require('express');
const bcrypt = require('bcrypt');
const { User, Post } = require('../models'); // === db.User
const passport = require('passport');
const db = require('../models');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

/**
 * 로그인 갱신
 */
router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ['password'] },
                include: [{
                    model: Post,
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id']
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 로그인, 로그아웃
 */
router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }

        if (info) {
            console.error(err);
            return res.status(401).send(info.reason);
        }

        // nodebird가 아니라 passport에 로그인하는 과정
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }

            /**
             * res.setHeader('Cookie', 'xyz...')
             * 내부적으로 위와 같은 코드가 실행되서 자동으로 쿠키를 브라우저에 저장해줌
             * 백엔드의 세션과도 알아서 연결해줌
             */

            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                // attributes: ['id', 'nickname', 'email'],
                attributes: { exclude: ['password'] },
                include: [{
                    model: Post,
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id']
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id']
                }]
            })
            
            return res.status(200).json(fullUserWithoutPassword); // 최종적으로 로그인이 성공한 경우 -> 사용자 정보를 프론트에 넘겨준다.
        })
    })(req, res, next);
});

/**
 * 회원가입
 */
router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                email : req.body.email
            }
        });

        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }  

        const hashedPassword = await bcrypt.hash(req.body.password, 12); // 보통 10~13정도 입력. 숫자가 높을 수록 암호화 강도가 높아짐
        await User.create({
            email: req.body.email,
            nickname: req.body.nick,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.status(200).send('ok');
    } catch (error) {
        console.error(error);
        next(error); // status 500
    }
});

/**
 * 닉네임 변경
 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname
        }, {
            where: { id: req.user.id }
        });
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 팔로우, 언팔로우
 */
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.userId }
        });
        if (!user) {
            return res.status(403).send('사용자를 찾을 수 없습니다.');
        }

        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.userId }
        });
        if (!user) {
            return res.status(403).send('사용자를 찾을 수 없습니다.');
        }

        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.get('/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id }
        });
        if (!user) {
            res.status(403).send('사용자를 찾을 수 없습니다');
        }

        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10)
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.get('/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id }
        });
        if (!user) {
            res.status(403).send('사용자를 찾을 수 없습니다');
        }

        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10)
        });
        res.status(200).json(followings)
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const me = await User.findOne({
            where: { id: req.user.id }
        });
        if (!me) {
            return res.status(403).send('사용자를 찾을 수 없습니다');
        }

        await me.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });

    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;