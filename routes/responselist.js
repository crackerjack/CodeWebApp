var azure = require('azure-storage');
var async = require('async');
// Require once in project 
//var asyncEachObject = require('async-each-object')
// asyncEachObject function extends async 
//async.eachObject();

module.exports = ResponseList;

function ResponseList(response) {
  this.response = response;
}

ResponseList.prototype = {
  showResponses: function (req, res) {
    self = this;
    var query = new azure.TableQuery()
      .where('PartitionKey == ? && Type == ? && (RowKey > ? && RowKey <= ?)', req.user.userName, 'Response', req.params.id + '__000000000', req.params.id + '__999999999');
    self.response.find(query, function itemsFound(error, items) {
      res.render('responses', { title: 'Response List ', responses: items, user: req.user });
    });
  },

  // Something very unwell about the way checkboxes are handled. For this demo, it is one-way:
  // Check the box and it is set, now there is no going back. 
  updateResponses: function (req, res) {
    var self = this;
    var updatedResponses = Object.keys(req.body);
    //var updatedResponses = req.body;
    async.forEach(updatedResponses, function responseIterator(updatedResponse, callback) {
      //asyncEachObject(updatedResponses,  function responseIterator(updatedResponseValue, updatedResponseKey, callback) {
      self.response.updateItem(req.user.userName, updatedResponse, function itemsUpdated(error) {
        //self.response.updateItem(req.user.userName, updatedResponseKey, updatedResponseValue, function itemsUpdated(error) {
        if (error) {
          callback(error);
        } else {
          callback(null);
        }
      });
    }, function goHome(error) {
      if (error) {
        throw error;
      } else {
        backURL = req.header('Referer') || '/job';
        res.redirect(backURL);
      }
    });
  }
}