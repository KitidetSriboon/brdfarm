import { Component, OnChanges, OnInit,
  DoCheck, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

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

  constructor() {
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

}
