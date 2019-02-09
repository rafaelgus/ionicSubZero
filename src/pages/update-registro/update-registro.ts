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
  selector: 'page-update-registro',
  templateUrl: 'update-registro.html',
})
export class UpdateRegistroPage {

  public loading;
  public form: any = [];
  private user:any = [];
  private user_id :any ;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage) 
    {}

    ionViewDidLoad() {
      this.mostrarProgressBar('Cargando...');
      this.storage.get('user').then( resp => {
          this.user = resp;
          console.log(this.user);
          this.user_id = this.user.id;
          this.form.name = this.user.name;
          this.form.email = this.user.email;
          this.form.telefono = this.user.telefono;
          this.form.whatsapp = this.user.whatsapp;
          this.loading.dismiss();
        });
      
    }

  Actualizar() {
    this.mostrarProgressBar('Cargando...');

    if (
      this.form.name != undefined && this.form.name != '' &&
      this.form.email != undefined && this.form.email != '' &&
      this.form.password != undefined && this.form.password != '' &&
      this.form.password2 != undefined && this.form.password2 != '' &&
      this.form.telefono != undefined && this.form.telefono != '' &&
      this.form.whatsapp != undefined && this.form.whatsapp != ''   ) {

      if (this.form.password == this.form.password2) {
        let user = this.convertirData();
        this.auth.update(this.user_id, user)
          .then(resp => {
            if (resp.sucess == 0)
              this.mostrarAlerta('Error!!, No hay registro se encuentra en uso');
            else
              this.regresarLogin();
          })
      } else
        this.mostrarAlerta('Erro!!, Las contrasenas no coinciden');
    } else
      this.mostrarAlerta('Error!!, Por favor rellenar todos los campos');

    this.loading.dismiss();
  }

  regresarLogin() {
    this.mostrarAlerta('Se realizaron los cambios con exito!!');
      this.navCtrl.setRoot('LoginPage');
  
  }

  convertirData(): any {
    return {
      name: this.form.name,
      email: this.form.email,
      telefono: this.form.telefono,
      whatsapp: this.form.whatsapp,
      password: this.form.password,
      rol: 2
    }
  }

  mostrarAlerta(message) {
    let alert = this.alertCtrl.create({
      title: 'Aviso',
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
