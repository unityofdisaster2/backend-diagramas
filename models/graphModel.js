const mongoose = require('mongoose');

const grafoSchema = new mongoose.Schema({
    grafo: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Grafo = mongoose.model("grafo", grafoSchema);

module.exports = Grafo;