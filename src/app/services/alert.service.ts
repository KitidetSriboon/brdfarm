import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    public loading: LoadingController,
    private alertController: AlertController,
  ) { }

  swalAlertAnimate(xtitle: string, xtext: string, xicon: any) {
    Swal.fire({
      heightAuto: false,
      position: 'center',
      title: xtitle,
      text: xtext,
      icon: xicon,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }
}
