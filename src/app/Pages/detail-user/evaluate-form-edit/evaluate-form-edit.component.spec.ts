import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateFormEditComponent } from './evaluate-form-edit.component';

describe('EvaluateFormEditComponent', () => {
  let component: EvaluateFormEditComponent;
  let fixture: ComponentFixture<EvaluateFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluateFormEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
