import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {

  itid?: any;
  intlandno?: string;
  fmcode?: string;
  supcode?: string;
  year_th?: string;
  cpdata?: any = [];

  cpActivityData?: any = []
  yearCr?: string = GlobalConstants.yearCr
  yearTh?: string = GlobalConstants.yearTh
  yearDesc?: string = GlobalConstants.yeardata.yearDesc
  moneyamt!: number;  // จำนวนเงินที่ขอ
  fnAmount!: number // วงเงินได้รับ
  fnUsed?: number // วงเงินใช้ไป
  fnLeft?: number // วงเงินคงเหลือ
  frm_getfn: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
    private fb: FormBuilder,

  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in finance :', this.itid)

    this.frm_getfn = this.fb.group({
      supcode: ['', [Validators.required]],
      itid: ['', [Validators.required]],
      intlandno: ['', [Validators.required]],
      fmcode: ['', [Validators.required]],
      yearid: ['', [Validators.required]],
      money_amt: ['0', [Validators.required]],
      // type_money: ['', [Validators.required]],
      comment1: ['', [Validators.required]],
    })
    let cp_data: any = []
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid == this.itid)

    let cp_data0 = cp_data[0]
    console.log('cpdata filter :', cp_data)

    this.thItid.itid = cp_data0.itid
    this.thItid.intlandno = cp_data0.intlandno
    this.thItid.fmcode = cp_data0.fmcode
    this.thItid.credit_amount = cp_data0.credit_amount
    this.thItid.year_th = cp_data0.year_th
    this.thItid.supcode = cp_data0.supcode
    this.thItid.fm_doc = ''

    console.log('thItid:', this.thItid)

    setTimeout(() => {
      this.getData_money_itid(cp_data0.year_th, cp_data0.itid);
      this.cpdata = cp_data0
      this.cpActivityData = cp_data
      /*console.log('cpdata :', this.cpdata)
      // console.log('cpActivityData :', this.cpActivityData)
      this.itid = cp_data0.itid
      this.intlandno = cp_data0.intlandno
      this.fmcode = cp_data0.fmcode
      this.fnAmount = cp_data0.credit_amount
      this.year_th = cp_data0.year_th
      this.supcode = cp_data0.supcode
      console.log('วงเงินได้รับ', this.fnAmount)
      // this.getDataActivity()*/
    }, 500);

  }
  thItid = {
    itid: '', intlandno: '', fmcode: '', credit_amount: 0, credit_used: 0, credit_left: 0, year_th: '', supcode: '', fm_doc: '', money_amt: 0,
  }
  isLoading = false;

  ngOnInit() {
  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

  getData_money_itid(year: string, itid: string) {
    this.isLoading = true;
    this.brdsql.getData_money_itid(year, itid).subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        let data = res[0]
        if (res.length > 0) {
          this.thItid.credit_used = data.credit_amount - data.sum_money_amt;
          this.thItid.credit_left = data.sum_money_amt;
        }
        //this.cpActivityData = data;
        //this.yearDesc = data.year
        // console.log('groundlevel ', this.cpActivityData.groundlevel)
        //console.log('getData_money_itid :', data)
      }
    });
  }

  checkOver(e: any) {
    // console.log('e.target.value: ', e.target.value)
    let y = this.thItid.credit_left
    let x = e.target.value//.replace(',', '');
    //this.thItid.money_amt = (x);
    if (x > y) {
      this.swal1('error', 'คุณป้อนจำนวนเงินที่ขอ เกินกว่าวงเงินคงเหลือ..')
      this.thItid.money_amt = y;
    }
    // console.log('x:', x, ', y:', y);
  }

  saveApplyFn() {
    let f = this.thItid;
    if (confirm(`ต้องการขอเงิน จำนวน ${f.money_amt.toLocaleString()} บาท ใช่หรือไม่`)) {
      this.isLoading = true;
      // this.removeCommas(f.money_amt);
      this.brdsql.add_factor_money(f).subscribe((res: any) => {
        this.isLoading = false;
        //console.log('res :', res)
        if (res.code == 'EREQUEST') {
          alert('!!ผิดพลาด...' + 'ข้อมูลไม่ถูกบันทึก กรุณาลองอีกครั้ง')
        } else {
          alert('(^-^)...สำเร็จ' + '...บันทึกข้อมูลของท่านแล้ว')
          // this.navCtrl.back();
        }
      })
      //console.log('thItid.money_amt: ', f)
      //Swal.fire("อยู่ระหว่างพัฒนา!..เร็วๆ นี้ ครับ");
      // this.swalSave(f, 'warning', 'ขอเกี้ยว', 'คุณต้องการยืนยันการส่งคำขอสินเชื่อ หรือไม่ (อยู่ระหว่างพัฒนา...)');
    }
  }

  swalSave(f: any, i: any, ti: string, tx: string) {
    Swal.fire({
      heightAuto: false,
      title: ti,
      text: tx,
      icon: i,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลงOK!'
    }).then((result) => {
      if (result.isConfirmed) {
        // save to database
        console.log('user OK')
        Swal.fire({
          heightAuto: false,
          title: 'คำขอสินเชื่อของท่าน!',
          text: '...ถูกส่งให้นักส่งเสริมแล้ว ขอขอบคุณ',
          icon: 'success',
        })
        this.frm_getfn.reset();
      }
    })
  }

  swal1(i: any, t: string) {
    Swal.fire({
      heightAuto: false,  // ถ้าไม่ใส่ จะมีปัญหา swall จะถูกทับ
      // position: 'top-end',
      icon: i,
      // title: t,
      text: t,
      // imageUrl: 'assets/brdthanks.png',
      imageWidth: 150,
      imageHeight: 150,
      // timer: 2000,
    })
  }

  /* Test */
  /*CommaFormatted(event: any) {
    console.log('CommaFormatted')
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    if (this.moneyamt) {
      this.moneyamt = this.moneyamt.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
*/
  addComma(event: any) {
    let input = event.target.value;
    let numberWithCommas = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    event.target.value = numberWithCommas;
  }



  /*removeCommas(): Observable<number> {
    console.log('removeCommas')
    console.log('moneyamt', this.moneyamt)
    return this.moneyamt = this.moneyamt.replace(',', '');
  }*/

}
