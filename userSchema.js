const {Schema} = require('mongoose')

module.exports = Schema({
    username: {type:String,required:true},
    count: {type:Number, default:0},
    log:{ 
        type: [{
            description: {type:String,required:true},
            duration:{type:Number,required:true},
            date: {type:String, default: ()=>new Date.now().toDateString()}
        }],
        default: []
    }
})