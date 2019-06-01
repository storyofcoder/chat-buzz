var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    imagePath:{type:String,required:true},
    name:{type:String, required: true},
    number:{type:String, required:true},
    address:{type:String, required:true},
    profile:{type:String, required:true},
    date:{type:String, required:true}
});

module.exports = mongoose.model('Profile',schema);