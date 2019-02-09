import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDePedidosPage } from './lista-de-pedidos';

@NgModule({
  declarations: [
    ListaDePedidosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDePedidosPage),
  ],
})
export class ListaDePedidosPageModule {}
