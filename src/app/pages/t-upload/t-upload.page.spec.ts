import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TUploadPage } from './t-upload.page';

describe('TUploadPage', () => {
  let component: TUploadPage;
  let fixture: ComponentFixture<TUploadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
