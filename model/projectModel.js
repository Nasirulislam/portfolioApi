const mongoose = require('mongoose');

const prohectSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'name cannot be empty']
        },
        template:{
            type:String,
        },
        slug:{
            type:String,
            required:[true,'Slug cannot be empty']
        },
        images:[],
        index:{
            type:String,
            index:true
        }

    }
)
const Project = mongoose.model('Project', prohectSchema);
module.exports = Project;
