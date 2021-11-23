import { Component, DEFAULT_CURRENCY_CODE, OnInit } from '@angular/core';
import { GLOBAL } from "src/app/services/GLOBAL";
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast;
declare var $:any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {

  public load_data = true;
  public filtro = '';
  public token;
  public descuentos : Array<any> = [];  
  public url;
  public page = 1;
  public pageSize = 20;

  public load_btn = false;

  constructor(
    private _descuentoService : DescuentoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;    
  }

  ngOnInit(): void {
    console.log('**************ENTRO ACA!!!***************');    
    this.init_data();
  }

  init_data(){
    this._descuentoService.listar_descuentos_admin(this.filtro, this.token).subscribe(
      response=>{
        console.log(response);
        this.descuentos = response.data;

        this.descuentos.forEach(element => {
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;

          var today = Date.parse(new Date().toString())/1000;
          
          if(today>tt_inicio){
            element.estado = 'Expirado';
          }
          if(today<tt_inicio){
            element.estado = 'Proximamente';
          }
          if(today>=tt_inicio && today<=tt_fin){
            element.estado = 'En progreso';
          }
          
        });

        this.load_data = false;       
        
        
      },
      error=>{
        console.log(error);
        
      }
    )
  }


  filtrar(){
    if(this.filtro){
      this._descuentoService.listar_descuentos_admin(this.filtro, this.token).subscribe(
        response=>{
          console.log(response);
          this.descuentos = response.data;
          this.load_data = false;
          
        },
        error=>{
          console.log(error);
          
        }
      )
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos',        

      });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id){
    this.load_btn = true;
    this._descuentoService.eliminar_descuento_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el nuevo descuento.',        
        });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');

      this.load_btn = false;

      this.init_data();
        
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
