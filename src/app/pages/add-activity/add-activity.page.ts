import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { BrdsqlService } from 'src/app/services/brdsql.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { yearCr, yearTh, yearLabel, GlobalConstants } from 'src/app/global-constants';
import { AlertService } from 'src/app/services/alert.service';
import { IonicSelectableComponent } from 'ionic-selectable';
// import { Observable, Subscription, debounceTime } from 'rxjs';
// import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.page.html',
  styleUrls: ['./add-activity.page.scss'],
})
export class AddActivityPage implements OnInit {

  formType = ""
  itid?: any;
  cpdata?: any = [];
  cpActivitydata?: any = [];
  organicType?: any = [];
  chemicalType?: any = [];
  diseaseData?: any = [];
  insectData?: any = [];
  seedcane?: any = [];
  groupcutfilter?: any = [];
  groupMaintenanceData?: any = [];
  frm_addcpact!: FormGroup;
  frm_editcpact!: FormGroup;
  frm_insert?: boolean
  frm_edit?: boolean
  yearCr = yearCr();
  yearTh = yearTh();
  yearid = ""
  yearLabel = yearLabel();
  perTon?: number = 0;
  ton?: any
  change = true
  canetype = ""
  // ตัวแปรแสดงสีของแต่ละกิจกรรม
  cl_plantdate = "warning"  // สีวันที่ปลูก/ตัด
  cl_groundlevel = "warning"
  cl_hardSoilBlast = "warning"
  cl_hardSoilBlast_code = "warning"
  cl_seedclear = "warning"
  cl_seedcode = "warning"
  cl_groove = "warning"
  cl_dolomite = "warning"
  cl_NaturalFertilizer = "warning"
  cl_FertilizerRound1 = "warning"
  cl_FertilizerRound2 = "warning"
  cl_FertilizerRound3 = "warning"
  cl_fertilizer1Ratio = "warning"
  cl_fertilizer2Ratio = "warning"
  cl_fertilizer3Ratio = "warning"
  cl_disease = "warning"
  cl_insect = "warning"
  cl_pipeup = "warning"
  cl_GerminationPercent = "warning"
  cl_tonfm = "warning"
  cl_groupC = "warning"  // สีกลุ่มตัด
  cl_groupM = "warning"  // สีกลุ่มบำรุง
  //ตัวแปร สำหรับ binding ฟอร์มกับ field database
  plantdate = ""
  // tg_plantdate = false;
  groundlevel = ""
  tg_groundlevel = false; // Default value
  hardSoilBlast = ""
  hardSoilBlast_code = ""
  tg_hardSoilBlast = false; // Default value
  tg_hardSoilBlast_code = false; // Default value
  seedclear = ""
  seedcode = ""
  tg_seedclear = false; // Default value
  groove = 0
  dolomite = 0  // อัตราการใส่โดโลไมท์
  naturalfertilizer = ""
  naturalFertilizerRatio = 0
  fertilizer1Ratio = 0
  fertilizer2Ratio = 0
  fertilizer3Ratio = 0
  fertilizer1Formula = ""
  fertilizer2Formula = ""
  fertilizer3Formula = ""
  showChemical1Formula = false;
  showChemical2Formula = false;
  showChemical3Formula = false;
  tg_pipeup = false; // Default value
  tg_disease = false
  disease = ""
  insect = ""
  pipeup = ""
  germinationpercent = 0
  wastedSpaceRai = 0
  cutseed = 0
  ton_lost = 0
  ton_fm = 0
  groupcuted = ""
  groupMaintenance = ""
  groupC = [];
  groupM = [];
  groupCname = ''
  groupMname = ''
  fminput = {
    "la": 0,
    "cst": 0,
    "lc": 0,
    "arealeft": 0,
    "tonleft": 0,
  }

