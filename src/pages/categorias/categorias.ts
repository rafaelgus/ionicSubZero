import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//importando librerias
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the CategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {
  private categorias:any [];
  private skip: number = 0;

  constructor(public navCtrl: NavController, public auth: AuthProvider) 
  {}

  ionViewDidLoad() {
    this.auth.categorias(this.skip).then(resp => {
      if(resp.response.sucess == 1)
        this.categorias = resp.response.categorias;
    });  
  }

  itemSelected(categoria) {
    this.navCtrl.push('SubcategoriaPage', {
      id: categoria.id
    });
  }

  doInfinite(infiniteScroll) {
    this.skip += 15;
    this.auth.categorias(this.skip).then(resp => {
    
      if(resp.response.sucess == 1) {
        let items = resp.response.categorias;
          for (let item of items) {
            this.categorias.push(item);
          }
      }
      
      infiniteScroll.complete();
    });
  }

}
