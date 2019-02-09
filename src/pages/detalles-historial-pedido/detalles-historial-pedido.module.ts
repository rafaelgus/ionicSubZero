import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesHistorialPedidoPage } from './detalles-historial-pedido';

@NgModule({
  declarations: [
    DetallesHistorialPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesHistorialPedidoPage),
  ],
})
export class DetallesHistorialPedidoPageModule {}
