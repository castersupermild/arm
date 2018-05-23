const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ECT = require('ect');
const helpers = require('./helpers/functions');
const frontLib = require('./lib/lib.js');
const mongoose = require('mongoose');
const config = require('config');
const passport = require('passport');
const { twitterStrategy } = require('./routes/auth');
const csurf = require('csurf');
const { appLogger } = require('./logging/logger');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth').router;
const matchRouter = require('./routes/match');
const ruleRouter = require('./routes/rule');

const app = express();

const productionMode = app.get('env') === 'production';
if (productionMode) {
  app.enable('trust proxy');
  app.set('x-powered-by', false);
}

// register helpers
app.locals.helpers = helpers;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(
  'ect',
  ECT({ watch: true, root: `${__dirname}/views`, ext: '.ect' }).render
);
app.set('view engine', 'ect');

// access log
app.use(logger(productionMode ? 'combined' : 'short'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// auth setting
passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((obj, callback) => {
  callback(null, obj);
});

passport.use(twitterStrategy);
// session
app.use(frontLib.web.session);
app.use(passport.initialize());
app.use(passport.session());

// for csrf
app.use(csurf({ cookie: true }));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/auth/mypage');
  }
);

// request mixin
app.use(frontLib.web.useRequestMixin);

// response mixin
app.use(frontLib.web.useResponseMixin);

// routing
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/match', matchRouter);
app.use('/rule', ruleRouter);

// mongodb initialize
const mongodbConfig = config.get('mongodb');
mongoose.connect(
  `mongodb://${mongodbConfig.user}:${mongodbConfig.password}@${
    mongodbConfig.host
  }/${mongodbConfig.db}${mongodbConfig.parameter}`
);
const db = mongoose.connection;
db.on('error', appLogger.error.bind(console, 'connection error:'));
db.once('open', () => {
  appLogger.info(`we're connected!`);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res /* , next */) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
