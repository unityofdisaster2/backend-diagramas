const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (error) {
        throw new Error('Error al intentar conectar a la base de datos');
    }



}

/**
 * para hacer configuraciones del servidor para que acepte
 * peticiones de diferentes dominios
 */


module.exports = {
    dbConnection
}