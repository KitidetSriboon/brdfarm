// import { appdata } from "./data/data";

export class GlobalConstants {
    public static appname: string = "brdFarm";
    public static yearCr: string = "2324";
    public static yearTh: string = "6667";
    public static appversion: string = "1.1.0 Beta";
    public static lastupdate: string = "23 ม.ค.67"
    public static versionDesc = [
        { "subject": "1.บันทึกกิจกรรมแปลง" },
        // { "subject": "2.เมนู แผนที่แปลงอ้อย" },
        // { "subject": "3.เมนู ฤดูหีบอ้อย" },
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