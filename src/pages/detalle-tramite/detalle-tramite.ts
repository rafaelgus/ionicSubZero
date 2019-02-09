import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {global} from "../../providers/global";

@IonicPage()
@Component({
  selector: 'page-detalle-tramite',
  templateUrl: 'detalle-tramite.html',
})
export class DetalleTramitePage {

  public form: any = []; 
  public detallesTramite: any;
  constructor(public navCtrl: NavController) 
  {  }


  agregar() {

    var detallestramite:string = " Datos del Propietario" +
        "\nNombre completo: " + this.form.name +
        "\nCedula o ID: " +  this.form.cedula + 
        "\nDatos del Auto" +
        "\nMarca: " + this.form.marca + 
        "\nModelo: " + this.form.modelo +
        "\nAño: " + this.form.ano +
        "\nPlacas: " + this.form.placas +
        "\nNumero de pasajeros: " + this.form.pasajeros
    console.log(detallestramite);
    global.detallesTramite = detallestramite;
    this.navCtrl.pop();

  }

}
