import { TestBed } from '@angular/core/testing';

import { BrdsqlService } from './brdsql.service';

describe('BrdsqlService', () => {
  let service: BrdsqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrdsqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
