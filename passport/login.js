var LocalStrategy = require('passport-local').Strategy;
var User = require('../userStorage.js');
//var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    
    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function (req, username, password, done) {
            // check if a user with username exists or not            
            User.findOne(username).then(function(user){                 
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false, req.flash('message', 'User Not found.'));
                }
                // User exists but wrong password, log the error 
                if (!User.isValidPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, user); 
            }).fail(function (err) { 
                // In case of any error, return using the done method                    
                return done(err);                                    
            });

        })
    );
}

