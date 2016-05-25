var azure = require('azure-storage');
var async = require('async');

module.exports = EnquiryList;

function EnquiryList(enquiry) {
  this.enquiry = enquiry;
}

EnquiryList.prototype = {
  showEnquiry: function(req, res) {
    self = this;
    var query = new azure.TableQuery()
      .where('Status eq ?', 'NOTIFIED');
    self.enquiries.find(query, function itemsFound(error, items) {
      res.render('index',{title: 'Enquiries ',enquiries: items});
    });
  },

  addEnquiry: function(req,res) {
    var self = this;
    var item = req.body.item;
    self.enquiry.addItem(item, function itemAdded(error) {
      if(error) {
        throw error;
      }
      res.redirect('/');
    });
  },

  completeEnquiry: function(req,res) {
    var self = this;
    var completedEnquiries = Object.keys(req.body);
    async.forEach(completedEnquiries, function enquiryIterator(completedEnquiry, callback) {
      self.enquiry.updateItem(completedEnquiry, function itemsUpdated(error) {
        if(error){
          callback(error);
        } else {
          callback(null);
        }
      });
    }, function goHome(error){
      if(error) {
        throw error;
      } else {
       res.redirect('/');
      }
    });
  }
}