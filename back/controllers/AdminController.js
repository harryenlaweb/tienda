'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs'); //tenemos que encriptar la contraseña
var jwt = require('../helpers/jwt');

const registro_admin = async function(req,res){
    //
    var data = req.body;

    //vamos a verficar si el correo existe
    var admins_arr = [];
    var admin_arr = await Admin.find({email:data.email});

    if (admin_arr.length == 0){        
        //primero verificamos si me envia una contraseña
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){    
                    data.password = hash;
                    var reg = await Admin.create(data);                
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

const login_admin = async function(req,res){
    var data = req.body;
    var admin_arr = []; //tengo que verificar que el email no exista en la BD

    admin_arr = await Admin.find({email:data.email});

    if (admin_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data: undefined});
    }else{
        //LOGIN
        let user = admin_arr[0];

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

module.exports = {
    registro_admin,
    login_admin
}