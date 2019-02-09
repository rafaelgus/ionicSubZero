import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Util from '../../providers/Util';


@IonicPage()
@Component({
  selector: 'page-detalle-galeria',
  templateUrl: 'detalle-galeria.html',
})

export class DetalleGaleriaPage {
  private SERVER = Util.SERVER;
  private plato:any ;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams ) {
      console.log("Recibo Plato");
    this.plato = this.navParams.get('Pedido');
    console.log(this.plato);

  }

  ionViewDidLoad() {
    console.log("Recibo Plato");
    this.plato = this.navParams.get('Pedido');
    console.log(this.plato);
  }


      
}
