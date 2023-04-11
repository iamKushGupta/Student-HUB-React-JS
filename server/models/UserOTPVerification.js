const { model, Schema } = require('mongoose');

const UserOTPVerificationSchema=new Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
    },
    expiredAt:{
        type: Date,
        required: true,
    }
});

module.exports = model('UserOTPVerification', UserOTPVerificationSchema);

