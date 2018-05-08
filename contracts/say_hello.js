'use strict';

var wordItem = function(content){
  if(content){
    this.word = content;
  }else{
    this.word = 'you say nothing, but i think you want to say everything';
  }
  this.publishTime = new Date();
}

wordItem.prototype = {
  toString: function(){
    return this.word + ' at ' + this.pushlishTime;
  }
}

var sayForMeContract = function(){
  LocalContractStorage.defineMapProperty(this, 'words', null);
}

sayForMeContract.prototype = {

  init: function(){
    var from = Blockchain.transaction.from;
    this.owner = from;
    this.function_desc = '记录留下的印痕';
    console.log(Math.random());
  },

  changeOwner: function(address){
    var from = Blockchain.transaction.from;
    if(from !== address){
      throw new Error('you have not right');
    }

    this.owner = address;
  },

  say: function(content){
    var from = Blockchain.transaction.from;
    var item = this.words.get(from);
    if(item){
      throw new Error('you have finished yourself');
    }
    item = new wordItem(content);
    this.words.put(from, item);
  },

  cancel: function(){
    var from = Blockchain.transaction.from;
    var item = this.words.get(from);
    if(!item){
      throw new Error('you say nothing, can not cancel');
    }
    this.words.del(from);
  },

  findYourself: function(){
    var from = Blockchain.transaction.from;
    var item = this.words.get(from);
    if(!item){
      throw new Error('you say nothing, can not find yourself');
    }
    var content = 'say: ' + item.toString();
    return content;
  }
}

module.exports = sayForMeContract;
