import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancesPageRoutingModule } from './finances-routing.module';

import { FinancesPage } from './finances.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancesPageRoutingModule
  ],
  declarations: [FinancesPage]
})
export class FinancesPageModule {}
