/**
 * old
 */
// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('User', { //MySQL에는 users 테이블이 생성
//         // id가 기본적으로 들어있다.
//         email: {
//             type: DataTypes.STRING(30),
//             allowNull: false, //필수
//             unique: true,
//         },
//         nickname: {
//             type: DataTypes.STRING(30),
//             allowNull: false,
//         },
//         password: {
//             type: DataTypes.STRING(100),
//             allowNull: false,
//         },
//     }, {
//         charset: 'utf8',
//         collate: 'utf8_general_ci' //한글
//     });

//     User.associate = (db) => {
//         db.User.hasMany(db.Post); // User:Post = 1:n
//         db.User.hasMany(db.Comment); // User:Post = 1:n
//         db.User.belongsToMany(db.Post, {through:'Like', as:'Liked'}); // User:Post(좋아요) = n:n
//         db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'});
//         db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'});
//         // foreignKey = 이 값으로 컬럼명이 설정됨
//     };
//     return User;
// }

/**
 * new
 */
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            // id가 기본적으로 들어있다.
            email: {
                type: DataTypes.STRING(30),
                allowNull: false, //필수
                unique: true,
            },
            nickname: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        }, {
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci', //한글
            sequelize,
        })
    }

    static associate(db) {
        db.User.hasMany(db.Post); // User:Post = 1:n
        db.User.hasMany(db.Comment); // User:Post = 1:n
        db.User.belongsToMany(db.Post, {through:'Like', as:'Liked'}); // User:Post(좋아요) = n:n
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'});
        db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'});
        // foreignKey = 이 값으로 컬럼명이 설정됨
    }
}