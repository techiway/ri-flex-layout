import { Directive, ElementRef, Injectable } from '@angular/core';
import { BaseDirective, MediaMarshaller, StyleDefinition, StyleGenerator, 
  StyleUtilsService } from 'ri-flex-layout/src/lib/core';

const FLEX_FILL_CSS = {
  'margin': 0,
  'width': '100%',
  'height': '100%',
  'min-width': '100%',
  'min-height': '100%'
};

@Injectable({providedIn: 'root'})
export class FlexFillStyleBuilder extends StyleGenerator {
  buildStyles(_input: string) {
    return FLEX_FILL_CSS;
  }
}

@Directive({selector: `[riFxFill], [riFxFlexFill]`})
export class FlexFillDirective extends BaseDirective {
  constructor(elRef: ElementRef,
              styleUtils: StyleUtilsService,
              styleBuilder: FlexFillStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.addStyles('');
  }

  protected override styleCache = flexFillCache;
}

const flexFillCache: Map<string, StyleDefinition> = new Map();