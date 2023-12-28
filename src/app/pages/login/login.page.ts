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

const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private swalAlert: AlertService,
    private brdsql: BrdsqlService,
  ) {
    this.loadToken();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async login() {

    // console.log('form :', f.username, f.password)

    // return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
    //   map((data: any) => data.token),
    //   switchMap((token) => {
    //     return from(Storage.set({ key: TOKEN_KEY, value: token }));
    //   }),
    //   tap((_) => {
    //     this.isAuthenticated.next(true);
    //   })
    // );
    // }

    // await this.brdsql.login(f.username, f.password).subscribe({
    //   next: (res: any) => {
    //     console.log('login res: ', res)
    //     if (res.rowsAffected == 0) {
    //       this.swalAlert.swalAlertAnimate('!!ไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง..กรุณาลองใหม่อีกครั้ง', 'warning')
    //     }
    //     let data = res.recordset[0]
    //     let fmname = data.fmname
    //     this.swalAlert.swalAlertAnimate('เข้าระบบสำเร็จ', 'สวัสดี คุณ' + fmname, 'info')
    //     return (Storage.set({ key: TOKEN_KEY, value: data.fm_token }))
    //     this.isAuthenticated.next(true);
    //     this.router.navigateByUrl('/tabs', { replaceUrl: true });
    //   },
    //   complete() {
    //     // this.isAuthenticated.next(true);
    //   },
    //   error(err) {

    //   },
    // })

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res: any) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        this.swalAlert.swalAlertAnimate('!!ไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง..กรุณาลองใหม่อีกครั้ง', 'warning')
      }
    );

  }

  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

}
