import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { Filesystem ,Directory, Encoding } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  async exportToExcelJson(data: unknown[], filename: string | undefined) {
    {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, filename);
      XLSX.writeFile(wb, filename + '.xlsx');
    }
  }

  async exportToExcel(tableData: any, fileName: string) {
    // console.log('tableData & filename :' ,tableData ,fileName);
    // const table = document.getElementById(tableId);
    const table = tableData;
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // สร้างไฟล์ Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // ตรวจสอบ Platform
    const isNative = Capacitor.getPlatform() !== 'web';
    
    if (isNative) {
      await this.saveToDevice(blob, fileName);
    } else {
      this.saveToBrowser(blob, fileName);
    }
  }

  // บันทึกไฟล์บน Browser
  private saveToBrowser(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // บันทึกไฟล์บนมือถือ (Capacitor Filesystem)
  private async saveToDevice(blob: Blob, fileName: string) {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result?.toString().split(',')[1]; // แปลง Blob เป็น base64
      await Filesystem.writeFile({
        path: `downloads/${fileName}`,
        data: base64Data!,
        directory: Directory.Documents,
        // encoding: 'base64'
        encoding: Encoding.UTF8,

      });
      alert('ไฟล์ถูกบันทึกในโฟลเดอร์ Downloads');
    };
    reader.readAsDataURL(blob);
  } 

}
