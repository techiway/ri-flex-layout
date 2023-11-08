import {InjectionToken} from '@angular/core';

export const SERVER_TOKEN = new InjectionToken<boolean>(
  'FlexLayoutServerLoaded', {
    providedIn: 'root',
    factory: () => false
  });
