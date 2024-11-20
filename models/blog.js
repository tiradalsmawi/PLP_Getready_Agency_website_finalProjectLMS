// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const blogSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   snippet: {
//     type: String,
//     required: true,
//   },
//   body: {
//     type: String,
//     required: true
//   },
// }, { timestamps: true });

// const Blog = mongoose.model('Blog', blogSchema);
// module.exports = Blog;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['scholarships', 'opportunities', 'abroad', 'jobs'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
