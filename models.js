const mongoose = require('mongoose')
const userSchema = require('./userSchema')

module.exports = {
    User: mongoose.model('Users',userSchema),

}