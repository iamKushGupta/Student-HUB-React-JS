const res = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const { model, Schema } = require('mongoose');
const jwt=require('jsonwebtoken');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic:{
        type:String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    booksmarks: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    notifications: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Notification'
    }],
    isAdmin:{
        type:Boolean,
        default:false
    }
});


UserSchema.methods.generateAuthToken=function(cb){
    try{
        const token=jwt.sign({_id:this._id.toString()},
        process.env.SECRET_KEY);
        return token;
    } catch(error){
        res.status(404).send(error);
        console.log(error);
    }
};

module.exports = model('User', UserSchema);