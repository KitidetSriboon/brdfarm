import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { BrdsqlService } from 'src/app/services/brdsql.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GlobalConstants } from 'src/app/global-constants';
import { yearCr, yearTh, yearLabel } from 'src/app/global-constants';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.page.html',
  styleUrls: ['./add-activity.page.scss'],
})
export class AddActivityPage implements OnInit {

  formMethod = ""
  itid?: any;
  cpdata?: any = [];
  cpActivitydata?: any = [];
  frm_addcpact!: FormGroup;
  frm_editcpact!: FormGroup;
  frm_insert?: boolean
  frm_edit?: boolean
  yearCr = yearCr();
  yearTh = yearTh();
  yearLabel = yearLabel();
  perTon?: number = 0;
  ton?: any
  change = true
  // ตัวแปรแสดงสีของแต่ละกิจกรรม
  cl_groundlevel = "warning"
  cl_hardSoilBlast = "warning"
  cl_seedclear = "warning"
  cl_groove = "warning"
  cl_NaturalFertilizer = "warning"
  cl_FertilizerRound1 = "warning"
  cl_pipeup = "warning"
  cl_GerminationPercent = "warning"
  cl_ton = "warning"
  //ตัวแปร สำหรับ binding ฟอร์มกับ field database
  groundlevel = ""
  tg_groundlevel: boolean = false; // Default value
  hardSoilBlast = ""
  tg_hardSoilBlast: boolean = false; // Default value
  seedclear = ""
  tg_seedclear: boolean = false; // Default value
  groove = 0
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
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,

  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in add-activity :', this.itid)

