import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token;

  constructor(
    private _clienteService: ClienteService,
  ) { 
    this.token = localStorage.getItem('token');
    this._clienteService.obtener_cliente_guest(response.data._id,response.token).subscribe(
      response => {
        console.log(response);
        
      },
      error => {
        console.log(error);
        
      }

    )
  }

  ngOnInit(): void {
  }

}
