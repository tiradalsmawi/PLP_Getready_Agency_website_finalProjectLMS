const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://Tarrad:4455@cluster0.rwlqs.mongodb.net/TarradAlsamawi?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

  
// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
// Specific page routes
app.use(authRoutes);
app.use('/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});


// app.get('/', (req, res) => {
//   res.render('index', { title: 'Home' }); // يعرض ملف index.ejs الموجود داخل views
// });
// app.get('/login', (req, res) => {
//   res.redirect('/login');
// });
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
 
// app.get('/about', (req, res) => {
//   res.render('about', { title: 'About' });
// });

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});