  groupcutData = [{ groupcode: '', groupname: '', fmname: '' }];
  groupMData = [{ groupcode: '', groupname: '', fmname: '' }];
  public results = [...this.groupcutData];
  public gm_results = [...this.groupMData];
  showGroupCSelect = false;
  showGroupMSelect = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private brdsql: BrdsqlService,
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private alCtrl: AlertController,
    private altSv: AlertService,

  ) {

    console.log('constructor')

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in add-activity :', this.itid)

    let cp_data: any
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    // console.log('cpdata filter :', cp_data)
    this.cpdata = cp_data[0];
    this.perTon = cp_data.ton_last_fm
    this.yearid = this.cpdata.year
    this.canetype = this.cpdata.canetype.substring(2, 1)
    console.log('canetype: ', this.canetype)

    // เชคว่า เคยมีการบันทึกข้อมูลไว้แล้วหรือไม่จาก itid
    this.brdsql.cpActivityFm(this.itid).subscribe({
      next: (res: any) => {
        if (res && res.recordset.length !== 0) {
          this.frm_edit = true
          this.formType = 'edit'
          this.cpActivitydata = res.recordset[0]
          console.log('cpActivityFm ', this.cpActivitydata)

          this.frm_editcpact = fb.group({
            itid: [this.cpActivitydata.itid,],
            yearid: [this.cpActivitydata.year,],  // ปีของแปลงอ้อย
            plantdate: [this.cpActivitydata.plantdate,],  // วันปลูก/ตัด
            groundlevel: [this.cpActivitydata.groundlevel,],  // การปรับระดับพื้นที่
            // hardSoilBlast: [this.cpActivitydata.hardSoilBlast],  // การระเบิดดาน
            hardSoilBlast_code: [this.cpActivitydata.hardSoilBlast_code],  // การระเบิดดาน
            seedcode: [this.cpActivitydata.seedcode],  // รหัสพันธุ์อ้อย
            seedclear: [this.cpActivitydata.seedclear],  // การคัดพันธุ์อ้อย สะอาด
            groove: [this.cpActivitydata.groove,],  // ระยะรอง ซม.
            dolomite: [this.cpActivitydata.dolomite,],  // อัตราการใส่โดโลไมท์
            naturalfertilizer: [this.cpActivitydata.NaturalFertilizer,],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            naturalFertilizerRatio: [this.cpActivitydata.NaturalFertilizerRatio,],  // อัตราปุ๋ยอินทรีย์ที่ใส่
            fertilizer1Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี1
            fertilizer1Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี1
            fertilizer2Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี2
            fertilizer2Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี2
            fertilizer3Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี3
            fertilizer3Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี3
            disease: [this.cpActivitydata.disease,],  // โรคอ้อย
            insect: [this.cpActivitydata.insect,],  // แมลงอ้อย
            pipeup: [this.cpActivitydata.pipeup,],  // การพูนโคน
            germinationpercent: [this.cpActivitydata.GerminationPercent,],  // %การงอก
            ton_fm: [this.cpActivitydata.ton_In_Month, [Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            wastedSpaceRai: [this.cpActivitydata.wastedSpaceRai,],  // พท.สูญเสียของแปลง (ไร่)
            cutseed: [this.cpActivitydata.cutseed,],  // ตันพันธุ์
            ton_lost: [this.cpActivitydata.ton_lost,],  // ตันสูญเสียจากการตัด
            groupcuted: [this.cpActivitydata.groupcuted,],  // รหัสกลุ่มตัด
            groupMaintenance: [this.cpActivitydata.groupMaintenance,],  // รหัสกลุ่มบำรุง
          })

          this.ck_fmacOK(this.cpActivitydata);

        } else {
          this.frm_insert = true;
          this.formType = 'insert'
          let cp_data = this.cpdata
          this.frm_addcpact = fb.group({
            itid: [cp_data.itid, [Validators.required]],
            yearid: [cp_data.year, [Validators.required]],  // ปีของแปลงอ้อย
            plantdate: [''],  // วันปลูก/ตัด
            groundlevel: ['',],  // การปรับระดับพื้นที่
            // hardSoilBlast: [''],  // การระเบิดดาน
            hardSoilBlast_code: ['',],  // การระเบิดดาน 0=ไม่ได้ทำ 1=น้อยกว่า40cm 2=มากกว่า40cm
            seedclear: [''],  // การคัดพันธุ์อ้อย สะอาด
            seedcode: [''],  // รหัสพันธุ์อ้อย
            groove: [0, [Validators.min(0), Validators.max(300)]],  // ระยะรอง ซม.
            dolomite: [0,],  // อัตราการใส่โดโลไมท์
            naturalfertilizer: ['',],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            naturalFertilizerRatio: [0,],  // อัตราปุ๋ยอินทรีย์ที่ใส่
            fertilizer1Ratio: [0,],  // อัตราปุ๋ยเคมี1
            fertilizer2Ratio: [0,],  // อัตราปุ๋ยเคมี2
            fertilizer3Ratio: [0,],  // อัตราปุ๋ยเคมี3
            fertilizer1Formula: ['',],  // สูตรปุ๋ยเคมี1
            fertilizer2Formula: ['',],  // สูตรปุ๋ยเคมี2
            fertilizer3Formula: ['',],  // สูตรปุ๋ยเคมี3
            disease: ['',],  // โรคอ้อย
            insect: ['',],  // แมลงอ้อย
            pipeup: ['',],  // การพูนโคน
            germinationpercent: [0,],  // %การงอก
            ton_fm: [0, [Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            wastedSpaceRai: [0,],  // พท.สูญเสียของแปลง (ไร่)
            cutseed: [0,],  // ตันพันธุ์
            ton_lost: [0,],  // ตันสูญเสียจากการตัด
            groupcuted: ['',],  // กลุ่มตัด
            groupMaintenance: ['',],  // กลุ่มบำรุง
          })
          console.log('form load ', this.frm_addcpact.value)
        }
      }
    })

    this.getGroupCut();
    this.getGroupM();
    this.getOrgaincType()
    this.getChemicalType()
    this.getSeedcode()
    this.getDisease()
    this.getInsect()

  }

  ngOnInit() {

  }

  ionViewWillEnter() {

    // console.log('cpActivitydata in ionViewWillEnter', this.cpActivitydata)
    // this.ck_fmacOK(this.cpActivitydata);

    let x: any = localStorage.getItem('groupcut')
    let m: any = localStorage.getItem('groupmt')
    if (x) {
      x = JSON.parse(x)
      this.groupcuted = x[0].groupcode.toString()
      this.groupCname = x[0].groupname.toString()
      this.results = x
    }
    if (m) {
      m = JSON.parse(m)
      this.groupMaintenance = m[0].groupcode.toString()
      this.groupMname = m[0].groupname.toString()
      this.gm_results = m
    }
  }

  ionViewDidEnter() {
    // console.log('ionViewDidEnter')
    // let x: any = localStorage.getItem('groupcut')
    // if (x) {
    //   x = JSON.parse(x)
    //   console.log('JSON.parse(x)', x)
    //   this.groupcuted = x.groupcode
    //   console.log('groupcuted: ', this.groupcuted)
    // }
    // if (x) { 
    //   this.groupC.groupcode = x.groupcode
    // }
  }

  ionViewWillLeave() {
    // console.log('ionViewWillLeave')
  }

  ionViewDidLeave() {
    // console.log('ionViewDidLeave')
  }

  // ปรับสีกิจกรรมทำแล้ว สีเขียว
  ck_fmacOK(data: any) {
    console.log('ตรวจสอบกิจกรรมแต่ละอย่าง เพื่อกำหนดสี..')
    let x = data
    // console.log('data ', x)
    // อ้อยปลูกใหม่ ต้องก่อน 15 มค.
    if (x.canetype.substring(2, 1) == 'R' && x.plantdate !== null) {
      const date1 = new Date('2024-01-15');    // กำหนด 15 มค.
      const date2 = new Date(x.plantdate);    // วันปลูก
      const year1 = date1.getFullYear();
      const year2 = date2.getFullYear();

      if (year1 > year2) {
        // console.log('ปีปัจจุบัน มากกว่า ปีวันปลูก OK ผ่าน');
        this.cl_plantdate = 'success'
      } else if (year1 < year2) {
        // console.log('ปีปัจจุบัน น้อยกว่า ปีวันปลูก');
      } else {
        // console.log('ปีปัจจุบัน เป็นปีเดียวกับ ปีวันปลูก');
        let x: any = this.compareDateAndMonth(date1, date2)
        // console.log('จำนวนวันจาก 15 มค. และ วันปลูก', x)
        switch (x) {
          case 0:
            // console.log('วันปลูก เท่ากับ 15 มค.')
            this.cl_plantdate = 'success'
            break;
          case 1:
            // console.log('วันปลูก ภายใน 15 มค. OK')
            this.cl_plantdate = 'success'
            break;
          default:
            // console.log('วันปลูก เกิน 15 มค. !!No..')
            this.cl_plantdate = 'warning'
            break;
        }
      }
    }

    // อ้อยตก ต้องมีวันตัด
    this.plantdate = x.plantdate
    if (x.canetype.substring(2, 1) == 'T' && x.plantdate !== null) {
      this.cl_plantdate = 'success'
    }

    // ปรับพื้นที่
    this.groundlevel = x.groundlevel
    if (x.groundlevel == true) {
      this.cl_groundlevel = 'success'
      this.tg_groundlevel = true
    }

    // ระเบิดดาน
    this.hardSoilBlast_code = x.hardSoilBlast_code
    if (x.hardSoilBlast_code == '2') {
      this.cl_hardSoilBlast = 'success'
    }

    // พันธุ์อ้อย
    this.seedcode = x.seedcode.toString()
    if (x.seedcode !== '' || x.seedcode !== null) {
      this.cl_seedcode = 'success'
    }
    this.seedclear = x.seedclear
    if (x.seedclear == true) {
      this.cl_seedclear = 'success'
      this.tg_seedclear = true;
    }

    // ระยะร่อง
    this.groove = x.groove.toString()
    // console.log('groove: ', this.groove)
    if (x.groove >= 160) {
      this.cl_groove = 'success'
    }

    // โดโลไมท์
    this.dolomite = x.dolomite.toString()
    if (x.dolomite >= 50) {
      this.cl_dolomite = 'success'
    }

    // ปุ๋ยอินทรีย์
    this.naturalfertilizer = x.naturalFertilizer.toString()
    this.naturalFertilizerRatio = x.naturalFertilizerRatio.toString()
    if (x.naturalFertilizerRatio >= 500) {
      this.cl_NaturalFertilizer = 'success'
    } else {
      this.cl_NaturalFertilizer = 'warning'
    }

    //ปุ๋ยเคมี
    this.fertilizer1Formula = x.fertilizer1Formula.toString()
    this.fertilizer2Formula = x.fertilizer2Formula.toString()
    this.fertilizer3Formula = x.fertilizer3Formula.toString()
    this.fertilizer1Ratio = x.fertilizer1Ratio.toString()
    this.fertilizer2Ratio = x.fertilizer2Ratio.toString()
    this.fertilizer3Ratio = x.fertilizer3Ratio.toString()

    let chemicalSum: number = Number(x.fertilizer1Ratio) + Number(x.fertilizer2Ratio) + Number(x.fertilizer3Ratio)
    // console.log('chemicalSum ', chemicalSum)

    if (chemicalSum >= 150) {
      this.cl_FertilizerRound1 = 'success'
    }

    // พื้นที่ - พื้นที่เสียหาย x ตัดพันธุ์+ตันสูญเสียจากการตัด = ปริมาณตันประเมิน
    let caneleft: number = ((Number(x.landvalue) - Number(x.wastedSpaceRai)) * Number(x.ton_last_fm)) - (Number(x.ton_lost) + Number(x.cutseed))
    // console.log('caneleft ', parseInt(caneleft.toString()))
    this.ton = parseInt(caneleft.toString())

    // ประเมินอ้อย อ้อยใหม่14 อ้อยตอ 10
    switch (true) {
      case (this.canetype == 'R' && x.ton_last_fm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (this.canetype == 'T' && x.ton_last_fm >= 10):
        this.cl_tonfm = 'success'
        break;
      default:
        this.ton_fm = x.ton_last_fm
        break;
    }

    // โรคอ้อย
    this.disease = x.disease.toString()
    if (x.disease == '0') {
      this.cl_disease = 'success'
    }

    // แมลงอ้อย
    this.insect = x.insect.toString()
    if (x.insect == '0') {
      this.cl_insect = 'success'
    }

    // การพูนโคน
    // if (data.pipeup == true) {
    //   this.pipeup = x.pipeup
    //   this.cl_pipeup = 'success'
    //   this.tg_pipeup = true;
    // } else {
    //   this.pipeup = x.pipeup
    // }

    // เปอร์เซ็นต์การงอก
    // if (data.GerminationPercent >= 90) {
    //   this.germinationpercent = x.GerminationPercent
    //   this.cl_GerminationPercent = 'success'
    // } else {
    //   this.germinationpercent = x.GerminationPercent
    // }

    // กลุ่มตัด
    if (x.groupcuted != null || x.groupcuted != undefined) {
      this.groupcuted = x.groupcuted
      this.cl_groupC = 'success'
    } else {
      this.groupcuted = x.groupcuted
    }

    // กลุ่มบำรุง
    if (x.groupMaintenance != null || x.groupMaintenance != undefined) {
      this.groupMaintenance = x.groupMaintenance
      this.cl_groupM = 'success'
    } else {
      this.groupMaintenance = x.groupMaintenance
    }

  }

  filterGC(event: any) {
    // console.log('user key..', event)
    if (event == null || event == '') {
      this.results = [];
    }
    this.showGroupCSelect = true;
    this.results = this.groupcutData.filter((d) => d.groupname.toLowerCase().indexOf(event) > -1);
    // console.log('group filter :', this.results)
  }

  filterGM(event: any) {
    console.log('user key..', event)
    if (event == null || event == '') {
      this.gm_results = [];
    }
    this.showGroupMSelect = true;
    this.gm_results = this.groupMData.filter((d) => d.groupname.toLowerCase().indexOf(event) > -1);
  }

  // ปุ๋ยอินทรีย์สำหรับ select naturalfertilizer
  async getOrgaincType() {
    // console.log('getOrgaincType')
    let ckdata = localStorage.getItem('organic')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.organicType = ckdata
      // console.log('organicType :', this.organicType)
    } else {
      let x: any;
      await this.brdsql.getOrganicType().subscribe({
        next: (res: any) => {
          if (res) {
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('organic', x)
          }
        }
      })
    }
  }

  // ปุ๋ยเคมี select naturalfertilizer
  async getChemicalType() {
    // console.log('getOrgaincType')
    let ckdata = localStorage.getItem('chemical')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.chemicalType = ckdata
      // console.log('chemicalType', this.chemicalType)
    } else {
      let x: any;
      await this.brdsql.getChemicalType().subscribe({
        next: (res: any) => {
          if (res) {
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('chemical', x)
            this.chemicalType = x
            // console.log('chemicalType', this.chemicalType)
          }
        }
      })
    }
  }

  // พันธุ์อ้อย
  async getSeedcode() {
    // console.log('getOrgaincType')
    let ckdata = localStorage.getItem('seedcode')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.seedcane = ckdata
      // console.log('chemicalType', this.chemicalType)
    } else {
      let x: any;
      await this.brdsql.getSeedcane().subscribe({
        next: (res: any) => {
          if (res) {
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('seedcode', x)
            this.seedcane = x
            // console.log('chemicalType', this.chemicalType)
          }
        }
      })
    }
  }

  //โรค
  async getDisease() {
    let ckdata = localStorage.getItem('disease')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.diseaseData = ckdata
    } else {
      let x: any;
      await this.brdsql.getDisease().subscribe({
        next: (res: any) => {
          if (res) {
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('disease', x)
            this.diseaseData = x
          }
        }
      })
    }
  }

  // แมลง
  async getInsect() {
    let ckdata = localStorage.getItem('insect')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.insectData = ckdata
    } else {
      let x: any;
      await this.brdsql.getInsect().subscribe({
        next: (res: any) => {
          if (res) {
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('insect', x)
            this.insectData = x
          }
        }
      })
    }
  }

  // กลุ่มตัดหรับ select groupcut
  async getGroupCut() {
    let ckdata: any
    ckdata = localStorage.getItem('groupC')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.groupcutData = ckdata
      // console.log('groupcutData :', this.groupcutData)
    } else {
      let x: any;
      await this.brdsql.getGroupCut().subscribe({
        next: (res: any) => {
          if (res) {
            this.groupcutData = res.recordset
            // console.log('groupcut from api :', this.groupcutData)
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('groupC', x)
          }
        }
      })
    }
  }

  // กลุ่มบำรุง สำหรับ select groupmaintanance
  async getGroupM() {
    let ckdata: any
    ckdata = localStorage.getItem('groupM')
    if (ckdata) {
      ckdata = JSON.parse(ckdata)
      this.groupMData = ckdata
      // console.log('groupcutData :', this.groupcutData)
    } else {
      let x: any;
      await this.brdsql.getGroupM().subscribe({
        next: (res: any) => {
          if (res) {
            this.groupMData = res.recordset
            // console.log('groupcut from api :', this.groupcutData)
            x = res.recordset
            x = JSON.stringify(x)
            localStorage.setItem('groupM', x)
          }
        }
      })
    }
  }

  // การปรับพื้นที่แปลง
  ck_groundlevel(e: any) {
    let x = e.detail.checked
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_groundlevel = "success"
        this.tg_groundlevel = true
        this.groundlevel = "true"
        break;
      case false:
        this.cl_groundlevel = "warning"
        this.tg_groundlevel = false
        this.groundlevel = "false"
        break;
      default:
        this.cl_groundlevel = "warning"
        this.tg_groundlevel = false
        this.groundlevel = ""
        break;
    }
  }

  // การระเบิดดาน
  ck_hardSoilBlast(e: any) {
    // let x = e.detail.checked
    let x = e.detail.value
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case '2':
        this.cl_hardSoilBlast = "success"
        this.hardSoilBlast = "2"
        break;
      case '1':
        this.cl_hardSoilBlast = "warning"
        this.hardSoilBlast = "1"
        break;
      case '0':
        this.cl_hardSoilBlast = "warning"
        this.hardSoilBlast = "0"
        break;
      default:
        this.cl_hardSoilBlast = "warning"
        this.hardSoilBlast = ''
        break;
    }
  }

  // การคัดพันธุ์อ้อย
  ck_seedclear(e: any) {
    let x = e.detail.checked
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_seedclear = "success"
        this.seedclear = "true"
        break;
      case false:
        this.cl_seedclear = "warning"
        this.seedclear = "false"
        break;
      default:
        this.cl_seedclear = "warning"
        this.seedclear = ""
        break;
    }
  }

  // ระยะร่อง 160 ขึ้นไป
  ck_groove(e: any) {
    let x: number = e.detail.value
    // console.log('groove ', x);
    switch (true) {
      case (x >= 160):
        this.cl_groove = "success"
        break;
      default:
        this.cl_groove = "warning"
        break;
    }
  }

  // ใส่โดโลไมท์
  ck_dolomite(e: any) {
    let x: number = e.detail.value
    switch (true) {
      case (x > 0):
        this.cl_dolomite = "success"
        break;
      default:
        this.cl_dolomite = "warning"
        break;
    }
  }

  // ตรวจสอบอัตราปุ๋ยอินทรีย์ที่ใส่ ที่คีย์ไม่เกิน 5000 กก/ไร่
  // showNaturalFertRatio = false;
  ckNaturalFertOver(e: any) {
    console.log('e.target.value ', e.target.value);
    if (e.target.value > 5000) {
      this.altSv.swalAlertAnimate('แจ้งเตือน', 'อัตราปุ๋ยอินทรีย์ กำหนดไม่เกิน 5,000 กก./ไร่ในการใส่แต่ละครั้ง กรุณาตรวจสอบ', 'warning')
      this.naturalFertilizerRatio = 0;
    }
  }

  // ตรวจสอบอัตราเคมี1 ที่คีย์ไม่เกิน 200 กก/ไร่
  showFertRatio = false;
  ckFertRationOver(e: any) {
    console.log('e.target.value ', e.target.value);
    if (e.target.value > 200) {
      this.altSv.swalAlertAnimate('แจ้งเตือน', 'อัตราปุ๋ยเคมี กำหนดไม่เกิน 200 กก./ไร่ในการใส่แต่ละครั้ง กรุณาตรวจสอบ', 'warning')
      return 0;
    }
    return e.target.value
  }

  // ตรวจสอบอัตราเคมี1 ที่คีย์ไม่เกิน 200 กก/ไร่
  showFert1Ratio = false;
  ckFertRation1Over(e: any) {
    console.log('e.target.value ', e.target.value);
    if (e.target.value > 200) {
      this.altSv.swalAlertAnimate('แจ้งเตือน', 'อัตราปุ๋ยเคมี กำหนดไม่เกิน 200 กก./ไร่ในการใส่แต่ละครั้ง กรุณาตรวจสอบ', 'warning')
      this.fertilizer1Ratio = 0
    }
  }

  ck_NaturalFertilizerSelect(e: any) {
    let x: any = e.detail.value
    switch (true) {
      case (x !== 0):
        console.log('user seleccted', x)
        this.showFertRatio = true;
        this.cl_NaturalFertilizer = "success"
        break;
      case '' || null:
        console.log('case null', x)
        this.showFertRatio = false;
        this.cl_NaturalFertilizer = "warning"
        break;
      case (x == 0):
        console.log('case 0', x)
        this.showFertRatio = false;
        this.cl_NaturalFertilizer = "warning"
        break;
      default:
        console.log('default', x)
        this.showFertRatio = false;
        this.cl_NaturalFertilizer = "warning"
        break;
    }
  }

  ck_NaturalFertilizer(e: any) {
    let x: number = e.detail.value
    console.log('อัตราการใส่ปุ๋ยอินทรีย์', x)
    switch (true) {
      case (x > 0 && x < 500):
        console.log('case >0 < 500', x)
        this.cl_NaturalFertilizer = "warning"
        break;
      case (x >= 500):
        console.log('case >=500', x)
        this.cl_NaturalFertilizer = "success"
        break;
      case '' || null:
        console.log('case null', x)
        this.cl_NaturalFertilizer = "warning"
        break;
      default:
        console.log('default', x)
        this.cl_NaturalFertilizer = "warning"
        break;
    }
  }

  // ck seedcode
  ck_seedcode(e: any) {
    let x: any = e.detail.value
    console.log('รหัสพันธุ์', x)
    switch (true) {
      case (x !== null || x !== ''):
        console.log('มีการเลือก', x)
        this.showFertRatio = true;
        this.cl_NaturalFertilizer = "warning"
        break;
      default:
        console.log('ว่าง หรือ null', x)
        this.showFertRatio = false;
        this.cl_NaturalFertilizer = "warning"
        break;
    }
  }

  // อัตราการใส่ปุ๋ยเคมี1 
  ck_chemical1(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    // console.log('อัตรการใส่ปุ๋ยเคมี', x)
    switch (true) {
      case (x >= 50):
        this.cl_fertilizer1Ratio = "success"
        this.showChemical1Formula = true;
        break;
      case (x > 0):
        this.showChemical1Formula = true;
        break;
      default:
        this.cl_fertilizer1Ratio = "warning"
        break;
    }
  }

  // ปุ๋ยเคมี รอบ 1 2 3 รวมกันได้ 150 OK
  ck_chemical(e: any) {
    let y: number = Number(this.fertilizer1Ratio) + Number(this.fertilizer2Ratio) + Number(this.fertilizer3Ratio)
    console.log('chemical ratio is:', y)
    if (y >= 150) {
      this.cl_FertilizerRound1 = "success"
    }
  }

  // สูตร ปุ๋ยเคมี1 ที่ใส่ ต้อง =>50 กก.
  ck_chemical1Formula(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    let y: any = Number(this.fertilizer1Ratio) + Number(this.fertilizer2Ratio) + Number(this.fertilizer3Ratio)
    console.log('chemical ratio is:', y)
    if (y >= 150) {
      this.cl_FertilizerRound1 = "success"
    } else {
      this.cl_FertilizerRound1 = "warning"
    }
    switch (true) {
      case (x >= 50):
        // this.cl_FertilizerRound1 = "success"
        this.showChemical1Formula = true;
        break;
      case (x > 0 && x < 50):
        // this.cl_FertilizerRound1 = "warning"
        this.showChemical1Formula = true;
        break;
      case '' || null:
        // this.cl_FertilizerRound1 = "warning"
        break;
      default:
        this.cl_FertilizerRound1 = "warning"
        break;
    }
  }

  // สูตร ปุ๋ยเคมี2 ที่ใส่ ต้อง =>50 กก.
  ck_chemical2Formula(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    let y: number = this.fertilizer1Ratio + this.fertilizer2Ratio + this.fertilizer3Ratio
    console.log('chemical ratio is:', y)
    if (y >= 150) {
      this.cl_FertilizerRound1 = "success"
    } else {
      this.cl_FertilizerRound1 = "warning"
    }
    switch (true) {
      case (x >= 50):
        this.cl_FertilizerRound2 = "success"
        this.showChemical2Formula = true;
        break;
      case (x > 0 && x < 50):
        this.showChemical2Formula = true;
        break;
      case '' || null:
        this.cl_FertilizerRound2 = "warning"
        break;
      default:
        this.cl_FertilizerRound2 = "warning"
        break;
    }
  }

  // สูตร ปุ๋ยเคมี3 ที่ใส่ ต้อง =>50 กก.
  ck_chemical3Formula(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    let y: number = this.fertilizer1Ratio + this.fertilizer2Ratio + this.fertilizer3Ratio
    console.log('chemical ratio is:', y)
    if (y >= 150) {
      this.cl_FertilizerRound1 = "success"
    } else {
      this.cl_FertilizerRound1 = "warning"
    }
    switch (true) {
      case (x >= 50):
        this.cl_FertilizerRound3 = "success"
        this.showChemical3Formula = true;
        break;
      case (x > 0 && x < 50):
        this.showChemical3Formula = true;
        break;
      case '' || null:
        this.cl_FertilizerRound3 = "warning"
        break;
      default:
        this.cl_FertilizerRound3 = "warning"
        break;
    }
  }

  // ck_ โรคอ้อย
  ck_disease(e: any) {
    let x: any = e.detail.value
    console.log('ck_disease value ', x)
    switch (true) {
      case (x == 0):
        console.log('ไม่มีโรค', x)
        this.cl_disease = "success"
        break;
      case (x == null || x == ''):
        console.log('null ว่าง', x)
        this.cl_disease = "warning"
        break;
      default:
        console.log('อื่นๆ', x)
        this.cl_disease = "warning"
        break;
    }
  }

  // ck_ แมลงอ้อย
  ck_insect(e: any) {
    let x: any = e.detail.value
    switch (true) {
      case (x == 0):
        console.log('ไม่มีแมลง', x)
        this.cl_insect = "success"
        break;
      case (x == null || x == ''):
        console.log('null ว่าง', x)
        this.cl_insect = "warning"
        break;
      default:
        console.log('อื่นๆ ', x)
        this.cl_insect = "warning"
        break;
    }
  }

  // การพูนโคน
  ck_pipeup(e: any) {
    let x = e.detail.checked
    switch (x) {
      case true:
        this.cl_pipeup = "success"
        this.pipeup = "true"
        break;
      case false:
        this.cl_pipeup = "warning"
        this.pipeup = "false"
        break;
      default:
        this.cl_pipeup = "warning"
        this.pipeup = ""
        break;
    }
  }

  // %การงอก ควรมากกว่า 90
  ck_GerminationPercent(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    console.log('ck_GerminationPercent', x)
    switch (true) {
      case (x >= 90):
        this.cl_GerminationPercent = "success"
        this.germinationpercent = x
        break;
      // case (x):
      //   this.cl_GerminationPercent = "warning"
      //   this.pipeup = "false"
      //   break;
      default:
        this.cl_GerminationPercent = "warning"
        break;
    }
  }

  // ตรวจสอบการคีย์กลุ่มตัด
  ck_GroupC(e: any) {
    let x = e.detail.value
    // console.log('ck_GroupC', x)
    switch (x) {
      case (x = !null || x != undefined):
        this.cl_groupC = "success"
        this.groupcuted = x
        break;
      default:
        this.cl_groupC = "warning"
        break;
    }
  }

  setGroupC(e: any) {
    let g: any = e.detail.value
    let y: any = localStorage.getItem('groupC')
    if (y) {
      y = JSON.parse(y)
      y = y.filter((o: any) => o.groupcode === g)
      // console.log('group filter: ', y)
      localStorage.setItem('groupcut', JSON.stringify(y))
    }
  }

  getAutoGroupC() {
    this.showGroupCSelect = true
    let x: any = localStorage.getItem('groupcut')

    if (x) {
      x = JSON.parse(x)
      this.results = x
      // console.log('group old: ', x)
      this.groupcuted = x[0].groupcode
      this.groupCname = x[0].groupname
      // console.log('groupcode: ', this.groupcuted)
    }
  }

  setGroupM(e: any) {
    let g: any = e.detail.value
    let y: any = localStorage.getItem('groupM')
    if (y) {
      y = JSON.parse(y)
      y = y.filter((o: any) => o.groupcode === g)
      // console.log('group filter: ', y)
      localStorage.setItem('groupmt', JSON.stringify(y))
    }
  }

  getAutoGroupM() {
    this.showGroupMSelect = true
    let x: any = localStorage.getItem('groupmt')

    if (x) {
      x = JSON.parse(x)
      this.gm_results = x
      // console.log('group old: ', x)
      this.groupMaintenance = x[0].groupcode
      this.groupMname = x[0].groupname
      // console.log('groupcode: ', this.groupcuted)
    }
  }

  // ตรวจสอบการคีย์กลุ่มบำรุง
  ck_GroupM(e: any) {
    let x = e.detail.value
    // console.log('ck_GroupM', x)
    switch (x) {
      case (x = !null || x != undefined):
        this.cl_groupM = "success"
        this.groupMaintenance = x
        break;
      default:
        this.cl_groupM = "warning"
        break;
    }
  }

  // คำนวณปริมาณตัน
  async newTon(event: any, f: any) {
    // let _wastedSpaceRai: number | any;
    // let _Cutseed: number | any;
    // let _ton_lost: number | any;
    // if (f.wastedSpaceRai == null || f.wastedSpaceRai == undefined) { _wastedSpaceRai = 0 }
    // if (f.Cutseed == null || f.Cutseed == undefined) { _Cutseed = 0 }
    // if (f.ton_lost == null || f.ton_lost == undefined) { _ton_lost = 0 }
    this.perTon = event.target.value;
    console.log('ประเมิน', this.perTon)
    this.fminput.la = parseFloat(f.wastedSpaceRai)
    this.fminput.cst = parseFloat(f.cutseed)
    this.fminput.lc = parseFloat(f.ton_lost)
    let toned: number = 0;
    let arealeft: number = 0;
    // พื้นที่ - พื้นที่เสียหาย x ตัดพันธุ์+ตันสูญเสียจากการตัด = ปริมาณตันประเมิน
    arealeft = (this.cpdata.landvalue - this.fminput.la)
    this.fminput.arealeft = arealeft
    toned = (event.target.value * arealeft)  // ตันประเมิน คูณ พท.คงเหลือ
    toned = (toned - (this.fminput.cst + this.fminput.lc));
    this.ton = toned.toFixed(2);
    this.fminput.tonleft = toned
    await Haptics.impact({ style: ImpactStyle.Light });
    this.ck_ton(this.perTon,)
  }

  // ประเมินอ้อย ควรจะมากกว่า อ้อยใหม่ 14 อ้อยตอ 10 
  ck_ton(tonfm: any) {
    tonfm = parseInt(tonfm)
    // console.log('ประเมิน ', tonfm)
    let ctype = ""
    if (this.frm_edit == true) {
      ctype = this.cpActivitydata.canetype.trim()
      // console.log('ctype cpActivitydata', ctype)
    } else {
      ctype = this.cpdata.canetype.trim()
      // console.log('ctype cpdata', ctype)
    }
    ctype = ctype.substring(2, 1)
    switch (true) {
      case (ctype == 'R' && tonfm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (ctype == 'T' && tonfm >= 10):
        this.cl_tonfm = 'success'
        break;
      default:
        this.cl_tonfm = 'warning'
        break;
    }
  }

  // กลุ่มตัด
  ckGroupcuted(e: any) {
    console.log('e.target.value ', e.target.value);
    // if (e.target.value > 200) {
    //   this.altSv.swalAlertAnimate('แจ้งเตือน', 'อัตราปุ๋ยเคมี กำหนดไม่เกิน 200 กก./ไร่ในการใส่แต่ละครั้ง กรุณาตรวจสอบ', 'warning')
    //   this.fertilizer1Ratio = 0
    // }
  }

  // กลุ่มบำรุง
  ckGroupMaintenance(e: any) {
    console.log('e.target.value ', e.target.value);
    // if (e.target.value > 200) {
    //   this.altSv.swalAlertAnimate('แจ้งเตือน', 'อัตราปุ๋ยเคมี กำหนดไม่เกิน 200 กก./ไร่ในการใส่แต่ละครั้ง กรุณาตรวจสอบ', 'warning')
    //   this.fertilizer1Ratio = 0
    // }
  }

  // test
  async test(f: any) {
    console.log('form:', f)
  }

  // บันทึกข้อมูลกิจกรรมแปลง
  async submit(f: any) {

    console.log('form :', f)

    const alert = await this.alCtrl.create({
      cssClass: 'my-custom-class',
      header: `ยืนยันการบันทึก`,
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          id: 'cancel-button',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'บันทึก',
          cssClass: 'alert-button-confirm',
          id: 'confirm-button',
          handler: async () => {
            this.saveData(f)
            // console.log('you click SAVE...')
          }
        }
      ]
    });
    await alert.present();
  }

  async saveData(f: any) {
    // console.log('form to brdservice :', f)

    // updat firebase database
    // this.firebase.updateFmAS(this.yearCr, this.itid, f)
    //   .then(res => { })
    //   .finally(() => { })
    //   .catch(e => {
    //     console.log('error ', e)
    //   })

    // update sql server
    await this.brdsql.updateFmActivity(f, this.formType).subscribe({
      next: (res: any) => {
        console.log('res :', res)
        if (res.code === 'EREQUEST') {
          this.presentAlert('!!ผิดพลาด...', '', 'ข้อมูลไม่ถูกบันทึก กรุณาลองอีกครั้ง')
        } else {
          this.presentAlert('(^-^)...สำเร็จ', '', '...บันทึกข้อมูลของท่านแล้ว ขอขอบพระคุณอย่างสูง')
          // this.navCtrl.back();
        }
      }, error(err) { }
      , complete() {

      },
    })
  }

  // ตัวเลือกกลุ่มตัด
  selectGroupcut(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.groupcuted = '';
    const arr = event.value;
    this.groupcuted = arr.groupcode;
  }

  isFormValid(): boolean {
    return this.frm_addcpact.valid;
  }

  closeCurrentPage() {
    this.navCtrl.back();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async presentAlert(h: string, s: string, m: string) {
    const alert = await this.alCtrl.create({
      header: h,
      subHeader: s,
      message: m,
      buttons: ['OK'],
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  // Function to compare only the date and month of two dates
  compareDateAndMonth(date1: any, date2: any) {
    // Extract month and date components
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Compare month and date components
    if (month1 === month2 && day1 === day2) {
      return 0; // Dates are equal
    } else if (month1 < month2 || (month1 === month2 && day1 < day2)) {
      return -1; // date1 is earlier than date2
    } else {
      return 1; // date1 is later than date2
    }

    // const comparisonResult = this.compareDateAndMonth(date1, date2);

    // if (comparisonResult === 0) {
    //   console.log("Dates are equal in month and date.");
    // } else if (comparisonResult < 0) {
    //   console.log("Date 1 is earlier than Date 2.");
    // } else {
    //   console.log("Date 1 is later than Date 2.");
    // }

  }


}
