// var express = require('express');
// var router = express.Router();

// /* GET home page. */

// router.get('/', function(req, res) {
//   res.render('index', { title: 'DBYD Portal' });
// });

// module.exports = router;
//var azure = require('azure-storage');
var express = require('express');
var router = express.Router();
var User = require('../userStorage.js')
//var nconf = require('nconf');
//nconf.env()
//     .file({ file: 'config.json', search: true });
//var accountName = nconf.get("STORAGE_NAME");
//var accountKey = nconf.get("STORAGE_KEY");

function routeBuilder(passport) {
    router.get('/', function (req, res) {
        if (req.user === undefined || req.user === null) {
            res.redirect("/login");
        }
        else {
            res.render('home.jade', { user: req.user, title: 'DBYD Portal' });
        }
    });
    // router.get('/userNameExists', function (req, res) {
    //     var userName = req.query.username;
    //     User.findOne(userName).then(function (users) {
    //         var exists = true;
    //         if (!users || users.length === 0)
    //             exists = false;

    //         res.json({ userNameExists: exists });
    //     }).fail(function (err) {
    //         res.json({ userNameExists: true });
    //     });
    // });
    router.post('/login',
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
    router.get('/login', function (req, res) {
        var messages = prepareFlashMessages(req);
        res.render('login.jade', { messages: messages, title: 'DBYD Portal' });
    });
    router.get('/logout', function (req, res) {
        //var messages = prepareFlashMessages(req);
        req.logout();
        res.render('home.jade', { title: 'DBYD Portal' });
    });
    // router.get('/job', function (req, res) {
    //     var JobList = require('./joblist');
    //     var Job = require('../models/job');
    //     var job = new Job(azure.createTableService(accountName, accountKey), "enquiry");
    //     var jobList = new JobList(job);
    //     console.log("in here " + job.tableName);
    //     //res.render('jobs.jade', { user: req.user, jobs: jobList.showJobs.bind(jobList), title: 'DBYD Portal' });
    //     //router.get('/job', jobList.showJobs.bind(jobList));
    //     jobList.showJobs.bind(jobList);
    // });



    // router.get('/signup', function (req, res) {
    //     var messages = prepareFlashMessages(req);
    //     res.render('signup.ejs', { messages: messages });
    // });
    // router.post('/signup', passport.authenticate('signup', {
    //     successRedirect: '/',
    //     failureRedirect: '/signup',
    //     failureFlash: true
    // })
    //);

    function prepareFlashMessages(req) {
        var messages = req.flash().message;
        var message = undefined;
        if (messages && messages.length > 0)
            message = messages[0];
        return { errorMessage: message };
    }

    return router;
}

module.exports = routeBuilder;

