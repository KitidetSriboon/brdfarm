import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForTestPage } from './for-test.page';

describe('ForTestPage', () => {
  let component: ForTestPage;
  let fixture: ComponentFixture<ForTestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
