import { TestBed } from '@angular/core/testing';

import { PopupStatusService } from './popup-status.service';

describe('PopupStatusService', () => {
  let service: PopupStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
