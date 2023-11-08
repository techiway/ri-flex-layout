import { Directive, ElementRef, Injectable, OnChanges } from '@angular/core';
import { BaseDirective, MediaMarshaller, StyleDefinition, StyleGenerator, 
  StyleUtilsService } from 'ri-flex-layout/src/lib/core';

@Injectable({providedIn: 'root'})
export class FlexOrderStyleBuilder extends StyleGenerator {
  buildStyles(value: string) {
    return {order: (value && parseInt(value, 10)) || ''};
  }
}

const inputs = [
  'riFxFlexOrder', 'riFxFlexOrder.xs', 'riFxFlexOrder.sm', 'riFxFlexOrder.md',
  'riFxFlexOrder.lg', 'riFxFlexOrder.xl', 'riFxFlexOrder.lt-sm', 'riFxFlexOrder.lt-md',
  'riFxFlexOrder.lt-lg', 'riFxFlexOrder.lt-xl', 'riFxFlexOrder.gt-xs', 'riFxFlexOrder.gt-sm',
  'riFxFlexOrder.gt-md', 'riFxFlexOrder.gt-lg'
];
const selector = `
  [riFxFlexOrder], [riFxFlexOrder.xs], [riFxFlexOrder.sm], [riFxFlexOrder.md],
  [riFxFlexOrder.lg], [riFxFlexOrder.xl], [riFxFlexOrder.lt-sm], [riFxFlexOrder.lt-md],
  [riFxFlexOrder.lt-lg], [riFxFlexOrder.lt-xl], [riFxFlexOrder.gt-xs], [riFxFlexOrder.gt-sm],
  [riFxFlexOrder.gt-md], [riFxFlexOrder.gt-lg]
`;

@Directive()
export class FlexOrderDirective extends BaseDirective implements OnChanges {

  protected override RI_DIRECTIVE_KEY = 'flex-order';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtilsService,
              styleBuilder: FlexOrderStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected override styleCache = flexOrderCache;
}

const flexOrderCache: Map<string, StyleDefinition> = new Map();

@Directive({selector, inputs})
export class RIDefaultFlexOrderDirective extends FlexOrderDirective {
  protected override inputs = inputs;
}
