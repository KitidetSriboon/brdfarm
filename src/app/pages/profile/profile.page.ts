import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fmData?: any = [];
  fmcode = '';
  frm_editProfile!: FormGroup;
  percentage: any;
  img: any;
  result: any;
  name: any;
  pic_url?: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private fb: FormBuilder,
    private brdsv: BrdsqlService,
    private firebase: FirebaseService,

  ) {
    let data: any = localStorage.getItem('fmdata')
    let fmcode = '';
    if (data) {
      data = JSON.parse(data)
      this.fmData = data[0]
      this.img = this.fmData.pic_url
      this.fmcode = this.fmData.fmcode_b1
      this.pic_url = this.fmData.pic_url
      console.log('fmdata :', this.fmData)
    }

    this.frm_editProfile = fb.group({
      fmcode: [this.fmcode,],
      tel: [this.fmData.tel,],
      smsnumber: [this.fmData.smsnumber,],
      e_mail: [this.fmData.email,],
      line_id: [this.fmData.line_id,],
      facebook: [this.fmData.facebook,],
      pic_url: [this.fmData.pic_url,],
    })
  }

  ngOnInit() {
  }

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

  async cameraOpen() {
    const image: any = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      promptLabelHeader: 'ตัวเลือกภาพ',
      promptLabelPicture: 'เปิดกล้อง',
      promptLabelPhoto: 'เลือกภาพถ่ายจากคลัง'
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const reader = new FileReader();
    const photo = await this.base64FromPath(image.webPath);
    const gname = new Date().getTime();
    this.result = this.dataURLtoFile(photo, gname);
    const filename = this.fmcode + '.' + this.result.type.substring(6);
    // const filename = gname + '.' + this.result.type.substring(6);
    this.name = filename;
    reader.readAsDataURL(this.result);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
    this.img = this.result;
    console.log(filename);

    // Can be set to the src of an image now
    this.upload();
  }

  upload() {
    this.firebase.pushProfilePict(this.result, this.fmData.fmcode_b1, this.name).subscribe({
      next: (percentage: any) => {
        this.percentage = Math.round(percentage ? percentage : 0);
        console.log('upload percentage :', this.percentage);
      },
      complete: () => {
        // const bucket = 'brr-farmluck.appspot.com';
        const link = 'https://storage.cloud.google.com/brr-farmluck.appspot.com/farmerapp/profile/' + this.name;
        this.pic_url = link;
        console.log('pic_url', this.pic_url);
        // this.updateProfileSql();
      }
    });
    // this.storage.upload(this.basePath + '/' + this.name, this.result);
  }

  // อัพเดตการแก้ไขโปรไฟล์ ไป sql server
  async saveEditProfile(f: any) {
    console.log('form ', f)
    Swal.fire({
      heightAuto: false,
      position: 'center',
      title: 'ยืนยันการบันทึกข้อมูล',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.brdsv.updateProfileFarmer(f).subscribe({
          next: (res: any) => {
            console.log('res ', res)
            if (res.rowsAffected == 1) {
              Swal.fire({
                heightAuto: false,
                position: 'bottom',
                icon: 'success',
                title: 'บันทึกข้อมูลของท่านแล้ว',
                text: 'ให้ลงชื่อออก และ ล็อคอิน เข้าระบบอีกครั้ง',
                imageUrl: 'assets/images/brdthanks.png',
                imageWidth: 150,
                imageHeight: 150,
                imageAlt: 'brr',
                showConfirmButton: false,
                timer: 1500
              })
              this.dismiss()
            }
          },
          complete: () => {
            console.log('updateProfile complete')
          },
          error: (err) => {
            console.log('updateProfile Error :', err)
          },
        })
      }
    })
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
