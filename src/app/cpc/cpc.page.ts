import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { BrdsqlService } from '../services/brdsql.service';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { ExcelService } from '../services/excel.service';

import { Chart, ChartOptions, registerables } from 'chart.js';

// import { ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
// Chart.register(LineController, LineElement, PointElement, LinearScale, Title)

@Component({
  selector: 'app-cpc',
  templateUrl: './cpc.page.html',
  styleUrls: ['./cpc.page.scss'],
})
export class CpcPage implements OnInit {

  public chartOptions!: Partial<ChartOptions>;
  @ViewChild('datecpc', { static: true }) datecpc!: ElementRef;
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  // @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  @ViewChild('lineCanvas_ccs') private lineCanvas_ccs!: ElementRef;
  @ViewChild('lineCanvas_ccsbrr') private lineCanvas_ccsbrr!: ElementRef;
  barChart: any;
  doughnutChart: any;
  lineChart: any;
  lineChart_ccs: any;
  lineChart_ccsbrr: any;

  yearDesc?: string = GlobalConstants.yearLabel
  cpcSummaryFm?: any = []
  cpcDiaryFm?: any = []
  cpcDetail?: any = []
  ccsbrr?: any = []
  subcpcDetail!: Subscription;
  cpcpc?: any = []
  subcpcpc!: Subscription;
  fmcode = ''
  progress = 0.8

  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";

  constructor(
    private brdsql: BrdsqlService,
    private excelsv: ExcelService,
  ) { Chart.register(...registerables); }

  async ionViewWillEnter(e: any) {
    console.log('ionViewWillEnter');

    setTimeout(() => {
      // Any calls to load data go here
      let fm = localStorage.getItem('fmcode')
      if (fm) {
        this.fmcode = fm
      }
      // ข้อมูลสรุป อ้อยเข้าหีบ ประเมิน คงเหลือ ผลผลิต ชาวไร่
      let data: any = localStorage.getItem('cpcSummaryFm')
      if (data) {
        data = JSON.parse(data)
        this.cpcSummaryFm = data
      }
      // ข้อมูลกราฟอ้อยเข้า/ซีซีเอส สรุปประจำวัน ชาวไร่
      let data2: any = localStorage.getItem('cpcdiaryfm')
      if (data2) {
        data2 = JSON.parse(data2)
        this.cpcDiaryFm = data2
        setTimeout(() => {
          this.lineChartMethod()
          this.lineChartCcs()
        }, 500);
      }
      // ccs brr diary
      this.brdsql.ccsBrr().subscribe({
        next: (res: any) => {
          // console.log('res ccs ', res)
          this.ccsbrr = res.recordset
        }, error(err) {

        }, complete() {

        },
      })
      setTimeout(() => {
        this.lineChartCcsBrr()
      }, 500)

      this.subcpcDetail = this.brdsql.getCpcDetail(this.fmcode).subscribe({
        next: (res: any) => {
          // console.log('getCpcDetail res ', res)
          this.cpcDetail = res.recordset
        }, error(err) {
          alert('Error :' + err)
        }, complete() { },
      })

      let datafm: any = localStorage.getItem('cpfmdata')
      if (datafm) {
        datafm = JSON.parse(datafm)
        // console.log('cpfmdata ', data)
        this.cpcpc = datafm.sort((a: any, b: any) => b.yieldEnd - a.yieldEnd)
      }
      e.target.complete();
    }, 2000);

  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    // setTimeout(() => {
    //   this.lineChartMethod();
    //   this.lineChartCcs();
    //   this.lineChartCcsBrr();
    // }, 500);

    // this.datecpc.nativeElement.innerHTML = "จะเปิดหีบในอีก...";
  }

