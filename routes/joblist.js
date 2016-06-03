var azure = require('azure-storage');
//var async = require('async');

module.exports = JobList;

function JobList(job) {
  this.job = job;
}

JobList.prototype = {
  showJobs: function (req, res) {
    self = this;
    var query = new azure.TableQuery()
      .where('PartitionKey == ? && Type == ?', req.user.userName, 'Job');
    //.where('PartitionKey eq ?', 'lance.hobson+3@gmail.com');
    //.where('Type eq ?', 'Job');
    self.job.find(query, function itemsFound(error, items) {
      res.render('jobs', { title: 'Enquiry List ', jobs: items, user: req.user, id: req.params.id });
    });
  }//,

  // addJob: function(req,res) {
  //   var self = this;
  //   var item = req.body.item;
  //   self.job.addItem(item, function itemAdded(error) {
  //     if(error) {
  //       throw error;
  //     }
  //     res.redirect('/');
  //   });
  // },

  // completeJob: function(req,res) {
  //   var self = this;
  //   var completedJobs = Object.keys(req.body);
  //   async.forEach(completedJobs, function jobIterator(completedTask, callback) {
  //     self.job.updateItem(completedTask, function itemsUpdated(error) {
  //       if(error){
  //         callback(error);
  //       } else {
  //         callback(null);
  //       }
  //     });
  //   }, function goHome(error){
  //     if(error) {
  //       throw error;
  //     } else {
  //      res.redirect('/');
  //     }
  //   });
  // }
}