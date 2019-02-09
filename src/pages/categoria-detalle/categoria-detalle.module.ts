import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriaDetallePage } from './categoria-detalle';

@NgModule({
  declarations: [
    CategoriaDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriaDetallePage),
  ],
})
export class CategoriaDetallePageModule {}
