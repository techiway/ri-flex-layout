import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BROWSER_PROVIDER } from './browser-provider';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [], 
  providers: [BROWSER_PROVIDER]
})
export class CoreModule { }
