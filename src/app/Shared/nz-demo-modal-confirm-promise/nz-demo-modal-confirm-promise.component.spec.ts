import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzDemoModalConfirmPromiseComponent } from './nz-demo-modal-confirm-promise.component';

describe('NzDemoModalConfirmPromiseComponent', () => {
  let component: NzDemoModalConfirmPromiseComponent;
  let fixture: ComponentFixture<NzDemoModalConfirmPromiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzDemoModalConfirmPromiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NzDemoModalConfirmPromiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
