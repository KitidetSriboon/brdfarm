import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrdsqlService {

  baseSelectUrl = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w?"
  httpHeader = {
    headers: new HttpHeaders({ 'content-type': 'application/json' }),
  };

  constructor(
    private http: HttpClient
  ) { }

  // ข้อมูลชาวไร่
  getFmdata(fmcode: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=CPS6263.dbo.v_farmer_basic"
      + "&w=fmcode_b1='" + fmcode + "'";
    return this.http.get<any[]>(url);
  }

  // ดึงข้ออมูลชาวไร่ แบบใช้ Promise All
  // async getAllFarmData(fmcode: string, year: string) {
  //   try {
  //     const url1 = this.baseSelectUrl + "s=*&f=CPS6263.dbo.v_farmer_basic&w=fmcode='" + fmcode + "'";
  //     const url2 = this.baseSelectUrl + "s=*&f=CPS6263.dbo.v_cp_data&w=year='" + year + "' and fmcode ='" + fmcode + "' order by intlandno";
  //     const results = await Promise.all([
  //       fetch(url1),
  //       fetch(url2)
  //     ])
  //     const dataPromises = await results.map(result => result.json())
  //     const finalData = Promise.all(dataPromises);
  //     return finalData;
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  getCpgroup(year: string, groupcode: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=CPS6263.dbo.v_cp_data&w=year=" + year + " and groupcode='" + groupcode
      + "' order by intlandno"
    return this.http.get<any[]>(url)
  }

  // ข้อมูลแปลงอ้อย db sql ชาวไร่
  getCpFm(year: any, fmcode: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=CPS6263.dbo.v_cp_data&w=year=" + year + " and fmcode='" + fmcode
      + "' order by intlandno"
    return this.http.get<any[]>(`${url}`).pipe(
      tap((cpdata) => console.log('cpdata fetched!')),
      catchError(this.handleError<any[]>('Get cpdata error: ', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // บันทึก กิจกรรมแปลงของชาวไร่
  updateFmActivity(f: any): Observable<any[]> {
    const d = new Date()
    let m = d.getMonth()+1
    console.log('month: ' ,m)
    console.log('form in brdservice:', f)
    // function pad(s) { return (s < 10) ? '0' + s : s; }
    // let d = new Date();
    // let newd = [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/')
    const url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_smfbrr/push_p_farmer?itid="
      + f.itid + "&year=" + f.yearid 
      + "&tonm"+m+"=" + f.ton + "&wastedSpaceRai="
      + f.wastedSpaceRai+"&Cutseed="+f.Cutseed+"&ton_lost="+f.ton_lost+"&ton_last=" + m;
    return this.http.get<any[]>(url)
  }

  // กิจกรรมแปลงตาม itid
  getActivityData(year: any, itid: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_cp_data"
      + "&w=year='" + year + "' and itid='" + itid + "'";
    return this.http.get<any[]>(url);
  }


}
