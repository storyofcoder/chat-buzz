var createError = require('http-errors');
var express = require('express');
const http = require('http');
const socketio = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');
var Profile = require('./models/profile');
var Messages = require('./models/messages');

var app = express();
const server = http.createServer(app);
const io = socketio(server);

mongoose.connect('mongodb://muny:9812126109m@ds157834.mlab.com:57834/green-mart');
require('./config/passport');

// view engine setup
app.engine('hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
let client = [];
idtosocket = {};

io.on('connection', (socket) => {

    const userid = client.length;

    socket.on('addidtosocket', (data) => {
        socket.join(socket.id);
        idtosocket[data.id] = socket.id;
    });

    socket.on('newmsg', (data) => {
        var user_id = data.user_id;
        var friend_id = data.friend_id;
        var message = data.message;

        Messages.findOne({user: user_id}, function (err, old_messages) {
            if (err) {
                console.log('user messages database not found');
            } else {
                var messages = [];
                messages = old_messages.data.slice();
                var count = 0;
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].friend_id == friend_id) {
                        count++;
                        messages[i].messages.push({
                            user: 1,
                            time: (new Date().getHours() % 24) + " " + new Date().getMinutes(),
                            status: 1,
                            message: message
                        });
                        break;
                    }
                }
                if (count == 0) {
                    messages.unshift({
                        friend_id: friend_id,
                        messages: [{
                            user: 1,
                            time: new Date().getTime(),
                            status: 1,
                            message: message
                        }]
                    })
                }

                Messages.findOneAndUpdate({user: user_id}, {data: messages}, function (err, data) {
                    if (err) {
                        console.log('error in new updation method');
                    }
                })
            }
        });

        Messages.findOne({user: friend_id}, function (err, old_messages) {
            if (!old_messages) {
                var addmsg = new Messages({
                    user: friend_id,
                    data: [{
                        friend_id: user_id,
                        messages: [{
                            user: 0,
                            time: (new Date().getHours() % 24) + " " + new Date().getMinutes(),
                            status: 1,
                            message: message
                        }]
                    }]
                });

                addmsg.save(function (err, result) {
                    console.log(result);
                })

            } else {
                var messages = [];
                messages = old_messages.data.slice();
                var count = 0;
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].friend_id == user_id) {
                        count++;
                        messages[i].messages.push({
                            user: 0,
                            time: (new Date().getHours() % 24) + " " + new Date().getMinutes(),
                            status: 1,
                            message: message
                        });
                        break;
                    }
                }
                if (count == 0) {
                    messages.unshift({
                        friend_id: user_id,
                        messages: [{
                            user: 0,
                            time: new Date().getTime(),
                            status: 1,
                            message: message
                        }]
                    })
                }

                Messages.findOneAndUpdate({user: friend_id}, {data: messages}, function (err, data) {
                    if (err) {
                        console.log('error in new updation method');
                    }
                    // console.log(data);
                })
            }
        });

        io.in(idtosocket[friend_id]).emit('receive_message', {
            user: 0,
            time: new Date().getTime(),
            status: 1,
            message: message
        })
    });

    socket.on('get_new_user', () => {
        Profile.find({}, function (err, all_member) {
            if (err) {
                return res.redirect('/munny');
            }
            socket.emit('all_active', {all_member: all_member});
        });
    });
    socket.on('disconnect', () => {
        console.log('client connection terminated user id', userid);
        client = client.filter((client) => client.userid !== userid);
    });
});

app.use('/', userRoutes);
app.use('/profile', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(9999, function () {
    console.log("server run on port no : 9999");
});
