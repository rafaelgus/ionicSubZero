import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {global} from "../../providers/global";

//importando plugins
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DetallePedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-pedido',
  templateUrl: 'detalle-pedido.html',
})
export class DetallePedidoPage {
  private listPedido: any = [];
  public detallestramite: any ;
  private subTotal:number = 0;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public navParams: NavParams, 
              public storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('pedido').then( resp =>{
      this.listPedido = resp;
      if(this.listPedido != undefined) {
        for (let element of this.listPedido) {
          this.subTotal += +element.precio;
        }
      }
    });
  }

  ionViewWillEnter() {
    
    if (global.detallesTramite != null ) {
        this.listPedido[global.index].avisos = global.detallesTramite;
        this.mostrarAlerta('Se guardaron los detalles ');
    }
 
  }


  agregarDetalle(pedido,i) {
    global.detallesTramite = pedido.avisos;
    global.index = i;
    this.navCtrl.push('DetalleTramitePage');
    console.log(pedido.avisos);

  }

  verDetalle(pedido) {
    this.mostrarAlerta(pedido.avisos);

  }

  mostrarAlerta(message) {
    let alert = this.alertCtrl.create({
      title: 'Detalle Tramite',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


  sumar(pedido) {
    pedido.cantidad += 1;
    this.subTotal += +pedido.precio;
  }

  restar(pedido) {
    if(pedido.cantidad >0) {
      pedido.cantidad -= 1;
      this.subTotal -= +pedido.precio;
    }     
  }

  continuarPedido() {
    this.navCtrl.push('DatosEnvioPage', {
      listPedido: this.listPedido,
      subTotal: this.subTotal
    });
  }

  eliminar(pedido){
    var index = this.listPedido.indexOf(pedido, 0);
    if (index > -1) {
      this.listPedido.splice(index, 1);
    }

    this.storage.set('pedido', this.listPedido);
  }

  
}
