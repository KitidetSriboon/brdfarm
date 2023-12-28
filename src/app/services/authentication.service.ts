import { Injectable } from '@angular/core';
// add
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { BrdsqlService } from './brdsql.service';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';
  baseSelectUrl = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w?"
  fmdata: any = []

  constructor(private http: HttpClient, private brdsql: BrdsqlService) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { username: any; password: any }): Observable<any> {
    const url = this.baseSelectUrl
      + "s=fmcode,fmcode_b1,fmname,fm_token"
      + "&f=cps6263.dbo.t_farmer"
      + "&w=fmcode='" + credentials.username + "' and password='" + credentials.password + "'"
    // return this.http.get<any[]>(url)

    // return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
    return this.http.get<any[]>(url).pipe(
      map(
        // (data: any) => data.recordset[0].fm_token
        (data: any) => data.recordset[0],
        // localStorage.setItem('fmdata', this.fmdata)
      ),
      switchMap((res) => {
        console.log('fm_token data :', res)
        localStorage.setItem('fmuser', JSON.stringify(res))
        return from(Storage.set({ key: TOKEN_KEY, value: res.fm_token }))
      }),
      tap((_) => {
        this.isAuthenticated.next(true)
      })
    )
  }

  // async login1(credentials: { username: any; password: any }): Observable<any> {

  // await this.brdsql.login(credentials.username, credentials.password).subscribe({
  //   next: (res: any) => {
  //     console.log('login res:', res)
  //     let fm_token = res.recordset.fm_token
  //     return from(Storage.set({ key: TOKEN_KEY, value: fm_token }))
  //   }
  // })

  // return this.brdsql.login(credentials.username, credentials.password).pipe(
  //   map((data: any) => data.fm_token),
  //   switchMap((fm_token) => {
  //     return from(Storage.set({ key: TOKEN_KEY, value: fm_token }))
  //   }),
  //   tap((_) => {
  //     this.isAuthenticated.next(true)
  //   })
  // )

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

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    localStorage.clear()
    return Storage.remove({ key: TOKEN_KEY });
  }

}
