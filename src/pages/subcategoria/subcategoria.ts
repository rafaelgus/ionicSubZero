import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the SubcategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subcategoria',
  templateUrl: 'subcategoria.html',
})
export class SubcategoriaPage {

  private subcategorias:any [];
  private skip: number = 0;

  constructor(public navCtrl: NavController, public auth: AuthProvider) 
  {}

  ionViewDidLoad() {
    this.auth.subcategorias(this.skip).then(resp => {
      if(resp.subcategorias != null)
        this.subcategorias = resp.subcategorias;
        console.log(this.subcategorias);
    });  
  }

  itemSelected(subcategoria) {
    this.navCtrl.push('CategoriaDetallePage', {
      id: subcategoria.id
    });
  }

  doInfinite(infiniteScroll) {
    this.skip += 15;
    this.auth.subcategorias(this.skip).then(resp => {
    
      if(resp.response.sucess == 1) {
        let items = resp.subcategorias;
          for (let item of items) {
            this.subcategorias.push(item);
          }
      }
      
      infiniteScroll.complete();
    });
  }

}
