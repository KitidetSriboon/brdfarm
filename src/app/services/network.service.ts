import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  networkStatus: any;
  networkListener: PluginListenerHandle | undefined;

  constructor(
    private platform: Platform,
    private navCtrl: NavController) {
    this.initializeApp();
  }

  initializeApp() {
    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (status.connected == false) {
        return false;
      } else {
        return true;
        // this.navCtrl.navigateRoot([‘home’], {});
      }
    });

    this.platform.ready().then(() => {
      return true;
      // this.navCtrl.navigateRoot([‘home’], {});
    });

  }

  // getNetwork() {
  //   Network.addListener('networkStatusChange', status => {
  //     console.log('Network status changed', status);
  //   });
  //   const logCurrentNetworkStatus = async () => {
  //     const status = await Network.getStatus();
  //     console.log('Network status:', status);
  //   };
  // }

}
