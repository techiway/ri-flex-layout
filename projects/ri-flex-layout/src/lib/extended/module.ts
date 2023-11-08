import {NgModule} from '@angular/core';
import {CoreModule} from 'ri-flex-layout/src/lib/core';

import {RIDefaultImgSrcDirective} from './img-src/img-src';
import {RIDefaultClassDirective} from './class/class';
import {RIDefaultShowHideDirective} from './show-hide/show-hide';
import {RIDefaultStyleDirective} from './style/style';


const ALL_DIRECTIVES = [
  RIDefaultShowHideDirective,
  RIDefaultClassDirective,
  RIDefaultStyleDirective,
  RIDefaultImgSrcDirective,
];

/**
 * *****************************************************************
 * Define module for the Extended API
 * *****************************************************************
 */

@NgModule({
  imports: [CoreModule],
  declarations: [...ALL_DIRECTIVES],
  exports: [...ALL_DIRECTIVES]
})
export class RIExtendedModule {
}
