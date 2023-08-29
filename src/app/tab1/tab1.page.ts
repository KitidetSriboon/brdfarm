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

// import { FirebaseService } from '../services/firebase.service';
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
  fmdata?: any = [];
  cpfm?: any = [];
  fmcode?: string;
  fmname?: string;
  fmimg?: string;
  mapfm?: any = [];
  frm_search: FormGroup;
  start: any = true;

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

    // this.fmdata = GlobalConstants.fmdata[0] 
    // console.log('fmdata :' ,this.fmdata)

    // this.fmcode = this.fmdata.fmcode_b1 
    // this.fmname = this.fmdata.fmname 
    // this.fmimg = this.fmdata.pic_url

    this.frm_search = fb.group({
      fmcode: this.fmcode,
    })
 
  }

  ngOnInit() {
    // this.getFmdata(this.fmcode);
  }

  ngAfterViewInit() {

  }

  openUserMenu() {
    this.menuCtrl.open('moremenu');
  }

  // โหลดข้อมูลชาวไร่จาก api
  subFmdata!: Subscription;
  async getFmdata(f: any) {

    this.presentLoading('...กำลังโหลดข้อมูลทั่วไปของท่าน')

    // ตรวจสอบ มีข้อมูลชาวไร่ใน localstorage
    let ckfmcode = localStorage.getItem('fmcode')
    if(ckfmcode) {
      let fmcode = JSON.parse(ckfmcode)
      this.fmcode = fmcode
    } else {
      this.fmcode = f.fmcode
      localStorage.setItem('fmcode', f.fmcode)
    }

    this.fmdata = []
    this.subFmdata = await this.brdsql.getFmdata(f.fmcode).subscribe({
      next: (res: any) => {
        this.fmdata = res.recordset[0]
        console.log('fmdata : ' ,this.fmdata)
        this.closeLoading()
      },error(err) {
        alert('Error :' + err)
      },complete() {

      },
    })
    this.closeLoading()
    this.getMapFm(f.fmcode)
  }

  // แผนที่แปลงอ้อยจาก firebase และข้อมูลแปลงจาก sql ของชาวไร่
  async getMapFm(fmcode: string) {
    await this.firebase.getMapByBNMCode(this.yearCr ,fmcode).then({

    })
  }

  async presentLoading(msg: string) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'load',
      message: msg,
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
      cssClass: 'custom-alert',
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

  ngOnDestroy(): void {
    console.log('tab1 destroy')
    this.subFmdata.unsubscribe;
  }

}
