const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PostSchema = new Schema({
  content: String,
  _creator: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
