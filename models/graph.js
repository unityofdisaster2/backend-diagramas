const mongoose = require('mongoose');

const grafoSchema = new mongoose.Schema({
    grafo: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Grafo = mongoose.model("grafo",grafoSchema);

module.exports  = Grafo;