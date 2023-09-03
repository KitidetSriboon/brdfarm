import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  perTon?: number = 0;
  ton?: any
  fminput = {
    "la": 0,
    "cst": 0,
    "lc": 0,
    "arealeft": 0,
    "tonleft": 0,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,

  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in add-activity :', this.itid)

    let cp_data: any = []
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cp_data)
    this.cpdata = cp_data[0];
    this.perTon = this.cpdata.ton_last_fm

    this.frm_addcpact = fb.group({
      itid: ['',[Validators.required]],
      yearid: ['',[Validators.required]],
      ton: [10,[Validators.required,Validators.min(0),Validators.max(35)]],
      wastedSpaceRai: [0,],
      Cutseed: [0,],
      ton_lost: [0,],
    })

  }

  ngOnInit() {
  }

  // คำนวณปริมาณตัน
  async newTon(event: any ,f: any) {
    this.perTon = event.target.value;
    this.fminput.la = parseFloat(f.wastedSpaceRai)
    this.fminput.cst = parseFloat(f.Cutseed)
    this.fminput.lc = parseFloat(f.ton_lost)
    let toned: number = 0;
    // พื้นที่ - พื้นที่เสียหาย x ตัดพันธุ์+ตันสูญเสียจากการตัด = ปริมาณตันประเมิน
    toned = (this.cpdata.landvalue-this.fminput.la)
    this.fminput.arealeft = toned
    toned = (event.target.value * toned)
    toned = (toned -(this.fminput.cst+this.fminput.lc));
    this.ton = toned.toFixed(2);
    this.fminput.tonleft = toned
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

  closeCurrentPage() {
    this.navCtrl.back();
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
