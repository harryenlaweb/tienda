import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  obtener_productos_slug_publico(slug):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_productos_slug_publico/'+slug,{headers:headers});
  }

  listar_productos_recomendados_publico(categoria):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_recomendados_publico/'+categoria,{headers:headers});
  }

  obtener_descuento_activo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_descuento_activo/',{headers:headers});
  }
  
  listar_productos_nuevos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_nuevos_publico/',{headers:headers});
  }

  listar_productos_masvendidos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_masvendidos_publico/',{headers:headers});
  }


  get_Regiones():Observable<any>{    
    return this._http.get('./assets/regiones.json');
  }

  get_Distritos():Observable<any>{    
    return this._http.get('./assets/distritos.json');
  }

  get_Provincias():Observable<any>{    
    return this._http.get('./assets/provincias.json');
  }

  get_Envios():Observable<any>{    
    return this._http.get('./assets/envios.json');
  }

  
}
