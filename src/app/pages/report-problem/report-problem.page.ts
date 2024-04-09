import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { GlobalConstants } from 'src/app/global-constants';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.page.html',
  styleUrls: ['./report-problem.page.scss'],
})
export class ReportProblemPage implements OnInit {

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
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdsql: BrdsqlService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
    private fb: FormBuilder,
    private altSv: AlertService,
  ) {

    this.itid = this.route.snapshot.paramMap.get('itid');
    // console.log('itid in report problem :', this.itid);

    let cp_data: any = []
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid == this.itid)

    // console.log('cpdata filter :', cp_data)
    this.cpdata = cp_data[0]

  }

  ngOnInit() {
  }

}
