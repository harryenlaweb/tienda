'use strict'

var Admin = require('../models/admin');
var Contacto = require('../models/contacto');
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

const obtener_mensajes_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let reg = await Contacto.find().sort({createdAt:-1});
            res.status(200).send({data:reg});
                
        }else{
            res.status(500).send({message: 'NoAccess'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cerrar_mensaje_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let id = req.params['id'];

            let reg = await Contacto.findByIdAndUpdate({_id:id},{estado:'Cerrado'});
            res.status(200).send({data:reg});
                
        }else{
            res.status(500).send({message: 'NoAccess'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_admin,
    login_admin,
    obtener_mensajes_admin,
    cerrar_mensaje_admin,
}