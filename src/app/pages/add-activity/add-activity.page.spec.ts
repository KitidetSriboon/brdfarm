import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddActivityPage } from './add-activity.page';

describe('AddActivityPage', () => {
  let component: AddActivityPage;
  let fixture: ComponentFixture<AddActivityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
