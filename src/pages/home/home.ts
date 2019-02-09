import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController, AlertController } from 'ionic-angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';



declare var google: any;
var directionsDisplay: any; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //directionsDisplay = new google.maps.DirectionsRenderer(); 
  private loading: any;
  mapId = Math.random() + 'map';
  map: any;
  startLatLng: any;
  destLatLng: any;
  //directionsService: any;
  marker: any;
  markerCadete: any;
    //New para los markets
  cadeteTracking: any;
  markers = [];
  user: any;
  ordenLat:any;
  ordenLon:any;
  autocomplete = { input: '' };
  camera: any = {
    zoom: 12,
    tilt: 30
  };
  destino:any; 

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    public auth: AuthProvider,
    public params: NavParams) {   }

  ionViewDidLoad() {
    
      this.storage.get('user').then(data => {
        this.user = data;
        console.log("parametros que recibo ");
        console.log(' usuario ' + this.params.get('id'));
        console.log(' destino ' + this.params.get('direccion'));
        this.mostrarProgressBar('Cargando mapa...');
        this.loadMap();
        this.getPosicionActual();

      });
 

  }

  ionViewWillLeave() {
    // stop cadete driver
    clearInterval(this.cadeteTracking);
  }

  loadMap() {
   
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.startLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      
      let mapOptions = {
        center: this.startLatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
      }
  
      this.map = new google.maps.Map(document.getElementById(this.mapId), mapOptions);

      if ( this.user.rol == 2 ) {

        console.log('directions display');
        console.log('usuario marker');
         this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.startLatLng,
          icon: {
                url: 'assets/imgs/mePin.svg',
                size: new google.maps.Size(36, 42),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(22, 28),
                popupAnchor: new google.maps.Point(0,-30),
                scaledSize: new google.maps.Size(32, 32)
              },
          });

          this.markers.push(this.marker);
          this.showMarkers();
          //Si hay datos de repartidor
          if (this.params.get('id')) {

              this.auth.getUbicacion(this.params.get('id')).then(resp => {
                
                  console.log('ubicacion del usuario');
                  console.log(resp);
                  this.destLatLng = new google.maps.LatLng(resp.lat,resp.lng);//va el la ruta

                  console.log('agrega marker 2 cadete');
                  this.markerCadete = new google.maps.Marker({
                      map: this.map,
                      //animation: google.maps.Animation.DROP,
                      position: this.destLatLng,
                          icon: {
                          url: "assets/imgs/bike.svg",
                          size: new google.maps.Size(36, 42),
                          origin: new google.maps.Point(0, 0),
                          anchor: new google.maps.Point(22, 28),
                         popupAnchor: new google.maps.Point(0,-30),
                          scaledSize: new google.maps.Size(32, 32)
                      }
                    });
                    this.markers.push(this.markerCadete);
                    this.showMarkers();   
                    this.creaRuta(this.map);               
            
              });
            
              this.trackCadete();
                
          } else {
            this.alertCtrl.create({
              subTitle:'No hay repartidor asignado a su pedido, lo estamos preparando...',
               buttons: ['OK']
             }).present();


          }
          
          this.loading.dismiss();


      } else {
  
          console.log('cadete marker');
          this.marker = new google.maps.Marker({
            map: this.map,
            //animation: google.maps.Animation.DROP,
            position: this.startLatLng,// debe ser el star
            icon: {
                  url: "assets/imgs/bike.svg",
                  size: new google.maps.Size(36, 42),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(22, 28),
                  popupAnchor: new google.maps.Point(0,-30),
                  scaledSize: new google.maps.Size(32, 32)
                }
              });

            this.markers.push(this.marker);
            this.showMarkers();
            console.log('trae destino');
            this.autocomplete.input = this.params.get('direccion'); //temporal
            console.log(this.autocomplete.input);
      
          this.creaRuta(this.map);
      
        this.loading.dismiss();

      }
  
    }).catch((error) => {
      this.loading.dismiss();
      console.log('Error getting location', error);
      
    });
  
  }

  // track drivers
  trackCadete() {
    this.showCadeteOnMap();
    clearInterval(this.cadeteTracking);

    this.cadeteTracking = setInterval(() => {
      console.log('intervalo 10 s');
      this.showCadeteOnMap();
    }, 10000);
    
  }
  
  showCadeteOnMap() {

    this.auth.getUbicacion(this.params.get('id')).then(resp => {            
        console.log('Rastreo del cadete');
        this.markerCadete.setPosition(new google.maps.LatLng(resp.lat,resp.lng));
        //Cuando se mueve el cadete
        this.creaRuta(this.map);
      
    });
  

  }

  getPosicionActual() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      if (this.marker != undefined) {
        console.log('Movimiento del Marker A');
        this.marker.setPosition(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
        this.creaRuta(this.map);

        }

      });
  }

 
  creaRuta(map) {
 
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
  let directionsService = new google.maps.DirectionsService();
      var request: any;
      if ( this.user.rol == 2 ) {
        console.log('Si se movio Usuario  Marker A');
        directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: false,
          suppressMarkers: true
          });
        request = {
            origin: this.marker.getPosition(),
            destination: this.markerCadete.getPosition(),
            travelMode: google.maps.TravelMode.DRIVING
        };
      } else {
        console.log('Si se movio Cadete  Marker A');
        directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: false,
          suppressMarkers: false});
        //cambia e render
        request = {
          origin: this.marker.getPosition(),
          destination: this.autocomplete.input,
          travelMode: google.maps.TravelMode.DRIVING
        };
      }
  

  directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          console.log('ruta principal');
          console.log(response);
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
      } else {
          console.log("error");
      }
  });


  directionsDisplay.addListener('directions_changed', function () {
    console.log('Hubo cambios en las direcciones');

    directionsDisplay.setMap(map);

  });


}



   // Sets the map on all markers in the array.
   setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  showMarkers() {
    this.setMapOnAll(this.map);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  
   // Removes the markers from the map, but keeps them in the array.
   clearMarkers() {  
    this.setMapOnAll(null);
  }  

  getDireccion(lat, lng) {    
    this.geocoder.reverseGeocode(lat, lng)
      //.then((result: NativeGeocoderReverseResult) => {
      .then((result: any) => {
        let address = [
          (result[0].thoroughfare || "") + " " + (result[0].subThoroughfare || ""),
          result[0].locality
        ].join(", ");
        console.log("reverseGeocode:")
        console.log(address);
        this.autocomplete.input = address;
        
      })
      .catch((error: any) => {

      });

  }
  
  getCoordenadas(direccion) {    
    this.geocoder.forwardGeocode (direccion)
      //.then((result: NativeGeocoderReverseResult) => {
      .then((coordinates: any) => {
        console.log("forwardGeocode:");
        console.log(coordinates);
        this.destLatLng = new google.maps.LatLng(coordinates[0].latitude, coordinates[0].longitude);
        
      })
      .catch((error: any) => {

      });

  }

  mostrarProgressBar(message: string): void {
    this.loading = this.loadingCtrl.create({
      content: message,
    });
    this.loading.present();
  }


  

}
