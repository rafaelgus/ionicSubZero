import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePedidoPage } from './detalle-pedido';

@NgModule({
  declarations: [
    DetallePedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePedidoPage),
  ],
})
export class DetallePedidoPageModule {}
