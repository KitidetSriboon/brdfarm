import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';


@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.page.html',
  styleUrls: ['./add-activity.page.scss'],
})
export class AddActivityPage implements OnInit {

  itid?: any;
  cpdata?: any = [];
  frm_addcpact!: FormGroup;
  yearCr?: string = GlobalConstants.yearCr

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,

  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in constructor :', this.itid)

    let cpdata: any = []
    cpdata = GlobalConstants.cpFmdata
    cpdata = cpdata.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cpdata)
    this.cpdata = cpdata[0];

    this.frm_addcpact = fb.group({
      itid: '',
      yearid: '',
      ton: 0,
    })

  }

  ngOnInit() {
  }

  // คำนวณปริมาณตัน
  perTon?: number;
  ton?: any
  async newTon(event: any) {
    this.perTon = event.target.value;
    this.ton = (event.target.value * this.cpdata.landvalue).toFixed(2);
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  // บันทึกข้อมูลกิจกรรมแปลง
  async submit(f: any) {

    console.log('form :' ,f)

    const alert = await this.alCtrl.create({
      cssClass: 'my-custom-class',
      header: `ยืนยันการบันทึก`,
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          id: 'cancel-button',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'บันทึก',
          cssClass: 'alert-button-confirm',
          id: 'confirm-button',
          handler: async () => {
            this.saveData(f)
            // console.log('you click SAVE...')
          }
        }
      ]
    });

    await alert.present();
  }

  async saveData(f:any) {
    console.log('form to brdservice :' ,f)
    await this.brdsql.updateFmActivity(f).subscribe({
      next: (res: any) => {
        console.log('res :' ,res)
        if(res.rowsAffected.length !== 1) {
          this.presentAlert('!!ผิดพลาด...','','ข้อมูลไม่ถูกบันทึก กรุณาลองอีกครั้ง' )
        } else {
          this.presentAlert('(^-^)...สำเร็จ','','...บันทึกข้อมูลของท่านแล้ว ขอขอบพระคุณอย่างสูง' )
          this.navCtrl.back();
        }
      },error(err) {}
      ,complete() {

      },
    })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async presentAlert(h: string, s: string, m: string) {
    const alert = await this.alCtrl.create({
      header: h,
      subHeader: s,
      message: m,
      buttons: ['OK'],
      cssClass: 'custom-alert',
    });
    await alert.present();
  }


}
