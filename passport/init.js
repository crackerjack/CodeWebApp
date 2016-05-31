var login = require('./login');
//var signup = require('./signup');
var User = require('../userStorage.js');

module.exports = function (passport) {
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {        
        done(null, user.userName);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findOne(id).then(function (user) {            
            done(null, user);
        }).fail(function (err) { 
            done(err);
        });
    });
    
    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    //signup(passport);

}

