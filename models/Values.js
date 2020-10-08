const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const values = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        // Stores the Variable Unique Name
        type: String,
        required: true,
        unique: true
    },
    type: {
        // Stores the Variable Type
        type: String,
        required: true
    },
    name: {
        // Stores the Value - Any Type
        type: Schema.Types.Mixed,
        required: true
    },
    api_key: {
        type: String,
        required: true
    },
    last_used: {
        type: String,
        required: false,
        default: null
    }
}, {timestamps: true});

const Values = mongoose.model('Values', values);

module.exports = Values;