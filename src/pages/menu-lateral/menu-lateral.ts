import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { ListPage } from '../list/list';

//importando librerias
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MenuLateralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-lateral',
  templateUrl: 'menu-lateral.html',
})
export class MenuLateralPage {
  @ViewChild('content') nav: Nav;
  public pages: Array<{ title: string, component: any, icon: string }>;
  private user;
  rootPage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public geolocation: Geolocation,
    public auth: AuthProvider) {

  }

  ionViewWillEnter() {
    this.storage.get('user').then((val) => {  
      this.user = val
      if (this.user.rol == 2) {
        this.rootPage = ListPage;
        this.pages = [
          { title: 'Realizar pedidos', component: ListPage, icon: 'ios-basket' },
          { title: 'Categorias', component: 'CategoriasPage', icon: 'md-clipboard' },
          { title: 'Historial de pedidos', component: 'HistorialPedidoPage', icon: 'ios-archive' },
          { title: 'Cuenta', component: 'UpdateRegistroPage', icon: 'ios-person' },
          { title: 'Salir', component: 'LoginPage', icon: 'exit' }
        ];
      } else {
        this.rootPage = 'ListaDePedidosPage';
        this.pages = [
          { title: 'Lista de pedidos', component: 'ListaDePedidosPage', icon: 'ios-archive' },
          { title: 'Salir', component: 'LoginPage', icon: 'exit' }
        ];
      }

      this.enviarUbicacion();

    });

  }

  openPage(page) {
    if (page.title == 'Salir') {
      this.storage.set('user', undefined).then( ()=> {
        this.nav.setRoot(page.component);
      });
    }else {
      this.nav.setRoot(page.component);
    }
          
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario    
  }

  enviarUbicacion() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      let coords = { lat: data.coords.latitude, lng: data.coords.longitude }
      this.auth.enviarMiPosicion(this.user.id,coords);

    });
  }

}
