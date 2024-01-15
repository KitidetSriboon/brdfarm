import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrdsqlService {

  baseSelectUrl = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w?"
  brr_funcUrl = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbbrr/"
  baseUrlUpdate = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/update_t_s_w?"
  baseUrlInsert = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/insert_t_c_v?"
  baseUrlExe = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/exec_f_v?"

  httpHeader = {
    headers: new HttpHeaders({ 'content-type': 'application/json' }),
  };

  constructor(
    private http: HttpClient
  ) { }

  // ข้อมูลปีการผลิต
  yearId(): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*&f=yearID&w=1=1 order by yearTh"
    return this.http.get<any[]>(url)
  }

  // Login 
  login(username: any, password: any): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=fmcode,fmcode_b1,fmname,fm_token"
      + "&f=cps6263.dbo.t_farmer"
      + "&w=fmcode='" + username + "' and password='" + password + "'"
    return this.http.get<any[]>(url)
  }

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
    // console.log('getCpFm url', url)
    return this.http.get<any[]>(url)
    // return this.http.get<any[]>(`${url}`).pipe(
    //   tap((cpdata) => console.log('cpdata fetched!')),
    //   catchError(this.handleError<any[]>('Get cpdata error: ', []))
    // );
  }

  // สรุปข้อมูลแปลงอ้อยตามประเภทของชาวไร่
  canetypeSummaryFm(fmcode: string, year: any): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=cps6263.dbo.v_sumcpfm" + year + "&"
      + "w=FMCODE='" + fmcode + "'"
    return this.http.get<any[]>(url)
  }

  // สรุปอ้อยเข้า ซีซีเอส แต่ละวันของชาวไร่
  cpcDiaryFm(fmcode: string) {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=dbqbrd.dbo.fnc_cpcfmdairy('" + fmcode + "')&"
      + "w=1=1 order by reportdate_th"
    return this.http.get<any[]>(url)
  }

  // CCS BRR Diary
  ccsBrr() {
    const url = this.baseSelectUrl
      + "s=Format(reportdate,'dd-MMM-yy','th') reportdate_th, SUM(wgt_net) wgt_net, Convert(decimal(10, 2), AVG(ccs_value)) ccs_value&"
      + "f=dbqbrd.dbo.v_qcard6667&"
      + "w=ccs_value > 0 group by reportdate order by reportdate_th"
    return this.http.get<any[]>(url)
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // ข้อมูลการบันทึกกิจกรรมแปลงของชาวไร่จาก itid
  cpActivityFm(itid: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=dbIntech.dbo.v_p_farmer&"
      + "w=itid='" + itid + "'"
    return this.http.get<any[]>(url)
  }

  // บันทึก กิจกรรมแปลงของชาวไร่
  updateFmActivity(f: any, frmType: string): Observable<any[]> {
    let d: any = new Date()
    let m = d.getMonth() + 1
    d = d.toString()
    console.log('date update ', d)
    // console.log('form in brdservice:', f)
    let urlInsert = this.baseUrlInsert
    let urlUpdate = this.baseUrlUpdate
    // เชคว่าเป็นฟอร์มแบบ insert หรือ edit
    switch (frmType) {
      case 'edit':
        urlUpdate = urlUpdate + "t=dbIntech.dbo.p_farmer&"
          + "s=groundlevel='" + f.groundlevel + "',hardSoilBlast='" + f.hardSoilBlast
          + "',seedclear='" + f.seedclear + "',groove=" + f.groove + ",naturalfertilizer='" + f.naturalfertilizer
          + "',fertilizerRatio=" + f.fertilizerRatio + ",fertilizerFormula='" + f.fertilizerFormula
          + "',pipeup='" + f.pipeup + "',GerminationPercent=" + f.germinationpercent + ",GerminationPercent_date=getdate()"
          + ",ton=" + f.ton + ",tonm" + m + "=" + f.ton + ",ton_last='" + m + "',update_date=getdate()&"
          + "w=itid='" + f.itid + "'"
        console.log('urlUpdate', urlUpdate)
        return this.http.get<any[]>(urlUpdate)
        break;
      case 'insert':
        urlInsert + "t=dbIntech.dbo.p_farmer&"
          + "c=itid, year_id, landno, qtype, num_qcard, Requester, comment & "
          + "v='" + f.itid + "', '" + f.year_id + "', '" + f.landno + "', '" + f.qtype + "', " + f.num_qcard
          + ",'" + f.requester + "','" + f.comment + "'"
        return this.http.get<any[]>(urlInsert)
        break;
      default:
        let url = ""
        return this.http.get<any[]>(url)
        break;
    }

  }

  // กิจกรรมแปลงตาม itid
  getActivityData(year: any, itid: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_cp_data"
      + "&w=year='" + year + "' and itid='" + itid + "'";
    return this.http.get<any[]>(url);
  }

  // ข้อมูล สรุปอ้อยเข้าหีบ
  getCpcSummary(fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=dbQBRD.dbo.fnc_cpcSummaryFM('" + fmcode + "')"
      + "&w=1=1";
    return this.http.get<any[]>(url);
  }

  // ข้อมูล รายละเอียดอ้อยเข้าหีบของชาวไร่
  getCpcDetail(fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=dbQBRD.dbo.fnc_cpcFM('" + fmcode + "')"
      + "&w=1=1 order by reportdate desc";
    return this.http.get<any[]>(url);
  }

  // ข้อมูลด้านสินเชื่อ วงเงินได้รับ ใช้ไป คงเหลือ
  getFinanceFm(yearTh: any, fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_fm_overall_" + yearTh
      + "&w=fmcode='" + fmcode + "'";
    return this.http.get<any[]>(url);
  }

  // ข้อมูลพื้นที่ปลูกอ้อย แยกประเภทอ้อย วงเงิน
  getSumcpFm(yearTh: any, fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_sumcpfm" + yearTh
      + "&w=fmcode='" + fmcode + "'"
    return this.http.get<any[]>(url)
  }

  // ข้อมูลวงเงินหลักทรัพย์ เช็ค การใช้ เบิกเงิน กับเบิกปัจจัย
  getCrFm(yearTh: any, fmcode: any) {
    const url = this.brr_funcUrl
      + "ck_realty_debt?"
      + "year=" + yearTh
      + "&fmcode=" + fmcode
    return this.http.get<any[]>(url)
  }

  // ปุ๋ยอินทรีย์
  getOrganicType() {
    const url = this.baseSelectUrl
      + "s=id,descript&"
      + "f=CPS6263.dbo.organic&"
      + "w=descript <> '' order by id"
    return this.http.get<any[]>(url)
  }

  //ปุ๋ยเคมี select * from CPS6263.dbo.chemical where isactive = 1 order by descript
  getChemicalType() {
    const url = this.baseSelectUrl
      + "s=id,descript&"
      + "f=CPS6263.dbo.chemical&"
      + "w=isactive = 1 order by descript"
    return this.http.get<any[]>(url)
  }

}
