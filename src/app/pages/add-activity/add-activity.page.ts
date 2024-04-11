import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { BrdsqlService } from 'src/app/services/brdsql.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GlobalConstants } from 'src/app/global-constants';
import { yearCr, yearTh, yearLabel } from 'src/app/global-constants';
import { AlertService } from 'src/app/services/alert.service';

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
  // ตัวแปรแสดงสีของแต่ละกิจกรรม
  cl_groundlevel = "warning"
  cl_hardSoilBlast = "warning"
  cl_seedclear = "warning"
  cl_groove = "warning"
  cl_NaturalFertilizer = "warning"
  cl_FertilizerRound1 = "warning"
  cl_FertilizerRound2 = "warning"
  cl_FertilizerRound3 = "warning"
  cl_fertilizer1Ratio = "warning"
  cl_fertilizer2Ratio = "warning"
  cl_fertilizer3Ratio = "warning"
  // cl_fertilizer1Formula = "warning"
  cl_pipeup = "warning"
  cl_GerminationPercent = "warning"
  cl_tonfm = "warning"
  //ตัวแปร สำหรับ binding ฟอร์มกับ field database
  groundlevel = ""
  tg_groundlevel: boolean = false; // Default value
  hardSoilBlast = ""
  tg_hardSoilBlast: boolean = false; // Default value
  seedclear = ""
  tg_seedclear: boolean = false; // Default value
  groove = 0
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
  tg_pipeup: boolean = false; // Default value
  pipeup = ""
  germinationpercent = 0
  wastedSpaceRai = 0
  Cutseed = 0
  ton_lost = 0
  ton_fm = 0
  fminput = {
    "la": 0,
    "cst": 0,
    "lc": 0,
    "arealeft": 0,
    "tonleft": 0,
  }

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

    this.itid = this.route.snapshot.paramMap.get('itid');
    console.log('itid in add-activity :', this.itid)

    let cp_data: any
    cp_data = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    cp_data = cp_data.filter((o: any) => o.itid === this.itid)
    console.log('cpdata filter :', cp_data)
    this.cpdata = cp_data[0];
    this.perTon = cp_data.ton_last_fm
    this.yearid = this.cpdata.year

    // เชคว่า เคยมีการบันทึกข้อมูลไว้แล้วหรือไม่จาก itid
    this.brdsql.cpActivityFm(this.itid).subscribe({
      next: (res: any) => {
        console.log('res cpActivityFm ', res)
        if (res && res.recordset.length !== 0) {
          this.frm_edit = true
          this.formType = 'edit'
          console.log('frm_edit', this.frm_edit)
          this.cpActivitydata = res.recordset[0]
          this.ck_fmacOK(this.cpActivitydata);
          console.log('cpActivityFm ', this.cpActivitydata)

          this.frm_editcpact = fb.group({
            itid: [this.cpActivitydata.itid,],
            yearid: [this.cpActivitydata.year,],  // ปีของแปลงอ้อย
            groundlevel: [this.cpActivitydata.groundlevel,],  // การปรับระดับพื้นที่
            hardSoilBlast: [this.cpActivitydata.hardSoilBlast],  // การระเบิดดาน
            seedclear: [this.cpActivitydata.seedclear],  // การคัดพันธุ์อ้อย สะอาด
            groove: [this.cpActivitydata.groove,],  // ระยะรอง ซม.
            naturalfertilizer: [this.cpActivitydata.NaturalFertilizer,],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            naturalFertilizerRatio: [this.cpActivitydata.naturalFertilizerRatio,],  // อัตราปุ๋ยอินทรีย์ที่ใส่
            fertilizer1Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี1
            fertilizer1Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี1
            fertilizer2Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี2
            fertilizer2Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี2
            fertilizer3Ratio: [this.cpActivitydata.fertilizer1Ratio,], // อัตราปุ๋ยเคมี3
            fertilizer3Formula: [this.cpActivitydata.fertilizer1Formula,],  // สูตรปุ๋ยเคมี3
            pipeup: [this.cpActivitydata.pipeup,],  // การพูนโคน
            germinationpercent: [this.cpActivitydata.GerminationPercent,],  // %การงอก
            ton_fm: [this.cpActivitydata.ton_In_Month, [Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            wastedSpaceRai: [this.cpActivitydata.wastedSpaceRai,],  // พท.สูญเสียของแปลง (ไร่)
            Cutseed: [this.cpActivitydata.Cutseed,],  // ตันพันธุ์
            ton_lost: [this.cpActivitydata.ton_lost,],  // ตันสูญเสียจากการตัด
          })

          // console.log('form value on load ', this.frm_editcpact.value)

        } else {
          this.frm_insert = true;
          this.formType = 'insert'
          console.log('frm_insert', this.frm_insert)
          let cp_data = this.cpdata
          this.frm_addcpact = fb.group({
            itid: [cp_data.itid, [Validators.required]],
            yearid: [cp_data.year, [Validators.required]],  // ปีของแปลงอ้อย
            groundlevel: ['',],  // การปรับระดับพื้นที่
            hardSoilBlast: [''],  // การระเบิดดาน
            seedclear: [''],  // การคัดพันธุ์อ้อย สะอาด
            groove: [0, [Validators.min(0), Validators.max(300)]],  // ระยะรอง ซม.
            naturalfertilizer: ['',],  // ประเภทปุ๋ยอินทรีย์ที่ใส่
            naturalFertilizerRatio: [0,],  // อัตราปุ๋ยอินทรีย์ที่ใส่
            fertilizer1Ratio: [0,],  // อัตราปุ๋ยเคมี1
            fertilizer2Ratio: [0,],  // อัตราปุ๋ยเคมี2
            fertilizer3Ratio: [0,],  // อัตราปุ๋ยเคมี3
            fertilizer1Formula: ['',],  // สูตรปุ๋ยเคมี1
            fertilizer2Formula: ['',],  // สูตรปุ๋ยเคมี2
            fertilizer3Formula: ['',],  // สูตรปุ๋ยเคมี3
            pipeup: ['',],  // การพูนโคน
            germinationpercent: [0,],  // %การงอก
            ton_fm: [0, [Validators.min(0), Validators.max(35)]],  // ตันประเมิน
            wastedSpaceRai: [0,],  // พท.สูญเสียของแปลง (ไร่)
            Cutseed: [0,],  // ตันพันธุ์
            ton_lost: [0,],  // ตันสูญเสียจากการตัด
          })
          console.log('form load ', this.frm_addcpact.value)
        }
      }
    })

  }

  ngOnInit() {
    this.getOrgaincType()
    this.getChemicalType()
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

  // ปรับสีกิจกรรมทำแล้ว สีเขียว
  ck_fmacOK(data: any) {
    let x = data
    // console.log('this.wastedSpaceRai', this.wastedSpaceRai)
    if (data.groundlevel == true) {
      this.groundlevel = x.groundlevel
      this.cl_groundlevel = 'success'
      this.tg_groundlevel = true
    }
    if (data.hardSoilBlast == true) {
      this.hardSoilBlast = x.hardSoilBlast
      this.cl_hardSoilBlast = 'success'
      this.tg_hardSoilBlast = true;
    }
    if (data.seedclear == true) {
      this.seedclear = x.seedclear
      this.cl_seedclear = 'success'
      this.tg_seedclear = true;
    }
    if (data.groove >= 160) {
      this.groove = x.groove
      this.cl_groove = 'success'
    } else {
      this.groove = x.groove
    }
    if (data.NaturalFertilizer == 0 || data.NaturalFertilizer == null) {
      this.naturalfertilizer = x.NaturalFertilizer
    } else {
      this.naturalfertilizer = x.NaturalFertilizer
      this.cl_NaturalFertilizer = 'success'
    }
    if (data.fertilizer1Ratio >= 50) {
      // console.log('fertilizerRatio >=100')
      this.fertilizer1Ratio = x.fertilizer1Ratio
      this.cl_fertilizer1Ratio = 'success'
    } else {
      console.log('fertilizer1Ratio <50')
      this.fertilizer1Ratio = x.fertilizer1Ratio
    }
    if (data.fertilizer1Formula == '0' || data.fertilizer1Formula == null) {
      this.fertilizer1Formula = x.fertilizer1Formula
      this.cl_FertilizerRound1 = 'success'
    } else {
      this.fertilizer1Formula = x.fertilizer1Formula
    }
    if (data.fertilizer2Ratio >= 50) {
      // console.log('fertilizerRatio >=100')
      this.fertilizer2Ratio = x.fertilizer2Ratio
      this.cl_fertilizer2Ratio = 'success'
    } else {
      console.log('fertilizer2Ratio <50')
      this.fertilizer2Ratio = x.fertilizer2Ratio
    }
    if (data.fertilizer2Formula == '0' || data.fertilizer2Formula == null) {
      this.fertilizer2Formula = x.fertilizer2Formula
      this.cl_FertilizerRound2 = 'success'
    } else {
      this.fertilizer2Formula = x.fertilizer2Formula
    }
    if (data.fertilizer3Ratio >= 50) {
      // console.log('fertilizerRatio >=100')
      this.fertilizer3Ratio = x.fertilizer3Ratio
      this.cl_fertilizer3Ratio = 'success'
    } else {
      console.log('fertilizer3Ratio <50')
      this.fertilizer3Ratio = x.fertilizer3Ratio
    }
    if (data.fertilizer3Formula == '0' || data.fertilizer3Formula == null) {
      this.fertilizer3Formula = x.fertilizer3Formula
      this.cl_FertilizerRound3 = 'success'
    } else {
      this.fertilizer3Formula = x.fertilizer3Formula
    }
    if (data.pipeup == true) {
      this.pipeup = x.pipeup
      this.cl_pipeup = 'success'
      this.tg_pipeup = true;
    } else {
      this.pipeup = x.pipeup
    }
    if (data.GerminationPercent >= 90) {
      this.germinationpercent = x.GerminationPercent
      this.cl_GerminationPercent = 'success'
    } else {
      this.germinationpercent = x.GerminationPercent
    }
    // อ้อยปลูกใหม่ 14 อ้อยตอ 10
    let ctype = ""
    if (this.frm_edit == true) {
      ctype = data.canetype.trim()
      console.log('ctype data', ctype)
    } else {
      ctype = this.cpdata.canetype.trim()
      console.log('ctype cpdata', ctype)
    }
    ctype = ctype.substring(0, 2)
    switch (true) {
      case (ctype == 'ER' && data.ton_last_fm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (ctype == 'SR' && data.ton_last_fm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (ctype == 'ST' && data.ton_last_fm >= 10):
        this.cl_tonfm = 'success'
        break;
      default:
        this.ton_fm = x.ton_last_fm
        break;
    }
    // if (data.ton_last_fm > 0) {
    //   this.tonfm = x.ton_last_fm
    //   this.cl_tonfm = 'success'
    // } else {
    //   this.tonfm = x.ton_last_fm
    // }
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
    let x = e.detail.checked
    // console.log('toggle event.detail.checked ', e.detail.checked);
    switch (x) {
      case true:
        this.cl_hardSoilBlast = "success"
        this.hardSoilBlast = "true"
        break;
      case false:
        this.cl_hardSoilBlast = "warning"
        this.hardSoilBlast = "false"
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

  // ตรวจสอบอัตราเคมี1 ที่คีย์ไม่เกิน 200 กก/ไร่
  showFertRatio = false;
  ckFertRationOver(e: any): number {
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

  ck_NaturalFertilizer(e: any) {
    let x = e.detail.value
    x = x.toString()
    console.log('การใส่ปุ๋ยอินทรีย์', x)
    switch (x) {
      case '0':
        this.cl_NaturalFertilizer = "warning"
        break;
      case '' || null:
        this.cl_NaturalFertilizer = "warning"
        break;
      default:
        this.showFertRatio = true;
        this.cl_NaturalFertilizer = "success"
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

  // สูตร ปุ๋ยเคมี1 ที่ใส่ ต้อง =>50 กก.
  ck_chemical1Formula(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    console.log('x is :', x)
    switch (true) {
      case (x >= 50):
        this.cl_FertilizerRound1 = "success"
        this.showChemical1Formula = true;
        break;
      case (x > 0 && x < 50):
        this.showChemical1Formula = true;
        break;
      case '' || null:
        this.cl_FertilizerRound1 = "warning"
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
    console.log('x is :', x)
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

  // สูตร ปุ๋ยเคมี1 ที่ใส่ ต้อง =>50 กก.
  ck_chemical3Formula(e: any) {
    let x = e.detail.value
    x = parseInt(x)
    console.log('x is :', x)
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
    this.fminput.cst = parseFloat(f.Cutseed)
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
    ctype = ctype.substring(0, 2)
    switch (true) {
      case (ctype == 'ER' && tonfm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (ctype == 'SR' && tonfm >= 14):
        this.cl_tonfm = 'success'
        break;
      case (ctype == 'ST' && tonfm >= 10):
        this.cl_tonfm = 'success'
        break;
      default:
        this.cl_tonfm = 'warning'
        break;
    }
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
    console.log('form to brdservice :', f)

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


}
