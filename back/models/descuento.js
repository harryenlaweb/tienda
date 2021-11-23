'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DescuentoSchema = Schema({    
    titulo: {type: String, required: true},
    banner: {type: String, required: true},
    descuento: {type: Number, required: true},
    fecha_inicio: {type: String, required: true}, //la fecha la va a manejar como tipo cadena, xq es sensible al servidor de node.js
    fecha_fin: {type: String, required: true},
    createdAt: {type:Date, default: Date.now, require: true},
});

module.exports = mongoose.model('descuento', DescuentoSchema);