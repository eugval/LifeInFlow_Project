import {Schemas} from '/imports/api/helpers/schemas.js';
import {COMMUNITIES} from '/imports/api/helpers/communityHelpers.js';


export const Threads = new Mongo.Collection('Threads');
Schemas.Threads ={};

/*
*The collection schema is the overall schema of the collection.
*Only protects for data consistency.
*Does not protect against malitious collection manipulations.
*/
Schemas.Threads.collectionSchema = new SimpleSchema({
  title:{
    type:String,
    label:"Title",
    max:80,
    min:10
  },
  message:{
    type:String,
    label:"Post",
  },
  community:{
    type:String,
    label:"Community",
    custom:function(){
      /*The community must be one of the values in COMMUNITIES*/
      if(COMMUNITIES.indexOf(this.value)===-1){
        return "inexistentCommunity";
      }
    }
  },
  pinned:{
    type:Boolean,
    label:"Pinned",

  },
  locked:{
    type:Boolean,
    label:"Locked",

  },
  replyNb:{
    type:Number,
    label: "Number of Replies",
    min:0,
    custom:function(){
      /*On insert, the reply number can only be 0*/
      if(this.isInsert && this.value != 0){
        return "0OnInsert";
      }
    }
  },
  authorName:{
    type:String,
    label:"Author's Name",
    custom:function(){
      /*The author name must be the username of the author's user object*/
      if(Meteor.isServer){
        const ID = this.field('author').value;
        const user = Meteor.users.findOne({_id:ID});
        if(!user || user.username !=this.value){
          return "userInconsistency";
        }
      }
    }
  },
  author:{
    type:String,
    label:"Author",
  },
  createdAt: {
    type:Date,
    label:"Date Created",
    denyUpdate:true,
  },
});

Threads.attachSchema(Schemas.Threads.collectionSchema);




/*Manipulation Schemas*/
/*
*Schemas used in the methods that manipulate threads.
*They verify the consitency of the arguments provided to the methods.
*Malicious manipulation of the data left to the methods.
*These schemas have the same name as the method they are used in
*/
Schemas.Threads.insertThread= new SimpleSchema({
  title:{
    type:String,
    label:"Title",
    max:80,
    min:10,
  },
  message:{
    type:String,
    label:"Message",
  },
  community:{
    type:String,
    label:"Community",
  },

})

Schemas.Threads.updateThread= new SimpleSchema({
  _id:{
    type:String,
    label:"ID",
  },
  title:{
    type:String,
    label:"Title",
    max:80,
    min:10,
  },
  message:{
    type:String,
    label:"Message",
  },
});


Schemas.Threads.threadPinUpdate = new SimpleSchema({
  _id:{
    type:String,
    label:"ID",
  },
  pinValue:{
    type:Boolean,
    label:"Pin Value",
  }
});

Schemas.Threads.threadLockUpdate =new SimpleSchema({
  _id:{
    type:String,
    label:"ID",
  },
  lockValue:{
    type:Boolean,
    label:"Lock Value",
  }
});
