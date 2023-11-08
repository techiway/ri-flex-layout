/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StyleUtilsService } from './style-utils.service';

describe('Service: StyleUtils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StyleUtilsService]
    });
  });

  it('should ...', inject([StyleUtilsService], (service: StyleUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
