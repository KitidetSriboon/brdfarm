import {
    Component, OnChanges, OnInit,
    DoCheck, AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { BrdsqlService } from 'src/app/services/brdsql.service';

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

    // ++++++++++ code from ChatGPT +++++++++++++++++
    items = [
        { groupcode: '', groupname: '', fmname: '' },
    ];

    filteredItems: any = [];
    public results = [...this.items];

    // ++++++++++ End code from ChatGPT +++++++++++++++++

    counter = 0;
    name = '';
    @ViewChild('myid', { static: true }) myid!: HTMLElement;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private brdsv: BrdsqlService,
    ) {
        // this.filteredItems = this.items; // Initialize filteredItems with all items

        // console.log(`constructor - counter is ${this.counter}`);

        this.getGroupCut();
    }

    handleInput(event: any) {
        console.log('user key..', event)
        // const query = event.target.value.toLowerCase();
        // const query = event;
        this.results = this.items.filter((d) => d.groupname.toLowerCase().indexOf(event) > -1);
    }

    filterItems(category: any) {
        console.log('user key..', category)
        const val = category;
        // this.filteredItems = this.items.filter(item => item.groupcode === category);
        this.filteredItems = this.items.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
        console.log('data filtered: ', this.filteredItems)
    }

    // filterItems(category: string) {
    //     this.filteredItems = this.items.filter(item => item.category === category);
    // }

    ngOnInit() {
        console.log(`ngOnInit  - counter is ${this.counter}`);
    }

    ngOnChanges() {
        console.log(`ngOnChanges - counter is ${this.counter}`);
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

    // กลุ่มตัดหรับ select groupcut
    groupcutData?: any = [];
    // groupcutfilter?: any = []; 
    async getGroupCut() {
        let ckdata: any
        ckdata = localStorage.getItem('groupcut')
        if (ckdata) {
            ckdata = JSON.parse(ckdata)
            this.items = ckdata
            // this.groupcutData = ckdata
            // this.groupcutfilter = ckdata
            console.log('data from local :', this.groupcutData)
        } else {
            let x: any;
            await this.brdsv.getGroupCut().subscribe({
                next: (res: any) => {
                    if (res) {
                        // this.groupcutData = res.recordset
                        // this.groupcutfilter = res.recordset
                        this.items = res.recordset
                        console.log('data from api :', this.groupcutData)
                        x = res.recordset
                        x = JSON.stringify(x)
                        localStorage.setItem('groupcut', x)
                    }
                }
            })
        }
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
