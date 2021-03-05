const { Schema, model }  = require('mongoose');

const UserSchema = new Schema({
    name: { 
        type: String,
        required: [true, 'Name is required']  
    },
    email: { 
        type: String,
        required: [true, 'Email is required'],
        unique: true  
    },
    password: { 
        type: String,
        required: [true, 'Password is required']  
    },
    image: { 
        type: String
    },
    role: { 
        type: String,
        required: true
    },
    state: { 
        type: Boolean,
        default: true
    },
    google: { 
        type: Boolean,
        default: false
    }
});

/* When the model is called and you want to print, either in JSON or String format, 
the .toJSON () method is called. The method can be overridden, to tell it what we 
should return.

NOTICE: It must be a normal function, not an arrow function, since the latter keeps 
what the "this" points to outside of it..
*/

UserSchema.methods.toJSON = function() {
    const { _id, __v, password, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);