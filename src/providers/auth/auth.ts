import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as Util from '../Util';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  private optiones: RequestOptions;

  constructor(public http: Http) {
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Origin', '*' );
  //headers.append('"Access-Control-Allow-Headers','Content-Type, Content-Length, Accept-Encoding');
    //headers.append('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS');
    //headers.append('Access-Control-Allow-Origin', '*');

    this.optiones = new RequestOptions({ headers: headers });
  }

  registro(data) {
    return this.http.post(Util.API_ENDPOINT + Util.USER, data, this.optiones)
    .map(resp => resp.json())
    .toPromise();
  }

  update(id, data) {
    return this.http.post(Util.API_ENDPOINT +  Util.USER + '/' + id + Util.UPDATE, data, this.optiones)
    .map(resp => resp.json())
    .toPromise();
  }

  login(data) {
    return this.http.post(Util.API_ENDPOINT + Util.USER + Util.LOGIN, data, this.optiones)
    .map(resp => resp.json())
    .toPromise();    
  }

  platillos(id) {
    return this.http.get(Util.API_ENDPOINT + Util.PLATILLOS +'/'+ id, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  realizarOrden(data) {
    return this.http.post(Util.API_ENDPOINT + Util.ORDEN, data, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  misOrdenes(id, skip) {
    return this.http.get(Util.API_ENDPOINT + Util.MIS_ORDENES +'/'+ id +'/'+ skip, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  detalle_orden(orden_id) {
    return this.http.get(Util.API_ENDPOINT + Util.ORDEN +'/'+ orden_id, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  setEstadoOrden(orden_id, estado) {
    return this.http.get(Util.API_ENDPOINT + Util.CAMBIAR_ESTADO +'/'+ orden_id +'/'+ estado, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  setPago(data){
    return this.http.post(Util.API_ENDPOINT + Util.CAMBIAR_PAGO, data, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  encargos(id, skip) {
    return this.http.get(Util.API_ENDPOINT + Util.ENCARGOS +'/'+ id +'/'+ skip, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  enviarMiPosicion(id, data) {
    return this.http.post(Util.API_ENDPOINT + Util.USER + Util.CAMBIAR_UBICACION + id, data, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  getUbicacion(id) {
    return this.http.get(Util.API_ENDPOINT + Util.UBICACION + id, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  getDistance(direccion) {
    return this.http.get(direccion, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  buscar(nombre) {
    return this.http.get(Util.API_ENDPOINT + Util.PLATILLOS + Util.BUSCAR + nombre, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  categorias(skip) {
    return this.http.get(Util.API_ENDPOINT + Util.CATEGORIAS + skip, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  subcategorias(skip) {
    return this.http.get(Util.API_ENDPOINT + Util.SUBCATEGORIAS + skip, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  categoria(skip) {
    return this.http.get(Util.API_ENDPOINT + Util.CATEGORIA + skip, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  busquedaPorCategoria(nombre, categoria_id) {
    return this.http.get(Util.API_ENDPOINT + Util.PLATILLOS + Util.BUSCAR + nombre  +'/'+ categoria_id, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }

  formasdepago() {
    return this.http.get(Util.API_ENDPOINT + Util.FORMAS_PAGO, this.optiones)
    .map(resp => resp.json())
    .toPromise(); 
  }


}
