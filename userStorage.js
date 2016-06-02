//From https://github.com/rocketcoder/passportjs-AzureTableStorge

var azure = require("azure-storage");
var q = require('q');
//var config = require('../config.js');
//var bCrypt = require('bcrypt-nodejs');

// [TODO] Change this!
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

function User() { }
    
User.UserFactory = function() {
    var user = {
        userName : "",
        password : "",
        //enabled : true,
        email : "",
        firstName : ""
        //tenant : "",
        //verified : false
    };
    user.isValidPassword = User.isValidPassword;
    return user;
}
    

User.findOne = function (userName) {
    var tableService = azure.createTableService(accountName, accountKey);
    var deferred = q.defer();    
    tableService.retrieveEntity('user', userName.split('@')[1], userName.split('@')[0], function (err, result) {
        if (err) {
            if (err.statusCode === 404)
                deferred.resolve(undefined);
            else
                deferred.reject(err);
        } 
        else {
            deferred.resolve(User.toUser(result));                
        }
    });
    return deferred.promise;
}
 
User.toUser = function (userEntity) {
    var user = User.UserFactory();
    user.userName = userEntity.RowKey._ + '@' + userEntity.PartitionKey._;
    //user.enabled = userEntity.RowKey._;
    user.password = userEntity.Password._;
    user.email = userEntity.RowKey._ + '@' + userEntity.PartitionKey._;
    user.firstName = userEntity.Contact._.split(' ')[0];
    user.contact = userEntity.Contact._;
    //user.tenant = userEntity.tenant._;
    //user.validated = userEntity.validated._;
    return user;
};
    
User.toUserEntity = function (user) {
    return {
        PartitionKey: { '_': user.userName.split('@')[1] },
        RowKey: { '_': user.userName.split('@')[0] },
        //Password: { '_': user.password },
        //email: { '_': user.email },
        //tenant: { '_': user.tenant },
        //validated: { '_': user.validated }
    };
};
    
// User.createUser = function (user) {
//     var deferred = q.defer();
//     var tableService = azure.createTableService(config.storageAccountKey);
//     function create(user) {                        
//         tableService.insertEntity('CloudUser', User.toUserEntity(user), function (err, result) {
//             if (err) {
//                 deferred.reject({ status: false, reason: "error creating user", err: err });
//             } 
//             else {
//                 deferred.resolve({ status: true, reason: "" });
//             }
//         });
//     }

//     User.findOne(user.userName).then(function (result) {
//         if (result && result.length > 1) {
//             deferred.resolve({ status: false, reason: "username exists" });
//         }
//         else {
//             create(user);
//         }
//     }).
//     fail(function (err) {
//             deferred.reject({ status: false, reason: "error creating user", err: err});
//     });

//     return deferred.promise;
// }
    
// User.save = function (user) {
//     var tableService = azure.createTableService(config.storageAccountKey);
//     tableService.updateEntity('CloudUser', user, function (err, result) {
//         if (err) {
//             deferred.reject({ status: false, reason: "error creating user" });
//         } 
//         else {
//             deferred.resolve({ status: true, reason: "" });
//         }
//     });
// }
    
User.isValidPassword = function (user, password) {  
    var crypto = require('crypto');
    var hash = crypto.createHmac('SHA256', "my$3cr3t").update(password).digest('base64');
    return hash == user.password
}
    
//// Generates hash using bCrypt
//User.createHash = function (password) {
//    return bCrypt.hashSync(password);
//}

module.exports = User;
