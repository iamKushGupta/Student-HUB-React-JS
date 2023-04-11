const res = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const { model, Schema } = require('mongoose')

const Notification = new Schema({
    notificationDate: {
        type: Date,
        required: true
    },
    notificationType: {
        type:String,
        required:true
    },
    notificationAboutUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = model('Notification', Notification);