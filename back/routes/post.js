const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/**
 * uploads 폴더 없으면 uploads폴더 생성
 */
try {
    fs.accessSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // 파일명
            done(null, basename + '_' + new Date().getTime() + ext); // 파일명1231255123.png
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/**
 * 게시글 가져오기
 */
router.get('/:postId', async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
              model: User,
              attributes: ['id', 'nickname'],
            }, {
              model: Image,
            }, {
              model: Comment,
              include: [{
                model: User,
                attributes: ['id', 'nickname'],
                order: [['createdAt', 'DESC']],
              }],
            }, {
              model: User, // 좋아요 누른 사람
              as: 'Likers',
              attributes: ['id'],
            }],
          });
          res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 게시글 작성
 */
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const hashTags = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        if (hashTags) {
            const result = await Promise.all(hashTags.map(tag => {
                return Hashtag.findOrCreate({ // findOrCreate : 있으면 찾고 없으면 생성
                    where: { name: tag.slice(1).toLowerCase() }
                })
            })); // [['#노드', true], ['#리액트' false]]
            console.log(result);
            await post.addHashtags(result.map(v => v[0]));
        }

        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지를 여러개 올린 경우
                const images = await Promise.all(req.body.image.map((image) => Image.create({src: image})));
                await post.addImages(images);
            } else { // 이미지를 하나만 올린 경우
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                    order: [['createdAt', 'DESC']]
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname']
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id']
            }]
        });

        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error)
    }
});

/**
 * 게시글 삭제
 */
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.postId,
                UserId: req.user.id,
            }
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시물입니다.')
        }
        await Post.destroy({
            where: { id: req.params.postId },
        });
        res.status(200).json(parseInt(req.params.postId, 10));
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/**
 * 댓글 작성
 */
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시물입니다.')
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });

        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [
                {model: User, attributes: ['id', 'nickname']},
            ]
        })
        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error)
    }
});

/**
 * 좋아요, 좋아요 취소
 */
router.patch('/:postId/like', async (req, res, next) => {
    try {
        const post  = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다');
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id })
    } catch (error) {
        console.error(error);
        next(error)
    }
});
router.delete('/:postId/like', async (req, res, next) => {
    try {
        const post  = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다');
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id })
    } catch (error) {
        console.error(error);
        next(error)
    }
});

/**
 * 이미지 업로드
 */
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
    res.json(req.files.map((v) => v.filename));
});

/**
 * 리트윗
 */
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post, 
                as: 'Retweet',
            }]
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시물입니다.');
        }

        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            // 자신의 게시글을 리트윗하는 경우 ||
            // 남이 리트윗한 자신의 게시글을 리트윗하는 경우
            return res.status(403).send('자신의 게시글은 리트윗할 수 없습니다.');
        }

        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId
            }
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗 했습니다.');
        }

        const retweet =  await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });

        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }, {
                    model: Image
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname']
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id']
            }]
        })
        res.status(200).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;