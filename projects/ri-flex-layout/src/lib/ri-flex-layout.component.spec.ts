import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiFlexLayoutComponent } from './ri-flex-layout.component';

describe('RiFlexLayoutComponent', () => {
  let component: RiFlexLayoutComponent;
  let fixture: ComponentFixture<RiFlexLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiFlexLayoutComponent]
    });
    fixture = TestBed.createComponent(RiFlexLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
