import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//importando librerias
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import * as Util from '../../providers/Util';


declare var google;

/**
 * Generated class for the DatosEnvioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-datos-envio',
  templateUrl: 'datos-envio.html',
})
export class DatosEnvioPage {
  private loading: any;
  private user: any = [];
  private listPedido: any = [];
  private formasPago;
  private selecion;
  private subTotal: number;
  private cargoDomicilio: number;
  private observaciones: string;
  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  autocomplete = { input: '' };
  autocomplete2 = { input: '' };
  autocompleteItems = [];
  autocompleteItems2 = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    public auth: AuthProvider,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public zone: NgZone) {
  }

  ionViewDidLoad() {
    this.mostrarProgressBar('Cargando');
    this.storage.get('user').then((val) => {
      this.user = val;

      this.subTotal = this.navParams.get('subTotal');
      this.listPedido = this.navParams.get('listPedido');

      this.auth.formasdepago().then( resp => {
        this.formasPago = resp;
      })
    });


    this.geolocation.getCurrentPosition().then(response => {
      this.getDireccion(response.coords.latitude, response.coords.longitude);
      this.calcularTaxa(response.coords.latitude, response.coords.longitude);
    })
      .catch(error => {
        this.loading.dismiss();
        this.mostrarAlerta('No tiene prendido su GPS');        
      })
  }

  agregar(){
    this.navCtrl.push('DetalleTramitePage');
  }


  getDireccion(lat, lng) {    
    this.geocoder.reverseGeocode(lat, lng)
      .then((result: NativeGeocoderReverseResult[]) => {
      //.then((result: any) => {
        console.log(result);
        let address = [
          (result[0].thoroughfare || "") + " " + (result[0].subThoroughfare || ""),
          result[0].locality
        ].join(", ");

        this.autocomplete.input = address;
        this.autocomplete2.input = address;
        this.loading.dismiss();
      })
      .catch((error: any) => {
        this.loading.dismiss();
      });

  }

  confirmarPedido() {

    //
    this.mostrarProgressBar('Cargando...');
    if (this.autocomplete.input == ' ' || this.autocomplete.input == undefined) {
      this.mostrarAlerta('Por favor rellenar todos los campos')
      this.loading.dismiss();
      return;
    }

    ///
    let alert = this.alertCtrl.create({
      title: 'Aviso',
      message: 'Su forma de pago es correcta? ' ,
      buttons: [
        {
          text: 'Cambiar',
          role: 'cancel',
          handler: () => {
            this.loading.dismiss();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
        
            var platillos = {};
            for (let element of this.listPedido) {
              platillos[element.id] = {
                cantidad: element.cantidad
              }
            }
          
            //agrega pedido si la direccion de recogida es diferente a la de entrega
            if ( this.autocomplete.input != this.autocomplete2.input) {
                this.observaciones = this.observaciones + "\Direcion de retiro de documentos: \n" + this.autocomplete2.input;
                this.auth.realizarOrden({
                  usuario_id: this.user.id,
                  direccion: this.autocomplete2.input,
                  total: this.subTotal,
                  platillos: platillos,
                  formapago: this.selecion,
                  observaciones: this.observaciones 
                }).then(resp => {
                  this.loading.dismiss();
                  if (resp.sucess) {
                    this.storage.set('pedido',null).then( ()=> {
                      this.mostrarAlerta('Se agrego direccion de recogida con exito!!');
                    });
                  }
                  else
                  this.mostrarAlerta('Ha ocurrido un error');
                }, error => {
                  this.mostrarAlerta('Ha ocurrido un error');
                });
            }
        
            this.auth.realizarOrden({
              usuario_id: this.user.id,
              direccion: this.autocomplete.input,
               total: this.subTotal,
                platillos: platillos,
              formapago: this.selecion,
              observaciones: this.observaciones
            }).then(resp => {
              this.loading.dismiss();
              if (resp.sucess) {
                this.storage.set('pedido',null).then( ()=> {
                  this.mostrarAlerta('Se a realizado su orden con exito!!');
                  this.navCtrl.push('DetallesHistorialPedidoPage', {
                    orden: resp.orden,
                    user: this.user
                   });
                });
              }
              else
              this.mostrarAlerta('Ha ocurrido un error');
             }, error => {
              this.mostrarAlerta('Ha ocurrido un error');
            });

          }
        }
      ]
    });
    alert.present();
    ////
  
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

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  updateSearchResultsRecogida(){
    if (this.autocomplete2.input == '') {
      this.autocompleteItems2 = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete2.input },
    (predictions, status) => {
      this.autocompleteItems2 = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems2.push(prediction);
        });
      });
    });
  }

  selectSearchResult(result) {
    this.calcularTaxaString(result.place_id);
    this.autocomplete.input = result.description;
    this.autocomplete2.input = result.description;
    this.autocompleteItems = [];
  }

  selectSearchResultRecogida(result) {
    this.calcularTaxaString(result.place_id);
    this.autocomplete2.input = result.description;
    this.autocompleteItems2 = [];
  }

  calcularTaxa(lat, lng) {
    var direccion = Util.GOOGLE_DIST +'origins='+lat+','+lng+Util.GOOGLE_DESTINATIONS;
    this.auth.getDistance(direccion).then( resp => {
      
      var km = resp.rows[0].elements[0].distance.value / 1000;
      if( km >= 0 && km <= 10) 
        this.cargoDomicilio = 4;
      else if( km > 10 && km<= 15)
        this.cargoDomicilio = 6;
      else if( km > 15 && km <= 20)
        this.cargoDomicilio = 8;
      else if ( km > 20 && km <= 25)
        this.cargoDomicilio = 10;
      else if( km > 25 )
        this.cargoDomicilio = 12;

    }, error => alert(JSON.stringify(error)))
  }

  calcularTaxaString(direccion:string) {
    var direccion = Util.GOOGLE_DIST +'origins=place_id:' +direccion+ Util.GOOGLE_DESTINATIONS;
    this.auth.getDistance(direccion).then( resp => {
      
      var km = resp.rows[0].elements[0].distance.value / 1000;
      if( km >= 0 && km <= 10) 
        this.cargoDomicilio = 4;
      else if( km > 10 && km<= 15)
        this.cargoDomicilio = 6;
      else if( km > 15 && km <= 20)
        this.cargoDomicilio = 8;
      else if ( km > 20 && km <= 25)
        this.cargoDomicilio = 10;
      else if( km > 25 )
        this.cargoDomicilio = 12;

    }, error => alert(JSON.stringify(error)))
  }

}
