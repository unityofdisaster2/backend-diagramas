const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    paterno: {
        type: String,
        required: true,
        trim: true
    },
    materno: {
        type: String,
        required: true,
        trim: true

    },
    edad: {
        type: Number,
        required: true,
        validate(value){
            if(value < 0 ) throw new Error ('No hay edades negativas');
        }
    }
});


const Persona = mongoose.model("persona",personaSchema);

module.exports  = Persona;