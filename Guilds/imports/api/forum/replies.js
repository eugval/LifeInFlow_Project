import {Schemas} from '../helpers/schemas.js';
import {adminOrAutoInsertNoUpdate} from '../helpers/adminFunctions.js';

export const Replies = new Mongo.Collection('Replies');
Schemas.Replies ={};

Schemas.Replies.clientSupplied = new SimpleSchema({
  thread:{
    type:String,
  },
  message:{
    type:String,
  },
  authorName:{
    type:String,
    optional:true,
    autoValue:function(){
      const user = Meteor.users.findOne({_id:this.userId});
      return adminOrAutoInsertNoUpdate(user.username,this);
    },
  }
});


Schemas.Replies.automatic = new SimpleSchema({
  createdDate: {
    type:Date,
    defaultValue: new Date(),
    denyUpdate:true,
  },
  author:{
    type:String,
    autoValue: function() {
      if( this.isInsert ) {
        return this.userId ;
      }
    },
    denyUpdate:true,
  },
});


Replies.attachSchema(Schemas.Replies.clientSupplied);
Replies.attachSchema(Schemas.Replies.automatic);
