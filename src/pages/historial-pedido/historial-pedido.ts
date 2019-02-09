import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//importando providers o librerias
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HistorialPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historial-pedido',
  templateUrl: 'historial-pedido.html',
})
export class HistorialPedidoPage {
  private loading:any;
  private user:any = [];
  private ordenes:any = [];
  private skip:number = 0;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.mostrarProgressBar('Cargando...');

    this.storage.get('user').then(
      resp => {
        this.user = resp;
        this.auth.misOrdenes(this.user.id, this.skip).then(
          resp => {
            this.loading.dismiss();
            if(resp.sucess == 1) {
              this.ordenes = resp.ordenes;
            }else {
              this.mostrarAlerta('No posee ordenes');
            }
          }
        )
      }
    );
    
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
    this.auth.misOrdenes(this.user.id,this.skip).then(resp => {
      let items = resp.ordenes;

      if (items != undefined) {
        for (let item of items) {
          this.ordenes.push(item);
        }
      }else{
        this.mostrarAlerta('No existen mas platillos')
      }

      infiniteScroll.complete();
    });
  }

}
