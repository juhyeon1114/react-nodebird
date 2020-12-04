const express = require('express');
const { Hashtag, Post, User, Image, Comment } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

/**
 * 게시글 가져오기
 */
router.get('/:hashtag', async (req, res, next) => {
    try {
        const where = {};
        if (parseInt(req.query.lastId, 10)) {
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        }

        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Hashtag,
                where: {name: decodeURIComponent(req.params.hashtag)}
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                    order: [['createdAt', 'DESC']]
                }]
            }]
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;