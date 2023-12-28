import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactorPage } from './factor.page';

describe('FactorPage', () => {
  let component: FactorPage;
  let fixture: ComponentFixture<FactorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FactorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
