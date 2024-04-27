// import { appdata } from "./data/data";

export class GlobalConstants {
    public static appname: string = "brdFarm";
    public static yearCr: string = "2425";
    public static yearTh: string = "6768";
    public static appversion: string = "1.6.0 Beta";
    public static lastupdate: string = "27 เม.ย.67"
    public static versionDesc = [
        { "subject": "1.อัพเดตโปรไฟล์ เช่น รูปประจำตัว เบอร์โทร เบอร์sms ไลน์ไอดี เฟซไอดี อีเมล์" },
        // { "subject": "2.เมนูสินเชื่อ แสดงวงเงินสินเชื่อ,ยอดหนี้ปีต่างๆ,ดู/ติดตามรายการขอเกี้ยว/ปัจจัย" },
        // { "subject": "3.อัพเดตฟอร์มบันทึกกิจกรรมแปลง" },
    ];
    public static yeardata: any = [];
    public static fmdata: any = [];
    public static cpFmdata: any = [];
    public static mapFbFm: any = [];
    public static _yearid: string = "";
    public static yearLabel: string = "";

}

export function yearCr(): string {
    let yearCr: string;
    let yearnow: any = new Date().getFullYear();
    yearnow = yearnow.toString().substring(2, 4)
    // console.log('yearnow', yearnow)
    let yearnext: any = new Date().getFullYear() + 1;
    yearnext = yearnext.toString().substring(2, 4)
    // console.log('yearnext', yearnext)
    let yearpre: any = new Date().getFullYear() - 1;
    yearCr = yearnow.concat(yearnext)
    // console.log('yearCr', yearCr)
    return yearCr;
}

export function yearTh(): string {
    let yearTh: string;
    let yearnow: any = new Date().getFullYear() + 543;
    yearnow = yearnow.toString().substring(2, 4)
    let yearnext: any = new Date().getFullYear() + 544;
    yearnext = yearnext.toString().substring(2, 4)
    let yearpre: any = new Date().getFullYear() + 542;
    yearTh = yearnow.concat(yearnext)
    return yearTh;
}

export function yearLabel(): string {
    let yearLabel: string;
    let yearnow: any = new Date().getFullYear() + 543;
    yearnow = yearnow.toString().substring(2, 4)
    let yearnext: any = new Date().getFullYear() + 544;
    yearnext = yearnext.toString().substring(2, 4)
    yearLabel = yearnow.concat(yearnext)
    return yearLabel;
}