import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesPage } from './finances.page';

describe('FinancesPage', () => {
  let component: FinancesPage;
  let fixture: ComponentFixture<FinancesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FinancesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
