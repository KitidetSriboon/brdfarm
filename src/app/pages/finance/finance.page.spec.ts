import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancePage } from './finance.page';

describe('FinancePage', () => {
  let component: FinancePage;
  let fixture: ComponentFixture<FinancePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FinancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
