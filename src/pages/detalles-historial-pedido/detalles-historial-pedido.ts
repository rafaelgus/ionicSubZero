import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Navbar } from 'ionic-angular';

//importando pages
import { HomePage } from '../home/home';

//importando providers o librerias
import { AuthProvider } from '../../providers/auth/auth';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import * as Util from '../../providers/Util';

/**
 * Generated class for the DetallesHistorialPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalles-historial-pedido',
  templateUrl: 'detalles-historial-pedido.html',
})
export class DetallesHistorialPedidoPage {
  @ViewChild(Navbar) navBar: Navbar;
  private SERVER = Util.SERVER;
  private loading:any;
  private user:any = [];
  private orden:any = [];
  private platillos:any = [];
  private formasPago:any = [];
  private selecion;
  public  repartidor_id: any;
  public whatsapp: string = "525584897183";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public auth: AuthProvider,
    private payPal: PayPal) { }

  ionViewDidLoad() {
    this.setBackButtonAction();
    this.mostrarProgressBar('Cargando...');
    this.orden = this.navParams.get('orden');
    this.user = this.navParams.get('user');
    console.log(this.user);
    this.auth.detalle_orden(this.orden.id).then( resp => {
      this.platillos = resp.platillos;
      this.loading.dismiss();
      this.repartidor_id = resp.repartidor_id;
    });

    this.auth.formasdepago().then( resp=> {
      this.formasPago = resp;
    }) 
    if (this.orden.whatsapp != null) {
      this.whatsapp = '34' + this.orden.whatsapp;
    }
    
  }

  cambiarEstado(id, estado) {
    this.mostrarProgressBar('Carganado...');
    this.auth.setEstadoOrden(id, estado).then( resp => {
      this.loading.dismiss();
    })
  }

  cambiarPago(id) {
    this.mostrarProgressBar('Carganado...');
    this.auth.setPago({
      id: id,
      formaPago: this.selecion
    }).then( resp => {
      this.loading.dismiss();
    })
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

  verMapa() {

    let alert = this.alertCtrl.create({
      title: 'Solicitud de Permiso',
      message: 'Es necesario compartir su ubicación!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Permitir',
          handler: () => {
            if(this.user.rol == 2) {
              console.log('envio id ' + this.repartidor_id);
              this.navCtrl.push(HomePage, {
                  rol: 2,
                  id: this.repartidor_id
                });
            } else {
              console.log('envio direccion ' + this.orden.direccion);
                this.navCtrl.push(HomePage, {
                  rol: 3,
                  direccion: this.orden.direccion
                  });
          }
              
          }
        }
      ]
    });
    alert.present();

  }

  repetirOrden() {
    var platillos = {};
    for (let element of this.platillos) {
      platillos[element.pivot.platillos_id] = {
        cantidad: element.pivot.cantidad
      }
    }
    
    this.auth.realizarOrden({
      usuario_id: this.user.id,
      direccion: this.orden.direccion,
      total: this.orden.total + 2,
      platillos: platillos
    }).then(resp => {
      this.loading.dismiss();
      if (resp.sucess) {
        this.mostrarAlerta('Se a realizado su orden con exito!!');
        this.navCtrl.setRoot('MenuLateralPage');
      }
      else
        this.mostrarAlerta('Ha ocurrido un error');
    }, error => alert(this.user))
    
  }

  pagarOrden() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AaNFIZVtL2XB54QXJ4Ut0BTvQmRVG3N5kxAC2S2xbttz0pGrsyxdpwR3ULSELFIcShVtHDEeUY0f7Tm9'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      })).then(() => {
        let payment = new PayPalPayment(this.orden.total, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((resp) => {
          
          if(resp.response.state == 'approved')
            this.mostrarAlerta('tu pago ha sido aprovad');
          else
            this.mostrarAlerta('tu pago no pudo ser procesado');

        }, () => {
        });
      }, () => {
      });
    }, () => {
    });
  }

  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
    //Write here wherever you wanna do
    if(this.user.rol == 3){
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot('HistorialPedidoPage')
    }
     
    }
  }

}
