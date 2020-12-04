const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Post, User, Image, Comment } = require('../models');

/**
 * 게시글 불러오기
 */
router.get('/', async (req, res, next) => {
    try {
        const where = {};
        const lastId = parseInt(req.query.lastId, 10);
        if (lastId) { // 첫 로딩이 아니고 스크롤이 내려져서 게시물을 더 불러올 때
            where.id = { [Op.lt]: lastId } //lastId보다 작은 거
        }
        const posts = await Post.findAll({
            limit: 10,
            where,
            // offset: 0,
            // where: { id: lastId },
            order: [
                ['createdAt', 'DESC'], // 최신글부터 정렬
                [Comment, 'createdAt', 'DESC']
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname']
            }, {
                model: Image
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
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }, {
                    model: Image
                }]
            }]
        });
        // offset 방식 : offset+1 번부터 10개 가져와라
        // lastId 방식 : lastId부터 10개 가져와라
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;