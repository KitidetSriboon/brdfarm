import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

import {
  ModalController,
  ActionSheetController,
  ToastController,
  LoadingController,
  IonAccordionGroup,
  AlertController,
  AnimationController
} from '@ionic/angular';

import { BrdsqlService } from '../services/brdsql.service';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  overallP: any = true;
  activityP: any = false;
  factorP: any = false;
  yearCr?: string = GlobalConstants.yearCr
  yearTh?: string = GlobalConstants.yearTh
  appName?: string = GlobalConstants.appname
  appVersion?: string = GlobalConstants.appversion
  appUpdate?: string = GlobalConstants.lastupdate
  yearActive?: any = [];
  yearDesc?: string = GlobalConstants.yearLabel
  fmdata?: any = [];
  cpfm?: any = [];
  fmcode?: string = '';
  fmname?: string;
  fmimg?: string;
  mapfm?: any = [];
  frm_search: FormGroup;
  start: any = true;
  pcFm: number = 0;
  pcSupcode: number = 0;

  constructor(
    private menuCtrl: MenuController,
    private acsCtrl: ActionSheetController,
    private mdCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public fb: FormBuilder,
    private firebase: FirebaseService,
    private brdsql: BrdsqlService,
  ) {

    let fmcode = localStorage.getItem('fmcode')
    if (fmcode) {
      this.fmcode = fmcode
      // console.log('fmcode:' ,fmcode)
      this.getFmdata({ fmcode: fmcode })
    }

    this.frm_search = fb.group({
      fmcode: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.required]],
    })

  }

  ngOnInit() {
    this.yearID();
  }

  ngAfterViewInit() {

  }

  openUserMenu() {
    this.menuCtrl.enable(true, 'moremenu');
    this.menuCtrl.open('moremenu');
  }

  // ตั้งค่าปีที่ใช้งาน จาก api
  async yearID() {
    await this.brdsql.yearId().subscribe({
      next: (res: any) => {
        let x = JSON.stringify(res.recordset)
        localStorage.setItem('yearID', x)
        this.yearActive = res.recordset.filter((o: any) => o.setActive === 'Y')
        this.yearActive = this.yearActive[0]
        GlobalConstants._yearid = res.recordset
        GlobalConstants.yearCr = this.yearActive.yearCr
        GlobalConstants.yearTh = this.yearActive.yearTh
        GlobalConstants.yearLabel = this.yearActive.yearDesc
        localStorage.setItem('yearActive', JSON.stringify(this.yearActive))
        this.yearCr = GlobalConstants.yearCr
        this.yearTh = GlobalConstants.yearTh
        this.yearDesc = GlobalConstants.yearLabel
        console.log('yearCr: ', this.yearCr)
      }
    })
  }

  loadNewAlldata() {
    this.cpfm = [];
    this.mapfm = [];
    this.fmdata = [];
    this.fmimg = ''
    this.fmname = '';
    this.pcFm = 0;
    this.pcSupcode = 0;
    let fmc = localStorage.getItem('fmcode')
    this.getFmdata({ fmcode: fmc })
  }

  // โหลดข้อมูลชาวไร่จาก api
  subFmdata!: Subscription;
  async getFmdata(f: any) {

    localStorage.setItem('fmcode', f.fmcode)
    this.subFmdata = await this.brdsql.getFmdata(f.fmcode).subscribe({
      next: (res: any) => {
        this.presentLoading('...กำลังโหลดข้อมูล ทั่วไป แปลงอ้อย แผนที่แปลง...')
        // console.log('res:' ,res)
        if (res.recordset.length == 0) {
          this.presentAlert('!!แจ้งเตือน', 'ไม่พบข้อมูลชาวไร่', '..ตรวจสอบเลขโควต้าถูกต้องหรือไม่')
          localStorage.removeItem('fmdata')
          localStorage.removeItem('cpfmdata')
          localStorage.removeItem('mapfm')
          // this.closeLoading();
        } else {
          this.fmdata = res.recordset
          localStorage.setItem('fmdata', JSON.stringify(this.fmdata))
          const fmdt = this.fmdata[0]
          this.fmimg = fmdt.pic_url
          this.fmname = fmdt.fmname.trim()
          this.pcFm = (parseFloat(fmdt.Assess_left_fm) * 100) / parseFloat(fmdt.target_cane)
          this.pcSupcode = (parseFloat(fmdt.Assess_left) * 100) / parseFloat(fmdt.target_cane)
          // this.closeLoading();
          this.getCpFmdata(f.fmcode)
        }
      }, error(err) {
        alert('Error :' + err)
      }, complete() {

      },
    })
    // this.closeLoading()
  }

  // โหลดข้อมูลแปลงอ้อยของชาวไร่จาก api
  subMapFmdata!: Subscription;
  async getCpFmdata(fmcode: string) {

    localStorage.removeItem('cpfmdata')
    this.subMapFmdata = await this.brdsql.getCpFm(this.yearCr, fmcode).subscribe({
      next: (res: any) => {
        this.cpfm = res.recordset
        localStorage.setItem('cpfmdata', JSON.stringify(this.cpfm))
        // this.closeLoading()
      }, error(err) {
        alert('Error :' + err)
      }, complete() {

      },
    })
    // this.closeLoading()
    this.getMapFm(fmcode)
  }

  // แผนที่แปลงอ้อยจาก firebase และข้อมูลแปลงจาก sql ของชาวไร่
  async getMapFm(fmcode: string) {
    localStorage.removeItem('mapfm')
    await this.firebase.getMapByBNMCode(this.yearCr, fmcode)
      .then((res: any) => {
        this.mapfm = res
        localStorage.setItem('mapfm', JSON.stringify(this.mapfm))
        // console.log('firebase res:', this.mapfm)
        // this.closeLoading()  
      })
      .catch((err) => { console.error(err) })
      .finally(() => {
        this.closeLoading()
      })
  }

  async presentLoading(msg: string) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'load',
      message: msg,
      duration: 1000,
    });
    await loading.present();
  }

  async closeLoading() {
    await this.loadingCtrl.dismiss();
  }

  async presentAlert(h: string, s: string, m: string) {
    const alert = await this.alertCtrl.create({
      header: h,
      subHeader: s,
      message: m,
      buttons: ['OK'],
      cssClass: 'my-custom-class',
    });
    await alert.present();
  }

  async presentToast(msg: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      icon: icon,
    });
    toast.present();
  }

  defaultBar: boolean = false;
  searchTerm: string = "";
  hideDefaultBar() {
    this.defaultBar = false;
  }

  showDefaultBar() {
    this.defaultBar = true;
    this.searchTerm = "โควต้า 10 หลัก";
  }

  onSearchChange() {

  }


  ngOnDestroy(): void {
    console.log('tab1 destroy')
    this.subFmdata.unsubscribe;
  }

}
