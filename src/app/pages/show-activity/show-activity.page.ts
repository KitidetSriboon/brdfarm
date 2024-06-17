import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';
import { take } from 'rxjs/operators';
import { tap } from 'rxjs';

@Component({
  selector: 'app-show-activity',
  templateUrl: './show-activity.page.html',
  styleUrls: ['./show-activity.page.scss'],
})
export class ShowActivityPage implements OnInit {

  itid?: any;
  cpdata?: any = [];
  fmdata?: any = [];
  cpActivityData?: any = []
  yearCr?: string = ""
  yearDesc?: string = ""
  canetype = ""
  newcanePlantinrange = false
  oldcaneHavePlant = false
  getCanemoney = 0
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in constructor :', this.itid)

  }

  ngOnInit() {
    // this.getDataActivity()
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter')
    this.getDataActivity()
  }

  ionViewDidEnter() {
    // console.log('ionViewDidEnter')
  }

  ionViewWillLeave() {
    // console.log('ionViewWillLeave')
  }

  ionViewDidLeave() {
    // console.log('ionViewDidLeave')
  }

  async getDataActivity() {
    await this.brdsql.getActivityDataFm(this.itid).subscribe({
      next: (res: any) => {
        if (res.recordset.length != 0) {
          this.cpActivityData = res.recordset[0];
          this.canetype = this.cpActivityData.canetype.substring(2, 1)
          // console.log('data ', this.cpActivityData)
          this.yearDesc = this.cpActivityData.year
        }
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => {
        this.getCanecal();
      }
    });
  }

  // คำนวณประมาณการวงเงินค่าอ้อย
  async getCanecal() {
    let fmdt: any = localStorage.getItem('fmdata'), fmcode: string = '', canewgt: number = this.cpActivityData.assess_left_fm
    if (fmdt) {
      fmdt = JSON.parse(fmdt)
      fmcode = fmdt[0].fmcode_b1
      // console.log('data ', fmcode, canewgt)
      await this.brdsql.canCalculate(fmcode, canewgt).subscribe({
        next: (res: any) => {
          // console.log('getCanecal res: ', res)
          if (res.recordset.length != 0) {
            this.getCanemoney = res.recordset[0].getcanemoney
          }
        },
        error: err => console.error('Observable emitted an error: ' + err),
        complete: () => {
          this.ckNewcanePlantdate();
        }
      })
    }
  }

  // ตรวจสอบวันปลูก อ้อยใหม่ ก่อน 15 มค. อ้อยตอ ต้องระบุพันธุ์
  async ckNewcanePlantdate() {
    // console.log('ckNewcanePlantdate')
    let x = this.cpActivityData
    // อ้อยปลูกใหม่ ต้องก่อน 15 มค. อ้อยตอ ต้องระบุวันปลูก
    if (this.canetype == 'R' && x.plantdate !== null) {
      const date1 = new Date('2024-01-15');    // กำหนด 15 มค.
      const date2 = new Date(x.plantdate);    // วันปลูก
      const year1 = date1.getFullYear();
      const year2 = date2.getFullYear();

      if (year1 > year2) {
        // console.log('ปีปัจจุบัน มากกว่า ปีวันปลูก OK ผ่าน');
        this.newcanePlantinrange = true
      } else if (year1 < year2) {
        // console.log('ปีปัจจุบัน น้อยกว่า ปีวันปลูก');
      } else {
        // console.log('ปีปัจจุบัน เป็นปีเดียวกับ ปีวันปลูก');
        let x: any = this.compareDateAndMonth(date1, date2)
        // console.log('จำนวนวันจาก 15 มค. และ วันปลูก', x)
        switch (x) {
          case 0:
            // console.log('วันปลูก เท่ากับ 15 มค.')
            this.newcanePlantinrange = true
            break;
          case 1:
            // console.log('วันปลูก ภายใน 15 มค. OK')
            this.newcanePlantinrange = true
            break;
          default:
            // console.log('วันปลูก เกิน 15 มค. !!No..')
            this.newcanePlantinrange = false
            break;
        }
      }
    } else if (this.canetype == 'T' && (x.plantdate !== null || x.plantdate !== '')) {
      // console.log('ST OK')
      this.oldcaneHavePlant = true
    }

  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

  // Function to compare only the date and month of two dates
  compareDateAndMonth(date1: any, date2: any) {
    // Extract month and date components
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Compare month and date components
    if (month1 === month2 && day1 === day2) {
      return 0; // Dates are equal
    } else if (month1 < month2 || (month1 === month2 && day1 < day2)) {
      return -1; // date1 is earlier than date2
    } else {
      return 1; // date1 is later than date2
    }

  }

}
