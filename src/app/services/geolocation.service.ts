import { Injectable, NgZone } from '@angular/core';
import { CallbackID, Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  watchId: any;

  constructor(
    private zone: NgZone,
  ) { }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
    return permResult.location
  }

  async getCurrentCoordinate() {
    return await new Promise((res, rej) => {
      if (!Capacitor.isPluginAvailable('Geolocation')) {
        console.log('Plugin geolocation not available');
        return
      }
      Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }).then((data) => {
        res(data)
      }).catch(err => {
        rej(err)
        console.error(err);
      });
    })
  }

  watchPosition() {
    return new Promise((res, rej) => {
      try {
        this.watchId = Geolocation.watchPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1,
        }, (position: any, err) => {
          console.log('Watch', position);
          this.zone.run(() => {
            res(position)
            // this.watchCoordinate = {
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            // };
          });
        });
      } catch (e) {
        rej(e)
        console.error(e);
      }
    })
  }

  clearWatch() {
    if (this.watchId != null) {
      console.log('watchId to clear :', this.watchId)
      Geolocation.clearWatch({ id: this.watchId });
    }
  }


}
