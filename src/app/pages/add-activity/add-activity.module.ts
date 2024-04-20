import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { AddActivityPageRoutingModule } from './add-activity-routing.module';

import { AddActivityPage } from './add-activity.page';
// import { Ng2SearchPipeModule } from 'ng2-search-filter'
// import { FilterPipe } from 'src/app/pipes/filter.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    // Ng2SearchPipeModule,
    // IonicSelectableModule,
    AddActivityPageRoutingModule,
    // FilterPipe,
  ],
  declarations: [AddActivityPage,]
})
export class AddActivityPageModule { }
