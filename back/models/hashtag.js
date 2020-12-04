/**
 * old
 */
// module.exports = (sequelize, DataTypes) => {
//     const Hashtag = sequelize.define('Hashtag', {
//         name: {
//             type: DataTypes.STRING(20),
//             allowNull: false,
//         },
//     }, {
//         charset: 'utf8mb4',
//         collate: 'utf8mb4_general_ci' //한글 + 이모티콘
//     });

//     Hashtag.associate = (db) => {
//         db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'}); // Hashtag:Post = n:n
//     };
//     return Hashtag;
// }

/**
 * new
 */
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        }, {
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', //한글 + 이모티콘
            sequelize
        })
    }

    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'}); // Hashtag:Post = n:n
    }
}