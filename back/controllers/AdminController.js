'use strict'

var Admin = require('../models/admin');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
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

//****************VENTAS************** */
const obtener_ventas_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];           

            if(desde == 'undefined' && hasta == 'undefined'){
                ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});
                res.status(200).send({data:ventas});
            }else{
                let tt_desde = Date.parse(new Date(desde+'T00:00:00'))/1000;
                let tt_hasta = Date.parse(new Date(hasta+'T00:00:00'))/1000;
                
                let tem_ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});

                for(var item of tem_ventas){
                    var tt_created = Date.parse(new Date(item.createdAt))/1000;
                    if(tt_created >= tt_desde && tt_created <= tt_hasta){
                        ventas.push(item);
                    }
                }
                res.status(200).send({data:ventas});
            }

                   
            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

//***************KPI************ */
const kpi_ganancias_mensuales_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            var enero = 0; var febrero = 0; var marzo = 0;
            var abril = 0; var mayo = 0;var junio = 0;
            var julio = 0;var agosto = 0;var septiembre = 0;
            var octubre = 0;var noviembre = 0;var diciembre = 0;
            
            var reg = await Venta.find();
            let current_date = new Date();
            let current_year = current_date.getUTCFullYear();

            for(var item of reg){
                let createdAt_date = new Date(item.createdAt);
                let mes = createdAt_date.getMonth()+1
                
                if(createdAt_date.getUTCFullYear() == current_year){
                    if(mes == 1){ enero = enero + item.subtotal}
                    if(mes == 2){ febrero = febrero + item.subtotal}
                    if(mes == 3){ marzo = marzo + item.subtotal}
                    if(mes == 4){ abril = abril + item.subtotal}
                    if(mes == 5){ mayo = mayo + item.subtotal}
                    if(mes == 6){ junio = junio + item.subtotal}
                    if(mes == 7){ julio = julio + item.subtotal}
                    if(mes == 8){ agosto = agosto + item.subtotal}
                    if(mes == 9){ septiembre = septiembre + item.subtotal}
                    if(mes == 10){ octubre = octubre + item.subtotal}
                    if(mes == 11){ noviembre = noviembre + item.subtotal}
                    if(mes == 12){ diciembre = diciembre + item.subtotal}
                }
                               
            }

            res.status(200).send({
                enero:enero, febrero:febrero, marzo:marzo,
                abril:abril, mayo:mayo, junio:junio,
                julio:julio, agosto:agosto, septiembre:septiembre, 
                octubre:octubre, noviembre:noviembre, diciembre:diciembre,
            })
            
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
    obtener_ventas_admin,
    kpi_ganancias_mensuales_admin
}