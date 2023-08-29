import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private http: HttpClient,
    private firebase: AngularFireDatabase,
    private fbstorage: AngularFireStorage,
  ) { }

  // แผนที่แปลงอ้อยตามชายไร่
  getMapByBNMCode(year: any, code: string) {
    return new Promise((res, rej) => {
      this.firebase
        .list('inst1/tx/' + year + '/areas')
        .query.orderByChild('bnm_profile/code')
        .equalTo(code)
        .once('value')
        .then((snapshots) => {
          const maps: any[] = [];
          snapshots.forEach((snapshots => {
            const rec = {
              key: snapshots.key,
              ...snapshots.val()
            };
            // filter หมายเลขแปลงต้องไม่ว่าง (landno) และ ไม่เอาแปลงที่เป็น OT (CaneTypeId) และ ต้องได้รับอนุมัติแล้ว (approveSts)
            if (rec.landno !== '' && rec.DetailPlant.CaneTypeId !== 'OT' && rec.approveSts === 1)
            {
              maps.push(rec);
            }
          }));
          res(maps);
        })
        .catch((e) => {
          rej(e);
        });
    });
  }

  // แผนที่แปลงอ้อยตามกลุ่มตัด
  getMapByGroup(year: string, groupcode: string) {
    return new Promise((res, rej) => {
      this.firebase
        .list('inst1/tx/' + year + '/areas')
        .query.orderByChild('groupCode')
        .equalTo(groupcode)
        .once('value')
        .then((snapshots) => {
          const maps: any[] = [];
          snapshots.forEach((snapshots => {
            const rec = {
              key: snapshots.key,
              ...snapshots.val()
            };
            // filter หมายเลขแปลงต้องไม่ว่าง (landno) และ ไม่เอาแปลงที่เป็น OT (CaneTypeId) และ ต้องได้รับอนุมัติแล้ว (approveSts)
            if (rec.landno !== '' && rec.DetailPlant.CaneTypeId !== 'OT' && rec.approveSts === 1) {
              maps.push(rec);
            }
          }));
          res(maps);
        })
        .catch((e) => {
          rej(e);
        });
    });
  }

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error(error);
  //     console.log(`${operation} failed: ${error.message}`);
  //     return of(result as T);
  //   };
  // }

  // อัพเดตกลุ่มตัด
  async updateGroupcode(year: string, key: string, data: string) {
    const local = this.firebase.list('inst1/tx/' + year + '/areas/');
    local.update(key, { groupCode: data });
  }

  // อัพเดต สถานะการตัด วันเริ่มตัด
  async setCutstatus(year: string, key: any, cutstatus: string, cutstart: string) {
    console.log('value :', year + key + cutstatus + cutstart)
    const local = this.firebase.list('inst1/tx/' + year + '/areas/');
    local.update(key, { cutstatus: cutstatus, cutstart: cutstart });
  }

  // สร้างชายใหม่
  async setCutstatus1(year: string, key: any, cutstatus: string, cutstart: string) {
    return new Promise((res, rej) => {
      const local = this.firebase.list('inst1/tx/' + year + '/areas/' + key + '/');
      local.update('cutevent', { cutstatus: cutstatus, cutstart: cutstart });
      res(local)
    }).catch((e) => { console.log('firebase error:', e) })

  }

}
