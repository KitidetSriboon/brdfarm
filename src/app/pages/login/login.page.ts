import { Component, OnInit } from '@angular/core';
// add
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BrdsqlService } from 'src/app/services/brdsql.service';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { Swiper } from 'swiper/types';
import { register } from 'swiper/element';

register();
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials!: FormGroup;
  // isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // token = '';
  public swiper!: Swiper;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private altServ: AlertService,
    private brdsql: BrdsqlService,
  ) {
    // this.loadToken();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // async loadToken() {
  //   const token = await Storage.get({ key: TOKEN_KEY });
  //   if (token && token.value) {
  //     console.log('have token');
  //     this.token = token.value;
  //     this.isAuthenticated.next(true);
  //   } else {
  //     console.log('no token');
  //     this.isAuthenticated.next(false);
  //   }
  // }

  async login() {

    // code from https://devdactic.com/ionic-5-navigation-with-login
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        this.altServ.swalAlertAnimate('!!ผิดพลาด', 'ชื่อผู้ใช้หรือรหัสผ่าน ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง', 'warning')
      }

      // +++++++++++ End code from https://devdactic.com/ionic-5-navigation-with-login +++++++++++++++

      // next: (res: any) => {
      //   console.log('login res: ', res)
      //   if (res.rowsAffected == 0) {
      //     this.swalAlert.swalAlertAnimate('!!ไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง..กรุณาลองใหม่อีกครั้ง', 'warning')
      //   }
      //   let data = res.recordset[0]
      //   let fmname = data.fmname
      //   this.swalAlert.swalAlertAnimate('เข้าระบบสำเร็จ', 'สวัสดี คุณ' + fmname, 'info')
      //   Storage.set({ key: TOKEN_KEY, value: 'true' });
      //   this.isAuthenticated.next(true);
      //   this.router.navigateByUrl('/tabs', { replaceUrl: true });
      // },
      // complete: () => {
      //   loading.dismiss();
      // },
      // error: (err) => {
      //   this.swalAlert.swalAlertAnimate('!!ไม่สำเร็จ', 'เกิดความผิดพลาดบางประการ..กรุณาลองใหม่อีกครั้ง', 'warning')
      // },
    )

    // this.authService.login(this.credentials.value).subscribe(
    //   // if login success
    //   async (res: any) => {
    //     console.log('res OK', res)
    //     await loading.dismiss();
    //     await Storage.set({ key: TOKEN_KEY, value: 'true' });
    //     this.router.navigateByUrl('/tabs', { replaceUrl: true });
    //   },
    //   async (res) => {
    //     console.log('res No K', res)
    //     await loading.dismiss();
    //     this.swalAlert.swalAlertAnimate('!!ไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง..กรุณาลองใหม่อีกครั้ง', 'warning')
    //   }
    // );

  }

  // Easy access for form fields
  get username() {
    console.log('get username')
    return this.credentials.get('username');
  }

  get password() {
    console.log('get password')
    return this.credentials.get('password');
  }

}
