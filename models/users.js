var db = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: String,
    },
    created_at:{
        type: Date,
        default: Date.now

    },
    updated_at:{
        type: Date,
        default: Date.now
    }
    
})

module.exports = db.model('users', userSchema)