const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// صفحة التسجيل (Register)
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// التسجيل (POST)
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // التحقق من تطابق كلمات المرور
  if (password !== confirmPassword) {
    return res.render('register', { title: 'Register', error: 'Passwords do not match' });
  }

  // التحقق من وجود مستخدم بنفس البريد الإلكتروني
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render('register', { title: 'Register', error: 'Email already in use' });
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء المستخدم وحفظه في قاعدة البيانات
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.redirect('/'); // بعد التسجيل بنجاح، إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Register', error: 'Error registering user' });
  }
});

// صفحة تسجيل الدخول (Login)
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// تسجيل الدخول (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // العثور على المستخدم باستخدام البريد الإلكتروني
  const user = await User.findOne({ email });
  if (!user) {
    return res.render('login', { title: 'Login', error: 'User not found' });
  }

  // التحقق من تطابق كلمة المرور
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', { title: 'Login', error: 'Invalid credentials' });
  }

  // حفظ بيانات الجلسة بعد تسجيل الدخول
  req.session.userId = user._id;

  // التوجيه إلى الصفحة الرئيسية أو لوحة التحكم بعد تسجيل الدخول
  res.redirect('/blogs');
});

module.exports = router;
