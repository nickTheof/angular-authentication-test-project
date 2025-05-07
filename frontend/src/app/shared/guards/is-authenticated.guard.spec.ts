import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isAuthenticatedGuard } from './is-authenticated.guard';

describe('isAuthenticatedGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
