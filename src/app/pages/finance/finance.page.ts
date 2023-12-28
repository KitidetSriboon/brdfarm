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
  moneyamt?: any;  // จำนวนเงินที่ขอ
  fnAmount?: number // วงเงินได้รับ
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
    cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cp_data)

    setTimeout(() => {
      this.cpdata = cp_data[0];
      this.cpActivityData = cp_data
      console.log('cpdata :', this.cpdata)
      // console.log('cpActivityData :', this.cpActivityData)
      this.itid = this.cpdata.itid
      this.intlandno = this.cpdata.intlandno
      this.fmcode = this.cpdata.fmcode
      this.fnAmount = this.cpdata.credit_amount
      this.year_th = this.cpdata.year_th
      this.supcode = this.cpdata.supcode
      console.log('วงเงินได้รับ', this.fnAmount)
      // this.getDataActivity()
    }, 1000);

  }

  ngOnInit() {
  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

  setMoney() {
    this.moneyamt = this.fnAmount
  }

  checkOver(e: any) {
    console.log('checkOver value: ', e.target.value)
    let x: number = this.moneyamt.replace(',', '');
    if (x > this.fnAmount!) {
      this.swal1('error', 'คุณป้อนจำนวนเงินที่ขอ เกินกว่าวงเงินคงเหลือ..')
      this.moneyamt = this.fnAmount;
    }
  }

  saveApplyFn(f: any) {
    // this.removeCommas(f.money_amt);
    console.log('form: ', f)
    Swal.fire("อยู่ระหว่างพัฒนา!..เร็วๆ นี้ ครับ");
    // this.swalSave(f, 'warning', 'ขอเกี้ยว', 'คุณต้องการยืนยันการส่งคำขอสินเชื่อ หรือไม่ (อยู่ระหว่างพัฒนา...)');
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
  CommaFormatted(event: any) {
    console.log('CommaFormatted')
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    if (this.moneyamt) {
      this.moneyamt = this.moneyamt.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  numberCheck(args: any) {
    console.log('numberCheck')
    if (args.key === 'e' || args.key === '+' || args.key === '-') {
      return false;
    } else {
      return true;
    }
  }

  removeCommas(): Observable<number> {
    console.log('removeCommas')
    console.log('moneyamt', this.moneyamt)
    return this.moneyamt = this.moneyamt.replace(',', '');
  }

}
