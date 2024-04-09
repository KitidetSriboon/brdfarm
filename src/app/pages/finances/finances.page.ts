import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
// import Swal from 'sweetalert2'
import { AlertService } from 'src/app/services/alert.service';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { NetworkService } from 'src/app/services/network.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalConstants, yearCr, yearTh, yearLabel } from 'src/app/global-constants';
import { filter } from 'rxjs/operators';
import axios from 'axios';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.page.html',
  styleUrls: ['./finances.page.scss'],
})
export class FinancesPage implements OnInit {

  fmcode?: string;
  year_th?: string;
  yearCr?: string;
  yearTh?: string;
  yearDesc?: string;
  yearData?: any = [];
  fnData?: any = [];
  factorData?: any = [];
  sumcpFm?: any = [];
  crFm?: any = [];
  guarantor?: any = [];
  loanFm?: any = [];
  listloanFm?: any = [];
  loanThisyear = 0;
  yearThX: any;
  LoanDatailData: { [key: string]: any[] } = {};
  LoanDatailKeys: string[] = [];
  listLoanNow: any;
  listLoanyear: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private ldingCtrl: LoadingService,
    private alertSv: AlertService,
    public networkSv: NetworkService,
  ) {

    this.networkSv.initializeApp();

    this.yearCr = yearCr();
    this.yearTh = yearTh();
    this.yearDesc = yearLabel();

    let x: any = localStorage.getItem('yearID')
    if (x) {
      x = JSON.parse(x)
      this.yearData = x
    }
    let fm: any = localStorage.getItem('fmcode')
    if (fm) {
      this.fmcode = fm
    }
  }

  ngOnInit() {
    this.getSumcpFm()
  }

  // ข้อมูล สรุปพื้นที่ปลูกอ้อยแยกประเภท วงเงิน แปลงเช่า แปลงเสียหาย ประเมินอ้อย 
  async getSumcpFm() {
    this.ldingCtrl.presentLoading('กำลังโหลดข้อมูลต่างๆ... ');
    // console.log('สรุปพื้นที่ปลูก')
    await this.brdsql.getSumcpFm(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('getSumcpFm res:', res)
        this.sumcpFm = res.recordset[0]
      }
      , error: (err) => {
        alert('Error :' + err)
      }, complete: () => {
        // console.log('getSumcpFm complete')
      },
    })
    this.getCrFm();
  }

  // ข้อมูลวงเงินหลักทรัพย์ เช็ค การใช้ เบิกเงิน กับเบิกปัจจัย
  async getCrFm() {
    // console.log('วงเงินหลักทรัพย์')
    await this.brdsql.getCrFm(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('getCreditFm res:', res)
        this.crFm = res.recordset[0]
      }
      , error: (err) => {
        this.alertSv.swalAlertAnimate('!ผิดพลาด', 'พบข้อผิดพลาด ' + err, 'error')
      }, complete: () => {
        // this.getLoanNow()
      },
    })

    await this.brdsql.getGuarantor(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        this.guarantor = res.recordset[0]
        // console.log('guarantor res:', this.guarantor)
      }
      , error: (err) => {
        this.alertSv.swalAlertAnimate('!ผิดพลาด', 'พบข้อผิดพลาด ' + err, 'error')
      }, complete: () => {
        this.getLoanNow()
      },
    })
  }

  // ข้อมูลหนี้จาก dbo.v_loanFarmer
  async getLoanNow() {
    // console.log('หนี้')
    await this.brdsql.getLoannow(this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('res fmloan: ', res)
        if (res) {
          this.loanFm = res.recordset[0]
          this.loanThisyear = this.loanFm.Loanleft6768
          this.yearThX = this.yearTh?.substring(0, 2)
        }
      }, error: (err) => {

      }
      , complete: () => {
        this.LoanDatailNow();
      },
    })
  }

  // รายละเอียดหนี้แต่ละปี
  async LoanDatailNow() {
    let data = [];
    let fmcode = this.fmcode
    await axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbbrr/VW_DOCLIST2_fmcode_w?cardcode=" + fmcode)
      .then(res => {
        let data = res.data;
        // console.log('load res:', data)
        if (data.length > 0) {
          this.listLoanNow = data;
          let groupedData: any = {};
          //this.listLoanyear = data.filter(el => el.year == this.yearTh.substring(0, 2));
          data.forEach((entry: { year: any; }) => {
            const year = entry.year;
            if (!groupedData[year]) {
              groupedData[year] = [];
            }
            groupedData[year].push(entry);
          });

          //this.data_group = groupedData;
          this.LoanDatailData = groupedData;
          this.LoanDatailKeys = Object.keys(groupedData);
          // console.log('LoanDatailData: ', this.LoanDatailData);
          // console.log('LoanDatailKeys: ', this.LoanDatailKeys);
          // console.log('listLoanyear: ',this.yearTh.substring(0, 2), this.listLoanyear);
        }
        else this.listLoanNow = [];
      }).catch(err => { throw (err); })
      .finally(() => {
        // console.log('loading data finally..')
        this.getLoanNowDetail();
      })

  }

  // รายละเอียดหนี้
  async getLoanNowDetail() {
    let data: any = [];
    let year = this.yearTh?.substring(0, 2)
    // console.log('รายละเอียดหนี้')
    await this.brdsql.getFnNowDetail(this.fmcode).subscribe({
      next: (res: any) => {
        data = res
        data = data.filter((o: any) => o.year === year)
        data.sort((a: any, b: any) => a.docdate - b.docdate); // b - a for reverse sort
        this.listloanFm = data
        // console.log('listloanFm : ', data)
      }, complete: () => {
        this.ldingCtrl.closeLoading();
      }, error: (err) => {
        this.alertSv.swalAlertAnimate('!ผิดพลาด', 'เกิดความผิดพลาด' + err, 'warning')
      },
    })
    // this.ldingCtrl.closeLoading();
  }

  async selectyear(e: any) {
    this.ldingCtrl.presentLoading('กำลังโหลดข้อมูล รายการเบิกเกี้ยว/ปัจจัย..')
    // console.log('select event', e.target.value)
    this.yearTh = e.target.value
    this.yearThX = this.yearTh?.substring(0, 2)
    await this.brdsql.getFnFarmer(this.fmcode, this.yearTh).subscribe({
      next: (res: any) => {
        if (res.code === "EREQUEST") {
          this.alertSv.swalAlertAnimate('ไม่พบข้อมูล', 'รายการขอสินเชื่อในปีที่เลือก', 'warning')
        }
        // console.log('res: ', res)
        this.fnData = res.recordset
      }, error: (err) => {

      }, complete: () => {
        // console.log('load รายการเบิกเกี้ยว finished')
      },
    })

    await this.brdsql.getFactor(this.fmcode, this.yearTh).subscribe({
      next: (res: any) => {
        if (res.code === "EREQUEST") {
          this.alertSv.swalAlertAnimate('ไม่พบข้อมูล', 'หรือเกิดความผิดพลาดในการเรียกข้อมูล รายการเบิกปัจจัยการผลิตในปีที่เลือก', 'warning')
        }
        // console.log('res getfactor : ', res)
        this.factorData = res.recordset
        this.ldingCtrl.closeLoading();
      }, error: (err) => {
      }, complete: () => {
        // console.log('load รายการเบิกเกี้ยว finished')
      },
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.brdsql.getFnFarmer(this.fmcode, this.yearTh).subscribe({
        next: (res: any) => {
          // console.log('res: ', res)
          this.fnData = res.recordset
          event.target.complete();
        }, error: (err) => {

        }, complete: () => {

        },
      })
    }, 2000);
  }

  setnY(key: any): string {
    if (!key) { return '' }
    return `${key}/${Number(key) + 1}`;
  }

  calculateTotal(entries: any[]): number {
    if (!entries) { return 0 }
    return entries.reduce((total, entry) => total + entry.balance, 0);
  }

}
