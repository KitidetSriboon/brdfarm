import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public ldingCtrl: LoadingController,) { }

  async presentLoading(msg: string) {
    const loading = await this.ldingCtrl.create({
      cssClass: 'load',
      message: msg,
    });
    await loading.present();
  }

  async closeLoading() {
    await this.ldingCtrl.dismiss();
  }
}
