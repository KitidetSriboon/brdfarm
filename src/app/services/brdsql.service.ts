import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';

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

  // ข้อมูลปีการผลิต สำหรับ Select year
  yearId(): Observable<any[]> {
    const url = this.baseSelectUrl
      // + "s=*&f=appID&w=appid='03'"
      + "s=*&f=yearID&w=1=1 order by yearTh"
    return this.http.get<any[]>(url)
  }

  // ข้อมูลปีการผลิต ที่ใช้งานปัจจุบัน สำหรับแอพ brdfarm appid = 03 from cps6263.dbo.appID
  yearActive(): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*&f=appID&w=appid='03'"
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

  // ข้อมูลกลุ่มตัด  select groupcode,groupname,fmname from cps6263.dbo.vw_headGroupCutting order by groupname
  getGroupCut(): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=groupcode,groupname,h_fmname as fmname"
      + "&f=CPS6263.dbo.v_groupCode_HM"
      + "&w=category = 'H' order by groupname";
    return this.http.get<any[]>(url);
  }
  // ข้อมูลกลุ่มบำรุง
  getGroupM(): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=groupcode,groupname,h_fmname as fmname"
      + "&f=CPS6263.dbo.v_groupCode_HM"
      + "&w=category = 'M' order by groupname";
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
    // console.log('date update ', d)
    // console.log('form in brdservice:', f)
    let urlInsert = this.baseUrlInsert
    let urlUpdate = this.baseUrlUpdate
    // เชคว่าเป็นฟอร์มแบบ insert หรือ edit
    switch (frmType) {
      case 'edit':
        urlUpdate = urlUpdate + "t=dbIntech.dbo.p_farmer&"
          + "s=plantdate='" + f.plantdate + "',groundlevel='" + f.groundlevel + "',hardSoilBlast_code='" + f.hardSoilBlast_code
          + "',seedcode='" + f.seedcode.trim() + "',seedclear='" + f.seedclear + "',groove=" + f.groove + ",dolomite=" + f.dolomite + ",naturalfertilizer='" + f.naturalfertilizer + "',NaturalFertilizerRatio=" + f.naturalFertilizerRatio
          + ",fertilizer1Ratio=" + f.fertilizer1Ratio + ",fertilizer1Formula='" + f.fertilizer1Formula
          + "',fertilizer2Ratio=" + f.fertilizer2Ratio + ",fertilizer2Formula='" + f.fertilizer2Formula
          + "',fertilizer3Ratio=" + f.fertilizer3Ratio + ",fertilizer3Formula='" + f.fertilizer3Formula
          + "',disease='" + f.disease + "',insect='" + f.insect + "',pipeup='" + f.pipeup + "',GerminationPercent=" + f.germinationpercent + ",GerminationPercent_date=getdate()"
          + ",ton=" + f.ton_fm + ",tonm" + m + "=" + f.ton_fm + ",ton_last='" + m
          + "',wastedSpaceRai=" + f.wastedSpaceRai + ",cutseed=" + f.cutseed + ",ton_lost=" + f.ton_lost
          + ",groupcuted='" + f.groupcuted + "',groupMaintenance='" + f.groupMaintenance + "',update_date=getdate()&"
          + "w=itid='" + f.itid + "'"
        console.log('urlUpdate', urlUpdate)
        return this.http.get<any[]>(urlUpdate)
        break;
      case 'insert':
        urlInsert = urlInsert + "t=dbIntech.dbo.p_farmer&"
          + "c=itid, year, plantdate, groundlevel, hardSoilBlast_code, seedcode, seedclear, groove, dolomite, naturalfertilizer,NaturalFertilizerRatio,"
          + "fertilizer1Ratio, fertilizer1Formula, fertilizer2Ratio, fertilizer2Formula, fertilizer3Ratio, fertilizer3Formula, "
          + "disease, insect, pipeup, GerminationPercent, GerminationPercent_date, ton, tonm" + m + ", ton_last, wastedSpaceRai, cutseed, ton_lost,groupcuted, groupMaintenance, update_date&"
          + "v='" + f.itid + "', '" + f.yearid + "','" + f.plantdate + "', '" + f.groundlevel + "', '" + f.hardSoilBlast_code + "','" + f.seedcode.trim() + "','" + f.seedclear
          + "'," + f.groove + "," + f.dolomite + ",'" + f.naturalfertilizer + "'," + f.naturalFertilizerRatio
          + "," + f.fertilizer1Ratio + ",'" + f.fertilizer1Formula + "'," + f.fertilizer2Ratio + ",'" + f.fertilizer2Formula + "'," + f.fertilizer3Ratio + ",'" + f.fertilizer3Formula
          + "','" + f.disease + "','" + f.insect + "','" + f.pipeup + "'," + f.germinationpercent + ",getdate()," + f.ton_fm + "," + f.ton_fm + "," + m + ","
          + f.wastedSpaceRai + "," + f.cutseed + "," + f.ton_lost + ",'" + f.groupcuted + "','" + f.groupMaintenance + "',getdate()"
        console.log('url insert', urlInsert)
        return this.http.get<any[]>(urlInsert)
        break;
      default:
        let url = ""
        return this.http.get<any[]>(url)
        break;
    }
  }

  add_factor_money(f: any) {
    const url = `https://asia-southeast2-brr-farmluck.cloudfunctions.net/brdsqlapi/insert_getfactorw?supcode='${f.supcode}'&factor_type='1'
    &doc_status='F'&itid='${f.itid}'&intlandno='${f.intlandno}'&fmcode='${f.fmcode}'&YearID='${f.year_th}'&money_amt=${f.money_amt}&comment_fm='${f.fm_doc}'`
    //console.log('add_factor_money', url)
    return this.http.get<any[]>(url);
  }
  add_factor_factor(f: any, j: any) {
    const url = `https://asia-southeast2-brr-farmluck.cloudfunctions.net/brdsqlapi/insert_getfactorw?supcode='${f.supcode}'&factor_type='2'
    &doc_status='F'&itid='${f.itid}'&intlandno='${f.intlandno}'&fmcode='${f.fmcode}'&YearID='${f.year_th}'&money_amt=${f.money_amt}
    &get1='${j.get1}'&amt1=${j.amt1}&get2='${j.get2}'&amt2=${j.amt2}&get3='${j.get3}'&amt3=${j.amt3}&get4='${j.get4}'&amt4=${j.amt4}&get5='${j.get5}'&amt5=${j.amt5}`
    console.log('add_factor_money', url)
    return this.http.get<any[]>(url);
  }

  getData_money_itid(year: any, itid: string): Observable<any[]> {
    const url = 'https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w_0?'
      + "s=*"
      + "&f=[cps6263].[dbo].[v_sum_money_amt]"
      + "&w=[YearID]='" + year + "'and[itid]='" + itid + "'";
    return this.http.get<any[]>(url);
  }

  getData_factor_itid(year: any, itid: string): Observable<any[]> {
    const url = `https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w_0?s=*&f=[cps6263].[dbo].[v_getfactor]&w=[YearID]='${year}'and[itid]='${itid}'`;
    return this.http.get<any[]>(url);
  }

  // ข้อมูลการขอสินเชื่อของชาวไร่
  getFnFarmer(fmcode: any, yearTh: any) {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=cps6263.dbo.v_getfinance" + yearTh + "&"
      + "w=fmcode_b1=" + fmcode + " order by datepost desc"
    return this.http.get<any[]>(url)
  }

  getstock_data() {
    let url = `https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w_0?s=stock_id,description,amt_in,amt_out,CntUnitMsr,group_type,per_unit&f=[dbo].[stock]&w=[amt_in]>0or[amt_out]>0`;
    return this.http.get<any[]>(url)
  }

  // ข้อมูลการเบิกปัจจัยการผลิต
  getFactor(fmcode: any, year: any) {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=cps6263.dbo.v_getfactor" + year + "&"
      + "w=fmcode='" + fmcode + "' order by datepost desc"
    return this.http.get<any[]>(url)
  }

  // ข้อมูลหนี้ปีปัจจุุบัน
  getLoannow(fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=cps6263.dbo.v_loanFarmer&"
      + "w=fmcode_b1='" + fmcode + "'"
    return this.http.get<any[]>(url)
  }

  // รายละเอียดหนี้
  getFnNowDetail(fmcode: any) {
    const url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbbrr/VW_DOCLIST2_fmcode_w?cardcode=" + fmcode
    return this.http.get<any[]>(url)
  }

  // กิจกรรมแปลงของ นสส.ตาม itid
  getActivityData(year: any, itid: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_cp_data"
      + "&w=year='" + year + "' and itid='" + itid + "'";
    return this.http.get<any[]>(url);
  }

  // กิจกรรมแปลงของ ชาวไร่ ตาม itid
  getActivityDataFm(itid: string): Observable<any[]> {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=dbIntech.dbo.v_p_farmer"
      + "&w=itid='" + itid + "'";
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

  // ข้อมูลการค้ำประกัน 
  getGuarantor(yearTh: any, fmcode: any) {
    const url = this.baseSelectUrl
      + "s=*"
      + "&f=cps6263.dbo.v_promisted" + yearTh
      + "&w=fmcode_b1='" + fmcode + "'"
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
      + "w=onweb = '1' order by descript"
    return this.http.get<any[]>(url)
  }

  //ปุ๋ยเคมี select * from CPS6263.dbo.chemical where onweb = 1 order by descript
  getChemicalType() {
    const url = this.baseSelectUrl
      + "s=id,descript&"
      + "f=CPS6263.dbo.chemical&"
      + "w=onweb = '1' order by descript"
    return this.http.get<any[]>(url)
  }

  // พันธุ์อ้อย
  getSeedcane() {
    const url = this.baseSelectUrl
      + "s=seedcode,seedname&"
      + "f=CPS6263.dbo.seedcode&"
      + "w=1=1 order by seedname"
    return this.http.get<any[]>(url)
  }

  // โรคอ้อย
  getDisease() {
    const url = this.baseSelectUrl
      + "s=*&"
      + "f=CPS6263.dbo.Disease&"
      + "w=1=1 order by descript"
    return this.http.get<any[]>(url)
  }

  // แมลงอ้อย
  getInsect() {
    const url = this.baseSelectUrl
      + "s=insect,insectdesc&"
      + "f=CPS6263.dbo.insect&"
      + "w=1=1 order by insectdesc"
    return this.http.get<any[]>(url)
  }


  // update profile t_farmer
  updateProfileFarmer(f: any) {
    const url = this.baseUrlUpdate
      + "t=cps6263.dbo.t_farmer&"
      + "s=tel='" + f.tel + "',smsnumber='" + f.smsnumber + "',e_mail='" + f.e_mail + "',line_id='" + f.line_id + "',facebook='" + f.facebook + "',pic_url='" + f.pic_url + "'&"
      + "w=fmcode_b1 ='" + f.fmcode + "'"
    return this.http.get<any[]>(url)
  }

}
