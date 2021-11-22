'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DVentaSchema = Schema({
    producto: {type: Schema.ObjectId, ref:'producto', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},        
    subtotal: {type: Number, required: true},    
    variedad: {type: String, required: true},
    cantidad: {type: Number, required: true},   
    cliente: {type: Schema.ObjectId, ref:'cliente', required: true},     
    createdAt: {type:Date, default: Date.now, require: true},

});

module.exports = mongoose.model('dventa', DVentaSchema);