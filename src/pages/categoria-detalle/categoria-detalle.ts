import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//importando providers o librerias 
import * as Util from '../../providers/Util';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CategoriaDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categoria-detalle',
  templateUrl: 'categoria-detalle.html',
})
export class CategoriaDetallePage {
  private SERVER:string = Util.SERVER;
  private myInput:string;
  private platillos:any = [];
  private listPedido:any = [];

  constructor(
    public auth:AuthProvider, 
    public navParams: NavParams,
    public navCtrl: NavController,
    public storage: Storage) 
    {}

  ionViewDidLoad() {
    this.storage.get('pedido').then( resp => {
      if(resp != null)
        this.listPedido = resp;

      this.auth.categoria(this.navParams.get('id'))
      .then( resp=> {
        if(resp.response.sucess == 1){
          this.filtro(resp.response.platillos);
        }
      });
    });
    
  }

  onInput() {
    this.platillos = [];
    if(this.myInput != '') {
      this.auth.busquedaPorCategoria(this.myInput, this.navParams.get('id'))
        .then((resp) => { console.log(resp)
          this.filtro(resp.response.platillos);
        });
    }else{
      this.auth.categoria(this.navParams.get('id'))
      .then( resp=> {
        if(resp.response.sucess == 1){
          this.filtro(resp.response.platillos);
        }
      });
    }
  }

  agregar(plato) {
    plato.cantidad = 1;
    this.listPedido.push(plato)
    var index = this.platillos.indexOf(plato, 0);
    if (index > -1) {
      this.platillos.splice(index, 1);
    }

    this.storage.set('pedido', this.listPedido);

  }

  pedido() {
    this.navCtrl.push('DetallePedidoPage', {
      listPedido: this.listPedido
    });
  }

  filtro(platillos) {
    let isAgregado: boolean = false;

    for(let item of platillos) {
      isAgregado = false;
      
      if(this.listPedido != null) {
        for(let plato of this.listPedido){
          if(item.id == plato.id){
            isAgregado = true;
          }
        }  
      }
    
      if(!isAgregado)
        this.platillos.push(item);
    }

  }

}
