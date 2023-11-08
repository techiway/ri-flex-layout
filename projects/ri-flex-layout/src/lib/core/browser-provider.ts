
import {APP_BOOTSTRAP_LISTENER, PLATFORM_ID, InjectionToken} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';


export function removeStyles(_document: Document, platformId: Object) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      const elements = Array.from(_document.querySelectorAll(`[class*=${CLASS_NAME}]`));
      const classRegex = /\bflex-layout-.+?\b/g;
      elements.forEach(el => {
        el.classList.contains(`${CLASS_NAME}ssr`) && el.parentNode ?
          el.parentNode.removeChild(el) : el.className.replace(classRegex, '');
      });
    }
  };
}

export const BROWSER_PROVIDER = {
  provide: <InjectionToken<(() => void)[]>>APP_BOOTSTRAP_LISTENER,
  useFactory: removeStyles,
  deps: [DOCUMENT, PLATFORM_ID],
  multi: true
};

export const CLASS_NAME = 'flex-layout-';
