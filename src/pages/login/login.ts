import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//importando providers o librerias
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loading;
  private form: any = [];
  hideorshow = "eye"
  type = "password";


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public auth: AuthProvider,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToResetPassword() {
    this.navCtrl.push('RecuperarPasswordPage');
  }

  createAccount() {
    this.navCtrl.push('RegistroPage');
  }

  Home() {
    this.mostrarProgressBar('Cargando..');
    if (this.form.email != undefined && this.form.email != '') {
      this.auth.login({
        email: this.form.email,
        password: this.form.password
      }).then((val) => {
        if (val.response.sucess == 1) {
          this.storage.set('user', val.response.user).then(() => {
            this.navCtrl.setRoot('MenuLateralPage');
          });
        } else {
          this.mostrarAlerta(val.response.message);
        }
        this.loading.dismiss();
      })
    } else {
      this.mostrarAlerta('Por favor rellenar todos los campos');
    }

  }

  mostrarAlerta(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  mostrarProgressBar(message: string): void {
    this.loading = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  ocultarMostrarPassword() {
    var state = this.type

    if (state === "password") {

      this.type = 'text';
      this.hideorshow = "eye-off";

    }
    else {

      this.type = "password"
      this.hideorshow = "eye"
    }
  }

}
