import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactorPageRoutingModule } from './factor-routing.module';

import { FactorPage } from './factor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactorPageRoutingModule
  ],
  declarations: [FactorPage]
})
export class FactorPageModule {}
