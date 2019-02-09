import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleTramitePage } from './detalle-tramite';

@NgModule({
  declarations: [
    DetalleTramitePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleTramitePage),
  ],
})
export class DetalleTramitePageModule {}
