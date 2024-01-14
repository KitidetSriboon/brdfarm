import { Component } from '@angular/core';
import { BrdsqlService } from '../services/brdsql.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private brdsql: BrdsqlService,
  ) {
    // this.getOrgaincType();
  }

  async getOrgaincType() {
    let x: any;
    this.brdsql.getOrganicType().subscribe({
      next: (res: any) => {
        if (res) {
          x = res.recordset[0]
          x = JSON.stringify(x)
          localStorage.setItem('organic', x)
        }
      }
    })
  }

}
