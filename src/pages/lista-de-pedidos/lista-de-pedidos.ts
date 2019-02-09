import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//importando providers o librerias
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
/**
 * Generated class for the ListaDePedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-de-pedidos',
  templateUrl: 'lista-de-pedidos.html',
})
export class ListaDePedidosPage {
  private loading:any;
  private user:any = [];
  private skip:number = 0;
  private ordenes:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    this.mostrarProgressBar('Cargando...');
    this.storage.get('user').then( resp => {
      this.user = resp;
      this.auth.encargos(this.user.id, this.skip).then( resp => {
        if(resp.sucess == 1)
          this.ordenes = resp.ordenes;
        else
          this.mostrarAlerta('No hay ordenes');

        this.loading.dismiss();
      })
    });
  }

  historialPedido(orden){
    this.navCtrl.push('DetallesHistorialPedidoPage', {
      orden: orden,
      user: this.user
    });
  }

  mostrarProgressBar(message: string): void {
    this.loading = this.loadingCtrl.create({
      content: message,
    });
    this.loading.present();
  }

  mostrarAlerta(message) {
    let alert = this.alertCtrl.create({
      title: 'Aviso',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    this.skip += 15;
    this.auth.encargos(this.user.id,this.skip).then(resp => {
      let items = resp.ordenes;

      if (items != undefined) {
        for (let item of items) {
          this.ordenes.push(item);
        }
      }else{
        this.mostrarAlerta('No existen mas Encargos')
      }

      infiniteScroll.complete();
    });
  }

  irMapa() {
    this.navCtrl.push(HomePage);
  }

}
