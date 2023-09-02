import { Component, OnInit } from '@angular/core';
import {ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-cpc',
  templateUrl: './cpc.page.html',
  styleUrls: ['./cpc.page.scss'],
})
export class CpcPage implements OnInit {

  @ViewChild('datecpc', { static: true }) datecpc!: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.datecpc);
    this.datecpc.nativeElement.innerHTML = "จะเปิดหีบในอีก...";
  }

  ngOnInit() {

    console.log('ngOnInit', this.datecpc);

    // Set the date we're counting down to
    let countDownDate = new Date("Dec 1, 2023 00:00:00").getTime();

    // Update the count down every 1 second
    let x = setInterval( () => {

      // Get todays date and time
      let now = new Date().getTime();

      // Find the distance between now an the count down date
      let distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in an element with id="demo"
      this.datecpc.nativeElement.innerHTML = days + "วัน " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.datecpc.nativeElement.innerHTML = "EXPIRED";
      }
    }, 1000);

    // console.log(this.datecpc);
    // this.datecpc.nativeElement.innerHTML = "I am changed by ElementRef & ViewChild";
  }

  start() {

    
  }

}
