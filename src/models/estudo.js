const mongoose = require('mongoose');

const estudoSchema = new mongoose.Schema({

    materia: {
        type: String,
        required: true, 
        trim: true
    },
    minutos: {
        type: Number,
        required: true,
        min: 0.1
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Estudo', estudoSchema);

