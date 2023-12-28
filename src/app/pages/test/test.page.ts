import {
    Component, OnChanges, OnInit,
    DoCheck, AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-test',
    templateUrl: './test.page.html',
    styleUrls: ['./test.page.scss'],
})
export class TestPage implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {

    counter = 0;
    name = '';
    @ViewChild('myid', { static: true }) myid!: HTMLElement;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
    ) {
        console.log(`constructor - counter is ${this.counter}`);
    }

    ngOnChanges() {
        console.log(`ngOnChanges - counter is ${this.counter}`);
    }
    ngOnInit() {
        console.log(`ngOnInit  - counter is ${this.counter}`);
    }
    ngDoCheck() {
        console.log('ngDoCheck');
    }
    ngAfterContentInit() {
        console.log('ngAfterContentInit');
    }
    ngAfterContentChecked() {
        console.log('ngAfterContentChecked');
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
    }

    ngAfterViewChecked() {
        console.log('ngAfterViewChecked');
    }
    ngOnDestroy() {
        console.log('ngOnDestroy');
    }

    increase() {
        this.counter++;
    }
    decrease() {
        this.counter--;
    }

    /* ++ ตัวอย่าง กรณี มีตัวเลือกปีการผลิต ให้มันแสดงฟิลด์ ตามปีที่เลือก ที่ถามใน Stack overflow */
    /*
        <select id="fmuser" >
        <option selected disabled >— Select code —</option>
            < option > 2021 < /option>
            < option > 2122 < /option>
            < option > 2223 < /option>
            < option > 2324 < /option>
            < option > 2425 < /option>
            < /select>
    
    const fmuser = {
        fmcode: '000001',
        fmname: 'abc',
        as2021: 10,
        as2122: 20,
        as2223: 30,
        as2324: 40,
        as2425: 50,
    };
    
    const elFmuser = document.querySelector("#fmuser");
    elFmuser.addEventListener("input", () => {
        const fmValue = fmuser[`as${elFmuser.value}`];
        console.log(fmValue); // Gives i.e: 30
    });    
    
    */

}
