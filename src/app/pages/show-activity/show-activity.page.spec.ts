import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowActivityPage } from './show-activity.page';

describe('ShowActivityPage', () => {
  let component: ShowActivityPage;
  let fixture: ComponentFixture<ShowActivityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
