import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CpcPageRoutingModule } from './cpc-routing.module';

import { CpcPage } from './cpc.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CpcPageRoutingModule,
  ],
  declarations: [CpcPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CpcPageModule { }
