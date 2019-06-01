var express = require('express');
var router = express.Router();
var passport = require('passport');
var Profile = require('../models/profile');
var Order = require('../models/messages');

router.get('/profile', isLoggedIn,function (req, res, next) {
        Profile.findOne({user:req.user._id}, function (err, profile) {
        if(err){
            return res.redirect('/');
        }
        res.render('user/profile',{profile:profile, user_profile:1});
    });

});

router.get('/logout',isLoggedIn ,function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/signup',notisLoggedIn,function (req, res, next) {
    res.render('shop/index');
});

router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect:'/signup',
    failureFlash:true
}),  function (req, res, next) {
        res.render('shop/update',{id:req.user._id});
});


router.get('/',notisLoggedIn, function(req, res, next) {
    res.render('shop/index', { login:1});
});

router.post('/',passport.authenticate('local.signin',{
    failureRedirect:'/',
    failureFlash:true
}), function (req, res, next) {

    Profile.findOne({user:req.user._id}, function (err, profile) {
        if(err){
            return res.redirect('/');
        }
        res.render('user/profile',{profile:profile, user_profile:1});
    });

});

router.get('/update',isLoggedIn, function (req, res, next) {
    res.render('shop/update');
});

router.post('/update', function (req, res, next) {
    var profile = new Profile({
        user: req.user,
        imagePath:"https://cdn.dribbble.com/users/116693/screenshots/1998212/loader.gif",
        name:req.body.name,
        number:req.body.number,
        address:req.body.address,
        profile:req.body.profile,
        date:req.body.date
    });
    profile.save( function (err, result) {
        res.redirect('/profile');
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notisLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/profile');
}
