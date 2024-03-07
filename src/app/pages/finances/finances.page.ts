import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2'
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.page.html',
  styleUrls: ['./finances.page.scss'],
})
export class FinancesPage implements OnInit {

  fmcode?: string;
  year_th?: string;
  yearCr?: string;
  yearTh?: string;
  yearDesc?: string;
  yearData?: any = [];
  fnData?: any = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private ldingCtrl: LoadingService,
  ) {
    let x: any = localStorage.getItem('yearID')
    if (x) {
      x = JSON.parse(x)
      this.yearData = x
    }
    let fm: any = localStorage.getItem('fmcode')
    if (fm) {
      this.fmcode = fm
    }
  }

  ngOnInit() {
  }

  async selectyear(e: any) {
    // console.log('select event', e.target.value)
    this.ldingCtrl.presentLoading('กำลังโหลดข้อมูลสินเชื่อปี ' + e.target.value)
    this.yearTh = e.target.value
    await this.brdsql.getFnFarmer(this.fmcode, this.yearTh).subscribe({
      next: (res: any) => {
        // console.log('res: ', res)
        this.ldingCtrl.closeLoading();
        this.fnData = res.recordset
      }
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.ldingCtrl.presentLoading('กำลังโหลดข้อมูลสินเชื่อปี ' + this.yearTh)
      this.brdsql.getFnFarmer(this.fmcode, this.yearTh).subscribe({
        next: (res: any) => {
          // console.log('res: ', res)
          this.ldingCtrl.closeLoading();
          this.fnData = res.recordset
          event.target.complete();
        }
      })
    }, 2000);
  }

}
