import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Chart, ChartOptions, registerables } from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
// Chart.register(LineController, LineElement, PointElement, LinearScale, Title)

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
import { Router } from '@angular/router';
import { Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public chartOptions!: Partial<ChartOptions>;
  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  @ViewChild('canehistoryCanvas') private canehistoryCanvas!: ElementRef;
  barChart: any;
  doughnutChart: any;
  lineChart: any;
  canehistoryChart: any

  overallP: any = true;
  activityP: any = false;
  factorP: any = false;
  yearCr?: string = GlobalConstants.yearCr
  yearTh?: string = GlobalConstants.yearTh
  yearDesc?: string = GlobalConstants.yearLabel
  appName?: string = GlobalConstants.appname
  appVersion?: string = GlobalConstants.appversion
  appUpdate?: string = GlobalConstants.lastupdate
  versionDetail = GlobalConstants.versionDesc
  yearActive?: any = [];
  yearData?: any = [];
  fmdata?: any = [];
  cpfm?: any = [];
  sumcpFm?: any = [];
  crFm?: any = [];
  fndata?: any = [];
  cpcSummaryFm?: any = []
  cantypeSummaryFm?: any = []
  cpcDetailFm?: any = []
  cpcDiaryFm?: any = []
  fmcode = "";
  fmname?: string;
  fmimg?: string;
  mapfm?: any = [];
  // frm_search: FormGroup;
  start: any = true;
  pcFm: number = 0;
  pcSupcode: number = 0;
  targetCane: number = 0;
  assessCane: number = 0;

  typeChart: any;
  dataChart: any;
  optionsChart: any;
  chartData?: any = []

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
    private authService: AuthenticationService,
    private router: Router
  ) {

    let fm: any = localStorage.getItem('fmuser')
    if (fm) {
      fm = JSON.parse(fm)
      this.fmcode = fm.fmcode_b1
      this.getFmdata({ fmcode: this.fmcode })
    }

    // this.frm_search = fb.group({
    //   fmcode: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.required]],
    // })

    Chart.register(...registerables);

  }

  ngOnInit() {
    this.setyearActive();
    this.yearID();
  }

  ngAfterViewInit() {
    this.showChart()
    // setTimeout(() => {
    // this.barChartMethod();
    // this.doughnutChartMethod();
    // this.lineChartMethod();
    // }, 1000);
  }

  openUserMenu() {
    this.menuCtrl.enable(true, 'moremenu');
    this.menuCtrl.open('moremenu');
  }

  // เชคว่า แอพถูกตั้งค่าปีการผลิตไว้อย่างไร ปีไหน
  async setyearActive() {
    await this.brdsql.yearActive().subscribe({
      next: (res: any) => {
        // console.log('res yearactive', res)
        this.yearActive = res.recordset[0]
        // เก็บค่าปีที่ active ไว้ที่ตัวแปร
        GlobalConstants.yearCr = this.yearActive.yearCr
        GlobalConstants.yearTh = this.yearActive.yearTh
        GlobalConstants.yearLabel = this.yearActive.yearDesc
        localStorage.setItem('yearActive', JSON.stringify(this.yearActive))
        this.yearCr = GlobalConstants.yearCr
        this.yearTh = GlobalConstants.yearTh
        this.yearDesc = GlobalConstants.yearLabel
      }
    })
  }

  // ตั้งค่าปีที่ใช้งาน จาก api from table yearid
  async yearID() {
    await this.brdsql.yearId().subscribe({
      next: (res: any) => {
        this.yearData = res.recordset
        let x = JSON.stringify(res.recordset)
        localStorage.setItem('yearID', x)
        // เก็บค่าปีที่ active ไว้ที่ตัวแปร
        GlobalConstants._yearid = res.recordset
      }
    })
  }

  selectyear(e: any) {
    // console.log('select event', e.target.value)
    let x: any = localStorage.getItem('yearID')
    if (x) {
      x = JSON.parse(x)
      x = x.filter((o: any) => o.yearCr == e.target.value)
      // console.log('year filter', x)
      GlobalConstants.yearCr = x[0].yearCr
      GlobalConstants.yearTh = x[0].yearTh
      GlobalConstants.yearLabel = x[0].yearDesc
      this.yearCr = x[0].yearCr
      this.yearTh = x[0].yearTh
      this.yearDesc = x[0].yearDesc
      if (this.fmcode) {
        let fm = this.fmcode
        this.loadNewAlldata(e)
      }
    }
  }

  loadNewAlldata(e: any) {
    setTimeout(() => {
      this.cpfm = [];
      this.mapfm = [];
      this.fmdata = [];
      this.cpcSummaryFm = []
      this.cpcDetailFm = []
      this.cpcDiaryFm = []
      this.fmimg = ''
      this.fmname = '';
      this.pcFm = 0;
      this.pcSupcode = 0;
      // let fmc = localStorage.getItem('fmcode')
      this.getFmdata({ fmcode: this.fmcode })
      // Any calls to load data go here
      e.target.complete();
    }, 2000);
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
          this.targetCane = fmdt.target_cane
          // console.log('yearTh ', this.yearTh)
          this.assessCane = fmdt['AS' + this.yearTh]
          this.pcFm = (parseFloat(fmdt.Assess_left_fm) * 100) / parseFloat(fmdt.target_cane)
          this.pcSupcode = (parseFloat(fmdt['AS' + this.yearTh]) * 100) / parseFloat(fmdt.target_cane)
          // console.log('assessCane is ', this.assessCane)
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
    // console.log('getCpFmdata')

    localStorage.removeItem('cpfmdata')
    this.subMapFmdata = await this.brdsql.getCpFm(this.yearCr, fmcode).subscribe({
      next: (res: any) => {
        // console.log('getCpFm res ', res)
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
    // console.log('getMapFm')
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
        this.canetypeSummaryfm(fmcode)
      })
  }

  // สรุปประเภทอ้อยโดนัท chart
  subcanetypeSummary!: Subscription;
  async canetypeSummaryfm(fmcode: string) {
    localStorage.removeItem('canetypesummary')
    this.subcanetypeSummary = await this.brdsql.canetypeSummaryFm(fmcode, this.yearTh).subscribe({
      next: (res: any) => {
        this.cantypeSummaryFm = res.recordset[0]
        // console.log('canetypesummary res ', this.cantypeSummaryFm)
        localStorage.setItem('canetypesummary', JSON.stringify(this.cantypeSummaryFm))
        setTimeout(() => {
          this.showChart();
        }, 1000);
        this.getCpcSummary(fmcode)
      }, error(err) {

      }, complete() {

      },
    })
  }

  // โหลดข้อมูล สรุปอ้อยเข้าหีบ ของชาวไร่จาก api
  subCPCSummary!: Subscription;
  async getCpcSummary(fmcode: string) {
    localStorage.removeItem('cpcSummaryFm')
    this.subCPCSummary = await this.brdsql.getCpcSummary(fmcode).subscribe({
      next: (res: any) => {
        // console.log('getCpcSummary res ', res)
        this.cpcSummaryFm = res.recordset[0]
        localStorage.setItem('cpcSummaryFm', JSON.stringify(this.cpcSummaryFm))
        // this.closeLoading()
      }, error(err) {
        alert('Error :' + err)
      }, complete() {

      },
    })
    this.getFinance()
  }

  // ข้อมูลด้านสินเชื่อ
  async getFinance() {
    await this.brdsql.getFinanceFm(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('getFinance res:', res)
        this.fndata = res.recordset[0]
      }
      , error(err) {
        alert('Error :' + err)
      }, complete() {
        // console.log('getFinance complete')
      },
    })
    this.getSumcpFm()
  }

  // ข้อมูล สรุปพื้นที่ปลูกอ้อยแยกประเภท วงเงิน แปลงเช่า แปลงเสียหาย ประเมินอ้อย 
  async getSumcpFm() {
    await this.brdsql.getSumcpFm(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('getSumcpFm res:', res)
        this.sumcpFm = res.recordset[0]
      }
      , error(err) {
        alert('Error :' + err)
      }, complete() {
        // console.log('getSumcpFm complete')
      },
    })
    this.getCrFm();
  }

  // ข้อมูลวงเงินหลักทรัพย์ เช็ค การใช้ เบิกเงิน กับเบิกปัจจัย
  async getCrFm() {
    await this.brdsql.getCrFm(this.yearTh, this.fmcode).subscribe({
      next: (res: any) => {
        // console.log('getCreditFm res:', res)
        this.crFm = res.recordset[0]
      }
      , error(err) {
        alert('Error :' + err)
      }, complete() {
        // console.log('getCrFm complete')
      },
    })
    this.getcpcDiaryFm()
  }

  // ข้อมูลสรุปอ้อยเข้า ซีซีเอส แต่ละวันของชาวไร่
  async getcpcDiaryFm() {
    this.cpcDiaryFm = []
    await this.brdsql.cpcDiaryFm(this.fmcode).subscribe({
      next: (res: any) => {
        this.cpcDiaryFm = res.recordset
        // console.log('cpcDiaryFm ', this.cpcDiaryFm)
        localStorage.setItem('cpcdiaryfm', JSON.stringify(this.cpcDiaryFm))
      }, complete() {
      }, error(err) {
      },
    })
    this.closeLoading()
  }

  async showChart() {
    this.doughnutChartMethod();
    this.barChartMethod()
  }

  async barChartMethod() {
    // console.log('barChartMethod')
    let datachart: any
    datachart = localStorage.getItem('fmdata')
    if (datachart) {
      datachart = JSON.parse(datachart);
      datachart = datachart[0]
      // console.log('chart data :', datachart)
      // console.log('area6364 :', datachart.area6364)
    }
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = await new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['63/64', '64/65', '65/66', '66/67', '67/68'],
        datasets: [{
          label: 'พื้นที่ปลูก(ไร่)',
          data: [datachart.area6364, datachart.area6465, datachart.area6566, datachart.area6667, datachart.area6768,],
          yAxisID: "id2",
          order: 2,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1
        },
        {
          type: 'line',
          label: 'ผลผลิต',
          yAxisID: "id1",
          order: 1,
          data: [
            // Math.floor(((datachart.pccane95 * 100) / datachart.cnt)),
            // Math.floor(((datachart.hardsoilblast * 100) / datachart.cnt)),
            // Math.floor(((datachart.dolomite * 100) / datachart.cnt)),
            // Math.floor(((datachart.organic * 100) / datachart.cnt)),
            // Math.floor(((datachart.fertilizer1 * 100) / datachart.cnt)),
            // Math.floor(((datachart.fertilizer2 * 100) / datachart.cnt)),
            datachart.yield6364, datachart.yield6465, datachart.yield6566, datachart.yield6667, datachart.yield6768,
          ],
          fill: false,
          borderColor: '#FF9C07',
          // tension: 0.05, // เส้นแบบตรง แบบไม่โค้งมน
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
        },]
      },
      options: {
        scales: {
          id1: {
            type: 'linear',
            position: 'right',
            beginAtZero: false,
            min: 10,
            max: 20,
            grid: {
              display: false,
            }
          },
          id2: {
            type: 'linear',
            position: 'left',
            grid: {
              display: false,
            }
          }
        }
      },
    });
  }

  async doughnutChartMethod() {
    let data = this.cantypeSummaryFm;
    // console.log('chart data ', data)
    // console.log('ER', data.sumer)
    this.doughnutChart = await new Chart(this.doughnutCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['ปลายฝน', 'ตอ', 'ต้นฝน', 'เสียหาย'],
        // labels: data.map(row => row.period_no),
        datasets: [{
          label: '# พท.(ไร่)',
          data: [data.sumer, data.sumst, data.sumsr, data.sumcl],
          backgroundColor: [
            'rgba(51, 153, 235, 0.5)',
            'rgba(255, 178, 102, 0.5)',
            'rgba(153, 255, 153, 0.5)',
            'rgba(192, 192, 192, 0.5)',
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
          ]
        }]
      }
    });
  }

  async lineChartMethod() {
    this.lineChart = await new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'Sell per week',
            fill: false,
            // lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            spanGaps: false,
          }
        ]
      }
    });
  }

  // chart ประวัติการปลูกอ้อย 
  async chart_canehistory() {

    let datachart: any = []
    datachart = localStorage.getItem('fmdata')
    if (datachart) {
      datachart = JSON.parse(datachart);
      // console.log('chart data :', datachart)
    }
    // let target = sum / 2;
    let pcplot = 0
    let chartTitle = 'ประวัติการทำอ้อย'
    let cntplotnow = 0;
    this.typeChart = 'bar';
    let sum: number = 0;
    // this.chartData.forEach(item => {
    //   if (item.caneageid !== "5") {
    //     sum += item.cnt
    //   }
    // });
    // this.plotTarget = sum;  // เป้าหมายแปลง

    pcplot = 0
    // pcplot = ((datachart.cnt * 100) / target).toFixed(1)
    // chartTitle = `${chartTitle} จำนวน ${datachart.cnt} ไร่ [${pcplot}%]`

    this.dataChart = {
      labels: ['ปี63/64', 'ปี64/65', 'ปี65/66', 'ปี66/67', 'ปี67/68'],
      datasets: [
        {
          type: 'line',
          //steppedLine: true,
          label: "เป้าหมาย",
          data: [100, 100, 100, 100, 100],
          fill: false,
          borderColor: '#00ADF9',
          // tension: 0.5,
          yAxisID: "id1",
          order: 1,
          datalabels: {
            color: '#00ADF9',
            acchor: 'end',
            align: 'top',
            offset: 10
          }

        },
        {
          label: "ผลงาน",
          data: [datachart.area6364
            , datachart.area6465
            , datachart.area6566
            , datachart.area6667
            , datachart.area6768],
          yAxisID: "id1",
          backgroundColor: [
            'rgba(255, 200, 186, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(144, 252, 173 ,0.5)',
            'rgba(255, 228, 181 ,0.5)',
            'rgba(250, 182, 231 ,0.5)',
          ],
          order: 0,
          datalabels: {
            color: '#FF0000',
            acchor: 'start',
            align: 'start',
            offset: 5
          },
        },
        {
          type: 'line',
          label: '%ผลงาน',
          yAxisID: "id2",
          data: [
            // Math.floor(((datachart.pccane95 * 100) / datachart.cnt)),
            // Math.floor(((datachart.hardsoilblast * 100) / datachart.cnt)),
            // Math.floor(((datachart.dolomite * 100) / datachart.cnt)),
            // Math.floor(((datachart.organic * 100) / datachart.cnt)),
            // Math.floor(((datachart.fertilizer1 * 100) / datachart.cnt)),
            // Math.floor(((datachart.fertilizer2 * 100) / datachart.cnt)),
            100, 100, 100, 100
          ],
          fill: false,
          borderColor: '#FF9C07',
          // tension: 0.05, // เส้นแบบตรง แบบไม่โค้งมน
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
        },
      ],
    };

    this.optionsChart = {
      responsive: true,
      plugin: [ChartDataLabels],
      plugins: {
        datalabels: {
          fontSize: 12,
          anchor: 'end',
          align: 'end',
          formatter: function (value: any, context: any) {
            return value.toLocaleString()
          }
        },
      },
      //maintainAspectRatio: true,
      title: {
        display: true,
        text: chartTitle,
        fontSize: 18
      },
      scales: {
        xAxes: [{
          //stacked: true,
          ticks: {
            fontSize: 14
          },
        }],
        yAxes: [{
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
            beginAtZero: false,
          },
          ticks: {
            fontSize: 14,
            beginAtZero: true,
            // min: Math.min(0),
            // max: Math.max(100),
            // stepSize: 100000,
            callback: function (value: any) {
              var ranges = [
                // { divider: 1e3, suffix: 'M' },
                { divider: 1e3, suffix: 'K' }
              ];
              function formatNumber(n: any) {
                for (var i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                  }
                }
                return n;
              }
              return /*'$' +*/ formatNumber(value);
            }
          },
          id: "id1" // incorrect property name.
        }, {
          ticks: {
            fontSize: 14,
            beginAtZero: true,
            min: Math.min(0),
            max: Math.max(100),
          },
          scaleLabel: {
            display: true,
            //  labelString: 'Commissions',
            beginAtZero: true,
          },
          display: true, // Hopefully don't have to explain this one.
          position: "right",
          gridLines: {
            display: false
          },
          //yAxisID: "id2"
          id: "id2" // incorrect property name.
        }
        ],
      }
    };
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

  async logout() {
    await this.authService.logout(),
      this.router.navigateByUrl('/', { replaceUrl: true })
  }

  ngOnDestroy(): void {
    console.log('tab1 destroy')
    this.subFmdata.unsubscribe;
  }

}
