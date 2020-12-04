/**
 * old
 */
// module.exports = (sequelize, DataTypes) => {
//     const Post = sequelize.define('Post', {
//         content: {
//             type: DataTypes.TEXT,
//             allowNull: false,
//         },
//     }, {
//         charset: 'utf8mb4',
//         collate: 'utf8mb4_general_ci' //한글 + 이모티콘
//     });

//     Post.associate = (db) => {
//         db.Post.belongsTo(db.User); // Post:User = n:1
//         db.Post.hasMany(db.Comment); // Post:Comment = 1:n
//         db.Post.hasMany(db.Image); // Post:Image = 1:n
//         db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'}); // Post:Hashtag = n:n
//         db.Post.belongsToMany(db.User, {through:'Like', as:'Likers'}); // Post(좋아요):User = n:n
//         // through = n:n 중간 테이블 명
//         // as = Post와 User의 관계에 대한 선언이 2개 이상되어 있으므로 구분을 지어주는 역할 (컬럼명이 Likers로 만들어짐)
//         db.Post.belongsTo(db.Post, { as: 'Retweet'});
//     };
//     return Post;
// }

/**
 * new
 */
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        }, {
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', //한글 + 이모티콘
            sequelize,
        })
    }

    static associatie(db) {
        db.Post.belongsTo(db.User); // Post:User = n:1
        db.Post.hasMany(db.Comment); // Post:Comment = 1:n
        db.Post.hasMany(db.Image); // Post:Image = 1:n
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'}); // Post:Hashtag = n:n
        db.Post.belongsToMany(db.User, {through:'Like', as:'Likers'}); // Post(좋아요):User = n:n
        // through = n:n 중간 테이블 명
        // as = Post와 User의 관계에 대한 선언이 2개 이상되어 있으므로 구분을 지어주는 역할 (컬럼명이 Likers로 만들어짐)
        db.Post.belongsTo(db.Post, { as: 'Retweet'});
    }
}