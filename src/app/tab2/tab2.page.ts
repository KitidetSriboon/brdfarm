import { Component } from '@angular/core';
import { GlobalConstants } from '../global-constants';
import { environment } from 'src/environments/environment';
import { appdata } from '../data/data';
import { GoogleMap } from '@capacitor/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import { NavigationExtras, Router, RouterLinkWithHref } from '@angular/router';
import {
  ModalController,
  ActionSheetController,
  ToastController,
  LoadingController,
  IonAccordionGroup,
  AlertController,
  AnimationController,
  MenuController,
} from '@ionic/angular';

import { BrdsqlService } from '../services/brdsql.service';
import { FirebaseService } from '../services/firebase.service';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  yearCr?: string = GlobalConstants.yearCr;
  yearTh?: string = GlobalConstants.yearTh;
  yeardata?: any = [];
  cpFmdata?: any = [];
  mapFbFm?: any = [];
  fmdata?: any = []
  fmcode?: string;
  dataP = false;
  mapP = true;
  upos = { lat: 15.228581111646495, lng: 103.07182686761979 };  // พิกัด BRR

  constructor(
    private fbservice: FirebaseService,
    private brdservice: BrdsqlService,
    private acsCtrl: ActionSheetController,
    private mdCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    public geosv: GeolocationService,
    private menuCtrl: MenuController,

  ) {
    // console.log('tab2 constructor:')
    this.loadNewFmdata();
  }

  ngOnInit() {
    // console.log('tab2 ngOnInit:');
  }

  ngAfterViewInit(): void {
    // console.log('tab2 ngAfterViewInit:')
  }

  openFirstMenu() {
    // Open the menu by menu-id
    this.menuCtrl.enable(true, 'first-menu');
    this.menuCtrl.open('first-menu');
  }

  openSecondMenu() {
    // Open the menu by menu-id
    this.menuCtrl.enable(true, 'second-menu');
    this.menuCtrl.open('second-menu');
  }

  openEndMenu() {
    // Open the menu by side
    this.menuCtrl.enable(true, 'third-menu');
    this.menuCtrl.open('third-menu');
  }

  async loadNewFmdata() {

    this.fmdata = []
    this.cpFmdata = []
    this.mapFbFm = []

    // console.log('tab2 LoadFmdata:')
    this.yeardata = appdata.yearapp;
    let fm_data: any = localStorage.getItem('fmdata')
    fm_data = JSON.parse(fm_data)
    let cp_data: any = localStorage.getItem('cpfmdata')
    cp_data = JSON.parse(cp_data)
    let map_data: any = localStorage.getItem('mapfm')
    map_data = JSON.parse(map_data)
    this.fmdata = fm_data;
    this.cpFmdata = cp_data;
    this.mapFbFm = map_data;

    setTimeout(() => {
      this.getUserLocation();
      setTimeout(() => {
        this.draw();
      }, 1000)
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

  async getUserLocation() {
    await this.geosv.getCurrentCoordinate().then((res: any) => {
      this.upos.lat = res.coords.latitude;
      this.upos.lng = res.coords.longitude;
      // console.log('userPosition: ', this.upos.lat, this.upos.lng)
    })
  }

  // แสดงแผนที่แปลงอ้อย
  draw() {

    const loader = new Loader({
      apiKey: environment.mapkey,
      version: 'weekly',
    });

    loader.load().then(() => {

      this.presentToast('middle', '..กำลังโหลดข้อมูล', 'reload');

      const mapfb = this.mapFbFm
      const cpfm = this.cpFmdata

      // for (let i = 0; i < mapfb.length; i++) { }
      // 1. create map
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

      // 2. Create marker
      let label: string = "<ion-icon name='person-outline' color='danger'></ion-icon> <ion-label color='primary'> คุณอยู่ที่นี่ </ion-label>"
      const marker = new google.maps.Marker({
        position: this.upos,
        map,
        label: "",
        icon: 'assets/icon/fm64.png',
        // animation: google.maps.Animation.BOUNCE,
      });

      // 3. Create circle
      // const circle = new google.maps.Circle({
      //   center: this.upos,
      //   map,
      //   strokeWeight: 2,
      //   strokeColor: '#FF992C',
      //   fillColor: '#F5F8B4',
      //   fillOpacity: 0.35,
      //   radius: 100,  // รัศมีเป็นเมตร
      // })

      // 4. Create InfoWindow.
      let infoWindow = new google.maps.InfoWindow({
        content: label,
        position: this.upos,
      });
      infoWindow.open(map);

      // 5. create marker
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

        // 6. create polygon
        let fillColor = "#fff314"
        const ckfmton = mapfb[i].fmdata
        if (ckfmton !== undefined) {
          // console.log('ck fmdata:', ckfmton)
          let tonfm = ckfmton.ton_fm
          if (tonfm == 0) {
            fillColor = "#fff314"
          } else if (tonfm > 0) {
            fillColor = "#09FD0C"
          } else {
            fillColor = "#fff314"
          }
        }

        const triangleCoords = mapfb[i].coordinates;
        const bermudaTriangle = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: '#7FB5FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: fillColor,
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

  openMapMenu() {
    this.menuCtrl.open('moremenu');
  }

  async presentActionSheet(keypara: string) {
    // console.log('key :', keypara)
    let mapsql: any = []
    mapsql = this.cpFmdata
    mapsql = mapsql.filter((o: any) => o.itid === keypara)
    // console.log('mapsql filter :', mapsql)
    mapsql = mapsql[0]

    const actionSheet = await this.acsCtrl.create({
      header: `แปลง ${mapsql.CaneTypeName} พท.${mapsql.landvalue.toFixed(2)} ไร่`,
      subHeader: `กลุ่ม ${mapsql.groupCode} ท่านประเมิน ${mapsql.ton_last_fm} ตัน/ไร่ `,
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

  async presentLoading(msg: string) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'load',
      message: msg,
    });
    await loading.present();
  }

  async closeLoading() {
    await this.loadingCtrl.dismiss();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      icon: icon,
      position: position,
    });
    toast.present();
  }

}
