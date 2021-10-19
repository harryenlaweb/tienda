import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast;
declare var $:any;
declare var iziToast;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id;
  public token;
  public producto :any = {};
  public inventarios : Array<any>=[];
  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        
        console.log(this.id);
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;  
              
              this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
                response=>{                  
                  this.inventarios = response.data;
                },
                error=>{
                  console.log(error);
                  
                }
              )
                          
            }
            
          }
        ),
        error=>{
          console.log(error);
          
        }
        
      }
    );
  }

  eliminar(id){
    this.load_btn = true;
    this._productoService.elimnar_inventario_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el nuevo producto.',        
        });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');

      this.load_btn = false;

      this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
        response=>{                  
          this.inventarios = response.data;
        },
        error=>{
          console.log(error);
          
        }
      )
        
      },
      error=>{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ocurrió un error en el servidor.',        
        });
        console.log(error);
        this.load_btn = false;
        
      }
    )
  }

}
