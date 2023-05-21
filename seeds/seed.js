const sequelize = require('../config/connection');
const { User, Post, Comment, Message} = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');
const msgData = require('./msgData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  const posts = await Post.bulkCreate(postData);
  const comment = await Comment.bulkCreate(commentData);
  const msg = await Message.bulkCreate(msgData)

  process.exit(0);
};

seedDatabase();