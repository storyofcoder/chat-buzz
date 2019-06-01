var express = require('express');
var router = express.Router();
var Profile = require('../models/profile');
var Messages = require('../models/messages');
const translate = require('google-translate-api');

/* GET home page. */


router.get('/:id', function (req, res, next) {
    var Id = req.params.id;

    Profile.findOne({user: Id}, function (err, profile) {
        if (err) {
            return res.redirect('/munny');
        }
        res.render('user/user_profile', {
            profile: profile,
            user_profile: 0,
        });
    });

});

router.get('/all/messages/:id', function (req, res, next) {
    var Id = req.params.id;
    // res.render('user/message_list');

    Messages.findOne({user: Id}, function (err, messages) {

        if (err) {
            res.render('user/message_list', {
                error: 'Sorry sir, you have no messages please start a conversation.',
                messages: []
            });
        } else {

            var data = [];

            for (let i = 0; i < messages.data.length; i++) {

                Profile.findOne({user: messages.data[i].friend_id}, function (err, profile) {

                    if (messages.data[i].messages.length > 1) {
                        data.push({
                            profile: profile.user,
                            image: profile.imagePath,
                            name: profile.name,
                            message: messages.data[i].messages[messages.data[i].messages.length - 1].message
                        })
                    }
                });
            }
            res.render('user/message_list', {error: 0, messages: data});
        }
    });
});

router.get('/new/messages/:id', function (req, res, next) {
    var Id = req.params.id;
    var friend_profile = [];

    Profile.findOne({user: Id}, function (err, profile) {
        if (err) {
            return res.render('user/sorry', {messages: 'DataBase problem Friend profile not found during start messaging'});
        }

        Messages.findOne({user: req.user._id}, function (err, messages) {
            if (!messages) {
                var message = new Messages({
                    user: req.user._id,
                    data: [{
                        friend_id: Id,
                        messages: []
                    }]
                });
                //  console.log("This user is new here and try to start a new convo.")
                message.save(function (err, result) {
                   // console.log('enter here');
                    messages = message;
                });
            }
            let i, count = 0;
            if(messages == null){
                messages = message;
            }

            for (i = 0; i < messages.data.length; i++) {
                if (messages.data[i].friend_id == Id) {
                    // console.log("you already talk with this friend");
                    //  console.log(messages.data[i])
                    count++;
                    return res.render('user/all_messages', {
                        messages: messages.data[i],
                        profile: profile,
                        id: req.user._id
                    });

                }
            }

            if (count == 0) {
                var new_messages = [];
                console.log("this is your first talk with this friend");
                new_messages = messages.data.slice();
                new_messages.unshift({
                    friend_id: Id,
                    messages: [{
                        user: 0,
                        time: new Date().getHours() + '  ' + new Date().getMinutes(),
                        status: 1,
                        message: 'Say Hi..'

                    }],
                });
                messages.data = new_messages.slice();
                messages.save(function (err, update_messages) {
                    console.log('all good here');
                    res.render('user/all_messages', {
                        messages: update_messages.data[0],
                        profile: profile,
                        id: req.user._id
                    });
                });
            }

        });

    });

});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