  async barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = await new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
        datasets: [{
          label: '# of Votes',
          data: [200, 50, 30, 15, 20, 34],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // แบบแท่งแนวนอน
        // scales: {
        // yAxes: [{
        //   ticks: {
        //     beginAtZero: true
        //   }
        // }]
        // }
      }
    });

    // this.barChart.destroy();

  }

  async doughnutChartMethod() {
    this.doughnutChart = await new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
        datasets: [{
          label: '# of Votes',
          data: [50, 29, 15, 10, 7],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      }
    });

    // this.doughnutChart.destroy();
  }

  async lineChartMethod() {
    let data = this.cpcDiaryFm
    this.lineChart = await new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((row: { reportdate_th: any; }) => row.reportdate_th),
        datasets: [
          {
            label: 'อ้อยเข้า(ตัน)',
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
            // pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            // pointRadius: 1,
            pointHitRadius: 10,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 15,
            data: data.map((row: { wgt_net: any }) => row.wgt_net),
            spanGaps: false,
            tension: 0.4,
          },
        ],
      }
    });
    // this.lineChart.destroy();
  }

  async lineChartCcs() {
    let data = this.cpcDiaryFm
    this.lineChart_ccs = await new Chart(this.lineCanvas_ccs.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((row: { reportdate_th: any; }) => row.reportdate_th),
        datasets: [
          {
            label: 'ซีซีเอส',
            fill: false,
            // lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(252, 121, 52, 0.5)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            // pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(252, 121, 52, 1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            // pointRadius: 1,
            pointHitRadius: 10,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 15,
            data: data.map((row: { ccs_value: any }) => row.ccs_value),
            spanGaps: false,
            tension: 0.4,
          },
        ],
      }
    });

    // this.lineChart_ccs.destroy()
  }

  async lineChartCcsBrr() {
    this.lineChart_ccs = null
    let data = this.ccsbrr
    this.lineChart_ccsbrr = await new Chart(this.lineCanvas_ccsbrr.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((row: { reportdate_th: any; }) => row.reportdate_th),
        datasets: [
          {
            label: 'ซีซีเอส BRR',
            fill: false,
            // lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(25, 122, 252, 0.8)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            // pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(25, 122, 252, 1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            // pointRadius: 1,
            pointHitRadius: 5,
            pointStyle: 'star',
            pointRadius: 1,
            pointHoverRadius: 10,
            data: data.map((row: { ccs_value: any }) => row.ccs_value),
            spanGaps: false,
            tension: 0.4,
          },
        ],
      }
    });

    // this.lineChart_ccsbrr.destroy();
  }

  ngOnInit() {
    // console.log('ngOnInit', this.datecpc);
  }

  exportToExcelJson() {
    this.excelsv.exportToExcelJson(this.cpcDetail, this.fmcode + '-รายการอ้อยเข้าหีบ');
  }

  async exportToExcelTable(tb: string): Promise<void> {
    let element: any
    let filename: string = '_.xlsx'
    switch (tb) {
      case 'tb1':
        element = document.getElementById('tb_cpcdetail')
        filename = '-รายการอ้อยเข้าหีบ.xlsx'
        break;
      case 'tb2':
        element = document.getElementById('tb_cpcpc')
        filename = '-รายการแปลงอ้อยเข้าหีบ.xlsx'
        break;
      default:
        element = null
        break;
    }
    /* pass here the table id */
    // let element = document.getElementById('tb_cpcpc');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fmcode + filename);

  }

  cpcCountdown() {

    // Set the date we're counting down to
    let countDownDate = new Date("Dec 1, 2023 00:00:00").getTime();

    // Update the count down every 1 second
    let x = setInterval(() => {

      // Get todays date and time
      let now = new Date().getTime();

      // Find the distance between now an the count down date
      let distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in an element with id="demo"
      this.datecpc.nativeElement.innerHTML = days + "วัน " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.datecpc.nativeElement.innerHTML = "EXPIRED";
      }
    }, 1000);

    // console.log(this.datecpc);
    // this.datecpc.nativeElement.innerHTML = "I am changed by ElementRef & ViewChild";
  }

  ngOnDestroy(): void {
    console.log('cpc destroy')
  }


}
