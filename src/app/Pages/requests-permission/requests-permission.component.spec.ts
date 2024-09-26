import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPermissionComponent } from './requests-permission.component';

describe('RequestsPermissionComponent', () => {
  let component: RequestsPermissionComponent;
  let fixture: ComponentFixture<RequestsPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
