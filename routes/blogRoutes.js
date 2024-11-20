// const express = require('express');
// const blogController = require('../controllers/blogController');

// const router = express.Router();

// router.get('/create', blogController.blog_create_get);
// router.get('/', blogController.blog_index);
// router.post('/', blogController.blog_create_post);
// router.get('/:id', blogController.blog_details);
// router.delete('/:id', blogController.blog_delete);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

// التحقق من المشرف
function isAdmin(req, res, next) {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        if (user.role === 'admin') {
          next();
        } else {
          res.status(403).send('Access denied');
        }
      })
      .catch(err => res.status(500).send('Error checking admin'));
  } else {
    res.redirect('/login');
  }
}

// صفحة إضافة المدونة
router.get('/create', isAdmin, (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

router.post('/', isAdmin, (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    author: req.session.userId,
  });
  blog.save()
    .then(result => res.redirect('/blogs'))
    .catch(err => console.log(err));
});

module.exports = router;
