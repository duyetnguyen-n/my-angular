import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateFormAddComponent } from './evaluate-form-add.component';

describe('EvaluateFormAddComponent', () => {
  let component: EvaluateFormAddComponent;
  let fixture: ComponentFixture<EvaluateFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluateFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
