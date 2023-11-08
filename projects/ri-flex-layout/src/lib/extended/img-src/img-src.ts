
import {Directive, ElementRef, Inject, PLATFORM_ID, Injectable, Input} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  MediaMarshaller,
  BaseDirective,
  SERVER_TOKEN,
  StyleGenerator,
  StyleDefinition,
  StyleUtilsService,
} from 'ri-flex-layout/src/lib/core';

@Injectable({providedIn: 'root'})
export class ImgSrcStyleBuilder extends StyleGenerator {
  buildStyles(url: string) {
    return {'content': url ? `url(${url})` : ''};
  }
}

@Directive()
export class ImgSrcDirective extends BaseDirective {
  protected override RI_DIRECTIVE_KEY = 'img-src';
  protected defaultSrc = '';

  @Input('src')
  set src(val: string) {
    this.defaultSrc = val;
    this.setValue(this.defaultSrc, '');
  }

  constructor(elementRef: ElementRef,
              styleBuilder: ImgSrcStyleBuilder,
              styler: StyleUtilsService,
              marshal: MediaMarshaller,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Inject(SERVER_TOKEN) protected serverModuleLoaded: boolean) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
    this.setValue(this.nativeElement.getAttribute('src') || '', '');
    if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
      this.nativeElement.setAttribute('src', '');
    }
  }


  protected override updateWithValue(value?: string) {
    const url = value || this.defaultSrc;
    if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
      this.addStyles(url);
    } else {
      this.nativeElement.setAttribute('src', url);
    }
  }

  protected override styleCache = imgSrcCache;
}

const imgSrcCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'src.xs', 'src.sm', 'src.md', 'src.lg', 'src.xl',
  'src.lt-sm', 'src.lt-md', 'src.lt-lg', 'src.lt-xl',
  'src.gt-xs', 'src.gt-sm', 'src.gt-md', 'src.gt-lg'
];

const selector = `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`;

@Directive({selector, inputs})
export class RIDefaultImgSrcDirective extends ImgSrcDirective {
  protected override inputs = inputs;
}
