const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const keys = new Schema({
    id: {
        type: String,
        unique: true
    },
    owner: {
        type: String,
        default: null
    },
    api_key: {
        type: String,
        required: true
    },
    last_used: {
        type: String,
        required: false,
        default: null
    },
    count: {
        type: Number,
        default: 0
    },
    client_ip: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Keys = mongoose.model('Keys', keys);

module.exports = Keys;