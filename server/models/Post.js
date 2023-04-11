const res = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const { model, Schema } = require('mongoose')

const Post = new Schema({
    postDate: {
        type: Date,
        required: true
    },
    postCategory:{
        type:String,
        required:true
    },
    postDescription: {
        type: String,
    },
    postImage: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postLikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    postComments: [{
        text: {
            type: String,
            required: true
        },
        writtenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    postLikes:{
        type:Number,
        default:0,
    }
});

Post.statics.savePost = function(newPost) {
    newPost.save((err,docs)=>{
        console.log(err||docs);
    });
};

Post.statics.fetchPostById = function(id,cb){
    this.findOne({_id:id},(err,docs)=>{
        if(err){
            console.log(err);
        }
        else{
            cb(id);
        }
    });
} 


module.exports = model('Post', Post);