import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element';
import { Swiper } from 'swiper/types';

register();

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public swiper!: Swiper;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  openFortest() {
    this.router.navigate(['/for-test']);
  }

}
