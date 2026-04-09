import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    articleUrl: {
      type: String,
      required: true,
      index: true,
    },
    articleTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
