const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // تأكد من تثبيت bcryptjs باستخدام `npm install bcryptjs`
const User = require('../models/User');

// صفحة التسجيل
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || 'user',
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error creating user');
  }
});

// صفحة تسجيل الدخول
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      res.redirect('/blogs');
    } else {
      res.status(401).send('Incorrect email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Login error');
  }
});

module.exports = router;
