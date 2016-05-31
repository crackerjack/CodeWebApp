var azure = require('azure-storage');
//var async = require('async');

module.exports = ResponseList;

function ResponseList(response) {
  this.response = response;
}

ResponseList.prototype = {
  showResponses: function(req, res) {
    self = this;
    var query = new azure.TableQuery()
        .where('PartitionKey == ? && Type == ? && (RowKey > ? && RowKey <= ?)', req.user.userName, 'Response', req.params.id + '__000000000', req.params.id +'__999999999');
    self.response.find(query, function itemsFound(error, items) {
      res.render('responses',{title: 'Response List ', responses: items, user: req.user});
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