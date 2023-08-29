import { Component } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { environment } from 'src/environments/environment';
import { BrdsqlService } from '../services/brdsql.service';
import { FirebaseService } from '../services/firebase.service';
import { appdata } from '../data/data';
import { GoogleMap } from '@capacitor/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import { NavigationExtras, Router ,RouterLinkWithHref } from '@angular/router';
import {
  ModalController,
  ActionSheetController,
  ToastController,
  LoadingController,
  IonAccordionGroup,
  AlertController,
  AnimationController
} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  yearCr?: string = GlobalConstants.yearCr;
  yeardata?: any = [];
  cpFmdata?: any = [];
  mapFbFm?: any = [];
  fmdata?: any = []
  fmcode?: string;
  dataP = false;
  mapP = true;

  constructor(
    private fbservice: FirebaseService,
    private brdservice: BrdsqlService,
    private acsCtrl: ActionSheetController,
    private mdCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,

  ) {

    this.yeardata = appdata.yearapp;
    this.fmdata = appdata.fmuser;
    this.cpFmdata = appdata.cpgroupsql;
    this.mapFbFm = appdata.mapfb;

  }

  ngOnInit() {
    console.log('mapFbFm:' ,this.mapFbFm)
    // setTimeout(() => {
    //   this.draw();
    // }, 1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.draw();
    }, 1000);
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'map') {
      this.dataP = false;
      this.mapP = true;
    } else if (event.detail.value === 'cpdata') {
      this.dataP = true;
      this.mapP = false;
      setTimeout(() => {
        this.draw();
      }, 1000);
    }
  }

  // แสดงแผนที่แปลงอ้อย
  draw() {
    const loader = new Loader({
      apiKey: environment.mapkey,
      version: 'weekly',
    });

    loader.load().then(() => {

      const mapfb = this.mapFbFm
      const cpfm = this.cpFmdata

      for (let i = 0; i < mapfb.length; i++) { }
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: mapfb[0].coordinatesCenter.lat, lng: mapfb[0].coordinatesCenter.lng },
        zoom: 16,
        restriction: {
          latLngBounds: {
            north: 30,
            south: 5,
            east: 120,
            west: 90
          },
        },
        mapTypeId: 'roadmap',
      });
      for (let i = 0; i < mapfb.length; i++) {
        const marker = new google.maps.Marker({
          position: { lat: mapfb[i].coordinatesCenter.lat, lng: mapfb[i].coordinatesCenter.lng },
          map,
        });
        marker.addListener('click', () => {
          this.presentActionSheet(mapfb[i].key)
          // infowindow.open({
          //   anchor: marker,
          //   map,
          //   shouldFocus: false,
          // });
        });
        const triangleCoords = mapfb[i].coordinates;
        const bermudaTriangle = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: '#7FB5FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#7FB5FF',
          fillOpacity: 0.35,
        });
        bermudaTriangle.setMap(map);
        let contentString = ``;
        for (let j = 0; j < cpfm.length; j++) {
          if (cpfm[j].intlandno === cpfm[i].landno) {
            let landname = '';
            if (cpfm[j].landname_fm !== null) {
              landname = cpfm[j].landname_fm;
            } else {
              landname = 'ว่าง';
            }
            contentString = `
            <h3 style="color: #000;">ข้อมูลแปลง</h3>
            <h6 style="color: #000;">ชื่อแปลง : ${landname}</h6>
            <h6 style="color: #000;">หมายเลขแปลง : </h6>
            <h6 style="color: #000;"> ${cpfm[j].intlandno}</h6>
            <h6 style="color: #000;">ประเภทอ้อย : ${cpfm[j].CaneTypeName}</h6>
            <h6 style="color: #000;">อายุอ้อย : ${cpfm[j].caneage} วัน</h6>
            <h6 style="color: #000;">พื้นที่แปลง : ${cpfm[j].landvalue} ไร่</h6>
            <h6 style="color: #000;">โซน : ${cpfm[j].supzone}</h6>
          `;
          }
        }
        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 310,
        });
      }
    });
  }

  async presentActionSheet(keypara: string) {
    console.log('key :', keypara)

    let mapsql: any = []
    mapsql = this.cpFmdata
    // mapsql = localStorage.getItem('cpgroupsql')
    // mapsql = JSON.parse(mapsql)
    // console.log('mapsql :', mapsql)
    mapsql = mapsql.filter((o: any) => o.itid === keypara)
    console.log('mapsql filter :', mapsql)
    mapsql = mapsql[0]

    const actionSheet = await this.acsCtrl.create({
      header: `แปลง ${mapsql.CaneTypeName} พท.${mapsql.landvalue}ไร่`,
      subHeader:  `${mapsql.fmname} กลุ่ม ${mapsql.groupCode}`,
      cssClass: 'acs-orange',
      buttons: [{
        text: 'บันทึกกิจกรรมแปลง',
        icon: 'calendar-clear-outline',
        handler: () => {
          // console.log(this.list);
          // this.presentModal(mapsql);
          this.openAddActivityPage(mapsql.itid)
        }
      }, {
        text: 'ดูกิจกรรมแปลง',
        icon: 'eye-outline',
        data: 10,
        handler: () => {
          this.openShowActivityPage(mapsql.itid);
        }
      },
      //  {
      //   text: 'แผนที่',
      //   icon: 'map-outline',
      //   handler: () => {
      //     this.mapModal(keypara);
      //   }
      // }, 
      {
        text: 'ยกเลิก',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
  }

  // เปิดหน้า บันทึกกิจกรรมแปลงแบบ router
  async openAddActivityPage(itid: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: itid
      }
    };
    this.router.navigate(['/add-activity', itid], navigationExtras);
  }

  // เปิดหน้า แสดงกิจกรรมแปลงแบบ router
  async openShowActivityPage(itid: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: itid
      }
    };
    this.router.navigate(['/show-activity', itid], navigationExtras);
  }

  // แสดงข้อมูลกิจกรรมแปลง
  async viewModal(item: any) {
    // const modal = await this.mdCtrl.create({
    //   component: ViewPage,
    //   cssClass: 'my-custom-class',
    //   componentProps: {
    //     modal: this.modalController,
    //     data: item,
    //   }
    // });
    // return await modal.present();
  }

}
