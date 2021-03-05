const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true        
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    available: {
        type: Boolean,
        delafult: true
    },
    state: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...product } = this.toObject();
    return product;
}

module.exports = model('Product', ProductSchema);