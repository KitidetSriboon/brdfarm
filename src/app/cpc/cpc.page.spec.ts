import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpcPage } from './cpc.page';

describe('CpcPage', () => {
  let component: CpcPage;
  let fixture: ComponentFixture<CpcPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CpcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
