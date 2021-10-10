'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs'); //tenemos que encriptar la contraseña
var jwt = require('../helpers/jwt');

const registro_cliente = async function(req,res){
    //
    var data = req.body;

    //vamos a verficar si el correo existe
    var clientes_arr = [];
    clientes_arr = await Cliente.find({email:data.email});

    if (clientes_arr.length == 0){        
        //primero verificamos si me envia una contraseña
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){    
                    data.password = hash;
                    var reg = await Cliente.create(data);                
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'Error Server', data:undefined});            
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña', data:undefined});    
        }

        
    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos', data:undefined});
    }
}

const login_cliente = async function(req,res){
    var data = req.body;
    var cliente_arr = []; //tengo que verificar que el email no exista en la BD

    cliente_arr = await Cliente.find({email:data.email});

    if (cliente_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data: undefined});
    }else{
        //LOGIN
        let user = cliente_arr[0];

        bcrypt.compare(data.password,user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });                
            }else{
                res.status(200).send({message: 'La contraseña no coincide', data: undefined});
            }
        });        
    }    
}

const listar_clientes_filtro_admin = async function(req,res){

    let tipo = req.params['tipo'];    
    let filtro = req.params['filtro'];

    console.log(tipo);

    if(tipo == null || tipo == 'null'){
        let reg = await Cliente.find();
        res.status(200).send({data:reg});
    }else{
        if(tipo == 'apellidos'){
            let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});
        }else if(tipo == 'correo'){
            let reg = await Cliente.find({email:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});
        }
    }

    
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
}