const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        password:{
            type:String,
            required:[true,'password cannot be empty']
        }

    }
)
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
