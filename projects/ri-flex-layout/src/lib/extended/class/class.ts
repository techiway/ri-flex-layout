// File: class.ts
import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  IterableDiffers,
  KeyValueDiffers,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import {NgClass} from '@angular/common';
import {BaseDirective, StyleUtilsService, MediaMarshaller} from 'ri-flex-layout/src/lib/core';

@Directive()
export class ClassDirective extends BaseDirective implements DoCheck {

  protected override RI_DIRECTIVE_KEY = 'ngClass';

  @Input('class')
  set klass(val: string) {
    this.ngClassInstance.klass = val;
    this.setValue(val, '');
  }

  constructor(elementRef: ElementRef,
              styler: StyleUtilsService,
              marshal: MediaMarshaller,
              iterableDiffers: IterableDiffers,
              keyValueDiffers: KeyValueDiffers,
              renderer2: Renderer2,
              @Optional() @Self() protected readonly ngClassInstance: NgClass) {
    super(elementRef, null!, styler, marshal);
    if (!this.ngClassInstance) {
      this.ngClassInstance = new NgClass(iterableDiffers, keyValueDiffers, elementRef, renderer2);
    }
    this.init();
    this.setValue('', '');
  }

  protected override updateWithValue(value: any) {
    this.ngClassInstance.ngClass = value;
    this.ngClassInstance.ngDoCheck();
  }

  ngDoCheck() {
    this.ngClassInstance.ngDoCheck();
  }
}

const inputs = [
  'ngClass', 'ngClass.xs', 'ngClass.sm', 'ngClass.md', 'ngClass.lg', 'ngClass.xl',
  'ngClass.lt-sm', 'ngClass.lt-md', 'ngClass.lt-lg', 'ngClass.lt-xl',
  'ngClass.gt-xs', 'ngClass.gt-sm', 'ngClass.gt-md', 'ngClass.gt-lg'
];

const selector = `
  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
`;


@Directive({selector, inputs})
export class RIDefaultClassDirective extends ClassDirective {
  protected override inputs = inputs;
}
