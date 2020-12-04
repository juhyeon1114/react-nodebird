const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');


// db객체에 모델들 등록 (table 생성)
/**
 * old
 */
// db.Comment = require('./comment')(sequelize, Sequelize);
// db.Hashtag = require('./hashtag')(sequelize, Sequelize);
// db.Image = require('./image')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.User = require('./user')(sequelize, Sequelize);

/**
 * new
 */
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
});

// db객체를 돌면서 각 db파일의 associate함수 실행 (관계 연결)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
