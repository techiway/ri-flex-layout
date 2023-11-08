import { TestBed } from '@angular/core/testing';

import { RiFlexLayoutService } from './ri-flex-layout.service';

describe('RiFlexLayoutService', () => {
  let service: RiFlexLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiFlexLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
