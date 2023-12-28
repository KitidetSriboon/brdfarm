import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TUploadPageRoutingModule } from './t-upload-routing.module';

import { TUploadPage } from './t-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TUploadPageRoutingModule
  ],
  declarations: [TUploadPage]
})
export class TUploadPageModule { }
