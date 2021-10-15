import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto : any = {};
  public config : any = {};
  public imgSelect : String | ArrayBuffer;
  public load_btn = false;
  public id;
  public token;

  constructor(
    private _route : ActivatedRoute,
    private _productoService:ProductoService,
  ) {
    this.config = {
      height: 500
    }
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;

            }
            
          }
        ),
        error=>{
          console.log(error);
          
        }
        
      }
    )
  }

  actualizar(actualizarForm){

  }

  fileChangeEvent($event){

  }

}
