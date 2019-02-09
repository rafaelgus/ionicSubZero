import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorialPedidoPage } from './historial-pedido';

@NgModule({
  declarations: [
    HistorialPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(HistorialPedidoPage),
  ],
})
export class HistorialPedidoPageModule {}
