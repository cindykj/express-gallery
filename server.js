// Modules
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Redis = require('connect-redis')(session);

// Routes
const knex = require('./db/knex.js')
const galleryRoutes = require('./routes/gallery');
const registerRoutes = require('./routes/register');
const User = require('./db/models/User');


// Port
const saltRounds = 12;
const PORT = process.env.PORT || 3000;
const app = express();

// Static public
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static('public')); why not this??
app.engine('.hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({ 
  store: new Redis(),
  secret: 'keyboard cat', //secret is session's way of salting
  resave: false,
  saveUninitialized: false
}));

app.use('/gallery', galleryRoutes);
app.use('/register', registerRoutes);


//PASSPORT STUFF
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User ({ id: user.id }).fetch() // db.users.findOne({ where: { id: user.id}})
    .then(user => {
      return done(null, {
        id: user.id,
        username: user.username
      });
    });
});

passport.use(new LocalStrategy(function(username, password, done) { //grabbing username
  console.log('client-side username', username);
  console.log('client-side password', password);
  
  return new User({ username: username }).fetch() //use username to find username by username
  
  .then ( user => {
    console.log('user', user);
    user = user.toJSON();
    if (user === null) {
      return done(null, false, {message: 'bad username or password'}); //first param = , second param = truthy or false, second is message of why that error is; username didn't match!
    }
    else {
      bcrypt.compare(password, user.password) //use bcrypt to compare; first password is input, user.password is stored in DB; 
      .then(res => {
        if (res) { return done(null, user); } //if true, then they match
        else {

          return done(null, false, {message: 'bad username or password'}); //sending error bc password didn't match!
        }
      });
    }
  })
  .catch(err => { console.log('error: ', err); });
}));

//smoke test
app.get(`/`, (req, res) => {
  console.log('smoke test');
  res.send(`smoke test`)
})


//LOGIN ACTIVITIES: ROUTES, I 
app.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery', //success works!
  failureRedirect: '/login' //fail works
}));

app.get('/login', (req, res) => {
  console.log('req.body', req.body);
  return res.render('./templates/gallery/login')
});


app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});





function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) { next();}
  else { res.redirect('/'); }
}

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user id', req.user.id);
  console.log('req.username', req.user.username);
  res.send('you found the secret!');
});


app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`Server is now connected to ${PORT}`);
})


