import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportProblemPage } from './report-problem.page';

describe('ReportProblemPage', () => {
  let component: ReportProblemPage;
  let fixture: ComponentFixture<ReportProblemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportProblemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
