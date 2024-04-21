import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'app-show-activity',
  templateUrl: './show-activity.page.html',
  styleUrls: ['./show-activity.page.scss'],
})
export class ShowActivityPage implements OnInit {

  itid?: any;
  cpdata?: any = [];
  cpActivityData?: any = []
  yearCr?: string = ""
  yearDesc?: string = ""

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in constructor :', this.itid)

    // let cp_data: any = []
    // cp_data = localStorage.getItem('cpfmdata')
    // cp_data = JSON.parse(cp_data)
    // cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    // console.log('cpdata filter :', cp_data)

    // setTimeout(() => {
    //   this.cpdata = cp_data[0];
    //   this.cpActivityData = cp_data
    //   console.log('cpdata :', this.cpdata)
    //   console.log('cpActivityData :', this.cpActivityData)
    //   // this.getDataActivity()
    // }, 1000);

  }

  ngOnInit() {
    // this.getDataActivity()
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    this.getDataActivity()
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter')
  }

  async getDataActivity() {
    console.log('getDataActivity')
    await this.brdsql.getActivityDataFm(this.itid).subscribe({
      next: (res: any) => {
        // console.log('res api:', res)
        if (res.recordset.length != 0) {
          this.cpActivityData = res.recordset[0];
          this.yearDesc = this.cpActivityData.year
          // console.log('cpActivityData with api :', this.cpActivityData)
        }
        // console.log('not data from api :', this.cpActivityData)
      }
    });
  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

}
