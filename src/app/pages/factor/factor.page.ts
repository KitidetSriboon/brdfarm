import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-factor',
  templateUrl: './factor.page.html',
  styleUrls: ['./factor.page.scss'],
})
export class FactorPage implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
    private fb: FormBuilder,

  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in finance :', this.itid);

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

    console.log('thItid:', this.thItid)


    setTimeout(() => {
      this.getData_factor_itid(cp_data0.year_th, cp_data0.itid);
      this.cpdata = cp_data0
      this.cpActivityData = cp_data
    }, 200);

  }
  thItid = {
    itid: '', intlandno: '', fmcode: '', credit_amount: 0, credit_used: 0, credit_left: 0, year_th: '', supcode: '', money_amt: 0,
    type_s: 0
  };
  isfactor = { get1: '', amt1: 0, get2: '', amt2: 0, get3: '', amt3: 0, get4: '', amt4: 0, get5: '', amt5: 0 };
  isLoading = false;

  ngOnInit() {
    this.getstock_data();
  }

  selectedItem = '';
  selectedValue = {};
  selected_num = 0;
  setnumOf = 0;

  onSelectChange() {
    let dataS: any = this.selectedValue;
    let thItid = this.thItid;
    let s_num = this.selected_num;
    this.setnumOf = Object.keys(dataS).length
    console.log('Selected:', dataS);
    if (this.setnumOf > 0 || s_num > 0) {
      this.isfactor = { get1: '', amt1: 0, get2: '', amt2: 0, get3: '', amt3: 0, get4: '', amt4: 0, get5: '', amt5: 0 };
      this.thItid.money_amt = (((dataS.amt_in + dataS.amt_out) / 2) * s_num);
      if (this.setnumOf > 0 && s_num > 0) {
        if (thItid.type_s == 1) {
          this.isfactor.get1 = dataS.stock_id;
          this.isfactor.amt1 = s_num;
        }
        else if (thItid.type_s == 2) {
          this.isfactor.get2 = dataS.stock_id;
          this.isfactor.amt2 = s_num;
        }
        else if (thItid.type_s == 3) {
          this.isfactor.get3 = dataS.stock_id;
          this.isfactor.amt3 = s_num;
        }
        else if (thItid.type_s == 4) {
          this.isfactor.get4 = dataS.stock_id;
          this.isfactor.amt4 = s_num;
        }
        else if (thItid.type_s == 5) {
          this.isfactor.get5 = dataS.stock_id;
          this.isfactor.amt5 = s_num;
        }
      }
    }
  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

  filteredItems: any = [];
  searchTerm: string = '';

  filterList(e: any) {
    let keyword: number = e.target.value;
    let data = this.stock_d.s;
    this.thItid.type_s = keyword;
    if (data.length > 0) {
      if (keyword > 0) {
        this.filteredItems = data.filter((el: any) => el.group_type == keyword)
        this.selectedValue = {};
        console.log('keyword :', keyword,);
      }
    }
  }

  filterItems(e: any) {
    let keyword = e.target.value;
    if (this.stock_d.s.length > 0) {
      if (!keyword) {
        this.filteredItems = this.stock_d.s;
      }
      else {
        this.filteredItems = this.stock_d.s.filter((el: any) => (el.stock_id.toLowerCase().indexOf(keyword) > -1 || el.description.toLowerCase().indexOf(keyword) > -1));
      }
    }
    console.log('keyword :', keyword)
  }

  stock_d: any = { s0: 0 };
  getstock_data() {
    this.isLoading = true;
    this.brdsql.getstock_data().subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        let data = res
        //console.log('stock_d :', data)
        if (data.length > 0) {
          this.stock_d.s0 = data.length;
          this.stock_d.s = data.filter((el: any) => el.group_type != '5');
        }
        console.log('stock_d :', this.stock_d)
      }
    });
  }

  sumdata = { cemecal: 0, oganic: 0, fertilizer: 0, lomite: 0, machin: 0 };
  data_factor: any = []
  getData_factor_itid(year: string, itid: string) {
    this.isLoading = true;
    this.brdsql.getData_factor_itid(year, itid).subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        let data = res
        if (data.length > 0) {
          this.data_factor = data;
          this.sumdata.cemecal = (data.map((el: any) => { return el.amt1 })).reduce((a: any, b: any) => a + b, 0);
          this.sumdata.oganic = (data.map((el: any) => { return el.amt2 })).reduce((a: any, b: any) => a + b, 0);
          this.sumdata.fertilizer = (data.map((el: any) => { return el.amt3 })).reduce((a: any, b: any) => a + b, 0);
          this.sumdata.lomite = (data.map((el: any) => { return el.amt4 })).reduce((a: any, b: any) => a + b, 0);
          this.sumdata.machin = (data.map((el: any) => { return el.amt5 })).reduce((a: any, b: any) => a + b, 0);
        }
      }
    });
  }

  saveApplyFn() {
    let f = this.thItid;
    let j = this.isfactor;

    if (confirm(`ต้องการบันทึกขอเบิก ราคา ${f.money_amt.toLocaleString()} บาท ใช่หรือไม่`)) {
      this.isLoading = true;
      // this.removeCommas(f.money_amt);
      this.brdsql.add_factor_factor(f, j).subscribe((res: any) => {
        this.isLoading = false;
        //console.log('res :', res)
        if (res.code == 'EREQUEST') {
          alert('!!ผิดพลาด...' + 'ข้อมูลไม่ถูกบันทึก กรุณาลองอีกครั้ง')
        } else {
          alert('(^-^)...สำเร็จ' + '...บันทึกข้อมูลของท่านแล้ว')
          // this.navCtrl.back();
          this.getData_factor_itid(f.year_th, f.itid);
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
          title: 'คำขอเบิกปัจจัยของท่าน!',
          text: '...ถูกส่งให้นักส่งเสริมแล้ว ขอขอบคุณ',
          icon: 'success',
        })
        //this.frm_getfn.reset();
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

}
