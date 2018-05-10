'use strict';

var ArchivesBox = function(balance, expiredAt){
  this.expiredAt = new BigNumber(expiredAt);
  this.balance = new BigNumber(balance);
};

ArchivesBox.prototype = {
  toString: function(){
    return JSON.stringify(this);
  }
};

var OfficeDocumentContract = function(){
  LocalContractStorage.defineMapProperty(this, 'documents');
}

OfficeDocumentContract.prototype = {

  init: function(){
    var from = Blockchain.transaction.from;
    this.owner = from;
    this.balance = new BigNumber(0);
  },


  signDocument: function(){
    var from = Blockchain.transaction.from;
    var doc = this.documents.get(from);
    if(doc){
      throw new Error('sign document already');
    }

    var now = new Date();
    // var d30 = now.setDate(now.getDate() + 30);
    var d30 = now.setDate(now.getMinutes() + 5)
    var balance =  new BigNumber(Blockchain.transaction.value);
    var box = new ArchivesBox(balance, d30);
    this.documents.put(from, box);
  },

  _canOperate: function(expiredAt){
    var now = new Date();
    var expiredAtDate = new Date(expiredAt);
    return now >= expiredAtDate;
  },

  takeout: function(){
    var from = Blockchain.transaction.from;
    var doc = this.documents.get(from);
    if(!doc){
      throw new Error('has not office document');
    }

    if(!this._canOperate(doc.expiredAt)){
      throw new Error('you cannot break sign docuemnt contract');
    }

    var amount = doc.balance;
    var result = Blockchain.transfer(from, amount);
    if(!result){
      throw new Error("transfer failed");
    }

    Event.Trigger("documents", {
      Transfer: {
        from: Blockchain.transaction.to,
        to: from,
        value: amount.toString()
      }
    });

    this.documents.del(from);
  },

  balanceOf: function(){
    var from = Blockchain.transaction.from;
    var doc = this.documents.get(from);
    if(!doc){
      throw new Error('has not office document');
    }
    return doc.balance;
  }

};

module.exports = OfficeDocumentContract;
