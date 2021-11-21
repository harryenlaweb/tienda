import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
declare var iziToast;
declare var Cleave;
declare var StickySidebar;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public idcliente;
  public token;

  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;
  public total_pagar = 0;
  public socket = io('http://localhost:4201');

  public direccion_principal : any = {};

  constructor(
    private _clienteService : ClienteService
  ) {
    
    this.idcliente = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._clienteService.obtener_carrito_cliente(this.idcliente , this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    )
   }

  ngOnInit(): void {
    setTimeout(()=>{
      new Cleave('#cc-number', {
          creditCard: true,
            onCreditCardTypeChanged: function (type) {
                // update UI ...
            }
      });
      new Cleave('#cc-exp-date', {
          date: true,
          datePattern: ['m', 'y']
      });

      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});

    })

    this.get_direccion_principal();
  }

  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'), this.token).subscribe(
      response=>{
        this.direccion_principal = response.data;   
        console.log(this.direccion_principal);
             
        
      }
    )
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    });
    this.total_pagar = this.subtotal;
  }

  eliminar_item(id){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó el producto correctamente.',        

        });
        this.socket.emit('delete-carrito',{data:response.data});
        this._clienteService.obtener_carrito_cliente(this.idcliente , this.token).subscribe(
          response => {
            this.carrito_arr = response.data;
            this.calcular_carrito();
          }
        )
        
      }
    )
  }

}
