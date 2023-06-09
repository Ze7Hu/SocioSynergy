const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Message = require("./Message");


User.hasMany(Post, {
  foreignKey: "user_id", 
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});


User.hasMany(Message, {
  foreignKey: "recipient_id",
  onDelete: "CASCADE",
});

User.hasMany(Message, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
});

Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
  onDelete: "CASCADE",
});

Message.belongsTo(User, {
  foreignKey: "recipient_id",
  as: "recipient",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

module.exports = { User, Post, Comment, Message };
