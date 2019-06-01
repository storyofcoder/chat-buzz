var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    data:{type:Array}
});


module.exports=mongoose.model('Messages',userSchema);