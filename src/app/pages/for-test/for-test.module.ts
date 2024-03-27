import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForTestPageRoutingModule } from './for-test-routing.module';

import { ForTestPage } from './for-test.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForTestPageRoutingModule
  ],
  declarations: [ForTestPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForTestPageModule { }
