import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpcPageRoutingModule } from './cpc-routing.module';

import { CpcPage } from './cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CpcPageRoutingModule
  ],
  declarations: [CpcPage]
})
export class CpcPageModule {}
