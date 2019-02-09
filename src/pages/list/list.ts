import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

//importando providers o librerias 
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import * as Util from '../../providers/Util';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  private SERVER = Util.SERVER;
  private platillos: any = [];
  public listPedido: any = [];
  private skip: number = 0;
  private myInput: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storage: Storage) { }

  ionViewWillEnter() {
  this.platillos = [];
   this.storage.get('pedido').then(resp => {
     if(resp != null)
       this.listPedido = resp;
     
       this.auth.platillos(this.skip).then((resp) => {
         if(resp.response.sucess == 1)
           this.filtro(resp.response.platillos);
       })
   })
    
  }

  agregar(plato) {
    plato.cantidad = 1;
    this.listPedido.push(plato)
    //var index = this.platillos.indexOf(plato, 0);
    //if (index > -1) {
    //  this.platillos.splice(index, 1);
    //}
    this.storage.set('pedido', this.listPedido);

  }

  detalles (plato) {
    this.alertCtrl.create({
      subTitle: "Detalles de su tramite",
      inputs:[{
        name: 'detalle',
        placeholder: 'Marca: Modelo: Placas: '
      },
      {
        name: 'propietario',
        placeholder: 'Nombre y cedula del propietario'
      }],
      buttons:[{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },{
        text: "Agregar",
        handler: (data) =>{
          console.log(data);
          var detalles: String = "\nDetalles: " + data.detalle + "\nPropietario: " + data.propietario;
          plato.descripcion = plato.descripcion + detalles;
          this.agregar(plato);
        }
      }

      ]
    }).present();

  }

  galeria(plato) {
    console.log("Envio Plato");
    console.log(plato);
    this.navCtrl.push('DetalleGaleriaPage', {
      Pedido: plato
    });
  } 

  pedido() {
    this.navCtrl.push('DetallePedidoPage', {
      listPedido: this.listPedido
    });
  }

  doInfinite(infiniteScroll) {
    this.skip += 15;
    this.auth.platillos(this.skip).then(resp => {
      let items = resp.response.platillos;

      if (items != undefined) {
        for (let item of items) {
          this.platillos.push(item);
        }
      }else{
        this.mostrarAlerta('No existen mas productos')
      }

      infiniteScroll.complete();
    });
  }

  mostrarAlerta(message) {
    let countdown: number = 1;

    let toast = this.toastCtrl.create({
        message: message,
        duration: countdown * 1000
    });
    toast.present();
    
  }


  onInput(){
    this.skip = 0;
    this.platillos = [];
    
    if(this.myInput != '') {
      this.auth.buscar(this.myInput).then(resp => {
  
        if(resp.response.sucess != 0) {
          this.platillos = [];
          this.filtro(resp.response.platillos);
        }
      
      })
    }else{
      this.auth.platillos(this.skip).then((resp) => {
        this.filtro(resp.response.platillos);
      })
    }
    
  }

  filtro(platillos) {
    let isAgregado: boolean = false;

    for(let item of platillos) {
      isAgregado = false;
      
      //if(this.listPedido != null ){
      //  for(let plato of this.listPedido){
      //    if(item.id == plato.id){
      //      isAgregado = true;
      //    }
      //  }
      
      //}
      if(this.listPedido != null ){
            if(!isAgregado)
              this.platillos.push(item);
          }
      }

  }

}