    let cp_data: any
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cp_data)
    this.cpdata = cp_data[0];
    this.perTon = cp_data.ton_last_fm

    // เชคว่า เคยมีการบันทึกข้อมูลไว้แล้วหรือไม่จาก itid
    this.brdsql.cpActivityFm(this.itid).subscribe({
      next: (res: any) => {
        console.log('res cpActivityFm ', res)
        if (res && res.recordset !== 0) {
          this.frm_edit = true
          console.log('frm_edit', this.frm_edit)
          this.cpActivitydata = res.recordset[0]
          this.ck_fmacOK(this.cpActivitydata);
          console.log('cpActivityFm ', this.cpActivitydata)

          this.frm_editcpact = fb.group({
            itid: [this.cpActivitydata.itid,],
            yearid: [this.cpActivitydata.year,],  // ปีของแปลงอ้อย
            groundlevel: [this.cpActivitydata.groundlevel,],  // การปรับระดับพื้นที่
            hardSoilBlast: [this.cpActivitydata.hardSoilBlast],  // การระเบิดดาน
            seedclear: [this.cpActivitydata.seedclear],  // การคัดพันธุ์อ้อย สะอาด
            groove: [this.cpActivitydata.groove,],  // ระยะรอง ซม.
            // NaturalFertilizer: [this.cpActivitydata.NaturalFertilizer,],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            // ton: [this.cpActivitydata.ton_last_fm, [Validators.required, Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            // wastedSpaceRai: [this.cpActivitydata.wastedSpaceRai,],  // พท.สูญเสียของแปลง (ไร่)
            // Cutseed: [this.cpActivitydata.Cutseed,],  // ตันพันธุ์
            // ton_lost: [this.cpActivitydata.ton_lost,],  // ตันสูญเสียจากการตัด
          })

        } else {
          this.frm_insert = true;
          console.log('frm_insert', this.frm_insert)
          let cp_data = this.cpdata
          this.frm_addcpact = fb.group({
            itid: [cp_data.itid, [Validators.required]],
            yearid: [cp_data.year, [Validators.required]],  // ปีของแปลงอ้อย
            groundlevel: ['',],  // การปรับระดับพื้นที่
            hardSoilBlast: [''],  // การระเบิดดาน
            seedclear: [''],  // การคัดพันธุ์อ้อย สะอาด
            groove: [0, [Validators.min(0), Validators.max(300)]],  // ระยะรอง ซม.
            // NaturalFertilizer: ['',],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            // ton: [0, [Validators.required, Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            // wastedSpaceRai: [0,],  // พท.สูญเสียของแปลง (ไร่)
            // Cutseed: [0,],  // ตันพันธุ์
            // ton_lost: [0,],  // ตันสูญเสียจากการตัด
          })
        }
      }
    })

  }

  ngOnInit() {
  }

  // ปรับสีกิจกรรมทำแล้ว สีเขียว
  ck_fmacOK(data: any) {
    let x = this.cpActivitydata
    if (data.groundlevel == 'Y') {
      this.groundlevel = x.groundlevel
      this.cl_groundlevel = 'success'
      this.tg_groundlevel = true
    }
    if (data.hardSoilBlast == 'Y') {
      this.hardSoilBlast = x.hardSoilBlast
      this.cl_hardSoilBlast = 'success'
      this.tg_hardSoilBlast = true;
    }
    if (data.seedclear == 'Y') {
      this.seedclear = x.seedclear
      this.cl_seedclear = 'success'
      this.tg_seedclear = true;
    }
    if (data.groove >= 140) {
      this.groove = x.groove
      this.cl_groove = 'success'
      console.log('groove', this.groove)
    }
  }


  // การปรับพื้นที่แปลง
  ck_groundlevel(e: any) {
    let x = e.detail.checked
    console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_groundlevel = "success"
        this.tg_groundlevel = true
        this.groundlevel = "Y"
        break;
      case false:
        this.cl_groundlevel = "warning"
        this.tg_groundlevel = false
        this.groundlevel = "N"
        break;
      default:
        this.cl_groundlevel = "warning"
        this.tg_groundlevel = false
        this.groundlevel = ""
        break;
    }
  }

  // การระเบิดดาน
  ck_hardSoilBlast(e: any) {
    let x = e.detail.checked
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_hardSoilBlast = "success"
        break;
      case false:
        this.cl_hardSoilBlast = "warning"
        break;
      default:
        this.cl_hardSoilBlast = "warning"
        break;
    }
  }

  // การคัดพันธุ์อ้อย
  ck_seedclear(e: any) {
    let x = e.detail.checked
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_seedclear = "success"
        break;
      case false:
        this.cl_seedclear = "warning"
        break;
      default:
        this.cl_seedclear = "warning"
        break;
    }
  }

  // ระยะร่อง 140 ขึ้นไป
  ck_groove(e: any) {
    let x: number = e.detail.value
    // console.log('groove ', x);
    switch (true) {
      case (x >= 140):
        this.cl_groove = "success"
        break;
      default:
        this.cl_groove = "warning"
        break;
    }
  }

  // คำนวณปริมาณตัน
  async newTon(event: any, f: any) {
    this.perTon = event.target.value;
    this.fminput.la = parseFloat(f.wastedSpaceRai)
    this.fminput.cst = parseFloat(f.Cutseed)
    this.fminput.lc = parseFloat(f.ton_lost)
    let toned: number = 0;
    // พื้นที่ - พื้นที่เสียหาย x ตัดพันธุ์+ตันสูญเสียจากการตัด = ปริมาณตันประเมิน
    toned = (this.cpdata.landvalue - this.fminput.la)
    this.fminput.arealeft = toned
    toned = (event.target.value * toned)
    toned = (toned - (this.fminput.cst + this.fminput.lc));
    this.ton = toned.toFixed(2);
    this.fminput.tonleft = toned
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  // test
  async test(f: any) {
    console.log('form:', f)
  }

  // บันทึกข้อมูลกิจกรรมแปลง
  async submit(f: any) {

    console.log('form :', f)

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

  async saveData(f: any) {
    console.log('form to brdservice :', f)

    // updat firebase database
    this.firebase.updateFmAS(this.yearCr, this.itid, f)
      .then(res => { })
      .finally(() => { })
      .catch(e => {
        console.log('error ', e)
      })

    // update sql server
    await this.brdsql.updateFmActivity(f).subscribe({
      next: (res: any) => {
        console.log('res :', res)
        if (res.rowsAffected.length !== 1) {
          this.presentAlert('!!ผิดพลาด...', '', 'ข้อมูลไม่ถูกบันทึก กรุณาลองอีกครั้ง')
        } else {
          this.presentAlert('(^-^)...สำเร็จ', '', '...บันทึกข้อมูลของท่านแล้ว ขอขอบพระคุณอย่างสูง')
          this.navCtrl.back();
        }
      }, error(err) { }
      , complete() {

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
