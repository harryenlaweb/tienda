import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  registro_product_admin(data,file,token):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('stock',data.stock);
    fd.append('precio',data.precio);
    fd.append('descripcion',data.descripcion);
    fd.append('contenido',data.contenido);
    fd.append('categoria',data.categoria);
    fd.append('portada',file);    

    return this._http.post(this.url+'registro_product_admin',fd,{headers:headers});

  }
}