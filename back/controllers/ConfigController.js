var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let reg = await Config.findById({_id:"617489968545016143869a76"});
            res.status(200).send({data:reg});
                
        }else{
            res.status(500).send({message: 'NoAccess'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let data = req.body;
            if(req.files){ //VALIDAMOS SI HAY UNA IMAGEN       
                console.log('SI hay imagen');
        
                //RECUPERO EL NOMBRE DE LA IMAGEN JUNTO CON SU EXTENSION
                var img_path = req.files.logo.path;
                var name = img_path.split('/');
                var logo_name = name[2];

                //ACTUALIZACION DEL DOCUMENTO
                let reg = await Config.findByIdAndUpdate({_id:"617489968545016143869a76"},{
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    corelativo: data.correlativo,
                });

                //ELIMINO LA IMAGEN
                fs.stat('./uploads/configuraciones/'+reg.logo, function(err){
                    if(!err){
                        fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                            if(err) throw err;
                        });
                    }
                });
                res.status(200).send({data:reg});
            }else{
                console.log('NO hay imagen');
                let reg = await Config.findByIdAndUpdate({_id:"617489968545016143869a76"},{
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    corelativo: data.correlativo,
                });
                res.status(200).send({data:reg});
            }        
            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }

    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_logo = async function(req,res){
    var img = req.params['img'];
    
    fs.stat('./uploads/configuraciones/'+img, function(err){
        if(!err){
            let path_img = './uploads/configuraciones/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_config_publico = async function(req,res){
    let reg = await Config.findById({_id:"617489968545016143869a76"});
    res.status(200).send({data:reg});
}


module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico,
}