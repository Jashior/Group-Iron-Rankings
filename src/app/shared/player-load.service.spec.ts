import { TestBed } from '@angular/core/testing';

import { PlayerLoadService } from './player-load.service';

describe('PlayerLoadService', () => {
  let service: PlayerLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
