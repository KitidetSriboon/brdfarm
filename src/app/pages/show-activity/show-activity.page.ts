import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'app-show-activity',
  templateUrl: './show-activity.page.html',
  styleUrls: ['./show-activity.page.scss'],
})
export class ShowActivityPage implements OnInit {

  itid?: any;
  cpdata?: any = [];
  cpActivityData?: any = []
  yearCr?: string = GlobalConstants.yearCr
  yearDesc?: string = GlobalConstants.yeardata.yearDesc

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
  ) { 

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in constructor :', this.itid)

    let cpdata: any = []
    cpdata = GlobalConstants.cpFmdata
    cpdata = cpdata.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cpdata)
    this.cpdata = cpdata[0];

    setTimeout(() => {
      this.getDataActivity()
    }, 1000);

  }

  ngOnInit() {

  }

  getDataActivity() {
    this.brdsql.getActivityData(this.yearCr, this.itid).subscribe({
      next: (res: any) => { 
        this.cpActivityData = res.recordset; 
        console.log('cpActivityData :' ,this.cpActivityData)
      }
    });
  }

}
