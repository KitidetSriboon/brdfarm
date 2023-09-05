import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalConstants } from '../global-constants';
import { BrdsqlService } from './brdsql.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AppdataService {

  fmdata?: any = [];
  cpfm?: any = [];
  mapfm?: any = [];
  subfmdata!: Subscription;
  subcpfm!: Subscription;
  yearCr?: string = GlobalConstants.yearCr;

  constructor(
    private firebase: FirebaseService,
    private brdsql: BrdsqlService,
  ) { }

  // service นี้เพื่อบริการข้อมูลต่างๆ แล้วเก็บไว้ที่ localstorage เพื่อไปใช้งานในแอพ

  // ข้อมูลชาวไร่จาก sql server v_farmer_basic
  async getFmdata(fmcode: string) {
    localStorage.removeItem('fmdata')
    this.fmdata = []
    this.subfmdata = await this.brdsql.getFmdata(fmcode).subscribe({
      next: (res: any) => {
        console.log('v_farmer_basic res:',res)
        if(res.recordset.length == 0) {
          localStorage.removeItem('fmdata')
        } else {
          this.fmdata = res.recordset
          localStorage.setItem('fmdata' ,JSON.stringify(this.fmdata))
        }
      }, error(err) { alert('Error :' + err)
      }, complete() {},
    })
  }

  // ข้อมูลกิจกรรมแปลงชาวไร่จาก sql server v_cp_data
  async getCpFmdata(fmcode: string) {
    localStorage.removeItem('cpfmdata')
    this.cpfm = [];
    this.subcpfm = await this.brdsql.getCpFm(this.yearCr, fmcode).subscribe({
      next: (res: any) => {
        console.log('v_cp_data res:',res)
        if(res.recordset.length == 0) {
          localStorage.removeItem('cpfmdata')
        } else {
          this.cpfm = res.recordset
          console.log('cpfm to localstorage:',this.cpfm)
          localStorage.setItem('cpfmdata' ,JSON.stringify(this.cpfm))
        }
      }, error(err) {
        alert('Error :' + err)
      }, complete() {

      },
    })
  }

  // แผนที่แปลงอ้อยจาก firebase และข้อมูลแปลงจาก sql ของชาวไร่
  async getMapFm(fmcode: string) {
    localStorage.removeItem('mapfm')
    this.mapfm = []
    await this.firebase.getMapByBNMCode(this.yearCr, fmcode)
      .then((res: any) => {
        console.log('firebase res:',res)
        this.mapfm = res
        localStorage.setItem('mapfm' ,JSON.stringify(this.mapfm)) 
      })
      .catch((err) => { console.error(err) })
      .finally(() => {})
  }

  ngOnDestroy(): void {
    console.log('appdata service destroy')
    this.subfmdata.unsubscribe;
    this.subcpfm.unsubscribe;
  }

}
