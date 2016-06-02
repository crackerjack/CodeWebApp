var azure = require('azure-storage');
//var uuid = require('node-uuid');
var entityGen = azure.TableUtilities.entityGenerator;

module.exports = Response;

function Response(storageClient, tableName) { 
  this.storageClient = storageClient;
  this.tableName = tableName;
  this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
    if(error) {
      throw error;
    }
  });
};

Response.prototype = {
  find: function(query, callback) {
    self = this;
    self.storageClient.queryEntities(this.tableName, query, null, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        callback(null, result.entries);
      }
    });
  },

  // addItem: function(item, callback) {
  //   self = this;
  //   // use entityGenerator to set types
  //   // NOTE: RowKey must be a string type, even though
  //   // it contains a GUID in this example.
  //   var itemDescriptor = {
  //     PartitionKey: entityGen.String(self.partitionKey),
  //     RowKey: entityGen.String(uuid()),
  //     name: entityGen.String(item.name),
  //     category: entityGen.String(item.category),
  //     completed: entityGen.Boolean(false)
  //   };
  //   self.storageClient.insertEntity(self.tableName, itemDescriptor, function entityInserted(error) {
  //     if(error){  
  //       callback(error);
  //     }
  //     callback(null);
  //   });
  // },

  updateItem: function(pKey, rKey, callback) { //rVal
    self = this;
    // Get all the Responses, so we can compare against the Postback checkboxes
    //var query = new azure.TableQuery()
    //    .where('PartitionKey == ? && Type == ? && (RowKey > ? && RowKey <= ?)', req.user.userName, 'Response', req.params.id + '__000000000', req.params.id +'__999999999');
    //self.find(query, function itemsFound(error, items) {
    //});    
    
    //self.storageClient.retrieveEntity(self.tableName, self.partitionKey, rKey, function entityQueried(error, entity) {
    self.storageClient.retrieveEntity(self.tableName, pKey, rKey, function entityQueried(error, entity) {
      if(error) {
        callback(error);
      }
      //console.log(rVal);
      entity.Priority._ = true;
      self.storageClient.replaceEntity(self.tableName, entity, function entityUpdated(error) {
        if(error) {
          callback(error);
        }
        callback(null);
      });
    });
  }
}