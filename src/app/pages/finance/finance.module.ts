import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancePageRoutingModule } from './finance-routing.module';

import { FinancePage } from './finance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FinancePageRoutingModule
  ],
  declarations: [FinancePage]
})
export class FinancePageModule { }
