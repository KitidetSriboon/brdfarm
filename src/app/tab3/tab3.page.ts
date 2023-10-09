import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  openFortest() {
    this.router.navigate(['/for-test']);
  }

}
