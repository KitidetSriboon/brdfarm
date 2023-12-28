import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/global-constants';
import Swall from 'sweetalert2'
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera'
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-t-upload',
  templateUrl: './t-upload.page.html',
  styleUrls: ['./t-upload.page.scss'],
})
export class TUploadPage implements OnInit {

  fmcode?: string = ''
  fmdata?: any = [];
  img: any;
  percentage: any;
  photo!: SafeResourceUrl;
  result: any;
  name: string = "";
  picurl?: string = "";
  filePath?: string = "";
  basePath = '/audit';
  // frm_upload: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private brdservice: BrdsqlService,
    private fb: FormBuilder,
    private fbservice: FirebaseService,
  ) {

    // this.frm_upload = this.fb.group({
    //   fmcode: ['', [Validators.required]],
    //   filepic: ['', [Validators.required]],
    // })

    let fm = localStorage.getItem('fmcode')
    if (fm) {
      this.fmcode = fm
      console.log('fmcode ', this.fmcode)
    }
    this.getFmdata()
  }

  ngOnInit() {

  }

  getFmdata() {
    let fm: any = localStorage.getItem('fmdata')
    if (fm) {
      fm = JSON.parse(fm)
      this.fmdata = fm[0]
      console.log('fmdata ', this.fmdata)
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      promptLabelHeader: 'ตัวเลือกภาพ',
      promptLabelPicture: 'เปิดกล้อง',
      promptLabelPhoto: 'เลือกภาพถ่ายจากคลัง'
    });
    this.img = image.webPath;
    this.photo = await this.base64FromPath(this.img);
    const gname = new Date().getTime();
    this.result = this.dataURLtoFile(this.photo, gname);
    const filename = gname + '.' + this.result.type.substring(6);
    this.name = filename;
    // console.log(this.result);
    this.filePath = `${this.basePath}/${filename}`;
  };

  async base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }

  dataURLtoFile(dataurl: any, filename: any) {

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]); let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async upload() {
    console.log('upload to firebase..')
    let filename = this.fmcode
    filename = filename + '-' + this.name
    await this.fbservice.pushFileToStorage(this.result, this.fmcode, this.name).subscribe({
      next: (percentage: any) => {
        console.log('res upload', percentage);
        this.percentage = Math.round(percentage ? percentage : 0);
        console.log('percentage..', this.percentage);
      },
      complete: () => {
        console.log('upload complete..')
        const bucket = 'brr-farmluck.appspot.com';
        const link = 'https://storage.googleapis.com/' + bucket + '/audit/' + this.name;
        this.picurl = link;
      }
    });
    // this.storage.upload(this.basePath + '/' + this.name, this.result);
  }


}
