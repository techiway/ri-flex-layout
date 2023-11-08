import { Directive, ElementRef, Injectable } from '@angular/core';
import { BaseDirective, MediaMarshaller, StyleDefinition, StyleGenerator, StyleUtilsService 
} from 'ri-flex-layout/src/lib/core';

@Injectable({providedIn: 'root'})
export class FlexAlignStyleBuilder extends StyleGenerator {
  buildStyles(input: string) {
    input = input || 'stretch';
    const styles: StyleDefinition = {};

    switch (input) {
      case 'start':
        styles['align-self'] = 'flex-start';
        break;
      case 'end':
        styles['align-self'] = 'flex-end';
        break;
      default:
        styles['align-self'] = input;
        break;
    }
    return styles;
  }
}

const inputs = [
  'riFxFlexAlign', 'riFxFlexAlign.xs', 'riFxFlexAlign.sm', 'riFxFlexAlign.md',
  'riFxFlexAlign.lg', 'riFxFlexAlign.xl', 'riFxFlexAlign.lt-sm', 'riFxFlexAlign.lt-md',
  'riFxFlexAlign.lt-lg', 'riFxFlexAlign.lt-xl', 'riFxFlexAlign.gt-xs', 'riFxFlexAlign.gt-sm',
  'riFxFlexAlign.gt-md', 'riFxFlexAlign.gt-lg'
];
const selector = `
  [riFxFlexAlign], [riFxFlexAlign.xs], [riFxFlexAlign.sm], [riFxFlexAlign.md],
  [riFxFlexAlign.lg], [riFxFlexAlign.xl], [riFxFlexAlign.lt-sm], [riFxFlexAlign.lt-md],
  [riFxFlexAlign.lt-lg], [riFxFlexAlign.lt-xl], [riFxFlexAlign.gt-xs], [riFxFlexAlign.gt-sm],
  [riFxFlexAlign.gt-md], [riFxFlexAlign.gt-lg]
`;


@Directive()
export class FlexAlignDirective extends BaseDirective {

  protected override RI_DIRECTIVE_KEY = 'flex-align';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtilsService,
              styleBuilder: FlexAlignStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected override styleCache = flexAlignCache;
}

const flexAlignCache: Map<string, StyleDefinition> = new Map();

@Directive({selector, inputs})
export class RIDefaultFlexAlignDirective extends FlexAlignDirective {
  protected override inputs = inputs;
}

