import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//importando providers o librerias
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  public loading;
  public form: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage) 
    {}

  Registrarse() {
    this.mostrarProgressBar('Cargando...');

    if (
      this.form.name != undefined && this.form.name != '' &&
      this.form.email != undefined && this.form.email != '' &&
      this.form.password != undefined && this.form.password != '' &&
      this.form.password2 != undefined && this.form.password2 != '' &&
      this.form.telefono != undefined && this.form.telefono != '' &&
      this.form.whatsapp != undefined && this.form.whatsapp != '' &&
      this.form.zona != undefined && this.form.zona != ''  ) {

      if (this.form.password == this.form.password2) {
        let user = this.convertirData();
        this.auth.registro(user)
          .then(resp => {
            if (resp.sucess == 0)
              this.mostrarAlerta('Email ya se encuentra en uso');
            else
              this.guardarUsuario(resp.response.user);
          })
      } else
        this.mostrarAlerta('Las contrasenas no coinciden');
    } else
      this.mostrarAlerta('Por favor rellenar todos los campos');

    this.loading.dismiss();
  }

  guardarUsuario(user) {
    console.log("zzona");
    console.log(this.form.zona);
    this.storage.set('user', user).then( ()=> {
      this.navCtrl.setRoot('MenuLateralPage');
    }); 
  }

  convertirData(): any {
    return {
      name: this.form.name,
      email: this.form.email,
      telefono: this.form.telefono,
      whatsapp: this.form.whatsapp,
      password: this.form.password,
      zona_id : this.form.zona,
      rol: 2
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


}
