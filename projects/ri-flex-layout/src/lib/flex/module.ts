import { NgModule } from '@angular/core';
import { RIDefaultLayoutDirective } from './layout/layout';
import { CoreModule } from 'ri-flex-layout/src/lib/core';
import { BidiModule } from '@angular/cdk/bidi';
import { RIDefaultFlexAlignDirective } from './flex-align/flex-align.directive';
import { FlexFillDirective } from './flex-fill/flex-fill.directive';
import { RIDefaultFlexOrderDirective } from './flex-order/flex-order.directive';
import { RIDefaultFlexDirective } from './flex/flex.directive';
import { RIDefaultLayoutAlignDirective } from './layout-align/layout-align.directive';
import { RIDefaultLayoutGapDirective } from './layout-gap/layout-gap.directive';

const ALL_DIRECTIVES = [
  RIDefaultLayoutDirective,
  RIDefaultLayoutGapDirective,
  RIDefaultLayoutAlignDirective,
  RIDefaultFlexOrderDirective,
  FlexFillDirective,
  RIDefaultFlexAlignDirective,
  RIDefaultFlexDirective,
];
@NgModule({
  imports: [
    CoreModule,
    BidiModule
  ],
  declarations: [...ALL_DIRECTIVES], 
  exports: [...ALL_DIRECTIVES]
})
export class FlexModule { }
