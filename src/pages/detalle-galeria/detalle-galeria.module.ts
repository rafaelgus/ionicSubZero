import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleGaleriaPage } from './detalle-galeria';

@NgModule({
  declarations: [
    DetalleGaleriaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleGaleriaPage),
  ],
})
export class DetalleGaleriaPageModule {}
