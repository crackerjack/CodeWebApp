// At this stage, just one big hack-job
// Much is based on https://github.com/rocketcoder/passportjs-AzureTableStorge
// and this: https://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-use-table-storage-web-site/
// Needs some serious clean-up. In fact - a re-write. But the bits and pieces are here...

var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
    .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index.js');
var User = require('./userStorage.js');

//var routes = require('./routes/index');
//var users = require('./routes/user');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
app.locals.moment = require('moment');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'd1@lb4d1g',
    saveUninitialized: true, // (default: true) 
    resave: true // (default: true)
}));
app.use(flash());

// Initialize Passport  
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);
app.use('/', routes(passport));
//app.use('/setup', setup); 

//app.use('/', routes);
//app.use('/users', users);
//var TaskList = require('./routes/tasklist');
//var Task = require('./models/task');
//var task = new Task(azure.createTableService(accountName, accountKey), tableName, partitionKey);
//var taskList = new TaskList(task);

//app.get('/', taskList.showTasks.bind(taskList));
//app.post('/addtask', taskList.addTask.bind(taskList));
//app.post('/completetask', taskList.completeTask.bind(taskList));

// Jobs
var JobList = require('./routes/joblist');
var Job = require('./models/job');
var job = new Job(azure.createTableService(accountName, accountKey), "enquiry");
var jobList = new JobList(job);

// Responses
var ResponseList = require('./routes/responselist');
var Response = require('./models/response');
var response = new Response(azure.createTableService(accountName, accountKey), "enquiry");
var responseList = new ResponseList(response);

app.get('/job', jobList.showJobs.bind(jobList));
app.get('/response/:id', responseList.showResponses.bind(responseList));
app.post('/updateresponses', responseList.updateResponses.bind(responseList));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
